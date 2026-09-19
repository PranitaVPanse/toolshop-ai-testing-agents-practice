import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { env } from './config/env';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['src/steps/**/*.ts'],
  outputDir: 'test-output/.features-gen',
});

export default defineConfig({
  testDir,
  globalSetup: './src/support/global-setup.ts',
  outputDir: 'test-output/playwright',
  fullyParallel: true,
  // The local Toolshop runs in development mode (Angular dev server inside Docker). It serves one
  // browser reliably, but with two in parallel API calls stall for 15 s and more and tests fail on
  // timeouts. Set WORKERS for an environment that can take it, for example a hosted one.
  workers: Number(process.env.WORKERS ?? 1),
  timeout: 90_000,
  expect: { timeout: 15_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        resultsDir: 'test-output/allure-results',
        environmentInfo: { base_url: env.baseUrl, browser: 'Google Chrome', node: process.version },
      },
    ],
  ],
  use: {
    baseURL: env.baseUrl,
    // Toolshop exposes data-test, not data-testid.
    testIdAttribute: 'data-test',
    headless: env.headless,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chrome',
      // channel 'chrome' runs the installed Google Chrome, not the bundled Chromium.
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
