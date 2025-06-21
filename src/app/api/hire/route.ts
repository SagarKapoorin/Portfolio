import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import prisma from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { z } from 'zod';
import { enqueueMailJob } from '@/lib/queue';

const HireSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  budget: z.number().positive('Budget must be positive'),
  projectDetail: z.string().min(1, 'Project details required'),
  timePeriod: z.string().min(1, 'Time period required'),
});


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { title, budget, projectDetail, timePeriod } = HireSchema.parse(body);
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const newRequest = await prisma.hireRequest.create({
    data: { title, budget, projectDetail, timePeriod, user_id: user.id },
  });
  await redis.publish(
    'notifications',
    JSON.stringify({
      type: 'new_message',
      payload: { id: newRequest.id, title, budget, projectDetail, timePeriod, user_email: user.email },
    })
  );
  try {
    await enqueueMailJob('hire-email', {
      userEmail: session.user.email,
      title,
      budget,
      projectDetail,
      timePeriod,
    });
  } catch (err) {
    console.error('Failed to enqueue hire email job', err);
  }
  return NextResponse.json({ id: newRequest.id }, { status: 201 });
}