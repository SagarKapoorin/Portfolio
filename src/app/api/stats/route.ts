import { NextResponse } from "next/server";
import { getPortfolioStats } from "@/lib/stats";

export async function GET() {
  const payload = await getPortfolioStats();
  return NextResponse.json(payload);
}

