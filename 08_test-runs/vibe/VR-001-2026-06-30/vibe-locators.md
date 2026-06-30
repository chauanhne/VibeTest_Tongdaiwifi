# Vibe Locators — v1.2 — VR-001 — 2026-06-30

> Captured via Playwright MCP during this run.
> Mark legend: ✅ Verified (MCP find+action OK) · ⚠️ Inferred · 🚫 NOT FOUND · ⏳ Pending
> MCP session log: see mcp-session-log.md
> Platform: Web (Playwright)
> Base domain: staging.fpt.vn

---

## Page: Product Page (tongdaiwifi.vn/dich-vu-so/goi-ultra-fast)

| Element | Action Used | Strategy | Value | Verified | MCP call ref | TC refs |
|---------|------------|----------|-------|----------|--------------|---------|
| Button "Mua ngay" | click | role | button[name="Mua ngay"] | ✅ | mcp-log #4 (browser_click success) | Flow entry |

---

## Page: Checkout Payment (staging.fpt.vn/checkout/.../payment)

### Section: Thông tin thanh toán

| Element | Action Used | Strategy | Value | Verified | MCP call ref | TC refs |
|---------|------------|----------|-------|----------|--------------|---------|
| Textbox "Nhập mã khuyến mãi" | locate | role | textbox[name="Nhập mã khuyến mãi"] | ✅ | snapshot #2 | TC_02.28 |
| Button "Chọn ưu đãi" (badge) | click | text | text=Chọn ưu đãi | ✅ | mcp-log #5 (browser_click success) | TC_02.10, TC_02.28, TC_02.36, TC_02.38 |
| Badge count trên Chọn ưu đãi | verify | child | generic:has-text("5") bên trong Chọn ưu đãi | ✅ | snapshot #2 [ref=e89] | TC_02.10, TC_02.38 |
| Button "Áp dụng" [disabled] | verify | role | button[name="Áp dụng"][disabled] | ✅ | snapshot #2 | TC_02.28 |
| Applied voucher code | verify | role | paragraph (mã voucher applied) | ✅ | snapshot [ref=e92/e422] | TC_02.9, TC_02.36 |
| Applied voucher discount | verify | role | paragraph (số tiền giảm, vd "-10.000đ") | ✅ | snapshot [ref=e93/e423] | TC_02.9, TC_02.36 |

### Section: Cần thanh toán

| Element | Action Used | Strategy | Value | Verified | MCP call ref | TC refs |
|---------|------------|----------|-------|----------|--------------|---------|
| Paragraph giá "Cần thanh toán" | verify | aria-label | getByLabel('Thông tin thanh toán').getByText('Cần thanh toán') | ✅ | snapshot [ref=e96] | TC_02.9, TC_02.28, TC_02.36 |
| Giá trị "Cần thanh toán" (price) | verify | sibling | paragraph after "Cần thanh toán" | ✅ | snapshot [ref=e269/e424] | TC_02.9, TC_02.28, TC_02.36 |
| Button "Tiếp tục" | locate | role | button[name="Tiếp tục"] | ✅ | snapshot [ref=e99] | TC_02.6, TC_02.25 |

### Section: Phương thức thanh toán

| Element | Action Used | Strategy | Value | Verified | MCP call ref | TC refs |
|---------|------------|----------|-------|----------|--------------|---------|
| Radio "Thẻ ATM" | locate | role | radio[name="Thẻ ATM"] | ✅ | snapshot [ref=e43] | TC_02.11, TC_02.24 |
| Radio "Ví MoMo" | click | role | radio[name="Ví MoMo"] | ✅ | mcp-log browser_click (success) | TC_02.11 |
| Radio "Thanh toán bằng VietQR" | locate | role | radio[name="Thanh toán bằng VietQR"] | ✅ | snapshot [ref=e57] | TC_02.11 |
| Radio "Chuyển khoản nhanh" | locate | role | radio[name="Chuyển khoản nhanh"] | ✅ | snapshot [ref=e63] | TC_02.11 |

---

## Dialog: "Chọn ưu đãi" Modal

| Element | Action Used | Strategy | Value | Verified | MCP call ref | TC refs |
|---------|------------|----------|-------|----------|--------------|---------|
| Heading "Chọn ưu đãi" | verify | role | heading[name="Chọn ưu đãi"] | ✅ | snapshot [ref=e115] | TC_02.29 |
| Button "Xác nhận" | click | role | button[name="Xác nhận"] | ✅ | mcp-log #6 (browser_click success) | TC_02.8, TC_02.9 |
| Button "Close" (X) | click | role | button[name="Close"] | ✅ | mcp-log #7 (browser_click success) | TC_02.36 |
| Section label "Ưu đãi" | verify | role | paragraph:has-text("Ưu đãi") trong dialog | ✅ | snapshot [ref=e120] | TC_02.29 |
| Tab "Mã giảm giá" | locate | — | — | 🚫 NOT FOUND | snapshot — không có element này | TC_02.29 |
| Voucher card (generic container) | click | nth-child | dialog > generic > generic:nth-child(N) | ✅ | mcp-log click success | TC_02.8, TC_02.9 |
| Checkbox trong voucher card | click | role | checkbox (nth) | ✅ | mcp-log browser_click success | TC_02.8, TC_02.9 |

### Voucher Cards Inventory (Ưu đãi section)

| Voucher Code | Tên | Discount | HSD | Verified |
|-------------|-----|----------|-----|----------|
| CA4699GIAM10KPHIHOAMANG | Giảm 10k phí hòa mạng | -10.000đ | 30/11/2026 | ✅ |
| CA4431GIAMTTUFSA03 | Giảm TT UF SA | -5.000đ | 30/11/2026 | ✅ |
| CA4580GIAMTTUFSA03 | Giảm TT UF SA | unknown | 30/11/2026 | ⚠️ Inferred |
| CA4608GIAMTTUFSA522 | Giảm TT UF SA DK | unknown | 30/11/2026 | ⚠️ Inferred |
| CA4656GIAMUTFSANHHCM1 | Giảm TT UF SA HN HCM | unknown | 30/11/2026 | ⚠️ Inferred |

---

## API Endpoints (từ Network Monitor)

| Method | URL | Khi nào gọi | TC refs |
|--------|-----|-------------|---------|
| POST | `https://apis-stag.fpt.vn/ecp/ordering/public/v1/voucher/list` | Page load + có thể khi đổi context | TC_02.1, TC_02.40 |
| POST | `https://apis-stag.fpt.vn/ecp/ordering/public/v1/voucher/apply` | Khi click Xác nhận trong modal | TC_02.8, TC_02.9, TC_02.12 |

---

## Navigation Flow (MCP-verified)

| From | Trigger | To | MCP-verified |
|------|---------|-----|--------------|
| tongdaiwifi.vn/goi-ultra-fast | click button "Mua ngay" | staging.fpt.vn/checkout/register/... → /payment | TC_02.1 entry |
| /payment (modal closed) | click Xác nhận | /payment (updated price) | TC_02.8, TC_02.9 |

---

## Elements NOT FOUND

| Element | Strategy tried | Note |
|---------|---------------|------|
| Tab "Mã giảm giá" trong modal | text search in dialog | Không tồn tại trong current UI — xem TC_02.29 |
| Link "Điều kiện" trên voucher card | accessibility tree scan | Không xuất hiện — ảnh hưởng TC_02.30, TC_02.32, TC_02.34 |
| Cart page | navigation | Flow "Mua ngay" không qua Cart — ảnh hưởng TC_02.27 |
