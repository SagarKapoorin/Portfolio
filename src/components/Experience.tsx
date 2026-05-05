import Image from "next/image";
import React from "react";
import img1 from "@/assets/wyb.webp";
import img2 from "@/assets/Hanabi.webp";
import img3 from "@/assets/start.webp";
import img4 from "@/assets/MatriceAI.webp";

const experiences = [
  {
    company: "Matrice AI",
    role: "Full Stack Developer Intern",
    period: "Jan 2026 - Present",
    stack: "Go, React, MongoDB, ClickHouse, Redis, Docker",
    image: img4.src,
    points: [
      "Built incident management workflows for AI camera deployments across 5 cameras.",
      "Developed no-code rule configuration and alerting flows with alerts delivered in under 5 seconds.",
      "Created ClickHouse-backed analytics dashboards with graph, table, and camera-group aggregation views.",
      "Partnered with the ML team to operationalize custom camera models and Vision Language Model product flows.",
      "Redesigned 5 major product flows and handled CI migration plus 5-10 security fixes across services.",
    ],
  },
  {
    company: "Hanabi Technologies",
    role: "Full Stack Developer Intern",
    period: "Feb 2025 - Jul 2025",
    stack: "React, React Native, NestJS, Node.js, Docker, MongoDB, Redis, Next.js",
    image: img2.src,
    points: [
      "Built the Task Module end to end, improving task throughput by 65% and adoption to 80% within 4 weeks.",
      "Shipped React Native features including Google Login and AI chat, improving conversion by about 22%.",
      "Reduced P95 API latency from about 1.8s to 600ms through optimization, batching, and multi-layer caching.",
      "Migrated Agenda jobs to GCP Cloud Tasks, scaling to about 1,200 jobs per minute with about 90% fewer failed retries.",
      "Developed Jira and Google Drive memory connectors for RAG-based AI memory ingestion.",
    ],
  },
  {
    company: "WYB, Soulgenix Technologies",
    role: "Software Engineer Intern",
    period: "Jun 2024 - Sep 2024",
    stack: "React, JavaScript, A/B testing, frontend performance",
    image: img1.src,
    points: [
      "Delivered React mini-games that increased session time by 25% and day-7 retention by 18%.",
      "Optimized the frontend codebase to reduce load times and improve application responsiveness.",
      "Collaborated with backend, Flutter, Unity, design, and QA teams to deliver integrated user experiences.",
    ],
  },
  {
    company: "Foundation",
    role: "Started learning in 2022",
    period: "2022 - Present",
    stack: "MERN, competitive programming, systems practice",
    image: img3.src,
    points: [
      "Started with the MERN stack and competitive programming.",
      "Reached Codeforces Specialist with a maximum rating of 1436.",
      "Reached a LeetCode rating of 1931 and solved 200+ problems.",
    ],
  },
];

export function Experience() {
  return (
    <section className="portfolio-shell py-20">
      <div className="mb-10 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div>
          <p className="font-mono text-xs uppercase text-[#f7a501]">Experience</p>
          <h2 className="portfolio-section-title mt-3">Product work across AI, analytics, and real-time systems.</h2>
        </div>
        <p className="portfolio-section-copy md:max-w-xl md:justify-self-end">
          A compact timeline of internships and engineering work, focused on the outcomes and systems behind each product.
        </p>
      </div>

      <div className="relative">
        <div className="absolute bottom-0 left-[18px] top-0 hidden w-px bg-[#23252a] md:block" />
        <div className="grid gap-5">
          {experiences.map((item) => (
            <article key={item.company} className="relative grid gap-5 md:grid-cols-[48px_1fr]">
              <div className="hidden md:flex">
                <span className="relative z-10 mt-6 flex h-9 w-9 items-center justify-center rounded-full border border-[#34343a] bg-[#0f1011]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#5e6ad2]" />
                </span>
              </div>
              <div className="portfolio-panel-flat overflow-hidden">
                <div className="grid lg:grid-cols-[1fr_280px]">
                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-medium text-[#f7f8f8]">{item.role}</h3>
                        <p className="mt-1 text-sm text-[#8a8f98]">{item.company}</p>
                      </div>
                      <span className="rounded-full border border-[#34343a] bg-[#141516] px-3 py-1 text-xs text-[#d0d6e0]">
                        {item.period}
                      </span>
                    </div>
                    <p className="mt-4 font-mono text-xs leading-5 text-[#d0d6e0]">{item.stack}</p>
                    <ul className="mt-5 grid gap-3 text-sm leading-6 text-[#8a8f98]">
                      {item.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f7a501]" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-[#23252a] bg-[#141516] p-3 lg:border-l lg:border-t-0">
                    <Image
                      src={item.image}
                      alt={`${item.company} preview`}
                      width={560}
                      height={420}
                      className="h-full min-h-[180px] w-full rounded-lg object-cover opacity-90"
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
