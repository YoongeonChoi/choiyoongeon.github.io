"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { springs, scrollFade } from "@/lib/motion/config";

import type { Post } from "@/lib/supabase/types";

export function BlogPostClient({ post }: { post: Post }) {
    const date = post.published_at || post.created_at;
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <>
            <Header />

            <main id="main-content" className="min-h-screen pt-24 pb-16">
                <article className="max-w-3xl mx-auto px-6">
                    {/* Back Link */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={springs.smooth}
                        className="mb-8"
                    >
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Blog
                        </Link>
                    </motion.div>

                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={springs.smooth}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 text-sm font-medium rounded-full bg-accent-primary/10 text-accent-primary">
                                {post.category}
                            </span>
                            <span className="text-text-muted">{post.read_time_minutes} min read</span>
                        </div>

                        <h1 className="heading-display text-3xl md:text-4xl lg:text-5xl mb-6">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4 text-text-secondary">
                            <span>Yoongeon Choi</span>
                            <span>•</span>
                            <time dateTime={date}>{formattedDate}</time>
                        </div>
                    </motion.header>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...springs.smooth, delay: 0.1 }}
                        className="prose prose-invert prose-lg max-w-none"
                    >
                        <div
                            className="
                [&>h2]:heading-display [&>h2]:text-2xl [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:text-text-primary
                [&>h3]:font-semibold [&>h3]:text-xl [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-text-primary
                [&>p]:text-text-secondary [&>p]:mb-4 [&>p]:leading-relaxed
              "
                            dangerouslySetInnerHTML={{
                                __html: post.content
                                    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                                    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                                    .replace(/\n\n/g, '</p><p>')
                            }}
                        />
                    </motion.div>

                    {/* Tags */}
                    <motion.div
                        {...scrollFade}
                        className="mt-12 pt-8 border-t border-border-subtle"
                    >
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/blog/tag/${tag.toLowerCase()}`}
                                    className="px-3 py-1.5 text-sm rounded-full bg-surface-secondary text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 transition-colors"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Author Card */}
                    <motion.div
                        {...scrollFade}
                        className="mt-12 p-6 rounded-2xl bg-surface-secondary border border-border-subtle"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary" />
                            <div>
                                <h3 className="font-semibold text-text-primary">Yoongeon Choi</h3>
                                <p className="text-text-muted text-sm">Full-Stack Developer & Designer</p>
                            </div>
                        </div>
                    </motion.div>
                </article>
            </main>
        </>
    );
}
