"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect user's motion preference
 * Returns true if the user prefers reduced motion
 * Used to provide static fallbacks for animations
 */
export function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check if window is available (SSR safety)
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        // Set initial value
        setPrefersReducedMotion(mediaQuery.matches);

        // Listen for changes
        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return prefersReducedMotion;
}

/**
 * Hook to get animation props based on motion preference
 * Returns either the full animation or a reduced version
 */
export function useMotionSafe<T extends object>(
    animation: T,
    reducedAnimation: Partial<T> = {}
): T | Partial<T> {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return { ...animation, ...reducedAnimation };
    }

    return animation;
}
