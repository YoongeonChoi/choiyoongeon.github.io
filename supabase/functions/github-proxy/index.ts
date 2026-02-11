// Nexus-PR: GitHub GraphQL API Proxy Edge Function
// Securely proxies GitHub contribution data without exposing the PAT.
// Deploy: supabase functions deploy github-proxy
// Set secret: supabase secrets set GITHUB_PAT=ghp_your_token_here

import { serve } from "std/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
    username: string;
}

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // Parse and validate request body
        const body: RequestBody = await req.json();

        if (!body.username || typeof body.username !== "string") {
            return new Response(
                JSON.stringify({ error: "username is required and must be a string" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Sanitize username: only allow alphanumeric, hyphens, and underscores
        const sanitizedUsername = body.username.replace(/[^a-zA-Z0-9_-]/g, "");
        if (sanitizedUsername !== body.username || sanitizedUsername.length > 39) {
            return new Response(
                JSON.stringify({ error: "Invalid GitHub username format" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Read the GitHub PAT from Supabase Secrets
        const githubPat = Deno.env.get("GITHUB_PAT");
        if (!githubPat) {
            console.error("GITHUB_PAT secret is not configured");
            return new Response(
                JSON.stringify({ error: "Server configuration error" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // GraphQL query for contribution data
        const query = `
      query ($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

        // Call GitHub GraphQL API
        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                Authorization: `bearer ${githubPat}`,
                "Content-Type": "application/json",
                "User-Agent": "Nexus-PR-Edge-Function",
            },
            body: JSON.stringify({
                query,
                variables: { username: sanitizedUsername },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("GitHub API error:", response.status, errorText);
            return new Response(
                JSON.stringify({ error: "Failed to fetch from GitHub API" }),
                {
                    status: response.status,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const githubData = await response.json();

        // Check for GraphQL errors
        if (githubData.errors) {
            console.error("GraphQL errors:", githubData.errors);
            return new Response(
                JSON.stringify({ error: "GitHub API returned errors" }),
                {
                    status: 502,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Extract and sanitize the contribution data
        const calendar =
            githubData.data?.user?.contributionsCollection?.contributionCalendar;

        if (!calendar) {
            return new Response(
                JSON.stringify({ error: "User not found or no contribution data" }),
                {
                    status: 404,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Return only the data we need (no leaking extra info)
        const sanitizedResponse = {
            totalContributions: calendar.totalContributions,
            weeks: calendar.weeks.map(
                (week: { contributionDays: Array<{ date: string; contributionCount: number; contributionLevel: string }> }) => ({
                    contributionDays: week.contributionDays.map(
                        (day: { date: string; contributionCount: number; contributionLevel: string }) => ({
                            date: day.date,
                            contributionCount: day.contributionCount,
                            contributionLevel: day.contributionLevel,
                        })
                    ),
                })
            ),
        };

        return new Response(JSON.stringify(sanitizedResponse), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Edge function error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
