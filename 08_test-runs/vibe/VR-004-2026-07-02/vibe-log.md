# Vibe Test Log — VR-004 — v1.2 — 2026-07-02

> Scope: hasManualVoucher combos + PTTT-specific voucher, dựa trên clarification business rule

## Session A — Order 0000JB7ZXPVK

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Fresh checkout, auto-apply CA4699 | navigate + click Mua ngay | ✅ | mode=Auto |
| 2 | Mở modal, uncheck CA4699, check CA4431, Xác nhận | browser_click ×3 | ✅ | request #101: `mode=Manual`, `vouchers=[CA4431]` |
| 3 | Đổi PTTT → Ví MoMo | browser_click radio | ✅ | badge 5→6 (CA4887 xuất hiện), CA4431 giữ nguyên → **TC_02.3/5/13 PASS** |
| 4 | Mở modal, uncheck CA4431, check CA4887, Xác nhận | browser_click ×3 | ✅ | CA4887 applied, 34.900đ |
| 5 | Đổi PTTT → Thẻ ATM | browser_click radio | ✅ | CA4887 tự removed, message "Ưu đãi đã chọn không đủ điều kiện áp dụng..." → **TC_02.24/20/21/14 PASS** |

## Session B — Order 0000JB82OMGW

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Fresh checkout, auto-apply CA4699 | navigate + click Mua ngay | ✅ | mode=Auto |
| 2 | Mở modal, THÊM CA4431 (không bỏ CA4699), Xác nhận | browser_click ×2 | ✅ | Cả 2 active (do BUG-001), 24.900đ |
| 3 | Mở modal, uncheck CA4431 (giữ CA4699), Xác nhận | browser_click ×2 | ✅ | CA4699 giữ nguyên, 29.900đ, request `mode=Manual, vouchers=[CA4699]` → **TC_02.4 PASS** |
| 4 | Mở modal, uncheck CA4699 (bỏ hết), Xác nhận | browser_click ×2 | ✅ | 39.900đ (giá gốc) |
| 5 | Đổi PTTT → Ví MoMo | browser_click radio | ✅ | badge 5→6, giá vẫn 39.900đ — không tự áp lại → **TC_02.16 PASS** |

## Session C — Order 0000JB8KK0CG (context switch + order thật)

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Fresh checkout, auto-apply CA4699 (context 1 mặc định) | navigate + click Mua ngay | ✅ | mode=Auto, badge 5 |
| 2 | Tick "nhận hóa đơn", chọn An Giang / Phường Châu Đốc / Kênh Hòa Bình (context 2) | browser_click ×5 | ✅ | badge 5→4 (mất CA4656, ràng buộc HN/HCM), request #104 tự động `{"vouchers":[],"mode":"Auto"}` → **TC_02.2 PASS** |
| 3 | Điền SĐT 0912345678, Họ tên "Nguyen Van A", Email nguyenvana@test.com, Số nhà 123 | browser_fill_form | ✅ | — |
| 4 | Bấm "Thanh toán" (PTTT=Thẻ ATM) | browser_click | ✅ | Redirect sang FoxPay gateway |
| 5 | Điền thẻ 9704000000000018 (auto-detect SaigonBank), Tên "NGUYEN VAN A", hạn 03/07 | browser_type ×3 | ✅ | — |
| 6 | Bấm "Thanh toán 29.900 VNĐ" | browser_click | ✅ | Dialog OTP (Napas) |
| 7 | Nhập OTP "otp", bấm "Tiếp tục" | browser_type + browser_click | ✅ | "Giao dịch thành công." |
| 8 | Bấm "Đóng" | browser_click | ✅ | Redirect → `/checkout/0000JB8KK0CG/completed`, "Thanh toán thành công", voucher CA4699 giữ nguyên trong đơn → **TC_02.6 PASS** |

⚠️ Đơn hàng thật đã được tạo trên STG (mã `0000JB8KK0CG`).

## Network evidence tổng hợp

| Request | Body | Ý nghĩa |
|---------|------|---------|
| Auto-apply (page load) | `{"vouchers":[],"mode":"Auto"}` | Backend tự chọn |
| Manual confirm (bất kỳ) | `{"vouchers":[...],"mode":"Manual"}` | User đã tác động → hasManualVoucher=true |
| `/checkout/payment` sau context change | `voucher_warning.code=VOUCHER_WARNING_CONTEXT_CHANGED` | Cơ chế Recheck — voucher invalid tự thông báo + remove |
| `/checkout/complete` → `/checkout/payment/callback` | `{"success":true,"data":true}` | Recheck result=1 (hợp lệ) khi bấm Thanh toán thật — TC_02.6 |
