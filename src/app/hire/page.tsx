"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';

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
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HireInput>({ resolver: zodResolver(HireSchema) });

  const onSubmit = async (data: HireInput) => {
    const res = await fetch('/api/hire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSuccess(true);
    }
  };

  // Fetch availability on mount
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/hire/status');
        const json = await res.json();
        setAvailable(json.available);
      } catch {
        setAvailable(false);
      }
    }
    fetchStatus();
  }, []);
  if (status === 'loading' || available === null) return <p>Loading...</p>;
  if (available === false) return <p>Currently not available for hire. Please check back later.</p>;
  if (!session) return <p>Please sign in to send a hire request.</p>;
  if (success) return <p>Thank you! Your request has been sent.</p>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl mb-4">Hire Me</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Project Title</label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full p-2 border rounded"
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="budget" className="block mb-1">Budget (USD)</label>
          <input
            id="budget"
            type="number"
            step="0.01"
            {...register('budget', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
          {errors.budget && <p className="text-red-500">{errors.budget.message}</p>}
        </div>
        <div>
          <label htmlFor="projectDetail" className="block mb-1">Project Details</label>
          <textarea
            id="projectDetail"
            rows={5}
            {...register('projectDetail')}
            className="w-full p-2 border rounded"
          />
          {errors.projectDetail && <p className="text-red-500">{errors.projectDetail.message}</p>}
        </div>
        <div>
          <label htmlFor="timePeriod" className="block mb-1">Time Period</label>
          <input
            id="timePeriod"
            type="text"
            {...register('timePeriod')}
            className="w-full p-2 border rounded"
          />
          {errors.timePeriod && <p className="text-red-500">{errors.timePeriod.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isSubmitting ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  );
}