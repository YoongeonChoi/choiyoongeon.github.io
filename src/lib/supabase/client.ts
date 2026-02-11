import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser-safe Supabase client.
 * Uses the ANON key — all queries are gated by RLS policies.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
