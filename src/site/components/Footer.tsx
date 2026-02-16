import Link from "next/link";
import { siteConfig } from "@/site/config";
import { SafeExternalLink } from "@/site/components/SafeExternalLink";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <section>
          <h2 className="footer-title">{siteConfig.name}</h2>
          <p className="footer-copy">
            Product engineer focused on secure shipping, measurable outcomes, and
            high-trust UX.
          </p>
        </section>

        <section>
          <h3 className="footer-heading">Navigate</h3>
          <ul className="footer-list">
            <li>
              <Link href="/projects" prefetch={false}>
                Projects
              </Link>
            </li>
            <li>
              <Link href="/blog" prefetch={false}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/resume" prefetch={false}>
                Resume
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="footer-heading">Connect</h3>
          <ul className="footer-list">
            <li>
              <SafeExternalLink href={siteConfig.github}>GitHub</SafeExternalLink>
            </li>
            <li>
              <SafeExternalLink href={siteConfig.linkedin}>LinkedIn</SafeExternalLink>
            </li>
            <li>
              <SafeExternalLink href={`mailto:${siteConfig.email}`}>{siteConfig.email}</SafeExternalLink>
            </li>
            <li>
              <a href="/feed.xml">RSS Feed</a>
            </li>
          </ul>
        </section>
      </div>
      <p className="site-container footer-meta">© {new Date().getFullYear()} {siteConfig.name}</p>
    </footer>
  );
}
