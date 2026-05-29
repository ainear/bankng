import { Button, Input } from "@bankng/ui";
import { submitLeadAction } from "../server/lead-actions";

const PROVINCES = [
  { value: "HN", label: "Hà Nội" },
  { value: "HCM", label: "TP. Hồ Chí Minh" },
  { value: "DN", label: "Đà Nẵng" },
  { value: "CT", label: "Cần Thơ" },
  { value: "HP", label: "Hải Phòng" },
  { value: "BR", label: "Bình Dương" },
  { value: "DNI", label: "Đồng Nai" },
];

export function LeadCtaForm({
  contextSlug,
  contextType,
  sourcePage,
  title,
  description
}: {
  contextSlug: string;
  contextType: string;
  sourcePage: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--bankng-text-primary)]">{title}</h2>
      <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">{description}</p>
      <form action={submitLeadAction} className="mt-5 grid gap-4 md:grid-cols-2">
        <input name="sourcePage" type="hidden" value={sourcePage} />
        <input name="contextType" type="hidden" value={contextType} />
        <input name="contextSlug" type="hidden" value={contextSlug} />
        
        <Input label="Họ và tên" name="name" placeholder="Nguyễn Văn A" required />
        <Input label="Số điện thoại" name="phone" placeholder="09xxxxxxxx" required />
        <Input label="Email" name="email" type="email" placeholder="example@gmail.com" />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--bankng-text-secondary)] uppercase tracking-wider">
            Tỉnh/Thành phố <span className="text-red-500">*</span>
          </label>
          <select
            name="provinceCode"
            required
            className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-3 py-[9px] text-sm focus:border-[var(--bankng-primary)] focus:outline-none transition-colors"
          >
            <option value="">-- Chọn Tỉnh/Thành phố --</option>
            {PROVINCES.map((prov) => (
              <option key={prov.value} value={prov.value}>
                {prov.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <Input label="Ghi chú thêm (Nhu cầu, thời gian gọi...)" name="message" placeholder="Ví dụ: Cần vay mua nhà kỳ hạn 20 năm..." />
        </div>

        <div className="md:col-span-2 mt-2">
          <Button type="submit" className="w-full md:w-auto">Gửi yêu cầu tư vấn</Button>
        </div>
      </form>
    </div>
  );
}
