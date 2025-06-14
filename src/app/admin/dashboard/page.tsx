"use client";
import React, { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

interface NotificationEvent {
  type: 'new_message' | 'payment_completed' | 'payment_failed';
  payload: {
    id: string;
    user_email: string;
    title?: string;
    message?: string;
    budget?: number;
    projectDetail?: string;
    timePeriod?: string;
    amount?: number;
    currency?: string;
  };
}

export default function AdminDashboard() {
  const { data: session, status } = useSession({ required: true });
  const [events, setEvents] = useState<NotificationEvent[]>([]);

  useEffect(() => {
    if (status === 'authenticated') {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (session?.user?.email !== adminEmail) {
        alert('Access denied');
        signIn();
        return;
      }
      const es = new EventSource('/api/notifications/stream');
      es.onmessage = (e) => {
        try {
          const data: NotificationEvent = JSON.parse(e.data);
          setEvents((prev) => [data, ...prev]);
        } catch {
          console.error('Error parsing event data:', e.data);}
      };
      return () => es.close();
    }
  }, [status, session]);

  if (status === 'loading') return <p>Loading...</p>;
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <ul className="space-y-2">
        {events.map((ev, idx) => (
          <li key={idx} className="border p-2 rounded">
            {ev.type === 'new_message' && (
              <span>
                New hire request from <strong>{ev.payload.user_email}</strong>: &quot;{ev.payload.message}&quot;
              </span>
            )}
            {ev.type === 'payment_completed' && (
              <span>
                Payment of <strong>{ev.payload.amount} {ev.payload.currency}</strong> completed by user.
              </span>
            )}
          </li>
        ))}
        {events.length === 0 && <li>No notifications yet.</li>}
      </ul>
    </div>
  );
}