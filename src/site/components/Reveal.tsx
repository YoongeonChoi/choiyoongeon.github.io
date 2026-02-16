"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";

interface RevealProps extends ComponentPropsWithoutRef<"div"> {
  delayMs?: number;
}

function supportsIntersectionObserver() {
  return typeof window !== "undefined" && "IntersectionObserver" in window;
}

export function Reveal({ delayMs = 0, className = "", children, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(id);
    }

    if (!supportsIntersectionObserver()) {
      const id = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} reveal${visible ? " visible" : ""}`.trim()}
      style={{ transitionDelay: `${delayMs}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}
