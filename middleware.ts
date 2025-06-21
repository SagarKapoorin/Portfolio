import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from './src/lib/rate-limit';

export const runtime = 'nodejs';

export async function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  try {
    await rateLimit(`global_rate:${ip}`, 100, 60);
  } catch {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',       // all API routes
    '/payments/:path*',  // payments page + any subpaths
    '/hire/:path*',      // hire page
    '/buy-coffee/:path*',
    '/admin/:path*',     // admin dashboard
  ],
};