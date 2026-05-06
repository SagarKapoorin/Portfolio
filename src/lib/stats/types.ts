export type PortfolioStat = {
  value: string;
  label: string;
};

export type StatsPayload = {
  stats: PortfolioStat[];
  source: "live" | "cache" | "fallback";
  fetchedAt: string;
  stale: boolean;
};

