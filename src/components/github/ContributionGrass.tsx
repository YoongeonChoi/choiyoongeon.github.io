"use client";

import { useState, Suspense, lazy } from "react";
import { useContributions } from "@/hooks/useContributions";
import { SVGGrass } from "./GrassTooltip";
import { SkeletonGrass } from "@/components/shared/SkeletonUI";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { motion } from "framer-motion";

// Lazy-load the 3D view to avoid loading Three.js unless toggled
const Grass3DView = lazy(() =>
    import("./Grass3DView").then((mod) => ({ default: mod.Grass3DView }))
);

interface ContributionGrassProps {
  username: string;
  scrollEnergy?: number;
}

/**
 * Interactive GitHub Contribution Grass component.
 * Hybrid: SVG heatmap (default) + toggleable Three.js 3D elevation view.
 * Data fetched via Supabase Edge Function proxy (PAT never exposed).
 */
export function ContributionGrass({
  username,
  scrollEnergy = 0,
}: ContributionGrassProps) {
  const { data, isLoading, error, refetch } = useContributions(username);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");

  if (isLoading) {
    return <SkeletonGrass />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border-default bg-surface-overlay p-6 text-center">
        <div className="mb-3 text-3xl">🌿</div>
        <p className="mb-3 text-sm text-text-secondary">Failed to load contributions</p>
        <button
          onClick={refetch}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
            GitHub Contributions
          </h3>
          <p className="mt-1 text-xs text-text-secondary">
            {data.totalContributions.toLocaleString()} contributions this year
          </p>
        </div>

        <div className="glass-inset flex items-center gap-1 p-1">
          <button
            onClick={() => setViewMode("2d")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
              viewMode === "2d"
                ? "bg-accent text-white shadow-md"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            2D
          </button>
          <button
            onClick={() => setViewMode("3d")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
              viewMode === "3d"
                ? "bg-accent text-white shadow-md"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            3D
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
              <Grass3DView weeks={data.weeks} scrollEnergy={scrollEnergy} />
            </Suspense>
          )}
        </ErrorBoundary>
      </motion.div>
    </div>
  );
}
