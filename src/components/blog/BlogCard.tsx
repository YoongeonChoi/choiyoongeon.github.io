import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/supabase/types";

interface BlogCardProps {
    post: BlogPost;
}

/**
 * Blog post card with frosted neumorphism styling.
 * Shows cover image, category, title, excerpt, and metadata.
 * Uses Next.js Image with unoptimized for static export compatibility.
 */
export function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`} className="group block">
            <article className="glass-card overflow-hidden h-full flex flex-col">
                {/* Cover Image */}
                {post.cover_image_url && (
                    <div className="relative h-48 overflow-hidden">
                        <Image
                            src={post.cover_image_url}
                            alt={post.title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                    </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="flex gap-2 mb-3 flex-wrap">
                            {post.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 text-[10px] rounded-full bg-accent-muted text-accent font-medium uppercase tracking-wider"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-2 mb-2">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-1">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-text-muted mt-auto pt-4 border-t border-border-default">
                        <span>
                            {post.reading_time_minutes} min read
                        </span>
                        {post.published_at && (
                            <time dateTime={post.published_at}>
                                {new Date(post.published_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </time>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}
