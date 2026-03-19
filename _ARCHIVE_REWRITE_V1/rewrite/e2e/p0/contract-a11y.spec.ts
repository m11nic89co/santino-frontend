/**
 * P0 — C-A11Y-01 (Skip Link & Focus), C-A11Y-02 (Reduced Motion).
 * Contract: .skip-link present and focusable; reduced-motion adds html.reduced-motion and pauses ticker.
 */
import { test, expect } from '@playwright/test';

test.describe('C-A11Y-01 Skip Link & Focus', () => {
  test('skip link exists with href to main content', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
    await expect(skipLink).toBeAttached();
  });

  test('main content landmark exists', async ({ page }) => {
    await page.goto('/');
    const main = page.locator('#main-content, main');
    await expect(main.first()).toBeAttached();
  });
});

test.describe('C-A11Y-02 Reduced Motion', () => {
  test('when prefers-reduced-motion, html has reduced-motion class', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForTimeout(2000);
    const hasClass = await page.evaluate(() =>
      document.documentElement.classList.contains('reduced-motion')
    );
    expect(hasClass).toBe(true);
  });
});
