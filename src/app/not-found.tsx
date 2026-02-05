"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/navigation/Header";

export default function NotFound() {
    return (
        <>
            <Header />
            <main className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="heading-display heading-xl mb-4"
                    >
                        404
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-text-secondary text-lg mb-8"
                    >
                        Page not found.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link
                            href="/"
                            className="px-8 py-4 rounded-full bg-accent-primary text-surface-primary font-semibold hover:glow-accent transition-all duration-300 inline-block"
                        >
                            Return Home
                        </Link>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
