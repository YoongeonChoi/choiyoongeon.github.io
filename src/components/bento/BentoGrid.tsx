"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, springs } from "@/lib/motion/config";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface BentoGridProps {
    children: React.ReactNode;
    className?: string;
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={`bento-grid ${className}`}
            {...(prefersReducedMotion && { initial: "visible" })}
        >
            {children}
        </motion.div>
    );
}

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "featured" | "compact";
    glowOnHover?: boolean;
    onClick?: () => void;
}

export function BentoCard({
    children,
    className = "",
    variant = "default",
    glowOnHover = false,
    onClick,
}: BentoCardProps) {
    const prefersReducedMotion = useReducedMotion();

    const variantClasses = {
        default: "",
        featured: "bento-featured",
        compact: "min-h-[150px]",
    };

    return (
        <motion.div
            variants={staggerItem}
            whileHover={
                prefersReducedMotion
                    ? {}
                    : {
                        y: -4,
                        scale: 1.01,
                        transition: springs.snappy,
                    }
            }
            whileTap={onClick ? { scale: 0.98 } : undefined}
            onClick={onClick}
            className={`
        bento-card relative group
        ${variantClasses[variant]}
        ${glowOnHover ? "hover:glow-accent" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
        >
            {/* Gradient border overlay on hover */}
            <motion.div
                className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(135deg, oklch(0.75 0.15 250 / 0.1), oklch(0.65 0.12 320 / 0.1))",
                }}
            />

            {/* Content */}
            <div className="relative z-10 h-full">{children}</div>
        </motion.div>
    );
}

interface BentoContentProps {
    children: React.ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
}

export function BentoContent({
    children,
    className = "",
    padding = "md",
}: BentoContentProps) {
    const paddingClasses = {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    };

    return (
        <div className={`h-full ${paddingClasses[padding]} ${className}`}>
            {children}
        </div>
    );
}

interface BentoHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    className?: string;
}

export function BentoHeader({
    title,
    subtitle,
    icon,
    className = "",
}: BentoHeaderProps) {
    return (
        <div className={`flex items-start gap-3 mb-4 ${className}`}>
            {icon && (
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center text-accent-primary">
                    {icon}
                </div>
            )}
            <div>
                <h3 className="font-display font-semibold text-text-primary">{title}</h3>
                {subtitle && (
                    <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>
                )}
            </div>
        </div>
    );
}

interface BentoImageProps {
    src: string;
    alt: string;
    className?: string;
    overlay?: boolean;
}

export function BentoImage({
    src,
    alt,
    className = "",
    overlay = true,
}: BentoImageProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <motion.img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
            />
            {overlay && (
                <div className="absolute inset-0 bg-gradient-to-t from-surface-primary/80 via-transparent to-transparent" />
            )}
        </div>
    );
}

interface BentoStatProps {
    value: string | number;
    label: string;
    className?: string;
}

export function BentoStat({ value, label, className = "" }: BentoStatProps) {
    return (
        <div className={`text-center ${className}`}>
            <div className="text-3xl font-bold font-display gradient-text">{value}</div>
            <div className="text-sm text-text-muted mt-1">{label}</div>
        </div>
    );
}
