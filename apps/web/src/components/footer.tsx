import Link from "next/link";

const productLinks = [
  { label: "Vay mua nhà", href: "/compare/vay-mua-nha" },
  { label: "Vay mua xe", href: "/compare/vay-mua-xe" },
  { label: "Vay tín chấp", href: "/compare/vay-tin-chap" },
  { label: "Vay doanh nghiệp", href: "/compare/vay-kinh-doanh" },
  { label: "Thẻ tín dụng", href: "/compare/the-tin-dung" },
  { label: "Gửi tiết kiệm", href: "/compare/tiet-kiem" },
];

const quickLinks = [
  { label: "Công cụ tính", href: "/cong-cu-tinh" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Sản phẩm cộng đồng", href: "/san-pham-cong-dong" },
  { label: "Thuật ngữ ngân hàng", href: "/thuat-ngu" },
  { label: "Nhân viên Ngân hàng", href: "/danh-sach-bankers" },
  { label: "Khảo sát Banker", href: "/banker/survey" },
];

export function Footer() {
  return (
    <footer className="glass-panel border-t border-emerald-500/15 shadow-[0_-8px_30px_rgba(16,185,129,0.02)]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <svg height="34" width="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="var(--bankng-primary)" />
                <text x="16" y="22" textAnchor="middle" fill="white" fontSize="16" fontWeight="black">B</text>
              </svg>
              <span className="text-xl font-black text-[var(--bankng-text-primary)] tracking-tight">Bankng</span>
            </div>
            <p className="text-sm font-semibold text-[var(--bankng-text-secondary)] leading-relaxed">
              Nền tảng so sánh sản phẩm ngân hàng, tư vấn tài chính ứng dụng AI phục vụ cộng đồng.
            </p>
            <p className="mt-4 text-sm font-bold text-[var(--bankng-text-secondary)]">
              Công ty Công nghệ Tài chính Bankng
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Thành viên Hiệp hội Ngân hàng Việt Nam
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-[var(--bankng-text-primary)]">Sản phẩm</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-sm text-[var(--bankng-text-secondary)] hover:text-[var(--bankng-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-[var(--bankng-text-primary)]">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-sm text-[var(--bankng-text-secondary)] hover:text-[var(--bankng-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-[var(--bankng-text-primary)]">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[var(--bankng-text-secondary)]">
                <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
                  <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1 8a7 7 0 1114 0A7 7 0 011 8z"/>
                </svg>
                <span>16 Vạn Cào, Phường Ngọc Hà, TP. Hà Nội</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--bankng-text-secondary)]">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.654 1.328a.678.678 0 01-.415-.53C3.21.73 3.23.73 3.23.796c0 .03.022.03.078.054a12 12 0 014.664.82c.064.022.064.032.032.086a.678.678 0 01-.53.415c-.66.163-2.029 1.35-2.735 2.9-.544.94-.583 1.78-.445 2.203a.679.679 0 01-.304.33c-.127.052-.256.06-.33.06a.679.679 0 01-.415-.53c-.15-.43-.45-1.42-.45-2.09 0-.67.3-1.66.45-2.09.38-.89.38-.89.91-.89h.046c.53 0 .91.018.91.89.163.43.45 1.42.45 2.09 0 .67-.3 1.66-.45 2.09-.38.89-.38.89-.91.89h-.046c-.063 0-.203.012-.33.06a.679.679 0 01-.304.33c-.138.074-.099.263.445 2.203.706 1.55 2.075 2.737 2.735 2.9a.678.678 0 01.53.415c.163.66.163 2.03 0 2.69a.678.678 0 01-.415.53c-.66.163-2.029 1.35-2.735 2.9-.544.94-.583 1.78-.445 2.203a.678.678 0 01-.304.33c-.127.052-.256.06-.33.06C1.11 15.95.5 15.5.5 13.5c0-1 .68-1.5 1.068-1.764.09-.063.09-.063.09-.54V9.22c0-.477-.02-.477-.09-.54C.94 7.96.5 7.5.5 5.5c0-1.5.5-3 .96-3.73.06-.11.06-.3 0-.42C1.18 1.04 1.5.5 2.5.5c.61 0 1.11.3 1.318.818l.022.047c.027.05.055.07.055.463v1c0 .477.02.477.09.54.11.264.55.724 1.068 1.764.09.063.09.063.09.54 0 .47-.35.82-.818.95z"/>
                </svg>
                <span>0988.291.512</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--bankng-text-secondary)]">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2A2 2 0 00.05 3.93L2 4.07V11.5a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V4.07l-.05-.14A2 2 0 0014 2H2zm0 1h12a1 1 0 011 1v9a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1z"/>
                  <path d="M2 4.5a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-1zM3 7.09l1.115.743A1 1 0 005.1 8.4L4 9.29v-2.2zm7.09-1.15l1.116-.743A1 1 0 0111.9 8.4l-1.115.743V5.09z"/>
                </svg>
                <span>fintech@bankng.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--bankng-border)] pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[var(--bankng-text-secondary)]">
              © 2025 Bankng. Thông tin chỉ mang tính chất tham khảo. Không thay thế tư vấn tài chính cá nhân.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {/* Legal links */}
              <div className="flex gap-4 text-sm">
                <Link href="/chinh-sach-bao-mat" prefetch={false} className="text-[var(--bankng-text-secondary)] hover:text-[var(--bankng-primary)]">
                  Chính sách bảo mật
                </Link>
                <Link href="/dieu-khoan" prefetch={false} className="text-[var(--bankng-text-secondary)] hover:text-[var(--bankng-primary)]">
                  Điều khoản
                </Link>
              </div>
              {/* Social links */}
              <div className="flex gap-3">
                <a
                  href="https://facebook.com/bankng.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--bankng-text-secondary)] hover:text-[var(--bankng-primary)] transition-colors"
                  aria-label="Facebook Bankng"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://zalo.me/bankng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--bankng-text-secondary)] hover:text-[var(--bankng-primary)] transition-colors"
                  aria-label="Zalo Bankng"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-1.97 4.77c-.073.176-.254.287-.444.274-.19-.013-.356-.145-.41-.326l-.476-1.57-1.868 3.07c-.099.163-.279.26-.467.258-.189-.003-.366-.104-.46-.27l-.97-1.73-.94 1.73c-.094.173-.275.279-.47.279-.195 0-.376-.106-.469-.279l-1.07-1.97c-.094-.173-.086-.38.02-.546.108-.166.298-.258.496-.245.198.013.374.129.46.303l.6 1.102.963-1.772c.097-.178.283-.285.483-.28.2.005.38.12.47.297l.965 1.725 1.876-3.084c.1-.163.28-.26.47-.257.19.003.366.105.46.272l.47 1.55 1.565-3.79c.081-.196.275-.318.485-.306.21.012.39.154.454.354.064.2.01.414-.143.54z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@bankng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--bankng-text-secondary)] hover:text-[var(--bankng-primary)] transition-colors"
                  aria-label="YouTube Bankng"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}