import { redisLPush } from './redis';
export const mailQueueKey = 'mailQueue';
export async function enqueueMailJob(name: string, data: any) {
  const payload = JSON.stringify({ name, data });
  await redisLPush(mailQueueKey, payload);
}
export const notificationQueueKey = 'notificationQueue';
export async function enqueueNotificationJob(data: any) {
  const payload = JSON.stringify(data);
  await redisLPush(notificationQueueKey, payload);
}