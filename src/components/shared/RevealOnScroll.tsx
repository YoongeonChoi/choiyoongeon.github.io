"use client";

import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import type { ReactNode } from "react";

interface RevealOnScrollProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

/**
 * Wrapper component that reveals children with a smooth animation
 * when they scroll into view using IntersectionObserver.
 */
export function RevealOnScroll({
    children,
    className = "",
    delay = 0,
    direction = "up",
}: RevealOnScrollProps) {
    const [ref, isVisible] = useRevealOnScroll<HTMLDivElement>();

    const transforms = {
        up: "translateY(30px)",
        down: "translateY(-30px)",
        left: "translateX(30px)",
        right: "translateX(-30px)",
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translate(0, 0)" : transforms[direction],
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}
