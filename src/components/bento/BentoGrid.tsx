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
  depth?: number;
}

/**
 * Bento Grid 2.0 — Dynamic grid layout that shifts based on content priority.
 * Uses CSS Grid with responsive breakpoints.
 */
export function BentoGrid({ children, className = "" }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-[clamp(0.8rem,0.6rem+1vw,1.35rem)] md:grid-cols-2 lg:grid-cols-3 ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
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
  depth = 0,
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
    <motion.article
      initial={{ opacity: 0, y: 26, scale: 0.975 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.72,
        delay: delay * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        scale: 1.006,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      className={`glass-card p-[clamp(1rem,0.7rem+1vw,1.5rem)] ${colSpanClasses[colSpan]} ${rowSpanClasses[rowSpan]} ${className}`}
      style={{ transform: `translateZ(${depth * 100}px)` }}
    >
      {children}
    </motion.article>
  );
}
