import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getAllCaseStudies } from "@/lib/case-studies";

const staticRoutes = ["/", "/aboutme", "/hire", "/buy-coffee", "/payments", "/signin", "/resume", "/work"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const caseStudies = await getAllCaseStudies();

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const workEntries = caseStudies.map((study) => ({
    url: `${siteUrl}/work/${study.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...workEntries];
}

