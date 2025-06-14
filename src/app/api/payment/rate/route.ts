import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

/**
 * GET /api/payment/rate?base=USD&target=INR
 * Returns exchange rate, cached in Redis
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const base = searchParams.get('base') || 'USD';
  const target = searchParams.get('target') || 'INR';
  const cacheKey = `rate:${base}:${target}`;
  let rate = await redis.get(cacheKey);
  if (!rate) {
    const res = await fetch(
      `https://api.exchangerate.host/latest?base=${base}&symbols=${target}`
    );
    const data = await res.json();
    rate = String(data.rates?.[target] || 1);
    await redis.set(cacheKey, rate, { EX: 3600 });
  }
  return NextResponse.json({ rate: parseFloat(rate) });
}