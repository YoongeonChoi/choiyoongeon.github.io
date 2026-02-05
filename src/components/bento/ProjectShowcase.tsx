"use client";

import { motion } from "framer-motion";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { ProjectCard } from "@/components/bento/ProjectCard";
import { scrollFade } from "@/lib/motion/config";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { Project } from "@/lib/supabase/types";

export function ProjectShowcase() {
    const { data: projects, isLoading, error } = useSupabaseQuery<Project>("projects", {
        featured: true,
    });

    if (isLoading) {
        return (
            <div className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="h-10 w-48 bg-surface-secondary/50 rounded-lg animate-pulse mb-4" />
                    <div className="h-6 w-96 bg-surface-secondary/30 rounded-lg animate-pulse mb-12" />
                    <BentoGrid>
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-2xl bg-surface-secondary/50 animate-pulse border border-border-subtle h-[400px] ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                            />
                        ))}
                    </BentoGrid>
                </div>
            </div>
        );
    }

    // Fallback if no projects found or error (could show error state, but empty state for now)
    const displayProjects = projects || [];

    return (
        <section id="projects" className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div {...scrollFade} className="mb-12">
                    <h2 className="heading-display heading-lg mb-4">Featured Projects</h2>
                    <p className="text-text-secondary text-lg max-w-2xl">
                        A selection of work that showcases my approach to problem-solving and design.
                    </p>
                </motion.div>

                <BentoGrid>
                    {displayProjects.map((project, index) => (
                        <ProjectCard
                            key={project.slug}
                            slug={project.slug}
                            title={project.title}
                            description={project.description || ""}
                            image={project.cover_image || "/images/placeholder-project.png"}
                            techStack={project.technologies || []}
                            featured={project.featured}
                            className={index === 0 ? "md:col-span-2 md:row-span-2" : ""}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}
