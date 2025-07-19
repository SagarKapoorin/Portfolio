import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = new URL(request.url);
  const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1);
  const perPage = 10; 
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');
  const userEmail = session.user.email;
  const where: any = { user: { email: userEmail } };
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      const d = new Date(startDate);
      if (!isNaN(d.valueOf())) where.createdAt.gte = d;
    }
    if (endDate) {
      const d = new Date(endDate);
      if (!isNaN(d.valueOf())) where.createdAt.lte = d;
    }
  }

  const total = await prisma.hireRequest.count({ where });
  const requests = await prisma.hireRequest.findMany({
    where,
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  const totalPages = Math.ceil(total / perPage) || 1;
  return NextResponse.json(
    {
      data: requests.map((r) => ({
        id: r.id,
        title: r.title,
        budget: r.budget,
        projectDetail: r.projectDetail,
        timePeriod: r.timePeriod,
        userEmail: r.user.email,
        createdAt: r.createdAt,
      })),
      meta: { total, page, perPage, totalPages },
    },
    { status: 200 }
  );
}