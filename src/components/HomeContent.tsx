"use client";

import { motion } from "framer-motion";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { BentoGrid, BentoCard } from "@/components/bento/BentoGrid";
import { ProfileCard } from "@/components/bento/ProfileCard";
import { TechStackCard } from "@/components/bento/TechStackCard";
import { LatestPostsCard } from "@/components/bento/LatestPostsCard";
import { ContactCard } from "@/components/bento/ContactCard";
import { StatsCard } from "@/components/bento/StatsCard";
import { ContributionGrass } from "@/components/github/ContributionGrass";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { BlogPost } from "@/lib/supabase/types";

interface GitHubGrassCardProps {
    username: string;
}

function GitHubGrassCardContent({ username }: GitHubGrassCardProps) {
    return (
        <ErrorBoundary>
            <ContributionGrass username={username} />
        </ErrorBoundary>
    );
}

interface HomeContentProps {
    latestPosts: BlogPost[];
    githubUsername: string;
}

/**
 * Home page client component with the Bento Grid layout.
 * Separated from page.tsx to enable client-side interactivity.
 */
export function HomeContent({
    latestPosts,
    githubUsername,
}: HomeContentProps) {
    return (
        <main className="mx-auto max-w-6xl px-6 pt-28 pb-12">
            {/* Hero Section */}
            <RevealOnScroll>
                <section className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl font-bold text-text-primary mb-4"
                    >
                        Building the{" "}
                        <span className="gradient-text">Future</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.1,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="text-lg text-text-secondary max-w-xl mx-auto"
                    >
                        Full-stack developer specializing in secure, performant web
                        applications. Zero-trust by design.
                    </motion.p>
                </section>
            </RevealOnScroll>

            {/* Bento Grid */}
            <BentoGrid>
                {/* Profile Card — 1 col */}
                <BentoCard delay={1}>
                    <ProfileCard />
                </BentoCard>

                {/* GitHub Grass — 2 cols */}
                <BentoCard colSpan={2} delay={2}>
                    <GitHubGrassCardContent username={githubUsername} />
                </BentoCard>

                {/* Tech Stack — 1 col */}
                <BentoCard delay={3}>
                    <TechStackCard />
                </BentoCard>

                {/* Latest Posts — 1 col */}
                <BentoCard delay={4}>
                    <LatestPostsCard posts={latestPosts} />
                </BentoCard>

                {/* Stats — 1 col */}
                <BentoCard delay={5}>
                    <StatsCard />
                </BentoCard>

                {/* Contact — full width on mobile, 3 cols on desktop */}
                <BentoCard colSpan={3} delay={6}>
                    <ContactCard />
                </BentoCard>
            </BentoGrid>
        </main>
    );
}
