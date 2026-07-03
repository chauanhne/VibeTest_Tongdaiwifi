import { defineConfig } from '@playwright/test';
import baseConfig from '../playwright.config';

export default defineConfig({
  ...baseConfig,
  testMatch: /.*\.(spec|regression)\.ts/,
  workers: 8,
  retries: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report-regression' }],
    ['json', { outputFile: 'test-results/regression-results.json' }],
  ],
});
