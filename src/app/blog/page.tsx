import type { Metadata } from "next";
import { getAllBlogPosts, getAllCategories, getAllTags } from "@/lib/content";
import { BlogContent } from "@/site/components/BlogContent";

export const metadata: Metadata = {
  title: "Blog",
  description: "Long-form notes on product engineering, security, and motion UX.",
};

export default async function BlogPage() {
  const [posts, tags, categories] = await Promise.all([
    getAllBlogPosts(),
    getAllTags(),
    getAllCategories(),
  ]);

  const serializedPosts = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    date: p.date,
    tags: p.tags,
    category: p.category,
    featured: p.featured,
    readingTimeMinutes: p.readingTimeMinutes,
    content: p.content,
  }));

  return (
    <section className="site-container section page-hero">
      <p className="eyebrow">Blog</p>
      <h1 className="page-title">Writer-friendly technical notes.</h1>
      <p className="page-lead">
        Posts are authored in Markdown and statically rendered for speed, clarity,
        and safety.
      </p>

      <BlogContent
        posts={serializedPosts}
        tags={tags}
        categories={categories}
      />
    </section>
  );
}
