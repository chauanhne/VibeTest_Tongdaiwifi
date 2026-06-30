# MCP Session Log — VR-002 — 2026-06-30

## Session Info
- Platform: Web (Playwright MCP)
- Base URL: https://staging.tongdaiwifi.vn/dich-vu-so/goi-ultra-fast
- Session started: 2026-06-30 (lần 2 — retest TC_02.1 + TC_02.12)
- Pre-flight: ✅ browser_navigate + browser_snapshot both OK

---

## Pre-flight Check Results

| Step | Call | Result |
|------|------|--------|
| 1 | browser_navigate(base_url) | ✅ OK — Title: "Gói Ultra Fast" |
| 2 | browser_snapshot() | ✅ OK — Accessibility tree retrieved |
| Pre-flight | | ✅ PASSED |

---

## Call History

| # | MCP Method | Args (summary) | Result | TC / Purpose |
|--:|-----------|----------------|--------|--------------|
| 1 | browser_navigate | https://staging.tongdaiwifi.vn/dich-vu-so/goi-ultra-fast | OK | Pre-flight |
| 2 | browser_snapshot | — | OK | Pre-flight |
| 3 | browser_take_screenshot | preflight_product-page.png | OK | Pre-flight evidence |
| 4 | browser_click | button "Mua ngay" [ref=e117] | OK → checkout 0000J93TFD8G | Flow entry |
| 5 | browser_click | button "Đồng ý" cookie consent | OK | Cookie consent |
| 6 | browser_network_requests | filter=/voucher/ | OK — list:200 (0 EVC), apply:200 (0 vouchers) | Check initial EVC |
| 7 | browser_snapshot | "Thông tin thanh toán" section | OK — no voucher, 39.900đ | State check |
| 8 | browser_click | text=Chọn ưu đãi | OK → modal open | Modal check |
| 9 | browser_snapshot | dialog "Chọn ưu đãi" | OK — "Không có ưu đãi" | TC_02.17/37 evidence |
| 10 | browser_take_screenshot | checkout_initial_no-voucher.png | OK | Evidence |
| 11 | browser_click | button Close [ref=f4e77] | OK | Modal close |
| 12 | browser_navigate | checkout/0000J8NENJ1C (VR-001 URL) | OK → expired dialog | Old order check |
| 13 | browser_snapshot | dialog "Thông báo" | OK — expired | VR-001 order expired |
| 14 | browser_click | button "Đồng ý" expired dialog | OK → redirect tongdaiwifi.vn | — |
| 15 | browser_navigate | checkout/0000J93TFD8G | OK | Back to new checkout |
| 16 | browser_type | textbox SĐT → "0343439724" | OK | Enter test phone |
| 17 | browser_click | checkbox "Tôi muốn nhận hóa đơn" [ref=f4e31] | OK | Open address form |
| 18 | browser_snapshot | address form area | OK | Verify form opened |
| 19 | browser_click | button "Chọn tỉnh thành phố" [ref=f4e131] | OK | Province dropdown |
| 20 | browser_snapshot | province dropdown | OK | Verify dropdown |
| 21 | browser_click | "Hà Nội" [ref=f4e157] | OK | Select Hà Nội |
| 22 | browser_click | button "Chọn phường/xã" [ref=f4e196] | OK | Ward dropdown |
| 23 | browser_snapshot | ward dropdown | OK | Verify dropdown |
| 24 | browser_click | "Phường Cầu Giấy" [ref=f4e223] | OK | Select Phường Cầu Giấy |
| 25 | browser_click | button "Chọn tên đường" [ref=f4e203] | OK | Street dropdown |
| 26 | browser_snapshot | street dropdown | OK | Verify dropdown |
| 27 | browser_click | "Phạm Văn Bạch" [ref=f4e385] | OK | Select Phạm Văn Bạch |
| 28 | browser_network_requests | filter=/voucher/ | OK — list:200 (5 EVC), apply → CA4699 | TC_02.1 verify |
| 29 | browser_snapshot | "Thông tin thanh toán" | OK — CA4699 applied, -10.000đ, 29.900đ | TC_02.1 verify |
| 30 | browser_take_screenshot | TC02-01_auto-apply-triggered.png | OK | TC_02.1 evidence |
| 31 | browser_click | text=Chọn ưu đãi | OK → modal open | Modal inspect |
| 32 | browser_snapshot | dialog "Chọn ưu đãi" | OK — 5 EVCs, CA4699 [checked] | TC_02.1 modal verify |
| 33 | browser_take_screenshot | TC02-01_modal-5evc-CA4699-checked.png | OK | TC_02.1 evidence |
| 34 | browser_click | CA4580 checkbox [ref=f4e838] | OK — check CA4580 | TC_02.1 discount verify |
| 35 | browser_click | button Xác nhận [ref=f4e866] | OK — apply CA4580 | TC_02.1 discount verify |
| 36 | browser_snapshot | Thông tin thanh toán | OK — CA4580 -5.000đ, 34.900đ | CA4580 = 5.000đ confirmed |
| 37 | browser_take_screenshot | TC02-01_CA4608-applied.png | OK | Evidence |
| 38 | browser_click | text=Chọn ưu đãi | OK → modal | CA4608 test |
| 39 | browser_click | CA4608 checkbox [ref=f4e849] | OK | Select CA4608 |
| 40 | browser_click | button Xác nhận (role) | OK — apply CA4608 | API resolves to CA4580 |
| 41 | browser_network_request | req#55 request-body | CA4608GIAMTTUFSA522 | Verify code sent |
| 42 | browser_network_request | req#55 response-body | CA4580GIAMTTUFSA03, discount=5000 | CA4608 = alias of CA4580 |
| 43 | browser_take_screenshot | TC02-01_CA4656-applied.png | OK | Evidence |
| 44 | browser_click | text=Chọn ưu đãi | OK → modal | CA4656 test |
| 45 | browser_click | CA4656 checkbox [ref=f4e860] | OK | Select CA4656 |
| 46 | browser_click | button Xác nhận (role) | OK — apply CA4656 | API resolves to CA4580 |
| 47 | browser_network_request | req#57 request-body | CA4656GIAMUTFSANHHCM1 | Verify code sent |
| 48 | browser_network_request | req#57 response-body | CA4580GIAMTTUFSA03, discount=5000 | CA4656 = alias of CA4580 |
| 49 | browser_network_request | req#49 response-body | CA4699, discount=10000 | CA4699 = 10.000đ confirmed |
| 50 | browser_take_screenshot | TC02-01_CA4656-fullpage.png | OK | Evidence |
| **TC_02.1 concluded: ✅ PASS** | | | | |
| 51 | browser_click | text=Chọn ưu đãi | OK → modal | TC_02.12 setup |
| 52 | browser_snapshot | dialog "Chọn ưu đãi" | OK — CA4580 [checked] + rest unchecked | TC_02.12 precondition |
| 53 | browser_click | CA4580 checkbox [ref=f4e838] | OK — uncheck CA4580 | TC_02.12 setup |
| 54 | browser_click | CA4699 checkbox [ref=f4e815] | OK — check CA4699 | TC_02.12 setup |
| 55 | browser_snapshot | dialog — state verify | OK — CA4699 [checked], CA4431 [unchecked] | Verify state |
| 56 | browser_click | CA4431 checkbox [ref=f4e826] | OK — check CA4431 (WITH CA4699 still checked) | TC_02.12 stacking action |
| 57 | browser_snapshot | dialog — state verify | OK — CA4699 [checked] + CA4431 [checked] = 2 EVCs | TC_02.12 state confirm |
| 58 | browser_click | button Xác nhận (role) | OK → submit | TC_02.12 trigger |
| 59 | browser_take_screenshot | TC02-12_stacking-retest.png | OK | TC_02.12 evidence |
| 60 | browser_network_requests | filter=voucher/apply | OK — req#58 | TC_02.12 API verify |
| 61 | browser_network_request | req#58 request-body | [CA4699, CA4431] = 2 codes sent | TC_02.12 BUG evidence |
| 62 | browser_network_request | req#58 response-body | {success:false, CHECKOUT_TOKEN_REQUIRED} | TC_02.12 API rejection |
| 63 | browser_take_screenshot | TC02-12_multi-select-request-body.png | OK | TC_02.12 final evidence |
| **TC_02.12 concluded: ❌ FAIL** | | | | |

---

## MCP Call Stats

| Metric | Value |
|--------|-------|
| Total MCP calls | 63 |
| browser_snapshot | ~12 |
| browser_click | ~25 |
| browser_network_request(s) | ~10 |
| browser_take_screenshot | ~10 |
| browser_navigate | 4 |
| browser_type | 1 |

---

## Status

✅ VR-002 COMPLETED — 2026-06-30
- TC_02.1: ✅ PASS (upgraded từ PARTIAL)
- TC_02.12: ❌ FAIL (confirmed)
