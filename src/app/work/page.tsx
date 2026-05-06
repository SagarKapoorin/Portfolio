import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getAllCaseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Work",
  description: "Deep case studies on product, system design, and engineering delivery by Sagar Kapoor.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Work | Sagar Kapoor",
    description: "Deep case studies on product, system design, and engineering delivery by Sagar Kapoor.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
};

export default async function WorkPage() {
  const studies = await getAllCaseStudies();

  return (
    <section className="portfolio-shell py-20">
      <div className="mb-10 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div>
          <p className="font-mono text-xs uppercase text-[#f7a501]">Case studies</p>
          <h1 className="portfolio-section-title mt-3">How products were built and scaled.</h1>
        </div>
        <p className="portfolio-section-copy md:max-w-xl md:justify-self-end">
          Architecture, performance tradeoffs, and measurable outcomes across AI, analytics, and
          full-stack product workflows.
        </p>
      </div>

      <div className="grid gap-5">
        {studies.map((study) => (
          <article key={study.slug} className="portfolio-panel-flat p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-medium text-[#f7f8f8]">{study.title}</h2>
                <p className="mt-2 text-sm text-[#8a8f98]">
                  {study.role} - {study.period}
                </p>
              </div>
              <span className="rounded-full border border-[#34343a] bg-[#141516] px-3 py-1 text-xs text-[#d0d6e0]">
                {study.status}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#8a8f98]">{study.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {study.stack.map((tech) => (
                <span key={tech} className="portfolio-tag">
                  {tech}
                </span>
              ))}
            </div>
            <Link href={`/work/${study.slug}`} className="portfolio-button-secondary mt-6 w-fit">
              Read case study
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

