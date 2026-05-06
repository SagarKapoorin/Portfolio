const GITHUB_API = "https://api.github.com";

type GitHubStats = {
  followers: number | null;
  publicRepos: number | null;
  contributionsYear: number | null;
};

function getGitHubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return {
      Accept: "application/vnd.github+json",
    };
  }

  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  const headers = getGitHubHeaders();

  const [profileResponse, eventsResponse] = await Promise.all([
    fetch(`${GITHUB_API}/users/${username}`, {
      headers,
      next: { revalidate: 21600 },
    }),
    fetch(`${GITHUB_API}/users/${username}/events/public`, {
      headers,
      next: { revalidate: 21600 },
    }),
  ]);

  if (!profileResponse.ok) {
    throw new Error(`GitHub profile request failed with status ${profileResponse.status}`);
  }

  const profile = await profileResponse.json();
  let contributionsYear: number | null = null;

  if (eventsResponse.ok) {
    const events = await eventsResponse.json();
    const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
    contributionsYear = Array.isArray(events)
      ? events.filter((event: { created_at?: string }) => {
          const createdAt = event.created_at ? new Date(event.created_at).getTime() : 0;
          return createdAt >= oneYearAgo;
        }).length
      : null;
  }

  return {
    followers: profile?.followers ?? null,
    publicRepos: profile?.public_repos ?? null,
    contributionsYear,
  };
}

