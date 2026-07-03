# MEMORY — 10_source-code/ — Automation Project

> Tạo bởi: skill `init-source-code` (archetype = playwright-ts)
> Cập nhật lần đầu: 2026-07-02
> Cập nhật gần nhất: 2026-07-02 (scan-source-code FULL — TypeScript variant)
> Updated bởi: scan-source-code, implement-automation, execute-maintain skills

## 1. Project Structure

```
10_source-code/
├── package.json
├── tsconfig.json
├── playwright.config.ts
├── playwright-suites/
│   ├── smoke.config.ts
│   └── regression.config.ts
├── src/
│   ├── pages/
│   │   ├── BasePage.ts     (abstract base — duy nhất, chưa có Page class cụ thể)
│   │   └── .gitkeep
│   ├── tests/
│   │   ├── fixtures.ts     (custom fixtures — hiện KHÔNG có fixture nào active, chỉ boilerplate)
│   │   ├── setup.ts        (global setup — check env vars TEST_USERNAME/TEST_PASSWORD/BASE_URL)
│   │   └── .gitkeep
│   └── utils/
│       ├── api-helpers.ts  (ApiHelper class — GET/POST wrapper qua APIRequestContext)
│       └── data-helpers.ts (parseViVNNumber, formatViVNNumber, parseISODate, approxEqual)
└── MEMORY.md
```

**File statistics:** 8 file `.ts` (không tính `node_modules/`). **0 Page class cụ thể**, **0 test spec file** — dự án đang ở trạng thái scaffold thuần, chưa có code implement nào từ `implement-automation`.

## 2. Tech Stack

| Component    | Value           | Version |
|--------------|-----------------|---------|
| Language     | TypeScript      | 5.x     |
| Framework    | Playwright      | 1.x     |
| Test Runner  | Playwright Test | 1.x     |
| Build Tool   | npm             | 10.x    |
| Package Mgr  | npm             | —       |
| Locator API  | page.locator()  | —       |
| Async pattern| async/await     | —       |

> **CRITICAL:** Đừng đổi header column hoặc field "Language" — downstream skills (scan-source-code, implement-automation, execute-maintain, review-src-tc) parse exact format này để route variant references.

## 3. Dependencies

**devDependencies (từ `package.json`):**
| Package | Version | Ghi chú |
|---|---|---|
| `@playwright/test` | ^1.42.0 | Cài thực tế: 1.61.1 (verify qua `npx playwright --version`) |
| `typescript` | ^5.3.0 | |
| `@types/node` | ^20.0.0 | |

**Không có:** eslint, prettier, dotenv, faker, jest/vitest — scaffold tối giản, chưa setup linting/formatting.

**Package manager:** npm (có `package-lock.json`)

### 3a. TypeScript Config (`tsconfig.json`)

- `target`: ES2022, `module`: CommonJS, `moduleResolution`: node
- `strict`: true, `noImplicitAny`: true, `strictNullChecks`: true
- Path aliases: `@pages/*` → `src/pages/*`, `@utils/*` → `src/utils/*`, `@tests/*` → `src/tests/*`
- `include`: `src/**/*`, `playwright.config.ts`, `playwright-suites/**/*`

### 3b. Playwright Config (`playwright.config.ts`)

- `testDir`: `./src/tests`
- `baseURL`: `process.env.BASE_URL` (fallback `http://localhost:3000` — **cần set env BASE_URL = https://staging.tongdaiwifi.vn khi chạy thật, theo CLAUDE.md**)
- `fullyParallel`: true, `retries`: 2 (CI) / 0 (local), `workers`: 4 (CI) / undefined (local)
- `reporter`: html + json + list
- `use`: trace on-first-retry, screenshot only-on-failure, video retain-on-failure, actionTimeout 15s, navigationTimeout 30s
- `projects`: chromium, firefox, webkit

### 3c. Suite Configs (`playwright-suites/`)

| Suite | testMatch | Workers | Retries |
|---|---|---|---|
| smoke | `*.smoke.spec.ts` | 4 | 0 |
| regression | `*.{spec,regression}.ts` | 8 | 1 |

⚠️ **Hiện chưa có file nào match 2 pattern trên** (0 test spec file tồn tại) — sẽ hoạt động sau khi `implement-automation` sinh test file.

## 4. Base Classes

### BasePage (`src/pages/BasePage.ts`)

- `export abstract class BasePage` — constructor: `constructor(protected readonly page: Page) {}`
- Methods (tất cả `async`, return `Promise<...>`):
  - `goto(path: string = '/'): Promise<void>`
  - `waitForVisible(locator: Locator, timeout = 10_000): Promise<void>` — dùng `expect(locator).toBeVisible()`
  - `getURL(): Promise<string>`
  - `screenshot(name: string): Promise<void>` — lưu vào `test-results/${name}.png`, fullPage
  - `scrollIntoView(locator: Locator): Promise<void>`
  - `waitForNetworkIdle(timeout = 5_000): Promise<void>`
- Import: `import { Page, Locator, expect } from '@playwright/test'`
- **Tất cả Page class mới PHẢI `extends BasePage`** và gọi `super(page)` trong constructor.

### Fixtures (`src/tests/fixtures.ts`)

- `export const test = base.extend<CustomFixtures>({...})` — hiện `CustomFixtures` type rỗng, object extend rỗng (chỉ có comment mẫu `authenticatedPage`, `apiHelper` — CHƯA implement)
- `export { expect } from '@playwright/test'`
- → Test file nên `import { test, expect } from '../tests/fixtures'` thay vì trực tiếp từ `@playwright/test`, để sẵn sàng dùng fixture khi cần.

### Global Setup (`src/tests/setup.ts`)

- `globalSetup(config: FullConfig)` — check tồn tại env var `TEST_USERNAME`, `TEST_PASSWORD`, `BASE_URL`, log warning nếu thiếu (không throw)
- Chưa có auth state capture hay test data pre-warming

### Utils

- `ApiHelper` (`src/utils/api-helpers.ts`) — `static create(baseURL?)`, `get<T>(path, headers?)`, `post<T>(path, body, headers?)`, `dispose()`. Dùng `process.env.API_BASE_URL` mặc định.
- `data-helpers.ts` — `parseViVNNumber` (vd "1.234,56" → 1234.56), `formatViVNNumber`, `parseISODate`, `approxEqual(actual, expected, tolerance=0.01)`. **Hữu ích cho voucher module** (giá tiền format "29.900đ" cần parse qua `parseViVNNumber`).

## 5. Naming Conventions

> Đây là convention **khai báo trong scaffold template** (chưa có code thực để verify frequency, vì 0 Page class / 0 test file ngoài BasePage). implement-automation PHẢI tuân thủ các pattern này khi generate code mới.

- Page class file: `<Name>Page.ts` (vd `VoucherPage.ts`, `CheckoutPage.ts`)
- Test file: `<feature>.spec.ts` (vd `voucher.spec.ts`)
- Suite test file: `<feature>.<suite>.spec.ts` (vd `voucher.smoke.spec.ts`)
- Locator property: descriptive camelCase, type `Locator`, khai báo `private readonly` trong class (Pattern A — constructor-based init, theo `scan-source-code` reference)
- Action method: `verb<Target>()` async, return `Promise<...>` (vd `clickSubmit()`, `enterEmail(value: string): Promise<void>`)
- Test name: `'TC-<MODULE>-<NNN>: <title> / SC-<MODULE>-<NNN>'` — ⚠️ **lệch với TC-MASTER thực tế** (xem §19 Notes)

## 6. Page Registry

| Page class | File | Status |
|---|---|---|
| BasePage | src/pages/BasePage.ts | ✅ Scaffolded (abstract base) |
| VoucherPage / CheckoutPage (dự kiến) | — | ⏳ Chưa implement — chờ `/implement-automation` |

## 7. Test Registry

| Test file | Tests count | Status |
|---|---|---|
| (chưa có file nào) | 0 | ⏳ Chờ `/implement-automation` sinh từ TC-MASTER-v1.2.xlsx (26 TC PASS sẵn sàng, xem `08_test-runs/vibe/vibe-locators-latest.md`) |

## 8. Pipeline Status

(see MASTER-MEMORY §8)

## 9. Locator Registry

> Chưa có locator nào code hoá trong `src/pages/` (0 Page class). Locator đã **verify qua Playwright MCP** (vibe-test) và sẵn sàng để implement-automation dùng — xem `08_test-runs/vibe/vibe-locators-latest.md` (nguồn: VR-003 + VR-004, 100% verified qua MCP, bao gồm cả full payment flow FoxPay/Napas).

| Page | Element | Strategy | Selector | Last verified |
|---|---|---|---|---|
| (chưa code hoá — xem vibe-locators-latest.md) | — | — | — | — |

## 10. Suite Definitions

| Suite | Config | Test files |
|---|---|---|
| smoke | playwright-suites/smoke.config.ts | `*.smoke.spec.ts` |
| regression | playwright-suites/regression.config.ts | `*.{spec,regression}.ts` |

## 11. Build Verification History

| Date | Command | Status | Notes |
|---|---|---|---|
| 2026-07-02 | npm install | ✅ OK | 6 packages, 0 vulnerabilities |
| 2026-07-02 | npx tsc --noEmit | ✅ OK | Compile clean, no errors |
| 2026-07-02 | npx playwright install chromium | ✅ OK | Chromium 1228 đã có sẵn tại ~/.cache/ms-playwright |

## 12. Locator Strategy Priority

1. `page.getByRole(role, options)` — accessibility-friendly (preferred)
2. `page.getByLabel(text)` — form fields
3. `page.getByPlaceholder(text)` — inputs
4. `page.getByText(text)` — visible text
5. `page.getByTestId(testId)` — `data-testid` attribute (stable)
6. `page.locator('#id')` — CSS by id
7. `page.locator('.css-selector')` — CSS general
8. `page.locator('xpath=//...')` — XPath last resort

## 13. Implementation Log

| Date | SC | TC ID | Test file | Method/test name | Notes |
|---|---|---|---|---|---|
| (populated by implement-automation) | — | — | — | — | — |

## 14. Locator Issues / Fixes

| Date | Element | Issue | Fix | By |
|---|---|---|---|---|
| (populated by execute-maintain recheck) | — | — | — | — |

## 15. Execution Log

| Run ID | Date | Version | Test scope | Command | Total | Pass | Fail | Skip | Pass% |
|---|---|---|---|---|---|---|---|---|---|
| (populated by execute-maintain) | — | — | — | — | — | — | — | — | — |

## 16. Fail Registry

| FAIL ID | RUN | Version | Test method | SC ID | Type | Error | Recheck | Status | Fix |
|---|---|---|---|---|---|---|---|---|---|
| (populated by execute-maintain) | — | — | — | — | — | — | — | — | — |

## 17. SRC-TC Review

| Date | Version | Reviewer | Score | Findings | Report |
|---|---|---|---|---|---|
| (populated by review-src-tc) | — | — | — | — | — |

## 18. Scan History

| Date | Mode | Version | Coverage | Notes |
|---|---|---|---|---|
| 2026-07-02 | FULL (TypeScript variant) | v1.2 | 8/8 .ts files scanned | 0 Page class, 0 test spec — pure scaffold state. Build verify: npm install OK, tsc --noEmit OK, playwright install chromium OK |

## 19. Notes

- Scaffolded từ archetype `playwright-ts` on 2026-07-02
- Downstream skills (scan/implement/execute/review-src-tc) sẽ auto-route to TypeScript variants based on §2 Tech Stack
- **⚠️ TC ID naming mismatch:** TC-MASTER-v1.2.xlsx dùng pattern `TC_02.X` (vd `TC_02.12`), KHÔNG khớp convention chuẩn `TC-<MODULE>-<NNN>` khai báo ở §5 / CLAUDE.md / Project_rule.md §5. **Quyết định cho implement-automation:** giữ nguyên `TC_02.X` trong `@Test`/test name để đảm bảo traceability 1:1 với TC-MASTER (Project_rule §5 nguyên tắc "TC Excel là contract"), KHÔNG tự ý đổi tên TC ID.
- **BASE_URL cần set env** trước khi chạy test thật: `https://staging.tongdaiwifi.vn` (theo CLAUDE.md), khác default `http://localhost:3000` trong playwright.config.ts
- **26 TC PASS sẵn sàng automate** (locator + API evidence verified qua MCP, xem `08_test-runs/vibe/vibe-locators-latest.md` — nguồn VR-003 + VR-004)
- **1 bug đã biết (BUG-001, stacking)** — TC_02.12 sẽ FAIL khi automate nếu bug chưa fix; nên implement với assertion đúng theo TC-MASTER (expected: chỉ 1 voucher), để test đóng vai trò regression detector cho bug này
- Test data quan trọng cho implement: EVC codes (CA4699/CA4431/CA4580/CA4608/CA4656/CA4887), địa chỉ Hà Nội/Cầu Giấy/Phạm Văn Bạch (5 EVC) và An Giang/Châu Đốc/Kênh Hòa Bình (4 EVC), thẻ test STG 9704000000000018 (SaigonBank) + OTP `otp`
