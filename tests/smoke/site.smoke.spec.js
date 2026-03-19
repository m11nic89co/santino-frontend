import { test, expect } from '@playwright/test';

test('core shell and modules load', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('.main-swiper')).toBeVisible();

  await page.waitForTimeout(2500);

  const hasMainSwiper = await page.evaluate(() => Boolean(window.swiper));
  expect(hasMainSwiper).toBeTruthy();

  await expect(page.locator('#section-1 #section1-carousel-root .mySwiper')).toBeVisible({
    timeout: 10000,
  });

  const hasTicker = await page.evaluate(() => Boolean(window.TickerModule || window.UnifiedTicker));
  expect(hasTicker).toBeTruthy();
});

test('navigation to collection section works', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1500);

  await page.locator('.main-nav a[data-index="1"]').first().click();

  await expect
    .poll(async () => {
      return page.evaluate(() => document.body.dataset.activeSection || '');
    })
    .toBe('1');

  await expect(page.locator('#section-1 .section1-stats .stat-number').first()).toBeVisible();
});
