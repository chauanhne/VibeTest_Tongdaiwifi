---
bug_id: BUG-002
jira_project:
jira_issue_type: Bug
jira_key:
jira_url:
priority: P2
severity: High
components: [voucher, checkout, api]
affects_versions: [v1.2]
labels: [tc-TC_02.1, run-VR-001, module-VOUCHER]
environment: "https://staging.fpt.vn/checkout/0000J8P6DNZ4/payment"
status: Open
attachments: [TC02-40_PASS_modal-cache-no-refetch.png]
last_synced:
---

# BUG-002 — Auto-apply EVC thất bại: /voucher/apply trả 504 Gateway Timeout

| Field | Value |
|-------|-------|
| Bug ID | BUG-002 |
| Version | v1.2 |
| Severity / Priority | High / P2 |
| Module | VOUCHER / CHECKOUT / API |
| Status | Open |
| Traceability | TC_02.1 → VR-001-2026-06-30 → Auto Voucher |
| Environment | STG — staging.fpt.vn/checkout |
| Jira Key | — |

## Mô tả

Khi load màn Thanh toán (checkout), hệ thống gọi `POST /voucher/apply` để tự động áp EVC tốt nhất cho khách hàng. Trong một số trường hợp, API này trả về **504 Gateway Timeout**, khiến auto-apply thất bại hoàn toàn — khách hàng không được giảm giá mặc dù có EVC hợp lệ.

## Steps to Reproduce

1. Truy cập trang sản phẩm `https://staging.tongdaiwifi.vn/dich-vu-so/goi-ultra-fast`
2. Click nút **"Mua ngay"** → redirect sang màn Thanh toán
3. Chờ trang load hoàn tất
4. Quan sát Network tab: `POST /ecp/ordering/public/v1/voucher/apply`

## Expected vs Actual

| | Nội dung |
|-|---------|
| **Expected** | `POST /voucher/apply` → 200 OK; EVC tốt nhất được auto-apply; "Cần thanh toán" = 39.900 − discount |
| **Actual** | `POST /voucher/apply` → **504 Gateway Timeout**; không có EVC nào được áp; "Cần thanh toán" = 39.900đ (giá gốc) |

## Evidence

- **Network:** Request #95 trong run TC_02.40 (fresh session, checkout `0000J8P6DNZ4`): `POST /ecp/ordering/public/v1/voucher/apply` → **504 Gateway Timeout**
- **UI:** Badge "Chọn ưu đãi" hiển thị số 5 (EVC available), nhưng không có EVC nào được auto-apply; giá giữ nguyên 39.900đ
- **Screenshot:** `TC02-40_PASS_modal-cache-no-refetch.png` (chụp tại thời điểm modal sau khi 504)
- **Run:** VR-001-2026-06-30 — vibe-log.md §TC_02.40 (side observation)

## Impact

- **User experience:** Khách hàng không nhận được giảm giá tự động dù có EVC hợp lệ — phải tự chọn thủ công hoặc bỏ qua
- **Business:** Revenue impact nếu user bỏ checkout do không thấy discount
- **Tính nhất quán:** Auto-apply flaky — có lúc được, có lúc 504 → UX không đồng nhất

## Reproductibility

- Phát hiện 1 lần trong TC_02.40 fresh session retest (2026-06-30)
- Run đầu (VR-001 session 1) — `/voucher/apply` trả 200 OK thành công
- Khả năng: **flaky / intermittent** ở STG environment, có thể do backend timeout hoặc upstream dependency

## Root Cause (nghi vấn)

STG backend service xử lý `/voucher/apply` bị timeout (504) khi tải cao hoặc cold-start — không phải lỗi logic FE.

## Ghi chú

- Phát hiện như **side observation** trong TC_02.40 retest session, không phải TC chuyên biệt
- TC liên quan trực tiếp: **TC_02.1** (auto-apply EVC khi load trang)
- Cần retest thêm để xác nhận reproductibility rate
- Nếu chỉ xảy ra ở STG → có thể là infra issue, không phải app bug
