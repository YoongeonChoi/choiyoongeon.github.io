import type { Metadata } from "next";
import { resumeData } from "@/site/data/resume";
import { siteConfig } from "@/site/config";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume summary, work history, and downloadable PDF.",
};

export default function ResumePage() {
  return (
    <section className="site-container section page-hero">
      <p className="eyebrow">Resume</p>
      <h1 className="page-title">Product engineering resume</h1>
      <p className="page-lead">{resumeData.summary}</p>

      <div className="cta-row" style={{ marginTop: "1.25rem" }}>
        <a href="/resume.pdf" className="btn btn-primary" download>
          Download PDF
        </a>
        <a href={`mailto:${siteConfig.email}`} className="btn btn-secondary">
          Request detailed CV
        </a>
      </div>

      <section className="resume-section">
        <h2>Experience</h2>
        {resumeData.experiences.map((entry) => (
          <article key={`${entry.company}-${entry.period}`} className="resume-item">
            <h3>{entry.role}</h3>
            <p className="resume-meta">
              {entry.company} · {entry.period}
            </p>
            <ul>
              {entry.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="resume-section">
        <h2>Education</h2>
        {resumeData.education.map((entry) => (
          <article key={`${entry.school}-${entry.period}`} className="resume-item">
            <h3>{entry.degree}</h3>
            <p className="resume-meta">
              {entry.school} · {entry.period}
            </p>
          </article>
        ))}
      </section>

      <section className="resume-section">
        <h2>Skill matrix</h2>
        <div className="list-columns">
          <div>
            <h3>Product</h3>
            <ul>
              {resumeData.skills.product.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Engineering</h3>
            <ul>
              {resumeData.skills.engineering.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Security</h3>
            <ul>
              {resumeData.skills.security.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </section>
  );
}
