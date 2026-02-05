"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { ProjectCard } from "@/components/bento/ProjectCard";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { springs, staggerContainer, staggerItem } from "@/lib/motion/config";

// Sample projects data (to be replaced with CMS data)
const allProjects = [
    {
        slug: "portfolio-2026",
        title: "Next-Gen Portfolio Platform",
        description: "A corporate-grade portfolio with Spatial Minimalism design, WebGPU graphics, and Passkey authentication.",
        image: "/images/projects/portfolio.jpg",
        techStack: ["Next.js 16", "TypeScript", "Tailwind CSS 4", "Three.js", "WebAuthn"],
        category: "Web Development",
    },
    {
        slug: "ai-dashboard",
        title: "AI Analytics Dashboard",
        description: "Real-time analytics platform with ML-powered insights and interactive data visualizations.",
        image: "/images/projects/dashboard.jpg",
        techStack: ["React", "Python", "TensorFlow", "D3.js"],
        category: "Data Science",
    },
    {
        slug: "mobile-app",
        title: "Cross-Platform Mobile App",
        description: "Native-quality mobile experience built with React Native and modern design principles.",
        image: "/images/projects/mobile.jpg",
        techStack: ["React Native", "Expo", "TypeScript", "Reanimated"],
        category: "Mobile",
    },
    {
        slug: "design-system",
        title: "Enterprise Design System",
        description: "Comprehensive component library with accessibility-first approach and extensive documentation.",
        image: "/images/projects/design-system.jpg",
        techStack: ["React", "Storybook", "Figma", "CSS Variables"],
        category: "Design",
    },
    {
        slug: "ecommerce-platform",
        title: "E-Commerce Platform",
        description: "Full-featured online store with cart, checkout, payments, and inventory management.",
        image: "/images/projects/ecommerce.jpg",
        techStack: ["Next.js", "Stripe", "Prisma", "PostgreSQL"],
        category: "Web Development",
    },
    {
        slug: "chat-application",
        title: "Real-time Chat Application",
        description: "WebSocket-based messaging app with end-to-end encryption and file sharing.",
        image: "/images/projects/chat.jpg",
        techStack: ["Socket.io", "React", "Node.js", "MongoDB"],
        category: "Web Development",
    },
];

const categories = ["All", "Web Development", "Mobile", "Design", "Data Science"];

export default function ProjectsPage() {
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
                        <h1 className="heading-display heading-lg mb-4">Projects</h1>
                        <p className="text-text-secondary text-lg max-w-2xl">
                            A collection of projects that showcase my approach to solving problems through design and engineering.
                        </p>
                    </motion.div>

                    {/* Category Filter */}
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

                    {/* Projects Grid */}
                    <BentoGrid className="gap-6">
                        {allProjects.map((project, index) => (
                            <ProjectCard
                                key={project.slug}
                                {...project}
                                featured={index === 0}
                                className={index === 0 ? "" : ""}
                            />
                        ))}
                    </BentoGrid>
                </div>
            </main>
        </>
    );
}
