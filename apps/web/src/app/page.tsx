import Link from "next/link";
import { prisma } from "@bankng/db";
import { getRateMatrix } from "@/modules/public/rate-matrix";
import { BankTicker } from "@/components/bank-ticker";
import { HomepageLeadForm } from "@/modules/public/components/homepage-lead-form";
import { HeroSearchWidget } from "@/components/hero-search-widget";
import { HomepageRatesTabs } from "@/components/homepage-rates-tabs";
import { MOCK_LOAN_PRODUCTS, MOCK_BANKS } from "@/modules/public/mock-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PRODUCT_CATEGORIES = [
  {
    label: "Vay mua nhà",
    href: "/compare/vay-mua-nha",
    emoji: "🏠"
  },
  {
    label: "Vay mua xe",
    href: "/compare/vay-mua-xe",
    emoji: "🚗"
  },
  {
    label: "Vay tín chấp",
    href: "/compare/vay-tin-chap",
    emoji: "💳"
  },
  {
    label: "Vay kinh doanh",
    href: "/compare/vay-kinh-doanh",
    emoji: "🏢"
  },
  {
    label: "Thẻ tín dụng",
    href: "/compare/the-tin-dung",
    emoji: "💳"
  },
  {
    label: "Gửi tiết kiệm",
    href: "/compare/tiet-kiem",
    emoji: "💰"
  }
];

async function getTopLoanProducts() {
  try {
    const products = await prisma.financialProduct.findMany({
      where: {
        status: "active",
        isPublic: true,
        category: {
          slug: { in: ["vay-mua-nha", "vay-mua-xe", "vay-tin-chap"] }
        }
      },
      include: {
        bank: {
          select: { name: true, slug: true, shortName: true, logoUrl: true }
        },
        category: {
          select: { name: true, slug: true }
        },
        variants: {
          where: { status: "active" },
          include: {
            rates: {
              where: { status: "verified" },
              orderBy: { rateValue: "asc" },
              take: 1
            }
          }
        }
      },
      take: 10
    });

    const result = products.map(p => {
      const variant = p.variants[0];
      const rate = variant?.rates[0];
      return {
        id: p.id,
        bankName: p.bank.shortName ?? p.bank.name,
        bankLogoUrl: p.bank.logoUrl,
        bankSlug: p.bank.slug,
        productName: p.name,
        categoryName: p.category.name,
        categorySlug: p.category.slug,
        rateValue: rate ? Number(rate.rateValue) : null,
        termValue: rate?.termValue ?? null,
        minAmount: variant?.minAmount ? Number(variant.minAmount) : null,
        maxTermMonth: variant?.maxTermMonth ?? null
      };
    }).filter(p => p.rateValue !== null).sort((a, b) => (a.rateValue ?? 0) - (b.rateValue ?? 0));

    if (result.length === 0) {
      return MOCK_LOAN_PRODUCTS;
    }
    return result;
  } catch (err) {
    console.warn("Prisma offline, falling back to MOCK_LOAN_PRODUCTS:", err);
    return MOCK_LOAN_PRODUCTS;
  }
}

export default async function HomePage() {
  let rateMatrix: any = { rows: [], terms: [] };
  try {
    rateMatrix = await getRateMatrix();
  } catch (err) {
    console.warn("getRateMatrix offline, using fallback rate matrix:", err);
  }

  const { rows, terms } = rateMatrix;
  const loanProducts = await getTopLoanProducts();

  let banks: any[] = [];
  try {
    banks = await prisma.bank.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        shortName: true,
      },
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    if (banks.length === 0) {
      banks = MOCK_BANKS;
    }
  } catch (err) {
    console.warn("Prisma offline, falling back to MOCK_BANKS:", err);
    banks = MOCK_BANKS;
  }

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-emerald-500/5 rounded-full blur-3xl -z-10" />
        <div className="mx-auto max-w-6xl px-6 py-16 text-center md:text-left">
          <div className="flex justify-center md:justify-start">
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider">
              🚀 Nền tảng so sánh tài chính AI 2026
            </span>
          </div>
          <h1 className="text-3.5xl font-black leading-tight md:text-5.5xl mt-5 tracking-tight text-center md:text-left">
            So sánh lãi suất, <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">chắp cánh tài chính</span>
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600 text-base md:text-lg font-semibold leading-relaxed text-center md:text-left mx-auto md:mx-0">
            Công cụ so sánh lãi suất tiết kiệm và vay ngân hàng tối ưu nhất Việt Nam.
            Dữ liệu được cào tự động hàng ngày, xác thực chính xác, bảo vệ quyền lợi người tiêu dùng.
          </p>

          {/* New Interactive Hero Search Widget with amount/term sliders */}
          <HeroSearchWidget />

          {/* Category quick links */}
          <div className="mt-12 grid grid-cols-3 gap-4 md:grid-cols-6">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--bankng-border)] bg-white p-5 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2.5xl transition-colors group-hover:bg-emerald-100">
                  {cat.emoji}
                </div>
                <span className="text-xs font-bold text-slate-700 transition-colors group-hover:text-emerald-700">{cat.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-4 text-center md:text-left">
            <Link
              href="/compare"
              className="text-sm font-medium text-[var(--bankng-primary)] hover:underline"
            >
              Xem tất cả danh mục so sánh →
            </Link>
          </div>
        </div>
      </section>

      {/* Bank ticker — logo ngân hàng scrolling marquee */}
      <BankTicker />

      {/* Dynamic Saving vs Loan Rates Section */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">So sánh Bảng Lãi suất Niêm yết</h2>
            <p className="mt-1 text-sm text-[var(--bankng-text-secondary)] font-medium">
              Cập nhật trực tuyến hàng ngày từ 28+ ngân hàng lớn tại Việt Nam
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/cong-cu-tinh">
              <button className="bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 text-sm font-bold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                🧮 12 Công cụ tính
              </button>
            </Link>
            <Link href="/compare">
              <button className="bg-[var(--bankng-primary)] text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-[var(--bankng-primary)]/90 transition-colors cursor-pointer shadow-md shadow-emerald-500/10">
                📊 So sánh chi tiết
              </button>
            </Link>
          </div>
        </div>

        {/* Dynamic rates tab table switching */}
        <HomepageRatesTabs
          savingRows={rows}
          savingTerms={terms}
          loanProducts={loanProducts}
        />
      </section>

      {/* Bottom CTA — Lead form tư vấn nhanh tương tác trực tiếp */}
      <HomepageLeadForm banks={banks} />
    </main>
  );
}