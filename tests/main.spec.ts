import { test, expect } from '@playwright/test';

test('homepage has the correct title', async ({ page }) => {
  // given
  await page.goto('/');
  
  // when
  const title = await page.title();
  
  // then
  expect(title).toContain('Vite + React + TS');
}); 