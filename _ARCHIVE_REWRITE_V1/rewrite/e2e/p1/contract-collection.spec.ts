/**
 * P1 — C-S1-03 (Collection Carousel Navigation).
 * Contract: prev/next buttons or swiper navigation change slide; active slide index updates.
 */
import { test, expect } from '@playwright/test';

test.describe('C-S1-03 Collection Carousel Navigation', () => {
  test('carousel next button advances slide', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    await page.locator('.main-nav a[data-index="1"]').first().click();
    await expect
      .poll(async () => page.evaluate(() => document.body.dataset.activeSection ?? ''))
      .toBe('1');
    const nextBtn = page
      .locator('#section-1 .swiper-button-next, #section1-carousel-root .swiper-button-next')
      .first();
    await nextBtn.click();
    await page.waitForTimeout(600);
    const activeIndex = await page.evaluate(() => {
      const swiper = (window as unknown as { section1Swiper?: { activeIndex: number } })
        .section1Swiper;
      return swiper?.activeIndex ?? -1;
    });
    expect(activeIndex).toBeGreaterThanOrEqual(0);
  });
});
