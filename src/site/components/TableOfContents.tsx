import type { Heading } from "@/lib/content/types";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="toc" aria-label="Table of contents">
      <p className="toc-title">On this page</p>
      <ul>
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "nested" : ""}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
