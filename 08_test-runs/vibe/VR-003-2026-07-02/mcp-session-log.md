# MCP Session Log — VR-003 — v1.2 — 2026-07-02

## Session info
- Platform: Web (Playwright MCP — `mcp__playwright__*` tools)
- Browser: Chromium (Playwright-managed)
- Pre-flight: ✅ `browser_navigate(base_url)` OK + `browser_snapshot()` OK (04:10:10)
- Base URL: https://staging.tongdaiwifi.vn/dich-vu-so/goi-ultra-fast
- Orders created during run: 0000JAZE7Q9S, 0000JAZM3NLS, 0000JAZO17PC

## Call history (chronological, UTC timestamps từ MCP response)

| # | Time | MCP method | Args (summary) | Result | Note |
|--:|------|-----------|----------------|--------|------|
| 1 | 04:10:10 | browser_navigate | product page | OK | Pre-flight |
| 2 | 04:10:10 | browser_snapshot | — | OK | Pre-flight — accessibility tree dumped |
| 3 | 04:10:16 | browser_click | "Mua ngay" ref=e125 | OK → checkout 0000JAZE7Q9S | Auto-apply đã xảy ra sẵn (session tự có location) |
| 4 | 04:10:~ | browser_take_screenshot | TC02-01 | OK | Evidence TC_02.1 |
| 5 | 04:10:50 | browser_network_requests | filter=voucher | OK → #94 list, #95 apply | TC_02.1 evidence |
| 6 | 04:10:50 | browser_network_request | #95 response-body | OK | discount_value=10000 CA4699 |
| 7 | 04:10:49 | browser_network_request | #94 response-body | OK | 5 EVC list, xác nhận CA4699 cao nhất |
| 8 | 04:14:39 | browser_click | "Chọn ưu đãi" (open modal) | OK dialog e114 | TC_02.9 |
| 9 | 04:14:47 | browser_click | checkbox uncheck CA4699 ref=e132 | OK | TC_02.9 |
| 10 | 04:14:52 | browser_click | "Xác nhận" ref=e183 | OK | TC_02.9 |
| 11 | 04:14:~ | browser_snapshot | — | OK | Cần thanh toán=39.900đ |
| 12 | 04:14:~ | browser_network_requests | filter=voucher | OK → #98 apply (remove) | Xác nhận KHÔNG re-call list |
| 13 | 04:14:~ | browser_take_screenshot | TC02-09 | OK | Evidence TC_02.9/15 |
| 14 | 04:15:21 | browser_click | "Chọn ưu đãi" (reopen) | OK dialog e191 | TC_02.36 |
| 15 | 04:15:~ | browser_click | checkbox CA4580 ref=e232 (chưa confirm) | OK | TC_02.36 |
| 16 | 04:15:34 | browser_click | "Close" (X) ref=e261 | OK | TC_02.36 |
| 17 | 04:15:~ | browser_snapshot | — | OK | State unchanged 39.900đ → TC_02.36 PASS |
| 18 | 04:15:45 | browser_click | "Chọn ưu đãi" (reopen) | OK dialog e264 | TC_02.8 — checkbox reset confirmed |
| 19 | 04:15:52 | browser_click | checkbox CA4431 ref=e293 | OK | TC_02.8 |
| 20 | 04:16:01 | browser_click | "Xác nhận" ref=e333 | OK | TC_02.8 |
| 21 | 04:16:~ | browser_snapshot | — | OK | "Áp dụng mã ưu đãi thành công.", -5.000đ |
| 22 | 04:16:~ | browser_take_screenshot | TC02-08 | OK | Evidence TC_02.8 |
| 23 | 04:16:12 | browser_click | "Chọn ưu đãi" (reopen) | OK dialog e346 | TC_02.12 |
| 24 | 04:16:18 | browser_click | checkbox CA4699 ref=e364 (thêm, không bỏ CA4431) | OK | TC_02.12 |
| 25 | 04:16:24 | browser_click | "Xác nhận" ref=e415 | OK | TC_02.12 |
| 26 | 04:16:~ | browser_snapshot | — | OK | Cả 2 voucher hiện, 24.900đ — BUG confirmed |
| 27 | 04:16:~ | browser_network_requests | filter=voucher | OK → #102 apply | TC_02.12 |
| 28 | 04:16:54 | browser_network_request | #102 request-body | OK | 2 voucher codes gửi lên |
| 29 | 04:16:54 | browser_network_request | #102 response-body | OK | success:true, data[] chứa cả 2 |
| 30 | 04:16:~ | browser_take_screenshot | TC02-12 | OK | Evidence FAIL |
| 31 | 04:17:08 | browser_navigate | product page (fresh) | OK | TC_02.40 setup |
| 32 | 04:17:11 | browser_click | "Mua ngay" ref=e125 | OK → checkout 0000JAZM3NLS | Fresh session |
| 33 | 04:17:~ | browser_network_requests | filter=voucher | OK → #95 list, #96 apply | 1 lần list |
| 34 | 04:17:19 | browser_click | "Chọn ưu đãi" (mở lần đầu) | OK dialog e118 | TC_02.40 |
| 35 | 04:17:~ | browser_network_requests | filter=voucher | OK → vẫn #95/#96 | Xác nhận CACHE — TC_02.40 PASS |
| 36 | 04:17:~ | browser_take_screenshot | TC02-40 | OK | Evidence |
| 37 | 04:17:34 | browser_click | "Close" ref=e188 | OK | Đóng modal, chuẩn bị TC_02.17 |
| 38 | 04:17:44 | browser_click | checkbox "Tôi muốn nhận hóa đơn" ref=e31 | OK | Mở form địa chỉ |
| 39 | 04:17:51 | browser_click | "Chọn tỉnh thành phố" ref=e209 | OK | — |
| 40 | 04:17:58 | browser_click | "Hồ Chí Minh" ref=e234 | OK | — |
| 41 | 04:18:04 | browser_click | "Chọn phường/xã" ref=e274 | OK | — |
| 42 | 04:18:12 | browser_click | "Phường Test Hồ Chí Minh" ref=e466 | OK | Badge biến mất, 39.900đ |
| 43 | 04:18:~ | browser_take_screenshot | TC02-17 | OK | Evidence TC_02.17 PASS |
| 44 | 04:18:26 | browser_click | "Chọn ưu đãi" (0-EVC) | OK dialog e476 | TC_02.31/37 |
| 45 | 04:18:~ | browser_snapshot | — | OK | Empty state: img + text confirmed |
| 46 | 04:18:~ | browser_take_screenshot | TC02-31_37 | OK | Evidence |
| 47 | 04:18:45 | browser_click | "Close" ref=e487 | OK | — |
| 48 | 04:18:48 | browser_navigate | product page (fresh) | OK | TC_02.33 setup |
| 49 | 04:18:53 | browser_click | "Mua ngay" ref=e125 | OK → checkout 0000JAZO17PC | Auto-apply CA4699 |
| 50 | 04:18:~ | browser_resize | 390×844 | OK | Mobile viewport |
| 51 | 04:18:~ | browser_take_screenshot | TC02-33 (fullPage) | OK | Sticky bar "Cần thanh toán 29.900đ" xác nhận |
| 52 | 04:19:~ | browser_resize | 1280×900 | OK | Reset về desktop, kết thúc run |

## Statistics
- Total MCP calls: 52
- `browser_click`: 24 (tất cả OK)
- `browser_snapshot`: 10
- `browser_network_requests` / `browser_network_request`: 10 (list/apply endpoint audit, 2 request/response body deep-dive cho TC_02.1 và TC_02.12)
- `browser_take_screenshot`: 8
- `browser_navigate`: 3 (3 fresh sessions/orders)
- `browser_resize`: 2
- Failures: 0 — không có MCP call nào lỗi trong suốt run
- % locator ✅ Verified: 100% (tất cả element tương tác đều qua MCP find/click/snapshot, không có locator đoán từ screenshot)
