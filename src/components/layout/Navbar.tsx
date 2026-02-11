"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
];

/**
 * Frosted glass navbar with hamburger menu for mobile.
 * Fixed at top with backdrop blur. 
 */
export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            <div
                className="mx-auto max-w-6xl px-6 py-4"
                style={{
                    background: "var(--surface)",
                    backdropFilter: "blur(var(--glass-blur))",
                    WebkitBackdropFilter: "blur(var(--glass-blur))",
                    borderBottom: "1px solid var(--glass-border)",
                }}
            >
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-2">
                        <span className="text-xl font-bold gradient-text">
                            Nexus
                        </span>
                        <span className="text-xl font-light text-text-primary">
                            PR
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative text-sm font-medium text-text-secondary hover:text-accent transition-colors group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                        <a
                            href="https://github.com/choiyoongeon"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-all duration-300 hover:shadow-[0_0_20px_var(--accent-glow)]"
                        >
                            GitHub
                        </a>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
                        aria-label="Toggle menu"
                    >
                        <motion.span
                            animate={{
                                rotate: isMobileMenuOpen ? 45 : 0,
                                y: isMobileMenuOpen ? 6 : 0,
                            }}
                            className="w-6 h-0.5 bg-text-primary block"
                        />
                        <motion.span
                            animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                            className="w-6 h-0.5 bg-text-primary block"
                        />
                        <motion.span
                            animate={{
                                rotate: isMobileMenuOpen ? -45 : 0,
                                y: isMobileMenuOpen ? -6 : 0,
                            }}
                            className="w-6 h-0.5 bg-text-primary block"
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden mx-4 mt-2 rounded-2xl overflow-hidden"
                        style={{
                            background: "var(--surface-raised)",
                            backdropFilter: "blur(calc(var(--glass-blur) * 1.5))",
                            WebkitBackdropFilter: "blur(calc(var(--glass-blur) * 1.5))",
                            border: "1px solid var(--glass-border)",
                        }}
                    >
                        <div className="p-4 flex flex-col gap-2">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-accent hover:bg-accent-muted transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <a
                                href="https://github.com/choiyoongeon"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-3 rounded-xl text-sm font-medium text-center bg-accent text-white hover:bg-accent-hover transition-colors"
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
