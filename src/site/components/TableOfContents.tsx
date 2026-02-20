"use client";

import { useState } from "react";
import type { Heading } from "@/lib/content/types";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [open, setOpen] = useState(false);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="toc" aria-label="Table of contents">
      <button
        type="button"
        className="toc-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="toc-title">On this page</span>
        <svg
          className={`toc-chevron ${open ? "open" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <ul className={`toc-list ${open ? "open" : ""}`}>
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "nested" : ""}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
