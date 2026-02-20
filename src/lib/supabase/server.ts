import { createClient } from "@supabase/supabase-js";

/**
 * Build-time Supabase client.
 * Uses SERVICE_ROLE key to bypass RLS for pre-rendering blog posts.
 * This key is NEVER bundled into the client — only used in generateStaticParams / build scripts.
 *
 * Returns an untyped client to avoid generic resolution issues during static builds.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createServerClient(): any | null {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const key = (serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();

    if (!supabaseUrl || !key || supabaseUrl.includes("your_supabase")) {
        return null;
    }

    return createClient(supabaseUrl, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}
