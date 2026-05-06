const LEETCODE_ENDPOINT = "https://leetcode.com/graphql";

type LeetCodeStats = {
  rating: number | null;
  topPercentage: number | null;
  solved: number | null;
};

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats> {
  const query = `
    query getUserProfile($username: String!) {
      userContestRanking(username: $username) {
        rating
        topPercentage
      }
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  const response = await fetch(LEETCODE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { username } }),
    next: { revalidate: 21600 },
  });

  if (!response.ok) {
    throw new Error(`LeetCode request failed with status ${response.status}`);
  }

  const data = await response.json();
  const ranking = data?.data?.userContestRanking;
  const submissions = data?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum ?? [];
  const totalSolved = submissions.find((item: { difficulty: string }) => item.difficulty === "All");

  return {
    rating: ranking?.rating ? Math.round(ranking.rating) : null,
    topPercentage:
      typeof ranking?.topPercentage === "number" ? Number(ranking.topPercentage.toFixed(2)) : null,
    solved: totalSolved?.count ?? null,
  };
}

