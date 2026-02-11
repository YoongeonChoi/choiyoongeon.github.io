"use client";

import { motion } from "framer-motion";

interface StatItemProps {
  label: string;
  value: string | number;
  suffix?: string;
  delay?: number;
}

function StatItem({ label, value, suffix = "", delay = 0 }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-inset p-3 text-center"
    >
      <div className="text-[clamp(1.2rem,1rem+1vw,1.7rem)] font-semibold tracking-[-0.03em] text-text-primary">
        <span className="gradient-text">{value}</span>
        {suffix && <span className="text-base">{suffix}</span>}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.11em] text-text-muted">{label}</div>
    </motion.div>
  );
}

interface StatsCardProps {
  totalContributions?: number;
}

export function StatsCard({ totalContributions }: StatsCardProps) {
  return (
    <div>
      <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
        Quick Stats
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <StatItem label="Contributions" value={totalContributions ?? "—"} delay={0.16} />
        <StatItem label="Projects" value="10" suffix="+" delay={0.22} />
        <StatItem label="Posts" value="0" delay={0.28} />
        <StatItem label="Years" value="3" suffix="+" delay={0.34} />
      </div>
    </div>
  );
}
