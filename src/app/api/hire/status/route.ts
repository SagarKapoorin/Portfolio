import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/hire/status
 * Returns whether the developer is available for hire.
 */
export async function GET() {
  const status = await prisma.developerStatus.upsert({
    where: { id: 1 },
    update: {},
    create: { available: true },
  });
  return NextResponse.json({ available: status.available });
}