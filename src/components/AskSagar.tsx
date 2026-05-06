"use client";

import { useMemo, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import posthog from "posthog-js";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "What stack does Sagar use most?",
  "What did he build at Matrice AI?",
  "Show me his strongest backend work.",
];

export default function AskSagar() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Ask me about Sagar's projects, experience, and technical strengths.",
    },
  ]);

  const canSubmit = useMemo(() => question.trim().length > 0 && !loading, [question, loading]);

  const askQuestion = async (query: string) => {
    const prompt = query.trim();
    if (!prompt) return;

    setLoading(true);
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", content: prompt }, { role: "assistant", content: "" }]);

    if (process.env.NODE_ENV === "production") {
      posthog.capture("ask_sagar_query", { question_length: prompt.length });
    }

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prompt }),
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => ({ error: "Request failed" }));
        throw new Error(payload.error || "Request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamBuffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        streamBuffer += decoder.decode(value, { stream: true });

        const events = streamBuffer.split("\n\n");
        streamBuffer = events.pop() || "";

        for (const eventData of events) {
          const line = eventData.trim();
          if (!line.startsWith("data:")) continue;
          const payloadText = line.slice(5).trim();
          const payload = JSON.parse(payloadText) as { event: "chunk" | "done" | "error"; text: string };

          if (payload.event === "chunk") {
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (!last || last.role !== "assistant") return prev;
              copy[copy.length - 1] = {
                ...last,
                content: `${last.content}${payload.text}`,
              };
              return copy;
            });
          }

          if (payload.event === "error") {
            throw new Error(payload.text || "Streaming failed");
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to fetch answer right now.";
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: message };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className="fixed bottom-5 right-5 z-[2400] inline-flex items-center gap-2 rounded-full border border-[#3b3f53] bg-[#15172a] px-4 py-2 text-sm font-medium text-[#e4e8ff] shadow-xl transition-colors hover:bg-[#1d213b]"
      >
        <Sparkles className="h-4 w-4 text-[#8ea0ff]" />
        Ask Sagar
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-[2400] w-[min(430px,calc(100vw-24px))] rounded-2xl border border-[#23252a] bg-[#0f1011] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#23252a] p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-[#8ea0ff]" />
              <p className="text-sm font-medium text-[#f7f8f8]">Ask Sagar</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-[#23252a] p-1 text-[#8a8f98] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[320px] space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-lg border px-3 py-2 text-sm leading-6 ${
                  message.role === "user"
                    ? "border-[#3b3f53] bg-[#1a1d31] text-[#d8ddff]"
                    : "border-[#23252a] bg-[#141516] text-[#d0d6e0]"
                }`}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-[#23252a] p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => askQuestion(item)}
                  className="rounded-full border border-[#2d334f] bg-[#16192c] px-3 py-1 text-xs text-[#c7d0ff] hover:bg-[#1f2440]"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                maxLength={280}
                placeholder="Ask about projects, stack, impact..."
                className="w-full rounded-lg border border-[#23252a] bg-[#141516] px-3 py-2 text-sm text-white outline-none placeholder:text-[#62666d] focus:border-[#5e6ad2]"
              />
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => askQuestion(question)}
                className="portfolio-button-primary px-3 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

