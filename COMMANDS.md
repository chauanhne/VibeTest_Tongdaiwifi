# COMMANDS.md — ecom-autovoucher

> Copy-paste lệnh bên dưới vào Claude Code để chạy từng bước.

## Pipeline Flow

```
/create-test-plan → /analyze-requirements → /generate-tc → /review-tc → /execute-maintain → /test-report
```

---

## 1. Init & Setup

```bash
# Đã hoàn thành ✅
/init-project
```

---

## 2. Test Plan

```bash
# Tạo test plan mới
/create-test-plan --create

# Xem test plan hiện tại
/create-test-plan --view
```

---

## 3. Analyze Requirements

```bash
# Phân tích tài liệu lần đầu (đặt file vào 00_input/v1.2/ trước)
/analyze-requirements --init @00_input/v1.2/<tên-file>

# Phân tích version mới / delta
/analyze-requirements --delta @00_input/v1.2/<tên-file-mới>

# Completeness sweep (rà lại coverage gap)
/analyze-requirements --sweep
```

---

## 4. Generate Test Cases

```bash
# Tạo TC standard (mặc định)
/generate-tc

# Tạo TC cho module cụ thể
/generate-tc --module VOUCHER

# Comprehensive mode (áp dụng 8 kỹ thuật test design)
/generate-tc --mode comprehensive

# Selective techniques
/generate-tc --techniques EP,BVA,EG

# Consolidate TC-MASTER từ nhiều fragments
/generate-tc --consolidate
```

---

## 5. Automation (Playwright)

```bash
# Scaffold source code Playwright
/init-source-code --archetype playwright-ts

# Implement automation từ TC
/implement-automation --module VOUCHER

# Scan source code
/scan-source-code

# Review source vs TC
/review-src-tc
```

---

## 6. Review TC

```bash
# Review toàn bộ TC-MASTER
/review-tc

# Review fragment cụ thể
/review-tc --file 03_test-cases/fragments/TC-VOUCHER-fragment.xlsx
```

---

## 7. Bug Logging

```bash
# Log bug mới
/log-bug

# Log bug với thông tin nhanh
/log-bug --title "Voucher không áp dụng được" --severity High --module VOUCHER
```

---

## 8. Test Execution

```bash
# Track test execution
/execute-maintain --run v1.2

# Vibe test (exploratory)
/vibe-test --url https://staging.tongdaiwifi.vn/dich-vu-so/goi-ultra-fast
```

---

## 9. Reports

```bash
# Tạo test report
/test-report

# Test report theo version
/test-report --version v1.2
```

---

## 10. Health Check

```bash
# Validate data consistency
/health-check
```

---

## Folder Quick Reference

| Cần làm gì | Đặt file ở đâu |
|-----------|----------------|
| Upload tài liệu SRS/specs | `00_input/v1.2/` |
| Xem test plan | `01_test-plans/` |
| Xem analyze output | `02_analyze-requirements/v1.2/` |
| Xem TC Excel | `03_test-cases/v1.2/functional/` |
| Xem bug report | `05_bug-reports/` |
| Xem test report | `09_reports/` |
