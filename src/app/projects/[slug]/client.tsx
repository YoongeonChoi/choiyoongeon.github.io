"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { springs, scrollFade, staggerContainer, staggerItem } from "@/lib/motion/config";

interface Project {
    title: string;
    description: string;
    image: string;
    techStack: string[];
    problem: string;
    solution: string;
    reflection: string;
    githubUrl?: string;
    liveUrl?: string;
}

export function ProjectDetailClient({ project }: { project: Project }) {
    return (
        <>
            <Header />

            <main id="main-content" className="min-h-screen">
                {/* Hero Section */}
                <section className="relative h-[50vh] min-h-[350px] flex items-end">
                    <div className="absolute inset-0 bg-surface-secondary">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-primary via-surface-primary/60 to-transparent" />

                    <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={springs.smooth}
                            className="mb-6"
                        >
                            <Link
                                href="/projects"
                                className="inline-flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Projects
                            </Link>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={springs.smooth}
                            className="heading-display text-4xl md:text-5xl lg:text-6xl mb-4"
                        >
                            {project.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...springs.smooth, delay: 0.1 }}
                            className="text-text-secondary text-lg max-w-2xl"
                        >
                            {project.description}
                        </motion.p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-12">
                                <motion.div {...scrollFade}>
                                    <h2 className="heading-display text-2xl mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center text-sm">?</span>
                                        The Problem
                                    </h2>
                                    <p className="text-text-secondary leading-relaxed">{project.problem}</p>
                                </motion.div>

                                <motion.div {...scrollFade}>
                                    <h2 className="heading-display text-2xl mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center text-sm">✓</span>
                                        The Solution
                                    </h2>
                                    <p className="text-text-secondary leading-relaxed">{project.solution}</p>
                                </motion.div>

                                <motion.div {...scrollFade}>
                                    <h2 className="heading-display text-2xl mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-accent-primary/20 text-accent-primary flex items-center justify-center text-sm">💭</span>
                                        Reflection
                                    </h2>
                                    <p className="text-text-secondary leading-relaxed">{project.reflection}</p>
                                </motion.div>
                            </div>

                            {/* Sidebar */}
                            <motion.aside
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ ...springs.smooth, delay: 0.2 }}
                                className="space-y-6"
                            >
                                <div className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle">
                                    <h3 className="font-display font-semibold text-text-primary mb-4">Tech Stack</h3>
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex flex-wrap gap-2"
                                    >
                                        {project.techStack.map((tech) => (
                                            <motion.span
                                                key={tech}
                                                variants={staggerItem}
                                                className="px-3 py-1.5 text-sm rounded-full bg-surface-elevated text-text-secondary"
                                            >
                                                {tech}
                                            </motion.span>
                                        ))}
                                    </motion.div>
                                </div>

                                <div className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle">
                                    <h3 className="font-display font-semibold text-text-primary mb-4">Links</h3>
                                    <div className="space-y-3">
                                        {project.liveUrl && (
                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text-secondary hover:text-accent-primary transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                                Live Demo
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text-secondary hover:text-accent-primary transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                View Source
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.aside>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
