"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PostCard } from "./PostCard";

interface SerializedPost {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  category: string;
  featured: boolean;
  readingTimeMinutes: number;
  content: string;
}

interface BlogContentProps {
  posts: SerializedPost[];
  tags: string[];
  categories: string[];
}

export function BlogContent({ posts, tags, categories }: BlogContentProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;

    return posts.filter((post) => {
      const inTitle = post.title.toLowerCase().includes(q);
      const inSummary = post.summary.toLowerCase().includes(q);
      const inContent = post.content.toLowerCase().includes(q);
      const inTags = post.tags.some((t) => t.toLowerCase().includes(q));
      const inCategory = post.category.toLowerCase().includes(q);
      return inTitle || inSummary || inContent || inTags || inCategory;
    });
  }, [posts, query]);

  return (
    <>
      <div className="blog-search-wrapper">
        <svg
          className="blog-search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          className="blog-search-input"
          placeholder="제목, 태그, 내용으로 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="블로그 검색"
        />
        {query && (
          <button
            className="blog-search-clear"
            onClick={() => setQuery("")}
            aria-label="검색어 지우기"
            type="button"
          >
            &times;
          </button>
        )}
      </div>

      <div className="filter-row" aria-label="Categories">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/blog/categories/${encodeURIComponent(category)}`}
            className="tag-link"
            prefetch={false}
          >
            {category}
          </Link>
        ))}
      </div>

      <div className="filter-row" aria-label="Tags">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tags/${encodeURIComponent(tag)}`}
            className="tag-link"
            prefetch={false}
          >
            #{tag}
          </Link>
        ))}
      </div>

      {query && (
        <p className="blog-search-count">
          {filtered.length === 0
            ? `"${query}"에 대한 결과가 없습니다`
            : `${filtered.length}개의 글`}
        </p>
      )}

      <div className="content-grid section">
        {filtered.map((post) => (
          <PostCard
            key={post.slug}
            post={{ ...post, updated: undefined, html: "", headings: [] }}
          />
        ))}
      </div>
    </>
  );
}
