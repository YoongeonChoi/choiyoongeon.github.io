// Nexus-PR: GitHub GraphQL API Proxy Edge Function
// Securely proxies GitHub contribution data without exposing the PAT.
// Deploy: supabase functions deploy github-proxy
// Set secret: supabase secrets set GITHUB_PAT=ghp_your_token_here

const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": "https://yoongeonchoi.github.io",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestBody {
  username: string;
}

interface GitHubContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: string;
}

interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

interface GitHubGraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: GitHubContributionWeek[];
        };
      };
    };
  };
  errors?: unknown;
}

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status);
}

const GITHUB_GRAPHQL_QUERY = `
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

Deno.serve(async (req: Request): Promise<Response> => {
  // Always short-circuit CORS preflight first.
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    const body = (await req.json()) as RequestBody;

    if (!body?.username || typeof body.username !== "string") {
      return errorResponse("username is required and must be a string", 400);
    }

    // GitHub username rules: max 39 chars, only alphanumeric/hyphen/underscore.
    const sanitizedUsername = body.username.replace(/[^a-zA-Z0-9_-]/g, "");
    if (sanitizedUsername !== body.username || sanitizedUsername.length > 39) {
      return errorResponse("Invalid GitHub username format", 400);
    }

    const githubPat = Deno.env.get("GITHUB_PAT");
    if (!githubPat) {
      console.error("GITHUB_PAT secret is not configured");
      return errorResponse("Server configuration error", 500);
    }

    const githubResponse = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${githubPat}`,
        "Content-Type": "application/json",
        "User-Agent": "Nexus-PR-Edge-Function",
      },
      body: JSON.stringify({
        query: GITHUB_GRAPHQL_QUERY,
        variables: { username: sanitizedUsername },
      }),
    });

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      console.error("GitHub API error:", githubResponse.status, errorText);
      return errorResponse("Failed to fetch from GitHub API", githubResponse.status);
    }

    const githubData = (await githubResponse.json()) as GitHubGraphQLResponse;

    if (githubData.errors) {
      console.error("GraphQL errors:", githubData.errors);
      return errorResponse("GitHub API returned errors", 502);
    }

    const calendar =
      githubData.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return errorResponse("User not found or no contribution data", 404);
    }

    const sanitizedResponse = {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((week) => ({
        contributionDays: week.contributionDays.map((day) => ({
          date: day.date,
          contributionCount: day.contributionCount,
          contributionLevel: day.contributionLevel,
        })),
      })),
    };

    return jsonResponse(sanitizedResponse, 200);
  } catch (error) {
    console.error("Edge function error:", error);
    return errorResponse("Internal server error", 500);
  }
});
