import { defineConfig } from '@playwright/test';
import baseConfig from '../playwright.config';

export default defineConfig({
  ...baseConfig,
  testMatch: /.*\.smoke\.spec\.ts/,
  workers: 4,
  retries: 0,
  reporter: [
    ['html', { outputFolder: 'playwright-report-smoke' }],
    ['json', { outputFile: 'test-results/smoke-results.json' }],
  ],
});
