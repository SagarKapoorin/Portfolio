import { redis } from './redis';

export async function rateLimit(key: string, limit: number, windowSec: number) {
  const current = await redis.incr(key);
  console.log(`Current count for ${key}: ${current}`);
  if (current === 1) {
    await redis.expire(key, windowSec);
  }
  if (current > limit) {
    throw new Error('Rate limit exceeded');
  }
}