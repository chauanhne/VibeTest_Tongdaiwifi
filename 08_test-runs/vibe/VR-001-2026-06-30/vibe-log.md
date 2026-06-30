# Vibe Test Log — VR-001 — v1.2 — 2026-06-30

> Platform: Web (Playwright MCP)
> Env: STG — https://staging.fpt.vn/checkout/0000J8NENJ1C/payment
> QC: anhdc4

---

## TC_02.1 — Auto-apply voucher có DiscountVAT cao nhất (High)

**Pre-condition:** KH đã login; checkout context đầy đủ; chưa có voucher; tài khoản có ≥2 EVC hợp lệ khác DiscountVAT

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Truy cập URL màn Thanh toán | navigate → staging.fpt.vn/checkout/.../payment | ✅ PASS | Từ product page click "Mua ngay" |
| 2 | Chờ màn tải xong, không thao tác | wait | ✅ PASS | Trang load OK |
| 3 | Quan sát block Voucher | snapshot | ⚠️ PARTIAL | CA4699GIAM10KPHIHOAMANG tự áp (-10.000đ); Cần thanh toán 29.900đ |
| E1 | CO tự áp 1 EVC có DiscountVAT cao nhất | verify | ⚠️ PARTIAL | Auto-apply xảy ra ✅; -10.000đ hiển thị ✅; nhưng không verify được "cao nhất" vì các voucher còn lại không hiện discount amount trực tiếp |

**Result: ⚠️ PARTIAL** — Auto-apply có xảy ra. CA4699 = -10.000đ > CA4431 = -5.000đ (verify được 2/5). Cần test data với DiscountVAT rõ ràng để confirm đầy đủ.
**Screenshot:** `checkout_initial-state.png`

---

## TC_02.8 — Chọn EVC hợp lệ + 'Đồng ý' → cập nhật giá (High)

**Pre-condition (NOT MET):** "checkout chưa áp voucher" — nhưng CA4699 đã auto-apply

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Chọn 1 EVC hợp lệ (click radio/checkbox) | click CA4431GIAMTTUFSA03 | ✅ PASS | Checkbox checked |
| 2 | Bấm 'Đồng ý'/'Xác nhận' | click Xác nhận | ✅ PASS | Modal đóng |
| 3 | Chờ loading | — | ✅ PASS | Không có spinner rõ ràng |
| 4 | Quan sát màn Thanh toán sau popup đóng | snapshot | ❌ PARTIAL FAIL | CA4431 -5.000đ THÊM VÀO (không thay thế) CA4699 -10.000đ → cả 2 cùng active; Cần thanh toán 24.900đ (2 voucher stack) |

**Result: ❌ PARTIAL** — Precondition không đúng (đã có voucher auto-applied trước). Phát hiện bug tiềm năng: 2 vouchers stack thay vì 1.
**Screenshot:** `TC02-12_bug_2voucher-stacked.png`

---

## TC_02.9 — Hủy EVC đang áp (uncheck + Đồng ý) → reset giá gốc (High)

**Pre-condition:** Đã apply 2 EVC (CA4699 + CA4431); Cần thanh toán 24.900đ

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Mở lại popup danh sách EVC | click "Chọn ưu đãi" | ✅ PASS | Modal mở, cả 2 checked |
| 2 | Bỏ chọn CA4699 (uncheck) | click checkbox [ref=e212] | ✅ PASS | Unchecked |
| 3 | Bỏ chọn CA4431 (uncheck) | click checkbox [ref=e223] | ✅ PASS | Unchecked |
| 4 | Bấm 'Đồng ý' xác nhận hủy | click Xác nhận | ✅ PASS | Modal đóng |
| E1 | Popup đóng | verify | ✅ PASS | Không còn dialog |
| E2 | Cần thanh toán = giá gốc | verify | ✅ PASS | 39.900đ ✅ |
| E3 | Số tiền giảm về 0/biến mất | verify | ✅ PASS | Không còn voucher code hiển thị |
| E4 | EVC không còn 'đang áp dụng' | verify | ✅ PASS | Không còn CA4699/CA4431 trong section |
| E5 | Không error | verify | ✅ PASS | Trang hoạt động bình thường |

**Result: ✅ PASS**
**Screenshot:** `TC02-09_PASS_voucher-removed-gia-goc.png`
**Locators captured:** button Xác nhận, checkbox items trong modal

---

## TC_02.10 — Block CTKM hiển thị count EVC khả dụng khi load (Medium)

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Truy cập màn Thanh toán | navigate | ✅ PASS | — |
| 2 | Chờ tải xong, không thao tác | wait | ✅ PASS | — |
| 3 | Quan sát khu vực block CTKM/Ưu đãi | snapshot | ✅ PASS | Badge "5" hiển thị trên "Chọn ưu đãi" ngay khi load |
| E1 | Block hiển thị số EVC khả dụng (> 0) | verify | ✅ PASS | Badge = 5 > 0 ✅ |

**Result: ✅ PASS**

---

## TC_02.11 — Lọc voucher theo điều kiện PTTT (Medium)

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Chọn PTTT = Ví MoMo | click radio Ví MoMo | ✅ PASS | PTTT changed |
| 2 | Mở 'Chọn ưu đãi' | click button | ✅ PASS | Modal mở |
| 3 | Quan sát danh sách voucher | snapshot | 🚫 BLOCKED | Vẫn 5 vouchers — không có voucher PTTT-conditional trong account này |

**Result: 🚫 BLOCKED** — Precondition không đủ: cần account có voucher phân theo Momo/COD/chu kỳ. Tất cả 5 EVC hiện tại không phân biệt PTTT.

---

## TC_02.12 — Chỉ apply đúng 1 voucher, không stack (Medium)

> Phát hiện qua TC_02.8 side-effect

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Truy cập màn Thanh toán | navigate | ✅ PASS | Auto-apply CA4699 |
| 2 | Chờ auto-apply | wait | ✅ PASS | 1 voucher applied |
| 3 | Mở modal → chọn thêm CA4431 → Xác nhận | click + confirm | ❌ FAIL | Cả 2 vouchers apply cùng lúc: CA4699 -10.000đ + CA4431 -5.000đ = -15.000đ total; Cần thanh toán 24.900đ |
| E1 | CO chỉ áp đúng 1 voucher | verify | ❌ FAIL | 2 vouchers đồng thời active |
| E2 | Không cộng dồn discount | verify | ❌ FAIL | Stack rõ ràng: 39.900 - 10.000 - 5.000 = 24.900 |

**Result: ❌ FAIL — BUG tiềm năng: hệ thống cho phép stack 2 EVC**
**Screenshot:** `TC02-12_bug_2voucher-stacked.png`
**Bug severity:** High (vi phạm business rule no-stacking)

---

## TC_02.26 — [Pre-BLOCKED] field source='auto'

**Result: 🚫 BLOCKED** — Marked trong TC gốc [C-VOU-006]. Chờ Dev xác nhận schema.

---

## TC_02.28 — Trang Checkout hiển thị section 'Chọn ưu đãi' (High)

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Truy cập Checkout đầy đủ | navigate | ✅ PASS | — |
| 2 | Quan sát section 'Thông tin thanh toán' | snapshot | ✅ PASS | Section hiển thị |
| 3 | Ghi nhận trạng thái khu vực voucher | verify | ✅ PASS | 'Chọn ưu đãi' hiện với badge 5; 'Áp dụng' disabled; textbox "Nhập mã khuyến mãi" |
| E1 | Button 'Chọn ưu đãi' hiện | verify | ✅ PASS | ref=e83 ✅ |
| E2 | 'Áp dụng' disabled | verify | ✅ PASS | button [disabled] ✅ |
| E3 | Không hiện voucher/discount (khi chưa áp) | verify | ✅ PASS | Sau remove cả 2 vouchers → section trống ✅ |
| E4 | 'Cần thanh toán' = giá gốc | verify | ✅ PASS | 39.900đ ✅ |

**Result: ✅ PASS**

---

## TC_02.29 — Modal 'Chọn ưu đãi' có 2 tab (High)

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Click 'Chọn ưu đãi' | click | ✅ PASS | Modal mở |
| 2 | Quan sát cấu trúc tổng thể modal | snapshot | ❌ FAIL | Chỉ có 1 section "Ưu đãi" — KHÔNG có tab "Mã giảm giá" |
| 3 | Click tab 'Mã giảm giá' | — | 🚫 KHÔNG TÌM THẤY | Tab không tồn tại trong UI |
| 4 | Click tab 'Ưu đãi' | — | ⚠️ Có nhưng không phải tab | Chỉ là paragraph label |
| E1 | Modal title 'Chọn ưu đãi' + nút X | verify | ✅ PASS | heading + button Close ✅ |
| E2 | Nút 'Xác nhận' cuối modal | verify | ✅ PASS | button Xác nhận ✅ |
| E3 | Tab 'Mã giảm giá' + list voucher | verify | ❌ FAIL | Không có tab này |
| E4 | Tab 'Ưu đãi' + list ưu đãi | verify | ⚠️ PARTIAL | Có section "Ưu đãi" nhưng không phải dạng tab |

**Result: ❌ FAIL hoặc 🚫 BLOCKED** — Cần clarify: nếu account có cả 2 loại voucher thì tab "Mã giảm giá" có xuất hiện không? Precondition TC yêu cầu "Account có voucher cả 2 loại".
**Screenshot:** `TC02-29_modal-chon-uu-dai.png`

---

## TC_02.36 — Đóng popup EVC (X) không thay đổi state checkout (Medium)

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| **Scenario A: chưa apply** | | | | |
| 1 | Mở popup (không apply gì) | click Chọn ưu đãi | ✅ PASS | — |
| 2 | Bấm nút X | click Close | ✅ PASS | Modal đóng |
| E1 | Giá gốc giữ nguyên | verify | ✅ PASS | 39.900đ ✅ |
| **Scenario B: đã apply CA4699** | | | | |
| 1 | Apply CA4699 → mở popup lại | click confirm | ✅ PASS | -10.000đ applied |
| 2 | Đóng X ngay (không thay đổi) | click Close | ✅ PASS | Modal đóng |
| E1 | CA4699 vẫn áp | verify | ✅ PASS | CA4699GIAM10KPHIHOAMANG + -10.000đ vẫn hiển thị |
| E2 | Cần thanh toán = 29.900đ | verify | ✅ PASS | 29.900đ ✅ |

**Result: ✅ PASS** (cả 2 scenarios)

---

## TC_02.38 — Badge số EVC khả dụng hiển thị đúng (Low)

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Quan sát nút 'Chọn ưu đãi' | snapshot | ✅ PASS | Badge hiển thị "5" |
| 2 | Kiểm số badge | verify | ✅ PASS | Badge = 5; modal confirm 5 vouchers trong list |

**Result: ✅ PASS**

---

## TC_02.39 — [Pre-BLOCKED] Voucher card disabled/đã dùng/hết hạn

**Result: 🚫 BLOCKED** — Marked trong TC gốc [C-VOU-003]. UI state chưa thiết kế.

---

## TC_02.40 — Popup EVC mở từ cache, không gọi lại GetListEvoucher (Medium)

**[RETEST — fresh session — checkout/0000J8P6DNZ4]**

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Navigate product page → click Mua ngay (fresh session) | browser_navigate + click | ✅ PASS | New checkout URL: /0000J8P6DNZ4/payment |
| 2 | Xác nhận GetListEvoucher gọi 1 lần khi load trang | network monitor | ✅ PASS | Request #94: POST /voucher/list → 200 |
| 3 | Mở popup "Chọn ưu đãi" lần đầu | click Chọn ưu đãi | ✅ PASS | Modal mở, hiển thị 5 EVC |
| 4 | Quan sát Network sau khi mở modal | network monitor | ✅ PASS | Không có request /voucher/list mới — danh sách #94 vẫn là lần duy nhất |
| E1 | Modal EVC mở từ cache, không re-fetch | verify | ✅ PASS | Confirmed: 0 calls sau click modal lần đầu |

**Result: ✅ PASS** — Modal "Chọn ưu đãi" phục vụ danh sách EVC từ cache khi mở lần đầu, không gọi lại GetListEvoucher.
**Screenshot:** `TC02-40_PASS_modal-cache-no-refetch.png`
**Network evidence:** /voucher/list chỉ xuất hiện 1 lần (page load, req #94). Sau click modal → không có req mới.

> **Side observation:** Trong run này, `/voucher/apply` (req #95) trả về **504 Gateway Timeout** → auto-apply thất bại, giá hiển thị 39.900đ (giá gốc). Không phải scope TC_02.40 nhưng là dấu hiệu flaky ở STG.

---

## TC_02.17 — Không auto-apply khi KH không có EVC hợp lệ (High)

**Pre-condition:** Location không có EVC — Hồ Chí Minh / Phường Test Hồ Chí Minh / Đường Test
**Setup:** Checkout page → tick "Tôi muốn nhận hóa đơn" → điền địa chỉ trên → hệ thống re-fetch /voucher/list

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Truy cập checkout với location không có EVC | address form submit | ✅ PASS | POST /checkout/address → 200; trigger re-fetch /voucher/list |
| 2 | Chờ trang load | observe | ✅ PASS | Không có EVC auto-apply |
| 3 | Quan sát block Voucher | snapshot | ✅ PASS | "Chọn ưu đãi" không có badge; giá = 39.900đ (giá gốc) |
| 4 | Xác nhận không có lỗi | verify | ✅ PASS | Không có error message |
| E1 | Không auto-apply → giá gốc, không lỗi | verify | ✅ PASS | Behavior đúng spec |

**Result: ✅ PASS** — Giá gốc 39.900đ, không auto-apply EVC, không lỗi.
**Screenshot:** `TC02-17_no-evc-location-gia-goc.png`
**Network evidence:** POST /voucher/list (re-fetch sau address change) → trả về 0 EVC → không apply

---

## TC_02.37 — Block CTKM ẩn/disabled khi không có EVC hợp lệ (Medium)

**Pre-condition:** Cùng session với TC_02.17 — location không có EVC

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Quan sát block "Chọn ưu đãi" | snapshot | ✅ PASS | Không có badge số; button vẫn clickable |
| 2 | Click "Chọn ưu đãi" | click | ✅ PASS | Modal mở |
| 3 | Quan sát nội dung modal | snapshot | ✅ PASS | img "Không có ưu đãi" + paragraph "Rất tiếc, quý khách không có mã ưu đãi." |
| E1 | Modal hiển thị trạng thái trống đúng quy định | verify | ✅ PASS | Không crash; message thân thiện |

**Result: ✅ PASS** — Modal hiển thị "Rất tiếc, quý khách không có mã ưu đãi." khi không có EVC hợp lệ.
**Screenshot:** `TC02-17_37_modal-khong-co-uu-dai.png`

---

## TCs chưa test được (BLOCKED — precondition/test data)

| TC ID | Lý do BLOCKED |
|-------|---------------|
| TC_02.2 | Cần 2 account states: V1 best → V2 best sau đổi context |
| TC_02.3 | Cần hasManualVoucher=true state |
| TC_02.4 | Cần checkout có cả manual + auto voucher |
| TC_02.5 | Cần state chỉ còn manual (đã bỏ auto) |
| TC_02.6 | Cần Recheck result=1 — cần điền SĐT + submit |
| TC_02.7 | Cần màn Chi tiết Ưu đãi — không có "Điều kiện" link trên card |
| TC_02.13 | Cần hasManualVoucher=true |
| TC_02.14 | Cần state bị remove sau revalidate |
| TC_02.15 | Cần bỏ voucher auto rồi observe |
| TC_02.16 | Cần bỏ voucher + đổi context combo |
| TC_02.18 | Cần EVC kích hoạt Recheck=0/-1 |
| TC_02.19 | Cần context change → 0 EVC valid |
| TC_02.20 | Cần voucher invalid sau đổi context |
| TC_02.21 | Cần manual voucher invalid |
| TC_02.22 | Cần Recheck=-1 scenario |
| TC_02.23 | Cần EVC hết quota |
| TC_02.24 | Cần voucher PTTT-conditional (COD only) |
| TC_02.25 | Cần Recheck=0 khi bấm Thanh toán |
| TC_02.27 | Trang Cart không xuất hiện trong flow này |
| TC_02.29 | Cần mã voucher manual (tab "Mã giảm giá") |
| TC_02.30 | Voucher card thiếu link "Điều kiện" — không test được Chi tiết |
| TC_02.31 | Cần account không có voucher |
| TC_02.32 | Phụ thuộc link "Điều kiện" trên card |
| TC_02.33 | Cần mobile viewport ≤768px |
| TC_02.34 | Cần EVC có nút "Điều kiện" trên card |
| TC_02.35 | Cần EVC không có content |
