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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <input
        name="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Search by Amount"
        className="w-full rounded-md border border-[#23252a] bg-[#141516] px-3 py-2 text-white transition placeholder:text-[#62666d] focus:border-[#5e6ad2] focus:outline-none sm:min-w-[120px] sm:flex-1"
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
          className="w-full rounded-md border border-[#23252a] bg-[#141516] px-3 py-2 pr-10 text-white transition placeholder:text-[#62666d] focus:border-[#5e6ad2] focus:outline-none sm:w-auto"
        />
        <Calendar size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-[#62666d]" />
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
          className="w-full rounded-md border border-[#23252a] bg-[#141516] px-3 py-2 pr-10 text-white transition placeholder:text-[#62666d] focus:border-[#5e6ad2] focus:outline-none sm:w-auto"
        />
        <Calendar size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-[#62666d]" />
      </div>
      <button
        type="submit"
        className="portfolio-button-primary w-full sm:w-auto"
      >
        Filter
      </button>
    </form>
  );
}

