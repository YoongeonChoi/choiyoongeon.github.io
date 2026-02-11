"use client";

import { useState, useEffect } from "react";

/**
 * Hook that tracks reading progress as a percentage (0–100).
 * Used for the reading progress bar on blog post pages.
 */
export function useReadingProgress(): number {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                setProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)));
            }
        }

        window.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();

        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    return progress;
}
