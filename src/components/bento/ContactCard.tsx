"use client";

import { motion } from "framer-motion";

const CONTACT_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/choiyoongeon",
    value: "@choiyoongeon",
  },
  {
    label: "Email",
    href: "mailto:contact@choiyoongeon.dev",
    value: "contact@choiyoongeon.dev",
  },
];

export function ContactCard() {
  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
          Contact
        </h3>
        <span className="text-xs text-text-muted">Open to collaboration</span>
      </div>
      <div className="grid gap-2">
        {CONTACT_LINKS.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2, scale: 1.01 }}
            className="group rounded-2xl border border-border-default bg-surface-overlay px-4 py-3 transition-all duration-300 hover:border-border-hover"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-text-primary">{link.label}</span>
              <span className="text-xs text-text-secondary transition-colors group-hover:text-accent">
                {link.value}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
