# Vibe Locators — v1.2 — VR-003 — 2026-07-02

> Captured via Playwright MCP during this run (browser_snapshot + browser_click + browser_type + browser_network_request).
> Mark legend: ✅ Verified · ⚠️ Inferred · 🚫 NOT FOUND · ⏳ Pending
> MCP session log: see mcp-session-log.md (audit trail)
> Platform: Web (Playwright)

## Page: Product (tongdaiwifi.vn/dich-vu-so/goi-ultra-fast)

| Element | Action Used | Strategy | Value | Verified | MCP call ref | TC refs |
|---------|------------|----------|-------|----------|--------------|---------|
| "Mua ngay" button | click | role+name | `button "Mua ngay"` | ✅ | mcp-log #2, #21, #33 | TC_02.1, all |

## Page: Checkout /payment (staging.fpt.vn/checkout/{orderId}/payment)

| Element | Action Used | Strategy | Value | Verified | MCP call ref | TC refs |
|---------|------------|----------|-------|----------|--------------|---------|
| Checkbox "Tôi muốn nhận hóa đơn" | click | role+name | `checkbox "Tôi muốn nhận hóa đơn Vui lòng điền..."` | ✅ | mcp-log #15 | TC_02.17 |
| Button "Chọn tỉnh thành phố" | click | role+name | `button "Chọn tỉnh thành phố"` | ✅ | mcp-log #16 | TC_02.17 |
| Option tỉnh "Hồ Chí Minh" | click | text | `paragraph "Hồ Chí Minh"` | ✅ | mcp-log #17 | TC_02.17 |
| Button "Chọn phường/xã" | click | role+name | `button "Chọn phường/xã"` | ✅ | mcp-log #18 | TC_02.17 |
| Option phường "Phường Test Hồ Chí Minh" | click | text | `paragraph "Phường Test Hồ Chí Minh"` | ✅ | mcp-log #19 | TC_02.17 |
| Voucher trigger "Chọn ưu đãi" (+ badge) | click | text (scoped) | `getByText('Chọn ưu đãi5')` (badge nối vào text) | ✅ | mcp-log #5, #10, #22 | TC_02.8, 9, 12, 40 |
| Textbox "Nhập mã khuyến mãi" | — (present) | role+placeholder | `textbox [placeholder="Nhập mã khuyến mãi"]` | ✅ | mcp-log #4 | TC_02.27, 28 |
| Button "Áp dụng" (disabled default) | — (present) | role+name | `button "Áp dụng" [disabled]` | ✅ | mcp-log #4 | TC_02.28 |
| Paragraph "Cần thanh toán" + giá | verify | role text | `paragraph:has-text("Cần thanh toán")` sibling giá | ✅ | mcp-log #4,9,11,13 | TC_02.1,9,15,17 |
| Applied voucher code + amount (paragraph pair) | verify | generic region | 2 `paragraph` trong "Thông tin thanh toán" | ✅ | mcp-log #4,13 | TC_02.1,8 |
| Success message (single apply) | verify | paragraph text | `paragraph "Áp dụng mã ưu đãi thành công."` | ✅ | mcp-log #13 | TC_02.8 |
| Success message (stacking — misleading) | verify | paragraph text | `paragraph "Áp dụng ưu đãi mới thành công. Mã ưu đãi cũ đã được thay thế."` | ✅ | mcp-log #14 | TC_02.12 |

## Modal dialog "Chọn ưu đãi"

| Element | Action Used | Strategy | Value | Verified | MCP call ref | TC refs |
|---------|------------|----------|-------|----------|--------------|---------|
| Modal container | — (present) | role+name | `dialog "Chọn ưu đãi"` | ✅ | mcp-log #6,10,20,24 | all voucher TCs |
| Checkbox trong modal (per item) | click | role (scoped index) | `dialog.getByRole('checkbox').nth(N)` | ✅ | mcp-log #7,11,17,23 | TC_02.8, 9, 12, 36 |
| Button "Xác nhận" | click | role+name | `button "Xác nhận"` | ✅ | mcp-log #8,12,25 | TC_02.8, 9, 12 |
| Button "Close" (X) | click | role+name | `button "Close"` | ✅ | mcp-log #9,29 | TC_02.9, 36, 31 |
| Empty state image | verify | role+name | `img "Không có ưu đãi"` | ✅ | mcp-log #28 | TC_02.31, 37 |
| Empty state text | verify | paragraph text | `paragraph "Rất tiếc, quý khách không có mã ưu đãi."` | ✅ | mcp-log #28 | TC_02.31, 37 |

## Mobile viewport (390×844)

| Element | Action Used | Strategy | Value | Verified | MCP call ref | TC refs |
|---------|------------|----------|-------|----------|--------------|---------|
| Sticky bottom bar (giá + CTA) | verify (screenshot) | visual region — không có unique role riêng, cùng element "Cần thanh toán" nhưng CSS position:sticky khi viewport hẹp | — | ✅ (visual, screenshot-based) | mcp-log #34 | TC_02.33 |
| Button "Tiếp tục" (mobile CTA — thay "Thanh toán" ở desktop) | verify | role+name | `button "Tiếp tục"` | ⚠️ Inferred (chỉ thấy qua screenshot, chưa click/find_element riêng) | mcp-log #34 | TC_02.33 |

## Navigation Flow (MCP-traversed lần này)

| From | Trigger | To | Verified by |
|------|---------|-----|--------------|
| /dich-vu-so/goi-ultra-fast | click "Mua ngay" | /checkout/{orderId}/payment | TC_02.1, 40, 33 |
| checkout (0 EVC) | select address Hồ Chí Minh/Phường Test | voucher badge disappears | TC_02.17 |

## API Endpoints (network-level, không phải UI locator nhưng cần cho implement-automation)

| Endpoint | Method | Trigger | TC refs |
|----------|--------|---------|---------|
| `/ecp/ordering/public/v1/voucher/list` | POST | Page load / mở modal lần đầu (cached sau đó) | TC_02.1, 10, 38, 40 |
| `/ecp/ordering/public/v1/voucher/apply` | POST | Confirm modal (single/multi/remove) | TC_02.8, 9, 12 |

## NOT FOUND (giữ nguyên từ VR-002 — không re-test lại trong VR-003)

- Tab "Mã giảm giá" — không tồn tại trong current build
- Link "Điều kiện" trên voucher card — không tồn tại
