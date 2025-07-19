import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import prisma from '@/lib/prisma';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { enqueueMailJob, enqueueNotificationJob } from '@/lib/queue';
import { z } from 'zod';

const VerifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = VerifySchema.parse(body);
  const generated = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  if (generated !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  const order: any = await razorpay.orders.fetch(razorpay_order_id);
  const receipt = order.receipt as string;
  await prisma.payment.update({ where: { id: receipt }, data: { status: 'COMPLETED' } });
  const paymentRecord = await prisma.payment.findUnique({ where: { id: receipt } });
  // Enqueue notification job via Redis list rather than using pub/sub
  await enqueueNotificationJob({ type: 'payment_completed', payload: paymentRecord });
  try {
    await enqueueMailJob('payment-email', {
      userEmail: session.user.email,
      paymentData: paymentRecord,
    });
  } catch (err) {
    console.error('Failed to enqueue payment email job', err);
  }
  return NextResponse.json({ success: true });
}