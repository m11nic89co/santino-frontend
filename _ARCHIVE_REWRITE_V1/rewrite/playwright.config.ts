import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config — SANTINO v2 Contract Suite (Phase 3).
 * Tests run against the v2 app (rewrite dev server). Stub tests may fail until features exist.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://127.0.0.1:3002',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3002',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
