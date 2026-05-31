"use client";

import { useState } from "react";
import Link from "next/link";
import { RepaymentPieChart, RepaymentBarChart } from "@/components/chart-components";

interface LoanMaxResult {
  monthlyNetIncome: number;
  maxMonthlyPayment: number;
  maxLoanAmount: number;
  dtiPercentage: number;
  termMonths: number;
  annualRate: number;
  totalInterest: number;
  monthlyData: any[];
}

export default function MaxLoanCalculatorPage() {
  const [income, setIncome] = useState<number>(30000000);
  const [livingExpenses, setLivingExpenses] = useState<number>(10000000);
  const [otherDebts, setOtherDebts] = useState<number>(0);
  const [dtiLimit, setDtiLimit] = useState<number>(50); // Mặc định DTI tối đa là 50%
  const [loanTermYears, setLoanTermYears] = useState<number>(20); // 20 năm
  const [annualRate, setAnnualRate] = useState<number>(8.5); // 8.5%

  const [result, setResult] = useState<LoanMaxResult | null>(null);

  // Helper to format currency
  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Math.round(num));
  };

  const parseVND = (val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, "");
    return cleanVal ? parseInt(cleanVal, 10) : 0;
  };

  const handleCalculate = () => {
    // 1. Dòng tiền ròng khả dụng (Thu nhập - Chi phí sinh hoạt - Nợ khác)
    const netCashflow = Math.max(0, income - livingExpenses - otherDebts);

    // 2. Số tiền trả nợ tối đa hàng tháng theo giới hạn DTI (Thu nhập * DTI% - Nợ khác)
    const dtiPaymentLimit = Math.max(0, (income * dtiLimit) / 100 - otherDebts);

    // 3. Số tiền trả nợ hàng tháng tối đa cho phép (Lấy min của 2 điều kiện)
    const maxMonthlyPayment = Math.min(netCashflow, dtiPaymentLimit);

    // 4. Tính ngược khoản vay tối đa P từ số tiền trả hàng tháng cố định EMI (Annuity)
    const termMonths = loanTermYears * 12;
    const monthlyRate = annualRate / 100 / 12;

    let maxLoanAmount = 0;
    if (monthlyRate > 0) {
      const compoundFactor = Math.pow(1 + monthlyRate, termMonths);
      maxLoanAmount = maxMonthlyPayment * ((compoundFactor - 1) / (monthlyRate * compoundFactor));
    } else {
      maxLoanAmount = maxMonthlyPayment * termMonths;
    }

    const totalPaid = maxMonthlyPayment * termMonths;
    const totalInterest = Math.max(0, totalPaid - maxLoanAmount);

    // Generate monthly schedule for first 12 months
    const monthlyData: any[] = [];
    let remaining = maxLoanAmount;
    for (let m = 1; m <= Math.min(termMonths, 12); m++) {
      const interestPaid = remaining * monthlyRate;
      const principalPaid = maxMonthlyPayment - interestPaid;
      remaining = Math.max(0, remaining - principalPaid);
      monthlyData.push({
        monthIndex: m,
        principalPaid,
        interestPaid,
        remainingBalance: remaining
      });
    }

    setResult({
      monthlyNetIncome: income - livingExpenses - otherDebts,
      maxMonthlyPayment,
      maxLoanAmount: Math.max(0, maxLoanAmount),
      dtiPercentage: ((maxMonthlyPayment + otherDebts) / income) * 100,
      termMonths,
      annualRate,
      totalInterest,
      monthlyData
    });
  };

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      {/* Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[50%] rounded-full bg-[var(--bankng-primary)]/5 blur-[120px]" />
        <div className="absolute top-[30%] -right-[15%] h-[60%] w-[55%] rounded-full bg-[var(--bankng-primary)]/5 blur-[120px]" />
      </div>

      <section className="mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--bankng-primary)] hover:underline"
            href="/cong-cu-tinh"
          >
            ← Tất cả công cụ
          </Link>
        </div>

        {/* Title */}
        <div className="mb-10 text-center md:text-left">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            HẠN MỨC VAY TỐI ĐA
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
            Ước Tính Khoản Vay Tối Đa Có Thể Giải Ngân
          </h1>
          <p className="mt-2 text-base text-[var(--bankng-text-secondary)]">
            Dựa trên quy trình thẩm định dòng tiền thực tế của ngân hàng, giúp sếp biết chính xác hạn mức vay an toàn dựa trên thu nhập.
          </p>
        </div>

        {/* Form and Results Grid */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Inputs Panel - 2 Cols */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold">Thông tin tài chính cá nhân</h2>

              <div className="space-y-4">
                {/* Monthly Income */}
                <div>
                  <label htmlFor="income-input" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Thu nhập hàng tháng thực tế (VND)
                  </label>
                  <input
                    id="income-input"
                    type="text"
                    value={income.toLocaleString("vi-VN")}
                    onChange={(e) => setIncome(parseVND(e.target.value))}
                    className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-bold text-[var(--bankng-primary)] shadow-inner focus:border-[var(--bankng-primary)] focus:outline-none"
                  />
                  <input
                    type="range"
                    min={5000000}
                    max={150000000}
                    step={1000000}
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--bankng-primary)]"
                  />
                </div>

                {/* Monthly Living Expenses */}
                <div>
                  <label htmlFor="expenses-input" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Chi phí sinh hoạt tối thiểu (VND)
                  </label>
                  <input
                    id="expenses-input"
                    type="text"
                    value={livingExpenses.toLocaleString("vi-VN")}
                    onChange={(e) => setLivingExpenses(parseVND(e.target.value))}
                    className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-semibold shadow-inner focus:border-[var(--bankng-primary)] focus:outline-none"
                  />
                </div>

                {/* Other Debts */}
                <div>
                  <label htmlFor="other-debts-input" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Các khoản trả nợ khác hàng tháng (Nếu có)
                  </label>
                  <input
                    id="other-debts-input"
                    type="text"
                    value={otherDebts.toLocaleString("vi-VN")}
                    onChange={(e) => setOtherDebts(parseVND(e.target.value))}
                    className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-semibold shadow-inner focus:border-[var(--bankng-primary)] focus:outline-none"
                  />
                </div>

                {/* DTI Limit */}
                <div>
                  <label htmlFor="dti-select" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Tỷ lệ DTI tối đa (Tổng nợ / Thu nhập)
                  </label>
                  <select
                    id="dti-select"
                    value={dtiLimit}
                    onChange={(e) => setDtiLimit(Number(e.target.value))}
                    className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-semibold shadow-sm focus:border-[var(--bankng-primary)] focus:outline-none"
                  >
                    <option value={40}>40% - Ngưỡng vay cực kỳ an toàn</option>
                    <option value={50}>50% - Mức tiêu chuẩn của Ngân hàng</option>
                    <option value={60}>60% - Mức vay tối đa cho phép</option>
                  </select>
                </div>

                {/* Loan Term Years */}
                <div>
                  <label htmlFor="term-select" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Kỳ hạn vay mong muốn (Năm)
                  </label>
                  <select
                    id="term-select"
                    value={loanTermYears}
                    onChange={(e) => setLoanTermYears(Number(e.target.value))}
                    className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-semibold shadow-sm focus:border-[var(--bankng-primary)] focus:outline-none"
                  >
                    {[5, 10, 15, 20, 25, 30, 35].map((y) => (
                      <option key={y} value={y}>
                        {y} năm ({y * 12} tháng)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Interest Rate */}
                <div>
                  <label htmlFor="rate-input" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Lãi suất vay dự kiến (% / năm)
                  </label>
                  <input
                    id="rate-input"
                    type="number"
                    min={1}
                    max={20}
                    step={0.1}
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-semibold shadow-inner focus:border-[var(--bankng-primary)] focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleCalculate}
                  className="w-full rounded-xl bg-[var(--bankng-primary)] py-4 text-sm font-bold text-white shadow-md shadow-[var(--bankng-primary)]/20 transition-all hover:bg-[var(--bankng-primary)]/90 active:scale-98"
                >
                  🚀 Tính hạn mức vay tối đa
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel - 3 Cols */}
          <div className="lg:col-span-3 space-y-6">
            {!result ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--bankng-border)] bg-white/40 p-12 text-center backdrop-blur-sm">
                <span className="text-5xl animate-bounce">🏠</span>
                <h3 className="mt-5 text-lg font-bold">Chưa có thông tin hạn mức</h3>
                <p className="mt-2 text-sm text-[var(--bankng-text-secondary)] max-w-sm">
                  Hãy điền thông tin thu nhập, chi phí sinh hoạt và bấm nút để ước tính hạn mức vay ngân hàng lớn nhất sếp có thể đạt được.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Max loan display */}
                <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[var(--bankng-primary)]/5 blur-xl" />

                  <h3 className="text-xs font-bold text-[var(--bankng-text-secondary)] uppercase tracking-wider">Hạn mức vay tối đa ước tính</h3>
                  <div className="mt-2 text-3xl md:text-4.5xl font-black text-[var(--bankng-primary)]">
                    {formatVND(result.maxLoanAmount)}
                  </div>
                  <p className="mt-3 text-xs font-semibold leading-relaxed text-[var(--bankng-text-secondary)] border-t border-slate-100 pt-3">
                    📌 Đây là số tiền giải ngân tối đa dựa trên dòng tiền ròng của sếp trong thời hạn **{loanTermYears} năm** với mức lãi suất giả định **{annualRate}%/năm**.
                  </p>
                </div>

                {/* Monthly payments and indicators */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Maximum Monthly Installment */}
                  <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-5 shadow-sm">
                    <h4 className="text-xs font-semibold text-[var(--bankng-text-secondary)] uppercase tracking-wider">Tiền trả hàng tháng tối đa cho phép</h4>
                    <div className="mt-2 text-xl font-bold text-emerald-600">
                      {formatVND(result.maxMonthlyPayment)}
                    </div>
                    <span className="mt-1 block text-xxs font-medium text-slate-500">
                      (Đã trừ chi phí sinh hoạt và các khoản nợ khác)
                    </span>
                  </div>

                  {/* DTI status */}
                  <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-5 shadow-sm">
                    <h4 className="text-xs font-semibold text-[var(--bankng-text-secondary)] uppercase tracking-wider">Tỷ lệ nợ thu nhập thực tế (DTI)</h4>
                    <div className="mt-2 text-xl font-bold text-blue-600">
                      {result.dtiPercentage.toFixed(1)}%
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${Math.min(100, result.dtiPercentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
                {/* Visual repayment analysis - Charts */}
                <div className="grid gap-6 md:grid-cols-5">
                  <div className="md:col-span-2">
                    <RepaymentPieChart
                      principal={result.maxLoanAmount}
                      interest={result.totalInterest}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <RepaymentBarChart
                      monthlyData={result.monthlyData}
                    />
                  </div>
                </div>

                {/* Analytical breakdown */}
                <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-base font-bold">Thẩm định dòng tiền chi tiết từ Ngân hàng</h3>

                  <div className="divide-y divide-slate-100 text-sm font-medium">
                    <div className="flex justify-between py-3">
                      <span className="text-[var(--bankng-text-secondary)]">Tổng thu nhập hàng tháng:</span>
                      <span className="text-slate-800 font-bold">{formatVND(income)}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-[var(--bankng-text-secondary)]">Chi phí sinh hoạt tối thiểu:</span>
                      <span className="text-rose-600">-{formatVND(livingExpenses)}</span>
                    </div>
                    {otherDebts > 0 && (
                      <div className="flex justify-between py-3">
                        <span className="text-[var(--bankng-text-secondary)]">Nợ tín dụng/vay khác:</span>
                        <span className="text-rose-600">-{formatVND(otherDebts)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3">
                      <span className="text-[var(--bankng-text-secondary)]">Dòng tiền ròng khả dụng (Khả năng tích lũy):</span>
                      <span className="text-emerald-700 font-bold">{formatVND(result.monthlyNetIncome)}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-[var(--bankng-text-secondary)]">Giới hạn nợ trả theo trần DTI ({dtiLimit}%):</span>
                      <span className="text-blue-700 font-bold">{formatVND((income * dtiLimit) / 100 - otherDebts)}</span>
                    </div>
                    <div className="flex justify-between py-4 text-[var(--bankng-primary)] font-black text-base">
                      <span>Dự chi trả hàng tháng cố định tối đa:</span>
                      <span>{formatVND(result.maxMonthlyPayment)}</span>
                    </div>
                  </div>
                </div>

                {/* CTA bank connect */}
                <div className="rounded-2xl border border-dashed border-[var(--bankng-primary)]/40 bg-[var(--bankng-surface)] p-6 text-center">
                  <h4 className="font-bold text-[var(--bankng-text-primary)]">Sếp muốn nhận gói vay thực tế sát nhất với hạn mức này?</h4>
                  <p className="mt-1.5 text-xs text-[var(--bankng-text-secondary)]">
                    Nhân viên tín dụng của các ngân hàng Big4 & Cổ phần trên Bankng sẽ thiết lập hồ sơ vay ưu đãi tối đa cho sếp.
                  </p>
                  <Link href="/danh-sach-bankers">
                    <button className="mt-4 rounded-xl bg-[var(--bankng-primary)] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[var(--bankng-primary)]/90">
                      Gửi hồ sơ thẩm định nhanh ➔
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
