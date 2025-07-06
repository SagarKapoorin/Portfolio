import { subscriber } from '@/lib/redis';

export async function GET(request: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const channel = 'notifications';
  let closed = false;
  // Hold ping interval handle
  let pingInterval: ReturnType<typeof setInterval>;

  // Cleanup resources on client disconnect
  const cleanup = () => {
    if (closed) return;
    closed = true;
    if (pingInterval) clearInterval(pingInterval);
    subscriber.unsubscribe(channel).catch(() => {});
    writer.close().catch(() => {});
  };
  request.signal.addEventListener('abort', cleanup);

  // Subscribe to Redis notifications
  subscriber.subscribe(channel, (message: string) => {
    if (closed) return;
    writer.write(encoder.encode(`data: ${message}\n\n`)).catch(() => {});
  }).catch((err) => {
    console.error('Failed to subscribe to notifications:', err);
    cleanup();
  });

  // Send periodic ping to keep connection alive
  pingInterval = setInterval(() => {
    if (closed) return;
    writer.write(encoder.encode(`: ping\n\n`)).catch(() => {});
  }, 20000);

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
    status: 200,
  });
}