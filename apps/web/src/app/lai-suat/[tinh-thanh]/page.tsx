import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@bankng/db";
import { getProvinceBySlug } from "@/modules/public/province-map";
import { LeadForm } from "@/modules/public/components/lead-form";
import { cleanLogoUrl } from "@/components/bank-logo-helper";

export const revalidate = 3600; // Cache 1 hour for performance

interface Props {
  params: Promise<{ "tinh-thanh": string }>;
}

export async function generateMetadata({ params }: Props) {
  const { "tinh-thanh": slug } = await params;
  const province = getProvinceBySlug(slug);

  if (!province) {
    return {
      title: "Không tìm thấy tỉnh thành | Bankng",
    };
  }

  return {
    title: `Lãi suất ngân hàng tốt nhất tại ${province.name} | Bankng`,
    description: `Bảng so sánh lãi suất tiết kiệm, lãi suất vay mua nhà/xe và danh sách nhân viên ngân hàng hỗ trợ trực tiếp tại ${province.name}. Cập nhật mới nhất.`,
    keywords: [
      `lai suat ${province.slug}`,
      `lãi suất ngân hàng ${province.name}`,
      `banker ${province.name}`,
      `vay mua nhà ${province.name}`,
      `tiết kiệm ${province.name}`,
    ],
  };
}

export default async function LocalProvincePage({ params }: Props) {
  const { "tinh-thanh": slug } = await params;
  const province = getProvinceBySlug(slug);

  if (!province) {
    notFound();
  }

  // 1. Fetch Bankers in this province
  const localBankers = await prisma.banker.findMany({
    where: {
      provinceCode: province.code,
      isActive: true,
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

  // 2. Fetch default national bankers if no local bankers found to avoid empty state
  const fallbackBankers = localBankers.length === 0 
    ? await prisma.banker.findMany({
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
        take: 3,
      })
    : [];

  // 3. Fetch interest rates snapshots for this province (or national defaults)
  const rateSnapshots = await prisma.interestRateSnapshot.findMany({
    where: {
      OR: [
        { provinceCode: province.code },
        { provinceCode: null },
      ],
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
        <div className="mb-6">
          <Link
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--bankng-primary)] hover:underline"
            href="/"
          >
            ← Trang chủ
          </Link>
        </div>

        {/* Hero Localized Title */}
        <div className="mb-10 rounded-2xl border border-[var(--bankng-border)] bg-gradient-to-br from-emerald-800 to-emerald-950 p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-200 uppercase tracking-wider">
            📍 Thị Trường Khu Vực
          </span>
          <h1 className="mt-4 text-3xl md:text-4.5xl font-black tracking-tight leading-tight">
            Lãi Suất Ngân Hàng Tại {province.name}
          </h1>
          <p className="mt-3 text-base text-emerald-100/90 max-w-2xl leading-relaxed">
            Xem bảng so sánh lãi suất và kết nối trực tiếp với nhân viên tín dụng làm việc tại địa bàn **{province.name}** để nhận hỗ trợ giải ngân nhanh chóng.
          </p>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Main content area - Left 3 Columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Local Interest Rates section */}
            <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                💵 Bảng lãi suất ưu đãi khu vực
              </h2>
              <p className="text-xs text-[var(--bankng-text-secondary)] mb-6 font-semibold">
                Danh sách lãi suất tiết kiệm & vay vốn áp dụng cho khách hàng tại {province.name} (Đã được kiểm duyệt).
              </p>

              {rateSnapshots.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-[var(--bankng-border)] rounded-xl bg-slate-50">
                  <span className="text-3xl">📊</span>
                  <p className="mt-2 text-sm text-[var(--bankng-text-secondary)] font-bold">Chưa có bảng lãi suất đặc thù khu vực.</p>
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
                              {cleanLogoUrl(rate.productVariant.product.bank.logoUrl) ? (
                                <img
                                  src={cleanLogoUrl(rate.productVariant.product.bank.logoUrl)}
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

            {/* Local Bankers section */}
            <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                📌 Đội ngũ Banker hỗ trợ tại {province.name}
              </h2>
              
              {localBankers.length === 0 ? (
                /* Fallback State */
                <div className="mt-6 space-y-6">
                  <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-4 text-xxs font-semibold leading-relaxed text-amber-800">
                    ℹ️ Hiện tại chưa có nhân viên tín dụng nào đăng ký địa bàn công tác tại **{province.name}**. 
                    Tuy nhiên, sếp vẫn có thể nhận tư vấn từ đội ngũ Banker Big4 hỗ trợ toàn quốc dưới đây:
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {fallbackBankers.map((banker) => (
                      <div
                        key={banker.id}
                        className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs transition-shadow hover:shadow-md flex items-start gap-4"
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
                            Chức danh: {banker.title || "Chuyên viên Tín dụng"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Local Bankers List */
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {localBankers.map((banker) => (
                    <div
                      key={banker.id}
                      className="rounded-xl border border-[var(--bankng-border)] bg-white p-4 shadow-xs transition-all hover:shadow-md hover:border-[var(--bankng-primary)]/30 flex items-start gap-4"
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
                        <p className="mt-1.5 text-xxs text-[var(--bankng-text-secondary)] font-medium">
                          💼 Chức danh: {banker.title || "Chuyên viên QHKH"}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                          ⭐ {Number(banker.rating).toFixed(1)} ({banker.reviewCount} đánh giá)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Lead Form panel - 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold mb-2">📞 Đăng ký tư vấn khu vực</h3>
              <p className="text-xxs text-[var(--bankng-text-secondary)] mb-6 font-semibold">
                Hệ thống tự động khóa vùng **{province.name}** để ưu tiên chuyển hồ sơ của sếp cho Banker tại địa phương hỗ trợ.
              </p>

              {/* Localized Lead Form calling submit lead */}
              <LeadForm 
                sourcePage={`Local Page: ${province.name}`}
                contextType="province"
                contextSlug={province.slug}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
