import { redis } from './redis';
/**
 * Fixed-window rate limiter using Redis INCR + EXPIRE
 * @param key Unique key (e.g. per IP + route)
 * @param limit Max number of requests per window
 * @param windowSec Window size in seconds
 * @throws Error if rate limit exceeded
 */
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