import { test, expect } from '@playwright/test';

test('tokenization page works correctly', async ({ page }) => {
  // given
  await page.goto('/');
  
  // when
  await page.fill('input[placeholder="Enter text here..."]', 'Hello world');
  await page.click('button:text("Tokenize")');
  
  // then
  // Wait for tokenization to complete
  await page.waitForSelector('text=Tokenization Result');
  
  // Check that tokens are displayed
  await expect(page.locator('div:has-text("Hello")').first()).toBeVisible();
  await expect(page.locator('div:has-text("world")').first()).toBeVisible();
}); 