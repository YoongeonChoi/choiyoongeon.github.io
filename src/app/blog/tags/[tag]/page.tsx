import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/content";
import { PostCard } from "@/site/components/PostCard";

type Params = { tag: string };

export async function generateStaticParams(): Promise<Params[]> {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Tag: ${tag}`,
    description: `Blog posts tagged with ${tag}`,
  };
}

export default async function BlogTagPage({ params }: { params: Promise<Params> }) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  return (
    <section className="site-container section page-hero">
      <Link href="/blog" className="text-link" prefetch={false}>
        ← Back to blog
      </Link>
      <p className="eyebrow" style={{ marginTop: "1rem" }}>
        Tag archive
      </p>
      <h1 className="page-title">#{tag}</h1>

      <div className="content-grid section">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
