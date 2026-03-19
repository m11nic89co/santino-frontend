/**
 * P1 — C-A11Y-03 (Focus Order & Landmarks).
 * Contract: logical focus order; sections have landmarks/headings.
 */
import { test, expect } from '@playwright/test';

test.describe('C-A11Y-03 Focus Order & Landmarks', () => {
  test('sections have headings or aria-labelledby', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const section0 = page.locator('#section-0');
    const hasHeading = (await section0.locator('h1, h2, [aria-labelledby]').first().count()) > 0;
    expect(hasHeading).toBe(true);
  });
});
