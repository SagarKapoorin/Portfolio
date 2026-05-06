import { NextResponse } from 'next/server';
import { redisGet, redisSet } from '@/lib/redis';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const base = searchParams.get('base');
    const target = searchParams.get('target');
    if (!base || !target) {
      return NextResponse.json({ error: 'Missing base or target parameter' }, { status: 400 });
    }
    const cacheKey = `rate:${base}:${target}`;
    let rateStr = await redisGet(cacheKey).catch(() => null);
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
      await redisSet(cacheKey, rateStr, { EX: 3600 }).catch(() => null);
    }
    const rate = parseFloat(rateStr);
    return NextResponse.json({ rate });
  } catch (err) {
    console.error('Rate API error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}