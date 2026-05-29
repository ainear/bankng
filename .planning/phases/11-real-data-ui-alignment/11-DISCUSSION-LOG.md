# Phase 11 — Discussion Log

> Autonomous discussion log generated under GSD --auto mode.

## Decisions Logged

### 1. Database Connection & Missing Data Analysis
- **Q:** Tại sao trang web production https://bankng-prod.vercel.app/ hiển thị trống không có dữ liệu mặc dù database Supabase đã có seed data?
- **A:** [auto] Cần kiểm tra biến môi trường `DATABASE_URL` trên Vercel Dashboard của dự án `bankng-prod` để đảm bảo nó đang kết nối chính xác tới Supabase database thật chứa 134 bản ghi lãi suất và 28 ngân hàng, thay vì kết nối tới một database rỗng hoặc chưa được chạy lệnh `pnpm db:seed` trên production. (Recommended)

### 2. UI/UX Style Resemblance with NganHang.com
- **Q:** Làm thế nào để giao diện của Bankng trông giống hệt và chuyên nghiệp như NganHang.com?
- **A:** [auto] Cập nhật font chữ chính sang Instrument Sans từ Google Fonts hoặc Bunny Fonts, điều chỉnh hệ màu sắc chủ đạo CSS sử dụng tông màu lục ngọc bảo Emerald thanh lịch (Emerald 800 - 950) kết hợp hiệu ứng Glassmorphism sắc nét cho các thẻ Rate Table và Banker Card. (Recommended)

### 3. Missing Feature Alignment
- **Q:** Các chức năng so sánh nâng cao nào cần được căn chỉnh cho khớp với NganHang.com?
- **A:** [auto] Cải tiến bộ lọc so sánh tại trang `/compare/[category]` (vay mua nhà, vay mua xe) để hỗ trợ lọc theo số tiền vay, thời gian vay, và nhóm ngân hàng (Big4, Thương mại cổ phần, Nước ngoài) y hệt như bộ lọc của trang mẫu. (Recommended)

## Deferred Ideas
- Tích hợp phòng chat trực tiếp (Chat Room) thời gian thực bằng Supabase Realtime. (Dời sang Phase 12)
- Xây dựng Vòng quay may mắn (Lucky Draw) cho Banker. (Dời sang Phase 12)
