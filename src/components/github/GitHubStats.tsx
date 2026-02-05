"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { springs } from "@/lib/motion/config";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface GitHubStatsProps {
    username?: string;
    stats?: {
        totalContributions: number;
        currentStreak: number;
        longestStreak: number;
        pullRequests: number;
        issues: number;
        stars: number;
    };
}

// Placeholder stats for demo
const placeholderStats = {
    totalContributions: 1247,
    currentStreak: 42,
    longestStreak: 89,
    pullRequests: 156,
    issues: 73,
    stars: 234,
};

export function GitHubStats({
    username = "choiyoongeon",
    stats = placeholderStats,
}: GitHubStatsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    const statItems = [
        {
            label: "Contributions",
            value: stats.totalContributions,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: "Current Streak",
            value: stats.currentStreak,
            suffix: "days",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
            ),
        },
        {
            label: "Longest Streak",
            value: stats.longestStreak,
            suffix: "days",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            ),
        },
        {
            label: "Pull Requests",
            value: stats.pullRequests,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            ),
        },
        {
            label: "Issues",
            value: stats.issues,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: "Stars Earned",
            value: stats.stars,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
        },
    ];

    return (
        <div ref={containerRef} className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold text-text-primary text-lg">
                    GitHub Statistics
                </h3>
                <a
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-primary transition-colors"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View Profile
                </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {statItems.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ ...springs.smooth, delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-surface-elevated border border-border-subtle"
                    >
                        <div className="flex items-center gap-2 text-text-muted mb-2">
                            {stat.icon}
                            <span className="text-sm">{stat.label}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <AnimatedNumber
                                value={stat.value}
                                isInView={isInView}
                            />
                            {stat.suffix && (
                                <span className="text-sm text-text-muted">{stat.suffix}</span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

interface AnimatedNumberProps {
    value: number;
    isInView: boolean;
}

function AnimatedNumber({ value, isInView }: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (!isInView) return;

        if (prefersReducedMotion) {
            setDisplayValue(value);
            return;
        }

        const duration = 1500; // ms
        const steps = 60;
        const stepDuration = duration / steps;
        const increment = value / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            // Ease out effect
            const progress = step / steps;
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            current = Math.round(easedProgress * value);
            setDisplayValue(current);

            if (step >= steps) {
                setDisplayValue(value);
                clearInterval(timer);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [value, isInView, prefersReducedMotion]);

    return (
        <span className="text-2xl font-bold font-display gradient-text">
            {displayValue.toLocaleString()}
        </span>
    );
}
