import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "path";
import { redisGet, redisSet } from "@/lib/redis";
import { embedText } from "@/lib/rag/embed";
import type { RagChunk } from "@/lib/rag/retrieve";

const RAG_CACHE_KEY = "rag:vectors:gemini:v1";

function chunkText(text: string, maxWords = 120) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];

  for (let index = 0; index < words.length; index += maxWords) {
    chunks.push(words.slice(index, index + maxWords).join(" "));
  }

  return chunks;
}

async function readResumeContent() {
  const resumePath = path.join(process.cwd(), "src", "content", "resume.md");
  return fs.readFile(resumePath, "utf8");
}

async function readAboutContent() {
  const aboutPath = path.join(process.cwd(), "src", "content", "about.md");
  return fs.readFile(aboutPath, "utf8");
}

async function readCaseStudyContents() {
  const dir = path.join(process.cwd(), "src", "content", "case-studies");
  const files = await fs.readdir(dir);

  return Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const filePath = path.join(dir, file);
        const raw = await fs.readFile(filePath, "utf8");
        const parsed = matter(raw);
        const title = String(parsed.data.title || file.replace(".mdx", ""));
        return `# ${title}\n\n${parsed.content}`;
      })
  );
}

async function buildChunkTexts() {
  const [resume, about, caseStudies] = await Promise.all([
    readResumeContent(),
    readAboutContent(),
    readCaseStudyContents(),
  ]);

  const sources = [
    { source: "resume", text: resume },
    { source: "about", text: about },
    ...caseStudies.map((studyText, index) => ({ source: `case_study_${index + 1}`, text: studyText })),
  ];

  return sources.flatMap(({ source, text }) =>
    chunkText(text).map((chunk, index) => ({
      id: `${source}_${index}`,
      source,
      text: chunk,
    }))
  );
}

export async function getRagChunks() {
  try {
    const cached = await redisGet(RAG_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as RagChunk[];
    }
  } catch {
    // Continue without cache.
  }

  const chunkTexts = await buildChunkTexts();
  const chunks: RagChunk[] = [];

  for (const chunk of chunkTexts) {
    const embedding = await embedText(chunk.text);
    chunks.push({ ...chunk, embedding });
  }

  try {
    await redisSet(RAG_CACHE_KEY, JSON.stringify(chunks));
  } catch {
    // Continue without cache persistence.
  }

  return chunks;
}

