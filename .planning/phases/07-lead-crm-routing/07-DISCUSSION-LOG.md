# Phase 7 — Discussion Log

> Autonomous discussion log generated under GSD --auto mode.

## Decisions Logged

### 1. Lead Capture & Phone Normalization
- **Q:** Làm thế nào để lưu trữ và đối soát số điện thoại khách hàng tránh trùng lắp?
- **A:** [auto] Sử dụng giải thuật chuẩn hóa số điện thoại Việt Nam lưu vào cột `phoneNormalized`. Chặn tất cả các lượt đăng ký có cùng `phoneNormalized` và `contextSlug` trong vòng 24 giờ. (Recommended)

### 2. Intelligent Lead Routing Algorithm
- **Q:** Cơ chế tự động gán lead cho Banker hoạt động như thế nào?
- **A:** [auto] Phân phối vòng tròn (Round-Robin) động dựa trên Tỉnh/Thành (`provinceCode`) và Chuyên môn (`specialties`) của các Banker đã được kích hoạt `isVerified = true`. Gán ưu tiên cho Banker có số lượng lead đang xử lý ít nhất. (Recommended)

### 3. Banker Lead Handling Status Funnel
- **Q:** Trạng thái vòng đời của một Lead gồm những gì và lưu vết thế nào?
- **A:** [auto] Áp dụng phễu trạng thái chuẩn: `new` -> `contacted` -> `qualified` / `closed`. Bắt buộc ghi nhận lịch sử vào bảng `LeadStatusHistory` mỗi lần thay đổi trạng thái kèm theo ghi chú. (Recommended)

### 4. Admin Dashboard Controls
- **Q:** Quyền hạn quản trị viên đối với Lead CRM?
- **A:** [auto] Admin có quyền xem danh sách tất cả lead, thay đổi thủ công Banker phân công (Reassign), duyệt thủ công các lead chưa phân phối trong hàng chờ chung. (Recommended)

## Deferred Ideas
- Tự động tích hợp SMS/Zalo/Email Brandname để gửi tin thông báo cho khách hàng và banker. (Dời sang Phase 10)
