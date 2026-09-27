import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { env } from './helpers/env';

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: 'tests/steps/**/*.ts',
  outputDir: 'test-output/.features-gen',
});

export default defineConfig({
  testDir,
  outputDir: 'test-output/playwright',
  globalSetup: './helpers/global-setup.ts',
  // The local Toolshop runs in dev mode: it stalls with more than one browser, and after a few idle
  // seconds the first API call takes up to 20 s again. Raise WORKERS and lower EXPECT_TIMEOUT for hosted runs.
  workers: Number(process.env.WORKERS ?? 1),
  timeout: 90_000,
  expect: { timeout: Number(process.env.EXPECT_TIMEOUT ?? 30_000) },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['allure-playwright', { resultsDir: 'test-output/allure-results' }]],
  use: {
    baseURL: env.baseUrl,
    testIdAttribute: 'data-test',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
});
