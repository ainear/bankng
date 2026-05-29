import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description:
    "Điều khoản sử dụng dịch vụ Bankng — các quy định và điều kiện khi sử dụng nền tảng so sánh tài chính Bankng.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--bankng-background)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--bankng-primary)] hover:underline"
          >
            ← Về trang chủ
          </Link>
          <h1 className="text-3xl font-bold text-[var(--bankng-text-primary)]">
            Điều khoản sử dụng
          </h1>
          <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">
            Cập nhật lần cuối: tháng 5/2025
          </p>
        </div>

        <div className="space-y-8 text-[var(--bankng-text-primary)]">
          <section>
            <h2 className="text-xl font-semibold">1. Chấp nhận điều khoản</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Bằng cách truy cập và sử dụng Bankng, bạn đồng ý tuân thủ các điều khoản và điều kiện
              được nêu trong tài liệu này. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Bản chất thông tin</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Tất cả thông tin lãi suất, sản phẩm ngân hàng và nội dung trên Bankng chỉ mang tính
              chất <strong>tham khảo</strong>. Bankng không phải là tổ chức tài chính và không cung cấp
              tư vấn tài chính chuyên nghiệp. Lãi suất và điều kiện sản phẩm có thể thay đổi mà không
              có thông báo trước.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Sử dụng hợp lệ</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Bạn được phép sử dụng Bankng cho mục đích cá nhân và phi thương mại. Bạn không được:
            </p>
            <ul className="mt-3 space-y-2 text-[var(--bankng-text-secondary)]">
              <li>• Sao chép, phân phối hoặc bán nội dung từ Bankng mà không có sự đồng ý bằng văn bản.</li>
              <li>• Sử dụng bot, scraper hoặc công cụ tự động để thu thập dữ liệu.</li>
              <li>• Tạo tài khoản giả mạo hoặc cung cấp thông tin sai lệch.</li>
              <li>• Thực hiện hành vi có thể gây hại cho hệ thống hoặc người dùng khác.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Hệ thống Banker</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Các nhân viên ngân hàng đăng ký Banker Profile trên Bankng phải:
            </p>
            <ul className="mt-3 space-y-2 text-[var(--bankng-text-secondary)]">
              <li>• Cung cấp thông tin chính xác và cập nhật về vị trí công tác.</li>
              <li>• Tuân thủ quy định của ngân hàng nơi công tác khi tư vấn cho khách hàng.</li>
              <li>• Không cung cấp thông tin gây hiểu lầm hoặc sai lệch về sản phẩm.</li>
            </ul>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Bankng có quyền xóa hoặc đình chỉ tài khoản Banker vi phạm quy định mà không cần thông báo trước.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Trách nhiệm giới hạn</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Bankng không chịu trách nhiệm về bất kỳ tổn thất nào phát sinh từ việc sử dụng thông tin
              trên nền tảng, bao gồm nhưng không giới hạn ở quyết định tài chính dựa trên dữ liệu lãi suất
              từ Bankng. Bạn nên xác minh thông tin trực tiếp với ngân hàng trước khi đưa ra quyết định.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Sở hữu trí tuệ</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Toàn bộ nội dung, thiết kế và mã nguồn của Bankng là tài sản trí tuệ của chúng tôi,
              được bảo hộ theo pháp luật Việt Nam. Logo và thương hiệu các ngân hàng là tài sản của
              các tổ chức đó.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Thay đổi điều khoản</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Bankng có thể cập nhật điều khoản sử dụng bất kỳ lúc nào. Chúng tôi sẽ thông báo
              các thay đổi đáng kể qua email hoặc thông báo trên nền tảng. Việc tiếp tục sử dụng
              sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận điều khoản mới.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Luật áp dụng</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Điều khoản này được điều chỉnh bởi pháp luật Cộng hòa Xã hội chủ nghĩa Việt Nam.
              Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại Hà Nội, Việt Nam.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Liên hệ</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Mọi câu hỏi về điều khoản sử dụng, vui lòng liên hệ:
            </p>
            <ul className="mt-3 space-y-2 text-[var(--bankng-text-secondary)]">
              <li>• Email: <a href="mailto:legal@bankng.com" className="text-[var(--bankng-primary)] hover:underline">legal@bankng.com</a></li>
              <li>• Địa chỉ: 16 Vạn Cào, Phường Ngọc Hà, TP. Hà Nội</li>
            </ul>
          </section>
        </div>

        <div className="mt-10 flex gap-4 border-t border-[var(--bankng-border)] pt-6 text-sm text-[var(--bankng-text-secondary)]">
          <Link href="/chinh-sach-bao-mat" className="hover:text-[var(--bankng-primary)]">
            Chính sách bảo mật →
          </Link>
        </div>
      </div>
    </main>
  );
}
