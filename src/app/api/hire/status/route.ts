import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const status = await prisma.developerStatus.upsert({
    where: { id: 1 },
    update: {},
    create: { available: true },
  });
  return NextResponse.json({ available: status.available });
}