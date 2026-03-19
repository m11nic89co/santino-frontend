/**
 * P0 — C-HERO-01 (Hero Visible & CTA).
 * Contract: #section-0 visible when active; hero CTA present and clickable.
 */
import { test, expect } from '@playwright/test';

test.describe('C-HERO-01 Hero Visible & CTA', () => {
  test('hero section is visible when section 0 is active', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const section0 = page.locator('#section-0');
    await expect(section0).toBeVisible();
  });

  test('hero CTA link exists and is clickable', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const cta = page.locator('#section-0 .btn, .hero-section .btn').first();
    await expect(cta).toBeVisible();
    await expect(cta).toBeEnabled();
  });
});
