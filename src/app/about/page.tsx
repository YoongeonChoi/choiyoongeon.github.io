import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Background, working style, and product engineering principles of Yoongeon Choi.",
};

export default function AboutPage() {
  return (
    <section className="site-container section page-hero">
      <p className="eyebrow">About</p>
      <h1 className="page-title">Engineering with product context and security depth.</h1>
      <p className="page-lead">
        I work at the intersection of product strategy, front-end architecture, and
        secure delivery. My default approach is to keep systems simple, measurable,
        and defensible: static-first rendering, progressive enhancement, and explicit
        threat modeling before release.
      </p>

      <div className="resume-section">
        <h2>How I work</h2>
        <ul>
          <li>Start with goals, constraints, and a verification plan.</li>
          <li>Ship minimal architecture that can evolve without rewrites.</li>
          <li>Use motion intentionally to support hierarchy, not decoration.</li>
          <li>Design for keyboard users and reduced-motion users by default.</li>
          <li>Treat supply-chain and CI as part of product quality.</li>
        </ul>
      </div>
    </section>
  );
}
