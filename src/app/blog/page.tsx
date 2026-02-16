import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts, getAllCategories, getAllTags } from "@/lib/content";
import { PostCard } from "@/site/components/PostCard";

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

  return (
    <section className="site-container section page-hero">
      <p className="eyebrow">Blog</p>
      <h1 className="page-title">Writer-friendly technical notes.</h1>
      <p className="page-lead">
        Posts are authored in Markdown and statically rendered for speed, clarity,
        and safety.
      </p>

      <div className="filter-row" aria-label="Categories">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/blog/categories/${encodeURIComponent(category)}`}
            className="tag-link"
            prefetch={false}
          >
            {category}
          </Link>
        ))}
      </div>

      <div className="filter-row" aria-label="Tags">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tags/${encodeURIComponent(tag)}`}
            className="tag-link"
            prefetch={false}
          >
            #{tag}
          </Link>
        ))}
      </div>

      <div className="content-grid section">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
