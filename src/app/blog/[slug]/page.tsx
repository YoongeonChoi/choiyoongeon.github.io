import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContributionGrass } from "@/components/github/ContributionGrass";
import { MDXRenderer } from "@/components/blog/MDXRenderer";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { DeepLinkAnchors } from "@/components/blog/DeepLinkAnchors";
import { TableOfContents } from "@/components/blog/TableOfContents";
import type { BlogPost } from "@/lib/supabase/types";

type BlogRouteParams = { slug: string };

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

const FALLBACK_SLUG = "offline";
const BLOG_SELECT_FIELDS = [
    "id",
    "author_id",
    "category_id",
    "title",
    "slug",
    "excerpt",
    "content_mdx",
    "cover_image_url",
    "tags",
    "is_published",
    "reading_time_minutes",
    "published_at",
    "created_at",
    "updated_at",
].join(",");

const FALLBACK_POST: BlogPost = {
    id: "00000000-0000-0000-0000-000000000000",
    author_id: "00000000-0000-0000-0000-000000000000",
    category_id: null,
    title: "Blog is preparing content",
    slug: FALLBACK_SLUG,
    excerpt:
        "The blog is currently in offline-safe mode. Publish at least one post to replace this fallback page.",
    content_mdx: [
        "## Offline-safe static page",
        "",
        "This page is generated as a reliable fallback for static export.",
        "Once Supabase contains published posts, real post routes will be generated automatically.",
    ].join("\n"),
    cover_image_url: null,
    tags: ["status", "fallback"],
    is_published: true,
    reading_time_minutes: 1,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

function getSupabaseRestConfig() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    const apiKey = serviceRoleKey || anonKey;

    if (!supabaseUrl || !apiKey) {
        return null;
    }

    return {
        endpoint: `${supabaseUrl.replace(/\/$/, "")}/rest/v1`,
        apiKey,
    };
}

async function fetchFromSupabase<T>(pathWithQuery: string): Promise<T | null> {
    const config = getSupabaseRestConfig();
    if (!config) {
        return null;
    }

    try {
        const response = await fetch(`${config.endpoint}/${pathWithQuery}`, {
            headers: {
                apikey: config.apiKey,
                Authorization: `Bearer ${config.apiKey}`,
                Accept: "application/json",
            },
            cache: "force-cache",
        });

        if (!response.ok) {
            return null;
        }

        return (await response.json()) as T;
    } catch {
        return null;
    }
}

async function fetchPublishedSlugs(): Promise<string[]> {
    const rows = await fetchFromSupabase<Array<{ slug: string }>>(
        "blog_posts?select=slug&is_published=eq.true&order=published_at.desc.nullslast"
    );

    if (!rows || rows.length === 0) {
        return [];
    }

    return rows
        .map((row) => row.slug)
        .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);
}

async function fetchPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
    if (slug === FALLBACK_SLUG) {
        return FALLBACK_POST;
    }

    const encodedSlug = encodeURIComponent(slug);
    const rows = await fetchFromSupabase<BlogPost[]>(
        `blog_posts?select=${BLOG_SELECT_FIELDS}&slug=eq.${encodedSlug}&is_published=eq.true&limit=1`
    );

    if (!rows || rows.length === 0) {
        return null;
    }

    return rows[0] ?? null;
}

export async function generateStaticParams(): Promise<BlogRouteParams[]> {
    const slugs = await fetchPublishedSlugs();
    if (slugs.length === 0) {
        return [{ slug: FALLBACK_SLUG }];
    }
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
    params
}: {
    params: Promise<BlogRouteParams>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await fetchPublishedPostBySlug(slug);

    if (!post) {
        return { title: "Post Not Found", description: "This post is not available." };
    }

    return {
        title: post.title,
        description: post.excerpt || `Read ${post.title} on Nexus-PR`,
    };
}

export default async function BlogPostPage({
    params
}: {
    params: Promise<BlogRouteParams>;
}) {
    const { slug } = await params;
    const post = await fetchPublishedPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const githubUsername = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "choiyoongeon";

    return (
        <>
            <ReadingProgressBar />

            <main className="site-container pt-28 pb-16">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors mb-8"
                >
                    ← Back to Blog
                </Link>

                <header className="mb-12">
                    {Array.isArray(post.tags) && post.tags.length > 0 && (
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

                    <h1 className="text-[clamp(1.9rem,4vw,3.3rem)] font-semibold tracking-[-0.04em] text-text-primary mb-4">
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

                <div className="flex gap-10">
                    <article className="flex-1 min-w-0">
                        <MDXRenderer content={post.content_mdx} />
                        <DeepLinkAnchors />
                    </article>
                    <TableOfContents />
                </div>

                <section className="mt-16 glass-card p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-2">
                        Interactive 3D GitHub Grass
                    </h2>
                    <p className="text-sm text-text-secondary mb-5">
                        Explore my contribution history in frosted 2D and 3D view.
                    </p>
                    <ContributionGrass username={githubUsername} />
                </section>
            </main>
        </>
    );
}
