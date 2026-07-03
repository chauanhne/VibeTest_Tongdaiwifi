# Vibe Test Report — VR-004 — v1.2 — 2026-07-02

> Platform: Web (Playwright MCP)
> Environment: STG — https://staging.tongdaiwifi.vn → staging.fpt.vn/checkout
> QC: anhdc4
> Scope: Retest có mục tiêu — nhóm `hasManualVoucher` (TC_02.3/4/5/13/14/16/20/21) + voucher PTTT-specific (TC_02.11/24) + context switch địa chỉ (TC_02.2) + Recheck khi bấm Thanh toán thật (TC_02.6), dựa trên clarification + test data từ dev (2026-07-02)
> Checkout orders: 0000JB7ZXPVK, 0000JB82OMGW, 0000JB8KK0CG (**đơn hàng thật đã tạo thành công** — xem cảnh báo bên dưới)

> ⚠️ **Lưu ý quan trọng:** Session 3 (order `0000JB8KK0CG`) đã đi hết flow thanh toán thật qua cổng FoxPay/Napas (thẻ test 9704000000000018, OTP `otp` do dev cung cấp) và **tạo thành công 1 đơn hàng thật** trên STG — mã đơn `0000JB8KK0CG`, khách hàng test "Nguyen Van A" / SĐT 0912345678 / email nguyenvana@test.com. Cần lưu ý nếu STG có đồng bộ dữ liệu xuống hệ thống khác (CRM, billing...).

---

## Business rule clarification (input từ dev, áp dụng cho run này)

> **`hasManualVoucher`**: Flag trong Checkout model. `true` khi có ít nhất 1 voucher mà **user tự tay tác động vào** (chọn/apply qua modal hoặc nhập mã) → chuyển sang **mode Manual**. CO dùng flag này quyết định có tiếp tục auto-apply hay không.

**API-level xác nhận (mới phát hiện trong VR-004):**
- Request auto-apply lúc load trang: `{"vouchers":[],"mode":"Auto"}` — backend tự chọn
- Request sau khi user bấm "Xác nhận" trong modal (bất kỳ lựa chọn nào): `{"vouchers":[...],"mode":"Manual"}` — kể cả khi user chỉ "confirm lại" voucher đang auto-apply, một khi đã qua modal Xác nhận thì request luôn là `mode=Manual`
- → Field `mode` trong request `/voucher/apply` chính là cách xác định hasManualVoucher trên FE

**Voucher test data mới (từ dev):** `CA4887GIAMTTUFSA03MOMO` — voucher ràng buộc PTTT=Ví MoMo, discount 5.000đ. Chỉ xuất hiện trong `/voucher/list` khi PTTT đang chọn = Momo.

---

## Summary

| Result | Count | TC IDs |
|--------|-------|--------|
| ✅ PASS (mới unblock trong VR-004) | 12 | TC_02.2, TC_02.3, TC_02.4, TC_02.5, TC_02.6, TC_02.11, TC_02.13, TC_02.14, TC_02.16, TC_02.20, TC_02.21, TC_02.24 |

→ Cộng dồn với VR-003 (14 PASS + 1 FAIL): **tổng 26 PASS / 1 FAIL / 7 BLOCKED / 2 PreBLOCKED / 4 N/A** trên 40 TC.

---

## ✅ TC_02.2 — Đổi context (chỉ voucher auto) → remove voucher cũ + apply best mới — PASS

**Steps:** Fresh checkout (context 1 = mặc định, 5 EVC, CA4699 auto-apply, `mode=Auto`). Đổi địa chỉ sang **An Giang / Phường Châu Đốc / Kênh Hòa Bình** (context 2, chưa từng manual confirm nên vẫn ở mode Auto).
**Kết quả:** Badge đổi 5→4 (danh sách EVC context 2 chỉ còn 4 mã — mất `CA4656GIAMUTFSANHHCM1` vì mã này ràng buộc địa chỉ Hà Nội/HCM). CO **tự động gọi lại `/voucher/apply` với `mode=Auto`, vouchers=[]** — cơ chế "remove voucher cũ + tự tìm best mới" được xác nhận qua network, dù trong case này best voucher vẫn là CA4699 (10.000đ, cao nhất ở cả 2 context).
**API evidence:** request #104 `{"vouchers":[],"mode":"Auto"}` — tự động trigger ngay sau khi đổi tỉnh/phường, không cần user thao tác gì thêm với voucher.
**Screenshot:** `TC02-02_PASS_context-switch-autoapply-reruns.png`

## ✅ TC_02.6 — Recheck lúc Thanh toán hợp lệ (result=1) → tạo order thành công — PASS

**Steps (từ context TC_02.2, order `0000JB8KK0CG`, voucher CA4699 -10.000đ đang áp, Cần thanh toán = 29.900đ):**
1. Điền Thông tin cá nhân: SĐT 0912345678, Họ tên "Nguyen Van A", Email nguyenvana@test.com, Số nhà 123 (địa chỉ An Giang/Châu Đốc/Kênh Hòa Bình đã có sẵn)
2. PTTT = Thẻ ATM (đã chọn sẵn mặc định)
3. Bấm "Thanh toán" → redirect sang cổng FoxPay (`portal-v2-staging.foxpay.vn`)
4. Điền thẻ test: Số thẻ `9704000000000018` (auto-detect SaigonBank), Tên "NGUYEN VAN A", Ngày hiệu lực `03/07`
5. Bấm "Thanh toán 29.900 VNĐ" → dialog OTP (Napas) xuất hiện
6. Nhập OTP `otp` → bấm "Tiếp tục"

**Kết quả:** Dialog hiện "Giao dịch thành công." → bấm "Đóng" → redirect về `staging.fpt.vn/checkout/0000JB8KK0CG/completed` — trang "Hoàn tất đơn hàng" / "Thanh toán thành công" hiển thị đầy đủ: mã đơn `0000JB8KK0CG`, voucher CA4699GIAM10KPHIHOAMANG (-10.000đ) giữ nguyên trong đơn, Tổng thanh toán 29.900đ khớp chính xác.
**API evidence:** `POST /checkout/complete` (request #107) → `POST /checkout/payment/callback` (request #206) trả `{"success":true,"data":true}` — không có `voucher_warning`, khớp Recheck result=1 (hợp lệ).
**Screenshot:** `TC02-06_PASS_order-completed.png` (full page)

---

## ✅ TC_02.3 — Giữ voucher còn valid sau khi đổi context (hasManualVoucher=true) — PASS

**Steps:** Manually chọn CA4431 qua modal (uncheck CA4699 auto, check CA4431, Xác nhận) → `mode=Manual` xác nhận. Đổi PTTT sang Ví MoMo (context change).
**Kết quả:** CA4431 vẫn giữ nguyên trạng thái áp dụng, "Cần thanh toán" không đổi = 34.900đ. Badge tăng 5→6 (CA4887 mới xuất hiện do PTTT=Momo) nhưng KHÔNG ảnh hưởng voucher đang áp.
**Screenshot:** `TC02-13_05_11_PASS_momo-context-no-autoapply.png`

## ✅ TC_02.5 / TC_02.13 — Đổi context khi chỉ còn manual → KHÔNG auto-apply mới — PASS

Cùng bước với TC_02.3 (cùng evidence): sau khi đổi PTTT, CO **không** tự tìm/áp voucher mới (dù badge cho biết có 6 EVC khả dụng, bao gồm CA4887 mới). Network: `/voucher/list` được gọi lại (refresh danh sách) nhưng **không có** `/voucher/apply` mới tự động.

## ✅ TC_02.11 — Lọc voucher theo điều kiện PTTT — PASS

**Steps:** PTTT=Thẻ ATM → badge "5", danh sách không có CA4887. Đổi PTTT=Ví MoMo → badge "6", `/voucher/list` response có thêm `CA4887GIAMTTUFSA03MOMO` (discount 5.000đ).
**Evidence:** response request #104 — data[] có 6 items khi PTTT=Momo, 5 items khi PTTT khác.

## ✅ TC_02.24 — Voucher đã áp không còn thỏa điều kiện (đổi PTTT) → tự xóa + thông báo — PASS

**Steps:** Apply CA4887 (khi PTTT=Momo, single-select sạch không stack) → Cần thanh toán 34.900đ, message "Áp dụng ưu đãi mới thành công...". Đổi PTTT về Thẻ ATM.
**Kết quả:** CA4887 **tự động bị xóa**, "Cần thanh toán" reset về 39.900đ (giá gốc), badge 6→5. Message hiển thị: **"Ưu đãi đã chọn không đủ điều kiện áp dụng, vui lòng kiểm tra lại."**
**API evidence (discovery mới — cơ chế Recheck):** `POST /checkout/payment` (request #108) trả về:
```json
"voucher_warning": {
  "code": "VOUCHER_WARNING_CONTEXT_CHANGED",
  "message": "Ưu đãi đã áp dụng không còn hợp lệ với thông tin vừa thay đổi.",
  "details": [{"voucher_code": "CA4887GIAMTTUFSA03MOMO", "message": "Phiếu mua hàng bạn chọn CA4887GIAMTTUFSA03MOMO đã hết hiệu lực. Vui lòng liên hệ quản lý chi nhánh."}]
}
```
→ **`/checkout/payment` chính là API Recheck** nhắc tới trong TC_02.6/18/22/25 — quan trọng cho retest nhóm Recheck sau này.
**Screenshot:** `TC02-24_20_PASS_momo-voucher-auto-removed.png`

## ✅ TC_02.20 / TC_02.21 — Remove voucher invalid sau đổi context + thông báo tiếng Việt (kể cả voucher manual) — PASS

Cùng evidence với TC_02.24 — CA4887 là voucher **manual** (user tự chọn qua modal, mode=Manual) bị remove tự động kèm thông báo tiếng Việt chính xác khi context (PTTT) đổi khiến nó không còn hợp lệ. Khớp cả 2 TC (TC_02.20 tổng quát + TC_02.21 riêng trường hợp manual).

## ✅ TC_02.14 — Không auto-apply voucher mới thay thế voucher bị remove — PASS

Sau khi CA4887 bị auto-remove (TC_02.24), dù CA4699 (10.000đ, cao nhất) đang khả dụng lại (PTTT=ATM), CO **không** tự động áp CA4699 thay thế. "Cần thanh toán" giữ nguyên giá gốc 39.900đ.

## ✅ TC_02.4 — User bỏ voucher manual → giữ voucher auto, cập nhật hasManualVoucher — PASS

**Steps:** Fresh session (auto-apply CA4699 khi load) → mở modal, **thêm** CA4431 mà KHÔNG bỏ CA4699 (tạo state 2 voucher — do BUG-001 nên cả 2 active, 24.900đ) → mở lại modal, uncheck CA4431 (giữ CA4699), Xác nhận.
**Kết quả:** CA4431 bị bỏ, **CA4699 (voucher gốc auto) vẫn giữ nguyên**, "Cần thanh toán" = 29.900đ.
**API evidence:** Request cuối `{"vouchers":[{"voucher_code":"CA4699GIAM10KPHIHOAMANG",...}],"mode":"Manual"}` — xác nhận field `mode` chuyển hẳn sang "Manual" dù voucher còn lại vốn là voucher auto ban đầu.
**Screenshot:** `TC02-04_PASS_remove-manual-keep-auto.png`

## ✅ TC_02.16 — Sau khi user chủ động bỏ voucher + đổi context → KHÔNG auto-apply — PASS

**Steps:** Từ state TC_02.4 (chỉ còn CA4699), mở modal bỏ nốt CA4699 (Cần thanh toán = 39.900đ) → đổi PTTT sang Ví MoMo.
**Kết quả:** Badge tăng 5→6 (CA4887 xuất hiện) nhưng **Cần thanh toán vẫn 39.900đ** — CO không tự áp lại bất kỳ voucher nào dù account có 6 EVC khả dụng.
**Screenshot:** `TC02-16_PASS_no-reapply-after-remove-and-context-change.png`

---

## Vẫn còn BLOCKED (9 TC, sau khi trừ 10 TC unblock trong VR-004)

| TC ID | Lý do còn thiếu |
|-------|------------------|
| TC_02.18, 22, 25 | Recheck result=0/-1/hết quota lúc bấm "Thanh toán" — đã xác nhận path thanh toán thật hoạt động tốt (qua TC_02.6, result=1) nhưng chưa có voucher/tài khoản biết trước sẽ trigger fail case cụ thể. User xác nhận có thể để BLOCKED. |
| TC_02.7 | Chưa tìm entry point màn "Chi tiết Ưu đãi" |
| TC_02.19, 23 | Cần EVC invalid/hết quota cụ thể |
| TC_02.29 | Cần tài khoản có voucher loại "Mã giảm giá" (tab thứ 2) |

---

## Locator/API discoveries mới (VR-004)

- **`mode` field trong `/voucher/apply` request** = cơ chế xác định hasManualVoucher: `"Auto"` (empty vouchers, backend tự chọn) vs `"Manual"` (user chọn qua modal, luôn kèm khi bấm "Xác nhận")
- **`/checkout/payment` endpoint** = cơ chế Recheck, trả `voucher_warning.code=VOUCHER_WARNING_CONTEXT_CHANGED` khi voucher không còn hợp lệ sau context change — quan trọng cho TC_02.18/22/25
- **`CA4887GIAMTTUFSA03MOMO`** — voucher PTTT=Momo only, discount 5.000đ, chỉ xuất hiện trong `/voucher/list` khi PTTT=Ví MoMo
- **`An Giang / Phường Châu Đốc / Kênh Hòa Bình`** — địa chỉ context 2, có 4 EVC (thiếu CA4656 so với Hà Nội/Cầu Giấy — mã này ràng buộc HN/HCM)
- **Full payment flow (FoxPay/Napas gateway)** locator + steps đã verify (xem `vibe-locators.md`) — dùng được cho implement-automation nhóm order-completion
- **Test card:** 9704000000000018 (SaigonBank, Napas domestic) / OTP `otp` trên môi trường STG — chỉ dùng cho STG, KHÔNG dùng trên production

---

## Recommendation

| Action | TCs | Priority |
|--------|-----|---------|
| Automate ngay — 12 TC mới PASS, locator + API evidence đầy đủ (bao gồm cả full payment flow) | TC_02.2,3,4,5,6,11,13,14,16,20,21,24 | 🟢 Sẵn sàng |
| Để BLOCKED theo quyết định user — cần voucher/tài khoản đặc thù để trigger fail case | TC_02.18,22,25 (Recheck result=0/-1/quota), TC_02.19/23 (EVC invalid/hết quota), TC_02.29 (voucher loại 2) | ⚪ Blocked (accepted) |
| Cần clarify flow | TC_02.7 (Chi tiết Ưu đãi entry point) | 🟠 |
