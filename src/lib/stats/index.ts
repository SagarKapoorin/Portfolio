import { redisGet, redisSet } from "@/lib/redis";
import { fetchCodeforcesStats } from "@/lib/stats/codeforces";
import { fetchGitHubStats } from "@/lib/stats/github";
import { fetchLeetCodeStats } from "@/lib/stats/leetcode";
import type { PortfolioStat, StatsPayload } from "@/lib/stats/types";

const CACHE_KEY = "stats:all:v1";
const CACHE_TTL_SECONDS = 60 * 60 * 6;

function defaultStats(): PortfolioStat[] {
  return [
    { value: "1931", label: "LeetCode rating" },
    { value: "1436", label: "Codeforces max" },
    { value: "200+", label: "DSA problems solved" },
    { value: "Top 3.44%", label: "LeetCode global rank" },
    { value: "Specialist", label: "Codeforces title" },
    { value: "3", label: "Software internships" },
    { value: "2026", label: "B.Tech CSE graduating year" },
    { value: "21/day", label: "Portfolio requests handled" },
    { value: "5s", label: "Fast alerting experience" },
  ];
}

function formatLiveStats(input: {
  leetCode: Awaited<ReturnType<typeof fetchLeetCodeStats>>;
  codeforces: Awaited<ReturnType<typeof fetchCodeforcesStats>>;
  github: Awaited<ReturnType<typeof fetchGitHubStats>>;
}): PortfolioStat[] {
  const { leetCode, codeforces, github } = input;

  return [
    { value: `${leetCode.rating ?? 1931}`, label: "LeetCode rating" },
    { value: `${codeforces.maxRating ?? 1436}`, label: "Codeforces max" },
    { value: `${leetCode.solved ?? 200}+`, label: "DSA problems solved" },
    {
      value:
        typeof leetCode.topPercentage === "number"
          ? `Top ${leetCode.topPercentage}%`
          : "Top 3.44%",
      label: "LeetCode global rank",
    },
    {
      value: codeforces.rank ? codeforces.rank[0].toUpperCase() + codeforces.rank.slice(1) : "Specialist",
      label: "Codeforces title",
    },
    { value: `${github.followers ?? 0}`, label: "GitHub followers" },
    { value: `${github.publicRepos ?? 0}`, label: "Public repositories" },
    { value: `${github.contributionsYear ?? 0}`, label: "Recent public events" },
    { value: "2026", label: "B.Tech CSE graduating year" },
  ];
}

function parsePayload(input: string): StatsPayload | null {
  try {
    return JSON.parse(input) as StatsPayload;
  } catch {
    return null;
  }
}

export async function getPortfolioStats(): Promise<StatsPayload> {
  const nowIso = new Date().toISOString();
  let cachedRaw: string | null = null;
  try {
    cachedRaw = await redisGet(CACHE_KEY);
  } catch {
    cachedRaw = null;
  }
  const cachedPayload = cachedRaw ? parsePayload(cachedRaw) : null;

  try {
    const leetcodeUsername = process.env.LEETCODE_USERNAME || "SagarKa";
    const codeforcesHandle = process.env.CODEFORCES_HANDLE || "BurningHash";
    const githubUsername = process.env.GITHUB_USERNAME || "SagarKapoorin";

    const [leetCode, codeforces, github] = await Promise.all([
      fetchLeetCodeStats(leetcodeUsername),
      fetchCodeforcesStats(codeforcesHandle),
      fetchGitHubStats(githubUsername),
    ]);

    const freshPayload: StatsPayload = {
      stats: formatLiveStats({ leetCode, codeforces, github }),
      source: "live",
      fetchedAt: nowIso,
      stale: false,
    };

    try {
      await redisSet(CACHE_KEY, JSON.stringify(freshPayload), { EX: CACHE_TTL_SECONDS });
    } catch {
      // If redis is unavailable, return live data without caching.
    }
    return freshPayload;
  } catch {
    if (cachedPayload) {
      return { ...cachedPayload, source: "cache", stale: true };
    }

    return {
      stats: defaultStats(),
      source: "fallback",
      fetchedAt: nowIso,
      stale: true,
    };
  }
}

