const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

require('ts-node').register({
  transpileOnly: true,
  skipProject: true,
  compilerOptions: { module: 'CommonJS', moduleResolution: 'node' }
});
require('./worker.ts');