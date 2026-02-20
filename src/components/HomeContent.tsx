"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { BentoGrid, BentoCard } from "@/components/bento/BentoGrid";
import { ProfileCard } from "@/components/bento/ProfileCard";
import { TechStackCard } from "@/components/bento/TechStackCard";
import { LatestPostsCard } from "@/components/bento/LatestPostsCard";
import { ContactCard } from "@/components/bento/ContactCard";
import { StatsCard } from "@/components/bento/StatsCard";
import { ContributionGrass } from "@/components/github/ContributionGrass";
import { SignalVisualizer } from "@/components/motion/SignalVisualizer";
import type { BlogPost } from "@/lib/supabase/types";

interface GitHubGrassCardProps {
  username: string;
  scrollEnergy: number;
}

function GitHubGrassCardContent({ username, scrollEnergy }: GitHubGrassCardProps) {
  return (
    <ErrorBoundary>
      <ContributionGrass username={username} scrollEnergy={scrollEnergy} />
    </ErrorBoundary>
  );
}

interface HomeContentProps {
  latestPosts: BlogPost[];
  githubUsername: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function SpatialBentoSection({
  scrollYProgress,
  motionEnergy,
  latestPosts,
  githubUsername,
}: {
  scrollYProgress: MotionValue<number>;
  motionEnergy: number;
  latestPosts: BlogPost[];
  githubUsername: string;
}) {
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -85]);
  const gridRotateX = useTransform(scrollYProgress, [0, 1], [0.3, -1.8]);
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  return (
    <motion.section
      style={{
        y: gridY,
        rotateX: gridRotateX,
        scale: gridScale,
        transformPerspective: 1400,
      }}
      className="mt-[clamp(1.5rem,4vw,5.2rem)]"
    >
      <BentoGrid>
        <BentoCard delay={1} depth={0.02}>
          <ProfileCard />
        </BentoCard>

        <BentoCard colSpan={2} delay={2} depth={0.04}>
          <GitHubGrassCardContent
            username={githubUsername}
            scrollEnergy={motionEnergy}
          />
        </BentoCard>

        <BentoCard delay={3} depth={0.03}>
          <TechStackCard />
        </BentoCard>

        <BentoCard delay={4} depth={0.04}>
          <LatestPostsCard posts={latestPosts} />
        </BentoCard>

        <BentoCard delay={5} depth={0.02}>
          <StatsCard />
        </BentoCard>

        <BentoCard colSpan={3} delay={6} depth={0.03}>
          <ContactCard />
        </BentoCard>
      </BentoGrid>
    </motion.section>
  );
}

/* MotionBand removed — replaced by SignalVisualizer */

/**
 * Home page client component with the Bento Grid layout.
 * Separated from page.tsx to enable client-side interactivity.
 */
export function HomeContent({
  latestPosts,
  githubUsername,
}: HomeContentProps) {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const [motionEnergy, setMotionEnergy] = useState(0);

  const { scrollY, scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 30, stiffness: 260 });

  const heroScale = useTransform(smoothVelocity, [-2600, 0, 2600], [0.95, 1, 1.06]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -64]);
  const eyebrowY = useTransform(scrollYProgress, [0, 1], [0, -35]);

  useMotionValueEvent(smoothVelocity, "change", (current) => {
    const next = clamp(Math.abs(current) / 2200, 0, 1);
    setMotionEnergy(next);
  });

  useEffect(() => {
    if (reducedMotion || !titleRef.current) {
      return;
    }

    const title = titleRef.current;
    const setY = gsap.quickTo(title, "yPercent", { duration: 0.45, ease: "power3.out" });
    const setStretch = gsap.quickTo(title, "--kinetic-stretch", {
      duration: 0.35,
      ease: "power3.out",
    });

    const unsubscribe = smoothVelocity.on("change", (current) => {
      const ratio = clamp(current / 1200, -1, 1);
      setY(ratio * 5);
      setStretch(1 + Math.abs(ratio) * 0.12);
    });

    return () => {
      unsubscribe();
    };
  }, [reducedMotion, smoothVelocity]);

  const kineticStyle = useMemo(
    () => ({
      scale: reducedMotion ? 1 : heroScale,
      y: reducedMotion ? 0 : heroY,
      transformPerspective: 1500,
    }),
    [heroScale, heroY, reducedMotion]
  );

  return (
    <main ref={containerRef} className="site-container pt-20 pb-12 md:pt-28 md:pb-20">
      <section className="grid gap-4 md:gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <motion.section
          style={{ y: eyebrowY }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-2 md:mb-3"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] md:px-4 md:py-2 md:text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Nexus-PR Motion System 2026
          </p>
        </motion.section>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-right lg:block"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Focus</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Spatial UI · Soft Physics · 3D Sync</p>
        </motion.div>
      </section>

      <motion.section style={kineticStyle} className="relative mb-3 md:mb-5">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl text-[var(--heading-xl)] leading-[0.88] font-semibold tracking-[-0.04em] text-[var(--heading)] [transform-style:preserve-3d]"
        >
          <span
            ref={titleRef}
            className="[transform:scaleY(var(--kinetic-stretch,1))] origin-center block will-change-transform"
          >
            Spatially crafted
          </span>
          <span className="gradient-text block">digital narrative</span>
        </motion.h1>
      </motion.section>

      <section className="grid gap-4 md:gap-6 md:grid-cols-[1.3fr_0.7fr] md:items-end">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-[clamp(0.92rem,0.7rem+1vw,1.4rem)] text-[var(--text-muted)] leading-relaxed"
        >
          Plus-X inspired premium minimalism, kinetic typography, and synchronized 3D
          contribution landscapes deliver one coherent UI/UX language across mobile and desktop.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-2"
        >
          <div className="glass-inset px-3 py-2 text-center">
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Performance</p>
            <p className="mt-1 text-xs md:text-sm text-[var(--text)]">120fps-tuned</p>
          </div>
          <div className="glass-inset px-3 py-2 text-center">
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Responsive</p>
            <p className="mt-1 text-xs md:text-sm text-[var(--text)]">Container-first</p>
          </div>
        </motion.div>
      </section>

      <SignalVisualizer energy={motionEnergy} />

      <SpatialBentoSection
        scrollYProgress={scrollYProgress}
        motionEnergy={motionEnergy}
        latestPosts={latestPosts}
        githubUsername={githubUsername}
      />
    </main>
  );
}
