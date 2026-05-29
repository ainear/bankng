"use client";

import { useState } from "react";
import { formatVND, parseVND } from "@/modules/public/loan-calculator";

export type LoanType = "vay-mua-nha" | "vay-mua-xe" | "vay-tin-chap" | "vay-kinh-doanh" | "the-tin-dung";

type LoanConfig = {
  name: string;
  defaultPrincipal: number;
  defaultTerm: number;
  defaultRate: number;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
};

const LOAN_CONFIGS: Record<LoanType, LoanConfig> = {
  "vay-mua-nha": {
    name: "Vay mua nhà",
    defaultPrincipal: 1_000_000_000,
    defaultTerm: 240,
    defaultRate: 8.5,
    minAmount: 100_000_000,
    maxAmount: 20_000_000_000,
    minTerm: 12,
    maxTerm: 360,
  },
  "vay-mua-xe": {
    name: "Vay mua xe",
    defaultPrincipal: 500_000_000,
    defaultTerm: 60,
    defaultRate: 9.0,
    minAmount: 10_000_000,
    maxAmount: 5_000_000_000,
    minTerm: 6,
    maxTerm: 84,
  },
  "vay-tin-chap": {
    name: "Vay tín chấp",
    defaultPrincipal: 100_000_000,
    defaultTerm: 24,
    defaultRate: 12.0,
    minAmount: 5_000_000,
    maxAmount: 500_000_000,
    minTerm: 3,
    maxTerm: 60,
  },
  "vay-kinh-doanh": {
    name: "Vay kinh doanh",
    defaultPrincipal: 1_000_000_000,
    defaultTerm: 36,
    defaultRate: 10.0,
    minAmount: 50_000_000,
    maxAmount: 50_000_000_000,
    minTerm: 3,
    maxTerm: 120,
  },
  "the-tin-dung": {
    name: "Thẻ tín dụng",
    defaultPrincipal: 10_000_000,
    defaultTerm: 12,
    defaultRate: 18.0,
    minAmount: 1_000_000,
    maxAmount: 500_000_000,
    minTerm: 1,
    maxTerm: 60,
  },
};

interface AmortizationRow {
  month: number;
  beginningBalance: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  endingBalance: number;
}

export function LoanCalculatorClient({
  loanType,
}: {
  loanType: LoanType;
}) {
  const config = LOAN_CONFIGS[loanType];

  const [principal, setPrincipal] = useState(config.defaultPrincipal);
  const [annualRate, setAnnualRate] = useState(config.defaultRate);
  const [termMonths, setTermMonths] = useState(config.defaultTerm);
  const [calcMethod, setCalcMethod] = useState<"reducing" | "annuity">("reducing");
  const [showSchedule, setShowSchedule] = useState(true);

  // Generate Amortization Schedule based on selected method
  const schedule: AmortizationRow[] = [];
  let totalInterest = 0;
  let totalPayment = 0;

  const monthlyRate = annualRate / 100 / 12;

  if (calcMethod === "annuity") {
    // 1. Annuity Method (Trả gốc + lãi đều hàng tháng)
    let remaining = principal;
    let monthlyAnnuity = 0;
    if (monthlyRate === 0) {
      monthlyAnnuity = principal / termMonths;
    } else {
      monthlyAnnuity =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);
    }

    for (let m = 1; m <= termMonths; m++) {
      const interestPaid = remaining * monthlyRate;
      let principalPaid = monthlyAnnuity - interestPaid;
      
      // Handle rounding error on the last month
      if (m === termMonths || remaining < principalPaid) {
        principalPaid = remaining;
      }
      
      const endingBalance = Math.max(0, remaining - principalPaid);
      const rowPayment = principalPaid + interestPaid;

      schedule.push({
        month: m,
        beginningBalance: remaining,
        principalPaid,
        interestPaid,
        totalPaid: rowPayment,
        endingBalance,
      });

      totalInterest += interestPaid;
      totalPayment += rowPayment;
      remaining = endingBalance;
    }
  } else {
    // 2. Reducing Method (Gốc trả đều, lãi giảm dần)
    const principalPaidPerMonth = principal / termMonths;
    let remaining = principal;

    for (let m = 1; m <= termMonths; m++) {
      const interestPaid = remaining * monthlyRate;
      let principalPaid = principalPaidPerMonth;

      // Handle rounding error on the last month
      if (m === termMonths || remaining < principalPaid) {
        principalPaid = remaining;
      }

      const endingBalance = Math.max(0, remaining - principalPaid);
      const rowPayment = principalPaid + interestPaid;

      schedule.push({
        month: m,
        beginningBalance: remaining,
        principalPaid,
        interestPaid,
        totalPaid: rowPayment,
        endingBalance,
      });

      totalInterest += interestPaid;
      totalPayment += rowPayment;
      remaining = endingBalance;
    }
  }

  // Calculate monthly payment info
  const avgMonthlyPayment = totalPayment / termMonths;
  const initialMonthlyPayment = schedule[0]?.totalPaid ?? 0;
  const finalMonthlyPayment = schedule[schedule.length - 1]?.totalPaid ?? 0;
  const interestPercentage = (totalInterest / (principal + totalInterest)) * 100;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Input Controls */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[var(--bankng-text-primary)] mb-5 flex items-center gap-2 border-b pb-3">
              <span>🧮</span> Nhập thông tin khoản vay {config.name}
            </h2>

            <div className="space-y-6">
              {/* Phương thức tính lãi */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                  Phương thức tính lãi
                </label>
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-1">
                  <button
                    type="button"
                    onClick={() => setCalcMethod("reducing")}
                    className={`rounded-md py-2 text-xs font-semibold transition-all ${
                      calcMethod === "reducing"
                        ? "bg-white text-[var(--bankng-primary)] shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Dư nợ giảm dần
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcMethod("annuity")}
                    className={`rounded-md py-2 text-xs font-semibold transition-all ${
                      calcMethod === "annuity"
                        ? "bg-white text-[var(--bankng-primary)] shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Trả đều hàng tháng (Annuity)
                  </button>
                </div>
              </div>

              {/* Số tiền vay */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Số tiền cần vay
                  </label>
                  <span className="text-sm font-bold text-[var(--bankng-primary)]">
                    {formatVND(principal)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formatVND(principal)}
                    onChange={(e) => setPrincipal(parseVND(e.target.value))}
                    className="w-full rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3 text-lg font-bold text-gray-800 focus:border-[var(--bankng-primary)] focus:outline-none"
                  />
                  <span className="absolute right-4 top-3.5 text-sm font-medium text-gray-400">VND</span>
                </div>
                <input
                  type="range"
                  min={config.minAmount}
                  max={config.maxAmount}
                  step={Math.max(10_000_000, (config.maxAmount - config.minAmount) / 100)}
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="mt-3.5 w-full accent-[var(--bankng-primary)] cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-[10px] text-gray-400 font-medium">
                  <span>Tối thiểu: {formatVND(config.minAmount)}</span>
                  <span>Tối đa: {formatVND(config.maxAmount)}</span>
                </div>
              </div>

              {/* Lãi suất */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                      Lãi suất năm
                    </label>
                    <span className="text-sm font-bold text-[var(--bankng-primary)]">
                      {annualRate}% / năm
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min={0.1}
                      max={30}
                      step={0.1}
                      value={annualRate}
                      onChange={(e) => setAnnualRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3 text-lg font-bold text-gray-800 focus:border-[var(--bankng-primary)] focus:outline-none"
                    />
                    <span className="absolute right-4 top-3.5 text-sm font-medium text-gray-400">%/năm</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={25}
                    step={0.1}
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                    className="mt-3.5 w-full accent-[var(--bankng-primary)] cursor-pointer"
                  />
                </div>

                {/* Thời hạn vay */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                      Thời hạn vay
                    </label>
                    <span className="text-sm font-bold text-[var(--bankng-primary)]">
                      {termMonths} tháng ({Math.floor(termMonths / 12)} năm {termMonths % 12 > 0 ? `${termMonths % 12} tháng` : ""})
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min={config.minTerm}
                      max={config.maxTerm}
                      value={termMonths}
                      onChange={(e) => setTermMonths(Number(e.target.value))}
                      className="w-full rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3 text-lg font-bold text-gray-800 focus:border-[var(--bankng-primary)] focus:outline-none"
                    />
                    <span className="absolute right-4 top-3.5 text-sm font-medium text-gray-400">tháng</span>
                  </div>
                  <input
                    type="range"
                    min={config.minTerm}
                    max={config.maxTerm}
                    step={1}
                    value={termMonths}
                    onChange={(e) => setTermMonths(Number(e.target.value))}
                    className="mt-3.5 w-full accent-[var(--bankng-primary)] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Block */}
        <div className="space-y-4 lg:col-span-5">
          {/* Main Monthly Payment Box */}
          <div className="rounded-xl border border-[var(--bankng-border)] bg-[var(--bankng-surface)] p-6 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-[var(--bankng-primary)] opacity-5"></div>
            
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
              {calcMethod === "annuity" ? "Thanh toán hàng tháng cố định" : "Thanh toán tháng đầu tiên"}
            </div>
            
            <div className="text-3xl font-extrabold text-[var(--bankng-rate-highlight)] tracking-tight">
              {formatVND(calcMethod === "annuity" ? avgMonthlyPayment : initialMonthlyPayment)}
              <span className="text-sm font-semibold text-[var(--bankng-text-secondary)] tracking-normal"> / tháng</span>
            </div>
            
            {calcMethod === "reducing" && (
              <div className="mt-2 text-xs text-[var(--bankng-text-secondary)] flex items-center gap-1">
                <span>Số tiền thanh toán sẽ giảm dần về:</span>
                <strong className="text-gray-800">{formatVND(finalMonthlyPayment)}</strong>
                <span>ở tháng cuối.</span>
              </div>
            )}
          </div>

          {/* Donut Distribution and Core Details */}
          <div className="rounded-xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Phân bổ tổng chi phí</h3>
            
            <div className="flex items-center gap-6">
              {/* Donut chart using pure SVG */}
              <div className="relative h-28 w-28 shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle (Principal) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="#e2e8f0"
                    strokeWidth="3.2"
                  ></circle>
                  {/* Foreground Circle (Interest Percentage) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="var(--bankng-warning)"
                    strokeWidth="3.2"
                    strokeDasharray={`${interestPercentage} ${100 - interestPercentage}`}
                    strokeDashoffset="0"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-extrabold text-gray-800">{(100 - interestPercentage).toFixed(0)}%</span>
                  <span className="text-[9px] font-semibold text-gray-400 uppercase">Gốc gốc</span>
                </div>
              </div>

              {/* Data Labels */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-200"></span>
                    <span className="text-xs text-[var(--bankng-text-secondary)]">Tiền gốc vay:</span>
                  </div>
                  <strong className="text-xs font-semibold text-gray-800">{formatVND(principal)}</strong>
                </div>
                <div className="flex items-start justify-between gap-2 border-t pt-2 border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--bankng-warning)]"></span>
                    <span className="text-xs text-[var(--bankng-text-secondary)]">Tổng lãi phải trả:</span>
                  </div>
                  <strong className="text-xs font-semibold text-[var(--bankng-warning)]">{formatVND(totalInterest)}</strong>
                </div>
                <div className="flex items-start justify-between gap-2 border-t pt-2 border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--bankng-primary)]"></span>
                    <span className="text-xs text-[var(--bankng-text-secondary)]">Tổng gốc + lãi:</span>
                  </div>
                  <strong className="text-xs font-bold text-[var(--bankng-primary)]">{formatVND(totalPayment)}</strong>
                </div>
              </div>
            </div>

            {/* Extra Info Grid */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4 border-gray-100">
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Trả trung bình</div>
                <div className="mt-1 font-bold text-gray-800 text-xs">{formatVND(avgMonthlyPayment)} / thg</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Lãi suất hiệu quả</div>
                <div className="mt-1 font-bold text-gray-800 text-xs">{((totalInterest / principal) * 100).toFixed(2)}% / năm</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Schedule Button */}
      <div className="flex items-center justify-between border-t pt-6 border-gray-100">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Lịch trả nợ chi tiết hàng tháng</h3>
          <p className="text-xs text-[var(--bankng-text-secondary)]">Bảng tính khấu hao chi tiết theo phương pháp {calcMethod === "reducing" ? "dư nợ giảm dần" : "trả đều"}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowSchedule(!showSchedule)}
          className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
        >
          {showSchedule ? "🙈 Ẩn lịch chi tiết" : "📊 Hiển thị lịch chi tiết"}
        </button>
      </div>

      {/* Amortization Schedule Table */}
      {showSchedule && (
        <div className="overflow-hidden rounded-xl border border-[var(--bankng-border)] bg-white shadow-sm transition-all">
          <div className="max-h-[460px] overflow-y-auto custom-scrollbar">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-[var(--bankng-border)] bg-gray-50 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 w-16">Kỳ (Tháng)</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Dư nợ đầu kỳ</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 text-gray-800">Tiền gốc</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 text-[var(--bankng-warning)]">Tiền lãi</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 text-[var(--bankng-primary)]">Tổng trả hàng tháng</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Dư nợ cuối kỳ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bankng-border)]">
                {schedule.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-center font-bold text-gray-600 bg-gray-50/30">{row.month}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-600">{formatVND(row.beginningBalance)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-700">{formatVND(row.principalPaid)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-[var(--bankng-warning)]">{formatVND(row.interestPaid)}</td>
                    <td className="px-4 py-3 text-right font-bold text-[var(--bankng-primary)] bg-blue-50/10">{formatVND(row.totalPaid)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-600">{formatVND(row.endingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center text-xs text-gray-500">
            <div>
              Tổng số kỳ: <strong>{termMonths} tháng</strong> · Dư nợ ban đầu: <strong>{formatVND(principal)}</strong>
            </div>
            <div>
              Tổng lãi lũy kế: <strong className="text-[var(--bankng-warning)]">{formatVND(totalInterest)}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
