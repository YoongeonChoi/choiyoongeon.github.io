/**
 * GitHub GraphQL API Client
 * Fetches contribution data and repository statistics
 */

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

interface ContributionDay {
    date: string;
    contributionCount: number;
    contributionLevel: "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";
}

interface ContributionWeek {
    contributionDays: ContributionDay[];
}

interface GitHubContributionData {
    totalContributions: number;
    weeks: ContributionWeek[];
}

interface GitHubUserStats {
    contributions: number;
    repositories: number;
    pullRequests: number;
    followers: number;
    following: number;
    stars: number;
}

const CONTRIBUTION_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalRepositoryContributions
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
      repositories(first: 100, ownerAffiliations: OWNER) {
        totalCount
        nodes {
          stargazerCount
        }
      }
      pullRequests(first: 1) {
        totalCount
      }
      followers {
        totalCount
      }
      following {
        totalCount
      }
    }
  }
`;

export async function fetchGitHubContributions(
    username: string,
    token?: string
): Promise<GitHubContributionData | null> {
    const authToken = token || process.env.GH_PAT;

    if (!authToken) {
        console.warn("GitHub token not provided. Using fallback data.");
        return null;
    }

    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    try {
        const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                query: CONTRIBUTION_QUERY,
                variables: {
                    username,
                    from: oneYearAgo.toISOString(),
                    to: now.toISOString(),
                },
            }),
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
            throw new Error(data.errors[0].message);
        }

        const calendar = data.data.user.contributionsCollection.contributionCalendar;

        return {
            totalContributions: calendar.totalContributions,
            weeks: calendar.weeks,
        };
    } catch (error) {
        console.error("Failed to fetch GitHub contributions:", error);
        return null;
    }
}

export async function fetchGitHubStats(
    username: string,
    token?: string
): Promise<GitHubUserStats | null> {
    const authToken = token || process.env.GH_PAT;

    if (!authToken) {
        console.warn("GitHub token not provided. Using fallback data.");
        return null;
    }

    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    try {
        const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                query: CONTRIBUTION_QUERY,
                variables: {
                    username,
                    from: oneYearAgo.toISOString(),
                    to: now.toISOString(),
                },
            }),
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
            throw new Error(data.errors[0].message);
        }

        const user = data.data.user;
        const totalStars = user.repositories.nodes.reduce(
            (acc: number, repo: { stargazerCount: number }) => acc + repo.stargazerCount,
            0
        );

        return {
            contributions: user.contributionsCollection.contributionCalendar.totalContributions,
            repositories: user.repositories.totalCount,
            pullRequests: user.pullRequests.totalCount,
            followers: user.followers.totalCount,
            following: user.following.totalCount,
            stars: totalStars,
        };
    } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
        return null;
    }
}

// Convert GitHub contribution level to 0-4 scale
export function levelToNumber(level: ContributionDay["contributionLevel"]): number {
    const levels: Record<string, number> = {
        NONE: 0,
        FIRST_QUARTILE: 1,
        SECOND_QUARTILE: 2,
        THIRD_QUARTILE: 3,
        FOURTH_QUARTILE: 4,
    };
    return levels[level] ?? 0;
}
