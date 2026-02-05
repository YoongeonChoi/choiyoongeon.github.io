import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// PROD: Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Singleton Supabase Browser Client
 * Optimized for Client-side fetching in a Static Export environment.
 * Reuses the same instance to prevent connection leaks.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true, // Persist session in localStorage
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'supabase.auth.token',
    },
    global: {
        headers: {
            'x-application-name': 'portfolio-hybrid',
        },
    },
});

/**
 * Legacy Server Client - ONLY for Build-Time usage (getStaticProps/generateStaticParams).
 * DO NOT use this in runtime for Static Export (GitHub Pages) as it requires a Node.js server environment for cookies.
 */
export function createServerClient() {
    return createClient<Database>(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey);
}
