import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/lib/supabase/types";

export const metadata: Metadata = {
    title: "Blog",
    description: "Technical articles, thoughts, and deep dives into modern web development.",
};
export const dynamic = "force-static";
export const revalidate = false;

/**
 * Blog list page — Static (SSG).
 * Fetches all published posts at build time.
 */
export default async function BlogPage() {
    let posts: BlogPost[] = [];
    const supabase = createServerClient();

    if (supabase) {
        try {
            const { data } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("is_published", true)
                .order("published_at", { ascending: false });

            if (data) {
                posts = data as BlogPost[];
            }
        } catch (error) {
            console.warn("Failed to fetch posts at build time:", error);
        }
    }

    return (
        <main className="site-container pt-28 pb-16">
            <section className="mb-12">
                <h1 className="text-[clamp(2rem,5vw,4rem)] font-semibold tracking-[-0.04em] text-text-primary mb-4">
                    Blog
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl">
                    Technical articles, thoughts, and deep dives.
                </p>
            </section>

            {posts.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <div className="text-4xl mb-4">📝</div>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">
                        No posts yet
                    </h2>
                    <p className="text-sm text-text-secondary">
                        Check back soon for new content!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {posts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </main>
    );
}
