import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thuật ngữ tài chính ngân hàng",
  description:
    "Giải thích các thuật ngữ tài chính ngân hàng phổ biến: lãi suất, amortization, EMI, LTV, LDR, APY... Tham khảo dễ hiểu, cập nhật cho người dùng Việt Nam.",
  keywords: [
    "thuật ngữ ngân hàng",
    "thuật ngữ tài chính",
    "lãi suất là gì",
    "EMI là gì",
    "APY là gì",
    "amortization là gì",
  ],
};

export const dynamic = "force-dynamic";


const GLOSSARY_TERMS = [
  {
    term: "Lãi suất",
    definition: "Tỷ lệ phần trăm được ngân hàng hoặc tổ chức tín dụng thu từ người gửi hoặc người vay, tính trên một đơn vị thời gian (năm hoặc tháng).",
  },
  {
    term: "Lãi suất tiết kiệm",
    definition: "Tỷ lệ lãi suất mà ngân hàng trả cho khách hàng khi gửi tiền tiết kiệm tại ngân hàng. Đây là thu nhập của người gửi.",
  },
  {
    term: "Lãi suất vay",
    definition: "Tỷ lệ lãi suất mà khách hàng phải trả cho ngân hàng khi vay tiền. Bao gồm vay mua nhà, vay mua xe, vay tiêu dùng, vay kinh doanh.",
  },
  {
    term: "Vay mua nhà (Mortgage)",
    definition: "Khoản vay dài hạn để mua bất động sản, trong đó bất động sản được dùng làm tài sản đảm bảo.",
  },
  {
    term: "Vay mua xe (Auto Loan)",
    definition: "Khoản vay để mua phương tiện giao thông, thường có thời hạn từ 1-8 năm.",
  },
  {
    term: "Vay tín chấp (Personal Loan)",
    definition: "Khoản vay không cần tài sản đảm bảo, dựa trên uy tín của người vay. Thông thường có lãi suất cao hơn vay có đảm bảo.",
  },
  {
    term: "Amortization (Khấu hao)",
    definition: "Quá trình trả nợ theo định kỳ, bao gồm cả gốc và lãi, trong suốt thời gian vay.",
  },
  {
    term: "Amortization Schedule",
    definition: "Bảng chi tiết lịch trả nợ, cho biết số tiền trả hàng tháng được phân bổ như thế nào giữa gốc và lãi.",
  },
  {
    term: "APY (Annual Percentage Yield)",
    definition: "Tỷ suất lợi nhuận năm, tính theo lãi suất và số lần gộp trong năm. Dùng để so sánh lợi tức tiết kiệm.",
  },
  {
    term: "EMI (Equated Monthly Installment)",
    definition: "Số tiền trả hàng tháng cố định, bao gồm cả gốc và lãi, được tính theo công thức amortization.",
  },
  {
    term: "Foreclosure",
    definition: "Quá trình ngân hàng thu hồi bất động sản khi người vay không còn khả năng trả nợ.",
  },
  {
    term: "Refinancing",
    definition: "Vay mới để trả nợ cũ, thường nhằm mục đích giảm lãi suất hoặc thay đổi thời hạn vay.",
  },
  {
    term: "Credit Score",
    definition: "Điểm tín dụng, phản ánh lịch sử tín dụng của một cá nhân. Điểm cao giúp dễ dàng được phê duyệt vay.",
  },
  {
    term: "Collateral (Tài sản đảm bảo)",
    definition: "Tài sản mà người vay thế chấp để đảm bảo cho khoản vay. Nếu không trả được, ngân hàng có quyền thu hồi.",
  },
  {
    term: "Debt-to-Income Ratio",
    definition: "Tỷ lệ nợ thu nhập, tính bằng cách chia tổng nợ hàng tháng cho tổng thu nhập hàng tháng. Chỉ số này được ngân hàng sử dụng để đánh giá khả năng trả nợ.",
  },
  {
    term: "Fixed Rate (Lãi suất cố định)",
    definition: "Lãi suất được giữ nguyên trong toàn bộ thời gian vay, không thay đổi theo thị trường.",
  },
  {
    term: "Floating Rate (Lãi suất thả nổi)",
    definition: "Lãi suất có thể thay đổi theo lãi suất thị trường trong thời gian vay.",
  },
  {
    term: "Processing Fee (Phí xử lý)",
    definition: "Phí mà ngân hàng thu khi xử lý hồ sơ vay, thường tính theo phần trăm của số tiền vay.",
  },
];

export default function GlossaryPage() {
  // Group terms by first letter
  const groupedTerms = GLOSSARY_TERMS.reduce<Record<string, typeof GLOSSARY_TERMS>>(
    (acc, item) => {
      const letter = item.term[0].toUpperCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(item);
      return acc;
    },
    {}
  );

  const sortedLetters = Object.keys(groupedTerms).sort();

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Thuật ngữ ngân hàng</h1>
          <p className="mt-2 text-[var(--bankng-text-secondary)]">
            Giải thích các thuật ngữ tài chính và ngân hàng thường dùng.
          </p>
        </div>

        {/* Quick nav */}
        <div className="mb-8 flex flex-wrap gap-2">
          {sortedLetters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--bankng-border)] bg-white text-sm font-medium hover:bg-[var(--bankng-surface)]"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Terms */}
        <div className="space-y-8">
          {sortedLetters.map((letter) => (
            <div key={letter} id={`letter-${letter}`}>
              <h2 className="mb-4 text-2xl font-bold text-[var(--bankng-primary)]">
                {letter}
              </h2>
              <div className="space-y-4">
                {groupedTerms[letter].map((item) => (
                  <div
                    key={item.term}
                    className="rounded-lg border border-[var(--bankng-border)] bg-white p-4"
                  >
                    <h3 className="font-semibold text-[var(--bankng-text-primary)]">
                      {item.term}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-lg border border-[var(--bankng-border)] bg-[var(--bankng-surface)] p-6 text-center">
          <h3 className="font-semibold">Cần tư vấn thêm?</h3>
          <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">
            Liên hệ nhân viên ngân hàng để được giải đáp các thắc mắc.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/danh-sach-bankers">
              <button className="rounded-md bg-[var(--bankng-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--bankng-primary)]/90">
                Danh sách nhân viên
              </button>
            </Link>
            <Link href="/tin-tuc">
              <button className="rounded-md border border-[var(--bankng-border)] bg-white px-4 py-2 text-sm font-medium hover:bg-[var(--bankng-surface)]">
                Đọc bài viết
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
