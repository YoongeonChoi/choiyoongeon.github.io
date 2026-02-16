import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="site-container section page-hero">
      <p className="eyebrow">404</p>
      <h1 className="page-title">Page not found.</h1>
      <p className="page-lead">The URL may have changed during the redesign.</p>
      <div className="cta-row">
        <Link href="/" className="btn btn-primary">
          Go home
        </Link>
        <Link href="/projects" className="btn btn-secondary">
          Browse projects
        </Link>
      </div>
    </section>
  );
}
