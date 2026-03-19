/**
 * P0 — C-PERF-01 (Main Swiper & Pagination Present).
 * Contract: .main-swiper and .swiper-pagination present; main swiper instance available.
 */
import { test, expect } from '@playwright/test';

test.describe('C-PERF-01 Main Swiper & Pagination Present', () => {
  test('main swiper container and pagination exist', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.main-swiper')).toBeVisible();
    await expect(page.locator('.main-swiper .swiper-pagination')).toBeVisible();
  });

  test('main swiper instance is initialized', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2500);
    const hasSwiper = await page.evaluate(
      () => typeof (window as unknown as { swiper?: unknown }).swiper !== 'undefined'
    );
    expect(hasSwiper).toBe(true);
  });
});
