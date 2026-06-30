# Vibe Test Log — VR-002 — v1.2 — 2026-06-30

> Platform: Web (Playwright MCP)
> Env: STG — staging.fpt.vn/checkout/0000J93TFD8G/payment
> QC: anhdc4
> Scope: TC_02.1 retest (PARTIAL→PASS) + TC_02.12 retest (FAIL confirm)

---

## Setup — Location discovery

**Observation:** Checkout mới (0000J93TFD8G) ban đầu không có EVC vì là guest session, không có location context.

| # | Step | Result |
|---|------|--------|
| 1 | Navigate product page → click "Mua ngay" | ✅ → checkout 0000J93TFD8G |
| 2 | /voucher/list → 200 OK nhưng 0 EVC | ⚠️ Không có voucher |
| 3 | Modal "Chọn ưu đãi" → "Không có mã ưu đãi" | Screenshot: `checkout_initial_no-voucher.png` |
| 4 | Nhập SĐT 0343439724 + tick "Tôi muốn nhận hóa đơn" | ✅ Address form xuất hiện |
| 5 | Chọn Hà Nội / Phường Cầu Giấy / Phạm Văn Bạch | ✅ /voucher/list re-fetch |
| 6 | /voucher/list → 5 EVC; /voucher/apply → CA4699 auto-applied | ✅ |

---

## TC_02.1 — Auto-apply voucher có DiscountVAT cao nhất

**Pre-condition:** Location = Hà Nội / Phường Cầu Giấy / Phạm Văn Bạch (5 EVC available)

| # | Step | Action | Result |
|---|------|--------|--------|
| 1 | Quan sát block Voucher sau chọn location | snapshot | ✅ PASS: CA4699 auto-applied, badge "5", Cần thanh toán 29.900đ |
| 2 | Mở modal "Chọn ưu đãi" | click | ✅ 5 EVC list, CA4699 [checked] |
| 3 | Chụp modal với CA4699 checked | screenshot | `TC02-01_modal-5evc-CA4699-checked.png` |
| 4 | Verify discount CA4580 (manually select) | check CA4580 → Xác nhận | ✅ CA4580 = -5.000đ (34.900đ) |
| 5 | Verify CA4699 via API | network req#49 response | ✅ discount_value=10000 |
| 6 | Verify CA4608 via API | req#55 body=CA4608, response=CA4580, 5000đ | ✅ alias |
| 7 | Verify CA4656 via API | req#57 body=CA4656, response=CA4580, 5000đ | ✅ alias |
| E1 | CA4699 (10.000đ) > tất cả EVCs còn lại (5.000đ) | verify | ✅ PASS |

**Result: ✅ PASS** — Upgraded từ ⚠️ PARTIAL (VR-001)
**Screenshot:** `TC02-01_auto-apply-triggered.png`, `TC02-01_modal-5evc-CA4699-checked.png`

---

## TC_02.12 — Chỉ apply đúng 1 voucher, không stack

| # | Step | Action | Result |
|---|------|--------|--------|
| 1 | Mở modal "Chọn ưu đãi" | click | ✅ Modal mở |
| 2 | Check CA4699 [f4e815] | click checkbox | ✅ CA4699 checked |
| 3 | Check thêm CA4431 [f4e826] (giữ CA4699) | click checkbox | ✅ Cả 2 checked |
| 4 | Verify modal state | snapshot | CA4699 [checked] + CA4431 [checked] = 2 vouchers |
| 5 | Click "Xác nhận" | click | Request #58 gửi cả 2 codes |
| E1 | CO chỉ áp 1 voucher | verify | ❌ FAIL: request body = [CA4699, CA4431] |
| E2 | Không cộng dồn discount | verify | N/A — API trả CHECKOUT_TOKEN_REQUIRED (session không authenticated) |

**Result: ❌ FAIL** — Frontend bug confirmed: multi-select vẫn cho phép, 2 voucher codes gửi đồng thời.
API lần này trả error (CHECKOUT_TOKEN_REQUIRED) do guest session → stacking không hiển thị trên UI.
Nhưng bug logic tại frontend vẫn tồn tại, giống VR-001.

**Screenshots:** `TC02-12_stacking-retest.png`
**Network req#58 body:** `[CA4699GIAM10KPHIHOAMANG, CA4431GIAMTTUFSA03]`
