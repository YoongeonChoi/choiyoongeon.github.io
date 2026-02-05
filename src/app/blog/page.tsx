"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { springs, staggerContainer, staggerItem } from "@/lib/motion/config";

// Sample blog posts (to be replaced with CMS data)
const blogPosts = [
    {
        slug: "building-next-gen-portfolio",
        title: "Building a Next-Gen Portfolio with Next.js 16 and WebGPU",
        excerpt: "A deep dive into creating a corporate-grade portfolio platform with cutting-edge technologies like Partial Prerendering, WebGPU graphics, and Passkey authentication.",
        category: "Development",
        tags: ["Next.js", "WebGPU", "TypeScript"],
        date: "2026-02-05",
        readTime: 12,
    },
    {
        slug: "spatial-minimalism-design",
        title: "Spatial Minimalism: The Evolution of Digital Design in 2026",
        excerpt: "Exploring the principles of Spatial Minimalism and how leading brands are adopting this design language for premium digital experiences.",
        category: "Design",
        tags: ["UI/UX", "Design Systems", "Trends"],
        date: "2026-01-28",
        readTime: 8,
    },
    {
        slug: "passkey-authentication-guide",
        title: "Implementing Passkey Authentication: A Complete Guide",
        excerpt: "Step-by-step guide to implementing WebAuthn/Passkey authentication in modern web applications for passwordless, phishing-resistant security.",
        category: "Security",
        tags: ["WebAuthn", "Security", "Authentication"],
        date: "2026-01-20",
        readTime: 15,
    },
    {
        slug: "framer-motion-animations",
        title: "Advanced Animation Patterns with Framer Motion",
        excerpt: "Master the art of creating physics-based animations, shared element transitions, and scroll-linked effects with Framer Motion.",
        category: "Development",
        tags: ["Animation", "React", "Framer Motion"],
        date: "2026-01-15",
        readTime: 10,
    },
    {
        slug: "tailwind-css-4-migration",
        title: "Migrating to Tailwind CSS 4: What You Need to Know",
        excerpt: "A comprehensive migration guide covering the new Oxide engine, CSS-first configuration, and breaking changes in Tailwind CSS 4.0.",
        category: "Development",
        tags: ["Tailwind CSS", "CSS", "Migration"],
        date: "2026-01-10",
        readTime: 7,
    },
];

const categories = ["All", "Development", "Design", "Security", "Career"];

export default function BlogPage() {
    return (
        <>
            <Header />

            <main id="main-content" className="min-h-screen pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={springs.smooth}
                        className="mb-12"
                    >
                        <h1 className="heading-display heading-lg mb-4">Blog</h1>
                        <p className="text-text-secondary text-lg max-w-2xl">
                            Thoughts on development, design, and building digital products.
                        </p>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Category Tabs */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ ...springs.smooth, delay: 0.1 }}
                                className="flex flex-wrap gap-2 mb-8"
                            >
                                {categories.map((category, index) => (
                                    <motion.button
                                        key={category}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${index === 0
                                                ? "bg-accent-primary text-surface-primary"
                                                : "bg-surface-secondary text-text-secondary hover:text-text-primary"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={springs.snappy}
                                    >
                                        {category}
                                    </motion.button>
                                ))}
                            </motion.div>

                            {/* Blog Posts Grid */}
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {blogPosts.map((post) => (
                                    <BlogCard key={post.slug} {...post} />
                                ))}
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <motion.aside
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ ...springs.smooth, delay: 0.2 }}
                            className="lg:w-80 space-y-6"
                        >
                            {/* Popular Tags */}
                            <div className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle">
                                <h3 className="font-display font-semibold text-text-primary mb-4">
                                    Popular Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {["React", "TypeScript", "Next.js", "Design", "CSS", "Animation", "Security"].map(
                                        (tag) => (
                                            <Link
                                                key={tag}
                                                href={`/blog/tag/${tag.toLowerCase()}`}
                                                className="px-3 py-1.5 text-sm rounded-full bg-surface-elevated text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 transition-colors"
                                            >
                                                #{tag}
                                            </Link>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle">
                                <h3 className="font-display font-semibold text-text-primary mb-2">
                                    Newsletter
                                </h3>
                                <p className="text-sm text-text-muted mb-4">
                                    Get notified about new posts and updates.
                                </p>
                                <form className="space-y-3">
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                                    />
                                    <motion.button
                                        type="submit"
                                        className="w-full px-4 py-2.5 rounded-xl bg-accent-primary text-surface-primary font-medium hover:glow-accent transition-all"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={springs.snappy}
                                    >
                                        Subscribe
                                    </motion.button>
                                </form>
                            </div>
                        </motion.aside>
                    </div>
                </div>
            </main>
        </>
    );
}

interface BlogCardProps {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    tags: string[];
    date: string;
    readTime: number;
}

function BlogCard({ slug, title, excerpt, category, tags, date, readTime }: BlogCardProps) {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <motion.article
            variants={staggerItem}
            whileHover={{ y: -2 }}
            transition={springs.snappy}
        >
            <Link
                href={`/blog/${slug}`}
                className="block p-6 rounded-2xl bg-surface-secondary border border-border-subtle hover:border-border-emphasis transition-colors group"
            >
                <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent-primary/10 text-accent-primary">
                        {category}
                    </span>
                    <span className="text-sm text-text-muted">
                        {readTime} min read
                    </span>
                </div>

                <h2 className="font-display font-semibold text-lg text-text-primary group-hover:text-accent-primary transition-colors mb-2">
                    {title}
                </h2>

                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {excerpt}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-xs text-text-muted"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <span className="text-sm text-text-muted">{formattedDate}</span>
                </div>
            </Link>
        </motion.article>
    );
}
