import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import prisma from '@/lib/prisma';

export async function GET() {
  const status = await prisma.developerStatus.upsert({
    where: { id: 1 },
    update: {},
    create: { available: true },
  });
  const response: any = { available: status.available };
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const usedCount = await prisma.hireRequest.count({
        where: {
          user_id: user.id,
          createdAt: { gte: startOfMonth },
        },
      });
      const MAX_REQUESTS_PER_MONTH = 5;
      response.used = usedCount;
      response.limit = MAX_REQUESTS_PER_MONTH;
      response.remaining = MAX_REQUESTS_PER_MONTH - usedCount;
    }
  }
  return NextResponse.json(response);
}