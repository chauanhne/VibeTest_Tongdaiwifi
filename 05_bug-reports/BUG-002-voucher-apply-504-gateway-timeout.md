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
labels: [tc-TC_02.1, run-VR-001, run-VR-002, run-VR-003, module-VOUCHER, not-reproduced-3x]
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
| Traceability | TC_02.1 → VR-001-2026-06-30 (504 quan sát 1 lần) → VR-002/VR-003 (không tái hiện, 4 lần retest PASS) → Auto Voucher |
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

- Phát hiện 1 lần trong TC_02.40 fresh session retest (VR-001, 2026-06-30)
- Run đầu (VR-001 session 1) — `/voucher/apply` trả 200 OK thành công
- Khả năng: **flaky / intermittent** ở STG environment, có thể do backend timeout hoặc upstream dependency

### Retest Evidence — KHÔNG tái hiện qua 4 lần retest tiếp theo

| Run | Session/Order | TC_02.1 Result | `/voucher/apply` status |
|-----|---------------|-----------------|--------------------------|
| VR-001 (2026-06-30) | 0000J8P6DNZ4 | ⚠️ (504 quan sát tại TC_02.40, side observation) | 504 Gateway Timeout (1 lần) |
| VR-002 (2026-06-30) | — (retest riêng TC_02.1) | ✅ PASS | 200 OK — CA4699 auto-applied đúng |
| VR-003 (2026-07-02) session 1 | 0000JAZE7Q9S | ✅ PASS | 200 OK |
| VR-003 (2026-07-02) session 2 | 0000JAZM3NLS | ✅ PASS | 200 OK |
| VR-003 (2026-07-02) session 3 | 0000JAZO17PC | ✅ PASS | 200 OK |

→ **0/4 lần retest tái hiện 504** kể từ lần phát hiện đầu tiên. Tỷ lệ tái hiện thấp, nhất quán với giả thuyết "flaky/intermittent infra" hơn là lỗi logic ổn định.

## Root Cause (nghi vấn — chưa đổi, vẫn cần Dev xác nhận)

STG backend service xử lý `/voucher/apply` bị timeout (504) khi tải cao hoặc cold-start — không phải lỗi logic FE. Retest evidence (0/4 tái hiện) củng cố giả thuyết đây là **infra-level, không phải deterministic app bug**.

## Ghi chú

- Phát hiện như **side observation** trong TC_02.40 retest session, không phải TC chuyên biệt
- TC liên quan trực tiếp: **TC_02.1** (auto-apply EVC khi load trang) — đã re-test 4 lần (VR-002 + VR-003×3), toàn bộ PASS
- **Đề xuất xử lý:** Do tỷ lệ tái hiện thấp (1/5 lần quan sát) và không deterministic, đề xuất giữ status Open nhưng hạ mức theo dõi — cân nhắc BA/Dev quyết định: (a) đóng bug với ghi chú "infra-flaky, monitor" nếu chấp nhận rủi ro thấp, hoặc (b) giữ mở và theo dõi thêm nếu 504 tái xuất hiện trong các run sau. KHÔNG tự đóng bug — cần retest chính thức qua `/execute-maintain` hoặc xác nhận từ BA/Dev trước khi đổi lifecycle status.
