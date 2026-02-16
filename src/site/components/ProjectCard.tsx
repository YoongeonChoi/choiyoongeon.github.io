import Link from "next/link";
import type { ProjectEntry } from "@/lib/content/types";

interface ProjectCardProps {
  project: ProjectEntry;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="content-card project-card">
      <p className="eyebrow">{project.role}</p>
      <h2 className="card-title">
        <Link href={`/projects/${project.slug}`} prefetch={false}>
          {project.title}
        </Link>
      </h2>
      <p className="card-summary">{project.summary}</p>
      <ul className="impact-list" aria-label="Impact metrics">
        {project.impact.slice(0, 2).map((metric) => (
          <li key={metric}>{metric}</li>
        ))}
      </ul>
      <div className="chip-row" aria-label="Tech stack">
        {project.stack.slice(0, 5).map((item) => (
          <span key={item} className="chip muted">
            {item}
          </span>
        ))}
      </div>
      <Link href={`/projects/${project.slug}`} className="text-link" prefetch={false}>
        View case study
      </Link>
    </article>
  );
}
