import { createHash } from "crypto";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { redisExpire, redisGet, redisIncr, redisSet } from "@/lib/redis";
import { embedText } from "@/lib/rag/embed";
import { getGeminiClient } from "@/lib/rag/gemini";
import { getRagChunks } from "@/lib/rag";
import { retrieveTopChunks } from "@/lib/rag/retrieve";

const encoder = new TextEncoder();
const MAX_QUESTION_LENGTH = 280;
const HOURLY_LIMIT = 10;
const DAILY_LIMIT = 1200;

function getIpAddress(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

async function incrementRateLimit(key: string, ttlSec: number) {
  try {
    const count = await redisIncr(key);
    if (count === 1) {
      await redisExpire(key, ttlSec);
    }
    return count;
  } catch {
    return 0;
  }
}

function streamMessage(message: string, event: "chunk" | "done" | "error") {
  return encoder.encode(`data: ${JSON.stringify({ event, text: message })}\n\n`);
}

function getAskErrorResponse(error: unknown) {
  const status = typeof (error as { status?: unknown })?.status === "number" ? (error as { status: number }).status : 500;
  const message = error instanceof Error ? error.message : "";

  if (status === 403 || message.includes("PERMISSION_DENIED")) {
    return NextResponse.json(
      {
        error:
          "Gemini project access is denied for this API key. Create a new AI Studio key from an allowed project and restart the server.",
      },
      { status: 403 }
    );
  }

  if (status === 429 || message.includes("RESOURCE_EXHAUSTED")) {
    return NextResponse.json(
      { error: "Gemini quota is exhausted for this API key. Please retry later or use a different key/project." },
      { status: 429 }
    );
  }

  return NextResponse.json({ error: "Failed to process Ask Sagar request." }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = typeof body?.question === "string" ? body.question.trim() : "";

    if (!question || question.length > MAX_QUESTION_LENGTH) {
      return NextResponse.json(
        { error: `Question is required and must be <= ${MAX_QUESTION_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const ip = getIpAddress(request);
    const now = new Date();
    const hourBucket = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}-${now.getUTCHours()}`;
    const dayBucket = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;

    const hourlyKey = `ask:ip:${ip}:${hourBucket}`;
    const dailyKey = `ask:daily:${dayBucket}`;

    const [hourlyCount, dailyCount] = await Promise.all([
      incrementRateLimit(hourlyKey, 60 * 60),
      incrementRateLimit(dailyKey, 60 * 60 * 24),
    ]);

    if (hourlyCount > HOURLY_LIMIT) {
      return NextResponse.json({ error: "Hourly limit reached. Try again later." }, { status: 429 });
    }

    if (dailyCount > DAILY_LIMIT) {
      return NextResponse.json({ error: "Daily query limit reached. Please try tomorrow." }, { status: 429 });
    }

    const chunks = await getRagChunks();
    const queryEmbedding = await embedText(question);
    const topMatches = retrieveTopChunks(chunks, queryEmbedding, 4);

    const responseCacheKey = `ask:resp:${createHash("sha1")
      .update(`${question}:${topMatches.map((item) => item.chunk.id).join("|")}`)
      .digest("hex")}`;

    let cachedResponse: string | null = null;
    try {
      cachedResponse = await redisGet(responseCacheKey);
    } catch {
      cachedResponse = null;
    }
    if (cachedResponse) {
      const cachedStream = new ReadableStream({
        start(controller) {
          controller.enqueue(streamMessage(cachedResponse, "chunk"));
          controller.enqueue(streamMessage("", "done"));
          controller.close();
        },
      });

      return new Response(cachedStream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    const context = topMatches
      .map((item, index) => `Context ${index + 1} (${item.chunk.source}):\n${item.chunk.text}`)
      .join("\n\n");

    const prompt = `You are Sagar Kapoor's portfolio assistant. Answer ONLY using the provided context about Sagar's skills, experience, projects, and achievements.
If the user asks something off-topic, politely redirect to his engineering work.
Keep answers concise and cite specific roles/projects from context when possible.

Context:
${context}

Question:
${question}`;

    let completeResponse = "";
    const client = getGeminiClient();
    const stream = (await client.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    })) as any;

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk?.text ?? "";
            if (!text) continue;

            completeResponse += text;
            controller.enqueue(streamMessage(text, "chunk"));
          }

          controller.enqueue(streamMessage("", "done"));
          controller.close();

          await Promise.allSettled([
            redisSet(responseCacheKey, completeResponse, { EX: 60 * 30 }),
            prisma.chatQuery.create({
              data: {
                question,
                answer: completeResponse,
                ip,
              },
            }) as Promise<unknown>,
          ]);
        } catch (error) {
          console.error("[ask] stream failure", error);
          controller.enqueue(streamMessage("Unable to stream answer right now. Please retry.", "error"));
          controller.close();
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[ask] route failure", error);
    return getAskErrorResponse(error);
  }
}

