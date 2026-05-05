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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return null;

  return (
    
    <div className="portfolio-shell flex min-h-[calc(100vh-64px)] items-center justify-center py-16">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="portfolio-panel flex w-full max-w-xl flex-col items-center space-y-8 p-6 sm:p-8">
        <div className="flex items-center space-x-2">
          <Coffee className="h-8 w-8 text-[#f7a501]" />
          <h1 className="whitespace-nowrap text-2xl font-semibold text-[#f7f8f8] sm:text-3xl">Buy Me a Coffee</h1>
        </div>
        <p className="text-center text-[#8a8f98]">Your support keeps me brewing and coding. Thank you!</p>
        <div className="text-2xl font-semibold text-[#f7f8f8]">{currency} {amount}</div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 w-full">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-[#d0d6e0]">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  {...register('amount', { valueAsNumber: true })}
                  className="w-full rounded-lg border border-[#23252a] bg-[#141516] px-4 py-3 pr-10 text-white outline-none transition-colors placeholder:text-[#62666d] focus:border-[#5e6ad2] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none -moz-appearance:textfield"
                />
                <div className="absolute inset-y-0 right-2 flex flex-col justify-center space-y-1">
                  <button type="button" onClick={handleIncrement} className="p-0">
                    <ChevronUp className="h-4 w-4 text-[#8a8f98] hover:text-[#f7a501]" />
                  </button>
                  <button type="button" onClick={handleDecrement} className="p-0">
                    <ChevronDown className="h-4 w-4 text-[#8a8f98] hover:text-[#f7a501]" />
                  </button>
                </div>
              </div>
              {errors.amount && <p className="mt-1 text-sm text-[#f7a501]">{errors.amount.message}</p>}
            </div>
            <div className="w-full sm:w-32 relative flex justify-start sm:justify-center items-end">
              <Listbox value={currency} onChange={(val) => setValue('currency', val)}>
              <Listbox.Button className="flex w-full items-center justify-between rounded-lg border border-[#23252a] bg-[#141516] px-3 py-3 text-white outline-none focus:border-[#5e6ad2]">
                <span>{currency}</span>
                <ChevronDown className="h-5 w-5 text-[#8a8f98]" />
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-50 mt-1 w-full rounded-lg border border-[#23252a] bg-[#0f1011] py-1 text-white shadow-lg sm:w-32">
                {['USD','INR'].map((opt) => (
                  <Listbox.Option
                  key={opt}
                  value={opt}
                  className={({ active }) =>
                    `${active ? 'bg-[#141516]' : ''} px-4 py-2 cursor-pointer`
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
          {error && <p className="text-center text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="portfolio-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Processing...' : 'Buy Coffee'}
          </button>
        </form>
      </div>
    </div>
  );
}
