/**
 * PM2 ecosystem configuration
 * Defines two apps: the Next.js server and the background worker
 */
module.exports = {
  apps: [
    {
      name: 'portfolio-app',
      script: './node_modules/next/dist/bin/next',
      args: 'start',
      exec_mode: 'cluster',
      instances: 'max',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};