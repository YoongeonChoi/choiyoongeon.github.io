"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/navigation/Header";
import { ProjectShowcase } from "@/components/bento/ProjectShowcase";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { ProjectCard } from "@/components/bento/ProjectCard"; // Kept if needed, but likely unused now in page.tsx directly
import { ContributionGraph } from "@/components/github/ContributionGraph";
import { GitHubStats } from "@/components/github/GitHubStats";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import { springs, staggerContainer, staggerItem, scrollFade } from "@/lib/motion/config";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SkillNebula = dynamic(() => import("@/components/skills/SkillNebula"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-3xl bg-surface-secondary/20 animate-pulse flex items-center justify-center">
      <span className="text-text-muted">Loading Nebula...</span>
    </div>
  ),
});

// Sample project data (to be replaced with CMS data)
const featuredProjects = [
  {
    slug: "portfolio-2026",
    title: "Next-Gen Portfolio Platform",
    description: "A corporate-grade portfolio with Spatial Minimalism design, WebGPU graphics, and Passkey authentication.",
    image: "/images/projects/portfolio.svg",
    techStack: ["Next.js 16", "TypeScript", "Tailwind CSS 4", "Three.js", "WebAuthn"],
    featured: true,
  },
  {
    slug: "ai-dashboard",
    title: "AI Analytics Dashboard",
    description: "Real-time analytics platform with ML-powered insights and interactive data visualizations.",
    image: "/images/projects/dashboard.svg",
    techStack: ["React", "Python", "TensorFlow", "D3.js"],
    featured: false,
  },
  {
    slug: "mobile-app",
    title: "Cross-Platform Mobile App",
    description: "Native-quality mobile experience built with React Native and modern design principles.",
    image: "/images/projects/mobile.svg",
    techStack: ["React Native", "Expo", "TypeScript", "Reanimated"],
    featured: false,
  },
  {
    slug: "design-system",
    title: "Enterprise Design System",
    description: "Comprehensive component library with accessibility-first approach and extensive documentation.",
    image: "/images/projects/design-system.svg",
    techStack: ["React", "Storybook", "Figma", "CSS Variables"],
    featured: false,
  },
];

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <Header />

      <main id="main-content" className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
          {/* Particle Background */}
          <ParticleBackground />

          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-surface-primary via-surface-secondary/50 to-surface-primary pointer-events-none" />

          {/* Ambient Glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-[128px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-[128px] pointer-events-none" />

          <motion.div
            className="relative z-10 max-w-4xl mx-auto text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Intro Label */}
            <motion.div
              variants={staggerItem}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
              <span className="text-sm text-text-secondary">Available for opportunities</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={staggerItem}
              className="heading-display heading-xl text-balance mb-6"
            >
              Crafting digital experiences that{" "}
              <span className="gradient-text">inspire</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={staggerItem}
              className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
            >
              Full-Stack Developer & Designer specializing in building products that
              blend cutting-edge technology with thoughtful, human-centered design.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="#projects"
                className="px-8 py-4 rounded-full bg-accent-primary text-surface-primary font-semibold hover:glow-accent transition-all duration-300"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={springs.snappy}
                  className="inline-block"
                >
                  View Projects
                </motion.span>
              </Link>
              <Link
                href="/blog"
                className="px-8 py-4 rounded-full glass font-semibold hover:bg-surface-elevated transition-all duration-300"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={springs.snappy}
                  className="inline-block"
                >
                  Read Blog
                </motion.span>
              </Link>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              variants={staggerItem}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <svg
                className="w-6 h-6 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* Projects Section */}
        <ProjectShowcase />

        {/* Skills Section */}
        <section className="py-24 px-6 bg-surface-secondary/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              {...scrollFade}
              className="text-center mb-12"
            >
              <h2 className="heading-display heading-lg mb-4">Skills & Expertise</h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Technologies and tools I use to bring ideas to life.
              </p>
            </motion.div>

            <motion.div {...scrollFade}>
              <SkillNebula />
            </motion.div>
          </div>
        </section>

        {/* GitHub Activity Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              {...scrollFade}
              className="mb-12"
            >
              <h2 className="heading-display heading-lg mb-4">GitHub Activity</h2>
              <p className="text-text-secondary text-lg max-w-2xl">
                A snapshot of my open source contributions and coding activity.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                {...scrollFade}
                className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle"
              >
                <ContributionGraph />
              </motion.div>

              <motion.div
                {...scrollFade}
                className="p-6 rounded-2xl bg-surface-secondary border border-border-subtle"
              >
                <GitHubStats />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 px-6 bg-surface-secondary/50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              {...scrollFade}
            >
              <h2 className="heading-display heading-lg mb-6">Let&apos;s Work Together</h2>
              <p className="text-text-secondary text-lg mb-10">
                Have a project in mind? I&apos;d love to hear about it. Let&apos;s create something amazing together.
              </p>
              <Link
                href="mailto:contact@yoongeonchoi.com"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent-primary text-surface-primary font-semibold hover:glow-accent transition-all duration-300"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={springs.snappy}
                  className="flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Get in Touch
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-border-subtle">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-sm">
              © 2026 Yoongeon Choi. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/choiyoongeon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/yoongeonchoi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/yoongeonchoi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
