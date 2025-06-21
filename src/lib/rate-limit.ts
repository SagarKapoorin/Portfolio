const ipRateLimitMap = new Map<string, { count: number; reset: number }>();
export async function rateLimit(key: string, limit: number, windowSec: number) {
  const now = Date.now();
  let record = ipRateLimitMap.get(key);
  if (!record || now > record.reset) {
    record = { count: 1, reset: now + windowSec * 1000 };
    ipRateLimitMap.set(key, record);
    return { allowed: true, ttl: windowSec };
  }
  if (record.count >= limit) {
    const ttl = Math.ceil((record.reset - now) / 1000);
    return { allowed: false, ttl };
  }
  record.count++;
  ipRateLimitMap.set(key, record);
  const ttl = Math.ceil((record.reset - now) / 1000);
  return { allowed: true, ttl };
}