import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { redis } from '@/lib/redis';
import type { Payment } from '@prisma/client';
import React from 'react';
import FilterForm from '@/components/FilterForm';
interface Props {
  searchParams: any;
}

export default async function PaymentsPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect('/sign-in');
  }
  const userId = session.user.id;
  const page = parseInt(searchParams.page || '1', 10);
  // Ensure amountStr is a single string (take first if array)
  const amountStr = Array.isArray(searchParams.amount)
    ? searchParams.amount[0]
    : searchParams.amount || '';
  const start = searchParams.startDate ? new Date(searchParams.startDate) : null;
  const end = searchParams.endDate ? new Date(searchParams.endDate) : null;
  const limit = 10;
  const offset = (page - 1) * limit;
  const where: any = { user_id: userId };
  // Filter by amount if provided
  if (amountStr) {
    const parsed = parseFloat(amountStr);
    if (!isNaN(parsed)) {
      where.amount = parsed;
    }
  }
  if (start || end) {
    where.createdAt = {} as any;
    if (start) where.createdAt.gte = start;
    if (end) where.createdAt.lte = end;
  }
  // Cache keys
  const keyList = `payments:list:${userId}:${amountStr}:${start?.toISOString() || ''}:${end?.toISOString() || ''}:${page}`;
  const keyCount = `payments:count:${userId}:${amountStr}:${start?.toISOString() || ''}:${end?.toISOString() || ''}`;
  // Try cache
  let payments: Payment[];
  let total;
  const cachedList = await redis.get(keyList);
  const cachedCount = await redis.get(keyCount);
  if (cachedList && cachedCount) {
    payments = JSON.parse(cachedList) as Payment[];
    total = parseInt(cachedCount, 10);
  } else {
    [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);
    await redis.set(keyList, JSON.stringify(payments), { EX: 60 });
    await redis.set(keyCount, String(total), { EX: 60 });
  }
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Payment History
        </h1>
        <div className="bg-zinc-900/50 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-zinc-800">
          <FilterForm />
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-zinc-800 overflow-x-auto">
          <table className="w-full table-auto text-white">
            <thead className="bg-zinc-800 text-zinc-400 uppercase text-sm">
              <tr>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Currency</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {payments.map((p: any) => (
                <tr key={p.id} className="hover:bg-zinc-800/50">
                  <td className="px-4 py-2">{p.amount}</td>
                  <td className="px-4 py-2">{p.currency}</td>
                  <td className="px-4 py-2 capitalize">{p.status}</td>
                  <td className="px-4 py-2">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center">
          <nav className="flex space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const num = i + 1;
              // Build query params for pagination, avoiding Symbol values
              const params = new URLSearchParams();
              // Preserve amount filter in pagination
              if (amountStr) {
                params.set('amount', amountStr);
              }
              // Handle optional date filters (take first if array)
              if (searchParams.startDate) {
                const startDateParam = Array.isArray(searchParams.startDate)
                  ? searchParams.startDate[0]
                  : searchParams.startDate;
                params.set('startDate', startDateParam);
              }
              if (searchParams.endDate) {
                const endDateParam = Array.isArray(searchParams.endDate)
                  ? searchParams.endDate[0]
                  : searchParams.endDate;
                params.set('endDate', endDateParam);
              }
              params.set('page', String(num));
              const isActive = num === page;
              return (
                <a
                  key={num}
                  href={`/payments?${params.toString()}`}
                  className={
                    isActive
                      ? 'px-3 py-1 rounded-md bg-purple-600 text-white font-bold transition'
                      : 'px-3 py-1 rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition'
                  }
                >
                  {num}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}