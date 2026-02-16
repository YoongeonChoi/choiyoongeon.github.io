# YoongeonChoi.github.io

Static, security-hardened personal PR/portfolio site built with Next.js static export for GitHub Pages.

## Features
- Case-study-first portfolio (`/projects` + project detail routes)
- Writer-friendly Markdown blog with:
  - index and post pages
  - tags and categories
  - syntax highlighting
  - RSS feed (`/feed.xml`)
- Resume page + downloadable PDF (`/resume` + `/resume.pdf`)
- Contact conversion path (`/contact`)
- SEO essentials:
  - per-route metadata
  - OpenGraph/Twitter defaults
  - `sitemap.xml`
  - `robots.txt`
- Security hardening:
  - sanitized Markdown pipeline
  - static anti-pattern security scanner
  - dependency audit gate
  - GitHub Actions CI + Lighthouse threshold checks

## Tech Stack
- Next.js (App Router) with `output: "export"`
- TypeScript
- Tailwind CSS v4 (global tokenized CSS system)
- Unified/Remark/Rehype Markdown pipeline

## Project Structure
- `content/blog/` Markdown blog posts
- `content/projects/` Markdown project case studies
- `src/app/` routes and metadata endpoints
- `src/site/` design system components and site config
- `src/lib/content/` content loading + markdown rendering
- `scripts/` RSS generation, security check, Lighthouse check
- `docs/` security/design/research documentation

## Local Development

### 1) Install dependencies
```bash
npm ci
```

### 2) Run dev server
```bash
npm run dev
```

### 3) Quality checks
```bash
npm run lint
npm run typecheck
npm run security:check
npm run audit
```

### 4) Full verification (same as deploy gate)
```bash
npm run verify
```

### 5) Lighthouse threshold check (mobile emulation)
```bash
npm run lighthouse:check
```

## Build and Export
```bash
npm run build
```
This runs:
1. `generate:rss` (creates `public/feed.xml`)
2. `next build` static export to `out/`

## GitHub Pages Deployment
Deployment uses `.github/workflows/deploy.yml`.

Pipeline steps:
1. `npm ci`
2. `npm run verify`
3. add `out/404.html` fallback + `.nojekyll`
4. upload `out/` artifact
5. deploy with `actions/deploy-pages`

## CI
`.github/workflows/ci.yml` runs on PR/push:
- lint
- typecheck
- security static checks
- dependency audit
- build
- Lighthouse threshold validation

## Security Notes
- Threat model and findings: `docs/security-audit.md`
- Design and motion/a11y rules: `docs/design-system.md`
- 2026 portfolio checklist and citations: `docs/portfolio-checklist-2026.md`

## Content Editing
- Add/edit posts in `content/blog/*.md`
- Add/edit projects in `content/projects/*.md`
- Update site metadata in `src/site/config.ts`
- Update resume content in `src/site/data/resume.ts`
