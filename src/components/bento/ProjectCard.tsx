"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { springs } from "@/lib/motion/config";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ProjectCardProps {
    slug: string;
    title: string;
    description: string;
    image: string;
    techStack: string[];
    featured?: boolean;
    className?: string;
}

export function ProjectCard({
    slug,
    title,
    description,
    image,
    techStack,
    featured = false,
    className = "",
}: ProjectCardProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <Link href={`/projects/${slug}`} className="block h-full">
            <motion.article
                className={`
          relative h-full overflow-hidden rounded-2xl
          bg-surface-secondary border border-border-subtle
          group cursor-pointer
          ${featured ? "bento-featured" : ""}
          ${className}
        `}
                whileHover={
                    prefersReducedMotion
                        ? {}
                        : {
                            y: -4,
                            transition: springs.snappy,
                        }
                }
                whileTap={{ scale: 0.98 }}
            >
                {/* Background Image with Parallax */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute inset-0"
                        whileHover={
                            prefersReducedMotion
                                ? {}
                                : { scale: 1.05, transition: { duration: 0.6 } }
                        }
                    >
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                        />
                    </motion.div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-primary via-surface-primary/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                    {/* Tech Stack Tags */}
                    <motion.div
                        className="flex flex-wrap gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ y: 10 }}
                        whileHover={{ y: 0 }}
                    >
                        {techStack.slice(0, 4).map((tech) => (
                            <span
                                key={tech}
                                className="px-2 py-1 text-xs font-medium rounded-full bg-surface-elevated/80 text-text-secondary backdrop-blur-sm"
                            >
                                {tech}
                            </span>
                        ))}
                        {techStack.length > 4 && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-surface-elevated/80 text-text-muted backdrop-blur-sm">
                                +{techStack.length - 4}
                            </span>
                        )}
                    </motion.div>

                    {/* Title */}
                    <h3
                        className={`font-display font-bold text-text-primary leading-tight ${featured ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
                            }`}
                    >
                        {title}
                    </h3>

                    {/* Description */}
                    <p
                        className={`mt-2 text-text-secondary line-clamp-2 ${featured ? "text-base" : "text-sm"
                            }`}
                    >
                        {description}
                    </p>

                    {/* View Project Link */}
                    <motion.div
                        className="flex items-center gap-2 mt-4 text-accent-primary font-medium text-sm"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={springs.snappy}
                    >
                        View Project
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </motion.div>
                </div>

                {/* Hover Glow Effect */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle at center, oklch(0.75 0.15 250 / 0.1) 0%, transparent 70%)",
                    }}
                />
            </motion.article>
        </Link>
    );
}
