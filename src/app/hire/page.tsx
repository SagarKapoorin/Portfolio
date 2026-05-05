"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import Heading from '@/components/Heading';
import PageLoader from '@/components/PageLoader';

const HireSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  budget: z.number().positive('Budget must be positive'),
  projectDetail: z.string().min(1, 'Project details required'),
  timePeriod: z.string().min(1, 'Time period required'),
});
type HireInput = z.infer<typeof HireSchema>;

export default function HirePage() {
  const { data: session, status } = useSession();
  const [available, setAvailable] = useState<boolean | null>(null);
  const [used, setUsed] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HireInput>({ resolver: zodResolver(HireSchema) });

  // Submit hire request
  const onSubmit = async (data: HireInput) => {
    try {
      const res = await fetch('/api/hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success('Hire request sent successfully');
        reset();
        // Refresh usage to update UI
        await fetchStatus();
      } else {
        let message = 'Failed to send hire request';
        try {
          const { error } = await res.json();
          if (error) message = error;
        } catch {}
        toast.error(message);
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  // Fetch availability and usage
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/hire/status');
      const json = await res.json();
      setAvailable(json.available);
      setUsed(json.used ?? 0);
      setLimit(json.limit ?? 5);
    } catch {
      setAvailable(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);
  if (status === 'loading' || available === null) return <PageLoader />;
  if (available === false) {
    return (
      <div className="portfolio-shell flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="portfolio-panel max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Not Available for Hire</h2>
          <p className="mb-2 text-[#f7f8f8]">Currently not available for hire.</p>
          <p className="text-[#8a8f98]">Please check back later.</p>
        </div>
      </div>
    );
  }
  if (!session) return <p className="portfolio-shell py-16 text-[#8a8f98]">Please sign in to send a hire request.</p>;
  if (used >= limit) {
    return (
      <div className="portfolio-shell flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="portfolio-panel max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Monthly Limit Reached</h2>
          <p className="mb-2 text-[#f7f8f8]">
            You have reached the monthly limit of {limit} hire requests.
          </p>
          <p className="text-[#8a8f98]">
            Please come back next month to send more requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-shell relative py-16">
      {session?.user?.image && (
        <div className="absolute top-4 right-4">
          <img
            src={session.user.image!}
            alt={session.user.name ?? 'Profile'}
            className="h-10 w-10 rounded-full ring-2 ring-indigo-500 object-cover"
          />
        </div>
      )}
      <div className="mx-auto max-w-3xl">
        <Heading heading="Hire Me" />
        <p className="mb-8 mt-5 text-center text-[#8a8f98]">
          I’m available for freelance projects. Let’s build something awesome together!
        </p>
        <p className="mb-4 text-center text-sm text-[#62666d]">
          Hire requests this month: {used}/{limit}
        </p>
        <div className="portfolio-panel relative overflow-hidden p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-[#d0d6e0]">
                Project Title
              </label>
              <input
                id="title"
                type="text"
                {...register('title')}
                className="w-full rounded-lg border border-[#23252a] bg-[#141516] px-4 py-3 text-white outline-none placeholder:text-[#62666d] focus:border-[#5e6ad2]"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
            </div>
            <div>
              <label htmlFor="budget" className="mb-2 block text-sm font-medium text-[#d0d6e0]">
                Budget (USD)
              </label>
              <input
                id="budget"
                type="number"
                step="0.01"
                {...register('budget', { valueAsNumber: true })}
                className="w-full rounded-lg border border-[#23252a] bg-[#141516] px-4 py-3 text-white outline-none placeholder:text-[#62666d] focus:border-[#5e6ad2]"
              />
              {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget.message}</p>}
            </div>
            <div>
              <label htmlFor="projectDetail" className="mb-2 block text-sm font-medium text-[#d0d6e0]">
                Project Details
              </label>
              <textarea
                id="projectDetail"
                rows={5}
                {...register('projectDetail')}
                className="w-full rounded-lg border border-[#23252a] bg-[#141516] px-4 py-3 text-white outline-none placeholder:text-[#62666d] focus:border-[#5e6ad2]"
              />
              {errors.projectDetail && <p className="mt-1 text-sm text-red-500">{errors.projectDetail.message}</p>}
            </div>
            <div>
              <label htmlFor="timePeriod" className="mb-2 block text-sm font-medium text-[#d0d6e0]">
                Time Period
              </label>
              <input
                id="timePeriod"
                type="text"
                {...register('timePeriod')}
                className="w-full rounded-lg border border-[#23252a] bg-[#141516] px-4 py-3 text-white outline-none placeholder:text-[#62666d] focus:border-[#5e6ad2]"
              />
              {errors.timePeriod && <p className="mt-1 text-sm text-red-500">{errors.timePeriod.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
            className="portfolio-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
