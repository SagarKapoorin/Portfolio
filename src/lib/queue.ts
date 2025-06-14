import { redis } from './redis';
export const mailQueueKey = 'mailQueue';
export async function enqueueMailJob(name: string, data: any) {
  const payload = JSON.stringify({ name, data });
  await redis.lPush(mailQueueKey, payload);
}