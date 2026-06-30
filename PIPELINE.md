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
| vibe-test | ✅ COMPLETED | VR-001 (2026-06-30): 9P/1F/1Partial/24B/4NA · VR-002 (2026-06-30) retest: TC_02.1 ✅PASS (upgraded), TC_02.12 ❌FAIL confirmed, 5 EVC API-verified |
| health-check | ✅ COMPLETED | 2026-06-30, QUICK mode, 2 CRITICAL / 3 WARNING / 2 INFO |
| scan-source-code | ⬜ NOT_STARTED | |
| implement-automation | ⬜ NOT_STARTED | Playwright |
| review-src-tc | ⬜ NOT_STARTED | |

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
init-source-code → implement-automation → scan-source-code → review-src-tc
```
