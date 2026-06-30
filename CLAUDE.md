# CLAUDE.md — ecom-autovoucher

## Project Overview
- **Tên dự án:** ecom-autovoucher
- **QC phụ trách:** anhdc4
- **Version:** v1.2
- **Mô tả:** QA workspace cho tính năng Auto Voucher thuộc hệ thống ECOM (tongdaiwifi.vn)

## Môi trường Test
| Env | URL |
|-----|-----|
| STG | https://staging.tongdaiwifi.vn/dich-vu-so/goi-ultra-fast |

Flow chính: `Trang sản phẩm` → click **"Mua ngay"** → `Màn hình Thanh toán`

## Loại kiểm thử
- Functional

## Automation
- **Framework:** Playwright
- **Source:** `10_source-code/`
- Chạy: xem README trong `10_source-code/`

## Ngôn ngữ TC
Tiếng Việt

## Naming Conventions
| Artifact | Pattern | Ví dụ |
|----------|---------|-------|
| Test case ID | `TC-<MODULE>-<NNN>` | `TC-VOUCHER-001` |
| Bug report | `BUG-<NNN>-<slug>.md` | `BUG-001-voucher-not-applied.md` |
| Test plan | `TP-<module>-v<X>.md` | `TP-autovoucher-v1.2.md` |
| Fragment | `TC-<MODULE>-fragment.xlsx` | `TC-VOUCHER-fragment.xlsx` |

## Folder Structure
```
ecom-autovoucher/ (= /home/anhdc4/ECOM/V1.2)
├── 00_input/          ← Tài liệu đầu vào (SRS, specs, AC)
│   ├── v1.2/
│   └── shared/
├── 01_test-plans/     ← Test plan files
├── 02_analyze-requirements/
│   ├── v1.2/          ← Analyze output
│   └── Project_rule.md
├── 03_test-cases/
│   ├── v1.2/functional/
│   └── fragments/
├── 04_test-data/valid/, invalid/
├── 05_bug-reports/
├── 06_checklists/
├── 07_environments/
├── 08_test-runs/vibe/
├── 09_reports/
├── 10_source-code/    ← Playwright source
├── 11_tc-review/
├── CLAUDE.md          ← File này
├── PIPELINE.md        ← Skill pipeline & status
└── COMMANDS.md        ← Lệnh tester dùng hàng ngày
```

## Quick Reference
- Đọc **COMMANDS.md** để biết cách gọi skill
- Đọc **PIPELINE.md** để theo dõi tiến độ pipeline
- Rule dự án: `02_analyze-requirements/Project_rule.md`

## Workflow
1. Đặt tài liệu SRS/specs vào `00_input/v1.2/`
2. `/create-test-plan` → `/analyze-requirements --init`
3. `/generate-tc` → review → `/review-tc`
4. Log bug: `/log-bug`
5. (Automation phase) `/init-source-code --archetype playwright-ts`
