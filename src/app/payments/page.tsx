import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { redis } from '@/lib/redis';
import type { Payment } from '@prisma/client';
import React from 'react';

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
  const q = searchParams.q || '';
  const start = searchParams.startDate ? new Date(searchParams.startDate) : null;
  const end = searchParams.endDate ? new Date(searchParams.endDate) : null;
  const limit = 10;
  const offset = (page - 1) * limit;
  const where: any = { user_id: userId };
  if (q) where.id = { contains: q };
  if (start || end) {
    where.createdAt = {} as any;
    if (start) where.createdAt.gte = start;
    if (end) where.createdAt.lte = end;
  }
  // Cache keys
  const keyList = `payments:list:${userId}:${q}:${start?.toISOString()||''}:${end?.toISOString()||''}:${page}`;
  const keyCount = `payments:count:${userId}:${q}:${start?.toISOString()||''}:${end?.toISOString()||''}`;
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
    <div className="p-4">
      <h1 className="text-2xl mb-4">Payment History</h1>
      <form method="get" className="mb-4 flex space-x-2">
        <input name="q" defaultValue={q} placeholder="Search by ID" className="border p-1" />
        <input
          name="startDate"
          type="date"
          defaultValue={searchParams.startDate}
          className="border p-1"
        />
        <input
          name="endDate"
          type="date"
          defaultValue={searchParams.endDate}
          className="border p-1"
        />
        <button type="submit" className="px-2 bg-blue-500 text-white">
          Filter
        </button>
      </form>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-1">ID</th>
            <th className="border p-1">Amount</th>
            <th className="border p-1">Currency</th>
            <th className="border p-1">Status</th>
            <th className="border p-1">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p: any) => (
            <tr key={p.id}>
              <td className="border p-1">{p.id}</td>
              <td className="border p-1">{p.amount}</td>
              <td className="border p-1">{p.currency}</td>
              <td className="border p-1">{p.status}</td>
              <td className="border p-1">{new Date(p.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 space-x-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const num = i + 1;
          const params = new URLSearchParams(searchParams as any);
          params.set('page', String(num));
          return (
            <a
              key={num}
              href={`/payments?${params.toString()}`}
              className={num === page ? 'font-bold' : ''}
            >
              {num}
            </a>
          );
        })}
      </div>
    </div>
  );
}