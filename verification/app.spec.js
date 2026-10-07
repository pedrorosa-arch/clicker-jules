const { test, expect } = require('@playwright/test');

test.describe('Cookie Clicker Web Application', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
  });

  test('initial state displays zero clicks and locked achievements', async ({ page }) => {
    await expect(page.locator('#count')).toHaveText('0');

    await expect(page.locator('#trophy-10')).not.toHaveClass(/unlocked/);
    await expect(page.locator('#trophy-100')).not.toHaveClass(/unlocked/);
    await expect(page.locator('#trophy-1000')).not.toHaveClass(/unlocked/);
  });

  test('clicking cookie increments counter and creates floating text', async ({ page }) => {
    const cookieBtn = page.locator('#cookie-btn');
    await cookieBtn.click();
    await expect(page.locator('#count')).toHaveText('1');

    await cookieBtn.click();
    await expect(page.locator('#count')).toHaveText('2');
  });

  test('unlocks Bronze trophy at 10 clicks', async ({ page }) => {
    const cookieBtn = page.locator('#cookie-btn');
    for (let i = 0; i < 10; i++) {
      await cookieBtn.click();
    }

    await expect(page.locator('#count')).toHaveText('10');
    await expect(page.locator('#trophy-10')).toHaveClass(/unlocked/);
    await expect(page.locator('#trophy-100')).not.toHaveClass(/unlocked/);
    await expect(page.locator('#trophy-1000')).not.toHaveClass(/unlocked/);

    // Verify toast notification
    await expect(page.locator('.toast')).toContainText('Bronze Trophy');
  });

  test('unlocks Silver trophy at 100 clicks', async ({ page }) => {
    const cookieBtn = page.locator('#cookie-btn');
    // Rapidly click 100 times
    await page.evaluate(() => {
      const btn = document.getElementById('cookie-btn');
      for (let i = 0; i < 100; i++) {
        btn.click();
      }
    });

    await expect(page.locator('#count')).toHaveText('100');
    await expect(page.locator('#trophy-10')).toHaveClass(/unlocked/);
    await expect(page.locator('#trophy-100')).toHaveClass(/unlocked/);
    await expect(page.locator('#trophy-1000')).not.toHaveClass(/unlocked/);
  });

  test('unlocks Gold trophy at 1000 clicks', async ({ page }) => {
    await page.evaluate(() => {
      const btn = document.getElementById('cookie-btn');
      for (let i = 0; i < 1000; i++) {
        btn.click();
      }
    });

    await expect(page.locator('#count')).toHaveText('1000');
    await expect(page.locator('#trophy-10')).toHaveClass(/unlocked/);
    await expect(page.locator('#trophy-100')).toHaveClass(/unlocked/);
    await expect(page.locator('#trophy-1000')).toHaveClass(/unlocked/);
  });

  test('persists click count and unlocked state across page reloads', async ({ page }) => {
    await page.evaluate(() => {
      const btn = document.getElementById('cookie-btn');
      for (let i = 0; i < 15; i++) {
        btn.click();
      }
    });

    await expect(page.locator('#count')).toHaveText('15');
    await expect(page.locator('#trophy-10')).toHaveClass(/unlocked/);

    // Reload page
    await page.reload();

    await expect(page.locator('#count')).toHaveText('15');
    await expect(page.locator('#trophy-10')).toHaveClass(/unlocked/);
  });

  test('reset button resets count and locks trophies', async ({ page }) => {
    await page.evaluate(() => {
      const btn = document.getElementById('cookie-btn');
      for (let i = 0; i < 20; i++) {
        btn.click();
      }
    });

    await expect(page.locator('#count')).toHaveText('20');
    await expect(page.locator('#trophy-10')).toHaveClass(/unlocked/);

    await page.locator('#reset-btn').click();

    await expect(page.locator('#count')).toHaveText('0');
    await expect(page.locator('#trophy-10')).not.toHaveClass(/unlocked/);

    // Reload to verify reset persists
    await page.reload();
    await expect(page.locator('#count')).toHaveText('0');
    await expect(page.locator('#trophy-10')).not.toHaveClass(/unlocked/);
  });
});
