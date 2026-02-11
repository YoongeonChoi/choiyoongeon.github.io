import { getSupabaseClient } from "@/lib/supabase/client";
import { ContributionsResponseSchema, type ContributionsResponse } from "@/lib/validation/schemas";

/**
 * Fetches GitHub contribution data via the Supabase Edge Function proxy.
 * This keeps the GitHub PAT secure — it never touches the client.
 */
export async function fetchContributions(
    username: string
): Promise<ContributionsResponse> {
    const supabase = getSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not configured");
    }

    const { data, error } = await supabase.functions.invoke("github-proxy", {
        body: { username },
    });

    if (error) {
        throw new Error(`Failed to fetch contributions: ${error.message}`);
    }

    // Validate the response shape with Zod
    const validated = ContributionsResponseSchema.parse(data);
    return validated;
}
