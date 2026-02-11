"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
];

/**
 * Frosted glass navbar with hamburger menu for mobile.
 * Fixed at top with backdrop blur. 
 */
export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50">
      <div className="site-container pt-4">
        <div className="frosted-panel flex items-center justify-between px-4 py-3 md:px-5">
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-[-0.03em] text-text-primary transition-colors group-hover:text-accent">
              Nexus
            </span>
            <span className="text-sm uppercase tracking-[0.18em] text-text-secondary">PR</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-4 py-2 text-sm transition-all duration-300 ${
                    active
                      ? "bg-accent text-white"
                      : "text-text-secondary hover:bg-accent-muted hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href="https://github.com/choiyoongeon"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border-default bg-surface-overlay px-4 py-2 text-sm text-text-primary transition-all duration-300 hover:border-border-hover hover:text-accent"
            >
              GitHub
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="relative grid h-8 w-8 place-items-center md:hidden"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 6 : 0,
              }}
              className="absolute h-0.5 w-5 bg-text-primary"
            />
            <motion.span
              animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
              className="absolute h-0.5 w-5 bg-text-primary"
            />
            <motion.span
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? -6 : 0,
              }}
              className="absolute h-0.5 w-5 bg-text-primary"
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="site-container mt-2 md:hidden"
          >
            <div className="frosted-panel grid gap-2 p-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-accent-muted hover:text-text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://github.com/choiyoongeon"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-accent px-4 py-3 text-center text-sm font-medium text-white"
              >
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
