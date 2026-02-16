import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/content";
import { MarkdownArticle } from "@/site/components/MarkdownArticle";
import { TableOfContents } from "@/site/components/TableOfContents";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="site-container section page-hero">
      <Link href="/blog" className="text-link" prefetch={false}>
        ← Back to blog
      </Link>

      <p className="eyebrow" style={{ marginTop: "1rem" }}>
        {post.category}
      </p>
      <h1 className="page-title">{post.title}</h1>
      <p className="page-lead">{post.summary}</p>
      <p className="meta-row" style={{ maxWidth: "420px", marginTop: "1rem" }}>
        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US")}</time>
        <span>{post.readingTimeMinutes} min read</span>
      </p>

      <div className="blog-layout">
        <div>
          <MarkdownArticle html={post.html} />
        </div>
        <TableOfContents headings={post.headings} />
      </div>
    </article>
  );
}
