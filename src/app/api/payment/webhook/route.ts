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
  const eventType = event.event as string;
  // Determine the payload key by joining all segments except the last (e.g. "payment.downtime" for "payment.downtime.started")
  const segments = eventType.split('.');
  const payloadKey = segments.slice(0, -1).join('.');
  const eventPayload = event.payload ?? {};
  const payloadData = eventPayload[payloadKey];
  if (!payloadData || typeof payloadData !== 'object' || !payloadData.entity) {
    console.error(`Missing payload data for key "${payloadKey}"`, eventPayload);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const entity = payloadData.entity;
  // For payment events use order_id, otherwise fallback to id
  const eventId = (typeof entity.order_id === 'string' ? entity.order_id : undefined)
    || (typeof entity.id === 'string' ? entity.id : undefined);
  if (!eventId) {
    console.error('Cannot determine event id from entity', entity);
    return NextResponse.json({ error: 'Invalid payload: missing id' }, { status: 400 });
  }
  console.log('Payload entity:', entity);
  console.log('Received webhook event:', eventId);
  const existing = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
  if (existing) {
    return NextResponse.json({ status: 'ignored' }, { status: 200 });
  }
  await prisma.webhookEvent.create({ data: { id: eventId, type: eventType } });
  // Handle payment succeeded or failed events
  if (eventType === 'payment.failed' || eventType === 'payment.captured') {
    // Use extracted entity for payment events
    const orderId = entity.order_id as string;
    const paymentRec = await prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: { user: true },
    });
    if (paymentRec && paymentRec.status === 'PENDING') {
      // Mark as COMPLETED for captured payments, FAILED for failed payments
      const newStatus = (eventType === 'payment.captured') ? 'COMPLETED' : 'FAILED';
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