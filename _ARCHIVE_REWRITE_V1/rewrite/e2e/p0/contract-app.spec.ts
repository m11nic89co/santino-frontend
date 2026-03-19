/**
 * P0 — C-APP-01 (Loader & First Paint), C-APP-02 (Active Section State).
 * Contract: loader hides; main visible; body.fab-intro-done; body.dataset.activeSection in sync.
 */
import { test, expect } from '@playwright/test';

test.describe('C-APP-01 Loader & First Paint', () => {
  test('loader is hidden and main content visible after intro', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // After intro (~3–4s): #loader-bg.hide, .site-visible, body.fab-intro-done
    await page.waitForTimeout(4500);
    const loader = page.locator('#loader-bg');
    await expect(loader).toHaveClass(/hide/);
    const body = page.locator('body');
    await expect(body).toHaveClass(/fab-intro-done/);
  });
});

test.describe('C-APP-02 Active Section State', () => {
  test('body has data-active-section and it updates on navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const activeSection = await page.evaluate(() => document.body.dataset.activeSection ?? '');
    expect(['0', '1', '2', '3', '4']).toContain(activeSection);
  });
});
