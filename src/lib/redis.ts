import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
redis.on('error', (err) => console.error('Redis Client Error', err));
redis.connect().catch((err) => console.error('Redis connection error', err));

const subscriber = redis.duplicate();
subscriber.on('error', (err) => console.error('Redis Subscriber Error', err));
subscriber.connect().catch((err) => console.error('Redis subscriber error', err));

export { redis, subscriber };