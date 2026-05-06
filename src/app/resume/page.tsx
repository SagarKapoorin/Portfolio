import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Download } from "lucide-react";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume of Sagar Kapoor - Full Stack Developer.",
  alternates: {
    canonical: "/resume",
  },
  openGraph: {
    title: "Resume | Sagar Kapoor",
    description: "Resume of Sagar Kapoor - Full Stack Developer.",
    images: [{ url: "/resume/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/resume/opengraph-image"],
  },
};

async function readResume() {
  const resumePath = path.join(process.cwd(), "src", "content", "resume.md");
  return fs.readFile(resumePath, "utf8");
}

export default async function ResumePage() {
  const markdown = await readResume();

  return (
    <section className="portfolio-shell py-16">
      <article className="portfolio-panel-flat mx-auto max-w-4xl p-6 md:p-10 resume-print-wrapper">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#23252a] pb-5 print:hidden">
          <div>
            <p className="text-sm text-[#8a8f98]">Resume</p>
            <h1 className="text-3xl font-semibold text-[#f7f8f8]">Sagar Kapoor</h1>
          </div>
          <a href="/SagarKapoor.pdf" className="portfolio-button-secondary">
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </div>

        <div className="resume-markdown prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      </article>

      <p className="mt-4 text-center text-xs text-[#62666d] print:hidden">
        Printable URL: {siteUrl}/resume
      </p>
    </section>
  );
}

