# ecom-autovoucher — QA Workspace

**Version:** v1.2 | **QC:** anhdc4 | **Env:** STG

## Giới thiệu
Workspace QA cho tính năng **Auto Voucher** thuộc hệ thống ECOM (tongdaiwifi.vn).

**Flow test chính:** Trang sản phẩm → click "Mua ngay" → Màn hình Thanh toán → kiểm tra voucher tự động áp dụng.

## Quick Start

1. Đặt tài liệu requirements vào `00_input/v1.2/`
2. Mở Claude Code trong thư mục này
3. Đọc `COMMANDS.md` để copy-paste lệnh
4. Chạy `/create-test-plan` để bắt đầu

## Môi trường
| Env | URL |
|-----|-----|
| STG | https://staging.tongdaiwifi.vn/dich-vu-so/goi-ultra-fast |

## Automation
- Framework: **Playwright**
- Source: `10_source-code/`
- Init: `/init-source-code --archetype playwright-ts`

## Files quan trọng
| File | Mục đích |
|------|----------|
| `COMMANDS.md` | Tất cả lệnh cần dùng |
| `PIPELINE.md` | Tiến độ pipeline |
| `02_analyze-requirements/Project_rule.md` | Rule & convention dự án |
| `CLAUDE.md` | Config cho Claude Code |
