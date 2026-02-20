import { getSupabaseClient } from "./client";

/**
 * Returns a loosely-typed Supabase client for admin CRUD operations.
 * Bypasses strict Database generics that can produce `never` types
 * when env vars contain placeholder values during static builds.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAdminClient(): any | null {
  return getSupabaseClient();
}
