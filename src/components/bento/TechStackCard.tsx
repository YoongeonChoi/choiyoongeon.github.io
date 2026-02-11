"use client";

import { motion } from "framer-motion";

const TECH_STACK = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind",
  "Supabase",
  "Three.js",
  "Framer Motion",
  "PostgreSQL",
];

export function TechStackCard() {
  return (
    <div>
      <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
        Tech Stack
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {TECH_STACK.map((tech, i) => (
          <motion.div
            key={tech}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03, y: -2 }}
            className="glass-inset px-3 py-2 text-[12px] font-medium tracking-[-0.01em] text-text-primary"
          >
            {tech}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
