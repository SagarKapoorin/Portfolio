"use client";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Cards } from '@/components/Cards';
import { useSession } from 'next-auth/react';

interface HireReq {
  id: string;
  title: string;
  budget: number;
  projectDetail: string;
  timePeriod: string;
  userEmail: string;
  createdAt: string;
}
interface PayRec {
  id: string;
  amount: number;
  currency: string;
  status: string;
  userEmail: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession({ required: true });
  const [tab, setTab] = useState<'hire' | 'payments'>('hire');
  const userEmail = session?.user?.email || '';
  const [hireData, setHireData] = useState<HireReq[]>([]);
  const [hireMeta, setHireMeta] = useState({ total: 0, page: 1, perPage: 10, totalPages: 1 });
  const [hrStart, setHrStart] = useState('');
  const [hrEnd, setHrEnd] = useState('');
  const [payData, setPayData] = useState<PayRec[]>([]);
  const [payMeta, setPayMeta] = useState({ total: 0, page: 1, perPage: 10, totalPages: 1 });
  const [paySearch, setPaySearch] = useState('');
  const [payStatus, setPayStatus] = useState('');
  const [payStart, setPayStart] = useState('');
  const [payEnd, setPayEnd] = useState('');


  useEffect(() => {
    if (status !== 'authenticated' || !userEmail) return;
    const qs = new URLSearchParams();
    qs.set('page', String(hireMeta.page));
    qs.set('perPage', String(hireMeta.perPage));
    if (hrStart) qs.set('startDate', hrStart);
    if (hrEnd) qs.set('endDate', hrEnd);
    fetch(`/api/admin/hire-requests?${qs.toString()}`)
      .then((r) => r.json())
      .then((json) => {
        setHireData(json.data);
        setHireMeta(json.meta);
      })
      .catch(console.error);
  }, [status, userEmail, hrStart, hrEnd, hireMeta.page]);

  // Fetch payments when filters change
  useEffect(() => {
    if (status !== 'authenticated' || !userEmail) return;
    const qs = new URLSearchParams();
    qs.set('page', String(payMeta.page));
    qs.set('perPage', String(payMeta.perPage));
    if (paySearch) qs.set('amount', paySearch);
    if (payStatus) qs.set('status', payStatus);
    if (payStart) qs.set('startDate', payStart);
    if (payEnd) qs.set('endDate', payEnd);
    fetch(`/api/admin/payments?${qs.toString()}`)
      .then((r) => r.json())
      .then((json) => {
        setPayData(json.data);
        setPayMeta(json.meta);
      })
      .catch(console.error);
  }, [status, userEmail, paySearch, payStatus, payStart, payEnd, payMeta.page]);


  if (status === 'loading') return <p>Loading...</p>;
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>
      {/* Tabs */}
      <div className="inline-flex bg-gray-800 rounded-lg overflow-hidden mb-6">
        <button
          onClick={() => setTab('hire')}
          className={`px-5 py-2 text-sm font-medium transition-colors ${
            tab === 'hire'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Hire Requests
        </button>
        <button
          onClick={() => setTab('payments')}
          className={`px-5 py-2 text-sm font-medium transition-colors ${
            tab === 'payments'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Payments
        </button>
      </div>
      {tab === 'hire' && (
        <div className="p-4">
          {/* Filters */}
          <div className="flex space-x-2 mb-2">
            <input type="date" value={hrStart} onChange={(e) => setHrStart(e.target.value)} className="border p-1" />
            <input type="date" value={hrEnd} onChange={(e) => setHrEnd(e.target.value)} className="border p-1" />
          </div>
          {/* Card list using Aceternity UI Cards component */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hireData.map((r) => (
              <Cards
                key={r.id}
                text={r.title}
                desc={r.projectDetail}
                type={r.userEmail}
                link="#"
                imglink="/start.webp"
                tags={[`$${r.budget}`, r.timePeriod]}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between">
            <button disabled={hireMeta.page <= 1} onClick={() => setHireMeta((m) => ({ ...m, page: m.page - 1 }))}>Prev</button>
            <span>Page {hireMeta.page} of {hireMeta.totalPages}</span>
            <button disabled={hireMeta.page >= hireMeta.totalPages} onClick={() => setHireMeta((m) => ({ ...m, page: m.page + 1 }))}>Next</button>
          </div>
        </div>
      )}
      {tab === 'payments' && (
        <div>
          <div className="flex space-x-2 mb-2">
            <input type="number" placeholder="Amount" value={paySearch} onChange={(e) => setPaySearch(e.target.value)} className="border p-1" />
            <select value={payStatus} onChange={(e) => setPayStatus(e.target.value)} className="border p-1">
              <option value="">All</option>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
            <input type="date" value={payStart} onChange={(e) => setPayStart(e.target.value)} className="border p-1" />
            <input type="date" value={payEnd} onChange={(e) => setPayEnd(e.target.value)} className="border p-1" />
          </div>
          <table className="min-w-full border">
            <thead><tr>
              <th className="border p-1">User</th>
              <th className="border p-1">Amount</th>
              <th className="border p-1">Status</th>
              <th className="border p-1">Date</th>
            </tr></thead>
            <tbody>
              {payData.map((p) => (
                <tr key={p.id}>
                  <td className="border p-1">{p.userEmail}</td>
                  <td className="border p-1">{p.amount} {p.currency}</td>
                  <td className="border p-1">{p.status}</td>
                  <td className="border p-1">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 flex justify-between">
            <button disabled={payMeta.page <= 1} onClick={() => setPayMeta((m) => ({ ...m, page: m.page - 1 }))}>Prev</button>
            <span>Page {payMeta.page} of {payMeta.totalPages}</span>
            <button disabled={payMeta.page >= payMeta.totalPages} onClick={() => setPayMeta((m) => ({ ...m, page: m.page + 1 }))}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}