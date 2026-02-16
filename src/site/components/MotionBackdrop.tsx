"use client";

import { useEffect } from "react";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MotionBackdrop() {
  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    let frame = 0;
    const root = document.documentElement;

    const onPointerMove = (event: PointerEvent) => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;
        root.style.setProperty("--pointer-x", x.toFixed(4));
        root.style.setProperty("--pointer-y", y.toFixed(4));
        frame = 0;
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return <div className="motion-backdrop" aria-hidden />;
}
