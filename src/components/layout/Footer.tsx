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
            { href: "https://github.com/YoongeonChoi", label: "GitHub", external: true },
        ],
    },
];

export function Footer() {
  return (
    <footer className="mt-24 pb-12 pt-6">
      <div className="site-container">
        <div className="frosted-panel p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-lg font-semibold tracking-[-0.03em] text-text-primary">Nexus</span>
                <span className="text-xs uppercase tracking-[0.2em] text-text-secondary">PR</span>
              </div>
              <p className="max-w-xs text-sm text-text-secondary">
                Spatial portfolio and blog platform focused on high-trust product
                engineering.
              </p>
            </div>

            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <h4 className="mb-3 text-xs uppercase tracking-[0.18em] text-text-muted">
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
                          className="text-sm text-text-secondary transition-colors hover:text-accent"
                        >
                          {link.label} ↗
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-text-secondary transition-colors hover:text-accent"
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

          <div className="mt-8 border-t border-border-default pt-5 text-xs text-text-muted md:flex md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Yoongeon Choi.</p>
            <p className="mt-2 md:mt-0">Built with Next.js 16 · Framer Motion · Three.js</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
