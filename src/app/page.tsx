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
            <p className="eyebrow">One line by GPT</p>
            <h1 className="hero-title">He is a man who refuses to stay the same.</h1>
            <p className="hero-copy">
              Asked GPT to describe me in one sentence, this was the answer:
              &nbsp;&quot;He is a man who refuses to stay the same.&quot;
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
