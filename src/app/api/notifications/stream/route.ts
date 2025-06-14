import { subscriber } from '@/lib/redis';

/**
 * GET /api/notifications/stream
 * Streams server-sent events for real-time notifications
 */
export async function GET() {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  await subscriber.subscribe('notifications', (message: string) => {
    writer.write(encoder.encode(`data: ${message}\n\n`));
  });

  setInterval(() => {
    writer.write(encoder.encode(`: ping\n\n`));
  }, 20000);

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
    status: 200,
  });
}