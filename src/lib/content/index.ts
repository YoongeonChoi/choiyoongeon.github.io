import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { estimateReadingTime, extractHeadings, renderMarkdown } from "@/lib/content/markdown";
import type { BlogPost, ProjectEntry, ProjectLinkSet } from "@/lib/content/types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const PROJECT_DIR = path.join(process.cwd(), "content", "projects");

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

function readDirectoryFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.(md|mdx)$/u, "");
}

async function parseBlogFile(filename: string): Promise<BlogPost | null> {
  const fullPath = path.join(BLOG_DIR, filename);
  const source = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(source);
  const parsed = BlogFrontmatterSchema.safeParse(data);

  if (!parsed.success || parsed.data.draft) {
    return null;
  }

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

async function parseProjectFile(filename: string): Promise<ProjectEntry | null> {
  const fullPath = path.join(PROJECT_DIR, filename);
  const source = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(source);
  const parsed = ProjectFrontmatterSchema.safeParse(data);

  if (!parsed.success) {
    return null;
  }

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

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const files = readDirectoryFiles(BLOG_DIR);
  const posts = (await Promise.all(files.map(parseBlogFile))).filter(
    (post): post is BlogPost => post !== null
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(BLOG_DIR, filename))) {
    return null;
  }
  return parseBlogFile(filename);
}

export async function getAllProjects(): Promise<ProjectEntry[]> {
  const files = readDirectoryFiles(PROJECT_DIR);
  const projects = (await Promise.all(files.map(parseProjectFile))).filter(
    (project): project is ProjectEntry => project !== null
  );

  return projects.sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.title.localeCompare(b.title);
  });
}

export async function getProjectBySlug(slug: string): Promise<ProjectEntry | null> {
  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(PROJECT_DIR, filename))) {
    return null;
  }
  return parseProjectFile(filename);
}

export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
  const projects = await getAllProjects();
  return projects.filter((project) => project.featured).slice(0, 3);
}

export async function getLatestPosts(limit = 3): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllBlogPosts();
  return [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllBlogPosts();
  return [...new Set(posts.map((post) => post.category))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  const normalized = tag.toLowerCase();
  return posts.filter((post) =>
    post.tags.some((value) => value.toLowerCase() === normalized)
  );
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  const normalized = category.toLowerCase();
  return posts.filter((post) => post.category.toLowerCase() === normalized);
}
