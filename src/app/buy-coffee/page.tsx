"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import Script from 'next/script';

const PaymentSchema = z
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
      });
    }
    if (data.currency === 'INR' && data.amount > 1000) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: 1000,
        inclusive: true,
        message: 'Maximum ₹1000',
        path: ['amount'],
      });
    }
  });
type PaymentInput = z.infer<typeof PaymentSchema>;

export default function BuyCoffeePage() {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string>('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PaymentInput>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: { amount: 1, currency: 'USD' },
  });
  const amount = watch('amount');
  const currency = watch('currency');

  const onSubmit = async (data: PaymentInput) => {
    setError('');
    const res = await fetch('/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || 'Error creating order');
      return;
    }
    const { order, key } = json;
  // TODO: replace `any` with proper Razorpay options type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
      key,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: 'Buy Me a Coffee',
      description: 'Thank you for your support!',
      prefill: {
        name: session?.user?.name,
        email: session?.user?.email,
      },
      method: 'upi',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async (response: any) => {
        const verify = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response),
        });
        if (!verify.ok) setError('Payment verification failed');
        else alert('Payment successful!');
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Please sign in to donate.</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="text-2xl mb-4">Buy Me a Coffee</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            step="0.1"
            {...register('amount', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
          {errors.amount && <p className="text-red-500">{errors.amount.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Currency</label>
          <select {...register('currency')} className="w-full p-2 border rounded">
            <option value="USD">USD</option>
            <option value="INR">INR</option>
          </select>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {isSubmitting ? 'Processing...' : 'Buy Coffee'}
        </button>
      </form>
    </div>
  );
}