# Pipeline — ecom-autovoucher v1.2

## Skill Registry

| # | Skill | Lệnh | Mô tả |
|---|-------|------|-------|
| 1 | init-project | `/init-project` | Scaffold project structure |
| 2 | create-test-plan | `/create-test-plan` | Tạo test plan |
| 3 | analyze-requirements | `/analyze-requirements` | Phân tích tài liệu yêu cầu |
| 4 | generate-tc | `/generate-tc` | Tạo test case Excel |
| 5 | review-tc | `/review-tc` | Review chất lượng TC |
| 6 | fetch-us | `/fetch-us` | Fetch user story từ Jira |
| 7 | log-bug | `/log-bug` | Log bug report |
| 8 | execute-maintain | `/execute-maintain` | Track test execution |
| 9 | test-report | `/test-report` | Tạo test report |
| 10 | vibe-test | `/vibe-test` | Exploratory / vibe testing |
| 11 | health-check | `/health-check` | Validate data consistency |
| 12 | scan-source-code | `/scan-source-code` | Scan automation source |
| 13 | implement-automation | `/implement-automation` | Implement automation |
| 14 | review-src-tc | `/review-src-tc` | Review automation vs TC |
| 0.5 | init-source-code | `/init-source-code` | Scaffold automation project (standalone) |

## Prerequisites
- Tài liệu đầu vào đặt tại: `00_input/v1.2/`
- CLAUDE.md và Project_rule.md đã được tạo
- Playwright setup: `10_source-code/` (khi đến phase automation)

## §8 Pipeline Status — v1.2

| Skill | Status | Ghi chú |
|-------|--------|---------|
| init-project | ✅ COMPLETED | 2026-06-30 |
| create-test-plan | ⬜ NOT_STARTED | |
| analyze-requirements | ⬜ NOT_STARTED | |
| generate-tc | ⬜ NOT_STARTED | |
| review-tc | ⬜ NOT_STARTED | |
| fetch-us | N/A (no Jira) | |
| log-bug | ✅ COMPLETED | 2026-06-30, BUG-001 (P1) + BUG-002 (P2), 2 bugs open |
| execute-maintain | ⬜ NOT_STARTED | |
| test-report | ⬜ NOT_STARTED | |
| vibe-test | ✅ COMPLETED | VR-001 (2026-06-30): 9P/1F/1Partial/24B/4NA · VR-002 (2026-06-30) retest: TC_02.1 ✅PASS (upgraded), TC_02.12 ❌FAIL confirmed, 5 EVC API-verified · VR-003 (2026-07-02) `--all` full rerun 40 TC: 14P/1F/19B/2PreB/4NA, BUG-001 stacking re-confirmed (backend-level evidence), 5 TC unblocked (02.15/17/31/33/37), 52 MCP calls / 100% locator verified · VR-004 (2026-07-02) targeted retest hasManualVoucher + PTTT-specific voucher + context switch + full payment flow thật (dev clarification + test data): 12 TC unblocked (02.2/3/4/5/6/11/13/14/16/20/21/24) — **tổng 26P/1F/7B/2PreB/4NA/40**. ⚠️ Đơn hàng thật đã tạo trên STG: 0000JB8KK0CG |
| health-check | ✅ COMPLETED | 2026-07-02, QUICK mode, 1 CRITICAL / 4 WARNING / 2 INFO (xem lần chạy 2026-06-30 trước đó: 2C/3W/2I) |
| scan-source-code | ✅ COMPLETED | 2026-07-02, FULL scan (TS variant), 8/8 .ts files, 0 Page class/0 test file (pure scaffold), MEMORY.md §1-§19 populated |
| implement-automation | ⬜ NOT_STARTED | Playwright |
| review-src-tc | ⬜ NOT_STARTED | |
| init-source-code | ✅ COMPLETED | 2026-07-02, archetype=playwright-ts, 15 files scaffold, npm install + tsc --noEmit + playwright install chromium all OK |

## Flow Diagram
```
init-project ✅
    ↓
create-test-plan
    ↓
analyze-requirements
    ↓
generate-tc → review-tc
    ↓
execute-maintain → log-bug (khi có bug)
    ↓
test-report
    ↓
(Automation phase)
init-source-code → scan-source-code → implement-automation → review-src-tc
```
