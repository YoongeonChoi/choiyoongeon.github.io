/**
 * Supabase Database Types
 * Generated schema for the portfolio platform
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            posts: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string | null;
                    category_id: string | null;
                    author_id: string;
                    published: boolean;
                    published_at: string | null;
                    read_time: number;
                    views: number;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt?: string | null;
                    category_id?: string | null;
                    author_id: string;
                    published?: boolean;
                    published_at?: string | null;
                    read_time?: number;
                    views?: number;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    title?: string;
                    slug?: string;
                    content?: string;
                    excerpt?: string | null;
                    category_id?: string | null;
                    author_id?: string;
                    published?: boolean;
                    published_at?: string | null;
                    read_time?: number;
                    views?: number;
                };
            };
            categories: {
                Row: {
                    id: string;
                    created_at: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    color: string;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    color?: string;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    color?: string;
                };
            };
            tags: {
                Row: {
                    id: string;
                    created_at: string;
                    name: string;
                    slug: string;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    name: string;
                    slug: string;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    name?: string;
                    slug?: string;
                };
            };
            post_tags: {
                Row: {
                    post_id: string;
                    tag_id: string;
                };
                Insert: {
                    post_id: string;
                    tag_id: string;
                };
                Update: {
                    post_id?: string;
                    tag_id?: string;
                };
            };
            projects: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                    title: string;
                    slug: string;
                    description: string;
                    image: string | null;
                    tech_stack: string[];
                    problem: string | null;
                    solution: string | null;
                    reflection: string | null;
                    github_url: string | null;
                    live_url: string | null;
                    featured: boolean;
                    order: number;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    title: string;
                    slug: string;
                    description: string;
                    image?: string | null;
                    tech_stack?: string[];
                    problem?: string | null;
                    solution?: string | null;
                    reflection?: string | null;
                    github_url?: string | null;
                    live_url?: string | null;
                    featured?: boolean;
                    order?: number;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    title?: string;
                    slug?: string;
                    description?: string;
                    image?: string | null;
                    tech_stack?: string[];
                    problem?: string | null;
                    solution?: string | null;
                    reflection?: string | null;
                    github_url?: string | null;
                    live_url?: string | null;
                    featured?: boolean;
                    order?: number;
                };
            };
            passkeys: {
                Row: {
                    id: string;
                    created_at: string;
                    user_id: string;
                    credential_id: string;
                    public_key: string;
                    counter: number;
                    device_type: string | null;
                    backed_up: boolean;
                    transports: string[] | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    user_id: string;
                    credential_id: string;
                    public_key: string;
                    counter?: number;
                    device_type?: string | null;
                    backed_up?: boolean;
                    transports?: string[] | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    user_id?: string;
                    credential_id?: string;
                    public_key?: string;
                    counter?: number;
                    device_type?: string | null;
                    backed_up?: boolean;
                    transports?: string[] | null;
                };
            };
        };
        Views: {};
        Functions: {};
        Enums: {};
    };
}

// Convenience types
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Passkey = Database["public"]["Tables"]["passkeys"]["Row"];
