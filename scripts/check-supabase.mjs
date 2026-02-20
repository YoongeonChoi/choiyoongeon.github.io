/**
 * check-supabase.mjs
 * Diagnoses Supabase project state: connection, tables, RLS, data counts, auth users.
 * Usage: node scripts/check-supabase.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
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

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error("FAIL: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let allOk = true;
function fail(msg) { console.error(`  FAIL: ${msg}`); allOk = false; }
function ok(msg) { console.log(`  OK: ${msg}`); }

async function main() {
  console.log("\n=== Supabase Diagnostics ===\n");
  console.log(`URL: ${URL}`);

  // 1. Connection test (a "table not found" error proves the API is reachable)
  console.log("\n[1] Connection");
  const { error: connErr } = await supabase.from("_dummy_ping").select("*").limit(0);
  if (!connErr || connErr.message?.includes("schema cache") || connErr.message?.includes("relation") || connErr.code?.startsWith("PGRST")) {
    ok("Connected to Supabase");
  } else {
    fail(`Connection error: ${connErr.message}`);
    process.exit(1);
  }

  // 2. Check tables exist
  console.log("\n[2] Tables");
  for (const table of ["profiles", "categories", "blog_posts"]) {
    const { error } = await supabase.from(table).select("*").limit(0);
    if (error) {
      fail(`Table "${table}" - ${error.message}`);
    } else {
      ok(`Table "${table}" exists`);
    }
  }

  // 3. Check RLS - use anon key client to test
  console.log("\n[3] RLS (testing with anon key)");
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (ANON_KEY) {
    const anonClient = createClient(URL, ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Anon should be able to SELECT published blog_posts (RLS policy: is_published = true)
    const { error: anonSelectErr } = await anonClient.from("blog_posts").select("id").limit(1);
    if (anonSelectErr) {
      fail(`Anon SELECT on blog_posts failed: ${anonSelectErr.message} (RLS might block or table missing)`);
    } else {
      ok("Anon can SELECT blog_posts (RLS allows published reads)");
    }

    // Anon should NOT be able to INSERT
    const { error: anonInsertErr } = await anonClient.from("blog_posts").insert({
      title: "__rls_test__", slug: "__rls_test__", content_mdx: "", author_id: "00000000-0000-0000-0000-000000000000"
    });
    if (anonInsertErr) {
      ok(`Anon INSERT blocked: ${anonInsertErr.code} (RLS working)`);
    } else {
      fail("Anon INSERT succeeded - RLS is NOT blocking writes!");
      await supabase.from("blog_posts").delete().eq("slug", "__rls_test__");
    }

    // Anon should be able to SELECT categories
    const { error: anonCatErr } = await anonClient.from("categories").select("id").limit(1);
    if (anonCatErr) {
      fail(`Anon SELECT on categories failed: ${anonCatErr.message}`);
    } else {
      ok("Anon can SELECT categories");
    }
  } else {
    fail("No ANON_KEY found - cannot test RLS");
  }

  // 4. Data counts
  console.log("\n[4] Data counts (via service role)");
  for (const table of ["profiles", "categories", "blog_posts"]) {
    const { data: rows, error } = await supabase.from(table).select("id");
    if (error) {
      fail(`Count ${table}: ${error.message}`);
    } else {
      const rowCount = rows?.length ?? 0;
      if (rowCount === 0) {
        console.log(`  WARN: "${table}" has 0 rows`);
      } else {
        ok(`"${table}" has ${rowCount} rows`);
      }
    }
  }

  // 5. Auth users
  console.log("\n[5] Auth users");
  const { data: authData, error: authErr } = await supabase.auth.admin.listUsers();
  if (authErr) {
    fail(`Cannot list auth users: ${authErr.message}`);
  } else {
    const count = authData?.users?.length ?? 0;
    if (count === 0) {
      fail("No auth users found - admin login will not work");
    } else {
      ok(`${count} auth user(s) found`);
      for (const u of authData.users) {
        console.log(`    - ${u.email} (id: ${u.id})`);
      }
    }
  }

  // 6. Published posts check
  console.log("\n[6] Published blog posts");
  const { data: published } = await supabase
    .from("blog_posts")
    .select("slug, title, is_published")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(5);

  if (published && published.length > 0) {
    ok(`${published.length} published post(s) found`);
    for (const p of published) {
      console.log(`    - [${p.slug}] ${p.title}`);
    }
  } else {
    console.log("  WARN: No published posts - blog will fall back to local markdown");
  }

  console.log("\n=== Summary ===");
  if (allOk) {
    console.log("All checks passed.\n");
  } else {
    console.log("Some checks FAILED. See above for details.\n");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
