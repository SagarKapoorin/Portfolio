import { createClient } from 'redis';

type RedisSetOptions = Parameters<ReturnType<typeof createClient>['set']>[2];

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: () => false,
    connectTimeout: 1000,
  },
});

let redisErrorLogged = false;
redis.on('error', (err) => {
  if (!redisErrorLogged) {
    console.error('Redis Client Error', err);
    redisErrorLogged = true;
  }
});

const isBuildProcess = process.argv.join(" ").includes("next build");

let connectPromise: ReturnType<typeof redis.connect> | null = null;

export async function ensureRedisConnected() {
  if (!process.env.REDIS_URL || isBuildProcess) {
    return false;
  }

  if (redis.isReady) {
    return true;
  }

  if (!connectPromise) {
    connectPromise = redis.connect().catch(() => {
      connectPromise = null;
      return redis;
    });
  }

  await connectPromise;
  return redis.isReady;
}

if (process.env.REDIS_URL && !isBuildProcess) {
  ensureRedisConnected().catch(() => {
    // Allow the app to continue in degraded mode when Redis is unavailable.
  });
}

export async function redisGet(key: string) {
  if (!(await ensureRedisConnected())) return null;
  return redis.get(key);
}

export async function redisSet(key: string, value: string, options?: RedisSetOptions) {
  if (!(await ensureRedisConnected())) return null;
  return redis.set(key, value, options);
}

export async function redisDel(key: string) {
  if (!(await ensureRedisConnected())) return 0;
  return redis.del(key);
}

export async function redisIncr(key: string) {
  if (!(await ensureRedisConnected())) return 0;
  return redis.incr(key);
}

export async function redisExpire(key: string, seconds: number) {
  if (!(await ensureRedisConnected())) return false;
  return redis.expire(key, seconds);
}

export async function redisLPush(key: string, value: string) {
  if (!(await ensureRedisConnected())) return 0;
  return redis.lPush(key, value);
}

export { redis };