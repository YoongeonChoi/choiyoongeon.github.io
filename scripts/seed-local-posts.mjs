/**
 * seed-local-posts.mjs
 * Seeds the 4 existing local markdown blog posts into Supabase.
 * Usage: node scripts/seed-local-posts.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envPath = resolve(__dirname, "..", ".env.local");
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx < 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch { /* rely on existing env */ }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function parseFrontmatter(source) {
  const normalized = source.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const meta = {};
  let currentKey = null;
  let inArray = false;
  const arrayItems = [];

  for (const line of match[1].split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (inArray && trimmed.startsWith("- ")) {
      arrayItems.push(trimmed.slice(2).replace(/^["']|["']$/g, ""));
      continue;
    } else if (inArray) {
      meta[currentKey] = arrayItems.slice();
      arrayItems.length = 0;
      inArray = false;
    }

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx < 0) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    let val = trimmed.slice(colonIdx + 1).trim();

    if (val === "") {
      currentKey = key;
      inArray = true;
      continue;
    }

    val = val.replace(/^["']|["']$/g, "");
    if (val === "true") val = true;
    else if (val === "false") val = false;

    meta[key] = val;
  }

  if (inArray) {
    meta[currentKey] = arrayItems.slice();
  }

  return { meta, content: match[2].trim() };
}

function estimateReadingTime(md) {
  const words = md.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

async function main() {
  console.log("=== Seed Local Markdown Posts ===\n");

  const { data: profiles } = await supabase.from("profiles").select("id").limit(1);
  if (!profiles?.length) { console.error("No profiles"); process.exit(1); }
  const authorId = profiles[0].id;

  const { data: cats } = await supabase.from("categories").select("id, name");
  const catMap = {};
  for (const c of cats || []) catMap[c.name] = c.id;

  const blogDir = resolve(__dirname, "..", "content", "blog");
  const files = readdirSync(blogDir).filter(f => f.endsWith(".md") && !f.startsWith("_"));

  let inserted = 0;
  let skipped = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const source = readFileSync(resolve(blogDir, file), "utf8");
    const parsed = parseFrontmatter(source);
    if (!parsed) { console.log(`  skip: ${file} (no frontmatter)`); skipped++; continue; }

    const { meta, content } = parsed;
    if (meta.draft === true) { skipped++; continue; }

    const { data: existing } = await supabase
      .from("blog_posts").select("id").eq("slug", slug).maybeSingle();
    if (existing) { console.log(`  exists: ${slug}`); skipped++; continue; }

    const categoryName = meta.category || "General";
    let categoryId = catMap[categoryName] || null;

    if (!categoryId && categoryName !== "General") {
      const catSlug = categoryName.toLowerCase().replace(/\s+/g, "-");
      const { data: newCat } = await supabase
        .from("categories")
        .upsert({ name: categoryName, slug: catSlug, sort_order: 90 }, { onConflict: "name" })
        .select("id")
        .single();
      if (newCat) {
        categoryId = newCat.id;
        catMap[categoryName] = newCat.id;
      }
    }

    const tags = Array.isArray(meta.tags) ? meta.tags : [];

    const { error } = await supabase.from("blog_posts").insert({
      author_id: authorId,
      title: meta.title,
      slug,
      excerpt: meta.summary || null,
      content_mdx: content,
      tags,
      category_id: categoryId,
      is_published: true,
      reading_time_minutes: estimateReadingTime(content),
      published_at: meta.date ? new Date(meta.date + "T09:00:00Z").toISOString() : new Date().toISOString(),
    });

    if (error) {
      console.error(`  FAIL: ${slug}: ${error.message}`);
    } else {
      console.log(`  OK: ${slug} [${categoryName}] tags=[${tags.join(", ")}]`);
      inserted++;
    }
  }

  console.log(`\nDone: ${inserted} inserted, ${skipped} skipped`);
}

main().catch(err => { console.error(err); process.exit(1); });
