"use client";

import { useState, useEffect } from "react";

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

/**
 * Auto-generated table of contents from h2/h3 headings in blog content.
 * Highlights the active section based on scroll position.
 */
export function TableOfContents() {
    const [items, setItems] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
        const headings = document.querySelectorAll(
            ".blog-content h2, .blog-content h3"
        );
        const tocItems: TOCItem[] = [];

        headings.forEach((heading) => {
            if (heading.id) {
                tocItems.push({
                    id: heading.id,
                    text: heading.textContent?.replace("#", "").trim() || "",
                    level: heading.tagName === "H2" ? 2 : 3,
                });
            }
        });

        setItems(tocItems);
    }, []);

    useEffect(() => {
        if (items.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
        );

        items.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [items]);

    if (items.length === 0) return null;

    return (
        <nav className="hidden xl:block sticky top-24 w-56">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                On this page
            </h4>
            <ul className="space-y-1 border-l border-border-default">
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(item.id)?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }}
                            className={`block text-xs py-1 transition-all duration-200 ${item.level === 3 ? "pl-6" : "pl-3"
                                } ${activeId === item.id
                                    ? "text-accent border-l-2 border-accent -ml-px font-medium"
                                    : "text-text-muted hover:text-text-primary"
                                }`}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
