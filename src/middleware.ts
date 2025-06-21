import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

export async function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const { allowed, ttl } = await rateLimit(`global_rate:${ip}`, 100, 60);
  if (!allowed) {
    return new NextResponse('Too many requests', {
      status: 429,
      headers: {
        'Retry-After': `${ttl}`,
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/api/:path*',  
  ],
};