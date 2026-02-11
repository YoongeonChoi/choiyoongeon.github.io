"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

interface BentoCardProps {
    children: ReactNode;
    className?: string;
    colSpan?: 1 | 2 | 3;
    rowSpan?: 1 | 2;
    delay?: number;
}

/**
 * Bento Grid 2.0 — Dynamic grid layout that shifts based on content priority.
 * Uses CSS Grid with responsive breakpoints.
 */
export function BentoGrid({ children, className = "" }: BentoGridProps) {
    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${className}`}
        >
            {children}
        </div>
    );
}

/**
 * Individual Bento Card with Frosted Neumorphism styling.
 * Supports variable column/row spans for layout priority.
 */
export function BentoCard({
    children,
    className = "",
    colSpan = 1,
    rowSpan = 1,
    delay = 0,
}: BentoCardProps) {
    const colSpanClasses = {
        1: "",
        2: "md:col-span-2",
        3: "md:col-span-2 lg:col-span-3",
    };

    const rowSpanClasses = {
        1: "",
        2: "row-span-2",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.6,
                delay: delay * 0.1,
                ease: [0.16, 1, 0.3, 1],
            }}
            className={`glass-card p-6 ${colSpanClasses[colSpan]} ${rowSpanClasses[rowSpan]} ${className}`}
        >
            {children}
        </motion.div>
    );
}
