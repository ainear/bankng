"use client";

import { useState } from "react";
import Link from "next/link";

// Constants for Insurance & Tax (Updated for 2026/2025)
const MIN_WAGE_BY_ZONE = {
  "I": 4960000,
  "II": 4410000,
  "III": 3860000,
  "IV": 3450000,
};

const BASE_SALARY = 2340000; // Mức lương cơ sở từ 01/07/2024
const MAX_BHXH_BHYT_BASE = BASE_SALARY * 20; // 46,800,000 VND

// Personal tax deductions
const DEDUCTION_SELF = 11000000;
const DEDUCTION_DEPENDENT = 4400000;

interface CalculationResult {
  salaryGross: number;
  salaryNet: number;
  bhxh: number;
  bhyt: number;
  bhtn: number;
  totalInsurance: number;
  beforeTax: number;
  deductionSelf: number;
  deductionDependents: number;
  totalDeduction: number;
  taxableIncome: number;
  pit: number;
  taxSteps: { step: number; rate: number; taxable: number; taxAmount: number }[];
}

export default function GrossNetCalculatorPage() {
  const [salaryInput, setSalaryInput] = useState<number>(20000000);
  const [inputType, setInputType] = useState<"GROSS_TO_NET" | "NET_TO_GROSS">("GROSS_TO_NET");
  const [dependents, setDependents] = useState<number>(0);
  const [zone, setZone] = useState<"I" | "II" | "III" | "IV">("I");
  const [insuranceSalaryType, setInsuranceSalaryType] = useState<"FULL" | "OTHER">("FULL");
  const [customInsuranceSalary, setCustomInsuranceSalary] = useState<number>(5000000);

  const [result, setResult] = useState<CalculationResult | null>(null);

  // Helper to format currency
  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Math.round(num));
  };

  // Helper to parse input formatted currency
  const parseVND = (val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, "");
    return cleanVal ? parseInt(cleanVal, 10) : 0;
  };

  // Thuật toán tính PIT lũy tiến từng phần
  const calculatePIT = (taxableIncome: number) => {
    const steps = [
      { max: 5000000, rate: 0.05, subtract: 0 },
      { max: 10000000, rate: 0.10, subtract: 250000 },
      { max: 18000000, rate: 0.15, subtract: 750000 },
      { max: 32000000, rate: 0.20, subtract: 1650000 },
      { max: 52000000, rate: 0.25, subtract: 3250000 },
      { max: 80000000, rate: 0.30, subtract: 5850000 },
      { max: Infinity, rate: 0.35, subtract: 9850000 },
    ];

    if (taxableIncome <= 0) return { totalTax: 0, stepsDetail: [] };

    let remaining = taxableIncome;
    let totalTax = 0;
    const stepsDetail = [];

    const boundaries = [0, 5000000, 10000000, 18000000, 32000000, 52000000, 80000000];
    const rates = [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35];

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

  // Thuật toán tính toán từ Gross sang Net
  const calculateGrossToNet = (gross: number): CalculationResult => {
    // 1. Xác định mức lương đóng bảo hiểm
    const insuranceBase = insuranceSalaryType === "FULL" ? gross : customInsuranceSalary;

    // Giới hạn mức đóng BHXH, BHYT tối đa là 46,800,000 VND
    const bhxhBhyBase = Math.min(insuranceBase, MAX_BHXH_BHYT_BASE);

    // Giới hạn mức đóng BHTN tối đa là 20 lần mức tối thiểu vùng
    const maxBhtnBase = MIN_WAGE_BY_ZONE[zone] * 20;
    const bhtnBase = Math.min(insuranceBase, maxBhtnBase);

    // Tính các khoản bảo hiểm
    const bhxh = bhxhBhyBase * 0.08;
    const bhyt = bhxhBhyBase * 0.015;
    const bhtn = bhtnBase * 0.01;
    const totalInsurance = bhxh + bhyt + bhtn;

    // Thu nhập trước thuế
    const beforeTax = gross - totalInsurance;

    // Giảm trừ gia cảnh
    const deductionSelf = DEDUCTION_SELF;
    const deductionDependents = dependents * DEDUCTION_DEPENDENT;
    const totalDeduction = deductionSelf + deductionDependents;

    // Thu nhập tính thuế
    const taxableIncome = Math.max(0, beforeTax - totalDeduction);

    // Thuế TNCN (PIT)
    const { totalTax: pit, stepsDetail: taxSteps } = calculatePIT(taxableIncome);

    // Thực nhận (Net)
    const salaryNet = beforeTax - pit;

    return {
      salaryGross: gross,
      salaryNet,
      bhxh,
      bhyt,
      bhtn,
      totalInsurance,
      beforeTax,
      deductionSelf,
      deductionDependents,
      totalDeduction,
      taxableIncome,
      pit,
      taxSteps,
    };
  };

  // Thuật toán tính ngược từ Net sang Gross dùng Binary Search để đảm bảo chính xác tuyệt đối
  const calculateNetToGross = (net: number): CalculationResult => {
    let low = net;
    let high = net * 3; // Gross thông thường không vượt quá gấp 3 lần Net
    let mid = 0;
    let iterations = 0;

    // Chạy nhị phân tìm Gross tối ưu nhất
    while (high - low > 1 && iterations < 100) {
      mid = (low + high) / 2;
      const testNet = calculateGrossToNet(mid).salaryNet;
      if (testNet < net) {
        low = mid;
      } else {
        high = mid;
      }
      iterations++;
    }

    return calculateGrossToNet(high);
  };

  const handleCalculate = () => {
    if (inputType === "GROSS_TO_NET") {
      setResult(calculateGrossToNet(salaryInput));
    } else {
      setResult(calculateNetToGross(salaryInput));
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      {/* Background gradients */}
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

        {/* Title Section */}
        <div className="mb-10 text-center md:text-left">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            CÔNG CỤ PHÂN TÍCH TIỀN LƯƠNG
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
            Quy Đổi Lương Gross Sang Net (Mới Nhất)
          </h1>
          <p className="mt-2 text-base text-[var(--bankng-text-secondary)]">
            Hỗ trợ quy đổi tiền lương hai chiều, tính toán chi tiết bảo hiểm bắt buộc và thuế TNCN theo Nghị quyết và vùng tối thiểu hiện hành.
          </p>
        </div>

        {/* Layout */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Inputs Section - Left 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold">Thông tin nhập liệu</h2>

              <div className="space-y-5">
                {/* Mode toggle button group */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Phương thức quy đổi
                  </label>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-[var(--bankng-surface-muted)] p-1">
                    <button
                      onClick={() => setInputType("GROSS_TO_NET")}
                      className={`rounded-lg py-2.5 text-xs font-bold transition-all ${
                        inputType === "GROSS_TO_NET"
                          ? "bg-white text-[var(--bankng-primary)] shadow-sm"
                          : "text-[var(--bankng-text-secondary)] hover:text-[var(--bankng-text-primary)]"
                      }`}
                    >
                      Gross ➔ Net
                    </button>
                    <button
                      onClick={() => setInputType("NET_TO_GROSS")}
                      className={`rounded-lg py-2.5 text-xs font-bold transition-all ${
                        inputType === "NET_TO_GROSS"
                          ? "bg-white text-[var(--bankng-primary)] shadow-sm"
                          : "text-[var(--bankng-text-secondary)] hover:text-[var(--bankng-text-primary)]"
                      }`}
                    >
                      Net ➔ Gross
                    </button>
                  </div>
                </div>

                {/* Salary Input */}
                <div>
                  <label htmlFor="salary-input" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    {inputType === "GROSS_TO_NET" ? "Mức lương Gross (VND)" : "Mức lương Net (VND)"}
                  </label>
                  <input
                    id="salary-input"
                    type="text"
                    value={salaryInput.toLocaleString("vi-VN")}
                    onChange={(e) => setSalaryInput(parseVND(e.target.value))}
                    className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-lg font-bold text-[var(--bankng-primary)] shadow-inner focus:border-[var(--bankng-primary)] focus:outline-none"
                  />
                  <input
                    type="range"
                    min={2000000}
                    max={120000000}
                    step={1000000}
                    value={salaryInput}
                    onChange={(e) => setSalaryInput(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--bankng-primary)]"
                  />
                </div>

                {/* Dependents Number */}
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
                        {n} người ({formatVND(n * DEDUCTION_DEPENDENT)} / tháng)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Minimum Wage Zone */}
                <div>
                  <label htmlFor="zone-select" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Vùng tối thiểu lương (Đóng bảo hiểm)
                  </label>
                  <select
                    id="zone-select"
                    value={zone}
                    onChange={(e) => setZone(e.target.value as any)}
                    className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-semibold shadow-sm focus:border-[var(--bankng-primary)] focus:outline-none"
                  >
                    <option value="I">Vùng I - Đô thị lớn ({formatVND(MIN_WAGE_BY_ZONE["I"])})</option>
                    <option value="II">Vùng II - Thành phố lớn vừa ({formatVND(MIN_WAGE_BY_ZONE["II"])})</option>
                    <option value="III">Vùng III - Khu công nghiệp phụ ({formatVND(MIN_WAGE_BY_ZONE["III"])})</option>
                    <option value="IV">Vùng IV - Khu vực nông thôn ({formatVND(MIN_WAGE_BY_ZONE["IV"])})</option>
                  </select>
                </div>

                {/* Insurance base type option */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                    Lương đóng Bảo hiểm bắt buộc
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setInsuranceSalaryType("FULL")}
                      className={`rounded-xl border p-3 text-xs font-bold transition-all ${
                        insuranceSalaryType === "FULL"
                          ? "border-[var(--bankng-primary)] bg-[var(--bankng-primary)]/5 text-[var(--bankng-primary)]"
                          : "border-[var(--bankng-border)] bg-white text-[var(--bankng-text-secondary)] hover:bg-[var(--bankng-surface)]"
                      }`}
                    >
                      Đóng trên lương thực tế
                    </button>
                    <button
                      onClick={() => setInsuranceSalaryType("OTHER")}
                      className={`rounded-xl border p-3 text-xs font-bold transition-all ${
                        insuranceSalaryType === "OTHER"
                          ? "border-[var(--bankng-primary)] bg-[var(--bankng-primary)]/5 text-[var(--bankng-primary)]"
                          : "border-[var(--bankng-border)] bg-white text-[var(--bankng-text-secondary)] hover:bg-[var(--bankng-surface)]"
                      }`}
                    >
                      Đóng mức tùy chọn
                    </button>
                  </div>
                </div>

                {/* Custom Insurance Base input if chosen */}
                {insuranceSalaryType === "OTHER" && (
                  <div>
                    <label htmlFor="custom-insurance-input" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                      Lương đóng BH tùy chọn (VND)
                    </label>
                    <input
                      id="custom-insurance-input"
                      type="text"
                      value={customInsuranceSalary.toLocaleString("vi-VN")}
                      onChange={(e) => setCustomInsuranceSalary(parseVND(e.target.value))}
                      className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-semibold shadow-inner focus:border-[var(--bankng-primary)] focus:outline-none"
                    />
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={handleCalculate}
                  className="mt-2 w-full rounded-xl bg-[var(--bankng-primary)] py-4 text-sm font-bold text-white shadow-md shadow-[var(--bankng-primary)]/20 transition-all hover:bg-[var(--bankng-primary)]/90 active:scale-98"
                >
                  🚀 Quy đổi & Phân tích ngay
                </button>
              </div>
            </div>
          </div>

          {/* Results Analysis - Right 3 Columns */}
          <div className="lg:col-span-3 space-y-6">
            {!result ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--bankng-border)] bg-white/40 p-12 text-center backdrop-blur-sm">
                <span className="text-5xl animate-bounce">📊</span>
                <h3 className="mt-5 text-lg font-bold">Chưa có kết quả tính toán</h3>
                <p className="mt-2 text-sm text-[var(--bankng-text-secondary)] max-w-sm">
                  Vui lòng điền thông tin và bấm nút "Quy đổi & Phân tích" ở bảng bên trái để hiển thị bảng bóc tách lương chi tiết.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Core comparison card */}
                <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[var(--bankng-primary)]/5 blur-xl" />

                  <h2 className="mb-5 text-lg font-bold">Bảng bóc tách lương thực nhận</h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Gross */}
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                      <div className="text-xs font-semibold text-[var(--bankng-text-secondary)]">LƯƠNG GROSS (Tổng thu nhập)</div>
                      <div className="mt-1 text-2xl font-black text-slate-800">{formatVND(result.salaryGross)}</div>
                    </div>
                    {/* Net */}
                    <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
                      <div className="text-xs font-semibold text-emerald-800">LƯƠNG NET (Thực nhận)</div>
                      <div className="mt-1 text-2xl font-black text-emerald-600">{formatVND(result.salaryNet)}</div>
                    </div>
                  </div>

                  {/* Dynamic SVG Donut Chart */}
                  <div className="mt-6 flex flex-col md:flex-row items-center gap-6 border-t border-slate-100 pt-6">
                    <div className="relative h-32 w-32 shrink-0">
                      {/* Simple CSS-SVG Pie for salary distribution */}
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke="#059669"
                          strokeWidth="3.5"
                          strokeDasharray={`${(result.salaryNet / result.salaryGross) * 100} ${100 - (result.salaryNet / result.salaryGross) * 100}`}
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="3.5"
                          strokeDasharray={`${(result.pit / result.salaryGross) * 100} ${100 - (result.pit / result.salaryGross) * 100}`}
                          strokeDashoffset={-((result.salaryNet / result.salaryGross) * 100)}
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                          strokeDasharray={`${(result.totalInsurance / result.salaryGross) * 100} ${100 - (result.totalInsurance / result.salaryGross) * 100}`}
                          strokeDashoffset={-(((result.salaryNet + result.pit) / result.salaryGross) * 100)}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xxs font-semibold text-[var(--bankng-text-secondary)]">Thực nhận</span>
                        <span className="text-sm font-black text-emerald-600">
                          {((result.salaryNet / result.salaryGross) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-emerald-600" />
                          <span>Lương thực nhận (Net):</span>
                        </div>
                        <span>{((result.salaryNet / result.salaryGross) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-amber-500" />
                          <span>Bảo hiểm bắt buộc:</span>
                        </div>
                        <span>{((result.totalInsurance / result.salaryGross) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-red-500" />
                          <span>Thuế thu nhập cá nhân:</span>
                        </div>
                        <span>{((result.pit / result.salaryGross) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insurance & deductions details table */}
                <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-base font-bold">Chi tiết các khoản khấu trừ nộp nhà nước</h3>

                  <div className="divide-y divide-slate-100 text-sm font-medium">
                    <div className="flex justify-between py-3">
                      <span className="text-[var(--bankng-text-secondary)]">Lương Gross (Tổng nhận ban đầu):</span>
                      <span className="font-bold text-slate-800">{formatVND(result.salaryGross)}</span>
                    </div>

                    {/* Insurances detail */}
                    <div className="py-3 space-y-2">
                      <div className="flex justify-between text-slate-800 font-bold">
                        <span>Các khoản bảo hiểm đóng (10.5%):</span>
                        <span className="text-amber-600">-{formatVND(result.totalInsurance)}</span>
                      </div>
                      <div className="pl-4 flex justify-between text-xs text-[var(--bankng-text-secondary)]">
                        <span>- BHXH (Hưu trí, ốm đau - 8%):</span>
                        <span>{formatVND(result.bhxh)}</span>
                      </div>
                      <div className="pl-4 flex justify-between text-xs text-[var(--bankng-text-secondary)]">
                        <span>- BHYT (Y tế khám chữa - 1.5%):</span>
                        <span>{formatVND(result.bhyt)}</span>
                      </div>
                      <div className="pl-4 flex justify-between text-xs text-[var(--bankng-text-secondary)]">
                        <span>- BHTN (Thất nghiệp - 1%):</span>
                        <span>{formatVND(result.bhtn)}</span>
                      </div>
                    </div>

                    {/* Deductions details */}
                    <div className="py-3 space-y-2">
                      <div className="flex justify-between text-slate-800 font-bold">
                        <span>Tổng giảm trừ gia cảnh:</span>
                        <span className="text-blue-600">{formatVND(result.totalDeduction)}</span>
                      </div>
                      <div className="pl-4 flex justify-between text-xs text-[var(--bankng-text-secondary)]">
                        <span>- Giảm trừ bản thân (Cố định):</span>
                        <span>{formatVND(result.deductionSelf)}</span>
                      </div>
                      <div className="pl-4 flex justify-between text-xs text-[var(--bankng-text-secondary)]">
                        <span>- Giảm trừ người phụ thuộc ({dependents} người):</span>
                        <span>{formatVND(result.deductionDependents)}</span>
                      </div>
                    </div>

                    {/* Taxable Income */}
                    <div className="flex justify-between py-3">
                      <span className="text-[var(--bankng-text-secondary)]">Thu nhập tính thuế TNCN:</span>
                      <span className="font-bold text-slate-800">{formatVND(result.taxableIncome)}</span>
                    </div>

                    {/* PIT Tax */}
                    <div className="flex justify-between py-3 text-slate-800 font-bold">
                      <span>Thuế TNCN phải nộp (Lũy tiến):</span>
                      <span className="text-red-600">-{formatVND(result.pit)}</span>
                    </div>

                    {/* Final Net */}
                    <div className="flex justify-between py-4 text-emerald-700 font-black text-base">
                      <span>Lương thực nhận (Net):</span>
                      <span>{formatVND(result.salaryNet)}</span>
                    </div>
                  </div>
                </div>

                {/* Tax steps detail table if PIT > 0 */}
                {result.pit > 0 && (
                  <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-base font-bold">Chi tiết biểu thuế lũy tiến từng bậc</h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-semibold border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-[var(--bankng-text-secondary)]">
                            <th className="py-2">Bậc</th>
                            <th className="py-2">Thu nhập tính thuế</th>
                            <th className="py-2 text-center">Thuế suất</th>
                            <th className="py-2 text-right">Thuế phải nộp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-slate-800">
                          {result.taxSteps.map((step) => (
                            <tr key={step.step}>
                              <td className="py-2">Bậc {step.step}</td>
                              <td className="py-2">{formatVND(step.taxable)}</td>
                              <td className="py-2 text-center font-bold text-slate-500">{step.rate}%</td>
                              <td className="py-2 text-right font-bold text-red-600">{formatVND(step.taxAmount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
