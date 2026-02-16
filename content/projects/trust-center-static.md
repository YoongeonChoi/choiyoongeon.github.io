---
title: "Zero-Trust Trust Center"
summary: "Redesigned a security trust center as a static-first product surface with auditable change history and incident communication playbooks."
role: "Lead Product Engineer"
timeline: "2025 Q3"
featured: true
order: 1
stack:
  - Next.js
  - TypeScript
  - GitHub Actions
  - Markdown
  - Cloudflare
impact:
  - "Reduced time-to-publish for policy updates from 2 days to under 2 hours."
  - "Improved organic traffic to compliance pages by 38% in 8 weeks."
  - "Dropped Lighthouse accessibility regressions to zero across releases."
links:
  demo: "https://example.com"
  repo: "https://github.com/YoongeonChoi"
---
## Problem
The previous trust center lived behind a CMS workflow that introduced release delays and
made it hard to verify who changed security-critical wording.

## Approach
I replaced the authoring flow with versioned Markdown and a static build pipeline.
Every update required pull-request review and security sign-off before publish.

## Security decisions
- Enforced sanitized markdown rendering and banned runtime HTML injection.
- Added CI checks for dependency risk and anti-pattern scanning.
- Adopted a strict meta CSP baseline for GitHub Pages deployment.

## Outcome
The trust center became easier to audit and materially faster to update during incident
communication windows.
