"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Header } from "@/components/navigation/Header";
import { springs, staggerContainer, staggerItem } from "@/lib/motion/config";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // For simplicity, using password auth. Could be OTP.
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({ posts: 0, projects: 0, views: 0 });
    const router = useRouter();

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            setIsAuthenticated(true);
            fetchStats();
        }
    };

    const fetchStats = async () => {
        const { count: postsCount } = await supabase.from("posts").select("*", { count: "exact", head: true });
        const { count: projectsCount } = await supabase.from("projects").select("*", { count: "exact", head: true });
        // Views count would be aggregated, for now mocking specific aggregation or summing
        const { data: posts } = await supabase.from("posts").select("view_count");
        const typedPosts = (posts || []) as unknown as { view_count: number }[];
        const totalViews = typedPosts.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0;

        setStats({
            posts: postsCount || 0,
            projects: projectsCount || 0,
            views: totalViews,
        });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            setIsAuthenticated(true);
            fetchStats();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
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
                                Sign in to manage your portfolio
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

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                                        required
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 rounded-xl bg-accent-primary text-surface-primary font-semibold hover:glow-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                    transition={springs.snappy}
                                >
                                    {isLoading ? "Authenticating..." : "Sign In"}
                                </motion.button>
                            </form>
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
                            onClick={handleSignOut}
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
                            { label: "Blog Posts", value: stats.posts.toString(), icon: "📝" },
                            { label: "Projects", value: stats.projects.toString(), icon: "💼" },
                            { label: "Total Views", value: stats.views.toLocaleString(), icon: "👁️" },
                            // { label: "Subscribers", value: "234", icon: "📬" }, // Removed mock subscriber count
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
                            href="/admin/projects" // Ensure this page exists or link to /admin/write?type=project
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
