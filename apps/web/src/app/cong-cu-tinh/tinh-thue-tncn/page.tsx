"use client";

import { useState } from "react";
import Link from "next/link";

// Deductions constant
const DEDUCTION_SELF = 11000000;
const DEDUCTION_DEPENDENT = 4400000;

interface TaxResult {
  taxableIncome: number;
  currentTax: number;
  currentSteps: { step: number; rate: number; taxable: number; taxAmount: number }[];
  reformTax: number;
  reformSteps: { step: number; rate: number; taxable: number; taxAmount: number }[];
  savings: number;
}

export default function PITTaxCalculatorPage() {
  const [totalIncome, setTotalIncome] = useState<number>(30000000);
  const [dependents, setDependents] = useState<number>(0);
  const [insurance, setInsurance] = useState<number>(2000000); // Mặc định bảo hiểm trừ
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  const [result, setResult] = useState<TaxResult | null>(null);

  // Helper to format currency
  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Math.round(num));
  };

  const parseVND = (val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, "");
    return cleanVal ? parseInt(cleanVal, 10) : 0;
  };

  // Thuật toán tính thuế 7 bậc hiện hành
  const calculateCurrentPIT = (taxableIncome: number) => {
    const boundaries = [0, 5000000, 10000000, 18000000, 32000000, 52000000, 80000000];
    const rates = [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35];
    
    let totalTax = 0;
    const stepsDetail = [];

    for (let i = 0; i < boundaries.length; i++) {
      const start = boundaries[i];
      const end = boundaries[i + 1] || Infinity;
      const rate = rates[i];

      if (taxableIncome > start) {
        const taxable = Math.min(taxableIncome, end) - start;
        const taxAmount = taxable * rate;
        totalTax += taxAmount;
        stepsDetail.push({
          step: i + 1,
          rate: rate * 100,
          taxable,
          taxAmount,
        });
      } else {
        break;
      }
    }

    return { totalTax, stepsDetail };
  };

  // Thuật toán tính thuế 5 bậc cải cách dự kiến
  const calculateReformPIT = (taxableIncome: number) => {
    const boundaries = [0, 10000000, 30000000, 60000000, 100000000];
    const rates = [0.05, 0.10, 0.18, 0.28, 0.35];

    let totalTax = 0;
    const stepsDetail = [];

    for (let i = 0; i < boundaries.length; i++) {
      const start = boundaries[i];
      const end = boundaries[i + 1] || Infinity;
      const rate = rates[i];

      if (taxableIncome > start) {
        const taxable = Math.min(taxableIncome, end) - start;
        const taxAmount = taxable * rate;
        totalTax += taxAmount;
        stepsDetail.push({
          step: i + 1,
          rate: rate * 100,
          taxable,
          taxAmount,
        });
      } else {
        break;
      }
    }

    return { totalTax, stepsDetail };
  };

  const handleCalculate = () => {
    const totalDeductions = DEDUCTION_SELF + (dependents * DEDUCTION_DEPENDENT) + insurance + otherDeductions;
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);

    const { totalTax: currentTax, stepsDetail: currentSteps } = calculateCurrentPIT(taxableIncome);
    const { totalTax: reformTax, stepsDetail: reformSteps } = calculateReformPIT(taxableIncome);

    setResult({
      taxableIncome,
      currentTax,
      currentSteps,
      reformTax,
      reformSteps,
      savings: Math.max(0, currentTax - reformTax),
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
            SO SÁNH CẢI CÁCH THUẾ MỚI
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
            Tính Thuế Thu Nhập Cá Nhân & So Sánh Biểu Thuế
          </h1>
          <p className="mt-2 text-base text-[var(--bankng-text-secondary)]">
            So sánh trực quan số tiền thuế phải nộp giữa Biểu thuế 7 bậc hiện hành và Biểu thuế 5 bậc cải cách đang được dự thảo.
          </p>
        </div>

        {/* Form Grid */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left panel Inputs - 2 Cols */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold">Thông tin thu nhập & giảm trừ</h2>

              <div className="space-y-5">
                {/* Total Income */}
                <div>
                  <label htmlFor="income-input" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Tổng thu nhập chịu thuế (VND / tháng)
                  </label>
                  <input
                    id="income-input"
                    type="text"
                    value={totalIncome.toLocaleString("vi-VN")}
                    onChange={(e) => setTotalIncome(parseVND(e.target.value))}
                    className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-lg font-bold text-[var(--bankng-primary)] shadow-inner focus:border-[var(--bankng-primary)] focus:outline-none"
                  />
                  <input
                    type="range"
                    min={5000000}
                    max={150000000}
                    step={1000000}
                    value={totalIncome}
                    onChange={(e) => setTotalIncome(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--bankng-primary)]"
                  />
                </div>

                {/* Dependents number */}
                <div>
                  <label htmlFor="dependents-select" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Số người phụ thuộc
                  </label>
                  <select
                    id="dependents-select"
                    value={dependents}
                    onChange={(e) => setDependents(Number(e.target.value))}
                    className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-semibold shadow-sm focus:border-[var(--bankng-primary)] focus:outline-none"
                  >
                    {[...Array(11).keys()].map((n) => (
                      <option key={n} value={n}>
                        {n} người (Giảm trừ {formatVND(n * DEDUCTION_DEPENDENT)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Insurance paid */}
                <div>
                  <label htmlFor="insurance-input" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Tiền đóng BH bắt buộc (10.5% khấu trừ)
                  </label>
                  <input
                    id="insurance-input"
                    type="text"
                    value={insurance.toLocaleString("vi-VN")}
                    onChange={(e) => setInsurance(parseVND(e.target.value))}
                    className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-semibold shadow-inner focus:border-[var(--bankng-primary)] focus:outline-none"
                  />
                </div>

                {/* Other Deductions */}
                <div>
                  <label htmlFor="other-deductions-input" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Khoản giảm trừ khác (Từ thiện, khuyến học...)
                  </label>
                  <input
                    id="other-deductions-input"
                    type="text"
                    value={otherDeductions.toLocaleString("vi-VN")}
                    onChange={(e) => setOtherDeductions(parseVND(e.target.value))}
                    className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-semibold shadow-inner focus:border-[var(--bankng-primary)] focus:outline-none"
                  />
                </div>

                {/* Info Box */}
                <div className="rounded-xl bg-slate-50 p-4 text-xxs font-semibold leading-relaxed text-[var(--bankng-text-secondary)] border border-slate-100">
                  ⚠️ <strong>Quy định giảm trừ gia cảnh cố định:</strong>
                  <ul className="mt-1 space-y-1 list-disc pl-3">
                    <li>Giảm trừ cho bản thân người nộp thuế: {formatVND(DEDUCTION_SELF)} / tháng.</li>
                    <li>Giảm trừ cho mỗi người phụ thuộc: {formatVND(DEDUCTION_DEPENDENT)} / tháng.</li>
                  </ul>
                </div>

                <button
                  onClick={handleCalculate}
                  className="w-full rounded-xl bg-[var(--bankng-primary)] py-4 text-sm font-bold text-white shadow-md shadow-[var(--bankng-primary)]/20 transition-all hover:bg-[var(--bankng-primary)]/90 active:scale-98"
                >
                  ⚖️ So sánh thuế lũy tiến
                </button>
              </div>
            </div>
          </div>

          {/* Right panel Results - 3 Cols */}
          <div className="lg:col-span-3 space-y-6">
            {!result ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--bankng-border)] bg-white/40 p-12 text-center backdrop-blur-sm">
                <span className="text-5xl animate-bounce">⚖️</span>
                <h3 className="mt-5 text-lg font-bold">Chưa có kết quả phân tích</h3>
                <p className="mt-2 text-sm text-[var(--bankng-text-secondary)] max-w-sm">
                  Vui lòng điền thông tin thu nhập và bấm nút "So sánh thuế lũy tiến" để xem bảng đối chiếu số thuế phải nộp ở mỗi biểu thuế.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Savings highlights card */}
                {result.savings > 0 ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm backdrop-blur-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-emerald-600/5 blur-lg" />
                    <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Tiết kiệm nhờ biểu thuế cải cách mới</h3>
                    <div className="mt-2 text-3xl font-black text-emerald-600">{formatVND(result.savings)} <span className="text-xs font-semibold text-slate-500">/ tháng</span></div>
                    <p className="mt-2 text-xs font-semibold leading-relaxed text-emerald-700">
                      🎉 Tuyệt vời! Biểu thuế 5 bậc cải cách giúp nới rộng các khoảng thu nhập chịu thuế bậc thấp, giúp sếp giữ lại nhiều tiền thực tế hơn mỗi tháng.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm text-center">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Không có sự chênh lệch thuế</h3>
                    <p className="mt-2 text-xs font-semibold text-slate-600">
                      Thu nhập tính thuế của sếp ở mức thấp ({formatVND(result.taxableIncome)}) nên cả 2 biểu thuế đều áp dụng mức thuế suất 5%.
                    </p>
                  </div>
                )}

                {/* Detailed Comparison Table */}
                <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-lg font-bold">Bảng đối chiếu tiền thuế phải nộp</h2>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Current Tax */}
                    <div className="rounded-xl bg-rose-50 p-4 border border-rose-100">
                      <div className="text-xs font-semibold text-rose-800 uppercase">Biểu thuế 7 bậc hiện hành</div>
                      <div className="mt-2 text-2xl font-black text-rose-600">{formatVND(result.currentTax)}</div>
                      <span className="mt-1 block text-xxs font-semibold text-rose-700/80">
                        Áp dụng các mức thuế lũy tiến từ 5% đến 35%
                      </span>
                    </div>

                    {/* Reform Tax */}
                    <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
                      <div className="text-xs font-semibold text-emerald-800 uppercase">Biểu thuế 5 bậc cải cách</div>
                      <div className="mt-2 text-2xl font-black text-emerald-600">{formatVND(result.reformTax)}</div>
                      <span className="mt-1 block text-xxs font-semibold text-emerald-700/80">
                        Giảm số bậc đóng thuế, nới rộng bậc đóng thấp
                      </span>
                    </div>
                  </div>
                </div>

                {/* Steps break down side by side */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Current Steps */}
                  <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-xs font-bold text-rose-800 uppercase tracking-wider">Lũy tiến chi tiết 7 bậc hiện hành</h3>
                    {result.currentTax === 0 ? (
                      <p className="text-xs text-[var(--bankng-text-secondary)] font-semibold">Chưa phát sinh thu nhập tính thuế.</p>
                    ) : (
                      <div className="space-y-3">
                        {result.currentSteps.map((step) => (
                          <div key={step.step} className="flex justify-between border-b border-slate-50 pb-2 text-xs font-semibold">
                            <div>
                              <span className="rounded bg-rose-50 px-1.5 py-0.5 text-xxs text-rose-700 font-bold mr-1.5">Bậc {step.step}</span>
                              <span className="text-slate-600">Thuế suất {step.rate}%:</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-slate-800">{formatVND(step.taxAmount)}</span>
                              <span className="text-xxs text-[var(--bankng-text-secondary)] font-medium">trên {formatVND(step.taxable)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reform Steps */}
                  <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-xs font-bold text-emerald-800 uppercase tracking-wider">Lũy tiến chi tiết 5 bậc cải cách</h3>
                    {result.reformTax === 0 ? (
                      <p className="text-xs text-[var(--bankng-text-secondary)] font-semibold">Chưa phát sinh thu nhập tính thuế.</p>
                    ) : (
                      <div className="space-y-3">
                        {result.reformSteps.map((step) => (
                          <div key={step.step} className="flex justify-between border-b border-slate-50 pb-2 text-xs font-semibold">
                            <div>
                              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xxs text-emerald-700 font-bold mr-1.5">Bậc {step.step}</span>
                              <span className="text-slate-600">Thuế suất {step.rate}%:</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-slate-800">{formatVND(step.taxAmount)}</span>
                              <span className="text-xxs text-[var(--bankng-text-secondary)] font-medium">trên {formatVND(step.taxable)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
