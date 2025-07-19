"use client";
"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import Heading from '@/components/Heading';

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
  if (status === 'loading' || available === null) return <p>Loading...</p>;
  if (available === false) return <p>Currently not available for hire. Please check back later.</p>;
  if (!session) return <p>Please sign in to send a hire request.</p>;
  if (used >= limit) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="bg-black/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Monthly Limit Reached</h2>
          <p className="text-white mb-2">
            You have reached the monthly limit of {limit} hire requests.
          </p>
          <p className="text-gray-400">
            Please come back next month to send more requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 relative">
      {session?.user?.image && (
        <div className="absolute top-4 right-4">
          <img
            src={session.user.image!}
            alt={session.user.name ?? 'Profile'}
            className="h-10 w-10 rounded-full ring-2 ring-indigo-500 object-cover"
          />
        </div>
      )}
      <div className="max-w-3xl mx-auto px-4">
        <Heading heading="Hire Me" />
        <p className="text-center text-gray-300 mb-8">
          I’m available for freelance projects. Let’s build something awesome together!
        </p>
        <p className="text-center text-gray-400 mb-4">
          Hire requests this month: {used}/{limit}
        </p>
        <div className="relative bg-black/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-20 rounded-full blur-[100px]"></div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-1">
                Project Title
              </label>
              <input
                id="title"
                type="text"
                {...register('title')}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-200 mb-1">
                Budget (USD)
              </label>
              <input
                id="budget"
                type="number"
                step="0.01"
                {...register('budget', { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
              {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget.message}</p>}
            </div>
            <div>
              <label htmlFor="projectDetail" className="block text-sm font-medium text-gray-200 mb-1">
                Project Details
              </label>
              <textarea
                id="projectDetail"
                rows={5}
                {...register('projectDetail')}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
              {errors.projectDetail && <p className="mt-1 text-sm text-red-500">{errors.projectDetail.message}</p>}
            </div>
            <div>
              <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-200 mb-1">
                Time Period
              </label>
              <input
                id="timePeriod"
                type="text"
                {...register('timePeriod')}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
              {errors.timePeriod && <p className="mt-1 text-sm text-red-500">{errors.timePeriod.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}