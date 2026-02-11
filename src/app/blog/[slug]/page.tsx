import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { MDXRenderer } from "@/components/blog/MDXRenderer";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { DeepLinkAnchors } from "@/components/blog/DeepLinkAnchors";
import { TableOfContents } from "@/components/blog/TableOfContents";
import Link from "next/link";
import type { BlogPost } from "@/lib/supabase/types";

// Required for static export: only render paths from generateStaticParams
export const dynamicParams = false;

/**
 * Pre-render all published blog post slugs at build time.
 * Returns empty array when no posts exist in the database.
 *
 * NOTE: This may fail on Windows with non-ASCII project path characters
 * (e.g., Korean `바탕 화면`). Works correctly on Linux (GitHub Actions).
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) return [];

        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
            .from("blog_posts")
            .select("slug")
            .eq("is_published", true);

        if (error || !data) return [];
        return data.map((post: { slug: string }) => ({ slug: post.slug }));
    } catch {
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    try {
        const supabase = createServerClient();
        const { data } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("slug", slug)
            .eq("is_published", true)
            .single();

        if (data) {
            const post = data as BlogPost;
            return {
                title: post.title,
                description: post.excerpt || `Read ${post.title} on Nexus-PR`,
            };
        }
    } catch {
        // Fall through to default
    }

    return { title: "Post Not Found" };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    let post: BlogPost | null = null;

    try {
        const supabase = createServerClient();
        const { data } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("slug", slug)
            .eq("is_published", true)
            .single();

        if (data) {
            post = data as BlogPost;
        }
    } catch {
        // Fall through
    }

    if (!post) {
        notFound();
    }

    return (
        <>
            <ReadingProgressBar />

            <main className="mx-auto max-w-6xl px-6 pt-28 pb-12">
                {/* Back link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors mb-8"
                >
                    ← Back to Blog
                </Link>

                {/* Header */}
                <header className="mb-12">
                    {post.tags.length > 0 && (
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 text-xs rounded-full bg-accent-muted text-accent font-medium uppercase tracking-wider"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-lg text-text-secondary mb-6">{post.excerpt}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-text-muted">
                        <span>{post.reading_time_minutes} min read</span>
                        {post.published_at && (
                            <>
                                <span>·</span>
                                <time dateTime={post.published_at}>
                                    {new Date(post.published_at).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </time>
                            </>
                        )}
                    </div>
                </header>

                {/* Cover Image — Next.js Image with unoptimized for static export */}
                {post.cover_image_url && (
                    <div className="relative w-full aspect-[2/1] mb-12 rounded-2xl overflow-hidden glass-card">
                        <Image
                            src={post.cover_image_url}
                            alt={post.title}
                            fill
                            unoptimized
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Content + TOC */}
                <div className="flex gap-12">
                    <article className="flex-1 min-w-0">
                        <MDXRenderer content={post.content_mdx} />
                        <DeepLinkAnchors />
                    </article>
                    <TableOfContents />
                </div>
            </main>
        </>
    );
}
