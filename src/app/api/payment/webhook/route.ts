import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { redis } from '@/lib/redis';
import { enqueueMailJob } from '@/lib/queue';
import { extractInstrumentKey } from '@/lib/utils';


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
  const eventType = event.event as string;
  const segments = eventType.split('.');
  const payloadKey = segments.slice(0, -1).join('.');
  const eventPayload = event.payload ?? {};
  const payloadData = eventPayload[payloadKey];
  if (!payloadData || typeof payloadData !== 'object' || !payloadData.entity) {
    console.error(`Missing payload data for key "${payloadKey}"`, eventPayload);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const entity = payloadData.entity;
  const eventId = (typeof entity.order_id === 'string' ? entity.order_id : undefined)
    || (typeof entity.id === 'string' ? entity.id : undefined);
  if (!eventId) {
    console.error('Cannot determine event id from entity', entity);
    return NextResponse.json({ error: 'Invalid payload: missing id' }, { status: 400 });
  }
  if (eventType === 'payment.downtime.started' || eventType === 'payment.downtime.resolved') {
    try {
      const gateway = extractInstrumentKey(entity.instrument) || 'default';
      const method = (entity.method as string) || 'default';
      const prefix = `downtime:${gateway}:${method}`;
      if (eventType === 'payment.downtime.started') {
        console.log('Got a downtime started event for', gateway, method);
        const status = await redis.get(`${prefix}:status`);
        if (status !== 'down') {
          const window = await prisma.downtimeWindow.create({
            data: { gateway, method, startTime: new Date() }
          });
          await redis.set(`${prefix}:windowId`, window.id.toString());
          await redis.set(`${prefix}:status`, 'down');
        }
        await redis.set(`${prefix}:lastPing`, Date.now().toString());
      } else {
        console.log('Got a downtime resolved event for', gateway, method);
        const status = await redis.get(`${prefix}:status`);
        if (status === 'down') {
          const idStr = await redis.get(`${prefix}:windowId`);
          const winId = idStr ? parseInt(idStr, 10) : undefined;
          if (winId) {
            const win = await prisma.downtimeWindow.findUnique({ where: { id: winId } });
            if (win) {
              const endTime = new Date();
              const duration = Math.floor((endTime.getTime() - win.startTime.getTime()) / 1000);
              await prisma.downtimeWindow.update({
                where: { id: winId },
                data: { endTime, duration }
              });
            }
          }
          await redis.del(`${prefix}:status`);
          await redis.del(`${prefix}:windowId`);
          await redis.del(`${prefix}:lastPing`);
        }
      }
    } catch (err) {
      console.error('Error handling downtime event:', err);
    }
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  }
  
  const existing = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
  if (existing) {
    return NextResponse.json({ status: 'ignored' }, { status: 200 });
  }
  await prisma.webhookEvent.create({ data: { id: eventId, type: eventType } });
  if (eventType === 'payment.failed' || eventType === 'payment.captured') {
    const orderId = entity.order_id as string;
    const paymentRec = await prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: { user: true },
    });
    if (paymentRec && paymentRec.status === 'PENDING') {
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
