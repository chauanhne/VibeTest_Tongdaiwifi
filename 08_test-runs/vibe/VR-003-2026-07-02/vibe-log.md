# Vibe Test Log — VR-003 — v1.2 — 2026-07-02

> Mode: `--all` (full rerun toàn bộ 40 TC, overwrite VR-001/VR-002 status)

## TC_02.1: Auto-apply voucher có DiscountVAT cao nhất khi lần đầu vào Thanh toán

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Truy cập /login → Mua ngay | browser_navigate + browser_click "Mua ngay" | ✅ PASS | Order 0000JAZE7Q9S |
| 2 | Chờ màn tải xong | browser_snapshot | ✅ PASS | Location context tự có sẵn (session mới) |
| 3 | Quan sát block Voucher + "Cần thanh toán" | snapshot + network #94/#95 | ✅ PASS | Badge "5", CA4699 auto-applied -10.000đ |

**Result: ✅ PASS** — Cần thanh toán = 29.900đ. API `/voucher/list` xác nhận CA4699 (10.000đ) là cao nhất trong 5 EVC.
**Screenshot:** `TC02-01_autoload_CA4699-applied.png`

---

## TC_02.9: Hủy EVC đang áp (uncheck + Xác nhận) → reset giá gốc, không call QLCS

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Mở modal danh sách EVC | browser_click "Chọn ưu đãi" | ✅ PASS | dialog ref=e114 |
| 2 | Bỏ chọn CA4699 (uncheck) | browser_click checkbox ref=e132 | ✅ PASS | — |
| 3 | Bấm "Xác nhận" | browser_click ref=e183 | ✅ PASS | — |
| 4 | Quan sát Cần thanh toán | browser_snapshot | ✅ PASS | 39.900đ (giá gốc) |

**Result: ✅ PASS** — Network: request #98 `/voucher/apply` (remove), KHÔNG có `/voucher/list` re-call.
**Screenshot:** `TC02-09_PASS_reset-gia-goc.png`

---

## TC_02.15: User bỏ voucher auto → remove, KHÔNG auto-apply lại

Dùng chung state với TC_02.9 (voucher vừa bị hủy). Sau khi confirm remove, không có voucher mới tự áp, giá giữ 39.900đ, badge vẫn "5" (còn 4 EVC khác chưa dùng).

**Result: ✅ PASS**

---

## TC_02.36: Đóng popup X → state unchanged

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Mở modal | browser_click "Chọn ưu đãi" | ✅ PASS | dialog ref=e191 |
| 2 | Chọn checkbox CA4580 (không confirm) | browser_click ref=e232 | ✅ PASS | — |
| 3 | Đóng bằng "Close" (X) | browser_click ref=e261 | ✅ PASS | — |
| 4 | Quan sát Cần thanh toán | browser_snapshot | ✅ PASS | Vẫn 39.900đ, không có voucher nào áp |

**Result: ✅ PASS**

---

## TC_02.8: Chọn EVC hợp lệ + "Đồng ý"(Xác nhận) → cập nhật giá giảm

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Mở modal | browser_click | ✅ PASS | dialog ref=e264 |
| 2 | Chọn CA4431GIAMTTUFSA03 | browser_click checkbox ref=e293 | ✅ PASS | — |
| 3 | Bấm "Xác nhận" | browser_click ref=e333 | ✅ PASS | — |
| 4 | Quan sát màn Thanh toán | browser_snapshot | ✅ PASS | "Áp dụng mã ưu đãi thành công.", -5.000đ, 34.900đ |

**Result: ✅ PASS**
**Screenshot:** `TC02-08_PASS_CA4431-applied.png`

---

## TC_02.12: Chỉ apply đúng 1 voucher, không stack combo nhiều voucher

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Mở modal (CA4431 đang checked từ TC_02.8) | browser_click | ✅ | dialog ref=e346 |
| 2 | Check thêm CA4699 (không bỏ CA4431) | browser_click checkbox ref=e364 | ✅ | Cả 2 checked |
| 3 | Bấm "Xác nhận" | browser_click ref=e415 | ✅ | request #102 |
| E1 | CO chỉ áp đúng 1 voucher | network #102 response | ❌ **FAIL** | `data[]` chứa CẢ 2 voucher, success:true |

**Result: ❌ FAIL** — Cần thanh toán 24.900đ (39.900-5.000-10.000), stacked. Message UI sai lệch "Mã ưu đãi cũ đã được thay thế" nhưng thực tế KHÔNG thay thế.
**Screenshot:** `TC02-12_FAIL_stacking-confirmed.png`
**API evidence:** request #102 body + response — xem vibe-report.md

---

## TC_02.40: Popup EVC mở từ cache, không gọi lại GetListEvoucher

Fresh session mới (order 0000JAZM3NLS, navigate lại từ đầu):

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Truy cập checkout (fresh) | browser_navigate + click Mua ngay | ✅ PASS | 1 lần `/voucher/list` (req #95) khi load |
| 2 | Mở modal "Chọn ưu đãi" lần đầu | browser_click | ✅ PASS | Vẫn chỉ 1 lần `/voucher/list` — dùng cache |

**Result: ✅ PASS**
**Screenshot:** `TC02-40_PASS_modal-cache-fresh-session.png`

---

## TC_02.17 / TC_02.31 / TC_02.37: Location không có EVC → không auto-apply + modal empty state

Setup: tick "Tôi muốn nhận hóa đơn" → chọn địa chỉ Hồ Chí Minh / Phường Test Hồ Chí Minh (location đã biết từ VR-001/VR-002 là 0-EVC).

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Tick checkbox hóa đơn | browser_click ref=e31 | ✅ | Mở form địa chỉ |
| 2 | Chọn tỉnh "Hồ Chí Minh" | browser_click | ✅ | ref=e234 |
| 3 | Chọn phường "Phường Test Hồ Chí Minh" | browser_click | ✅ | ref=e466 |
| E1 (TC_02.17) | Badge biến mất, giá giữ 39.900đ | browser_snapshot | ✅ PASS | — |
| 4 | Mở modal "Chọn ưu đãi" | browser_click | ✅ | dialog ref=e476 |
| E2 (TC_02.31/37) | Modal hiện empty state | browser_snapshot | ✅ PASS | img "Không có ưu đãi" + text |

**Result: TC_02.17 ✅ PASS · TC_02.31 ✅ PASS · TC_02.37 ✅ PASS**
**Screenshots:** `TC02-17_PASS_no-evc-location-gia-goc.png`, `TC02-31_37_PASS_empty-state-modal.png`

---

## TC_02.33: Mobile sticky bottom bar hiển thị voucher đã áp

Fresh session (order 0000JAZO17PC), resize viewport 390×844 (mobile).

| # | Step | Action | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Fresh checkout, auto-apply CA4699 | navigate + click Mua ngay | ✅ | -10.000đ auto |
| 2 | Resize viewport → 390×844 | browser_resize | ✅ | — |
| E1 | Sticky bottom bar hiện đúng giá đã áp | browser_take_screenshot (fullPage) | ✅ PASS | "Cần thanh toán 29.900đ" + "Tiếp tục" |

**Result: ✅ PASS**
**Screenshot:** `TC02-33_mobile-viewport-check.png`

---

## TC_02.10 / TC_02.27 / TC_02.28 / TC_02.38: UI structure checks (default state)

Quan sát trực tiếp từ snapshot ban đầu (page load, trước khi thao tác voucher) — không cần thao tác riêng:
- TC_02.10: badge "5" hiện ngay khi trang tải xong → ✅ PASS
- TC_02.27: textbox "Nhập mã khuyến mãi" hiện trong section Thông tin thanh toán (= Cart page theo clarification VR-001) → ✅ PASS
- TC_02.28: section "Chọn ưu đãi" + "Áp dụng" [disabled] hiện đúng cấu trúc → ✅ PASS
- TC_02.38: badge số "5" khớp đúng 5 EVC trả về từ API `/voucher/list` → ✅ PASS

---

## Các TC còn lại (BLOCKED / N/A / Pre-BLOCKED)

Không có thao tác MCP mới trong VR-003 do thiếu test data/account đặc thù — giữ nguyên trạng thái + lý do từ VR-001 (xem `vibe-report.md` bảng "Blocked Tcs"). Không đánh dấu PASS/FAIL cho các TC này để tránh false confidence.
