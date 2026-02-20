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
      const scrollableHeight = el.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const scrolled = -rect.top;
      setProgress(Math.max(0, Math.min(1, scrolled / scrollableHeight)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const opacity = progress < 0.1
    ? progress / 0.1
    : progress > 0.85
      ? (1 - progress) / 0.15
      : 1;

  return (
    <div ref={outerRef} className="graph-pin-outer">
      <div className="graph-pin-sticky">
        <div className="graph-pin-content" style={{ opacity }}>
          <SkillGraph />
          <p className="graph-hint">
            <span className="graph-hint-icon">↕</span>
            Scroll to continue &middot; Click nodes to explore
          </p>
        </div>
      </div>
    </div>
  );
}
