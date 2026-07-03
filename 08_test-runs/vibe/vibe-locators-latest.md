# Vibe Locators LATEST — v1.2 — Last updated: VR-004 — 2026-07-02

> Đây là file implement-automation đọc để dùng locators.
> Source runs: VR-003-2026-07-02/vibe-locators.md + VR-004-2026-07-02/vibe-locators.md
> Platform: Web (Playwright)

Xem chi tiết: `VR-003-2026-07-02/vibe-locators.md`, `VR-004-2026-07-02/vibe-locators.md`

## Quick Reference — Verified Locators ✅

```typescript
// Checkout page — staging.fpt.vn/checkout/.../payment

// NOTE (VR-003): fresh session/order đôi khi tự có location context sẵn
// (auto-apply xảy ra ngay không cần chọn địa chỉ thủ công) — có thể do IP-based
// geo default trên STG. Để test case 0-EVC ổn định, vẫn nên chủ động set
// địa chỉ KHÔNG có EVC (xem dưới) thay vì phụ thuộc session mặc định.

// Setup: trigger EVC context thủ công (nếu cần force lại)
page.getByRole('textbox', { name: 'Số điện thoại*' })
page.getByRole('checkbox', { name: /Tôi muốn nhận hóa đơn/ })
page.getByRole('button', { name: 'Chọn tỉnh thành phố' })
page.getByRole('button', { name: 'Chọn phường/xã' })
page.getByRole('button', { name: 'Chọn tên đường' })
// → chọn "Hà Nội / Phường Cầu Giấy / Phạm Văn Bạch" → 5 EVC
// → chọn "Hồ Chí Minh / Phường Test Hồ Chí Minh" → 0 EVC (dùng cho TC_02.17/31/37)

// Voucher section
page.getByText('Chọn ưu đãi')           // Open voucher modal (includes badge number, biến mất khi 0 EVC)
page.getByRole('textbox', { name: 'Nhập mã khuyến mãi' })  // Manual code input
page.getByRole('button', { name: 'Áp dụng' })  // Apply button (disabled by default)

// Modal dialog
page.getByRole('dialog', { name: 'Chọn ưu đãi' })  // Modal container
page.getByRole('button', { name: 'Xác nhận' })      // Confirm selection
page.getByRole('button', { name: 'Close' })          // Close (X) modal

// Checkboxes trong modal (scope vào dialog để tránh off-by-N issue)
dialog.getByRole('checkbox').nth(0)  // CA4699GIAM10KPHIHOAMANG (10.000đ)
dialog.getByRole('checkbox').nth(1)  // CA4431GIAMTTUFSA03 (5.000đ)
dialog.getByRole('checkbox').nth(2)  // CA4580GIAMTTUFSA03 (5.000đ)
dialog.getByRole('checkbox').nth(3)  // CA4608GIAMTTUFSA522 (→ API resolves to CA4580)
dialog.getByRole('checkbox').nth(4)  // CA4656GIAMUTFSANHHCM1 (→ API resolves to CA4580)

// Empty state (0 EVC) — NEW VR-003
dialog.getByRole('img', { name: 'Không có ưu đãi' })
dialog.getByText('Rất tiếc, quý khách không có mã ưu đãi.')

// Success / info messages — NEW VR-003
page.getByText('Áp dụng mã ưu đãi thành công.')  // Single voucher apply
page.getByText('Áp dụng ưu đãi mới thành công. Mã ưu đãi cũ đã được thay thế.')  // Multi-select — MISLEADING, thực tế bị stack (BUG-001)

// Verify prices (in Thông tin thanh toán)
page.getByText('Cần thanh toán')  // Price label — dùng chung desktop + mobile sticky bar
// Applied voucher code text + discount amount are paragraphs inside region

// Mobile viewport (≤390px) — NEW VR-003
// Sticky bottom bar tự động xuất hiện đè "Cần thanh toán" + button
page.getByRole('button', { name: 'Tiếp tục' })  // Mobile CTA (khác "Thanh toán" desktop) — ⚠️ Inferred, chưa MCP find_element trực tiếp

// Payment methods
page.getByRole('radio', { name: 'Ví MoMo' })
page.getByRole('radio', { name: 'Thẻ ATM' })
page.getByRole('radio', { name: 'Thanh toán bằng VietQR' })
page.getByRole('radio', { name: 'Chuyển khoản nhanh' })

// Product page — tongdaiwifi.vn
page.getByRole('button', { name: 'Mua ngay' })  // Navigate to checkout
```

## API Endpoints (for network-level assertions / mocking)

```
POST /ecp/ordering/public/v1/voucher/list   → gọi khi load trang / mở modal lần đầu (cached sau đó, không re-call), gọi lại khi đổi PTTT
POST /ecp/ordering/public/v1/voucher/apply  → body {vouchers:[], mode:"Auto"} khi auto-apply lúc load trang
                                             → body {vouchers:[...], mode:"Manual"} khi user confirm qua modal (BẤT KỲ lần nào, kể cả re-confirm voucher đang auto)
                                             → field "mode" = cơ chế xác định hasManualVoucher (VR-004 discovery)
POST /ecp/ordering/public/v1/checkout/payment → cơ chế Recheck. Khi voucher không còn hợp lệ sau context change,
                                             trả voucher_warning: {code: "VOUCHER_WARNING_CONTEXT_CHANGED", message, details:[{voucher_code, message}]}
                                             (VR-004 discovery — dùng cho TC_02.6/18/20/21/22/24/25)
```

## Test data — voucher PTTT-specific (VR-004)

| Voucher Code | Điều kiện | Discount |
|---|---|---|
| CA4887GIAMTTUFSA03MOMO | PTTT = Ví MoMo only — chỉ xuất hiện trong `/voucher/list` khi PTTT đang chọn = Momo | 5.000đ |

## Test data — địa chỉ context 2 (VR-004)

An Giang / Phường Châu Đốc / Kênh Hòa Bình → 4 EVC (thiếu CA4656, ràng buộc HN/HCM)

## Full payment flow (FoxPay/Napas gateway) — verify qua TC_02.6 (VR-004)

```typescript
// Sau khi bấm "Thanh toán" trên checkout, redirect sang portal-v2-staging.foxpay.vn
page.getByRole('textbox', { name: 'Số thẻ' })              // auto-detect ngân hàng khi đủ số
page.getByRole('textbox', { name: 'Tên in trên thẻ' })
page.getByRole('textbox', { name: 'Ngày hiệu lực thẻ' })    // format MM/YY
page.getByRole('button', { name: /Thanh toán .* VNĐ/ })     // amount động trong label
// → Dialog OTP (Napas)
page.getByRole('textbox', { name: 'Mã xác thực (OTP)' })
page.getByRole('button', { name: 'Tiếp tục' })
// → "Giao dịch thành công." → button "Đóng" → redirect về /checkout/{orderId}/completed
```

**Test card (STG only — KHÔNG dùng production):** `9704000000000018` (SaigonBank/Napas), OTP `otp`

## API — order completion (VR-004)

```
POST /checkout/complete           → trigger redirect sang payment gateway
POST /checkout/payment/callback   → {"success":true,"data":true} khi Recheck result=1 hợp lệ
```

## NOT FOUND (do NOT implement)

- Tab "Mã giảm giá" — không tồn tại trong current build
- Link "Điều kiện" trên voucher card — không tồn tại

## Key Findings (VR-003 — cập nhật từ VR-002)

- **EVC context = location**, không phải SĐT (VR-002 finding, vẫn đúng).
- **BUG-001 (voucher stacking) re-confirmed lần 3** — bằng chứng mạnh hơn: backend API trả `success:true` với CẢ 2 voucher trong response, không chỉ FE-side validation gap.
- **Fresh session có thể tự có location context** (auto-apply mà không cần set địa chỉ thủ công) — khác biệt với VR-002. Có thể do IP-based geo default trên STG — cần confirm với BA/Dev nếu dùng để automate (không nên phụ thuộc default, luôn set địa chỉ tường minh trong test).
- **Location 0-EVC confirmed lại:** Hồ Chí Minh / Phường Test Hồ Chí Minh (không cần chọn Tên đường/Số nhà — badge đã biến mất ngay sau khi chọn Phường).
- **Empty-state modal locator mới:** img "Không có ưu đãi" + text "Rất tiếc, quý khách không có mã ưu đãi."
- **Success message locator mới:** phân biệt được single-apply vs multi-select (stacking) qua text message khác nhau.
- **Mobile sticky bar (≤390px):** hiện đè lên nội dung, chứa giá + CTA riêng ("Tiếp tục" thay vì "Thanh toán").
- **Modal checkbox nth() issue** (từ VR-002): vẫn cần scope vào dialog khi automate, tránh off-by-N do checkbox "Tôi muốn nhận hóa đơn" ở ngoài modal.

## EVC Discount Map (API verified — VR-002, re-confirmed VR-003)

| Voucher Code | API Normalized | discount_value |
|---|---|---|
| CA4699GIAM10KPHIHOAMANG | CA4699 | **10.000đ** (auto-applied — highest) |
| CA4431GIAMTTUFSA03 | CA4431 | 5.000đ |
| CA4580GIAMTTUFSA03 | CA4580 | 5.000đ |
| CA4608GIAMTTUFSA522 | CA4580 (alias) | 5.000đ |
| CA4656GIAMUTFSANHHCM1 | CA4580 (alias) | 5.000đ |
