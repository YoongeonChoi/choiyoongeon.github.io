"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/supabase/types";

interface LatestPostsCardProps {
    posts: BlogPost[];
}

export function LatestPostsCard({ posts }: LatestPostsCardProps) {
  if (posts.length === 0) {
    return (
      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
          Latest Posts
        </h3>
        <p className="mt-4 text-sm italic text-text-secondary">
          아직 게시된 글이 없습니다. 곧 업데이트됩니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
          Latest Posts
        </h3>
        <Link href="/blog" className="text-xs text-text-secondary transition-colors hover:text-accent">
          View all
        </Link>
      </div>
      <div className="space-y-2.5">
        {posts.slice(0, 3).map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.04 * index,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-border-default bg-surface-overlay px-4 py-3 transition-all duration-300 hover:border-border-hover hover:bg-accent-muted/70"
            >
              <h4 className="line-clamp-1 text-sm font-medium text-text-primary transition-colors group-hover:text-accent">
                {post.title}
              </h4>
              <p className="mt-1 text-xs text-text-muted">
                {post.reading_time_minutes} min
                {post.published_at &&
                  ` · ${new Date(post.published_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
