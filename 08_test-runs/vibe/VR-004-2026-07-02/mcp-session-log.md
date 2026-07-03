# MCP Session Log — VR-004 — v1.2 — 2026-07-02

## Session info
- Platform: Web (Playwright MCP)
- Pre-flight: ✅ browser_navigate + browser_snapshot OK (08:41:10)
- Orders: 0000JB7ZXPVK (Session A), 0000JB82OMGW (Session B)

## Call history (chronological)

| # | Time | MCP method | Note |
|--:|------|-----------|------|
| 1 | 08:41:10 | browser_navigate | product page (session recreated — MCP context đã reset từ VR-003) |
| 2 | 08:41:13 | browser_click | "Mua ngay" → checkout 0000JB7ZXPVK |
| 3 | 08:41:22 | browser_click | Mở modal |
| 4 | 08:41:28 | browser_click | Uncheck CA4699 |
| 5 | 08:41:32 | browser_click | Check CA4431 |
| 6 | 08:41:36 | browser_click | Xác nhận |
| 7 | 08:41:~ | browser_network_requests + browser_network_request | request #101 body — xác nhận mode=Manual |
| 8 | 08:41:58 | browser_click | Đổi PTTT → Ví MoMo |
| 9 | 08:42:~ | browser_network_request | #104 response — CA4887 xuất hiện |
| 10 | 08:42:31 | browser_click | Mở modal |
| 11 | 08:42:38 | browser_click | Uncheck CA4431 |
| 12 | 08:42:44 | browser_click | Check CA4887 |
| 13 | 08:42:47 | browser_click | Xác nhận |
| 14 | 08:42:56 | browser_click | Đổi PTTT → Thẻ ATM |
| 15 | 08:42:~ | browser_network_request | #108 response — voucher_warning CONTEXT_CHANGED |
| 16 | 08:43:34 | browser_navigate | Fresh product page → session B |
| 17 | 08:43:38 | browser_click | "Mua ngay" → checkout 0000JB82OMGW |
| 18 | 08:43:49 | browser_click | Mở modal |
| 19 | 08:43:54 | browser_click | Check CA4431 (thêm, giữ CA4699) |
| 20 | 08:43:59 | browser_click | Xác nhận |
| 21 | 08:44:08 | browser_click | Mở modal |
| 22 | 08:44:14 | browser_click | Uncheck CA4431 |
| 23 | 08:44:18 | browser_click | Xác nhận |
| 24 | 08:44:~ | browser_network_request | #100 body — mode=Manual, vouchers=[CA4699] |
| 25 | 08:45:09 | browser_click | Mở modal |
| 26 | 08:45:16 | browser_click | Uncheck CA4699 |
| 27 | 08:45:21 | browser_click | Xác nhận |
| 28 | 08:45:30 | browser_click | Đổi PTTT → Ví MoMo |
| 29 | 08:59:12 | browser_navigate | Fresh product page → session C |
| 30 | 08:59:16 | browser_click | "Mua ngay" → checkout 0000JB8KK0CG |
| 31 | 08:59:24 | browser_click | Tick "Tôi muốn nhận hóa đơn" |
| 32 | 08:59:34 | browser_click | Chọn tỉnh thành phố |
| 33 | 08:59:42 | browser_click | Chọn "An Giang" |
| 34 | 08:59:52 | browser_click | Chọn phường/xã |
| 35 | 09:00:01 | browser_click | Chọn "Phường Châu Đốc" |
| 36 | 09:00:09 | browser_click | Chọn tên đường |
| 37 | 09:00:16 | browser_click | Chọn "Kênh Hòa Bình" |
| 38 | 09:00:~ | browser_network_requests + request | #103 list (4 EVC) + #104 apply body mode=Auto → TC_02.2 |
| 39 | 09:01:~ | browser_fill_form | SĐT, Họ tên, Email, Số nhà (4 fields) |
| 40 | 09:03:11 | browser_click | "Thanh toán" → redirect FoxPay |
| 41 | 09:05:01 | browser_wait_for | 2s cho gateway load |
| 42 | 09:05:~ | browser_type ×3 | Số thẻ, Tên in trên thẻ, Ngày hiệu lực |
| 43 | 09:05:36 | browser_click | "Thanh toán 29.900 VNĐ" → dialog OTP |
| 44 | 09:05:~ | browser_type | OTP "otp" |
| 45 | 09:05:~ | browser_click | "Tiếp tục" → "Giao dịch thành công." |
| 46 | 09:05:55 | browser_click | "Đóng" (lỗi ref đầu tiên, snapshot lại thành công) |
| 47 | 09:06:~ | browser_network_requests + request | #107 checkout/complete, #206 payment/callback success:true |
| 48 | 09:06:~ | browser_take_screenshot | TC02-06 full page evidence |

## Statistics
- Total MCP calls: 48
- browser_click: 27
- browser_snapshot: 8
- browser_network_requests/request: 7
- browser_type: 4 (card fields + OTP)
- browser_fill_form: 1 (4 fields)
- Failures: 2 (browser context bị đóng đầu phiên — retry OK; 1 stale ref "Đóng" button — snapshot lại resolve OK)
- % locator ✅ Verified: 100%
- ⚠️ Real order created: 0000JB8KK0CG (STG environment)
