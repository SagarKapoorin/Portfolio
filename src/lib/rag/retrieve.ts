export type RagChunk = {
  id: string;
  source: string;
  text: string;
  embedding: number[];
};

function cosineSimilarity(a: number[], b: number[]) {
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < length; index += 1) {
    const aVal = a[index];
    const bVal = b[index];
    dot += aVal * bVal;
    normA += aVal * aVal;
    normB += bVal * bVal;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function retrieveTopChunks(chunks: RagChunk[], queryEmbedding: number[], topK = 4) {
  return chunks
    .map((chunk) => ({
      chunk,
      score: cosineSimilarity(chunk.embedding, queryEmbedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

