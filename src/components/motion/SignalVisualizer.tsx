"use client";

import { useReducedMotion } from "framer-motion";

const RINGS = [
  { r: 38, duration: 28, dots: 3, delay: 0 },
  { r: 58, duration: 36, dots: 4, delay: -8 },
  { r: 78, duration: 48, dots: 2, delay: -16 },
];

const KEYWORDS = [
  { label: "Next.js", x: 14, y: 22, delay: 0 },
  { label: "TypeScript", x: 78, y: 18, delay: 1.2 },
  { label: "React", x: 88, y: 72, delay: 2.4 },
  { label: "Supabase", x: 8, y: 74, delay: 3.6 },
  { label: "Motion", x: 52, y: 88, delay: 0.8 },
];

export function SignalVisualizer() {
  const reducedMotion = useReducedMotion();
  const paused = reducedMotion ?? false;

  return (
    <div className="orbital-vis" aria-hidden="true">
      <div className="orbital-aurora" />
      <div className="orbital-aurora orbital-aurora-2" />

      <svg
        className="orbital-svg"
        viewBox="0 0 200 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.6" />
            <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dot-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle
          cx="100"
          cy="50"
          r="16"
          fill="url(#core-glow)"
          className={paused ? "" : "orbital-core-pulse"}
        />
        <circle cx="100" cy="50" r="2.5" fill="var(--accent)" opacity="0.85" />
        <circle
          cx="100"
          cy="50"
          r="1"
          fill="#fff"
          opacity="0.9"
        />

        {RINGS.map((ring, i) => (
          <g key={i}>
            <ellipse
              cx="100"
              cy="50"
              rx={ring.r}
              ry={ring.r * 0.42}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="0.3"
              strokeDasharray="2 4"
              opacity="0.18"
              className={paused ? "" : "orbital-ring-spin"}
              style={{
                animationDuration: `${ring.duration * 1.5}s`,
                animationDelay: `${ring.delay}s`,
                transformOrigin: "100px 50px",
              }}
            />

            {Array.from({ length: ring.dots }).map((_, d) => {
              const angle = (d / ring.dots) * 360;
              return (
                <g
                  key={d}
                  className={paused ? "" : "orbital-dot-orbit"}
                  style={{
                    animationDuration: `${ring.duration}s`,
                    animationDelay: `${ring.delay + (d / ring.dots) * ring.duration}s`,
                    transformOrigin: "100px 50px",
                  }}
                >
                  <circle
                    cx={100 + ring.r * Math.cos((angle * Math.PI) / 180)}
                    cy={
                      50 +
                      ring.r *
                        0.42 *
                        Math.sin((angle * Math.PI) / 180)
                    }
                    r="4"
                    fill="url(#dot-glow)"
                  />
                  <circle
                    cx={100 + ring.r * Math.cos((angle * Math.PI) / 180)}
                    cy={
                      50 +
                      ring.r *
                        0.42 *
                        Math.sin((angle * Math.PI) / 180)
                    }
                    r="1.2"
                    fill="var(--accent)"
                    opacity="0.9"
                  />
                </g>
              );
            })}
          </g>
        ))}

        {!paused && (
          <>
            <line
              x1="100"
              y1="50"
              x2={100 + 38 * Math.cos(0)}
              y2={50 + 38 * 0.42 * Math.sin(0)}
              stroke="var(--accent)"
              strokeWidth="0.2"
              opacity="0.12"
              className="orbital-connection"
            />
            <line
              x1="100"
              y1="50"
              x2={100 + 58 * Math.cos(Math.PI * 0.6)}
              y2={50 + 58 * 0.42 * Math.sin(Math.PI * 0.6)}
              stroke="var(--accent)"
              strokeWidth="0.2"
              opacity="0.12"
              className="orbital-connection"
              style={{ animationDelay: "1.5s" }}
            />
          </>
        )}
      </svg>

      <div className="orbital-keywords">
        {KEYWORDS.map((kw) => (
          <span
            key={kw.label}
            className={`orbital-kw ${paused ? "" : "orbital-kw-float"}`}
            style={{
              left: `${kw.x}%`,
              top: `${kw.y}%`,
              animationDelay: `${kw.delay}s`,
            }}
          >
            {kw.label}
          </span>
        ))}
      </div>

      <div className="orbital-badge">
        <span className="orbital-badge-dot" />
        <span>ORBITAL SYSTEM</span>
      </div>
    </div>
  );
}
