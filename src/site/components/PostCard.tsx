import Link from "next/link";
import type { BlogPost } from "@/lib/content/types";

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="content-card post-card">
      <p className="eyebrow">{post.category}</p>
      <h2 className="card-title">
        <Link href={`/blog/${post.slug}`} prefetch={false}>
          {post.title}
        </Link>
      </h2>
      <p className="card-summary">{post.summary}</p>
      <div className="chip-row" aria-label="Tags">
        {post.tags.slice(0, 4).map((tag) => (
          <Link
            key={tag}
            className="chip"
            href={`/blog/tags/${encodeURIComponent(tag)}`}
            prefetch={false}
          >
            {tag}
          </Link>
        ))}
      </div>
      <p className="meta-row">
        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US")}</time>
        <span>{post.readingTimeMinutes} min read</span>
      </p>
    </article>
  );
}
