"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchContributions } from "@/lib/github/contributions";
import type { ContributionsResponse } from "@/lib/validation/schemas";

interface UseContributionsResult {
    data: ContributionsResponse | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

/**
 * Hook to fetch GitHub contribution data via the Supabase Edge Function proxy.
 * Handles loading, error, and refetch states.
 */
export function useContributions(username: string): UseContributionsResult {
    const [data, setData] = useState<ContributionsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!username) return;
        setIsLoading(true);
        setError(null);

        try {
            const result = await fetchContributions(username);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch contributions");
        } finally {
            setIsLoading(false);
        }
    }, [username]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
}
