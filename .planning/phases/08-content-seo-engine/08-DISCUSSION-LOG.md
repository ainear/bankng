# Phase 8 — Discussion Log

> Autonomous discussion log generated under GSD --auto mode.

## Decisions Logged

### 1. Admin Articles Editor Format
- **Q:** Trình soạn thảo bài viết của Admin nên hỗ trợ định dạng nào?
- **A:** [auto] Hỗ trợ định dạng văn bản thô kết hợp Markdown/HTML giúp tối giản hóa giao diện, hiển thị chính xác mà không tốn tài nguyên tải thư viện soạn thảo nặng. (Recommended)

### 2. Article Detail SEO Strategy
- **Q:** Cơ chế tối ưu hóa SEO cho trang chi tiết bài viết công khai?
- **A:** [auto] Tự động sinh `Metadata` động qua `generateMetadata` của Next.js: tự động tạo keywords, tiêu đề, và hình ảnh OpenGraph dựa trên bài viết và danh mục thực tế. (Recommended)

### 3. Dynamic Sitemap Updates
- **Q:** Sitemap của nền tảng nên được tạo tĩnh (Static) hay động (Dynamic)?
- **A:** [auto] Cấu hình động (`force-dynamic`) kết nối trực tiếp database Supabase để lập chỉ mục tức thời mọi sản phẩm, chi nhánh và tin tức mới nhất mà không cần build lại dự án. (Recommended)

## Deferred Ideas
- Tích hợp trình biên tập Rich Text Editor kéo thả cho Admin. (Dời sang Phase 10)
