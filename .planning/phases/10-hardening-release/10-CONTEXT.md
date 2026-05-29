# Phase 10: Hardening & Release Readiness - Context

**Gathered:** 2026-05-29
**Status:** In Progress (Auto Mode)
**Source:** Context auto-generated from GSD UI-SPEC, Roadmap, and Codebase Audits

<domain>
## Phase Boundary

Phase này tập trung vào việc tối ưu hóa hiệu năng, thắt chặt an ninh, kiểm tra cấu hình biến môi trường, tài liệu hóa quy trình triển khai thực tế (deploy) và chạy thử nghiệm build production cục bộ để đảm bảo hệ thống Bankng sẵn sàng phát hành chính thức lên môi trường sản xuất (Vercel & Render) mà không gặp bất kỳ lỗi biên dịch hay rò rỉ bảo mật nào.

### Included in Scope:
1. **Tối ưu hiệu năng LCP (Largest Contentful Paint) của Public Web:**
   - Kiểm tra các trang công cộng lớn như `/lai-suat` và `/compare/[category]`.
   - Áp dụng các kỹ thuật như caching thích hợp (Next.js ISR hoặc static rendering với revalidate định kỳ), tối ưu hóa tải tài nguyên (hình ảnh, fonts), loại bỏ render blocking scripts để đạt LCP < 2.5s theo chuẩn Core Web Vitals.
2. **Rà soát & Thắt chặt An ninh (Security Audit):**
   - Đảm bảo các API endpoints nhạy cảm ở Admin Portal (`apps/admin`) và Banker Portal (`apps/banker`) đều được bảo vệ chặt chẽ bởi middleware hoặc các chốt kiểm tra session phía máy chủ.
   - Kiểm tra kỹ lưỡng các Server Actions liên quan đến thay đổi dữ liệu nhạy cảm (như duyệt banker, xuất bản lãi suất cào, gửi lead, cập nhật thông tin bài viết) để chắc chắn không xảy ra lỗ hổng bỏ qua phân quyền.
3. **Xác thực biến môi trường & Cấu hình deploy:**
   - Kiểm tra cấu hình `rootDirectory` và `Build Command` tối ưu của Vercel cho 4 Next.js apps (`web`, `admin`, `api`, `banker`) để đảm bảo quá trình cài đặt dependencies, sinh Prisma client (`pnpm db:generate`) và build Next.js diễn ra suôn sẻ.
   - Xác nhận cấu hình blueprint của Crawler trên Render (`packages/crawler/render.yaml` và `Dockerfile`).
4. **Thử nghiệm Build Production cục bộ (Local Production Build Verification):**
   - Chạy toàn bộ tiến trình biên dịch dự án (`pnpm build`) cục bộ để giả lập môi trường triển khai thực tế.
   - Sửa đổi các lỗi biên dịch, linter hay Typecheck phát sinh nếu có để đảm bảo build pass 100% trên Vercel/Render.

</domain>

<decisions>
## Implementation Decisions

### Architectural Stack
- **Framework:** Next.js 15 (App Router). Param objects must be handled as promises (always `await params` trong Page/Layout files).
- **Data Access:** Prisma ORM kết nối trực tiếp database Supabase PostgreSQL thông qua cổng direct `5432` ổn định, tránh lỗi resolve domain Supabase của pooler.
- **Server-side Protection:** Tất cả Server Actions kiểm duyệt, phê duyệt và chỉnh sửa dữ liệu bắt buộc phải kiểm tra quyền hạn (Role check, Session validation) trước khi thực thi.

</decisions>

<canonical_refs>
## Canonical References

### Deployment Guide
- [DEPLOY.md](file:///Users/gray/Documents/bankng/DEPLOY.md) — Tài liệu hướng dẫn triển khai hệ thống chi tiết lên Vercel & Render.

### Public Web Optimization
- [apps/web/src/app/lai-suat](file:///Users/gray/Documents/bankng/apps/web/src/app/lai-suat) — Trang so sánh lãi suất công khai cốt lõi cần tối ưu hiệu năng.

### Auth & Security Guards
- [apps/admin/src/middleware.ts](file:///Users/gray/Documents/bankng/apps/admin/src/middleware.ts) — Logic chặn truy cập admin trái phép.
- [apps/banker/src/middleware.ts](file:///Users/gray/Documents/bankng/apps/banker/src/middleware.ts) — Logic bảo mật Banker Portal.

### Crawler Production Infrastructure
- [packages/crawler/Dockerfile](file:///Users/gray/Documents/bankng/packages/crawler/Dockerfile) — Cấu hình Docker cho bot cào dữ liệu Playwright trên Render.
- [packages/crawler/render.yaml](file:///Users/gray/Documents/bankng/packages/crawler/render.yaml) — Cấu hình Blueprint deploy cron job lên Render.

</canonical_refs>

<deferred>
## Deferred Ideas

- **Hạ tầng Multi-region Database Replication (Phase 11):** Sao chép cơ sở dữ liệu Supabase đa vùng để tối ưu hóa thời gian phản hồi cho người dùng toàn cầu sẽ được dời sang giai đoạn phát triển mở rộng trong tương lai.
- **Hệ thống giám sát lỗi thời gian thực Sentry Integration (Phase 11):** Tích hợp Sentry chuyên sâu vào từng Next.js application sẽ được cấu hình sau khi nền tảng chính thức hoạt động ổn định.

</deferred>
