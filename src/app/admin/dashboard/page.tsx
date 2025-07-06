"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

// Data shapes for admin lists
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
  // Logged-in user email
  const userEmail = session?.user?.email || '';
  // Hire requests state
  const [hireData, setHireData] = useState<HireReq[]>([]);
  const [hireMeta, setHireMeta] = useState({ total: 0, page: 1, perPage: 10, totalPages: 1 });
  const [hrStart, setHrStart] = useState('');
  const [hrEnd, setHrEnd] = useState('');
  // Payments state
  const [payData, setPayData] = useState<PayRec[]>([]);
  const [payMeta, setPayMeta] = useState({ total: 0, page: 1, perPage: 10, totalPages: 1 });
  const [paySearch, setPaySearch] = useState('');
  const [payStatus, setPayStatus] = useState('');
  const [payStart, setPayStart] = useState('');
  const [payEnd, setPayEnd] = useState('');


  // Fetch hire requests when filters change
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
  // Only admin can access
  if (status === 'authenticated' && session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return <p>Access denied</p>;
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setTab('hire')} className={tab === 'hire' ? 'font-bold' : ''}>Hire Requests</button>
        <button onClick={() => setTab('payments')} className={tab === 'payments' ? 'font-bold' : ''}>Payments</button>
      </div>
      {tab === 'hire' && (
        <div>
          <div className="flex space-x-2 mb-2">
            <input type="date" value={hrStart} onChange={(e) => setHrStart(e.target.value)} className="border p-1" />
            <input type="date" value={hrEnd} onChange={(e) => setHrEnd(e.target.value)} className="border p-1" />
          </div>
          <table className="min-w-full border">
            <thead><tr>
              <th className="border p-1">Title</th>
              <th className="border p-1">User</th>
              <th className="border p-1">Budget</th>
              <th className="border p-1">Date</th>
            </tr></thead>
            <tbody>
              {hireData.map((r) => (
                <tr key={r.id}
                  className="cursor-pointer"
                  onClick={() =>
                    alert(
                      `Title: ${r.title}\nDetails: ${r.projectDetail}\nTime Period: ${r.timePeriod}`
                    )
                  }
                >
                  <td className="border p-1">{r.title}</td>
                  <td className="border p-1">{r.userEmail}</td>
                  <td className="border p-1">{r.budget}</td>
                  <td className="border p-1">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
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