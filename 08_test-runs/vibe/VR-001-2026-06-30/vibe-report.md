# Vibe Test Report — VR-001 — v1.2 — 2026-06-30

> Platform: Web (Playwright MCP)
> Environment: STG — https://staging.tongdaiwifi.vn → redirect staging.fpt.vn/checkout
> QC: anhdc4
> Total TCs in scope: 40

---

## Summary

| Result | Count | % | TC IDs |
|--------|-------|---|--------|
| ✅ PASS | 9 | 22.5% | TC_02.9, TC_02.10, TC_02.17, TC_02.27, TC_02.28, TC_02.36, TC_02.37, TC_02.38, TC_02.40 |
| ❌ FAIL | 1 | 2.5% | TC_02.12 |
| ⚠️ PARTIAL | 1 | 2.5% | TC_02.1 (auto-apply partial) |
| 🚫 BLOCKED | 24 | 60% | TC_02.2–8, TC_02.11, TC_02.13–16, TC_02.18–26, TC_02.29, TC_02.31, TC_02.33 |
| N/A (BA xác nhận không test) | 4 | 10% | TC_02.30, TC_02.32, TC_02.34, TC_02.35 |
| Pre-BLOCKED (TC gốc) | 2 | 5% | TC_02.26, TC_02.39 |

> **Clarifications từ BA/Dev (2026-06-30):**
> - TC_02.27 "Cart page" = checkout page, textbox "Nhập mã khuyến mãi" → PASS (đã verify)
> - TC_02.29 tab "Mã giảm giá" chỉ xuất hiện khi apply voucher thủ công → cần mã voucher manual để retest
> - TC_02.30, 32, 34, 35 (link "Điều kiện") → N/A, bỏ qua block này

---

## 🔴 FAIL — BUG TIỀM NĂNG

### BUG-001: Voucher Stacking — TC_02.12 ❌ FAIL (High)

**Mô tả:** Hệ thống cho phép chọn và apply đồng thời nhiều EVC (stack vouchers), vi phạm business rule "chỉ 1 voucher tại một thời điểm".

**Bước tái hiện:**
1. Truy cập checkout (có 1 EVC auto-apply)
2. Mở modal "Chọn ưu đãi"
3. Check thêm 1 EVC thứ 2 (không bỏ chọn cái cũ)
4. Click "Xác nhận"

**Kết quả thực tế:**
- CA4699GIAM10KPHIHOAMANG: -10.000đ
- CA4431GIAMTTUFSA03: -5.000đ
- Cần thanh toán: 24.900đ (39.900 - 15.000 = 24.900) — cộng dồn cả 2

**Kết quả kỳ vọng:** Chỉ 1 EVC active, discount không stack

**Screenshot:** `TC02-12_bug_2voucher-stacked.png`
**Severity:** High
**Impact:** Financial loss — khách hàng có thể tận dụng để giảm giá nhiều hơn mức cho phép

---

## ✅ Passed TCs — Sẵn sàng implement automation

| TC ID | Nội dung | Locators captured | Screenshot |
|-------|----------|------------------|-----------|
| TC_02.9 | Hủy EVC → reset giá gốc | checkbox modal, button Xác nhận | `TC02-09_PASS_voucher-removed-gia-goc.png` |
| TC_02.10 | Badge count EVC khả dụng | generic[badge] trên Chọn ưu đãi | `checkout_initial-state.png` |
| TC_02.17 | Không auto-apply khi không có EVC (giá gốc 39.900đ) | address form, button Chọn ưu đãi, paragraph giá | `TC02-17_no-evc-location-gia-goc.png` |
| TC_02.27 | Cart page = checkout textbox "Nhập mã khuyến mãi" | textbox Nhập mã khuyến mãi | `checkout_initial-state.png` |
| TC_02.28 | Checkout section Chọn ưu đãi | textbox, button Chọn ưu đãi, button Áp dụng, paragraph giá | `checkout_initial-state.png` |
| TC_02.36 | Đóng popup X → state unchanged | button Close dialog | `TC02-09_PASS_voucher-removed-gia-goc.png` |
| TC_02.37 | Modal trống "Không có ưu đãi" khi không có EVC | dialog "Chọn ưu đãi", img "Không có ưu đãi", paragraph | `TC02-17_37_modal-khong-co-uu-dai.png` |
| TC_02.38 | Badge số EVC đúng | generic badge "5" | `checkout_initial-state.png` |
| TC_02.40 | Modal EVC mở từ cache, không re-fetch (fresh session) | network requests filter=voucher | `TC02-40_PASS_modal-cache-no-refetch.png` |

---

## 🚫 Blocked TCs — Cần setup test data / fix điều kiện

### Nhóm 1: Cần test account đặc thù
| TC ID | Cần gì |
|-------|--------|
| TC_02.31 | Account không có voucher |

> ✅ TC_02.17 và TC_02.37 đã được unblock và PASS (2026-06-30) bằng cách dùng location không có EVC: Hồ Chí Minh / Phường Test Hồ Chí Minh / Đường Test.

### Nhóm 2: Cần EVC có điều kiện cụ thể
| TC ID | Cần gì |
|-------|--------|
| TC_02.11 | EVC có điều kiện PTTT (Momo-only, COD-only) |
| TC_02.18 | EVC kích hoạt Recheck result=0 hoặc -1 |
| TC_02.23 | EVC hết quota |
| TC_02.24 | EVC điều kiện PTTT (để test auto-remove khi đổi PTTT) |
| TC_02.25 | EVC kích hoạt Recheck=0 khi bấm Thanh toán |

### Nhóm 3: Cần flow đặc thù / UI state
| TC ID | Cần gì |
|-------|--------|
| TC_02.27 | Cart page — không xuất hiện trong flow "Mua ngay" |
| TC_02.29 | Account có voucher loại "Mã giảm giá" (tab thứ 2) |
| TC_02.30 | Voucher card có link "Điều kiện" (không thấy trong current UI) |
| TC_02.32 | Link "Điều kiện" → màn Chi tiết |
| TC_02.33 | Mobile viewport ≤768px |
| TC_02.34 | EVC có nút "Điều kiện" + content1-6 |
| TC_02.35 | EVC có content1-6 rỗng |

### Nhóm 4: Business rule scenarios (cần state phức tạp)
| TC ID | Cần gì |
|-------|--------|
| TC_02.2 | Đổi context → best voucher thay đổi |
| TC_02.3 | hasManualVoucher=true + context valid |
| TC_02.4 | Checkout có cả manual + auto |
| TC_02.5 | Checkout chỉ còn manual (đã bỏ auto) |
| TC_02.6 | Recheck result=1 → submit order |
| TC_02.7 | Màn Chi tiết Ưu đãi → click "Sử dụng ưu đãi" |
| TC_02.13–16 | hasManualVoucher state combinations |
| TC_02.19–22 | Exception: remove invalid, recheck fail |

---

## ⚠️ Observations & Cần clarify

### 1. TC_02.1 — Auto-apply partial
Auto-apply XẢY RA khi load trang: CA4699 (-10.000đ) được tự áp trước khi user thao tác. Block voucher hiển thị mã + số tiền giảm. Cần thanh toán = 29.900đ.  
→ **Cần clarify:** test data yêu cầu DiscountVAT=300k vs 500k — khác với account hiện tại (-10.000đ).

### 2. TC_02.29 — Modal tabs
Hiện tại chỉ có 1 section "Ưu đãi", không có tab "Mã giảm giá".  
→ **Cần clarify:** Tab "Mã giảm giá" chỉ xuất hiện khi account có voucher loại đó không? Hay đây là FAIL?

### 3. TC_02.40 — Cache vs API call
POST /voucher/list được gọi 2 lần trong session: lần 1 (page load), lần 2 (sau khi đổi PTTT + mở modal). Không rõ lần 2 là do mở modal hay do PTTT change trigger re-fetch.  
→ **Cần retest:** Fresh session, load trang → mở modal lần đầu → check network xem có gọi lại không.

---

## Locator Coverage

| Page | Elements captured | Verified ✅ | Not found 🚫 |
|------|------------------|------------|-------------|
| Checkout /payment | 15+ | 12 | 0 |

**Key locators verified:**
- `textbox "Nhập mã khuyến mãi"` — manual input
- `text=Chọn ưu đãi` với badge — open modal trigger
- `button "Áp dụng" [disabled]` — confirm disabled state
- `button "Xác nhận"` — trong modal
- `button "Close"` / nút X — đóng modal
- `checkbox` items trong modal — voucher selection
- `paragraph "Cần thanh toán"` + price — giá verify
- Applied voucher code + discount amount paragraphs

→ **implement-automation** có thể dùng ngay cho 5 PASS TCs.

---

## Recommendation

| Action | TCs | Priority |
|--------|-----|---------|
| Log bug + assign dev | TC_02.12 (stacking) | 🔴 Ngay |
| Retest fresh session | TC_02.40 (cache) | 🟡 Sớm |
| Clarify với BA | TC_02.29 (2 tabs) | 🟡 Sớm |
| Setup test data | TC_02.11, 17, 18, 23, 24, 25, 31 | 🟠 Cần plan |
| Clarify Cart page URL | TC_02.27 | 🟠 Cần info |
| Clarify link "Điều kiện" | TC_02.30, 32, 34, 35 | 🟠 Cần info |
| Mobile device test | TC_02.33 | 🔵 Separate run |
| Complex state setup | TC_02.2–7, 13–16, 19–22 | 🔵 Cần test data script |
