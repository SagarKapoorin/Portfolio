import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

type Metric = {
  label: string;
  value: string;
};

export type CaseStudyFrontmatter = {
  title: string;
  slug: string;
  role: string;
  period: string;
  stack: string[];
  hero: string;
  summary: string;
  status: "shipped" | "personal";
  metrics: Metric[];
};

export type CaseStudy = CaseStudyFrontmatter & {
  content: string;
};

const CASE_STUDY_DIR = path.join(process.cwd(), "src", "content", "case-studies");

const fallbackCaseStudies: CaseStudy[] = [];

function normalizeFrontmatter(data: Record<string, unknown>): CaseStudyFrontmatter {
  const metrics = Array.isArray(data.metrics) ? (data.metrics as Metric[]) : [];

  return {
    title: String(data.title || ""),
    slug: String(data.slug || ""),
    role: String(data.role || ""),
    period: String(data.period || ""),
    stack: Array.isArray(data.stack) ? data.stack.map((value) => String(value)) : [],
    hero: String(data.hero || ""),
    summary: String(data.summary || ""),
    status: data.status === "shipped" ? "shipped" : "personal",
    metrics,
  };
}

export const getAllCaseStudies = cache(async (): Promise<CaseStudy[]> => {
  try {
    const files = await fs.readdir(CASE_STUDY_DIR);
    const studies = await Promise.all(
      files
        .filter((file) => file.endsWith(".mdx"))
        .map(async (file) => {
          const filePath = path.join(CASE_STUDY_DIR, file);
          const raw = await fs.readFile(filePath, "utf8");
          const parsed = matter(raw);
          const frontmatter = normalizeFrontmatter(parsed.data);

          return {
            ...frontmatter,
            content: parsed.content,
          } satisfies CaseStudy;
        })
    );

    return studies.sort((a, b) => a.title.localeCompare(b.title));
  } catch {
    return fallbackCaseStudies;
  }
});

export const getCaseStudyBySlug = cache(async (slug: string): Promise<CaseStudy | null> => {
  const studies = await getAllCaseStudies();
  return studies.find((study) => study.slug === slug) ?? null;
});

