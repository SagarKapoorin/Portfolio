import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
redis.on('error', (err) => console.error('Redis Client Error', err));
redis.connect().catch((err) => console.error('Redis connection error', err));

export { redis };