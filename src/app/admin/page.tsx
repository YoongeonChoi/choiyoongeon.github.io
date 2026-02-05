"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Header } from "@/components/navigation/Header";
import { springs, staggerContainer, staggerItem } from "@/lib/motion/config";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePasskeyLogin = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Check if WebAuthn is supported
            if (!window.PublicKeyCredential) {
                throw new Error("WebAuthn is not supported in this browser");
            }

            // Check if passkeys are available
            const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

            if (!available) {
                throw new Error("No passkey authenticator available on this device");
            }

            // In production, this would call the server to get authentication options
            // For demo, we simulate a successful authentication
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Simulated success
            setIsAuthenticated(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <main className="min-h-screen flex items-center justify-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={springs.smooth}
                        className="w-full max-w-md"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h1 className="heading-display text-2xl mb-2">Admin Access</h1>
                            <p className="text-text-muted">
                                Authenticate with your passkey to access the admin dashboard
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <motion.button
                                onClick={handlePasskeyLogin}
                                disabled={isLoading}
                                className="w-full py-4 rounded-xl bg-accent-primary text-surface-primary font-semibold hover:glow-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                transition={springs.snappy}
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                        </svg>
                                        Sign in with Passkey
                                    </>
                                )}
                            </motion.button>

                            <div className="mt-4 text-center">
                                <p className="text-text-muted text-sm">
                                    Using biometric authentication (Face ID, Touch ID, or Windows Hello)
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-text-muted text-sm">
                                Need help?{" "}
                                <a href="mailto:admin@yoongeonchoi.com" className="text-accent-primary hover:underline">
                                    Contact support
                                </a>
                            </p>
                        </div>
                    </motion.div>
                </main>
            </>
        );
    }

    // Authenticated Dashboard
    return (
        <>
            <Header />
            <main id="main-content" className="min-h-screen pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={springs.smooth}
                        className="flex items-center justify-between mb-8"
                    >
                        <div>
                            <h1 className="heading-display text-3xl mb-2">Dashboard</h1>
                            <p className="text-text-muted">Manage your portfolio and blog content</p>
                        </div>
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="px-4 py-2 rounded-lg bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
                        >
                            Sign Out
                        </button>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    >
                        {[
                            { label: "Blog Posts", value: "5", icon: "📝" },
                            { label: "Projects", value: "6", icon: "💼" },
                            { label: "Total Views", value: "12.4K", icon: "👁️" },
                            { label: "Subscribers", value: "234", icon: "📬" },
                        ].map((stat) => (
                            <motion.div
                                key={stat.label}
                                variants={staggerItem}
                                className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle"
                            >
                                <div className="text-2xl mb-2">{stat.icon}</div>
                                <div className="text-2xl font-bold font-display gradient-text">{stat.value}</div>
                                <div className="text-text-muted text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...springs.smooth, delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <a
                            href="/admin/write"
                            className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle hover:border-accent-primary transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-accent-primary/20 text-accent-primary flex items-center justify-center group-hover:bg-accent-primary group-hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary">New Blog Post</h3>
                                    <p className="text-text-muted text-sm">Create a new article</p>
                                </div>
                            </div>
                        </a>

                        <a
                            href="/admin/projects"
                            className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle hover:border-accent-primary transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-accent-secondary/20 text-accent-secondary flex items-center justify-center group-hover:bg-accent-secondary group-hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary">Manage Projects</h3>
                                    <p className="text-text-muted text-sm">Edit portfolio projects</p>
                                </div>
                            </div>
                        </a>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
