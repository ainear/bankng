# Phase 9 — Discussion Log

> Autonomous discussion log generated under GSD --auto mode.

## Decisions Logged

### 1. Banker Registration Approval Flow
- **Q:** Quy trình phê duyệt hồ sơ đăng ký gia nhập của Banker hoạt động thế nào?
- **A:** [auto] Phê duyệt đơn đăng ký sẽ tự động tạo User (nếu chưa có) và hồ sơ Banker tương ứng, gán cho ngân hàng và khu vực đã chọn. (Recommended)

### 2. Crawl Staging Rates Verification Flow
- **Q:** Cơ chế phê duyệt lãi suất tự động cào được (Staging Rates)?
- **A:** [auto] Admin xem danh sách so sánh, có thể chỉnh sửa thông số sai lệch trước khi bấm "Duyệt và Xuất bản" trực tiếp lên bảng lãi suất chính thức. (Recommended)

### 3. Operational Audit Logging Schema
- **Q:** Các hoạt động nào cần được ghi nhật ký hệ thống (Audit Logs)?
- **A:** [auto] Ghi nhật ký tất cả các hành động Tạo/Sửa/Xóa đối với Ngân hàng, Bài viết, Lãi suất và Đơn đăng ký Banker, lưu vết actorId, action, entityId và metadata JSON để dễ đối soát. (Recommended)

## Deferred Ideas
- Xây dựng hệ thống so sánh sự thay đổi chi tiết từng trường dữ liệu trước/sau (Diff-based Logging). (Dời sang Phase 10)
