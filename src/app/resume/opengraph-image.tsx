import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sagar Kapoor Resume";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function ResumeOpenGraphImage() {
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
          background: "linear-gradient(135deg, #010102 0%, #0f1011 65%, #141516 100%)",
          color: "#f7f8f8",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            width: "fit-content",
            border: "1px solid #34343a",
            borderRadius: 999,
            background: "#141516",
            color: "#d0d6e0",
            padding: "10px 16px",
            fontSize: 22,
          }}
        >
          Resume
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <h1 style={{ fontSize: 68, lineHeight: 1.05, margin: 0 }}>Sagar Kapoor</h1>
          <p style={{ fontSize: 30, lineHeight: 1.35, color: "#8a8f98", margin: 0 }}>
            Full Stack Developer with experience in AI workflows, analytics systems, and product
            engineering.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {["Go", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "ClickHouse"].map((tag) => (
            <span
              key={tag}
              style={{
                borderRadius: 999,
                border: "1px solid #23252a",
                color: "#d0d6e0",
                background: "#0f1011",
                padding: "8px 12px",
                fontSize: 20,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
    size
  );
}

