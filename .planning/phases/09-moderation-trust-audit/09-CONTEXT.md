# Phase 9: Moderation, Trust & Audit Expansion - Context

**Gathered:** 2026-05-29
**Status:** In Progress (Auto Mode)
**Source:** Context auto-generated from GSD UI-SPEC, Roadmap, and Codebase Audits

<domain>
## Phase Boundary

Phase này xây dựng hạ tầng kiểm duyệt, tăng cường tính minh bạch và độ tin cậy của dữ liệu trên nền tảng Bankng. Hạng mục chính bao gồm kiểm duyệt hồ sơ Banker đăng ký mới, kiểm duyệt hàng chờ lãi suất tự động cào được (Staging Rates), và mở rộng cơ chế ghi vết Audit Logs cho các hành vi thay đổi dữ liệu nhạy cảm của Admin và Operator.

### Included in Scope:
1. **Kiểm duyệt Đăng ký của Banker (`/banker-registrations`):**
   - Hàng chờ phê duyệt các đơn đăng ký gia nhập hệ thống của Banker (Tên, SĐT, Email, Ngân hàng liên kết, Chức danh, Tỉnh thành).
   - Server Actions phê duyệt (`approve`) hoặc từ chối (`reject`) đơn đăng ký, tự động khởi tạo tài khoản User và Banker profile tương ứng khi được phê duyệt.
2. **Kiểm duyệt hàng chờ Lãi suất tự động (`/staging`):**
   - Xem danh sách các lãi suất cào được từ bot bò dữ liệu (Crawl Staging Rates).
   - So sánh thông tin cào được với sản phẩm thực tế, chỉnh sửa thông số và bấm duyệt để xuất bản (Publish) trực tiếp thành lãi suất chính thức (`InterestRateSnapshot`), hoặc từ chối để loại bỏ.
3. **Nhật ký hệ thống Audit Logs (`/audit-logs`):**
   - Trang ghi nhật ký lịch sử tất cả các hành động thay đổi dữ liệu nhạy cảm (Tạo/Sửa/Xóa Ngân hàng, Bài viết, Lãi suất, Đăng ký Banker) lưu giữ thông tin người thực hiện, thời gian, hành động, và dữ liệu metadata.

</domain>

<decisions>
## Implementation Decisions

### Architectural Stack
- **Framework:** Next.js 15 (App Router). Param objects must be handled as promises (always `await params` in Page/Layout files).
- **Data Access:** Sử dụng Prisma ORM kết nối trực tiếp database Supabase PostgreSQL (`import { prisma } from "@bankng/db"`).
- **Trạng thái duyệt Staging:** Việc phê duyệt hoặc từ chối lãi suất staging sử dụng Server Actions trong transaction an toàn, bảo đảm khi duyệt thành công sẽ chuyển đổi trực tiếp bản ghi từ `CrawlStagingRate` sang `InterestRateSnapshot` chính thức, đồng thời ghi log đầy đủ.
- **Audit Logs bảo mật:** Nhật ký hệ thống chỉ hiển thị cho tài khoản có quyền `admin.all` và được sắp xếp theo thời gian mới nhất giảm dần.

</decisions>

<canonical_refs>
## Canonical References

### Database Schema
- [packages/db/prisma/schema.prisma](file:///Users/gray/Documents/bankng/packages/db/prisma/schema.prisma) — Models: `BankerRegistration`, `CrawlStagingRate`, `AuditLog`, `InterestRateSnapshot`.

### Admin Moderation Modules
- [apps/admin/src/modules/banker-registrations](file:///Users/gray/Documents/bankng/apps/admin/src/modules/banker-registrations) — Logic phê duyệt Banker của Admin.
- [apps/admin/src/modules/staging](file:///Users/gray/Documents/bankng/apps/admin/src/modules/staging) — Logic duyệt lãi suất cào được của Admin.
- [apps/admin/src/modules/audit-logs](file:///Users/gray/Documents/bankng/apps/admin/src/modules/audit-logs) — Giao diện nhật ký hoạt động hệ thống.

</canonical_refs>

<deferred>
## Deferred Ideas

- **Ghi nhật ký thay đổi chi tiết từng trường dữ liệu (Diff-based Logging) (Phase 10):** Hiện tại audit logs chỉ lưu trữ metadata tổng quan dạng JSON. Việc xây dựng hệ thống so sánh sự thay đổi chi tiết trước/sau từng cột dữ liệu (Field Diff) được dời sang Phase 10 để bảo vệ tiến độ cốt lõi.
