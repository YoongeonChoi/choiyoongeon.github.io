"use client";

import Link from "next/link";
import type { BlogPost } from "@/lib/supabase/types";

interface LatestPostsCardProps {
    posts: BlogPost[];
}

export function LatestPostsCard({ posts }: LatestPostsCardProps) {
    if (posts.length === 0) {
        return (
            <div>
                <h3 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">
                    Latest Posts
                </h3>
                <p className="text-sm text-text-muted italic">
                    No posts yet. Check back soon!
                </p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">
                Latest Posts
            </h3>
            <div className="space-y-3">
                {posts.slice(0, 3).map((post) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group block p-3 rounded-xl hover:bg-accent-muted transition-all duration-300"
                    >
                        <h4 className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors line-clamp-1">
                            {post.title}
                        </h4>
                        <p className="text-xs text-text-muted mt-1">
                            {post.reading_time_minutes} min read
                            {post.published_at &&
                                ` · ${new Date(post.published_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })}`}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
