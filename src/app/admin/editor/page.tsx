"use client";

import { FormEvent, Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAdminClient } from "@/lib/supabase/admin";
import { useAuth } from "@/hooks/useAuth";

interface CategoryRow {
  id: string;
  name: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function estimateReadingTime(md: string): number {
  const words = md.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export default function AdminEditorPageWrapper() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-text-secondary">Loading...</p></div>}>
      <AdminEditorPage />
    </Suspense>
  );
}

function AdminEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/admin/login");
      return;
    }
    loadCategories();
    if (editId) loadPost(editId);
  }, [user, authLoading, editId, router]);

  useEffect(() => {
    if (!slugManual && !editId) {
      setSlug(slugify(title));
    }
  }, [title, slugManual, editId]);

  async function loadCategories() {
    const supabase = getAdminClient();
    if (!supabase) return;
    const { data } = await supabase.from("categories").select("id, name").order("sort_order");
    setCategories(data ?? []);
  }

  const loadPost = useCallback(async (id: string) => {
    const supabase = getAdminClient();
    if (!supabase) return;

    const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();
    if (error || !data) return;

    setTitle(data.title ?? "");
    setSlug(data.slug ?? "");
    setExcerpt(data.excerpt ?? "");
    setContent(data.content_mdx ?? "");
    setTagsInput(Array.isArray(data.tags) ? data.tags.join(", ") : "");
    setCategoryId(data.category_id ?? "");
    setIsPublished(Boolean(data.is_published));
    setSlugManual(true);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const supabase = getAdminClient();
    if (!supabase || !user) {
      setError("인증 오류");
      setSaving(false);
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug,
      excerpt: excerpt || null,
      content_mdx: content,
      tags,
      category_id: categoryId || null,
      is_published: isPublished,
      reading_time_minutes: estimateReadingTime(content),
      published_at: isPublished ? new Date().toISOString() : null,
    };

    if (editId) {
      const { error: updateError } = await supabase.from("blog_posts").update(payload).eq("id", editId);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from("blog_posts").insert({ ...payload, author_id: user.id });
      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin");
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">
          {editId ? "글 수정" : "새 글 작성"}
        </h1>
        <Link href="/admin" className="text-sm text-text-secondary hover:text-accent">
          ← 목록으로
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-text-muted">제목</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-border-default bg-surface-base px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            placeholder="글 제목"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-text-muted">Slug</label>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlugManual(true);
              setSlug(e.target.value);
            }}
            className="w-full rounded-lg border border-border-default bg-surface-base px-3 py-2 text-sm font-mono text-text-primary outline-none focus:border-accent"
            placeholder="url-slug"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-text-muted">요약</label>
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full rounded-lg border border-border-default bg-surface-base px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            placeholder="한 줄 요약"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-text-muted">카테고리</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-surface-base px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            >
              <option value="">미분류</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-text-muted">태그 (쉼표 구분)</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-surface-base px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
              placeholder="경제, 투자, AI"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-text-muted">본문 (Markdown)</label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={24}
            className="w-full resize-y rounded-lg border border-border-default bg-surface-base px-4 py-3 font-mono text-sm leading-relaxed text-text-primary outline-none focus:border-accent"
            placeholder="마크다운으로 작성하세요..."
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded border-border-default accent-accent"
            />
            즉시 발행
          </label>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-6 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "저장 중..." : editId ? "수정 완료" : "글 저장"}
          </button>
          <Link
            href="/admin"
            className="rounded-lg border border-border-default px-6 py-2 text-sm text-text-secondary transition hover:bg-surface-overlay"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
