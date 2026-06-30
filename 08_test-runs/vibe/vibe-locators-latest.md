# Vibe Locators LATEST — v1.2 — Last updated: VR-001 — 2026-06-30

> Đây là file implement-automation đọc để dùng locators.
> Source run: VR-001-2026-06-30/vibe-locators.md
> Platform: Web (Playwright)

Xem chi tiết: `VR-001-2026-06-30/vibe-locators.md`

## Quick Reference — Verified Locators ✅

```typescript
// Checkout page — staging.fpt.vn/checkout/.../payment

// Voucher section
page.getByText('Chọn ưu đãi')           // Open voucher modal
page.getByRole('textbox', { name: 'Nhập mã khuyến mãi' })  // Manual code input
page.getByRole('button', { name: 'Áp dụng' })  // Apply button (disabled by default)

// Modal dialog
page.getByRole('button', { name: 'Xác nhận' })  // Confirm selection
page.getByRole('button', { name: 'Close' })       // Close (X) modal

// Checkbox trong modal (by index)
page.getByRole('checkbox').nth(0)  // First voucher
page.getByRole('checkbox').nth(1)  // Second voucher

// Verify prices
page.getByLabel('Thông tin thanh toán').getByText('Cần thanh toán')
page.getByRole('button', { name: 'Tiếp tục' })

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
