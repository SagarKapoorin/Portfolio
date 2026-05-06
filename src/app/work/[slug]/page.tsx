import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { MarkdownRenderer } from "@/components/mdx/MarkdownRenderer";
import { Metric } from "@/components/mdx/Metric";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/case-studies";
import { getSiteUrl } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const studies = await getAllCaseStudies();
  return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) {
    return {
      title: "Work",
      description: "Case study not found.",
    };
  }

  return {
    title: study.title,
    description: study.summary,
    alternates: {
      canonical: `/work/${study.slug}`,
    },
    openGraph: {
      title: `${study.title} | Case Study`,
      description: study.summary,
      images: [{ url: `/work/${study.slug}/opengraph-image` }],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/work/${study.slug}/opengraph-image`],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.summary,
    datePublished: "2026-05-06",
    author: {
      "@type": "Person",
      name: "Sagar Kapoor",
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/work/${study.slug}`,
  };

  return (
    <section className="portfolio-shell py-20">
      <Script
        id={`article-jsonld-${study.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="portfolio-panel-flat p-6 md:p-8">
        <p className="font-mono text-xs uppercase text-[#f7a501]">Case study</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#f7f8f8] md:text-5xl">
          {study.title}
        </h1>
        <p className="mt-4 text-sm text-[#8a8f98]">
          {study.role} - {study.period}
        </p>
        <p className="mt-6 text-base leading-8 text-[#8a8f98]">{study.hero}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {study.stack.map((tech) => (
            <span key={tech} className="portfolio-tag">
              {tech}
            </span>
          ))}
        </div>
      </article>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {study.metrics.map((metric) => (
          <Metric key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>

      <div className="portfolio-panel-flat mt-6 p-6 md:p-8">
        <MarkdownRenderer content={study.content} />
      </div>
    </section>
  );
}

