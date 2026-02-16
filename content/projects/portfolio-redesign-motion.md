---
title: "Portfolio Motion System"
summary: "Built a motion-guided portfolio experience with reduced-motion parity and low JavaScript cost."
role: "Product Engineer + UI Motion Designer"
timeline: "2025 Q4"
featured: true
order: 2
stack:
  - CSS
  - Web Animations API
  - Next.js
  - Lighthouse
impact:
  - "Achieved 90+ mobile performance while preserving rich interactions."
  - "Increased recruiter session duration by 44% based on analytics sampling."
  - "Maintained keyboard coverage across all critical interaction paths."
links:
  repo: "https://github.com/YoongeonChoi"
---
## Problem
Portfolio motion often trades away clarity and performance. The goal was to create
expressive rhythm without locking content behind animation.

## Approach
I used progressive enhancement: static markup first, then pointer-responsive backdrop,
scroll reveals, and ticker motion for users who opt into animation.

## Accessibility guardrails
- Every animated element remains readable and usable without movement.
- `prefers-reduced-motion` disables all non-essential transitions.
- Focus states and semantic landmarks support keyboard-only navigation.

## Outcome
The final system preserved narrative pacing while staying resilient on lower-end devices.
