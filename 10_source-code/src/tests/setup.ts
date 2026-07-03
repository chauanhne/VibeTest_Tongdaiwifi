import { FullConfig } from '@playwright/test';

/**
 * Global setup — runs once before all tests.
 * Use cho: verify env vars, pre-warm data, capture auth storage state, validate API health.
 */
async function globalSetup(config: FullConfig): Promise<void> {
  const required = ['TEST_USERNAME', 'TEST_PASSWORD', 'BASE_URL'];
  for (const env of required) {
    if (!process.env[env]) {
      console.warn(`⚠️ Missing env var: ${env} — some tests may fail`);
    }
  }

  // Add additional global setup here.
}

export default globalSetup;
