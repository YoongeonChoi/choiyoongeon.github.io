import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// PROD: Use environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Server Supabase Client
 * Safe for use in getStaticProps / generateStaticParams (Node.js environment).
 * Does NOT persist sessions or use browser APIs.
 */
export function createServerClient() {
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        }
    });
}
