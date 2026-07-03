import { test as base } from '@playwright/test';

/**
 * Custom fixtures — extend Playwright base test với project-specific fixtures.
 * Example fixtures (commented — uncomment + implement khi cần):
 *   - authenticatedPage: Page already logged in
 *   - apiHelper: ApiHelper instance
 *   - testDataFactory: factory function tạo test data
 */

type CustomFixtures = {
  // Define custom fixtures here (commented out cho boilerplate clean)
  // authenticatedPage: Page;
  // apiHelper: ApiHelper;
};

export const test = base.extend<CustomFixtures>({
  // Implement fixtures here. Example pattern:
  //
  // authenticatedPage: async ({ page }, use) => {
  //   await page.goto('/login');
  //   await page.fill('#email', process.env.TEST_USERNAME!);
  //   await page.fill('#password', process.env.TEST_PASSWORD!);
  //   await page.click('button[type=submit]');
  //   await page.waitForURL(/dashboard/);
  //   await use(page);
  // },
});

export { expect } from '@playwright/test';
