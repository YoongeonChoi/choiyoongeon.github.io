"use client";

import { useReadingProgress } from "@/hooks/useReadingProgress";

/**
 * Fixed reading progress bar at the top of blog post pages.
 * Gradient from accent to secondary color.
 */
export function ReadingProgressBar() {
    const progress = useReadingProgress();

    return (
        <div
            className="reading-progress"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading progress"
        />
    );
}
