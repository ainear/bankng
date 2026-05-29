# Phase 11: Real Data Ingestion & UI Resemblance Alignment - Context

**Gathered:** 2026-05-29
**Status:** In Progress (Discuss Mode)
**Source:** Context auto-generated from NganHang.com reverse-engineered routing matrix and Bankng codebase gap analysis

<domain>
## Phase Boundary

Phase này tập trung vào việc thu hẹp khoảng cách (gaps) về mặt giao diện, tính năng và dữ liệu thực tế giữa sản phẩm hiện tại (https://bankng-prod.vercel.app/) và nền tảng mẫu (https://nganhang.com). Hạng mục chính bao gồm đồng bộ dữ liệu thật, tối ưu hóa các trang so sánh sản phẩm ngân hàng và căn chỉnh giao diện UI/UX cho giống hệt phiên bản mẫu.

### Included in Scope:
1. **Đồng bộ Dữ liệu thật (Real Data Ingestion):**
   - Nạp đầy đủ thông tin logo ngân hàng chuẩn, các sản phẩm vay thực tế (Vay mua nhà, Vay mua xe, Vay tín chấp) và lãi suất thật từ Supabase database.
   - Kiểm tra và sửa lỗi cấu hình biến môi trường `DATABASE_URL` trên Vercel Production nếu đang trỏ sang database trống hoặc sai lệch.
2. **Căn chỉnh UI/UX theo mẫu NganHang.com:**
   - Điều chỉnh giao diện trang so sánh lãi suất `/lai-suat` và trang chủ `/` sử dụng font chữ Bunny Instrument Sans và tông màu xanh lục Emerald sang trọng giống hệt trang mẫu.
   - Căn chỉnh bố cục bảng lãi suất (`RateTable`) và các bộ lọc theo kỳ hạn, số tiền, loại tài sản bảo đảm.
3. **Phát triển & Bật các tính năng nâng cao còn thiếu:**
   - Căn chỉnh trang danh sách Banker chuyên nghiệp `/danh-sach-bankers` hiển thị đúng đánh giá và khu vực hoạt động.
   - Kiểm chứng luồng Đánh giá hồ sơ nhanh (`/danh-gia-nhanh/[loan-type]`) và Công cụ tính khoản vay tối đa (`/cong-cu-tinh`) giống như các công cụ trên `nganhang.com`.

</domain>

<decisions>
## Implementation Decisions

### Architectural Stack
- **Framework:** Next.js 15 (App Router).
- **Styling:** Tailwind CSS v4 kết hợp Vanilla CSS với các biến CSS màu sắc emerald tinh tế, hiện đại.
- **Data Hydration:** Nạp dữ liệu thực tế từ database Supabase trực tiếp thông qua Prisma để render nhanh bằng ISR.

</decisions>

<canonical_refs>
## Canonical References

### Target Reference Site
- [https://nganhang.com](https://nganhang.com) — Website mẫu cần căn chỉnh giao diện và tính năng.
- [scratch/inertia_props.json](file:///Users/gray/Documents/bankng/scratch/inertia_props.json) — Cấu trúc dữ liệu thật được trích xuất từ trang mẫu.

### Active App Modules
- [apps/web/src/app/page.tsx](file:///Users/gray/Documents/bankng/apps/web/src/app/page.tsx) — Trang chủ cần căn chỉnh UI.
- [apps/web/src/app/lai-suat/page.tsx](file:///Users/gray/Documents/bankng/apps/web/src/app/lai-suat/page.tsx) — Trang so sánh lãi suất chính.
- [apps/web/src/app/compare](file:///Users/gray/Documents/bankng/apps/web/src/app/compare) — Thư mục các trang so sánh sản phẩm.

</canonical_refs>

<deferred>
## Deferred Ideas

- **Hệ thống Chat trực tuyến thời gian thực giữa Khách hàng và Banker (Phase 12):** Tích hợp WebSockets/Supabase Realtime cho chatbox sẽ được dời sang Phase tiếp theo sau khi giao diện và dữ liệu được căn chỉnh xong.
- **Vòng quay may mắn trúng thưởng (Lucky Draw) cho Banker (Phase 12):** Tính năng gamification trên trang cộng đồng được dời lại để ưu tiên các luồng so sánh tài chính cốt lõi.

</deferred>
