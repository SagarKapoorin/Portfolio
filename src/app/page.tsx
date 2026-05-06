import { ArrowUpRight, Code2, Database, Gauge, Layers3 } from "lucide-react";
import MarqueeSection from "@/components/Marquee";
import Project from "@/components/Project";
import { Experience } from "@/components/Experience";
import SocialMedia from "@/components/SocialMedia";
import AskSagar from "@/components/AskSagar";
import { getPortfolioStats } from "@/lib/stats";

const capabilities = [
  {
    icon: Layers3,
    title: "Full Stack Developer",
    copy: "End-to-end feature delivery across frontend, backend, analytics, auth, payments, and notifications.",
  },
  {
    icon: Gauge,
    title: "Performance Systems",
    copy: "Latency reduction, batching, caching, background workers, indexing, and resilient API flows.",
  },
  {
    icon: Database,
    title: "Data & Analytics",
    copy: "PostgreSQL, MongoDB, Redis, ClickHouse dashboards, event analytics, and operational visibility.",
  },
  {
    icon: Code2,
    title: "AI Product Workflows",
    copy: "AI camera workflows, VLM product flows, RAG memory connectors, and no-code rule configuration.",
  },
];

function getRelativeTime(input: string) {
  const now = Date.now();
  const then = new Date(input).getTime();
  const minutes = Math.max(1, Math.floor((now - then) / 60000));

  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const Home = async () => {
  const statsPayload = await getPortfolioStats();
  const updatedAgo = getRelativeTime(statsPayload.fetchedAt);

  return (
    <div className="w-full">
      <section className="portfolio-shell pt-20 sm:pt-28">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-[clamp(3rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-normal text-[#f7f8f8]">
              Full Stack Developer building AI-powered product systems.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#8a8f98]">
              I am Sagar Kapoor, a full-stack developer working across Go,
              TypeScript, React, Node.js, PostgreSQL, Redis, ClickHouse, Docker,
              and analytics-heavy customer-facing applications.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#projects" className="portfolio-button-primary">
                View projects
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="/hire" className="portfolio-button-secondary">
                Work with me
              </a>
            </div>
          </div>

          <div className="portfolio-panel overflow-hidden">
            <div className="border-b border-[#23252a] px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-[#f7f8f8]">Current focus</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2c355f] bg-[#1a1d31] px-2.5 py-1 text-[11px] font-medium text-[#d8ddff]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5e6ad2]" />
                    live
                  </span>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-[#f7a501] px-2.5 py-1 text-xs font-semibold text-[#23251d]">
                    AI + Systems
                  </span>
                  <p className="mt-1 text-[11px] text-[#62666d]">
                    updated {updatedAgo}
                    {statsPayload.stale ? " (cached)" : ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-px bg-[#23252a] sm:grid-cols-2 lg:grid-cols-3">
              {statsPayload.stats.map((point) => (
                <div key={point.label} className="min-h-[112px] select-none bg-[#0f1011] p-4">
                  <p className="text-2xl font-semibold leading-none text-[#f7f8f8]">{point.value}</p>
                  <p className="mt-3 text-sm leading-5 text-[#8a8f98]">{point.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#141516] p-5">
              <p className="font-mono text-xs leading-6 text-[#d0d6e0]">
                stack: go / typescript / react / next.js / node.js / mongodb /
                postgresql / clickhouse / redis / docker
              </p>
            </div>
          </div>
        </div>
      </section>

      <MarqueeSection />

      <section className="portfolio-shell py-20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="portfolio-panel-flat p-5">
                <Icon className="h-5 w-5 text-[#5e6ad2]" />
                <h2 className="mt-5 text-lg font-medium text-[#f7f8f8]">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#8a8f98]">{item.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div id="projects">
        <Project />
      </div>
      <Experience />
      <SocialMedia />
      <AskSagar />
    </div>
  );
};

export default Home;
