/**
 * PM2 ecosystem configuration
 * Defines two apps: the Next.js server and the background worker
 */
module.exports = {
  apps: [
    {
      name: 'portfolio-app',
      script: 'npm',
      args: 'start',
      exec_mode: 'cluster',
      instances: 'max',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'portfolio-worker',
      script: 'npm',
      args: 'run worker',
      exec_mode: 'fork',
      instances: 1,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};