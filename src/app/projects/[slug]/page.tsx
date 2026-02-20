import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { MarkdownArticle } from "@/site/components/MarkdownArticle";
import { SafeExternalLink } from "@/site/components/SafeExternalLink";
import { TableOfContents } from "@/site/components/TableOfContents";

type Params = { slug: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      url: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="site-container section page-hero">
      <Link href="/projects" className="text-link" prefetch={false}>
        ← Back to projects
      </Link>

      <p className="eyebrow" style={{ marginTop: "1rem" }}>
        {project.timeline}
      </p>
      <h1 className="page-title">{project.title}</h1>
      <p className="page-lead">{project.summary}</p>

      <div className="case-layout">
        <div>
          <MarkdownArticle html={project.html} />
        </div>

        <aside className="case-meta">
          <h2>Role</h2>
          <p>{project.role}</p>

          <h3>Impact</h3>
          <ul>
            {project.impact.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>Stack</h3>
          <div className="chip-row">
            {project.stack.map((item) => (
              <span key={item} className="chip muted">
                {item}
              </span>
            ))}
          </div>

          <h3>Links</h3>
          <div className="chip-row">
            {project.links.demo ? (
              <SafeExternalLink href={project.links.demo} className="chip">
                Live
              </SafeExternalLink>
            ) : null}
            {project.links.repo ? (
              <SafeExternalLink href={project.links.repo} className="chip">
                Repo
              </SafeExternalLink>
            ) : null}
            {project.links.caseStudy ? (
              <SafeExternalLink href={project.links.caseStudy} className="chip">
                External write-up
              </SafeExternalLink>
            ) : null}
          </div>

          <TableOfContents headings={project.headings} />
        </aside>
      </div>
    </section>
  );
}
