# Phase 8: Content & SEO Engine - Context

**Gathered:** 2026-05-29
**Status:** In Progress (Auto Mode)
**Source:** Context auto-generated from GSD UI-SPEC, Roadmap, and Codebase Audits

<domain>
## Phase Boundary

Phase này xây dựng hạ tầng quản lý nội dung bài viết tin tức, cẩm nang tài chính, bảng giải nghĩa thuật ngữ (Glossary), các câu hỏi thường gặp (FAQ) và cơ sở hạ tầng tối ưu hóa công cụ tìm kiếm (robots, dynamic sitemaps, OpenGraph metadata) để thu hút lượng truy cập tự nhiên cho nền tảng Bankng.

### Included in Scope:
1. **Quản lý Bài viết & Danh mục phía Admin:**
   - Tạo mới, chỉnh sửa, xóa và xuất bản bài viết tin tức/cẩm nang với nội dung định dạng Markdown/HTML.
   - Quản lý danh mục bài viết (tin tức, cẩm nang, phân tích, khuyến mãi) có thứ tự sắp xếp.
2. **Giao diện Tin tức & Bài viết phía Công khai (`/tin-tuc`):**
   - Màn hình danh sách tin tức phân loại theo danh mục, hiển thị bài viết nổi bật (Featured).
   - Màn hình chi tiết bài viết hỗ trợ đầy đủ SEO Metadata (Title, Description, Keywords, OpenGraph).
3. **Bảng thuật ngữ tài chính A-Z (`/thuat-ngu`):**
   - Trang tra cứu và giải nghĩa các thuật ngữ tài chính (ví dụ: lãi suất thả nổi, tín chấp, thế chấp) sắp xếp theo bảng chữ cái.
4. **Hạ tầng Tối ưu hóa SEO:**
   - Tệp [sitemap.ts](file:///Users/gray/Documents/bankng/apps/web/src/app/sitemap.ts) động kết nối trực tiếp database để tự động lập chỉ mục bài viết, sản phẩm, chuyên mục, chi nhánh và tỉnh thành.
   - Tệp [robots.ts](file:///Users/gray/Documents/bankng/apps/web/src/app/robots.ts) điều hướng bot tìm kiếm.

</domain>

<decisions>
## Implementation Decisions

### Architectural Stack
- **Framework:** Next.js 15 (App Router). Param objects must be handled as promises (always `await params` in Page/Layout files).
- **Data Access:** Sử dụng Prisma ORM kết nối trực tiếp database (`import { prisma } from "@bankng/db"`).
- **SEO Metadata:** Tự động tạo tiêu đề, mô tả, và hình ảnh xem trước (OpenGraph) động cho từng bài viết cụ thể để tối ưu hóa hiển thị khi chia sẻ trên mạng xã hội (Facebook, Zalo).
- **Sitemap Cập nhật Tức thời:** Cấu hình sitemap sử dụng `force-dynamic` và `revalidate = 0` bảo đảm bot luôn nhận được danh sách bài viết và chi nhánh ngân hàng mới nhất mà không cần build lại ứng dụng.

</decisions>

<canonical_refs>
## Canonical References

### Database Schema
- [packages/db/prisma/schema.prisma](file:///Users/gray/Documents/bankng/packages/db/prisma/schema.prisma) — Model `Article` và `ArticleCategory`.

### Admin Content Module
- [apps/admin/src/modules/articles](file:///Users/gray/Documents/bankng/apps/admin/src/modules/articles) — Toàn bộ logic Server Actions, schemas và giao diện quản lý bài viết của Admin.

### Web Public Content
- [apps/web/src/app/tin-tuc](file:///Users/gray/Documents/bankng/apps/web/src/app/tin-tuc) — Danh sách tin tức và chi tiết bài viết công khai.
- [apps/web/src/app/thuat-ngu/page.tsx](file:///Users/gray/Documents/bankng/apps/web/src/app/thuat-ngu/page.tsx) — Trang tra cứu bảng thuật ngữ tài chính A-Z.
- [apps/web/src/app/sitemap.ts](file:///Users/gray/Documents/bankng/apps/web/src/app/sitemap.ts) — Định nghĩa sitemap động của monorepo.

</canonical_refs>

<deferred>
## Deferred Ideas

- **Tích hợp trình soạn thảo WYSIWYG (Rich Text Editor) trực quan (Phase 10):** Tạm thời Admin soạn thảo bài viết bằng định dạng văn bản thô hoặc Markdown/HTML. Việc tích hợp trình soạn thảo kéo thả WYSIWYG cao cấp được dời sang Phase 10 để bảo vệ tiến trình cốt lõi.
