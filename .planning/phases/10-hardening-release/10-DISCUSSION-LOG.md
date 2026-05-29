# Phase 10 — Discussion Log

> Autonomous discussion log generated under GSD --auto mode.

## Decisions Logged

### 1. Public Compare Web LCP & Core Web Vitals Optimization
- **Q:** Làm thế nào để đảm bảo trang so sánh lãi suất công cộng `/lai-suat` đạt điểm số LCP < 2.5s?
- **A:** [auto] Sử dụng Server-Side Rendering với Caching (ISR - Incremental Static Regeneration hoặc Dynamic revalidate định kỳ 1 giờ/lần). Tránh các render blocking scripts, sử dụng font chữ hệ thống hoặc font chữ Google được optimize sẵn từ `next/font`, và tối ưu hình ảnh bằng `next/image`. (Recommended)

### 2. Server Actions & Endpoint Security Hardening
- **Q:** Biện pháp nào dùng để thắt chặt bảo mật cho các Server Actions và API endpoints nhạy cảm ở Admin và Banker Portal?
- **A:** [auto] Mọi Server Action thực hiện mutations (thêm, sửa, xóa) bắt buộc phải gọi hàm tiện ích kiểm tra session phía server (`requireAdminSession` cho Admin, `BANKER_EMAIL` match cho Banker). Không dựa hoàn toàn vào việc ẩn giao diện ở phía client. (Recommended)

### 3. Vercel & Render Environment Configuration
- **Q:** Cấu hình build & biến môi trường nào bắt buộc phải thiết lập khi triển khai lên môi trường Cloud?
- **A:** [auto] Trên Vercel, đặt `rootDirectory` trỏ trực tiếp đến thư mục ứng dụng con và thay đổi `Build Command` thành: `cd ../.. && pnpm -F @bankng/db db:generate && pnpm -F <package-name> build`. Trên Render, sử dụng `packages/crawler/render.yaml` làm blueprint và nạp đầy đủ `DATABASE_URL` Supabase kết nối trực tiếp cổng 5432. (Recommended)

### 4. Build Verification Strategy
- **Q:** Quy trình kiểm chứng release trước khi deploy thực tế là gì?
- **A:** [auto] Thực hiện chạy `pnpm build` tại thư mục gốc của monorepo. Đây là bước kiểm tra toàn diện nhất để xác nhận TypeScript, ESlint và Next.js bundler không sinh ra bất kỳ cảnh báo nghiêm trọng hay lỗi crash nào. (Recommended)

## Deferred Ideas
- Tích hợp hệ thống phân tích lỗi thời gian thực Sentry. (Dời sang Phase 11)
- Thiết lập hạ tầng Read-Replicas cho Supabase Database đa vùng. (Dời sang Phase 11)
