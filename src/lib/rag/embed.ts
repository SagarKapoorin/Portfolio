import { getGeminiClient } from "@/lib/rag/gemini";

const EMBEDDING_MODEL = "gemini-embedding-001";

export async function embedText(text: string): Promise<number[]> {
  const client = getGeminiClient();
  const response = (await client.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
  })) as any;

  const vector = response?.embeddings?.[0]?.values ?? response?.embedding?.values;
  if (!Array.isArray(vector)) {
    throw new Error("Gemini embedding response did not include vectors");
  }

  return vector;
}

