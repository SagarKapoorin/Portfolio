'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, FormEvent } from 'react';

import { Calendar } from 'lucide-react';
export default function FilterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAmount = searchParams.get('amount') || '';
  const initialStart = searchParams.get('startDate') || '';
  const initialEnd = searchParams.get('endDate') || '';
  const [amount, setAmount] = useState(initialAmount);
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  // Toggle input type to show placeholder text when empty, switch to date picker on focus
  const [startType, setStartType] = useState(initialStart ? 'date' : 'text');
  const [endType, setEndType] = useState(initialEnd ? 'date' : 'text');

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
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
      <input
        name="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Search by Amount"
        className="w-full sm:flex-1 sm:min-w-[120px] px-3 py-2 bg-zinc-800/70 rounded-md border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
      />
      <div className="relative w-full sm:w-auto">
        <input
          name="startDate"
          type={startType}
          placeholder="DD-MM-YYYY"
          value={startDate}
          onFocus={() => setStartType('date')}
          onBlur={() => setStartType(startDate ? 'date' : 'text')}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 pr-10 bg-zinc-800/70 rounded-md border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
        />
        <Calendar size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none" />
      </div>
      <div className="relative w-full sm:w-auto">
        <input
          name="endDate"
          type={endType}
          placeholder="DD-MM-YYYY"
          value={endDate}
          onFocus={() => setEndType('date')}
          onBlur={() => setEndType(endDate ? 'date' : 'text')}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 pr-10 bg-zinc-800/70 rounded-md border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
        />
        <Calendar size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none" />
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-md transition"
      >
        Filter
      </button>
    </form>
  );
}

