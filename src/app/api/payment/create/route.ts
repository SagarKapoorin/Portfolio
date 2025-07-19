import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import prisma from '@/lib/prisma';
import Razorpay from 'razorpay';
import { z } from 'zod';

const CreateOrderSchema = z
  .object({
    amount: z.number().positive(),
    currency: z.enum(['USD', 'INR']),
  })
  .superRefine((data, ctx) => {
    if (data.currency === 'USD' && data.amount > 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: 5,
        inclusive: true,
        message: 'Maximum $5',
        path: ['amount'],
        type: 'number',
      });
    }
    if (data.currency === 'INR' && data.amount > 1000) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: 1000,
        inclusive: true,
        message: 'Maximum ₹1000',
        path: ['amount'],
        type: 'number',
      });
    }
  });


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
  const amountInSmallestUnit = Math.round(amount * 100);
  const orderCurrency = currency;

  const payment = await prisma.payment.create({
    data: { amount, currency, user_id: user.id },
  });
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  const order: any = await razorpay.orders.create({
    amount: amountInSmallestUnit,
    currency: orderCurrency,
    receipt: payment.id,
    payment_capture: true,
  });
  await prisma.payment.update({
    where: { id: payment.id },
    data: { razorpayOrderId: order.id },
  });
  return NextResponse.json({ order, key: process.env.RAZORPAY_KEY_ID });
}