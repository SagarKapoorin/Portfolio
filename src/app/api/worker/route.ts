import { NextResponse } from 'next/server';

/** GET /api/worker
 * Health check / usage information
 */
export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Worker endpoint. Use POST to process mail queue.',
  });
}

/** POST /api/worker
 * Drain and process all queued mail jobs.
 */
export async function GET(request: Request) {
  try {
    const { drainMailQueue } = await import('@/lib/mail-processor');
    const processed = await drainMailQueue();
    return NextResponse.json({ success: true, processed });
  } catch (error) {
    console.error('Error processing mail queue via API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}