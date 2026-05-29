# Phase 7: Lead CRM & Routing - Context

**Gathered:** 2026-05-29
**Status:** In Progress (Auto Mode)
**Source:** Context auto-generated from GSD UI-SPEC, Roadmap, and Database Schemas

<domain>
## Phase Boundary

Phase này xây dựng vòng đời hoàn chỉnh của Lead (Khách hàng đăng ký tư vấn) từ lúc khách hàng gửi yêu cầu ở trang so sánh công khai, qua hệ thống phân phối tự động của Admin, đến màn hình xử lý Lead CRM của Banker và giao diện giám sát của Admin.

### Included in Scope:
1. **Thu thập Lead phía công khai (Lead Capture):**
   - Hoàn thiện các API và biểu mẫu đăng ký tư vấn trên trang công khai của sản phẩm/chi nhánh/ngân hàng.
   - Chuẩn hóa số điện thoại khách hàng và kiểm tra chống trùng lắp (Deduplication) trong vòng 24 giờ.
2. **Thuật toán phân phối Lead tự động (Auto-Routing):**
   - Phân phối Lead dựa trên **Khu vực hoạt động** (provinceCode) và **Chuyên môn tư vấn** (specialty) của các Banker đã được xác thực (`isVerified = true`).
   - Nếu có nhiều Banker phù hợp, áp dụng cơ chế xoay vòng (Round-Robin) dựa trên số lượng lead đang xử lý ít nhất.
   - Nếu không có Banker nào phù hợp, lead sẽ được giữ trong hàng chờ chung (Lead Pool) để Admin phân phối thủ công.
3. **Màn hình CRM của Banker (`/leads`):**
   - Banker xem danh sách Lead được gán cho mình, phân loại theo trạng thái: Mới (`new`), Đã liên hệ (`contacted`), Đã chốt (`qualified`), Đóng (`closed`).
   - Banker có thể xem chi tiết thông tin khách hàng, lịch sử ghi chú, và cập nhật trạng thái xử lý kèm lý do/ghi chú.
4. **Trang quản trị Lead của Admin (Admin CRM):**
   - Quản trị viên theo dõi toàn bộ lead trong hệ thống, phân công lại (Reassign) cho Banker khác hoặc phê duyệt thủ công các lead trong hàng chờ chung.

</domain>

<decisions>
## Implementation Decisions

### Architectural Stack
- **Framework:** Next.js 15 (App Router). Param objects must be handled as promises (always `await params` in Page/Layout files).
- **Data Access:** Sử dụng Prisma ORM kết nối trực tiếp với Supabase PostgreSQL (`import { prisma } from "@bankng/db"`).
- **UI Components:** Sử dụng các thành phần từ thư viện chung `@bankng/ui` và Tailwind CSS cho giao diện quản trị lead của cả Banker và Admin.

### Business & UI Logic
- **Chuẩn hóa số điện thoại:** Số điện thoại nhập vào sẽ được chuẩn hóa loại bỏ khoảng trắng, dấu chấm, và chuyển đổi đầu số quốc gia (ví dụ: `0987654321` hoặc `+84987654321` đều được lưu `phoneNormalized` dưới định dạng thống nhất `0987654321`) để tối ưu so khớp chống trùng.
- **Phân phối vòng tròn (Round-Robin):** Thuật toán tìm kiếm tất cả các Banker có `isVerified = true` thỏa mãn `provinceCode` trùng với Lead và trường `specialties` chứa loại sản phẩm tương ứng. Gán lead cho Banker có số lượng lead ở trạng thái `new` và `contacted` ít nhất tại thời điểm đó để đảm bảo công bằng và tốc độ phản hồi tối ưu.
- **Lịch sử trạng thái (LeadStatusHistory):** Mỗi lần trạng thái lead thay đổi, một bản ghi lịch sử `LeadStatusHistory` bắt buộc phải được tạo để lưu vết người thực hiện, trạng thái cũ, trạng thái mới, và ghi chú lý do.

</decisions>

<canonical_refs>
## Canonical References

### Database Schema
- [packages/db/prisma/schema.prisma](file:///Users/gray/Documents/bankng/packages/db/prisma/schema.prisma) — Các models: `Lead`, `LeadStatusHistory`, `Banker`, `User`.

### Routing Folders (Banker Portal)
- [apps/banker/src/app/leads](file:///Users/gray/Documents/bankng/apps/banker/src/app/leads) — Giao diện quản lý inbox lead của Banker.

### Routing Folders (Admin Portal)
- [apps/admin/src/app/leads](file:///Users/gray/Documents/bankng/apps/admin/src/app/leads) — Giao diện quản lý toàn bộ Lead và cấu hình phân phối của Admin.

</canonical_refs>

<deferred>
## Deferred Ideas

- **Tự động gửi thông báo SMS/Zalo/Email (Phase 10):** Việc tích hợp các dịch vụ bên thứ ba để nhắn tin thông báo tự động cho khách hàng và banker khi có lead mới được dời lại sang Phase 10 để bảo vệ tiến độ cốt lõi.
