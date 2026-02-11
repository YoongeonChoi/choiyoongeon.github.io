"use client";

import { motion } from "framer-motion";

export function ProfileCard() {
  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted">Director</p>
          <h2 className="mt-1 text-[clamp(1.2rem,0.8rem+1.2vw,1.95rem)] font-semibold tracking-[-0.03em] text-text-primary">
            Yoongeon Choi
          </h2>
          <p className="mt-2 max-w-[28ch] text-sm text-text-secondary">
            Full-stack engineering with security-first architecture and motion-led
            storytelling.
          </p>
        </div>
        <motion.div
          whileHover={{ rotate: -6, scale: 1.06 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid size-16 place-items-center rounded-2xl border border-border-default bg-surface-overlay text-base font-semibold text-text-primary"
          style={{ boxShadow: "0 0 30px var(--accent-glow)" }}
        >
          YC
          <span className="absolute -right-1 -top-1 size-3 rounded-full bg-accent" />
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {["Next.js", "TypeScript", "Supabase"].map((tag) => (
          <div
            key={tag}
            className="glass-inset px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-text-secondary"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}
