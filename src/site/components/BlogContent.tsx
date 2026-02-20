"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PostCard } from "./PostCard";

type SortOrder = "newest" | "oldest";

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

function SortIcon({ descending }: { descending: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        transition: "transform 250ms cubic-bezier(0.2,0.9,0.18,1)",
        transform: descending ? "none" : "scaleY(-1)",
      }}
    >
      <path d="M3 6h13" />
      <path d="M3 12h9" />
      <path d="M3 18h5" />
      <path d="M18 20V4" />
      <path d="M15 7l3-3 3 3" />
    </svg>
  );
}

export function BlogContent({ posts, tags, categories }: BlogContentProps) {
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = posts;

    if (q) {
      result = result.filter((post) => {
        const inTitle = post.title.toLowerCase().includes(q);
        const inSummary = post.summary.toLowerCase().includes(q);
        const inContent = post.content.toLowerCase().includes(q);
        const inTags = post.tags.some((t) => t.toLowerCase().includes(q));
        const inCategory = post.category.toLowerCase().includes(q);
        return inTitle || inSummary || inContent || inTags || inCategory;
      });
    }

    const sorted = [...result].sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });

    return sorted;
  }, [posts, query, sortOrder]);

  return (
    <>
      <div className="blog-toolbar">
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

        <button
          type="button"
          className="blog-sort-btn"
          onClick={() =>
            setSortOrder((v) => (v === "newest" ? "oldest" : "newest"))
          }
          aria-label={
            sortOrder === "newest" ? "오래된 순으로 정렬" : "최신 순으로 정렬"
          }
        >
          <SortIcon descending={sortOrder === "newest"} />
          <span className="blog-sort-label">
            {sortOrder === "newest" ? "최신순" : "오래된순"}
          </span>
        </button>
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
