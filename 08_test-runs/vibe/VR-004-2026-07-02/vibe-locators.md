# Vibe Locators — v1.2 — VR-004 — 2026-07-02

> Mark legend: ✅ Verified · ⚠️ Inferred · 🚫 NOT FOUND
> Platform: Web (Playwright)

## Checkout /payment — thêm mới so với VR-003

| Element | Action | Strategy | Value | Verified | TC refs |
|---------|--------|----------|-------|----------|---------|
| Voucher invalid warning (sau context change) | verify | paragraph text | `"Ưu đãi đã chọn không đủ điều kiện áp dụng, vui lòng kiểm tra lại."` | ✅ | TC_02.20, 21, 24 |
| Radio "Ví MoMo" | click | role+name | `radio "Ví MoMo"` | ✅ | TC_02.11, 24 |
| Radio "Thẻ ATM" | click | role+name | `radio "Thẻ ATM"` | ✅ | TC_02.24 |

## API endpoints — quan trọng cho implement-automation + business logic

| Endpoint | Field quan trọng | Ý nghĩa | TC refs |
|----------|-------------------|---------|---------|
| `POST /voucher/apply` | `mode: "Auto"` (vouchers=[]) | Auto-apply lúc load trang | TC_02.1 |
| `POST /voucher/apply` | `mode: "Manual"` (vouchers=[...]) | Bất kỳ lần user confirm qua modal | TC_02.3-5,8,12,13,16 |
| `POST /checkout/payment` | `voucher_warning.code=VOUCHER_WARNING_CONTEXT_CHANGED` | Recheck — voucher invalid sau đổi context | TC_02.20, 21, 24 |

## Test data mới

| Voucher Code | Điều kiện | Discount |
|---|---|---|
| CA4887GIAMTTUFSA03MOMO | PTTT = Ví MoMo only | 5.000đ |

## Địa chỉ context 2 (khác Hà Nội/Cầu Giấy)

An Giang / Phường Châu Đốc / Kênh Hòa Bình → 4 EVC (thiếu CA4656, ràng buộc HN/HCM)

## Payment flow — FoxPay/Napas gateway (portal-v2-staging.foxpay.vn) — MỚI, verify qua TC_02.6

| Element | Action | Strategy | Value | Verified |
|---------|--------|----------|-------|----------|
| Textbox "Số thẻ" | type | role+name | `textbox "Số thẻ"` (auto-detect ngân hàng khi đủ số) | ✅ |
| Textbox "Tên in trên thẻ" | type | role+name | `textbox "Tên in trên thẻ"` | ✅ |
| Textbox "Ngày hiệu lực thẻ" | type | role+name | `textbox "Ngày hiệu lực thẻ"` (format MM/YY) | ✅ |
| Button "Thanh toán [amount] VNĐ" | click | role+name (dynamic amount) | `button "Thanh toán 29.900 VNĐ"` | ✅ |
| Dialog OTP (Napas) | — | role | `dialog` chứa `textbox "Mã xác thực (OTP)"` | ✅ |
| Textbox OTP | type | role+name | `textbox "Mã xác thực (OTP)"` | ✅ |
| Button "Tiếp tục" (confirm OTP) | click | role+name | `button "Tiếp tục"` | ✅ |
| Success text | verify | text | `"Giao dịch thành công."` | ✅ |
| Button "Đóng" | click | role+name | `button "Đóng"` (redirect về checkout/completed) | ✅ |

## Order completed page (staging.fpt.vn/checkout/{orderId}/completed)

| Element | Verify | Strategy | Value |
|---------|--------|----------|-------|
| Success heading | text | `"Thanh toán thành công"` |
| Order code | text | `paragraph` chứa `"Mã đơn hàng: {orderId}"` |
| Voucher applied trong đơn | text | paragraph code + amount (giống Thông tin thanh toán khi checkout) |
