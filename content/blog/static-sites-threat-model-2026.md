---
title: "Threat Modeling a Static Portfolio Site in 2026"
summary: "How to threat-model a GitHub Pages portfolio and prioritize controls that actually matter."
date: "2026-02-01"
updated: "2026-02-05"
tags:
  - security
  - github-pages
  - threat-modeling
category: "Security"
featured: true
---
## Why model threats for a static site?
Even static sites can become attack surfaces through CI pipelines, compromised dependencies,
unsafe markdown rendering, or insecure third-party scripts.

## Entry points
### Content pipeline
If Markdown or MDX is processed unsafely, malicious payloads can become stored XSS.

### Build and deployment
Compromised dependencies or over-permissive workflow tokens can alter generated output.

### External links and embeds
Third-party scripts and embeds can exfiltrate data or degrade trust if not isolated.

## Controls that return the most value
- Sanitize rendered HTML and avoid unsanitized runtime injection.
- Keep CSP strict within GitHub Pages constraints.
- Lock CI permissions to least privilege.
- Run dependency audit and static checks on each pull request.

## Verification checklist
1. Run dependency and static security checks in CI.
2. Confirm no uncontrolled `dangerouslySetInnerHTML` usage.
3. Verify reduced attack surface by minimizing runtime scripts.
