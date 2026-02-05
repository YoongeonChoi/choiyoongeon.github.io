import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubContributions, fetchGitHubStats } from "@/lib/github/api";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username") || "choiyoongeon";
    const type = searchParams.get("type") || "all";

    try {
        if (type === "contributions" || type === "all") {
            const contributions = await fetchGitHubContributions(username);

            if (type === "contributions") {
                return NextResponse.json({ contributions });
            }
        }

        if (type === "stats" || type === "all") {
            const stats = await fetchGitHubStats(username);

            if (type === "stats") {
                return NextResponse.json({ stats });
            }
        }

        // Return all data
        const [contributions, stats] = await Promise.all([
            fetchGitHubContributions(username),
            fetchGitHubStats(username),
        ]);

        return NextResponse.json({
            contributions,
            stats,
            cached: true,
        });
    } catch (error) {
        console.error("GitHub API error:", error);

        // Return fallback data
        return NextResponse.json({
            contributions: null,
            stats: null,
            error: "Failed to fetch GitHub data",
            fallback: true,
        });
    }
}
