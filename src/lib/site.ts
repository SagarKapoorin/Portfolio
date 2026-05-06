export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000";

  const normalized = rawUrl.replace(/\/+$/, "");
  try {
    const validUrl = new URL(normalized);
    return validUrl.toString().replace(/\/+$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

