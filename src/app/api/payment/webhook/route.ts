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
    console.log(bodyText)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const eventId = JSON.parse(JSON.stringify(event.payload.payment.entity)).order_id;
  const eventType = event.event;
  console.log(JSON.parse(JSON.stringify(event.payload.payment.entity)));
  console.log('Received webhook event:', eventId);
  const existing = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
  if (existing) {
    return NextResponse.json({ status: 'ignored' }, { status: 200 });
  }
  await prisma.webhookEvent.create({ data: { id: eventId, type: eventType } });
  if (eventType === 'payment.failed'|| eventType === 'order.paid') {
    const paymentData = JSON.stringify(event.payload.payment.entity);
    const paymentEntity = JSON.parse(paymentData);
    const orderId = paymentEntity.order_id as string;
    const paymentRec = await prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: { user: true },
    });
    if (paymentRec && paymentRec.status === 'PENDING') {
      const newStatus = (eventType === 'order.paid') ? 'COMPLETED' : 'FAILED';
      await prisma.payment.update({
        where: { id: paymentRec.id },
        data: { status: newStatus },
      });
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