import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Background, working style, and product engineering principles of Yoongeon Choi.",
};

const careerTimeline = [
  {
    year: "2018",
    title: "Started building web products",
    detail:
      "Moved from basic scripting into production-oriented web development, focusing on JavaScript fundamentals and deployable interfaces.",
  },
  {
    year: "2019",
    title: "Shipped first user-facing projects",
    detail:
      "Built portfolio and client-style projects end-to-end, learning to balance visual design, maintainability, and delivery speed.",
  },
  {
    year: "2020",
    title: "Expanded into full-stack + security foundations",
    detail:
      "Began backend integration work and adopted secure coding habits, including input validation, safer auth patterns, and deployment checks.",
  },
  {
    year: "2021-2023",
    title: "Full-Stack Engineer at growth-stage teams",
    detail:
      "Delivered customer-facing features with React and TypeScript, collaborated with design/PM, and improved reliability through typed contracts and CI discipline.",
  },
  {
    year: "2023-2025",
    title: "Senior Product Engineer (independent)",
    detail:
      "Led static-first platform builds, strengthened release security posture, and designed portfolio-grade case studies around measurable outcomes.",
  },
  {
    year: "2026",
    title: "Security-hardened portfolio system",
    detail:
      "Redesigned this site into a hiring-ready PR platform with Markdown publishing, CI security gates, accessibility-first motion, and high Lighthouse targets.",
  },
] as const;

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
        <h2>Timeline (as of 2026)</h2>
        <ul className="timeline" aria-label="Career timeline">
          {careerTimeline.map((entry) => (
            <li key={entry.year} className="timeline-item">
              <p className="timeline-year">{entry.year}</p>
              <h3 className="timeline-title">{entry.title}</h3>
              <p className="timeline-copy">{entry.detail}</p>
            </li>
          ))}
        </ul>
        <p className="timeline-note">
          This timeline follows a recruiter-friendly chronological format commonly used in
          2026 developer portfolios and case-study resumes.
        </p>
      </div>

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
