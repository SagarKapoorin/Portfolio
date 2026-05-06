const CODEFORCES_ENDPOINT = "https://codeforces.com/api/user.info";

type CodeforcesStats = {
  rating: number | null;
  maxRating: number | null;
  rank: string | null;
};

export async function fetchCodeforcesStats(handle: string): Promise<CodeforcesStats> {
  const response = await fetch(`${CODEFORCES_ENDPOINT}?handles=${encodeURIComponent(handle)}`, {
    next: { revalidate: 21600 },
  });

  if (!response.ok) {
    throw new Error(`Codeforces request failed with status ${response.status}`);
  }

  const data = await response.json();
  const user = data?.result?.[0];

  return {
    rating: user?.rating ?? null,
    maxRating: user?.maxRating ?? null,
    rank: user?.rank ?? null,
  };
}

