"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Handles the redirection from the 404.html hack for GitHub Pages SPA
export function RedirectHandler() {
    const router = useRouter();

    useEffect(() => {
        const { search } = window.location;
        if (search) {
            const params = new URLSearchParams(search);
            const p = params.get("p");
            if (p) {
                // Decode path and query
                const decodedPath = p;
                const q = params.get("q");
                const targetUrl = decodedPath + (q ? `?${q.replace(/~and~/g, "&")}` : "");

                // Replace current history entry to clean URL
                window.history.replaceState(null, "", targetUrl);
                // Let Next.js handle the routing
                router.replace(targetUrl);
            }
        }
    }, [router]);

    return null;
}
