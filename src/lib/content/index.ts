import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { estimateReadingTime, extractHeadings, renderMarkdown } from "@/lib/content/markdown";
import type { BlogPost, ProjectEntry, ProjectLinkSet } from "@/lib/content/types";
import { createServerClient } from "@/lib/supabase/server";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const PROJECT_DIR = path.join(process.cwd(), "content", "projects");

// ─── Supabase → BlogPost adapter ───

interface SupabasePostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_mdx: string;
  tags: string[];
  is_published: boolean;
  reading_time_minutes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories: { name: string } | null;
}

async function rowToBlogPost(row: SupabasePostRow): Promise<BlogPost> {
  const markdown = row.content_mdx || "";
  const html = await renderMarkdown(markdown);

  return {
    slug: row.slug,
    title: row.title,
    summary: row.excerpt || "",
    date: row.published_at || row.created_at,
    updated: row.updated_at,
    tags: row.tags ?? [],
    category: row.categories?.name || "General",
    featured: false,
    readingTimeMinutes: row.reading_time_minutes || estimateReadingTime(markdown),
    content: markdown,
    html,
    headings: extractHeadings(markdown),
  };
}

// ─── Local Markdown fallback (when Supabase is unavailable) ───

const BlogFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  date: z.string().min(1),
  updated: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().default("General"),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});

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

async function parseBlogFile(filename: string): Promise<BlogPost | null> {
  const fullPath = path.join(BLOG_DIR, filename);
  const source = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(source);
  const parsed = BlogFrontmatterSchema.safeParse(data);
  if (!parsed.success || parsed.data.draft) return null;

  const slug = slugFromFilename(filename);
  const html = await renderMarkdown(content);

  return {
    slug,
    title: parsed.data.title,
    summary: parsed.data.summary,
    date: parsed.data.date,
    updated: parsed.data.updated,
    tags: parsed.data.tags,
    category: parsed.data.category,
    featured: parsed.data.featured,
    readingTimeMinutes: estimateReadingTime(content),
    content,
    html,
    headings: extractHeadings(content),
  };
}

async function getLocalBlogPosts(): Promise<BlogPost[]> {
  const files = readDirectoryFiles(BLOG_DIR);
  const posts = (await Promise.all(files.map(parseBlogFile))).filter(
    (p): p is BlogPost => p !== null
  );
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ─── Blog (Supabase primary, local fallback) ───

async function fetchSupabasePosts(): Promise<BlogPost[] | null> {
  try {
    const supabase = createServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*, categories(name)")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error || !data) {
      console.warn("[blog] Supabase fetch failed:", error?.message);
      return null;
    }

    const rows: SupabasePostRow[] = data;
    return Promise.all(rows.map((row) => rowToBlogPost(row)));
  } catch (err) {
    console.warn("[blog] Supabase fetch threw:", err instanceof Error ? err.message : err);
    return null;
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const supabasePosts = await fetchSupabasePosts();
  if (supabasePosts !== null && supabasePosts.length > 0) return supabasePosts;
  return getLocalBlogPosts();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, categories(name)")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (!error && data) {
        const row: SupabasePostRow = data;
        return rowToBlogPost(row);
      }
    }
  } catch (err) {
    console.warn("[blog] Post fetch threw:", err instanceof Error ? err.message : err);
  }

  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(BLOG_DIR, filename))) return null;
  return parseBlogFile(filename);
}

export async function getLatestPosts(limit = 3): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllBlogPosts();
  return [...new Set(posts.flatMap((p) => p.tags))].sort((a, b) => a.localeCompare(b));
}

export async function getAllCategories(): Promise<string[]> {
  try {
    const supabase = createServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("categories")
        .select("name")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((row: { name: string }) => row.name);
      }
    }
  } catch (err) {
    console.warn("[blog] Categories fetch threw:", err instanceof Error ? err.message : err);
  }

  const posts = await getAllBlogPosts();
  return [...new Set(posts.map((p) => p.category))].sort((a, b) => a.localeCompare(b));
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  const normalized = tag.toLowerCase();
  return posts.filter((p) => p.tags.some((t) => t.toLowerCase() === normalized));
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  const normalized = category.toLowerCase();
  return posts.filter((p) => p.category.toLowerCase() === normalized);
}

// ─── Projects (filesystem only) ───

const ProjectLinkSchema = z
  .object({
    demo: z.string().url().optional(),
    repo: z.string().url().optional(),
    caseStudy: z.string().url().optional(),
  })
  .default({});

const ProjectFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  role: z.string().min(1),
  timeline: z.string().min(1),
  featured: z.boolean().default(false),
  order: z.number().int().default(999),
  stack: z.array(z.string()).default([]),
  impact: z.array(z.string()).default([]),
  links: ProjectLinkSchema,
});

async function parseProjectFile(filename: string): Promise<ProjectEntry | null> {
  const fullPath = path.join(PROJECT_DIR, filename);
  const source = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(source);
  const parsed = ProjectFrontmatterSchema.safeParse(data);
  if (!parsed.success) return null;

  const slug = slugFromFilename(filename);
  const html = await renderMarkdown(content);
  const links = parsed.data.links as ProjectLinkSet;

  return {
    slug,
    title: parsed.data.title,
    summary: parsed.data.summary,
    role: parsed.data.role,
    timeline: parsed.data.timeline,
    featured: parsed.data.featured,
    order: parsed.data.order,
    stack: parsed.data.stack,
    impact: parsed.data.impact,
    links,
    content,
    html,
    headings: extractHeadings(content),
  };
}

export async function getAllProjects(): Promise<ProjectEntry[]> {
  const files = readDirectoryFiles(PROJECT_DIR);
  const projects = (await Promise.all(files.map(parseProjectFile))).filter(
    (p): p is ProjectEntry => p !== null
  );
  return projects.sort((a, b) => (a.order !== b.order ? a.order - b.order : a.title.localeCompare(b.title)));
}

export async function getProjectBySlug(slug: string): Promise<ProjectEntry | null> {
  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(PROJECT_DIR, filename))) return null;
  return parseProjectFile(filename);
}

export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
  const projects = await getAllProjects();
  return projects.filter((p) => p.featured).slice(0, 3);
}
