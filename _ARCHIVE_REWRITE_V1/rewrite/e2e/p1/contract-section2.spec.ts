/**
 * P1 — C-S2-01 (Section 2 Content & Visibility).
 * Contract: #section-2 visible when active; content present.
 */
import { test, expect } from '@playwright/test';

test.describe('C-S2-01 Section 2 Content & Visibility', () => {
  test('section 2 is visible when navigated to', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    await page.locator('.main-nav a[data-index="2"]').first().click();
    await expect
      .poll(async () => page.evaluate(() => document.body.dataset.activeSection ?? ''))
      .toBe('2');
    const section2 = page.locator('#section-2');
    await expect(section2).toBeVisible();
  });
});
