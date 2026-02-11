"use client";

import { motion } from "framer-motion";

const CONTACT_LINKS = [
    {
        label: "GitHub",
        href: "https://github.com/choiyoongeon",
        icon: "🔗",
    },
    {
        label: "Email",
        href: "mailto:contact@choiyoongeon.dev",
        icon: "✉️",
    },
];

export function ContactCard() {
    return (
        <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">
                Get in Touch
            </h3>
            <div className="space-y-2">
                {CONTACT_LINKS.map((link, i) => (
                    <motion.a
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.3 }}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent-muted transition-all duration-300 group"
                    >
                        <span className="text-lg">{link.icon}</span>
                        <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                            {link.label}
                        </span>
                        <span className="ml-auto text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                        </span>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
