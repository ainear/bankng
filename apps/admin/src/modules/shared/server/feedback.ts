const feedbackCatalog = {
  bank_created: { tone: "success", title: "Đã tạo ngân hàng", description: "Ngân hàng mới đã được thêm vào danh mục." },
  bank_updated: { tone: "success", title: "Đã cập nhật ngân hàng", description: "Thông tin ngân hàng đã được lưu." },
  bank_deleted: { tone: "success", title: "Đã xóa ngân hàng", description: "Ngân hàng đã được gỡ khỏi danh mục và audit log đã được ghi." },
  branch_created: { tone: "success", title: "Đã tạo chi nhánh", description: "Chi nhánh mới đã sẵn sàng để gắn rates theo khu vực." },
  branch_updated: { tone: "success", title: "Đã cập nhật chi nhánh", description: "Thông tin chi nhánh đã được cập nhật." },
  branch_deleted: { tone: "success", title: "Đã xóa chi nhánh", description: "Chi nhánh đã được gỡ khỏi danh mục và audit log đã được ghi." },
  category_created: { tone: "success", title: "Đã tạo danh mục", description: "Danh mục mới đã được thêm vào hệ thống." },
  category_updated: { tone: "success", title: "Đã cập nhật danh mục", description: "Danh mục đã được lưu." },
  category_deleted: { tone: "success", title: "Đã xóa danh mục", description: "Danh mục đã được gỡ khỏi hệ thống." },
  product_created: { tone: "success", title: "Đã tạo sản phẩm", description: "Sản phẩm mới đã được thêm vào danh mục." },
  product_updated: { tone: "success", title: "Đã cập nhật sản phẩm", description: "Sản phẩm đã được cập nhật." },
  product_deleted: { tone: "success", title: "Đã xóa sản phẩm", description: "Sản phẩm đã được gỡ khỏi danh mục." },
  variant_created: { tone: "success", title: "Đã tạo biến thể", description: "Biến thể mới đã sẵn sàng cho rate snapshots." },
  variant_updated: { tone: "success", title: "Đã cập nhật biến thể", description: "Biến thể đã được cập nhật." },
  variant_deleted: { tone: "success", title: "Đã xóa biến thể", description: "Biến thể đã được xóa khỏi sản phẩm." },
  rate_source_created: { tone: "success", title: "Đã tạo nguồn dữ liệu", description: "Nguồn dữ liệu mới đã sẵn sàng để dùng cho verification." },
  rate_source_updated: { tone: "success", title: "Đã cập nhật nguồn dữ liệu", description: "Nguồn rate đã được cập nhật." },
  rate_source_deleted: { tone: "success", title: "Đã xóa nguồn dữ liệu", description: "Nguồn rate đã được xóa khỏi danh mục." },
  rate_created: { tone: "success", title: "Đã tạo bản ghi lãi suất", description: "Rate mới đã được thêm vào hệ thống." },
  rate_updated: { tone: "success", title: "Đã cập nhật lãi suất", description: "Rate snapshot đã được cập nhật." },
  rate_verified: { tone: "success", title: "Đã xác minh lãi suất", description: "Rate đã được xác minh và lưu lịch sử verification." },
  rate_rejected: { tone: "warning", title: "Đã từ chối lãi suất", description: "Rate đã được đánh dấu cần xem lại trước khi dùng." },
  rate_expired: { tone: "warning", title: "Đã hết hạn lãi suất", description: "Rate đã được đánh dấu hết hiệu lực." },
  rate_deleted: { tone: "success", title: "Đã xóa bản ghi lãi suất", description: "Rate snapshot đã được xóa khỏi hệ thống." },
  lead_updated: { tone: "success", title: "Đã cập nhật lead", description: "Trạng thái/assignment của lead đã được lưu." },
  staging_approved: { tone: "success", title: "Đã duyệt staging rate", description: "Staging rate đã được approve và publish." },
  staging_rejected: { tone: "warning", title: "Đã từ chối staging rate", description: "Staging rate đã được reject." },
  staging_bulk_approved: { tone: "success", title: "Đã duyệt nhiều staging rates", description: "Các staging rates đã được approve." },
  staging_bulk_rejected: { tone: "warning", title: "Đã từ chối nhiều staging rates", description: "Các staging rates đã được reject." },
  staging_deleted: { tone: "success", title: "Đã xóa staging rate", description: "Staging rate đã được xóa khỏi hệ thống." },
  crawl_cancelled: { tone: "warning", title: "Đã hủy crawl job", description: "Crawl job đã được cancel bởi admin." },
  crawl_retry_started: { tone: "success", title: "Đã kích hoạt retry crawl", description: "Crawl job đã được reset để retry." },
  staging_published: { tone: "success", title: "Đã publish staging rate", description: "Rate đã được tạo trong InterestRateSnapshot." },
  staging_bulk_published: { tone: "success", title: "Đã publish nhiều staging rates", description: "Các rates đã được tạo trong InterestRateSnapshot." },
  // Articles
  article_category_created: { tone: "success", title: "Đã tạo danh mục bài viết", description: "Danh mục bài viết mới đã được thêm vào hệ thống." },
  article_category_updated: { tone: "success", title: "Đã cập nhật danh mục", description: "Danh mục bài viết đã được lưu." },
  article_category_deleted: { tone: "success", title: "Đã xóa danh mục", description: "Danh mục bài viết đã được xóa." },
  article_created: { tone: "success", title: "Đã tạo bài viết", description: "Bài viết mới đã được lưu. Chọn Đăng bài để công khai." },
  article_updated: { tone: "success", title: "Đã cập nhật bài viết", description: "Bài viết đã được lưu thành công." },
  article_deleted: { tone: "success", title: "Đã xóa bài viết", description: "Bài viết đã được xóa khỏi hệ thống." },
  article_published: { tone: "success", title: "Đã đăng bài viết", description: "Bài viết đã được đăng công khai trên trang tin tức." },
  article_unpublished: { tone: "warning", title: "Đã gỡ bài viết", description: "Bài viết đã được chuyển về trạng thái bản nháp." },
  article_missing_fields: { tone: "warning", title: "Thiếu thông tin", description: "Vui lòng điền đầy đủ tiêu đề, nội dung và danh mục." },
  category_name_required: { tone: "warning", title: "Thiếu tên danh mục", description: "Vui lòng nhập tên danh mục." },
  // Banker registrations
  banker_approved: { tone: "success", title: "Đã phê duyệt đăng ký", description: "Tài khoản banker và hồ sơ đã được tạo. Banker có thể đăng nhập." },
  banker_rejected: { tone: "warning", title: "Đã từ chối đăng ký", description: "Yêu cầu đăng ký đã bị từ chối." },
} as const;

export type FeedbackCode = keyof typeof feedbackCatalog;

export function buildFeedbackPath(pathname: string, code: FeedbackCode) {
  return `${pathname}?feedback=${code}`;
}

export function resolveFeedback(code?: string | null) {
  if (!code) {
    return null;
  }

  return feedbackCatalog[code as FeedbackCode] ?? null;
}
