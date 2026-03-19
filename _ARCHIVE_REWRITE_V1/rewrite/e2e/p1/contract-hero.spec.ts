/**
 * P1 — C-HERO-02 (Hero Scroll / Swipe).
 * Contract: swipe/scroll from hero moves to next section; section index updates.
 */
import { test, expect } from '@playwright/test';

test.describe('C-HERO-02 Hero Scroll / Swipe', () => {
  test('swipe or scroll from hero advances to section 1', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    const body = page.locator('body');
    await body.dispatchEvent('wheel', { deltaY: 300 });
    await page.waitForTimeout(800);
    const active = await page.evaluate(() => document.body.dataset.activeSection ?? '');
    expect(['1', '2']).toContain(active);
  });
});
