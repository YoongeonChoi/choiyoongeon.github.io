import type { Metadata } from "next";
import { getAllProjects } from "@/lib/content";
import { ProjectCard } from "@/site/components/ProjectCard";
import { Reveal } from "@/site/components/Reveal";

export const metadata: Metadata = {
  title: "Projects",
  description: "Portfolio case studies with role, technical choices, and measurable impact.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <section className="site-container section page-hero">
      <p className="eyebrow">Portfolio</p>
      <h1 className="page-title">Case studies built for hiring conversations.</h1>
      <p className="page-lead">
        Each project documents problem framing, technical decisions, security posture,
        and measurable outcomes.
      </p>

      <div className="content-grid section">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delayMs={70 * index}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
