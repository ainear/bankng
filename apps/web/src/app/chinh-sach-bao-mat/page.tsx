import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description:
    "Chính sách bảo mật của Bankng — cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.",
};

export default function PrivacyPage() {
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
            Chính sách bảo mật
          </h1>
          <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">
            Cập nhật lần cuối: tháng 5/2025
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-[var(--bankng-text-primary)]">
          <section>
            <h2 className="text-xl font-semibold">1. Thông tin chúng tôi thu thập</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Bankng thu thập các thông tin bạn cung cấp trực tiếp khi sử dụng dịch vụ, bao gồm:
            </p>
            <ul className="mt-3 space-y-2 text-[var(--bankng-text-secondary)]">
              <li>• <strong>Thông tin liên hệ:</strong> Họ tên, số điện thoại, địa chỉ email khi gửi yêu cầu tư vấn.</li>
              <li>• <strong>Thông tin sử dụng:</strong> Trang bạn truy cập, thời gian sử dụng, thiết bị và trình duyệt.</li>
              <li>• <strong>Thông tin đăng ký Banker:</strong> Thông tin nghề nghiệp, ngân hàng công tác (chỉ áp dụng với nhân viên ngân hàng).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Cách chúng tôi sử dụng thông tin</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Thông tin của bạn được sử dụng để:
            </p>
            <ul className="mt-3 space-y-2 text-[var(--bankng-text-secondary)]">
              <li>• Kết nối bạn với nhân viên tư vấn ngân hàng phù hợp.</li>
              <li>• Cải thiện chất lượng dịch vụ và nội dung thông tin.</li>
              <li>• Gửi thông tin tư vấn, cập nhật lãi suất (nếu bạn đồng ý).</li>
              <li>• Tuân thủ các nghĩa vụ pháp lý.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Chia sẻ thông tin</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Bankng <strong>không bán</strong> thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ thông tin:
            </p>
            <ul className="mt-3 space-y-2 text-[var(--bankng-text-secondary)]">
              <li>• Với nhân viên ngân hàng được xác minh (Banker) khi bạn yêu cầu tư vấn.</li>
              <li>• Với đối tác cung cấp dịch vụ kỹ thuật (lưu trữ, phân tích) theo hợp đồng bảo mật.</li>
              <li>• Khi được yêu cầu bởi cơ quan pháp luật theo quy định.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Bảo mật thông tin</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật tiêu chuẩn ngành bao gồm mã hóa SSL/TLS,
              kiểm soát quyền truy cập và giám sát hệ thống liên tục để bảo vệ thông tin của bạn.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Quyền của bạn</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Bạn có quyền yêu cầu:
            </p>
            <ul className="mt-3 space-y-2 text-[var(--bankng-text-secondary)]">
              <li>• Truy cập và sao chép thông tin cá nhân của bạn.</li>
              <li>• Chỉnh sửa thông tin không chính xác.</li>
              <li>• Xóa thông tin cá nhân (trong phạm vi cho phép của pháp luật).</li>
              <li>• Rút lại sự đồng ý xử lý thông tin bất kỳ lúc nào.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Cookie</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Bankng sử dụng cookie để cải thiện trải nghiệm người dùng, phân tích lưu lượng truy cập
              và ghi nhớ tùy chọn của bạn. Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Liên hệ</h2>
            <p className="mt-3 text-[var(--bankng-text-secondary)] leading-relaxed">
              Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ:
            </p>
            <ul className="mt-3 space-y-2 text-[var(--bankng-text-secondary)]">
              <li>• Email: <a href="mailto:privacy@bankng.com" className="text-[var(--bankng-primary)] hover:underline">privacy@bankng.com</a></li>
              <li>• Địa chỉ: 16 Vạn Cào, Phường Ngọc Hà, TP. Hà Nội</li>
              <li>• Hotline: 0988.291.512</li>
            </ul>
          </section>
        </div>

        <div className="mt-10 flex gap-4 border-t border-[var(--bankng-border)] pt-6 text-sm text-[var(--bankng-text-secondary)]">
          <Link href="/dieu-khoan" className="hover:text-[var(--bankng-primary)]">
            Điều khoản sử dụng →
          </Link>
        </div>
      </div>
    </main>
  );
}
