---
title: "Writer-First Blog Engine"
summary: "Implemented a secure Markdown publishing workflow with tags, categories, RSS, and static SEO artifacts."
role: "Full-Stack Product Engineer"
timeline: "2026 Q1"
featured: true
order: 3
stack:
  - Markdown
  - Rehype
  - Zod
  - GitHub Pages
  - RSS
impact:
  - "Cut publishing friction by replacing database-managed posts with local Markdown." 
  - "Enabled deterministic, reviewable content output for every article release."
  - "Shipped SEO essentials: sitemap, robots, OG metadata, and feed XML."
links:
  demo: "https://example.com/blog"
  repo: "https://github.com/YoongeonChoi"
---
## Problem
The previous blog pipeline relied on runtime data sources and unsafe rendering patterns,
which increased attack surface and build fragility.

## Approach
I moved content to repository-managed Markdown and built a sanitizing parser pipeline.
The build now creates static pages, feed output, and metadata routes in one workflow.

## Security hardening
- Reject dangerous runtime patterns in CI.
- Sanitize generated HTML and restrict allowed URI schemes.
- Keep external links isolated with `noopener noreferrer`.

## Outcome
The blog now behaves as a stable documentation surface with lower operational risk.
