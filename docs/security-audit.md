# Security Audit

Last updated: February 16, 2026

## Scope
- Repository: `YoongeonChoi.github.io`
- Target: static GitHub Pages deployment
- Reviewed surfaces: content pipeline, front-end rendering, CI/CD workflows, dependency graph, and deployment configuration

## Threat Model (Static GitHub Pages)

### Assets
- Portfolio and blog content integrity
- Recruiter trust signals (authentic links, contact paths, case studies)
- Build/deploy pipeline integrity

### Adversaries
- Opportunistic script injection via unsafe Markdown or HTML rendering
- Dependency/supply-chain compromise via transitive packages
- Domain misconfiguration abuse (subdomain takeover scenarios)
- Unauthorized content changes via weak CI controls

### Entry points
- Markdown content and frontmatter
- External links and embeds
- Build scripts and GitHub Actions workflows
- Dependency updates (`npm` ecosystem)
- DNS/custom-domain settings

## Findings (Before Hardening)

1. High: Unsafe markdown-to-HTML conversion with uncontrolled `dangerouslySetInnerHTML`
   - Risk: Stored XSS if untrusted/unsafe content reached renderer.
   - Fix: Replaced with sanitizer-first unified pipeline (`remark -> rehype-sanitize -> stringify`) and restricted URI protocols.

2. High: Runtime/data complexity and privileged content-fetch pattern
   - Risk: Build-time privileged data flow (service keys) and broader operational attack surface.
   - Fix: Migrated to repository-managed Markdown content for blog/projects; removed runtime Supabase dependency from site rendering path.

3. Medium: Weak CSP posture and invalid meta directive expectations
   - Risk: Previous policy included permissive script settings and relied on directives not enforceable in `<meta>`.
   - Fix: Rewrote CSP baseline for static hosting and removed `frame-ancestors` from meta policy.
   - Note: CSP delivered via meta has limitations; `frame-ancestors` is ignored in meta-delivered CSP per spec.

4. Medium: Missing automated security gates in CI
   - Risk: Regressions can be merged without static security checks.
   - Fix: Added CI workflow with lint, typecheck, `npm audit --audit-level=high`, custom anti-pattern scanner, build, and Lighthouse thresholds.

5. Medium: Excessive client/runtime surface from heavy motion stack
   - Risk: Larger attack surface and weaker performance reliability.
   - Fix: Removed heavy runtime motion stack from active routes and replaced with CSS/progressive enhancement.

6. Low: Accessibility regressions affecting trust and usability
   - Risk: Inconsistent heading order and label mismatches can hurt usability and compliance posture.
   - Fix: Corrected heading hierarchy, accessible names, and contrast edge cases.

## Hardening Implemented

- Content safety:
  - Sanitized Markdown rendering with allowlist schema.
  - External link hardening (`noopener noreferrer`, protocol restrictions).
  - Controlled `dangerouslySetInnerHTML` usage in a single audited component.

- Browser policy:
  - Meta CSP baseline for static hosting.
  - Referrer policy, permissions policy, and nosniff meta headers.

- CI/CD and dependency hygiene:
  - Added `ci.yml` quality gates.
  - Added `security-check.mjs` to fail on `eval`, `innerHTML` assignment, unsafe HTTP URLs, and unauthorized DSIH usage.
  - Enforced high-severity dependency audit threshold.

- Deployment hardening:
  - Simplified GitHub Pages deploy workflow with least-required permissions.
  - Static export verification and artifact-only deployment.

## Verification Evidence

- `npm run verify` passes: lint + typecheck + security check + build.
- `npm run audit` reports 0 vulnerabilities at high threshold.
- `npm run lighthouse:check` passes mobile thresholds:
  - Home: Performance 98, Accessibility 96, Best Practices 100, SEO 100
  - Blog: Performance 98, Accessibility 96, Best Practices 100, SEO 100

## Baseline vs Current (Measured)

- Baseline (before redesign, mobile emulation):
  - Home: Perf 51, A11y 100, Best 100, SEO 100
  - Blog: Perf 55, A11y 98, Best 100, SEO 100
- Current (after hardening/redesign, mobile emulation with compressed serving in check script):
  - Home: Perf 98, A11y 96, Best 100, SEO 100
  - Blog: Perf 98, A11y 96, Best 100, SEO 100

## Residual Risks

- GitHub Pages header control limitations:
  - Meta CSP cannot fully replace response-header CSP behavior.
  - If strict response-header CSP is required, front with Cloudflare/another CDN that can set headers.

- Domain hygiene remains operational:
  - Custom domain verification and DNS hygiene must be maintained to reduce takeover risk.

- Content trust model:
  - Markdown is treated as repository-trusted content. If external authoring is introduced, add moderation and provenance checks.

## Verification Steps

1. Install and build from clean checkout:
   - `npm ci`
   - `npm run verify`
2. Security checks:
   - `npm run security:check`
   - `npm run audit`
3. Lighthouse thresholds:
   - `npm run lighthouse:check`
4. Inspect generated static artifacts:
   - `out/`, `out/sitemap.xml`, `out/robots.txt`, `public/feed.xml`

## References

- CSP meta limitations: [W3C CSP3 meta element](https://www.w3.org/TR/CSP3/#meta-element)
- Reduced motion technique: [WCAG Technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html)
- Focus order guidance: [WCAG 2.1 Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html)
- GitHub Pages workflows: [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- GitHub custom domain management: [Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- Domain verification: [Verifying custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- HTTPS for Pages: [Securing your GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- LCP optimization: [web.dev optimize LCP](https://web.dev/articles/optimize-lcp)
- INP optimization: [web.dev optimize INP](https://web.dev/articles/optimize-inp)
