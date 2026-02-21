import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const PROJECT_DIR = path.join(process.cwd(), "content", "projects");

function readDirectoryFiles(directory: string): string[] {
    if (!fs.existsSync(directory)) return [];
    return fs
        .readdirSync(directory)
        .filter((f) => !f.startsWith("_"))
        .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

function slugFromFilename(filename: string): string {
    return filename.replace(/\.(md|mdx)$/u, "");
}

function estimateReadingTime(content: string): number {
    const wpm = 225;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
}

async function uploadCategory(name: string): Promise<string | null> {
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // Upsert the category
    const { data, error } = await supabase
        .from("categories")
        .upsert({ name, slug }, { onConflict: "slug" })
        .select("id")
        .single();

    if (error) {
        console.error(`Error upserting category ${name}:`, error.message);
        return null;
    }
    return data.id;
}

async function uploadBlogPosts() {
    console.log("Uploading Blog Posts...");
    const files = readDirectoryFiles(BLOG_DIR);

    // We need an author ID. Let's get the first profile or create a default one.
    const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);

    if (profileError || !profiles || profiles.length === 0) {
        console.error("No author profile found in Supabase. Please create a user/profile first.");
        return;
    }
    const authorId = profiles[0].id;

    for (const file of files) {
        const fullPath = path.join(BLOG_DIR, file);
        const source = fs.readFileSync(fullPath, "utf8");
        const { content, data: frontmatter } = matter(source);

        if (frontmatter.draft) {
            console.log(`Skipping draft: ${file}`);
            continue;
        }

        const slug = slugFromFilename(file);
        const categoryName = frontmatter.category || "General";
        const categoryId = await uploadCategory(categoryName);

        const postData = {
            author_id: authorId,
            category_id: categoryId,
            title: frontmatter.title,
            slug,
            excerpt: frontmatter.summary || "",
            content_mdx: content,
            tags: frontmatter.tags || [],
            is_published: true,
            reading_time_minutes: estimateReadingTime(content),
            published_at: new Date(frontmatter.date).toISOString(),
        };

        const { error } = await supabase
            .from("blog_posts")
            .upsert(postData, { onConflict: "slug" });

        if (error) {
            console.error(`Failed to upload blog post ${slug}:`, error.message);
        } else {
            console.log(`Successfully uploaded blog post: ${slug}`);
        }
    }
}

async function uploadProjects() {
    console.log("\nUploading Projects...");
    const files = readDirectoryFiles(PROJECT_DIR);

    for (const file of files) {
        const fullPath = path.join(PROJECT_DIR, file);
        const source = fs.readFileSync(fullPath, "utf8");
        const { content, data: frontmatter } = matter(source);

        const slug = slugFromFilename(file);

        const projectData = {
            slug,
            title: frontmatter.title,
            summary: frontmatter.summary,
            role: frontmatter.role,
            timeline: frontmatter.timeline,
            featured: frontmatter.featured || false,
            sort_order: frontmatter.order ?? 999,
            stack: frontmatter.stack || [],
            impact: frontmatter.impact || [],
            links: frontmatter.links || {},
            content_mdx: content,
        };

        const { error } = await supabase
            .from("projects")
            .upsert(projectData, { onConflict: "slug" });

        if (error) {
            console.error(`Failed to upload project ${slug}:`, error.message);
        } else {
            console.log(`Successfully uploaded project: ${slug}`);
        }
    }
}

async function main() {
    await uploadBlogPosts();
    await uploadProjects();
    console.log("\n✅ Content Sync Complete");
}

main().catch(console.error);
