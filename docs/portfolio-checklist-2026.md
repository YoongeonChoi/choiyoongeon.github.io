# 2026 PR Site Checklist

Last updated: February 16, 2026

## Assumptions
- Personal brand focus: senior product engineering + security + UI motion.
- No private CMS; content is repository-managed.
- Hosting remains GitHub Pages.

## Prioritized Checklist

### P0 — Must-have hiring signals

- Clear positioning above the fold
  Why: Recruiters and hiring managers should understand role fit within seconds.
  Implemented: Home hero now states role, differentiators, and CTA.

- Case studies with explicit ownership and impact metrics
  Why: Strong portfolios describe context, decisions, and outcomes rather than screenshots alone.
  Source: [UXfolio case study guidance](https://www.uxfolio.com/blog/how-to-write-ux-case-study), [CareerFoundry portfolio guidance](https://careerfoundry.com/en/blog/ui-design/how-to-make-portfolio-website/)
  Implemented: `/projects` and `/projects/[slug]` include role, impact list, stack, and decision narrative.

- Fast, crawlable, static-first architecture
  Why: Search visibility and recruiter trust improve with fast load and indexable pages.
  Source: [Optimize LCP](https://web.dev/articles/optimize-lcp), [Google title links](https://developers.google.com/search/docs/advanced/appearance/title-link?hl=en&rd=1&visit_id=638975282048764999-4035584271), [Google snippets](https://developers.google.com/search/docs/appearance/snippet?hl=en&visit_id=638975280390749894-3291662178&rd=1)
  Implemented: Static export, route metadata, sitemap, robots, RSS, and route-level SEO metadata.

- Contact path with low friction
  Why: Hiring conversion drops when contact options are buried.
  Implemented: Dedicated `/contact` page, footer contact links, and mail CTA.

### P1 — Differentiators

- Motion design with intentional rhythm and reduced-motion parity
  Why: Premium interaction can improve narrative pacing when it does not block content.
  Sources: [WCAG technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html), [Plus X reference profile](https://www.awwwards.com/sites/plus-ex-website)
  Implemented: Pointer-responsive backdrop, reveal choreography, ticker rhythm, and `prefers-reduced-motion` fallback.

- Writer-friendly blog with taxonomy
  Why: Thought leadership and technical depth are easier to evaluate through structured writing.
  Source: [UXfolio content/case-study guidance](https://www.uxfolio.com/blog/how-to-write-ux-case-study)
  Implemented: Markdown posts, tag/category archives, reading-time metadata, RSS feed, and syntax highlighting.

- Accessibility-first interaction model
  Why: Accessibility is a quality signal for senior engineering maturity.
  Sources: [WCAG focus order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html), [WAI-ARIA guidance](https://www.w3.org/WAI/standards-guidelines/aria/)
  Implemented: Skip link, heading hierarchy fixes, focus styling, keyboard-safe navigation, and reduced-motion handling.

### P2 — Operational trust

- CI quality gates and security checks
  Why: Stable engineering signals include repeatable quality controls, not one-time polish.
  Sources: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
  Implemented: CI workflow runs lint, typecheck, security static checks, dependency audit, build, and Lighthouse thresholds.

- Domain and deployment hygiene
  Why: Custom domain misconfiguration can introduce takeover risk.
  Sources: [Managing custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [Verifying custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages), [Secure with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
  Implemented: Documented in security audit with verification steps and residual-risk notes.

## What was implemented from this checklist

- Home positioning + CTA + hiring signal strip.
- Case-study-first project architecture.
- Markdown blog with tags/categories and static generation.
- RSS (`/feed.xml`), `sitemap.xml`, and `robots.txt`.
- Security hardening pass (sanitized Markdown pipeline, CSP strategy, static checks, CI gates).
- Resume web view and downloadable PDF.
- Contact conversion path.

## Remaining optional upgrades

- Replace placeholder project/post content with production narratives and real metrics.
- Add multilingual content strategy (Korean + English routes).
- Add analytics-based funnel tracking for recruiter conversion.
