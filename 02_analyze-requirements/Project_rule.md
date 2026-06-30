# Project Rule — ecom-autovoucher

## §1 Project Info
- **Project name:** ecom-autovoucher
- **QC phụ trách:** anhdc4
- **Version hiện tại:** v1.2
- **Ngôn ngữ TC:** Tiếng Việt
- **Mode:** Solo

## §2 Môi trường
| Env | URL |
|-----|-----|
| STG | https://staging.tongdaiwifi.vn/dich-vu-so/goi-ultra-fast |

> Flow chính: click "Mua ngay" → màn hình Thanh toán

## §3 Loại kiểm thử
- Functional

## §4 Automation
- **Framework:** Playwright
- **Source code:** `10_source-code/`

## §5 Naming Convention
- Test plan: `TP-<module>-v<X>.md`
- Test case ID: `TC-<MODULE>-<NNN>` (vd `TC-VOUCHER-001`)
- Bug report: `BUG-<NNN>-<slug>.md`
- Fragment file: `fragments/TC-<MODULE>-fragment.xlsx`

## §6 Folder Reference
| Folder | Mục đích |
|--------|----------|
| `00_input/` | Tài liệu đầu vào (SRS, URD, specs) |
| `01_test-plans/` | Test plan files |
| `02_analyze-requirements/` | Analyze output, scenario map, traceability |
| `03_test-cases/` | TC Excel fragments + TC-MASTER |
| `04_test-data/` | Test data (valid / invalid) |
| `05_bug-reports/` | Bug report files |
| `06_checklists/` | Checklist nhanh |
| `07_environments/` | Env config, account test |
| `08_test-runs/` | Kết quả test run |
| `09_reports/` | Test summary report |
| `10_source-code/` | Playwright automation source |
| `11_tc-review/` | TC review output |

## §7 TC Language
Viết test case bằng **Tiếng Việt**.
- Step: động từ + đối tượng (vd "Nhập email hợp lệ vào ô Email")
- Expected: trạng thái kết quả (vd "Hệ thống hiển thị thông báo thành công")

## §8 Version History
| Version | Ngày | Ghi chú |
|---------|------|---------|
| v1.2 | 2026-06-30 | Khởi tạo project |

## §9 Requirement Notation

## DOC Notation
req_notation: AC
# AC: Acceptance Criteria — analyze-requirements sẽ map cột "Nguồn" theo AC-ID

## §10 Custom Rules
<!-- Thêm rule dự án đặc thù tại đây -->
