import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@bankng/ui";
import { LoanCalculatorClient, type LoanType } from "./loan-calculator-client";

const LOAN_TYPES = {
  "vay-mua-nha": {
    name: "Vay mua nhà",
    description: "Tính toán lãi suất vay mua nhà với các gói vay từ 500 triệu đến 10 tỷ đồng.",
  },
  "vay-mua-xe": {
    name: "Vay mua xe",
    description: "Tính toán lãi suất vay mua xe ô tô, xe máy với các gói vay linh hoạt.",
  },
  "vay-tin-chap": {
    name: "Vay tín chấp",
    description: "Tính toán lãi suất vay tín chấp cá nhân không cần tài sản đảm bảo.",
  },
  "vay-kinh-doanh": {
    name: "Vay kinh doanh",
    description: "Tính toán lãi suất vay vốn lưu động hoặc đầu tư cho doanh nghiệp.",
  },
  "the-tin-dung": {
    name: "Thẻ tín dụng",
    description: "So sánh lãi suất và chi phí thẻ tín dụng từ các ngân hàng.",
  },
};

export default async function LoanEvalPage({
  params,
}: {
  params: Promise<{ "loan-type": string }>;
}) {
  const resolvedParams = await params;
  const loanType = resolvedParams["loan-type"];

  const validLoanTypes = Object.keys(LOAN_TYPES);
  if (!validLoanTypes.includes(loanType)) {
    notFound();
  }

  const config = LOAN_TYPES[loanType as keyof typeof LOAN_TYPES];

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6">
          <Link className="text-sm text-[var(--bankng-primary)]" href="/">
            ← Trang chủ
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Công cụ tính {config.name.toLowerCase()}</h1>
          <p className="mt-2 text-[var(--bankng-text-secondary)]">
            {config.description}
          </p>
        </div>

        <LoanCalculatorClient loanType={loanType as LoanType} />

        <div className="mt-8 rounded-lg border border-[var(--bankng-border)] bg-white p-6">
          <h3 className="font-semibold">Lưu ý</h3>
          <ul className="mt-2 space-y-1 text-sm text-[var(--bankng-text-secondary)]">
            <li>- Kết quả chỉ mang tính tham khảo, chưa bao gồm phí và chi phí khác.</li>
            <li>- Lãi suất thực tế phụ thuộc vào người vay và chính sách ngân hàng tại thời điểm đăng ký.</li>
            <li>- Bạn nên liên hệ nhân viên ngân hàng để được tư vấn cụ thể.</li>
          </ul>
          <div className="mt-4">
            <Link href="/danh-sach-bankers">
              <Button>Được tư vấn từ nhân viên ngân hàng</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
