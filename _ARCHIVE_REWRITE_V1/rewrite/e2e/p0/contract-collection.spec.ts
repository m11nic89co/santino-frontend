/**
 * P0 — C-S1-01 (Collection Carousel Rendered), C-S1-02 (Collection Stats).
 * Contract: #section1-carousel-root .mySwiper visible; .section1-stats .stat-number visible with data-target.
 */
import { test, expect } from '@playwright/test';

test.describe('C-S1-01 Collection Carousel Rendered', () => {
  test('collection carousel container and swiper are visible after navigation to section 1', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('.main-nav a[data-index="1"]').first().click();
    await expect
      .poll(async () => page.evaluate(() => document.body.dataset.activeSection ?? ''))
      .toBe('1');
    const carousel = page.locator('#section-1 #section1-carousel-root .mySwiper');
    await expect(carousel).toBeVisible({ timeout: 10000 });
  });
});

test.describe('C-S1-02 Collection Stats (flip digits)', () => {
  test('section 1 stats and stat-numbers are visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    await page.locator('.main-nav a[data-index="1"]').first().click();
    await expect
      .poll(async () => page.evaluate(() => document.body.dataset.activeSection ?? ''))
      .toBe('1');
    const statNumber = page.locator('#section-1 .section1-stats .stat-number').first();
    await expect(statNumber).toBeVisible();
  });
});
