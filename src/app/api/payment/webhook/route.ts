import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { redis } from '@/lib/redis';
import { enqueueMailJob } from '@/lib/queue';


export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers.get('x-razorpay-signature') || '';
  const bodyText = await req.text();
  const expected = crypto
    .createHmac('sha256', secret)
    .update(bodyText)
    .digest('hex');
  if (signature !== expected) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  let event: any;
  try {
    event = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const eventId = event.id as string;
  const eventType = event.event as string;
  const existing = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
  if (existing) {
    return NextResponse.json({ status: 'ignored' }, { status: 200 });
  }
  await prisma.webhookEvent.create({ data: { id: eventId, type: eventType } });
  if (eventType === 'payment.captured' || eventType === 'payment.failed') {
    const paymentEntity = event.payload.payment.entity;
    const orderId = paymentEntity.order_id as string;
    const paymentRec = await prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: { user: true },
    });
    if (paymentRec && paymentRec.status === 'PENDING') {
      const newStatus = eventType === 'payment.captured' ? 'COMPLETED' : 'FAILED';
      await prisma.payment.update({
        where: { id: paymentRec.id },
        data: { status: newStatus },
      });
      await redis.publish(
        'notifications',
        JSON.stringify({ type: 'payment_' + newStatus.toLowerCase(), payload: { id: paymentRec.id, amount: paymentRec.amount, currency: paymentRec.currency, user_email: paymentRec.user.email } })
      );
      try {
        await enqueueMailJob('payment-email', {
          userEmail: paymentRec.user.email,
          paymentData: { amount: paymentRec.amount, currency: paymentRec.currency },
        });
      } catch (err) {
        console.error('Failed to enqueue payment email job', err);
      }
    }
  }
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}