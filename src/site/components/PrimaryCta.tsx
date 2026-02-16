import Link from "next/link";
import { siteConfig } from "@/site/config";

export function PrimaryCta() {
  return (
    <div className="cta-row">
      <Link href="/projects" className="btn btn-primary">
        View Case Studies
      </Link>
      <a className="btn btn-secondary" href={`mailto:${siteConfig.email}`}>
        Contact Me
      </a>
    </div>
  );
}
