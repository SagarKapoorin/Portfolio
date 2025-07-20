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
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'portfolio-worker',
      script: 'src/lib/worker-runner.js',
      exec_mode: 'fork',
      instances: 1
    }
  ],
};