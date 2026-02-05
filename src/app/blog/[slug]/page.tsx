import { notFound } from "next/navigation";
import { BlogPostClient } from "./client";
import { createServerClient } from "@/lib/supabase/client";
import type { Post } from "@/lib/supabase/types";

// Generate static params for all published posts
export const dynamicParams = false;

export async function generateStaticParams() {
    const supabase = createServerClient();
    const { data: posts } = await supabase
        .from("posts")
        .select("slug")
        .eq("published", true);

    const typedPosts = (posts || []) as unknown as { slug: string }[];

    return typedPosts.map((post) => ({
        slug: post.slug,
    }));
}

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const supabase = createServerClient();

    const { data: post } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

    if (!post) {
        notFound();
    }

    return <BlogPostClient post={post} />;
}
