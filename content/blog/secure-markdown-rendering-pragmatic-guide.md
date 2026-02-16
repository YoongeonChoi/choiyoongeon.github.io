---
title: "Secure Markdown Rendering: A Pragmatic Guide"
summary: "Why markdown rendering pipelines fail, and how to harden them with sanitizer-first parsing."
date: "2025-11-02"
tags:
  - security
  - markdown
  - xss
category: "Security"
featured: false
---
## Where Markdown rendering goes wrong
The most common failure is trusting content too early and injecting generated HTML without
sanitization.

## Minimal safe pipeline
- Parse Markdown to syntax tree.
- Convert to HTML tree without dangerous raw HTML.
- Sanitize to an allowlist schema.
- Render final output.

```ts
const html = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeStringify)
  .process(markdown);
```

## Link hygiene
Any external links should include `rel="noopener noreferrer"` and restrict protocols to
`https`, `mailto`, and `tel`.

## CI enforcement
Automated checks should fail build on `eval`, `innerHTML` assignments, or uncontrolled
`dangerouslySetInnerHTML` usage.
