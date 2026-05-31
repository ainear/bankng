import { prisma } from "@bankng/db";
import { VerificationClient } from "./verification-client";

export const dynamic = "force-dynamic";

async function getVerificationStatus() {
  try {
    const bankerEmail = process.env.BANKER_EMAIL ?? "banker@bankng.local";
    const user = await prisma.user.findUnique({
      where: { email: bankerEmail },
      include: {
        bankerProfile: {
          include: {
            bank: { select: { name: true } },
          },
        },
      },
    });
    return user?.bankerProfile ?? null;
  } catch {
    return null;
  }
}

export default async function VerificationPage() {
  const banker = await getVerificationStatus();

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--bankng-text-primary)]">Xác minh tài khoản</h1>
        <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
          Hoàn thành các bước xác minh dưới đây để kích hoạt tài khoản nhận leads tự động từ khách hàng.
        </p>
      </div>

      <VerificationClient banker={banker} />

      {/* Info Guidelines */}
      <div className="mt-8 rounded-xl border border-[var(--bankng-border)] bg-[var(--bankng-surface-muted)] p-5">
        <h3 className="font-semibold text-sm text-[var(--bankng-text-primary)]">Lưu ý quan trọng đối với giấy tờ</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-[var(--bankng-text-secondary)]">
          <li>• Ảnh chụp tài liệu phải rõ nét, đủ ánh sáng, không bị mất góc hay che mờ thông tin.</li>
          <li>• Họ tên và khuôn mặt trên các giấy tờ phải trùng khớp với hồ sơ đăng ký nhân viên ngân hàng.</li>
          <li>• Quy trình phê duyệt thủ công từ ban quản trị sẽ hoàn tất trong vòng 1-3 ngày làm việc.</li>
          <li>• Để được hỗ trợ trực tiếp, vui lòng liên hệ email: <strong className="text-[var(--bankng-primary)]">support@bankng.com</strong></li>
        </ul>
      </div>
    </div>
  );
}
