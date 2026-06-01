# Hệ thống Thiết kế Bankng — Phong cách Emerald Glassmorphic Premium

Tài liệu này xác định ngôn ngữ thiết kế, hệ thống token và các nguyên tắc UI/UX để nâng cấp giao diện `bankng` đạt chuẩn thẩm mỹ cao cấp, sắc sảo và uy tín tương tự như `nganhang.com`.

---

## 1. Visual Theme & Atmosphere (Chủ đề & Không khí trực quan)

Hệ thống thiết kế của Bankng theo đuổi phong cách **Emerald Glassmorphic (Kính mờ xanh ngọc bảo lục)**. Đây là sự kết hợp giữa:
- **Sự Tin cậy & Thịnh vượng (Emerald Green)**: Màu xanh lục bảo biểu trưng cho sự sinh trưởng, tài chính vững bền và an tâm.
- **Sự Hiện đại & Tinh khiết (Glassmorphism)**: Các bề mặt kính mờ, viền mỏng tinh xảo, đổ bóng dịu và độ tương phản cao, mang lại cảm giác không gian đa chiều, nhẹ nhàng và công nghệ cao.
- **Chuyển động Vi mô (Micro-animations)**: Các phản hồi xúc giác nhẹ nhàng khi tương tác (hover, focus) tạo cảm giác giao diện "sống động" và phản hồi tức thì.

---

## 2. Color Palette & Roles (Bảng màu & Vai trò)

Hệ thống màu sắc được tinh chỉnh để đạt độ tương phản tối ưu (WCAG 2.1 AA) và phân cấp thông tin rõ rệt:

| Vai trò | Token CSS | Mã màu HEX | Ứng dụng |
| :--- | :--- | :--- | :--- |
| **Primary (Chủ đạo)** | `--bankng-primary` | `#059669` (Emerald 600) | Nút hành động chính, trạng thái active, thương hiệu |
| **Primary Hover** | `--bankng-primary-hover` | `#047857` (Emerald 700) | Trạng thái hover của nút chủ đạo |
| **Primary Light** | `--bankng-primary-light` | `#ecfdf5` (Emerald 50) | Nền badge, vùng làm nổi bật nhẹ |
| **Success (Thành công)** | `--bankng-success` | `#10b981` (Emerald 500) | Lãi suất tăng, xác thực thành công |
| **Background (Nền)** | `--bankng-background` | `#f8fafc` (Slate 50) | Nền toàn trang, sạch sẽ và mát mắt |
| **Surface (Bề mặt)** | `--bankng-surface` | `#ffffff` (White) | Bề mặt card, bảng biểu, container |
| **Border (Đường viền)** | `--bankng-border` | `#e2e8f0` (Slate 200) | Đường phân chia, viền card tinh tế |
| **Text Primary** | `--bankng-text-primary` | `#0f172a` (Slate 900) | Tiêu đề chính, văn bản quan trọng |
| **Text Secondary** | `--bankng-text-secondary` | `#475569` (Slate 600) | Mô tả phụ, nhãn, văn bản thường |

---

## 3. Typography Rules (Quy tắc Typography)

Sử dụng phông chữ **Instrument Sans** hiện đại làm phông chữ mặc định:
- **Tiêu đề chính (H1, H2)**: `font-black`, `tracking-tight`, tạo sự vững chãi, uy tín và đậm nét như các tạp chí tài chính cao cấp.
- **Tiêu đề phụ (H3, H4)**: `font-bold` hoặc `font-extrabold`, phân cấp rõ ràng.
- **Văn bản thường (Body)**: `font-medium` hoặc `font-semibold` cho các thông số tài chính để tăng độ dễ đọc. `leading-relaxed` để người dùng không mỏi mắt khi đọc bảng lãi suất.

---

## 4. Component Stylings (Phong cách Thành phần)

### 4.1. Bề mặt Glassmorphic (Glass-panel)
Các container, card nổi bật được thiết kế dưới dạng kính mờ:
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(16, 185, 129, 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
}
```

### 4.2. Hiệu ứng Phát sáng Ngọc lục bảo (Emerald Glow & Hover)
Khi di chuột qua các thành phần tương tác (Card Banker, Card Tin tức, Bảng Lãi suất):
```css
.emerald-glow:hover {
  border-color: rgba(5, 150, 105, 0.25);
  box-shadow: 0 12px 30px -10px rgba(5, 150, 105, 0.08), 
              0 4px 12px -5px rgba(5, 150, 105, 0.03);
  transform: translateY(-2px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 5. Layout Principles (Nguyên tắc Bố cục)

- **Mật độ thông tin cao vừa phải**: Sản phẩm tài chính yêu cầu dữ liệu rõ ràng. Sử dụng khoảng cách `gap-6` (24px) cho các lưới (Grid) và `py-16` cho các Section lớn để tạo độ thở (whitespace) sang trọng.
- **Grid bất đối xứng**: Kết hợp các cột thông tin lớn (bảng so sánh) đi kèm thanh bên (sidebar) chứa các widget lọc động và CTA nhanh để tối ưu hóa tỷ lệ chuyển đổi.

---

## 6. Depth & Elevation (Độ sâu & Cao độ)

Sử dụng hệ thống đổ bóng (Shadow) đa tầng để tạo cảm giác các thành phần nổi nhẹ trên mặt nền:
- **Low Elevation (Card thường, bảng)**: `shadow-xs` hoặc `shadow-sm` với tông màu xám nhẹ pha chút ngọc lục bảo.
- **High Elevation (Dropdown lọc, Modal, Toast)**: `shadow-xl` kết hợp viền mỏng 1px sắc sảo màu `slate-200` hoặc `emerald-500/10`.

---

## 7. Do's and Don'ts (Nên làm và Tránh làm)

### Nên làm:
- Sử dụng màu xanh lục bảo (`emerald`) làm điểm nhấn hành động, không lạm dụng quá nhiều làm rối mắt.
- Giữ các đường viền mỏng (`1px`) và màu sắc viền dịu để đạt cảm giác sang trọng.
- Đảm bảo các chỉ số lãi suất nổi bật, rõ ràng, dễ so sánh.
- Thiết kế trạng thái Hover, Focus và Active đồng điệu.

### Tránh làm:
- Sử dụng các màu sắc quá rực rỡ hoặc tương phản thô (như đỏ tươi, xanh lam thuần).
- Sử dụng border quá dày hoặc bóng đổ quá tối màu đen.
- Để thiếu khoảng trống (chèn ép chữ sát viền).

---

## 8. Responsive Behavior (Độ tương thích)

- **Mobile First**: Mọi bảng biểu và công cụ tính toán tài chính phải hoạt động mượt mà trên màn hình dọc (điện thoại).
- **Responsive Table**: Các bảng so sánh lãi suất dài phải có cơ chế cuộn ngang mượt mà (`overflow-x-auto`) hoặc thu gọn thành dạng danh sách thẻ (Card list) trên mobile.

---

## 9. Agent Prompt Guide (Hướng dẫn dành cho Agent)

Khi tạo mới hoặc sửa đổi các component UI trong dự án:
1. **Luôn sử dụng CSS Variables** (`var(--bankng-*)`) đã được định nghĩa trong `globals.css` để giữ tính nhất quán.
2. **Áp dụng class `glass-panel` và `emerald-glow`** cho các vùng container quan trọng để đồng nhất phong cách.
3. **Sử dụng các font weight mạnh mẽ** (`font-black`, `font-extrabold`) cho tiêu đề lớn để phản ánh đúng không khí chuyên nghiệp, uy tín của `nganhang.com`.
4. **Luôn thêm hiệu ứng chuyển động nhẹ** (`transition-all duration-300`) cho mọi nút bấm và thẻ tương tác.
