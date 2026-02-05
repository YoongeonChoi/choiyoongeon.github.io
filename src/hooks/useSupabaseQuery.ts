"use client";

import useSWR from "swr";
import { supabase } from "@/lib/supabase/client";
// Helper types can be imported here if needed

// Generic fetcher for Supabase
const fetcher = async (key: string) => {
    const [table, ...modifiers] = key.split(":");

    let query = supabase.from(table).select("*");

    // Basic modifier handling (expand as needed for complex queries)
    if (modifiers.includes("published")) {
        query = query.eq("published", true);
    }

    if (modifiers.includes("featured")) {
        query = query.eq("featured", true);
    }

    // Sort order (default to created_at desc for posts/projects)
    if (table === "posts" || table === "projects") {
        query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Hook for fetching data
export function useSupabaseQuery<T>(table: string, options?: {
    featured?: boolean;
    published?: boolean;
}) {
    // Construct a key based on options
    let key = table;
    if (options?.published) key += ":published";
    if (options?.featured) key += ":featured";

    const { data, error, isLoading } = useSWR<T[]>(key, fetcher, {
        revalidateOnFocus: false, // Static-like behavior preferred for this portfolio
        dedupingInterval: 60000, // 1 minute cache
    });

    return {
        data,
        error,
        isLoading,
    };
}
