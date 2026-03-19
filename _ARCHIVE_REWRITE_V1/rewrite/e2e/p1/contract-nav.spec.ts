/**
 * P1 — C-NAV-02 (Keyboard & ARIA).
 * Contract: nav focusable; Enter/Space activate; aria-current on active item.
 */
import { test, expect } from '@playwright/test';

test.describe('C-NAV-02 Keyboard & ARIA', () => {
  test('nav links are focusable', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    const firstLink = page.locator('.main-nav a').first();
    await firstLink.focus();
    await expect(firstLink).toBeFocused();
  });

  test('active nav item has aria-current="page"', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const active = page.locator('.main-nav a[aria-current="page"]').first();
    await expect(active).toBeAttached();
  });
});
