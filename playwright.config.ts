import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html'],['list']],
  use: {},

  projects: [
    {
      name: 'api-testing',
      testMatch: 'example*',
     // dependencies: ['smoke-tests']
    },
    {
      name: 'smoke-tests',
      testMatch: 'smoke*',
    }
  ]
});
