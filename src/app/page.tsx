import { HomeContent } from "@/components/HomeContent";
import { createServerClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/supabase/types";

const GITHUB_USERNAME = "choiyoongeon";
export const dynamic = "force-static";
export const revalidate = false;

/**
 * Home page — Static (SSG).
 * Fetches latest published posts at build time.
 */
export default async function HomePage() {
  let latestPosts: BlogPost[] = [];
  const supabase = createServerClient();

  if (supabase) {
    try {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3);

      if (data) {
        latestPosts = data as BlogPost[];
      }
    } catch (error) {
      // Gracefully handle build-time fetch failure
      console.warn("Failed to fetch posts at build time:", error);
    }
  }

  return <HomeContent latestPosts={latestPosts} githubUsername={GITHUB_USERNAME} />;
}
