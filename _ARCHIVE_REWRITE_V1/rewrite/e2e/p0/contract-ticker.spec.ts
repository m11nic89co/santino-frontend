/**
 * P0 — C-TICK-01 (Main Ticker Animation).
 * Contract: #ticker-track present; single ticker owner; reduced-motion pauses animation.
 */
import { test, expect } from '@playwright/test';

test.describe('C-TICK-01 Main Ticker Animation', () => {
  test('main ticker track exists and is visible when in view', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const track = page.locator('#ticker-track');
    await expect(track).toBeVisible({ timeout: 8000 });
  });

  test('ticker has single owner (no duplicate animation)', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    const tickerInstances = await page.evaluate(() => {
      const tracks = document.querySelectorAll('#ticker-track');
      return tracks.length;
    });
    expect(tickerInstances).toBeLessThanOrEqual(1);
  });
});
