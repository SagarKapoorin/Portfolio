import { NextResponse } from 'next/server';
import { processMailQueue } from '@/lib/mail-worker';

/**
 * Cron endpoint to process mail jobs.
 * This should be scheduled via Vercel Cron (e.g. every minute).
 */
export async function GET() {
  try {
    const processed = await processMailQueue();
    return NextResponse.json({ processed });
  } catch (err) {
    console.error('Error processing mail queue:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}