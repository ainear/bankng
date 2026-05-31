import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Công cụ tính tài chính chuyên nghiệp | Bankng",
  description:
    "Bộ 12 công cụ tính toán tài chính chuyên sâu: Lương Gross-Net, Thuế TNCN, Lãi vay mua nhà/xe, Khoản vay tối đa, Điều kiện NOXH, Lãi tiết kiệm... Chuẩn xác, cập nhật mới nhất.",
  keywords: [
    "công cụ tính tài chính",
    "máy tính tài chính",
    "gross net",
    "thuế tncn",
    "tính lãi vay",
    "vay mua nhà",
    "vay mua xe",
    "khoản vay tối đa",
    "nhà ở xã hội",
  ],
};

export const dynamic = "force-dynamic";

interface ToolItem {
  title: string;
  description: string;
  href: string;
  emoji: string;
  isReady: boolean;
}

interface ToolGroup {
  categoryName: string;
  icon: string;
  tools: ToolItem[];
}

const TOOL_GROUPS: ToolGroup[] = [
  {
    categoryName: "Tiền lương & Thuế",
    icon: "💼",
    tools: [
      {
        title: "Quy đổi lương Gross-Net",
        description: "Quy đổi lương Gross sang Net và ngược lại, tự động tính BHXH và Thuế TNCN theo vùng tối thiểu mới nhất.",
        href: "/cong-cu-tinh/luong-gross-net",
        emoji: "💵",
        isReady: true,
      },
      {
        title: "Tính Thuế thu nhập cá nhân",
        description: "Tính thuế TNCN và so sánh biểu thuế 7 bậc hiện hành với 5 bậc cải cách dự kiến.",
        href: "/cong-cu-tinh/tinh-thue-tncn",
        emoji: "⚖️",
        isReady: true,
      },
    ],
  },
  {
    categoryName: "Tín dụng & Vay vốn",
    icon: "🏦",
    tools: [
      {
        title: "Tính khoản vay tối đa",
        description: "Ước tính số tiền vay tối đa ngân hàng cấp dựa trên thu nhập và chỉ số DTI của bạn.",
        href: "/cong-cu-tinh/tinh-khoan-vay-toi-da",
        emoji: "📈",
        isReady: true,
      },
      {
        title: "Lãi vay trả góp đều (Annuity)",
        description: "Tính số tiền trả định kỳ cố định hàng tháng (gồm gốc và lãi) trong suốt thời gian vay.",
        href: "/danh-gia-nhanh/vay-mua-nhan-hieu-annuity",
        emoji: "📅",
        isReady: false,
      },
      {
        title: "Lãi vay trên dư nợ giảm dần",
        description: "Tính lịch trả nợ vay mua nhà, mua xe với số tiền gốc trả đều và tiền lãi giảm dần theo dư nợ thực tế.",
        href: "/danh-gia-nhanh/vay-mua-nha",
        emoji: "🏠",
        isReady: false,
      },
      {
        title: "Tính lãi vay thả nổi",
        description: "Tính toán khoản vay có lãi suất thay đổi định kỳ dựa trên biên độ thả nổi của thị trường.",
        href: "/danh-gia-nhanh/vay-mua-xe",
        emoji: "🔄",
        isReady: false,
      },
      {
        title: "Lịch trả nợ nhà dự án",
        description: "Tính lịch trả nợ vay mua bất động sản dự án giải ngân theo tiến độ xây dựng.",
        href: "/danh-gia-nhanh/vay-kinh-doanh",
        emoji: "🏗️",
        isReady: false,
      },
    ],
  },
  {
    categoryName: "Gửi tiết kiệm",
    icon: "💰",
    tools: [
      {
        title: "Tính lãi suất tiết kiệm",
        description: "Tính toán số tiền lãi nhận được khi gửi tiết kiệm lãi đơn/lãi kép, đối chiếu lãi suất ngân hàng tốt nhất.",
        href: "/danh-gia-nhanh/tiet-kiem",
        emoji: "🪙",
        isReady: false,
      },
    ],
  },
  {
    categoryName: "Nhà đất & Xe",
    icon: "🚗",
    tools: [
      {
        title: "Điều kiện mua Nhà ở xã hội",
        description: "Bài trắc nghiệm kiểm tra nhanh bạn có thuộc đối tượng và đủ điều kiện mua NOXH theo quy định Luật mới.",
        href: "/cong-cu-tinh/kiem-tra-dieu-kien-nha-o-xa-hoi",
        emoji: "🏢",
        isReady: true,
      },
      {
        title: "Tính giá trị tài sản tối đa",
        description: "Ước tính giá trị căn nhà hoặc ô tô bạn có thể mua dựa trên vốn tự có và dòng tiền vay tối đa.",
        href: "/danh-gia-nhanh/vay-tin-chap",
        emoji: "🗺️",
        isReady: false,
      },
    ],
  },
  {
    categoryName: "Thẻ tín dụng",
    icon: "💳",
    tools: [
      {
        title: "Phân tích sao kê thẻ",
        description: "Phân tích dư nợ sao kê thẻ tín dụng, tính toán số tiền thanh toán tối thiểu và lãi suất phát sinh.",
        href: "/danh-sach-bankers",
        emoji: "📊",
        isReady: false,
      },
    ],
  },
];

export default function FinancialToolsPage() {
  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      {/* Decorative gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[50%] rounded-full bg-[var(--bankng-primary)]/5 blur-[120px]" />
        <div className="absolute top-[30%] -right-[15%] h-[60%] w-[55%] rounded-full bg-[var(--bankng-primary)]/5 blur-[120px]" />
      </div>

      <section className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--bankng-text-primary)]">
            Công cụ Tính Tài chính Chuyên sâu
          </h1>
          <p className="mt-3 text-lg text-[var(--bankng-text-secondary)] max-w-2xl leading-relaxed">
            Hỗ trợ sếp và người dùng tự động tính toán tiền lương, thuế, lãi suất tiết kiệm và lập lịch trả nợ vay ngân hàng chuẩn xác 100%.
          </p>
        </div>

        {/* Tools Directory */}
        <div className="space-y-10">
          {TOOL_GROUPS.map((group) => (
            <div key={group.categoryName} className="glass-panel rounded-3xl p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3 border-b border-emerald-500/10 pb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-2xl shadow-xs">
                  {group.icon}
                </span>
                <h2 className="text-lg font-black text-[var(--bankng-text-primary)] tracking-tight">
                  {group.categoryName}
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {group.tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/5"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl transition-transform group-hover:scale-110">
                        {tool.emoji}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[var(--bankng-text-primary)] group-hover:text-emerald-700 transition-colors">
                            {tool.title}
                          </h3>
                          {tool.isReady ? (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-emerald-800 uppercase">
                              Mới ✨
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[9px] font-bold text-slate-600 uppercase">
                              Chuẩn
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-[var(--bankng-text-secondary)] font-medium">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support Banner Card */}
        <div className="mt-12 rounded-2xl border border-[var(--bankng-border)] bg-[var(--bankng-surface)] p-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold">Cần hỗ trợ phân tích hồ sơ tín dụng?</h3>
              <p className="mt-2 text-sm text-[var(--bankng-text-secondary)] max-w-xl">
                Bên cạnh các công cụ tính tự động, mạng lưới nhân viên ngân hàng của Bankng luôn sẵn sàng tư vấn trực tiếp 1-1 miễn phí cho bạn.
              </p>
            </div>
            <Link href="/danh-sach-bankers shrink-0">
              <Link
                href="/danh-sach-bankers"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--bankng-primary)] px-6 text-sm font-bold text-white shadow-md shadow-[var(--bankng-primary)]/10 hover:bg-[var(--bankng-primary)]/90 transition-transform active:scale-95"
              >
                Kết nối với Banker ngay →
              </Link>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
