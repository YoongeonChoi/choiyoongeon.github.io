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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            className="text-center"
        >
            <div className="text-2xl font-bold gradient-text">
                {value}
                {suffix && <span className="text-lg">{suffix}</span>}
            </div>
            <div className="text-xs text-text-muted mt-1">{label}</div>
        </motion.div>
    );
}

interface StatsCardProps {
    totalContributions?: number;
}

export function StatsCard({ totalContributions }: StatsCardProps) {
    return (
        <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">
                Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <StatItem label="Contributions" value={totalContributions ?? "—"} delay={0.2} />
                <StatItem label="Projects" value="10" suffix="+" delay={0.3} />
                <StatItem label="Blog Posts" value="0" delay={0.4} />
                <StatItem label="Years Coding" value="3" suffix="+" delay={0.5} />
            </div>
        </div>
    );
}
