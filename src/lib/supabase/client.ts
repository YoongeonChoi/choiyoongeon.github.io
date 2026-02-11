import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Browser-safe Supabase client.
 * Uses the ANON key — all queries are gated by RLS policies.
 */
export function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!supabaseUrl || !supabaseAnonKey) {
        return null;
    }

    if (!browserClient) {
        browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
    }

    return browserClient;
}
