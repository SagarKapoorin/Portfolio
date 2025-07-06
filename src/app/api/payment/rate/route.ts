import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

/**
 * GET /api/payment/rate?base=USD&target=INR
 * Returns the exchange rate from base to target currency.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const base = searchParams.get('base');
    const target = searchParams.get('target');
    if (!base || !target) {
      return NextResponse.json({ error: 'Missing base or target parameter' }, { status: 400 });
    }
    const cacheKey = `rate:${base}:${target}`;
    // Try cache
    let rateStr = await redis.get(cacheKey);
    if (!rateStr) {
      const res = await fetch(
        `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(target)}`
      );
      if (!res.ok) {
        return NextResponse.json({ error: 'Failed fetching rate' }, { status: 502 });
      }
      const data = await res.json();
      const rate = data?.rates?.[target];
      if (typeof rate !== 'number') {
        return NextResponse.json({ error: 'Invalid rate data' }, { status: 502 });
      }
      rateStr = String(rate);
      // Cache for 1 hour
      await redis.set(cacheKey, rateStr, { EX: 3600 });
    }
    const rate = parseFloat(rateStr);
    return NextResponse.json({ rate });
  } catch (err) {
    console.error('Rate API error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}