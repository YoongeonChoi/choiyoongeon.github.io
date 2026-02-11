"use client";

import { motion } from "framer-motion";

const TECH_STACK = [
    { name: "Next.js", icon: "⚡", color: "#000" },
    { name: "TypeScript", icon: "🔷", color: "#3178c6" },
    { name: "React", icon: "⚛️", color: "#61dafb" },
    { name: "Tailwind", icon: "🎨", color: "#06b6d4" },
    { name: "Supabase", icon: "🟢", color: "#3ecf8e" },
    { name: "Three.js", icon: "🎲", color: "#000" },
    { name: "Framer", icon: "🎬", color: "#bb4cd1" },
    { name: "PostgreSQL", icon: "🐘", color: "#336791" },
];

export function TechStackCard() {
    return (
        <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">
                Tech Stack
            </h3>
            <div className="grid grid-cols-2 gap-2">
                {TECH_STACK.map((tech, i) => (
                    <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl glass-inset cursor-default"
                    >
                        <span className="text-lg">{tech.icon}</span>
                        <span className="text-xs font-medium text-text-primary truncate">
                            {tech.name}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
