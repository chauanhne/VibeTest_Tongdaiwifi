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
labels: [tc-TC_02.12, run-VR-001, run-VR-002, run-VR-003, module-VOUCHER]
environment: "https://staging.fpt.vn/checkout/0000J8NENJ1C/payment"
status: Open
attachments: [TC02-12_bug_2voucher-stacked.png, TC02-12_stacking-retest.png, TC02-12_multi-select-request-body.png, TC02-12_FAIL_stacking-confirmed.png]
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
| Traceability | TC_02.12 → VR-001-2026-06-30, VR-002-2026-06-30, VR-003-2026-07-02 (3 lần confirm liên tiếp) → Auto Voucher |
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

### VR-001 (2026-06-30) — Phát hiện ban đầu
- **Screenshot:** `08_test-runs/vibe/VR-001-2026-06-30/screenshots/TC02-12_bug_2voucher-stacked.png`
- **Network:** `POST /ecp/ordering/public/v1/voucher/apply` được gọi 2 lần liên tiếp (request #97 và #100), mỗi lần apply 1 EVC, cả 2 đều trả 200 OK

### VR-002 (2026-06-30) — Retest, root cause khác biệt
- **Screenshot:** `TC02-12_stacking-retest.png`, `TC02-12_multi-select-request-body.png`
- Request body gửi 2 voucher code cùng lúc: `[CA4699GIAM10KPHIHOAMANG, CA4431GIAMTTUFSA03]`, mode="Manual"
- Response: `CHECKOUT_TOKEN_REQUIRED` (session guest thiếu token) — stacking KHÔNG hoàn tất trên UI lần này, nhưng **FE vẫn cho phép multi-select** (root cause FE xác nhận, root cause BE chưa xác nhận được do lỗi auth chặn trước)

### VR-003 (2026-07-02) — Confirm lần 3, bằng chứng backend-level dứt khoát
- **Screenshot:** `TC02-12_FAIL_stacking-confirmed.png`
- Request body (request #102): `{"vouchers":[{"voucher_code":"CA4431GIAMTTUFSA03",...},{"voucher_code":"CA4699GIAM10KPHIHOAMANG",...}],"mode":"Manual"}`
- **Response: `success:true`, `data[]` chứa CẢ 2 voucher** (CA4431 -5.000đ + CA4699 -10.000đ) — backend **xử lý và trả về thành công cho cả 2 mã cùng lúc**, không chỉ là lỗi FE validate
- UI message "Áp dụng ưu đãi mới thành công. Mã ưu đãi cũ đã được thay thế." — **sai lệch**, thực tế không thay thế mà cộng dồn (Cần thanh toán = 24.900đ = 39.900 - 5.000 - 10.000)
- **Run:** VR-003-2026-07-02 — vibe-log.md §TC_02.12, vibe-report.md

## Impact

- **Financial:** Khách hàng có thể exploit để giảm giá vượt mức policy cho phép
- **Business rule vi phạm:** FCP yêu cầu maximum 1 EVC per checkout
- **Scope:** Toàn bộ flow checkout có EVC
- **UX:** Message thành công gây hiểu lầm (claims "thay thế" nhưng thực tế "cộng dồn") — cập nhật ở VR-003

## Root Cause (CONFIRMED — VR-003, không còn "nghi vấn")

1. **Frontend:** Modal "Chọn ưu đãi" dùng `checkbox` (multi-select) thay vì `radio` (single-select) — không có validation ngăn chọn >1 voucher.
2. **Backend (xác nhận VR-003):** `/voucher/apply` **chấp nhận và xử lý thành công mảng nhiều `voucher_code` cùng lúc** trong 1 request — response trả `success:true` với `data[]` chứa toàn bộ voucher đã apply, không giới hạn 1. Đây KHÔNG còn là lỗi FE-only như đánh giá ban đầu (VR-001/VR-002 nghi ngờ do lỗi auth `CHECKOUT_TOKEN_REQUIRED` che khuất).

## Ghi chú

- Phát hiện trong Vibe Test run VR-001, **re-confirmed 2 lần** ở VR-002 và VR-003 (2026-07-02) — mức độ nghiêm trọng cao hơn đánh giá ban đầu do bằng chứng backend-level
- TC liên quan: TC_02.12 (no stacking, ❌ FAIL cả 3 lần), TC_02.8 (chọn EVC hợp lệ, ✅ PASS)
- **Đề xuất:** Cần cả FE (giới hạn UI chỉ chọn 1) + BE (validate/reject request có >1 voucher_code trong mảng)
