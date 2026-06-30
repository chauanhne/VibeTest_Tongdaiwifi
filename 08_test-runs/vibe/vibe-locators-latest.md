# Vibe Locators LATEST — v1.2 — Last updated: VR-002 — 2026-06-30

> Đây là file implement-automation đọc để dùng locators.
> Source run: VR-002-2026-06-30/vibe-locators.md
> Platform: Web (Playwright)

Xem chi tiết: `VR-002-2026-06-30/vibe-locators.md`

## Quick Reference — Verified Locators ✅

```typescript
// Checkout page — staging.fpt.vn/checkout/.../payment

// Setup: trigger EVC context (MUST do before voucher steps)
// 1. Fill phone number
page.getByRole('textbox', { name: 'Số điện thoại*' })
// 2. Tick hóa đơn → open address form
page.getByRole('checkbox', { name: /Tôi muốn nhận hóa đơn/ })
// 3. Select location (example: Hà Nội / Phường Cầu Giấy / Phạm Văn Bạch)
page.getByRole('button', { name: 'Chọn tỉnh thành phố' })
page.getByRole('button', { name: 'Chọn phường/xã' })
page.getByRole('button', { name: 'Chọn tên đường' })
// → this triggers /voucher/list re-fetch with location context

// Voucher section
page.getByText('Chọn ưu đãi')           // Open voucher modal (includes badge number)
page.getByRole('textbox', { name: 'Nhập mã khuyến mãi' })  // Manual code input
page.getByRole('button', { name: 'Áp dụng' })  // Apply button (disabled by default)

// Modal dialog
page.getByRole('dialog', { name: 'Chọn ưu đãi' })  // Modal container
page.getByRole('button', { name: 'Xác nhận' })      // Confirm selection
page.getByRole('button', { name: 'Close' })          // Close (X) modal

// Checkboxes trong modal (scope vào dialog để tránh off-by-N issue)
// NOTE: page-wide nth() bao gồm cả "Tôi muốn nhận hóa đơn" checkbox → dùng dialog scope
dialog.getByRole('checkbox').nth(0)  // CA4699GIAM10KPHIHOAMANG (10.000đ)
dialog.getByRole('checkbox').nth(1)  // CA4431GIAMTTUFSA03 (5.000đ)
dialog.getByRole('checkbox').nth(2)  // CA4580GIAMTTUFSA03 (5.000đ)
dialog.getByRole('checkbox').nth(3)  // CA4608GIAMTTUFSA522 (→ API resolves to CA4580)
dialog.getByRole('checkbox').nth(4)  // CA4656GIAMUTFSANHHCM1 (→ API resolves to CA4580)

// Verify prices (in Thông tin thanh toán)
page.getByText('Cần thanh toán')  // Price label
// Applied voucher code text + discount amount are paragraphs inside region

// Payment methods
page.getByRole('radio', { name: 'Ví MoMo' })
page.getByRole('radio', { name: 'Thẻ ATM' })
page.getByRole('radio', { name: 'Thanh toán bằng VietQR' })
page.getByRole('radio', { name: 'Chuyển khoản nhanh' })

// Product page — tongdaiwifi.vn
page.getByRole('button', { name: 'Mua ngay' })  // Navigate to checkout
```

## NOT FOUND (do NOT implement)

- Tab "Mã giảm giá" — không tồn tại trong current build
- Link "Điều kiện" trên voucher card — không tồn tại

## Key Findings (VR-002)

- **EVC context = location**, không phải SĐT. Phải chọn location có EVC trước.
- **Location confirmed có EVC:** Hà Nội / Phường Cầu Giấy / Phạm Văn Bạch (5 EVCs)
- **CA4608, CA4656 là alias của CA4580** — API normalize khi apply
- **Modal checkbox nth() issue:** Playwright resolve page-wide, off by N do hidden checkboxes. Scope vào dialog khi implement automation.

## EVC Discount Map (API verified — VR-002)

| Voucher Code | API Normalized | discount_value |
|---|---|---|
| CA4699GIAM10KPHIHOAMANG | CA4699 | **10.000đ** (auto-applied — highest) |
| CA4431GIAMTTUFSA03 | CA4431 | 5.000đ |
| CA4580GIAMTTUFSA03 | CA4580 | 5.000đ |
| CA4608GIAMTTUFSA522 | CA4580 (alias) | 5.000đ |
| CA4656GIAMUTFSANHHCM1 | CA4580 (alias) | 5.000đ |
