# Vibe Test Report — VR-003 — v1.2 — 2026-07-02

> Platform: Web (Playwright MCP)
> Environment: STG — https://staging.tongdaiwifi.vn → staging.fpt.vn/checkout
> QC: anhdc4
> Mode: `--all` — chạy lại TOÀN BỘ 40 TC trong TC-MASTER-v1.2.xlsx (kể cả TC đã PASS ở VR-001/VR-002), overwrite kết quả cũ
> Checkout orders dùng trong run: 0000JAZE7Q9S, 0000JAZM3NLS, 0000JAZO17PC

---

## Summary

| Result | Count | % | TC IDs |
|--------|-------|---|--------|
| ✅ PASS | 14 | 35% | TC_02.1, TC_02.8, TC_02.9, TC_02.10, TC_02.15, TC_02.17, TC_02.27, TC_02.28, TC_02.31, TC_02.33, TC_02.36, TC_02.37, TC_02.38, TC_02.40 |
| ❌ FAIL | 1 | 2.5% | TC_02.12 |
| 🚫 BLOCKED (cần test data/setup) | 19 | 47.5% | TC_02.2–7, 11, 13, 14, 16, 18–25, 29 |
| Pre-BLOCKED (TC gốc, theo Notes trong Excel) | 2 | 5% | TC_02.26, TC_02.39 |
| N/A (BA xác nhận không test — feature "Điều kiện" không tồn tại trên build) | 4 | 10% | TC_02.30, TC_02.32, TC_02.34, TC_02.35 |

> So với VR-001 (9P/1F/1Partial/24B/4NA/2PreB): VR-003 **unblock thêm 5 TC** (TC_02.15, 17, 31, 33, 37 — riêng 17/37 đã unblock từ VR-002, TC_02.31 và TC_02.15/33 unblock mới ở VR-003) nhờ tái sử dụng discovery "location = key cho EVC context" (từ VR-002) + test viewport mobile.
> TC_02.12 (stacking bug) **FAIL confirmed lần 3 liên tiếp** — lần này có bằng chứng mạnh hơn: backend API `/voucher/apply` trả `success:true` với CẢ 2 voucher trong response `data[]`, không chỉ là lỗi validate phía FE.

---

## 🔴 FAIL — BUG CONFIRMED (lần 3)

### BUG-001: Voucher Stacking — TC_02.12 ❌ FAIL (High) — re-confirmed VR-003

**Mô tả:** Hệ thống cho phép chọn và apply đồng thời nhiều EVC (stack vouchers), vi phạm business rule "chỉ 1 voucher tại một thời điểm".

**Bước tái hiện:**
1. Checkout đã có CA4431GIAMTTUFSA03 (-5.000đ) đang áp (qua TC_02.8)
2. Mở modal "Chọn ưu đãi"
3. Check thêm CA4699GIAM10KPHIHOAMANG (không bỏ chọn CA4431)
4. Click "Xác nhận"

**Kết quả thực tế:**
- UI hiển thị message: *"Áp dụng ưu đãi mới thành công. Mã ưu đãi cũ đã được thay thế."* (claims old voucher replaced)
- Nhưng UI list CẢ 2 voucher: CA4431GIAMTTUFSA03 (-5.000đ) + CA4699GIAM10KPHIHOAMANG (-10.000đ)
- Cần thanh toán: **24.900đ** (39.900 − 5.000 − 10.000) → cộng dồn cả 2, không phải thay thế

**API Evidence (request/response body — request #102, POST `/voucher/apply`):**

Request:
```json
{"vouchers":[{"voucher_code":"CA4431GIAMTTUFSA03","voucher_type":"General"},{"voucher_code":"CA4699GIAM10KPHIHOAMANG","voucher_type":"General"}],"mode":"Manual"}
```

Response (`success:true`, cả 2 voucher trong `data[]`):
```json
{"success":true,"data":[
  {"voucher_code":"CA4431GIAMTTUFSA03","discount_value":5000.0,...},
  {"voucher_code":"CA4699GIAM10KPHIHOAMANG","discount_value":10000.0,...}
]}
```

**Kết quả kỳ vọng:** Chỉ 1 EVC active, discount không stack (theo TC_02.12 expected: "CO chỉ áp đúng 1 voucher (DiscountVAT cao nhất)")

**Screenshot:** `TC02-12_FAIL_stacking-confirmed.png`
**Severity:** High
**Impact:** Financial loss — request body gửi lên đã chứng minh **backend API tự nhận và xử lý cả 2 mã cùng lúc** (không phải chỉ lỗi validate ở FE như nghi ngờ ở VR-002). Message UI "Mã ưu đãi cũ đã được thay thế" gây hiểu lầm — không đúng với hành vi thực tế.
**So với VR-001/VR-002:** Cùng root cause, nhưng VR-003 có bằng chứng rõ ràng hơn — session lần này KHÔNG gặp lỗi `CHECKOUT_TOKEN_REQUIRED` như VR-002, request hoàn tất trọn vẹn với cả 2 voucher được backend xử lý thành công → xác nhận đây là lỗi cả BE lẫn FE, mức độ nghiêm trọng cao hơn đánh giá trước.

---

## ✅ Passed TCs — Re-verified VR-003 (14 TCs)

| TC ID | Nội dung | Evidence | Ghi chú |
|-------|----------|----------|---------|
| TC_02.1 | Auto-apply voucher DiscountVAT cao nhất khi load | API req#94/95: 5 EVC, CA4699=10.000đ cao nhất, auto-applied | Session lần này tự có location context sẵn (không cần setup thủ công như VR-002) |
| TC_02.8 | Chọn EVC + Xác nhận → cập nhật giá giảm | Message "Áp dụng mã ưu đãi thành công.", CA4431 -5.000đ, giá 34.900đ | — |
| TC_02.9 | Hủy EVC đang áp → reset giá gốc, không call lại QLCS | Network: chỉ có `/voucher/apply` mới, KHÔNG có `/voucher/list` re-call | — |
| TC_02.10 | Badge count EVC khi load màn hình | Badge "5" hiện ngay khi trang tải xong | — |
| TC_02.15 | Bỏ voucher auto → remove, KHÔNG auto-apply lại | Sau khi hủy CA4699 (TC_02.9), giá giữ 39.900đ, không có voucher mới tự áp | Unblock mới ở VR-003 — cùng bằng chứng với TC_02.9 |
| TC_02.17 | Không auto-apply khi 0 EVC hợp lệ | Location Hồ Chí Minh/Phường Test Hồ Chí Minh → 0 badge, giá giữ 39.900đ | Location kỹ thuật giống VR-001/VR-002 |
| TC_02.27 | Cart page = checkout, textbox "Nhập mã khuyến mãi" | Textbox hiện sẵn trong Thông tin thanh toán | Theo clarification BA (VR-001) |
| TC_02.28 | Checkout section "Chọn ưu đãi"/"Áp dụng" default | Structure đúng: textbox + "Chọn ưu đãi" + badge + button "Áp dụng" [disabled] | — |
| TC_02.31 | Modal Empty State khi không có voucher | Dialog hiện img "Không có ưu đãi" + text "Rất tiếc, quý khách không có mã ưu đãi." | Unblock mới ở VR-003 (cùng setup TC_02.17) |
| TC_02.33 | Mobile sticky bottom bar hiển thị voucher đã áp | Resize 390×844: sticky bar "Cần thanh toán 29.900đ" + "Tiếp tục", khớp voucher CA4699 áp phía trên | Unblock mới ở VR-003 (test viewport resize) |
| TC_02.36 | Đóng popup X → state unchanged | Chọn checkbox CA4580 (không confirm) → Close (X) → giá vẫn 39.900đ, không đổi | — |
| TC_02.37 | Modal trống khi không có EVC | Cùng evidence TC_02.31 | — |
| TC_02.38 | Badge số EVC đúng trên nút "Chọn ưu đãi" | Badge "5" khớp đúng 5 EVC trả về từ `/voucher/list` | — |
| TC_02.40 | Modal mở từ cache, không gọi lại GetListEvoucher | Fresh session mới (order 0000JAZM3NLS): mở modal lần đầu → vẫn chỉ 1 lần gọi `/voucher/list` | Test với session hoàn toàn mới, không phải retest cũ |

---

## 🚫 Blocked TCs — Vẫn cần setup test data / business state phức tạp (19 TCs)

Không đổi so với VR-001 — chưa có test data/account phù hợp để trigger các state sau:

| Nhóm | TC ID | Cần gì |
|------|-------|--------|
| Context switch + best-voucher re-eval | TC_02.2, 02.3 | Đổi Gói/PTTT/địa chỉ giữa 2 context đều có EVC khác nhau |
| hasManualVoucher combos | TC_02.4, 02.5, 02.13, 02.14, 02.16 | Checkout có cả manual + auto cùng lúc, hoặc chỉ còn manual |
| Recheck lúc Thanh toán | TC_02.6, 02.18, 02.22, 02.25 | Trigger Recheck result=1/0/-1 tại bước bấm "Thanh toán" (cần mock/test EVC đặc thù) |
| Màn Chi tiết Ưu đãi | TC_02.7 | Cần "Sử dụng ưu đãi" flow riêng, chưa map được từ modal hiện tại |
| Điều kiện PTTT/địa chỉ/chu kỳ | TC_02.11, 02.24 | EVC ràng buộc theo PTTT cụ thể (Momo-only, COD-only) |
| Exception handling | TC_02.19, 02.20, 02.21, 02.23 | EVC invalid sau đổi context, EVC hết quota |
| Modal tabs | TC_02.29 | Account có voucher loại "Mã giảm giá" (tab thứ 2) — hiện chỉ có "Ưu đãi" |

---

## Pre-BLOCKED (theo Notes gốc trong TC-MASTER Excel) — 2 TCs

| TC ID | Lý do |
|-------|-------|
| TC_02.26 | `[BLOCKED]` — Apply request field `source`='auto' khi auto-apply (cần network inspect sâu hơn field cụ thể, đã note sẵn trong Excel) |
| TC_02.39 | `[BLOCKED]` — Voucher card trạng thái disabled/đã dùng/hết hạn (cần account có voucher ở trạng thái này) |

## N/A — BA xác nhận không test (4 TCs)

| TC ID | Lý do |
|-------|-------|
| TC_02.30, 02.32, 02.34, 02.35 | Link "Điều kiện" trên voucher card KHÔNG tồn tại trong build hiện tại (đã xác nhận từ VR-001) |

---

## Locator Coverage

| Page | Elements captured (verified ✅ qua MCP run này) | Not found 🚫 |
|------|------------------------------------------------|-------------|
| Checkout /payment | 20+ (bao gồm success message, empty-state, sticky mobile bar) | 0 |

→ Xem chi tiết: `vibe-locators.md` (run này) + `08_test-runs/vibe/vibe-locators-latest.md` (merged, implement-automation đọc file này).

**Discoveries mới trong VR-003:**
- Success message text khi apply voucher đơn: `"Áp dụng mã ưu đãi thành công."`
- Message (misleading) khi "stack" 2 voucher: `"Áp dụng ưu đãi mới thành công. Mã ưu đãi cũ đã được thay thế."`
- Empty-state modal: `img "Không có ưu đãi"` + `paragraph "Rất tiếc, quý khách không có mã ưu đãi."`
- Mobile sticky bottom bar (≤390px): hiện "Cần thanh toán" + giá + button "Tiếp tục", đè lên nội dung phía dưới
- Session mới (fresh navigate từ product page) tự động có location context sẵn (có thể do IP-based geo default) → auto-apply xảy ra kể cả khi KHÔNG chủ động chọn địa chỉ — khác với VR-002 (phải set địa chỉ thủ công). Cần BA confirm đây là hành vi ổn định hay phụ thuộc network/IP tester.

---

## Recommendation

| Action | TCs | Priority |
|--------|-----|---------|
| **Escalate BUG-001** — bằng chứng mới cho thấy lỗi ở cả BE, không chỉ FE | TC_02.12 | 🔴 Ngay — cập nhật bug report BUG-001 |
| Automate ngay — locator đã verify qua MCP 3 lần liên tiếp, ổn định | TC_02.1, 8, 9, 10, 15, 17, 27, 28, 31, 33, 36, 37, 38, 40 | 🟢 Sẵn sàng cho `/implement-automation` |
| Setup test data cho business-rule combos | TC_02.2–7, 11, 13, 14, 16, 18–25, 29 | 🟠 Cần plan riêng (test account với EVC đa điều kiện) |
| Clarify field `source` trong request auto-apply | TC_02.26 | 🟡 Cần BA/Dev |
| Setup account có voucher disabled/expired | TC_02.39 | 🟡 Cần test data |
| Bỏ qua — feature không tồn tại trên build | TC_02.30, 32, 34, 35 | ⚪ N/A, giữ nguyên |
