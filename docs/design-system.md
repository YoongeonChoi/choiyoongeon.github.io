# Design System

## Direction
- Visual direction: editorial + premium product surface.
- Inspiration: temporal rhythm and compositional confidence (inspired by Plus X), but no copied assets or code.
- Principle: motion supports hierarchy and comprehension, never blocks content.

## Foundations

### Typography
- Display: `Fraunces` (headings).
- Body/UI: `Space Grotesk` (labels, paragraphs, controls).
- Scale:
  - Hero title: `clamp(2.35rem, 8vw, 6.2rem)`
  - Page titles: `clamp(2rem, 5vw, 4.2rem)`
  - Body: ~`1rem` to `1.2rem`
  - Eyebrow/meta: `0.75rem` to `0.9rem`

### Color tokens
- Core tokens are in `/src/app/globals.css` under `:root`.
- Light + dark theme token sets are both defined.
- Accent family uses warm orange (`--accent`) with stronger action tone (`--accent-strong`).

### Spacing and shape
- Fluid spacing tokens: `--space-xs` to `--space-xl`.
- Corner radii:
  - Small: `--radius-s`
  - Medium: `--radius-m`
  - Large: `--radius-l`

## Core Components
- Shell: sticky header, skip link, footer.
- Hero: positioning statement + CTA + hiring ticker.
- Content cards: reusable project/post cards with consistent metadata hierarchy.
- Article rendering: sanitized Markdown via `MarkdownArticle` component.
- Case-study sidebar: role, impact, stack, links, table of contents.

## Motion Rules
- Progressive enhancement only.
- Motion primitives:
  - Pointer-reactive gradient backdrop.
  - Scroll reveal transitions (`Reveal` component).
  - Horizontal signal ticker.
- Reduced motion:
  - `prefers-reduced-motion` disables animations and transitions.
  - `Reveal` resolves to visible state without motion.

## Accessibility Rules
- Keyboard first:
  - Skip link at top of document.
  - Visible focus ring for all interactive controls.
- Semantic structure:
  - Sequential heading order.
  - Landmarks (`header`, `main`, `footer`, `nav`, `section`, `article`).
- ARIA usage:
  - Only where semantic HTML is insufficient.

## Performance Rules
- Static generation for all pages.
- Minimize client-side JavaScript and avoid heavy animation frameworks in critical path.
- Disable eager prefetch on dense link clusters to reduce network contention.
- CI enforces Lighthouse thresholds (mobile emulation):
  - Performance >= 90
  - Accessibility >= 95
  - Best Practices >= 95
  - SEO >= 95

## Content Model
- Projects: Markdown frontmatter + body (`/content/projects`).
- Blog: Markdown frontmatter + body (`/content/blog`).
- Resume: typed data model (`/src/site/data/resume.ts`) and downloadable PDF (`/public/resume.pdf`).
