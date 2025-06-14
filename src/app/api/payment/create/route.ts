import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import prisma from '@/lib/prisma';
import { redis } from '@/lib/redis';
import Razorpay from 'razorpay';
import { z } from 'zod';

const CreateOrderSchema = z.object({
  amount: z.number().positive().max(5, 'Maximum $5'),
  currency: z.enum(['USD', 'INR']),
});

/**
 * POST /api/payment/create - creates a Razorpay order and a pending Payment record
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { amount, currency } = CreateOrderSchema.parse(body);
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  let inrAmount = amount;
  if (currency !== 'INR') {
    const cacheKey = `rate:${currency}:INR`;
    let rate = await redis.get(cacheKey);
    if (!rate) {
      const res = await fetch(`https://api.exchangerate.host/latest?base=${currency}&symbols=INR`);
      const data = await res.json();
      rate = String(data.rates.INR || 1);
      await redis.set(cacheKey, rate, { EX: 3600 });
    }
    inrAmount = amount * parseFloat(rate);
  }
  const amountInPaise = Math.round(inrAmount * 100);

  const payment = await prisma.payment.create({
    data: { amount, currency, user_id: user.id },
  });
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  const order: any = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: payment.id,
    payment_capture: true,
  });
  await prisma.payment.update({
    where: { id: payment.id },
    data: { razorpayOrderId: order.id },
  });
  return NextResponse.json({ order, key: process.env.RAZORPAY_KEY_ID });
}