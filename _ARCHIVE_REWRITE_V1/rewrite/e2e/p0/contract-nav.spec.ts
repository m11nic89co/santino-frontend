/**
 * P0 — C-NAV-01 (Desktop & Mobile Navigation).
 * Contract: nav/pagination change section; active link has .active and aria-current="page".
 */
import { test, expect } from '@playwright/test';

test.describe('C-NAV-01 Desktop & Mobile Navigation', () => {
  test('clicking nav link with data-index="1" sets activeSection to 1', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.locator('.main-nav a[data-index="1"]').first().click();
    await expect
      .poll(async () => page.evaluate(() => document.body.dataset.activeSection ?? ''))
      .toBe('1');
  });

  test('active nav link has .active and aria-current="page"', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    await page.locator('.main-nav a[data-index="1"]').first().click();
    await page.waitForTimeout(500);
    const activeLink = page.locator('.main-nav a.active[data-index="1"]').first();
    await expect(activeLink).toHaveAttribute('aria-current', 'page');
  });
});
