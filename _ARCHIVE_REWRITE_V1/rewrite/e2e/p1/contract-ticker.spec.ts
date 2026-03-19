/**
 * P1 — C-TICK-02 (Ticker Content & Loop).
 * Contract: ticker items present; loop seamless; no visible jump.
 */
import { test, expect } from '@playwright/test';

test.describe('C-TICK-02 Ticker Content & Loop', () => {
  test('ticker contains items', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    const itemCount = await page.locator('#ticker-track .ticker-item, #ticker-track > *').count();
    expect(itemCount).toBeGreaterThan(0);
  });
});
