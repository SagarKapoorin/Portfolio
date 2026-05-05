import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { redis } from '@/lib/redis';
import type { Payment } from '@prisma/client';
import React from 'react';
import FilterForm from '@/components/FilterForm';
interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function PaymentsPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect('/signin');
  }
  const sp = await searchParams;
  const userId = session.user.id;
  const pageParam = sp.page;
  const page = parseInt(
    Array.isArray(pageParam) ? pageParam[0] : pageParam || '1',
    10
  );
  const amountParam = sp.amount;
  const amountStr = Array.isArray(amountParam)
    ? amountParam[0]
    : amountParam || '';
  const startParam = sp.startDate;
  const start = startParam
    ? new Date(Array.isArray(startParam) ? startParam[0] : startParam)
    : null;
  const endParam = sp.endDate;
  const end = endParam
    ? new Date(Array.isArray(endParam) ? endParam[0] : endParam)
    : null;
  const limit = 10;
  const offset = (page - 1) * limit;
  const where: any = { user_id: userId };
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
  const keyList = `payments:list:${userId}:${amountStr}:${start?.toISOString() || ''}:${end?.toISOString() || ''}:${page}`;
  const keyCount = `payments:count:${userId}:${amountStr}:${start?.toISOString() || ''}:${end?.toISOString() || ''}`;
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
    <div className="portfolio-shell relative min-h-[calc(100vh-64px)] py-16">
      <div className="relative z-10 w-full space-y-6">
        <h1 className="text-center text-4xl font-semibold text-[#f7f8f8] sm:text-5xl">
          Payment History
        </h1>
        <div className="portfolio-panel-flat p-4">
          <FilterForm />
        </div>
        <div className="portfolio-panel-flat p-4">
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-white">
            <thead className="bg-[#141516] text-sm uppercase text-[#8a8f98]">
              <tr>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Currency</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23252a]">
              {payments.map((p: any) => (
                <tr key={p.id} className="hover:bg-[#141516]">
                  <td className="px-4 py-2">{p.amount}</td>
                  <td className="px-4 py-2">{p.currency}</td>
                  <td className="px-4 py-2 capitalize">{p.status}</td>
                  <td className="px-4 py-2">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        <div className="flex justify-center">
          <nav className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const num = i + 1;
              const params = new URLSearchParams();
              if (amountStr) {
                params.set('amount', amountStr);
              }
              if (startParam) {
                const startDateParam = Array.isArray(startParam)
                  ? startParam[0]
                  : startParam;
                params.set('startDate', startDateParam);
              }
              if (endParam) {
                const endDateParam = Array.isArray(endParam)
                  ? endParam[0]
                  : endParam;
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
                      ? 'rounded-md bg-[#5e6ad2] px-3 py-1 font-bold text-white transition'
                      : 'rounded-md border border-[#23252a] bg-[#0f1011] px-3 py-1 text-[#8a8f98] transition hover:bg-[#141516]'
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
