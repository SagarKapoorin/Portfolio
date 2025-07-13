'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, FormEvent } from 'react';

export default function FilterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAmount = searchParams.get('amount') || '';
  const initialStart = searchParams.get('startDate') || '';
  const initialEnd = searchParams.get('endDate') || '';
  const [amount, setAmount] = useState(initialAmount);
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (amount) params.set('amount', amount);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    params.set('page', '1');
    router.push(`/payments?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
      <input
        name="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Search by Amount"
        className="flex-1 min-w-[120px] px-3 py-2 bg-zinc-800/70 rounded-md border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
      />
      <input
        name="startDate"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="px-3 py-2 bg-zinc-800/70 rounded-md border border-zinc-700 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
      />
      <input
        name="endDate"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="px-3 py-2 bg-zinc-800/70 rounded-md border border-zinc-700 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-md transition"
      >
        Filter
      </button>
    </form>
  );
}

