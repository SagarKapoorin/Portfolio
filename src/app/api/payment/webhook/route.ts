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
    console.log('Received webhook event:', eventId);

   return NextResponse.json({ status: 'ok' }, { status: 200 });

}