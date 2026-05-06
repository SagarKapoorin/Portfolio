import { ImageResponse } from "next/og";
import { getCaseStudyBySlug } from "@/lib/case-studies";

export const runtime = "nodejs";
export const alt = "Sagar Kapoor Case Study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

function slugToTitle(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function CaseStudyOpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  const title = study?.title ?? slugToTitle(slug);
  const subtitle = study?.role ?? "Case Study";
  const stack = study?.stack?.slice(0, 5) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background: "radial-gradient(circle at top right, #5e6ad2 0%, #0f1011 38%, #010102 100%)",
          color: "#f7f8f8",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            width: "fit-content",
            borderRadius: 999,
            border: "1px solid #34343a",
            background: "#141516",
            color: "#d0d6e0",
            padding: "10px 16px",
            fontSize: 22,
          }}
        >
          {subtitle}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1 style={{ fontSize: 66, lineHeight: 1.05, margin: 0 }}>{title || "Project"}</h1>
          <p style={{ margin: 0, fontSize: 30, color: "#8a8f98", lineHeight: 1.35 }}>
            Product decisions, architecture tradeoffs, implementation details, and measurable
            outcomes.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {stack.map((item) => (
            <span
              key={item}
              style={{
                borderRadius: 999,
                border: "1px solid #23252a",
                color: "#d0d6e0",
                background: "#0f1011",
                padding: "8px 12px",
                fontSize: 20,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    ),
    size
  );
}

