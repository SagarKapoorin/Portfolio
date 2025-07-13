"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Fragment } from 'react';
import { Coffee, ChevronDown, ChevronUp } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

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
type PaymentInput = z.infer<typeof PaymentSchema>;

export default function BuyCoffeePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string>('');
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentInput>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: { amount: 1, currency: 'USD' },
  });
  const amount = watch('amount');
  const currency = watch('currency');
  const stepValue = 0.1;
  const handleIncrement = () => setValue('amount', Math.round((amount + stepValue) * 10) / 10);
  const handleDecrement = () => setValue('amount', Math.max(stepValue, Math.round((amount - stepValue) * 10) / 10));

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async (response: any) => {
        const verify = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response),
        });
        if (!verify.ok) {
          toast.error('Payment verification failed');
        } else {
          toast.success('Payment successful!');
        }
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  // Redirect unauthenticated users to sign-in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return null;

  return (
    
    <div className="min-h-screen flex items-center justify-center p-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 p-8 flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-2">
          <Coffee className="w-8 h-8 text-yellow-300" />
          <h1 className="text-3xl font-bold text-white">Buy Me a Coffee</h1>
        </div>
        <p className="text-gray-300 text-center">Your support keeps me brewing and coding. Thank you!</p>
        <div className="text-white text-2xl font-semibold">{currency} {amount}</div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-200 mb-1">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  {...register('amount', { valueAsNumber: true })}
                  className="w-full bg-black/20 text-white placeholder-gray-300 rounded-lg px-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none -moz-appearance:textfield"
                />
                <div className="absolute inset-y-0 right-2 flex flex-col justify-center space-y-1">
                  <button type="button" onClick={handleIncrement} className="p-0">
                    <ChevronUp className="w-4 h-4 text-gray-300 hover:text-yellow-300" />
                  </button>
                  <button type="button" onClick={handleDecrement} className="p-0">
                    <ChevronDown className="w-4 h-4 text-gray-300 hover:text-yellow-300" />
                  </button>
                </div>
              </div>
              {errors.amount && <p className="text-yellow-300 text-sm mt-1">{errors.amount.message}</p>}
            </div>
            <div className="w-32 relative flex justify-center items-end">
              <Listbox value={currency} onChange={(val) => setValue('currency', val)}>
              <Listbox.Button className="w-full bg-black/20 text-white rounded-lg px-3 py-2 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-yellow-400">
                <span>{currency}</span>
                <ChevronDown className="w-5 h-5 text-gray-300" />
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 w-32 bg-black/80 text-white rounded-lg py-1 z-50 shadow-lg">
                {['USD','INR'].map((opt) => (
                  <Listbox.Option
                  key={opt}
                  value={opt}
                  className={({ active }) =>
                    `${active ? 'bg-white/20' : ''} px-4 py-2 cursor-pointer`
                  }
                  >
                  {opt}
                  </Listbox.Option>
                ))}
                </Listbox.Options>
              </Transition>
              </Listbox>
            </div>
          </div>
          {error && <p className="text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg px-4 py-3 transition-colors"
          >
            {isSubmitting ? 'Processing...' : 'Buy Coffee'}
          </button>
        </form>
      </div>
    </div>
  );
}