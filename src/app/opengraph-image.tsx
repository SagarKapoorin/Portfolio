import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sagar Kapoor Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "linear-gradient(145deg, #0f1011 0%, #010102 60%, #18191a 100%)",
          color: "#f7f8f8",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            border: "1px solid #34343a",
            background: "#141516",
            borderRadius: "999px",
            padding: "10px 18px",
            fontSize: 24,
            color: "#d0d6e0",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#5e6ad2",
            }}
          />
          Full Stack Developer
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <h1 style={{ fontSize: 72, margin: 0, lineHeight: 1.05, letterSpacing: -1.4 }}>
            Sagar Kapoor
          </h1>
          <p style={{ margin: 0, fontSize: 30, color: "#8a8f98", maxWidth: "90%" }}>
            Building AI-powered product systems with Go, TypeScript, React, and data-driven backend
            architectures.
          </p>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {["Go", "TypeScript", "React", "Node.js", "PostgreSQL", "Redis"].map((item) => (
            <span
              key={item}
              style={{
                border: "1px solid #23252a",
                borderRadius: 999,
                padding: "8px 14px",
                fontSize: 22,
                color: "#d0d6e0",
                background: "#0f1011",
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

