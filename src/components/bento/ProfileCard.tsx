"use client";

import { motion } from "framer-motion";

export function ProfileCard() {
    return (
        <div className="flex flex-col items-center text-center gap-4">
            {/* Avatar with glow */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
            >
                <div
                    className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-3xl font-bold text-white"
                    style={{
                        boxShadow: "0 0 40px var(--accent-glow)",
                    }}
                >
                    YC
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full border-2 border-background" />
            </motion.div>

            <div>
                <h2 className="text-xl font-bold text-text-primary">Yoongeon Choi</h2>
                <p className="text-sm text-text-secondary mt-1">
                    Full-Stack Developer & Security Specialist
                </p>
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
                {["Next.js", "TypeScript", "Supabase"].map((tag) => (
                    <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-accent-muted text-accent font-medium"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
