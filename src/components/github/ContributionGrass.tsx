"use client";

import { useState, Suspense, lazy } from "react";
import { useContributions } from "@/hooks/useContributions";
import { SVGGrass } from "./GrassTooltip";
import { SkeletonGrass } from "@/components/shared/SkeletonUI";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { motion, AnimatePresence } from "framer-motion";

// Lazy-load the 3D view to avoid loading Three.js unless toggled
const Grass3DView = lazy(() =>
    import("./Grass3DView").then((mod) => ({ default: mod.Grass3DView }))
);

interface ContributionGrassProps {
    username: string;
}

/**
 * Interactive GitHub Contribution Grass component.
 * Hybrid: SVG heatmap (default) + toggleable Three.js 3D elevation view.
 * Data fetched via Supabase Edge Function proxy (PAT never exposed).
 */
export function ContributionGrass({ username }: ContributionGrassProps) {
    const { data, isLoading, error, refetch } = useContributions(username);
    const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");

    if (isLoading) {
        return <SkeletonGrass />;
    }

    if (error) {
        return (
            <div className="glass-card p-6 text-center">
                <div className="text-3xl mb-3">🌿</div>
                <p className="text-sm text-text-secondary mb-3">
                    Failed to load contributions
                </p>
                <button
                    onClick={refetch}
                    className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                        GitHub Contributions
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                        {data.totalContributions.toLocaleString()} contributions this year
                    </p>
                </div>

                {/* 2D / 3D Toggle */}
                <div className="flex items-center gap-1 p-1 rounded-lg glass-inset">
                    <button
                        onClick={() => setViewMode("2d")}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${viewMode === "2d"
                                ? "bg-accent text-white shadow-md"
                                : "text-text-secondary hover:text-text-primary"
                            }`}
                    >
                        2D
                    </button>
                    <button
                        onClick={() => setViewMode("3d")}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${viewMode === "3d"
                                ? "bg-accent text-white shadow-md"
                                : "text-text-secondary hover:text-text-primary"
                            }`}
                    >
                        3D
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <ErrorBoundary
                        fallback={
                            <div className="p-4 text-center text-sm text-text-secondary">
                                3D view unavailable. Showing 2D view.
                            </div>
                        }
                    >
                        {viewMode === "2d" ? (
                            <SVGGrass weeks={data.weeks} />
                        ) : (
                            <Suspense fallback={<SkeletonGrass />}>
                                <Grass3DView weeks={data.weeks} />
                            </Suspense>
                        )}
                    </ErrorBoundary>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
