import { notFound } from "next/navigation";
import { BlogPostClient } from "./client";

// Sample blog posts
const blogPosts: Record<string, {
    title: string;
    content: string;
    category: string;
    tags: string[];
    date: string;
    readTime: number;
    author: string;
}> = {
    "building-next-gen-portfolio": {
        title: "Building a Next-Gen Portfolio with Next.js 16 and WebGPU",
        content: `## Introduction

In the ever-evolving landscape of web development, staying ahead means embracing cutting-edge technologies while maintaining focus on user experience.

## The Technology Stack

### Next.js 16 with Cache Components

Next.js 16 introduced Cache Components (formerly PPR), which fundamentally changes how we think about static and dynamic content.

### Tailwind CSS 4.0

The new Oxide engine delivers 5x faster full builds and 100x faster incremental builds with CSS-first configuration.

### WebGPU for Graphics

WebGPU is now production-ready across all major browsers, enabling sophisticated 3D visualizations.

## Design Philosophy: Spatial Minimalism

The design language draws inspiration from leading agencies like Plus-X, emphasizing intentional whitespace, weighted motion, and depth through subtlety.

## Conclusion

Building a modern portfolio is about demonstrating your understanding of current web technologies and design trends.`,
        category: "Development",
        tags: ["Next.js", "WebGPU", "TypeScript"],
        date: "2026-02-05",
        readTime: 12,
        author: "Yoongeon Choi",
    },
    "spatial-minimalism-design": {
        title: "Spatial Minimalism: The Evolution of Digital Design in 2026",
        content: `## What is Spatial Minimalism?

Spatial Minimalism represents the next evolution of minimalist design, incorporating three-dimensional thinking into traditionally flat interfaces.

## Key Principles

### 1. Depth Without Distraction

Using subtle shadows, translucency, and layering to create depth without overwhelming the user.

### 2. Motion as Communication

Every animation serves a purpose - guiding attention, providing feedback, or establishing spatial relationships.

### 3. Intentional Emptiness

Whitespace is actively designed to create breathing room and visual hierarchy.`,
        category: "Design",
        tags: ["UI/UX", "Design Systems", "Trends"],
        date: "2026-01-28",
        readTime: 8,
        author: "Yoongeon Choi",
    },
};

export function generateStaticParams() {
    return Object.keys(blogPosts).map((slug) => ({ slug }));
}

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = blogPosts[slug];

    if (!post) {
        notFound();
    }

    return <BlogPostClient post={post} />;
}
