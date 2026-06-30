---
bug_id: BUG-001
jira_project:
jira_issue_type: Bug
jira_key:
jira_url:
priority: P1
severity: High
components: [voucher, checkout]
affects_versions: [v1.2]
labels: [tc-TC_02.12, run-VR-001, module-VOUCHER]
environment: "https://staging.fpt.vn/checkout/0000J8NENJ1C/payment"
status: Open
attachments: [TC02-12_bug_2voucher-stacked.png]
last_synced:
---

# BUG-001 — Hệ thống cho phép stack nhiều EVC cùng lúc (vi phạm business rule)

| Field | Value |
|-------|-------|
| Bug ID | BUG-001 |
| Version | v1.2 |
| Severity / Priority | High / P1 |
| Module | VOUCHER / CHECKOUT |
| Status | Open |
| Traceability | TC_02.12 → VR-001-2026-06-30 → Auto Voucher |
| Environment | STG — staging.fpt.vn/checkout |
| Jira Key | — |

## Mô tả

Màn hình Thanh toán cho phép user chọn và apply **đồng thời nhiều EVC** trong modal "Chọn ưu đãi". Discount từ tất cả EVC được cộng dồn vào "Cần thanh toán", vi phạm business rule "chỉ áp tối đa 1 voucher tại một thời điểm".

## Steps to Reproduce

1. Truy cập `https://staging.fpt.vn/checkout/register/goi-ultra-fast?salechannelcode=tongdaiwifi&...`
2. Chờ màn Thanh toán tải — hệ thống auto-apply **CA4699GIAM10KPHIHOAMANG** (-10.000đ)
3. Click nút **"Chọn ưu đãi"** → modal mở, CA4699 đang checked
4. Click thêm vào card **CA4431GIAMTTUFSA03** (không bỏ chọn CA4699)
5. Click **"Xác nhận"**
6. Quan sát section "Thông tin thanh toán"

## Expected vs Actual

| | Nội dung |
|-|---------|
| **Expected** | Chỉ 1 EVC được áp; discount = max 1 voucher; "Cần thanh toán" = 39.900 − 10.000 = **29.900đ** |
| **Actual** | Cả 2 EVC active cùng lúc: CA4699 (-10.000đ) + CA4431 (-5.000đ); "Cần thanh toán" = **24.900đ** (giảm 15.000đ = cộng dồn) |

## Evidence

- **Screenshot:** `08_test-runs/vibe/VR-001-2026-06-30/screenshots/TC02-12_bug_2voucher-stacked.png`
- **Network:** `POST /ecp/ordering/public/v1/voucher/apply` được gọi 2 lần liên tiếp (request #97 và #100), mỗi lần apply 1 EVC, cả 2 đều trả 200 OK
- **Run:** VR-001-2026-06-30 — vibe-log.md §TC_02.12

## Impact

- **Financial:** Khách hàng có thể exploit để giảm giá vượt mức policy cho phép
- **Business rule vi phạm:** FCP yêu cầu maximum 1 EVC per checkout
- **Scope:** Toàn bộ flow checkout có EVC

## Root Cause (nghi vấn)

Modal "Chọn ưu đãi" dùng `checkbox` (multi-select) thay vì `radio` (single-select). Backend `/voucher/apply` không validate giới hạn 1 EVC — mỗi lần FE gọi apply 1 mã, backend accept mà không check tổng số EVC đang active.

## Ghi chú

- Phát hiện trong Vibe Test run VR-001 — **không phải** qua manual test script thông thường
- Cần confirm với Dev: backend có validate max 1 EVC không? Hay chỉ FE phải enforce?
- TC liên quan: TC_02.12 (no stacking), TC_02.8 (chọn EVC hợp lệ)
