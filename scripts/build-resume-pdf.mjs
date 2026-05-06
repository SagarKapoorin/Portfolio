import fs from "fs/promises";
import path from "path";

const rootDir = process.cwd();
const resumeSourcePath = path.join(rootDir, "src", "content", "resume.md");
const publicDir = path.join(rootDir, "public");
const outputPath = path.join(publicDir, "SagarKapoor.pdf");

function escapeHtml(input) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function buildPdf() {
  try {
    const markdown = await fs.readFile(resumeSourcePath, "utf8");
    const puppeteer = await import("puppeteer-core");
    const chromium = await import("@sparticuz/chromium");

    await fs.mkdir(publicDir, { recursive: true });

    const browser = await puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: chromium.default.defaultViewport,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(
      `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 28px; color: #111; }
            pre { white-space: pre-wrap; font-family: Arial, sans-serif; line-height: 1.45; }
          </style>
        </head>
        <body>
          <pre>${escapeHtml(markdown)}</pre>
        </body>
      </html>`,
      { waitUntil: "domcontentloaded" }
    );
    await page.pdf({ path: outputPath, format: "A4", printBackground: true, margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" } });
    await browser.close();
    console.log("Generated resume PDF at", outputPath);
  } catch (error) {
    console.warn("Skipping resume PDF build. Reason:", error?.message || error);
  }
}

buildPdf();

