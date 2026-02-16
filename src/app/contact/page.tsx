import type { Metadata } from "next";
import { siteConfig } from "@/site/config";
import { SafeExternalLink } from "@/site/components/SafeExternalLink";

export const metadata: Metadata = {
  title: "Contact",
  description: "Direct contact options for hiring, consulting, and collaboration.",
};

export default function ContactPage() {
  return (
    <section className="site-container section page-hero">
      <p className="eyebrow">Contact</p>
      <h1 className="page-title">Let&apos;s build something measurable.</h1>
      <p className="page-lead">
        Open to senior product engineering roles and selected contract work.
      </p>

      <div className="contact-block section">
        <p>
          Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </p>
        <p>
          GitHub: <SafeExternalLink href={siteConfig.github}>{siteConfig.github}</SafeExternalLink>
        </p>
        <p>
          LinkedIn: <SafeExternalLink href={siteConfig.linkedin}>{siteConfig.linkedin}</SafeExternalLink>
        </p>
      </div>
    </section>
  );
}
