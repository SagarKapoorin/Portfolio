import { createClient } from 'redis';

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

if (process.env.REDIS_URL && !isBuildProcess) {
  redis.connect().catch(() => {
    // Allow the app to continue in degraded mode when Redis is unavailable.
  });
}

export { redis };