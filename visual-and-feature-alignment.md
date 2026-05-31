# Kế hoạch Đồng bộ Giao diện & Tính năng với Nganhang.com

## Goal
Nâng cấp toàn diện giao diện UI/UX thẩm mỹ cao cấp (Emerald Theme, Glassmorphism) và lấp đầy các khoảng trống tính năng cốt lõi (Bộ lọc nâng cao, Từ điển Thuật ngữ, Công cụ tính) để đạt độ giống 100% so với nganhang.com.

## Tasks
- [ ] Task 1: Thiết kế lại Header & Footer theo chuẩn Emerald, bổ sung các menu điều hướng y hệt mẫu → Verify: Chạy local và kiểm tra thanh điều hướng có menu "Nhân viên Ngân hàng", "Công cụ", "Thuật ngữ", "Sản phẩm cộng đồng".
- [ ] Task 2: Nâng cấp Bảng Lãi Suất trang chủ: thêm hiệu ứng hover đổi màu, cột "Lượt xem", "Ngày đăng", bộ lọc xếp hạng và nút "Góp ý" → Verify: Bảng hiển thị sắc sảo, có các nút sắp xếp ⇅ động.
- [ ] Task 3: Phát triển bộ lọc nâng cao động cho trang danh sách Bankers (`/danh-sach-bankers`): Lọc theo Ngân hàng thật và Tỉnh/Thành → Verify: Dropdown lọc hoạt động thực tế trên UI.
- [ ] Task 4: Xây dựng trang Từ điển Thuật ngữ Ngân hàng (`/thuat-ngu`): Giao diện tra cứu A-Z, bộ tìm kiếm động và danh sách thuật ngữ chuẩn (AML, CAR, CASA,...) → Verify: Truy cập `/thuat-ngu` lọc và tìm kiếm mượt mà.
- [ ] Task 5: Nâng cấp trang `/cong-cu-tinh` với giao diện 12 công cụ tính chuyên sâu (Gross-Net, Thuế TNCN 2026, Khoản vay tối đa,...) thiết kế dạng grid trực quan → Verify: Truy cập `/cong-cu-tinh` thấy đầy đủ 12 công cụ cao cấp.
- [ ] Task 6: Tích hợp hiệu ứng chuyển động vi mô (Micro-animations) bằng GSAP/Vanilla CSS và bóng viền Glassmorphic sang trọng trên toàn hệ thống → Verify: Di chuột vào các card ngân hàng và tin tức có độ co giãn nhẹ và đổ bóng Emerald tinh tế.

## Done When
- [ ] Giao diện trang chủ và các trang con đạt độ giống 95%+ so với nganhang.com về bố cục và thẩm mỹ Emerald cao cấp.
- [ ] Trang Thuật ngữ (`/thuat-ngu`) và trang Công cụ tính tài chính (`/cong-cu-tinh`) hoạt động thực tế với đầy đủ tính năng.
- [ ] Hệ thống bộ lọc Bankers hoạt động mượt mà bằng dữ liệu thật.
