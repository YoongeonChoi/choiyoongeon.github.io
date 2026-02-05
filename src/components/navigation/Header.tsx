"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { springs, staggerContainer, staggerItem } from "@/lib/motion/config";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
];

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...springs.smooth, delay: 0.1 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "glass-strong shadow-lg"
                    : "bg-transparent"
                }`}
        >
            <nav className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="relative group">
                        <motion.span
                            className="text-xl font-bold font-display gradient-text"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={springs.snappy}
                        >
                            YC
                        </motion.span>
                        <motion.span
                            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-primary group-hover:w-full transition-all duration-300"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <motion.ul
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="hidden md:flex items-center gap-8"
                    >
                        {navItems.map((item) => (
                            <motion.li key={item.href} variants={staggerItem}>
                                <NavLink
                                    href={item.href}
                                    isActive={pathname === item.href}
                                >
                                    {item.label}
                                </NavLink>
                            </motion.li>
                        ))}
                    </motion.ul>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="md:hidden relative w-10 h-10 flex items-center justify-center"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <div className="relative w-6 h-5">
                            <motion.span
                                className="absolute left-0 w-full h-0.5 bg-text-primary rounded-full"
                                animate={{
                                    top: isMobileMenuOpen ? "50%" : "0%",
                                    rotate: isMobileMenuOpen ? 45 : 0,
                                    translateY: isMobileMenuOpen ? "-50%" : "0%",
                                }}
                                transition={springs.snappy}
                            />
                            <motion.span
                                className="absolute left-0 top-1/2 w-full h-0.5 bg-text-primary rounded-full -translate-y-1/2"
                                animate={{
                                    opacity: isMobileMenuOpen ? 0 : 1,
                                    scaleX: isMobileMenuOpen ? 0 : 1,
                                }}
                                transition={springs.snappy}
                            />
                            <motion.span
                                className="absolute left-0 w-full h-0.5 bg-text-primary rounded-full"
                                animate={{
                                    bottom: isMobileMenuOpen ? "50%" : "0%",
                                    rotate: isMobileMenuOpen ? -45 : 0,
                                    translateY: isMobileMenuOpen ? "50%" : "0%",
                                }}
                                transition={springs.snappy}
                            />
                        </div>
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={springs.smooth}
                            className="md:hidden overflow-hidden"
                        >
                            <motion.ul
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="py-6 space-y-4"
                            >
                                {navItems.map((item) => (
                                    <motion.li key={item.href} variants={staggerItem}>
                                        <Link
                                            href={item.href}
                                            className={`block py-2 text-lg font-medium transition-colors ${pathname === item.href
                                                    ? "text-accent-primary"
                                                    : "text-text-secondary hover:text-text-primary"
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.header>
    );
}

interface NavLinkProps {
    href: string;
    isActive: boolean;
    children: React.ReactNode;
}

function NavLink({ href, isActive, children }: NavLinkProps) {
    return (
        <Link
            href={href}
            className={`relative py-2 text-sm font-medium transition-colors ${isActive
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
        >
            {children}
            {/* Animated underline */}
            <motion.span
                className="absolute bottom-0 left-0 h-0.5 bg-accent-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: isActive ? "100%" : "0%" }}
                whileHover={{ width: "100%" }}
                transition={springs.snappy}
            />
        </Link>
    );
}
