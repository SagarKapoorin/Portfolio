import { redis } from './redis';
export const mailQueueKey = 'mailQueue';
export async function enqueueMailJob(name: string, data: any) {
  const payload = JSON.stringify({ name, data });
  await redis.lPush(mailQueueKey, payload);
}
// Queue for notification messages (avoids pub/sub, uses simple Redis list)
export const notificationQueueKey = 'notificationQueue';
export async function enqueueNotificationJob(data: any) {
  const payload = JSON.stringify(data);
  await redis.lPush(notificationQueueKey, payload);
}