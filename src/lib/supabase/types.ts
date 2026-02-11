/**
 * Nexus-PR Database Types
 * Auto-generated structure matching our Supabase schema.
 * In production, use `supabase gen types typescript` to regenerate.
 */

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    display_name: string;
                    bio: string | null;
                    avatar_url: string | null;
                    github_username: string | null;
                    social_links: Record<string, string> | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    display_name: string;
                    bio?: string | null;
                    avatar_url?: string | null;
                    github_username?: string | null;
                    social_links?: Record<string, string> | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    display_name?: string;
                    bio?: string | null;
                    avatar_url?: string | null;
                    github_username?: string | null;
                    social_links?: Record<string, string> | null;
                    updated_at?: string;
                };
            };
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    color_hex: string | null;
                    sort_order: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    color_hex?: string | null;
                    sort_order?: number;
                    created_at?: string;
                };
                Update: {
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    color_hex?: string | null;
                    sort_order?: number;
                };
            };
            blog_posts: {
                Row: {
                    id: string;
                    author_id: string;
                    category_id: string | null;
                    title: string;
                    slug: string;
                    excerpt: string | null;
                    content_mdx: string;
                    cover_image_url: string | null;
                    tags: string[];
                    is_published: boolean;
                    reading_time_minutes: number;
                    published_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    author_id: string;
                    category_id?: string | null;
                    title: string;
                    slug: string;
                    excerpt?: string | null;
                    content_mdx: string;
                    cover_image_url?: string | null;
                    tags?: string[];
                    is_published?: boolean;
                    reading_time_minutes?: number;
                    published_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    author_id?: string;
                    category_id?: string | null;
                    title?: string;
                    slug?: string;
                    excerpt?: string | null;
                    content_mdx?: string;
                    cover_image_url?: string | null;
                    tags?: string[];
                    is_published?: boolean;
                    reading_time_minutes?: number;
                    published_at?: string | null;
                    updated_at?: string;
                };
            };
        };
    };
}

/** Convenience type aliases */
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
