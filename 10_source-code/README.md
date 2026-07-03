# ecom-autovoucher — Automation (Playwright TypeScript)

> Scaffolded by `/init-source-code --archetype playwright-ts` on 2026-07-02.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers (Chromium + Firefox + WebKit ~200 MB)
npx playwright install

# 3. Source credentials (per project security guideline)
source ~/.ecom-autovoucher/credentials.env

# 4. Run tests
npm test                          # All tests
npm run test:smoke                # Smoke suite only
npm run test:headed               # Headed mode (visible browser)
npm run test:debug                # Debug mode (Playwright Inspector)
npm run test:ui                   # Interactive UI mode

# 5. View report
npm run report
```

## Folder structure

```
src/
├── pages/        # Page Objects (BasePage + per-page classes)
├── tests/        # Test specs (.spec.ts) + fixtures + setup
└── utils/        # Helpers (API, data parsers, formatters)

playwright-suites/  # Suite configs (smoke, regression)
playwright.config.ts  # Default config
tsconfig.json         # TypeScript strict mode
```

## Environment vars (required)

| Var | Purpose | Source |
|---|---|---|
| `BASE_URL` | Web app base URL | Per environment |
| `API_BASE_URL` | Backend API base | Per environment |
| `TEST_USERNAME` | SSO/login test account | `~/.ecom-autovoucher/credentials.env` |
| `TEST_PASSWORD` | Test account password | `~/.ecom-autovoucher/credentials.env` |

## Next steps

1. `/scan-source-code` — Populate MEMORY §3-§19 với scaffold conventions
2. `/analyze-requirements --init @00_input/v1.0/` — Start QA pipeline (nếu chưa)
3. `/implement-automation --module <MODULE>` — Generate Page Objects + Test specs từ TC-MASTER

## See also

- Toolkit ONBOARDING: `~/.claude/skills/ONBOARDING.md`
- Playwright docs: https://playwright.dev/docs/intro
- Project context: `../CLAUDE.md`
