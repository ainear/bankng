import Link from "next/link";
import { prisma } from "@bankng/db";
import { PROVINCES } from "@/modules/public/province-map";
import { LeadForm } from "@/modules/public/components/lead-form";

export const revalidate = 3600; // Cache 1 hour for performance

export const metadata = {
  title: "Bảng lãi suất ngân hàng mới nhất 2026 | Bankng",
  description: "So sánh lãi suất tiết kiệm, lãi suất vay mua nhà, vay tiêu dùng từ hơn 40 ngân hàng Việt Nam. Cập nhật mới nhất hôm nay.",
  keywords: [
    "lai suat ngan hang",
    "lãi suất tiết kiệm mới nhất",
    "lãi suất vay ngân hàng",
    "so sánh lãi suất",
  ],
};

export default async function NationalRatesPage() {
  // 1. Fetch Top 3 National Verified Bankers
  const topBankers = await prisma.banker.findMany({
    where: {
      isActive: true,
      isVerified: true,
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
      bank: true,
    },
    orderBy: {
      rating: "desc",
    },
    take: 6,
  });

  // 2. Fetch Top 10 National Verified Interest Rates
  const rateSnapshots = await prisma.interestRateSnapshot.findMany({
    where: {
      status: "verified",
    },
    include: {
      productVariant: {
        include: {
          product: {
            include: {
              bank: true,
            },
          },
        },
      },
    },
    orderBy: [
      { rateValue: "desc" },
      { updatedAt: "desc" },
    ],
    take: 10,
  });

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      {/* Decorative gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[50%] rounded-full bg-[var(--bankng-primary)]/5 blur-[120px]" />
        <div className="absolute top-[30%] -right-[15%] h-[60%] w-[55%] rounded-full bg-[var(--bankng-primary)]/5 blur-[120px]" />
      </div>

      <section className="mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-[var(--bankng-text-secondary)] font-medium">
          <Link href="/" className="hover:text-[var(--bankng-primary)]">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-[var(--bankng-text-primary)] font-semibold">Lãi suất</span>
        </div>

        {/* Hero banner */}
        <div className="mb-10 rounded-2xl border border-[var(--bankng-border)] bg-gradient-to-br from-emerald-800 to-emerald-950 p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-200 uppercase tracking-wider">
            📊 Toàn Quốc
          </span>
          <h1 className="mt-4 text-3xl md:text-4.5xl font-black tracking-tight leading-tight">
            Bảng Lãi Suất Ngân Hàng Mới Nhất 2026
          </h1>
          <p className="mt-3 text-base text-emerald-100/90 max-w-2xl leading-relaxed">
            Cập nhật và so sánh lãi suất tiết kiệm, lãi suất vay ưu đãi từ hơn 40 ngân hàng Việt Nam. Nhận hỗ trợ tư vấn từ các chuyên viên ngân hàng uy tín.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Main content - Left 3 cols */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Top Rates Table */}
            <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                💰 Top lãi suất ngân hàng nổi bật nhất
              </h2>
              <p className="text-xs text-[var(--bankng-text-secondary)] mb-6 font-semibold">
                Danh sách các chương trình lãi suất tiết kiệm & vay vốn tối ưu nhất trên toàn quốc đã được kiểm duyệt.
              </p>

              {rateSnapshots.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-[var(--bankng-border)] rounded-xl bg-slate-50">
                  <p className="text-sm text-[var(--bankng-text-secondary)] font-bold">Chưa có bảng lãi suất nào được cập nhật.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[var(--bankng-text-secondary)]">
                        <th className="py-3">Ngân hàng</th>
                        <th className="py-3">Sản phẩm / Kỳ hạn</th>
                        <th className="py-3 text-right">Lãi suất năm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-800">
                      {rateSnapshots.map((rate) => (
                        <tr key={rate.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5">
                            <div className="flex items-center gap-2">
                              {rate.productVariant.product.bank.logoUrl ? (
                                <img
                                  src={rate.productVariant.product.bank.logoUrl}
                                  alt={rate.productVariant.product.bank.shortName || "Bank"}
                                  className="h-6 w-6 rounded-full object-contain bg-slate-100 p-0.5"
                                />
                              ) : (
                                <span className="h-6 w-6 rounded-full bg-[var(--bankng-primary)]/10 text-[var(--bankng-primary)] flex items-center justify-center font-bold text-[10px]">
                                  {rate.productVariant.product.bank.shortName?.slice(0, 3) || "B"}
                                </span>
                              )}
                              <span className="font-bold text-slate-800">
                                {rate.productVariant.product.bank.shortName || rate.productVariant.product.bank.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5">
                            <div className="font-bold text-slate-700">
                              {rate.productVariant.product.name}
                            </div>
                            <span className="text-xxs text-[var(--bankng-text-secondary)] font-medium">
                              Kỳ hạn: {rate.termValue} {rate.termUnit === "month" ? "tháng" : rate.termUnit || "tháng"}
                            </span>
                          </td>
                          <td className="py-3.5 text-right font-black text-[var(--bankng-rate-highlight)] text-sm">
                            {Number(rate.rateValue).toFixed(2)}% / năm
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Provinces Quick Selection Grid */}
            <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                📍 Tra cứu lãi suất theo địa phương
              </h2>
              <p className="text-xs text-[var(--bankng-text-secondary)] mb-6 font-semibold">
                Xem bảng lãi suất đặc thù và kết nối với banker hỗ trợ tại địa bàn của bạn.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {PROVINCES.map((province) => (
                  <Link
                    key={province.code}
                    href={`/lai-suat/${province.slug}`}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-[var(--bankng-primary)] hover:shadow-xs transition-all text-xs font-bold text-slate-700 hover:text-[var(--bankng-primary)]"
                  >
                    <span>{province.name}</span>
                    <span className="text-slate-400">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* National Bankers Team */}
            <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                ⭐️ Đội ngũ Banker hỗ trợ toàn quốc
              </h2>
              <p className="text-xs text-[var(--bankng-text-secondary)] mb-6 font-semibold">
                Kết nối trực tiếp với các chuyên viên tín dụng xuất sắc nhất để nhận tư vấn nhanh trong 24h.
              </p>

              {topBankers.length === 0 ? (
                <p className="text-sm text-[var(--bankng-text-secondary)]">Hiện tại chưa có chuyên viên nào online.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {topBankers.map((banker) => (
                    <div
                      key={banker.id}
                      className="rounded-xl border border-[var(--bankng-border)] bg-white p-4 shadow-xs transition-all hover:shadow-md flex items-start gap-4"
                    >
                      <div className="h-12 w-12 shrink-0 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        {banker.user.profile?.avatarUrl ? (
                          <img
                            src={banker.user.profile.avatarUrl}
                            alt={banker.user.profile.fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="h-full w-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center">
                            {banker.user.profile?.fullName.slice(0, 2) || "BK"}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{banker.user.profile?.fullName}</h4>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                          {banker.bank?.shortName || "Ngân hàng"}
                        </span>
                        <p className="mt-1 text-xxs text-[var(--bankng-text-secondary)] font-medium">
                          Chức danh: {banker.title || "Chuyên viên QHKH"}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                          ⭐ {Number(banker.rating).toFixed(1)} ({banker.reviewCount} đánh giá)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Lead Form panel - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold mb-2">📞 Đăng ký tư vấn miễn phí</h3>
              <p className="text-xxs text-[var(--bankng-text-secondary)] mb-6 font-semibold">
                Để lại thông tin liên hệ, hệ thống sẽ tự động gửi tới chuyên viên phù hợp nhất để hỗ trợ bạn lập tức.
              </p>
              
              <LeadForm 
                sourcePage="National Rates Index Page"
                contextType="general"
                contextSlug="national"
              />
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
