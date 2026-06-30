# Vibe Test Report — VR-002 — v1.2 — 2026-06-30

> Platform: Web (Playwright MCP)
> Environment: STG — https://staging.tongdaiwifi.vn → staging.fpt.vn/checkout
> QC: anhdc4
> Scope: Retest TC_02.1 (PARTIAL từ VR-001) + TC_02.12 (FAIL từ VR-001)
> Checkout order: 0000J93TFD8G/payment
> Location setup: Hà Nội / Phường Cầu Giấy / Phạm Văn Bạch

---

## Summary

| Result | Count | TC IDs |
|--------|-------|--------|
| ✅ PASS (upgraded từ PARTIAL) | 1 | TC_02.1 |
| ❌ FAIL (confirmed) | 1 | TC_02.12 |

---

## ✅ TC_02.1 — Auto-apply voucher có DiscountVAT cao nhất — **PASS** (upgraded từ ⚠️ PARTIAL)

### Điều kiện setup (VR-002 discovery)
EVC context phụ thuộc **location**, không phải SĐT.
- Location có EVC: **Hà Nội / Phường Cầu Giấy / Phạm Văn Bạch** → 5 EVC, auto-apply CA4699
- Location không có EVC: HCM / Phường Test / Đường Test → 0 EVC (TC_02.17, VR-001)

### Kết quả thực thi

| # | Step | Result | Evidence |
|---|------|--------|---------|
| 1 | Truy cập checkout, nhập SĐT 0343439724 | ✅ | — |
| 2 | Tick "Tôi muốn nhận hóa đơn" → mở form địa chỉ | ✅ | — |
| 3 | Chọn Hà Nội / Phường Cầu Giấy / Phạm Văn Bạch | ✅ | — |
| 4 | /voucher/list re-fetch → 5 EVC, badge "5" hiển thị | ✅ | `TC02-01_auto-apply-triggered.png` |
| 5 | Auto-apply CA4699GIAM10KPHIHOAMANG = -10.000đ | ✅ | API response req#49: discount_value=10000 |
| E1 | Cần thanh toán = 29.900đ (39.900 - 10.000) | ✅ | Screenshot + snapshot |

### Verify "highest DiscountVAT" — API evidence

| Voucher Code | API Resolved To | discount_value | Kết luận |
|---|---|---|---|
| CA4699GIAM10KPHIHOAMANG | CA4699 | **10.000đ** | ✅ AUTO-APPLIED (highest) |
| CA4431GIAMTTUFSA03 | CA4431 | 5.000đ | < CA4699 ✅ |
| CA4580GIAMTTUFSA03 | CA4580 | 5.000đ | < CA4699 ✅ |
| CA4608GIAMTTUFSA522 | **CA4580** (alias) | 5.000đ | < CA4699 ✅ |
| CA4656GIAMUTFSANHHCM1 | **CA4580** (alias) | 5.000đ | < CA4699 ✅ |

> **TC_02.1: ✅ PASS** — CA4699 (10.000đ) là cao nhất trong 5 EVC. Auto-apply chọn đúng theo spec.

### Side finding: CA4608 và CA4656 là server-side alias của CA4580
- Request gửi CA4608 → API trả CA4580 (discount 5.000đ)
- Request gửi CA4656 → API trả CA4580 (discount 5.000đ)
- UI hiển thị code theo API response (CA4580), không phải code user chọn → đây là behavior đúng, không phải bug

---

## ❌ TC_02.12 — Chỉ apply đúng 1 voucher, không stack — **FAIL (confirmed)**

### Bước tái hiện

| # | Step | Result |
|---|------|--------|
| 1 | Mở modal "Chọn ưu đãi" | ✅ Modal mở |
| 2 | Check CA4699 (không bỏ chọn CA4431) | ✅ Cả 2 checked: CA4699 [ref=f4e815] + CA4431 [ref=f4e826] |
| 3 | Click "Xác nhận" | Request #58 gửi 2 voucher codes |
| E1 | CO chỉ áp đúng 1 voucher | ❌ FAIL — Request body: `[CA4699, CA4431]` = 2 codes |

### Network Evidence (request #58)

**Request body:**
```json
{"vouchers":[
  {"voucher_code":"CA4699GIAM10KPHIHOAMANG","voucher_type":"General"},
  {"voucher_code":"CA4431GIAMTTUFSA03","voucher_type":"General"}
],"mode":"Manual"}
```

**Response:**
```json
{"success":false,"error":{"code":"CHECKOUT_TOKEN_REQUIRED","message":"X-Checkout-Token header is required."}}
```

### Phân tích

- **Frontend bug confirmed**: UI vẫn cho phép chọn multi-checkbox → request body chứa 2 voucher codes. Behavior giống hệt VR-001.
- **API error khác VR-001**: Lần này `/voucher/apply` trả `CHECKOUT_TOKEN_REQUIRED` (session guest không có auth token) → stacking không hoàn tất trên UI
- **Nhưng bug vẫn là bug**: Frontend không có validation ngăn multi-select. Nếu session có token hợp lệ (như VR-001) → stacking xảy ra.
- **Severity**: High — giống VR-001, business rule vi phạm nếu session authenticated

**Screenshot:** `TC02-12_stacking-retest.png`, `TC02-12_multi-select-request-body.png`

---

## Discoveries mới (không có trong VR-001)

### 1. Location là key cho EVC context
- Voucher availability **phụ thuộc location** (tỉnh/phường/đường), không phải SĐT
- Cần tick "Tôi muốn nhận hóa đơn" → mở address form → chọn địa chỉ → trigger /voucher/list re-fetch
- Confirmed location có EVC: **Hà Nội / Phường Cầu Giấy / Phạm Văn Bạch**

### 2. CA4608 và CA4656 là alias server-side của CA4580
- Cả 3 cùng promotion "Giảm TT UF SA", discount_value = 5.000đ
- API normalize về CA4580 khi apply CA4608 hoặc CA4656

### 3. Locator mới confirmed
- Badge count trên "Chọn ưu đãi": `generic "5"` bên trong button
- Applied voucher code + amount: paragraphs trong region "Thông tin thanh toán"
- Checkbox trong modal: nth(0)=CA4699, nth(1)=CA4431, nth(2)=CA4580, nth(3)=CA4608, nth(4)=CA4656

---

## Recommendation

| Action | TC | Priority |
|--------|----|---------|
| Bug BUG-001 vẫn tồn tại ở frontend layer — assign dev fix UI multi-select prevention | TC_02.12 | 🔴 High |
| Cập nhật TC precondition: thêm bước setup location | TC_02.1 | 🟡 Update TC |
| Investigate CA4608/CA4656 alias behavior — intentional hay data issue? | Side finding | 🟠 Clarify BA |
