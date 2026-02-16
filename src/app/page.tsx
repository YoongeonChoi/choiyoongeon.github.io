import Link from "next/link";
import { getFeaturedProjects, getLatestPosts } from "@/lib/content";
import { PrimaryCta } from "@/site/components/PrimaryCta";
import { ProjectCard } from "@/site/components/ProjectCard";
import { Reveal } from "@/site/components/Reveal";
import { SignalTicker } from "@/site/components/SignalTicker";
import { StatsStrip } from "@/site/components/StatsStrip";
import { PostCard } from "@/site/components/PostCard";

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getFeaturedProjects(), getLatestPosts(3)]);

  return (
    <>
      <section className="hero site-container">
        <div className="hero-grid">
          <Reveal>
            <p className="eyebrow">Senior Product Engineer</p>
            <h1 className="hero-title">
              Secure products, <span className="accent">clear impact</span>, memorable UX.
            </h1>
            <p className="hero-copy">
              I design and ship static-first, high-trust web experiences that balance
              storytelling, performance, and operational security.
            </p>
            <PrimaryCta />
            <SignalTicker />
          </Reveal>
          <Reveal delayMs={120}>
            <StatsStrip />
          </Reveal>
        </div>
      </section>

      <section className="section site-container" aria-labelledby="featured-projects">
        <div className="section-header">
          <h2 id="featured-projects" className="section-title">
            Featured Case Studies
          </h2>
          <Link href="/projects" className="text-link">
            See all projects
          </Link>
        </div>
        <div className="content-grid">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delayMs={70 * index}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section site-container" aria-labelledby="latest-posts">
        <div className="section-header">
          <h2 id="latest-posts" className="section-title">
            Writing
          </h2>
          <Link href="/blog" className="text-link">
            Open blog
          </Link>
        </div>
        <div className="content-grid">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delayMs={70 * index}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
