"use client";

import { useRef, useState, useEffect } from "react";
import { SkillGraph } from "./SkillGraph";

export function GraphSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const scrolled = -rect.top;
      setProgress(Math.max(0, Math.min(1, scrolled / scrollable)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const opacity =
    progress < 0.08
      ? progress / 0.08
      : progress > 0.88
        ? (1 - progress) / 0.12
        : 1;

  return (
    <div ref={outerRef} className="graph-pin-outer">
      <div className="graph-pin-sticky">
        <div className="graph-pin-content" style={{ opacity }}>
          <SkillGraph />
        </div>
        <p className="graph-hint" style={{ opacity: Math.max(0, 1 - progress * 4) }}>
          <span className="graph-hint-icon">↕</span>
          Scroll to continue · Click nodes to explore
        </p>
      </div>
    </div>
  );
}
