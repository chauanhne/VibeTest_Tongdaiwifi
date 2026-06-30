# Vibe Locators — v1.2 — VR-002 — 2026-06-30

> Captured via Playwright MCP during VR-002.
> Mark legend: ✅ Verified · ⚠️ Inferred · 🚫 NOT FOUND · ⏳ Pending
> MCP session log: see mcp-session-log.md

---

## Page: Checkout /payment — staging.fpt.vn/checkout/{orderId}/payment

### Voucher Section (Thông tin thanh toán)

| Element | Action | Locator Strategy | Locator Value | Verified | MCP call ref |
|---------|--------|-----------------|---------------|----------|--------------|
| "Chọn ưu đãi" trigger + badge | click | text | `Chọn ưu đãi` (với badge số) | ✅ | browser_click [ref=f4e93] |
| Badge count (số EVC) | read | generic inside button | `generic "5"` bên trong `paragraph "Chọn ưu đãi"` | ✅ | browser_snapshot [ref=f4e353] |
| Textbox "Nhập mã khuyến mãi" | type | role=textbox | `{ name: 'Nhập mã khuyến mãi' }` | ✅ | browser_snapshot [ref=f4e92] |
| Button "Áp dụng" [disabled] | read state | role=button | `{ name: 'Áp dụng' }` disabled | ✅ | browser_snapshot [ref=f4e89] |
| Applied voucher code | read | paragraph in region "Thông tin thanh toán" | text = mã voucher (e.g. "CA4699GIAM10KPHIHOAMANG") | ✅ | browser_snapshot |
| Applied discount amount | read | paragraph in region "Thông tin thanh toán" | text = "-10.000đ" | ✅ | browser_snapshot |
| "Cần thanh toán" price | read | paragraph in region "Thông tin thanh toán" | text = "29.900đ" | ✅ | browser_snapshot |

### Modal "Chọn ưu đãi"

| Element | Action | Locator Strategy | Locator Value | Verified | MCP call ref |
|---------|--------|-----------------|---------------|----------|--------------|
| Dialog container | read | role=dialog | `{ name: 'Chọn ưu đãi' }` | ✅ | browser_snapshot [ref=f4e719] |
| Heading | read | role=heading | `"Chọn ưu đãi"` level 2 | ✅ | browser_snapshot |
| CA4699 checkbox (1st) | click | role=checkbox | `.first()` (within dialog) | ✅ | [ref=f4e815] |
| CA4431 checkbox (2nd) | click | role=checkbox | `.nth(1)` (within dialog) | ✅ | [ref=f4e826] |
| CA4580 checkbox (3rd) | click | role=checkbox | `.nth(2)` (within dialog) | ✅ | [ref=f4e838] |
| CA4608 checkbox (4th) | click | role=checkbox | `.nth(3)` (within dialog) | ✅ | [ref=f4e849] |
| CA4656 checkbox (5th) | click | role=checkbox | `.nth(4)` (within dialog) | ✅ | [ref=f4e860] |
| Button "Xác nhận" | click | role=button | `{ name: 'Xác nhận' }` | ✅ | [ref=f4e866] |
| Button "Close" (X) | click | role=button | `{ name: 'Close' }` | ✅ | VR-001 confirmed |

> ⚠️ **Locator note**: Playwright MCP resolve checkbox refs thành `getByRole('checkbox').nth(N)` page-wide.
> Khi modal mở, nth() đếm từ toàn page (bao gồm "Tôi muốn nhận hóa đơn" checkboxes ngoài modal).
> Để implement-automation an toàn: **scope checkbox lookup vào dialog** — `dialog.getByRole('checkbox').nth(N)`.

### Address Form (khi tick "Tôi muốn nhận hóa đơn")

| Element | Action | Locator Strategy | Locator Value | Verified | MCP call ref |
|---------|--------|-----------------|---------------|----------|--------------|
| Checkbox "Tôi muốn nhận hóa đơn" | click | role=checkbox | `{ name: /Tôi muốn nhận hóa đơn/ }` | ✅ | [ref=f4e31] |
| Button "Chọn tỉnh thành phố" | click | role=button | `{ name: 'Chọn tỉnh thành phố' }` | ✅ | [ref=f4e131] |
| Dropdown option tỉnh | click | paragraph in dialog | e.g. `"Hà Nội"` | ✅ | [ref=f4e157] |
| Button "Chọn phường/xã" | click | role=button | `{ name: 'Chọn phường/xã' }` | ✅ | [ref=f4e196] |
| Dropdown option phường | click | paragraph in dialog | e.g. `"Phường Cầu Giấy"` | ✅ | [ref=f4e223] |
| Button "Chọn tên đường" | click | role=button | `{ name: 'Chọn tên đường' }` | ✅ | [ref=f4e203] |
| Dropdown option đường | click | paragraph in dialog | e.g. `"Phạm Văn Bạch"` | ✅ | [ref=f4e385] |

### Form Thông tin cá nhân

| Element | Action | Locator Strategy | Locator Value | Verified |
|---------|--------|-----------------|---------------|----------|
| Textbox SĐT | type | role=textbox | `{ name: 'Số điện thoại*' }` | ✅ |

---

## Navigation Flow (VR-002)

| From | Trigger | To | Verified by |
|------|---------|-----|------------|
| tongdaiwifi.vn product page | click "Mua ngay" | checkout/{orderId}/payment | TC_02.1 setup |
| checkout/payment (no location) | select Hà Nội/Cầu Giấy/Phạm Văn Bạch | /voucher/list re-fetch → 5 EVC | TC_02.1 step 3 |

---

## EVC Discount Map (API verified)

| Voucher Code | API Normalized Code | discount_value | Note |
|---|---|---|---|
| CA4699GIAM10KPHIHOAMANG | CA4699GIAM10KPHIHOAMANG | 10.000đ | Auto-applied (highest) |
| CA4431GIAMTTUFSA03 | CA4431GIAMTTUFSA03 | 5.000đ | VR-001 confirmed |
| CA4580GIAMTTUFSA03 | CA4580GIAMTTUFSA03 | 5.000đ | VR-002 confirmed |
| CA4608GIAMTTUFSA522 | **CA4580GIAMTTUFSA03** | 5.000đ | Server-side alias |
| CA4656GIAMUTFSANHHCM1 | **CA4580GIAMTTUFSA03** | 5.000đ | Server-side alias |
