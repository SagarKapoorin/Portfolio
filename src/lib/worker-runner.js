#!/usr/bin/env node
// Bootstrap for running the TypeScript mail worker via ts-node
require('ts-node').register({
  transpileOnly: true,
  skipProject: true,
  compilerOptions: { module: 'CommonJS', moduleResolution: 'node' }
});
// Import and run the ESM worker
require('./worker.ts');