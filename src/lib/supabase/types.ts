/**
 * Supabase Database Types
 * Generated schema for the hybrid-static portfolio platform
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            site_metadata: {
                Row: {
                    id: string
                    key: string
                    value: Json
                    updated_at: string
                }
                Insert: {
                    id?: string
                    key: string
                    value: Json
                    updated_at?: string
                }
                Update: {
                    id?: string
                    key?: string
                    value?: Json
                    updated_at?: string
                }
            }
            posts: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    excerpt: string | null
                    content: string
                    cover_image: string | null
                    tags: string[]
                    category: string
                    published: boolean
                    view_count: number
                    read_time_minutes: number
                    published_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    excerpt?: string | null
                    content: string
                    cover_image?: string | null
                    tags?: string[]
                    category: string
                    published?: boolean
                    view_count?: number
                    read_time_minutes?: number
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    excerpt?: string | null
                    content?: string
                    cover_image?: string | null
                    tags?: string[]
                    category?: string
                    published?: boolean
                    view_count?: number
                    read_time_minutes?: number
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    description: string | null
                    content: string | null
                    cover_image: string | null
                    technologies: string[]
                    demo_url: string | null
                    github_url: string | null
                    featured: boolean
                    sort_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    description?: string | null
                    content?: string | null
                    cover_image?: string | null
                    technologies?: string[]
                    demo_url?: string | null
                    github_url?: string | null
                    featured?: boolean
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    description?: string | null
                    content?: string | null
                    cover_image?: string | null
                    technologies?: string[]
                    demo_url?: string | null
                    github_url?: string | null
                    featured?: boolean
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            passkey_credentials: {
                Row: {
                    id: string
                    user_id: string
                    credential_id: string
                    public_key: string
                    counter: number
                    transports: string[]
                    created_at: string
                    last_used_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    credential_id: string
                    public_key: string
                    counter?: number
                    transports?: string[]
                    created_at?: string
                    last_used_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    credential_id?: string
                    public_key?: string
                    counter?: number
                    transports?: string[]
                    created_at?: string
                    last_used_at?: string
                }
            }
            auth_challenges: {
                Row: {
                    id: string
                    user_id: string
                    challenge: string
                    created_at: string
                    expires_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    challenge: string
                    created_at?: string
                    expires_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    challenge?: string
                    created_at?: string
                    expires_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            is_admin: {
                Args: Record<string, never>
                Returns: boolean
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Convenience types for lighter usage
export type Post = Database["public"]["Tables"]["posts"]["Row"]
export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type SiteMetadata = Database["public"]["Tables"]["site_metadata"]["Row"]
export type PasskeyCredential = Database["public"]["Tables"]["passkey_credentials"]["Row"]
