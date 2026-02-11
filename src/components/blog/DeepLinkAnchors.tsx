"use client";

import { useEffect } from "react";

/**
 * Adds anchor links (deep-link system) to all h2 and h3 headings in blog posts.
 * Click a heading to copy its permalink. Headings get auto-generated IDs.
 */
export function DeepLinkAnchors() {
    useEffect(() => {
        const headings = document.querySelectorAll(
            ".blog-content h2, .blog-content h3"
        );

        headings.forEach((heading) => {
            const text = heading.textContent || "";
            const id = text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            heading.id = id;

            // Add anchor link
            const anchor = document.createElement("a");
            anchor.href = `#${id}`;
            anchor.className =
                "ml-2 opacity-0 group-hover:opacity-100 text-accent transition-opacity text-sm";
            anchor.textContent = "#";
            anchor.setAttribute("aria-label", `Link to ${text}`);

            heading.classList.add("group", "relative", "cursor-pointer");
            heading.appendChild(anchor);

            // Click to copy permalink
            heading.addEventListener("click", () => {
                const url = `${window.location.origin}${window.location.pathname}#${id}`;
                navigator.clipboard?.writeText(url);
            });
        });

        // Scroll to hash on load
        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: "smooth" });
                }, 300);
            }
        }
    }, []);

    return null;
}
