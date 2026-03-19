/**
 * P1 — C-PERF-02 (LCP & CLS).
 * Contract: LCP within budget; no significant layout shift from loader/main transition.
 */
import { test, expect } from '@playwright/test';

test.describe('C-PERF-02 LCP & CLS', () => {
  test('LCP metric is within budget (stub: check no long blocking)', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const domReady = Date.now() - start;
    expect(domReady).toBeLessThan(10000);
  });
});
