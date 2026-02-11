import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Build-time Supabase client.
 * Uses SERVICE_ROLE key to bypass RLS for pre-rendering blog posts.
 * This key is NEVER bundled into the client — only used in generateStaticParams / build scripts.
 */
export function createServerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Fallback to anon key if service role is not available (e.g., local dev)
    const key = (serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();

    if (!supabaseUrl || !key) {
        return null;
    }

    return createClient<Database>(supabaseUrl, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}
