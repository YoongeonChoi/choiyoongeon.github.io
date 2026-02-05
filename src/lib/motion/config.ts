/**
 * Motion Configuration
 * Centralized animation presets for consistent "Weighted Motion" across the platform
 * Based on Plus-X design language principles
 */

import type { Transition, Variants } from "framer-motion";

// ============================================
// SPRING PHYSICS PRESETS
// ============================================

export const springs = {
    /** Snappy interactions - buttons, toggles */
    snappy: {
        type: "spring" as const,
        stiffness: 400,
        damping: 28,
        mass: 1,
    },
    /** Smooth UI transitions - cards, modals */
    smooth: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        mass: 1,
    },
    /** Bouncy feedback - success states, notifications */
    bouncy: {
        type: "spring" as const,
        stiffness: 500,
        damping: 25,
        mass: 0.8,
    },
    /** Gentle floating - background elements */
    gentle: {
        type: "spring" as const,
        stiffness: 150,
        damping: 20,
        mass: 1.5,
    },
    /** Page transitions */
    page: {
        type: "spring" as const,
        stiffness: 250,
        damping: 35,
        mass: 1.2,
    },
} as const;

// ============================================
// DURATION TOKENS
// ============================================

export const durations = {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    cinematic: 0.8,
    dramatic: 1.2,
} as const;

// ============================================
// EASING FUNCTIONS
// ============================================

export const easings = {
    /** Smooth deceleration */
    smooth: [0.25, 0.46, 0.45, 0.94],
    /** Overshoot */
    bounce: [0.34, 1.56, 0.64, 1],
    /** Expo out - fast start, slow end */
    expoOut: [0.19, 1, 0.22, 1],
    /** Dramatic entrance */
    dramatic: [0.16, 1, 0.3, 1],
    /** Linear */
    linear: [0, 0, 1, 1],
} as const;

// ============================================
// STAGGER CONFIGURATIONS
// ============================================

export const stagger = {
    fast: 0.03,
    normal: 0.05,
    slow: 0.08,
    dramatic: 0.12,
} as const;

// ============================================
// TRANSITION PRESETS
// ============================================

export const transitions: Record<string, Transition> = {
    /** Default spring transition */
    default: springs.smooth,

    /** Fast tween for micro-interactions */
    fast: {
        duration: durations.fast,
        ease: easings.smooth,
    },

    /** Page entry animation */
    pageEnter: {
        ...springs.page,
        delay: 0.1,
    },

    /** Staggered children */
    staggerChildren: {
        staggerChildren: stagger.normal,
        delayChildren: 0.1,
    },
};

// ============================================
// VARIANT PRESETS
// ============================================

/** Fade in/out with subtle scale */
export const fadeScale: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: springs.smooth,
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        transition: { duration: durations.fast },
    },
};

/** Slide up reveal */
export const slideUp: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: springs.smooth,
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: durations.fast },
    },
};

/** Slide in from left */
export const slideLeft: Variants = {
    hidden: {
        opacity: 0,
        x: -20,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: springs.smooth,
    },
};

/** Slide in from right */
export const slideRight: Variants = {
    hidden: {
        opacity: 0,
        x: 20,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: springs.smooth,
    },
};

/** Container with staggered children */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: stagger.normal,
            delayChildren: 0.1,
        },
    },
};

/** Stagger item (child of staggerContainer) */
export const staggerItem: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: springs.smooth,
    },
};

/** Card hover effect */
export const cardHover: Variants = {
    rest: {
        scale: 1,
        y: 0,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
    },
    hover: {
        scale: 1.02,
        y: -4,
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
        transition: springs.snappy,
    },
    tap: {
        scale: 0.98,
        transition: { duration: durations.fast },
    },
};

/** Button interaction */
export const buttonHover: Variants = {
    rest: {
        scale: 1,
    },
    hover: {
        scale: 1.05,
        transition: springs.snappy,
    },
    tap: {
        scale: 0.95,
        transition: { duration: 0.1 },
    },
};

// ============================================
// REDUCED MOTION VARIANTS
// ============================================

/** Use these when prefers-reduced-motion is active */
export const reducedMotion: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.01 } },
    exit: { opacity: 0, transition: { duration: 0.01 } },
};

// ============================================
// SCROLL ANIMATION HELPERS
// ============================================

export const scrollFade = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: springs.smooth,
};

export const scrollScale = {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-50px" },
    transition: springs.gentle,
};
