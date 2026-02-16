import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories, getPostsByCategory } from "@/lib/content";
import { PostCard } from "@/site/components/PostCard";

type Params = { category: string };

export async function generateStaticParams(): Promise<Params[]> {
  const categories = await getAllCategories();
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `Category: ${category}`,
    description: `Blog posts in ${category}`,
  };
}

export default async function BlogCategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const posts = await getPostsByCategory(category);

  return (
    <section className="site-container section page-hero">
      <Link href="/blog" className="text-link" prefetch={false}>
        ← Back to blog
      </Link>
      <p className="eyebrow" style={{ marginTop: "1rem" }}>
        Category
      </p>
      <h1 className="page-title">{category}</h1>

      <div className="content-grid section">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
