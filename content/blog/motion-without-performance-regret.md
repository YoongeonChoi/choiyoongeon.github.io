---
title: "Motion Without Performance Regret"
summary: "A practical pattern for premium motion design that still clears strong Lighthouse budgets."
date: "2026-01-20"
tags:
  - motion
  - performance
  - accessibility
category: "UX Engineering"
featured: true
---
## Motion should clarify, not decorate
Motion is most effective when it supports hierarchy and timing. If every block moves,
users lose context and page stability.

## Build from static first
Start from fully usable markup and no JavaScript assumptions. Add animation in layers:
- visual rhythm (CSS only)
- contextual reveal (IntersectionObserver)
- pointer-responsive accents

## Accessibility baseline
### Reduced-motion mode
Users with `prefers-reduced-motion` should get a coherent, non-animated experience.

### Keyboard parity
Hover states cannot be the only way to discover interactions.

## Performance budget notes
Keep large animation libraries out of the critical path. Use lazy loading only for truly
interactive media. Measure real route cost, not just bundle totals.
