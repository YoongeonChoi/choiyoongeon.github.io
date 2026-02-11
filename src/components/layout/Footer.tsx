import Link from "next/link";

const FOOTER_LINKS = [
    {
        title: "Navigation",
        links: [
            { href: "/", label: "Home" },
            { href: "/blog", label: "Blog" },
        ],
    },
    {
        title: "Connect",
        links: [
            { href: "https://github.com/choiyoongeon", label: "GitHub", external: true },
        ],
    },
];

export function Footer() {
    return (
        <footer
            className="mt-24 border-t"
            style={{ borderColor: "var(--border-default)" }}
        >
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold gradient-text">Nexus</span>
                            <span className="text-xl font-light text-text-primary">PR</span>
                        </div>
                        <p className="text-sm text-text-secondary max-w-xs">
                            A zero-trust personal PR & blog platform, built with Next.js and
                            secured with enterprise-grade protocols.
                        </p>
                    </div>

                    {/* Link Groups */}
                    {FOOTER_LINKS.map((group) => (
                        <div key={group.title}>
                            <h4 className="text-sm font-semibold text-text-primary mb-4">
                                {group.title}
                            </h4>
                            <ul className="space-y-2">
                                {group.links.map((link) => (
                                    <li key={link.href}>
                                        {"external" in link && link.external ? (
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-text-secondary hover:text-accent transition-colors"
                                            >
                                                {link.label} ↗
                                            </a>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className="text-sm text-text-secondary hover:text-accent transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div
                    className="mt-12 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4"
                    style={{ borderColor: "var(--border-default)" }}
                >
                    <p className="text-xs text-text-muted">
                        © {new Date().getFullYear()} Yoongeon Choi. All rights reserved.
                    </p>
                    <p className="text-xs text-text-muted">
                        Built with Next.js · Secured by Supabase · Deployed on GitHub Pages
                    </p>
                </div>
            </div>
        </footer>
    );
}
