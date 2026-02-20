"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAdminClient } from "@/lib/supabase/admin";
import { useAuth } from "@/hooks/useAuth";

interface PostRow {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/admin/login");
      return;
    }

    let active = true;
    const supabase = getAdminClient();
    if (!supabase) return;

    supabase
      .from("blog_posts")
      .select("id, title, slug, tags, is_published, published_at, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }: { data: PostRow[] | null }) => {
        if (active) {
          setPosts(data ?? []);
          setLoading(false);
        }
      });

    return () => { active = false; };
  }, [user, authLoading, router]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 글을 삭제하시겠습니까?`)) return;

    const supabase = getAdminClient();
    if (!supabase) return;

    await supabase.from("blog_posts").delete().eq("id", id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleTogglePublish(id: string, current: boolean) {
    const supabase = getAdminClient();
    if (!supabase) return;

    const update: Record<string, unknown> = { is_published: !current };
    if (!current) update.published_at = new Date().toISOString();

    await supabase.from("blog_posts").update(update).eq("id", id);
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_published: !current, published_at: p.published_at ?? new Date().toISOString() } : p))
    );
  }

  async function handleLogout() {
    const supabase = getAdminClient();
    if (supabase) await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Blog Admin</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/editor"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            새 글 작성
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-border-default px-4 py-2 text-sm text-text-secondary transition hover:bg-surface-overlay"
          >
            로그아웃
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-text-secondary">불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p className="text-text-secondary">아직 작성된 글이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-border-default bg-surface-overlay px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-text-primary">{post.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                  <time>{new Date(post.published_at ?? post.created_at).toLocaleDateString("ko-KR")}</time>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      post.is_published
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {post.is_published ? "발행됨" : "초안"}
                  </span>
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-accent-muted px-2 py-0.5 text-[10px] text-accent">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => handleTogglePublish(post.id, post.is_published)}
                  className="rounded-lg border border-border-default px-3 py-1.5 text-xs text-text-secondary transition hover:bg-surface-base"
                >
                  {post.is_published ? "비공개" : "발행"}
                </button>
                <Link
                  href={`/admin/editor?id=${post.id}`}
                  className="rounded-lg border border-border-default px-3 py-1.5 text-xs text-text-secondary transition hover:bg-surface-base"
                >
                  수정
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
