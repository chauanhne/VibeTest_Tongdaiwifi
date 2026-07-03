import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage — abstract base cho mọi Page Object.
 * Provides shared utility methods: waitFor, scroll, screenshot, navigation.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  async getURL(): Promise<string> {
    return this.page.url();
  }

  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  }

  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async waitForNetworkIdle(timeout = 5_000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Dismiss cookie consent banner ("Đồng ý"/"Không, cảm ơn") nếu xuất hiện.
   * Chỉ hiện trên browser context CHƯA từng accept cookie (mọi Playwright test chạy
   * fresh context mỗi lần — khác với session MCP thủ công vốn đã accept từ trước).
   * No-op nếu banner không xuất hiện trong `timeout`.
   */
  async dismissCookieBanner(timeout = 3_000): Promise<void> {
    const acceptButton = this.page.getByRole('button', { name: 'Đồng ý' });
    try {
      await acceptButton.waitFor({ state: 'visible', timeout });
      await acceptButton.click();
    } catch {
      // Banner không xuất hiện — bỏ qua
    }
  }
}
