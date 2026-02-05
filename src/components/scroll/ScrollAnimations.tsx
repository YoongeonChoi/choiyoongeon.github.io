"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    animation?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scale";
    delay?: number;
    duration?: number;
    stagger?: number;
}

export function ScrollReveal({
    children,
    className = "",
    animation = "fadeUp",
    delay = 0,
    duration = 0.8,
    stagger = 0.1,
}: ScrollRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (prefersReducedMotion || !containerRef.current) return;

        const element = containerRef.current;
        const childElements = element.children;

        // Set initial state based on animation type
        const initialState = {
            fadeUp: { opacity: 0, y: 60 },
            fadeIn: { opacity: 0 },
            slideLeft: { opacity: 0, x: -60 },
            slideRight: { opacity: 0, x: 60 },
            scale: { opacity: 0, scale: 0.9 },
        }[animation];

        const animateState = {
            fadeUp: { opacity: 1, y: 0 },
            fadeIn: { opacity: 1 },
            slideLeft: { opacity: 1, x: 0 },
            slideRight: { opacity: 1, x: 0 },
            scale: { opacity: 1, scale: 1 },
        }[animation];

        // Apply to children if they exist, otherwise to container
        const targets = childElements.length > 0 ? childElements : element;

        gsap.set(targets, initialState);

        gsap.to(targets, {
            ...animateState,
            duration,
            delay,
            stagger: childElements.length > 0 ? stagger : 0,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.vars.trigger === element) {
                    trigger.kill();
                }
            });
        };
    }, [animation, delay, duration, stagger, prefersReducedMotion]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}

interface ParallaxProps {
    children: React.ReactNode;
    className?: string;
    speed?: number; // -1 to 1, negative = slower, positive = faster
}

export function Parallax({ children, className = "", speed = 0.3 }: ParallaxProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (prefersReducedMotion || !containerRef.current) return;

        const element = containerRef.current;

        gsap.to(element, {
            y: () => speed * 100,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.vars.trigger === element) {
                    trigger.kill();
                }
            });
        };
    }, [speed, prefersReducedMotion]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}

interface TextRevealProps {
    text: string;
    className?: string;
    tag?: "h1" | "h2" | "h3" | "p" | "span";
}

export function TextReveal({ text, className = "", tag: Tag = "p" }: TextRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (prefersReducedMotion || !containerRef.current) return;

        const element = containerRef.current;
        const words = element.querySelectorAll(".word");

        gsap.set(words, { opacity: 0, y: 20 });

        gsap.to(words, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.vars.trigger === element) {
                    trigger.kill();
                }
            });
        };
    }, [text, prefersReducedMotion]);

    const words = text.split(" ").map((word, i) => (
        <span key={i} className="word inline-block mr-[0.25em]">
            {word}
        </span>
    ));

    return (
        <div ref={containerRef}>
            <Tag className={className}>{words}</Tag>
        </div>
    );
}

// Hook for custom ScrollTrigger animations
export function useScrollTrigger(
    callback: (gsap: typeof import("gsap").gsap, ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger) => gsap.core.Tween | gsap.core.Timeline | void,
    dependencies: React.DependencyList = []
) {
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (prefersReducedMotion) return;

        const result = callback(gsap, ScrollTrigger);

        return () => {
            if (result && "kill" in result) {
                result.kill();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prefersReducedMotion, ...dependencies]);
}
