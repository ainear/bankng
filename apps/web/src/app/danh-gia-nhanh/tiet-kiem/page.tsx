"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@bankng/ui";
import { formatVND, parseVND } from "@/modules/public/loan-calculator";

const SAVINGS_TERMS = ["1", "3", "6", "9", "12", "24", "36"];

const TERM_LABELS: Record<string, string> = {
  "1": "1 tháng",
  "3": "3 tháng",
  "6": "6 tháng",
  "9": "9 tháng",
  "12": "12 tháng",
  "24": "24 tháng",
  "36": "36 tháng",
};

function SavingsCalculatorClient({
  bestRates,
}: {
  bestRates: Record<string, number>;
}) {
  const [principal, setPrincipal] = useState(100_000_000);
  const [termMonths, setTermMonths] = useState(12);
  const [annualRate, setAnnualRate] = useState(6.5);

  const monthlyRate = annualRate / 100 / 12;
  const maturityAmount = principal * (1 + monthlyRate * termMonths);
  const totalInterest = maturityAmount - principal;
  const effectiveAPY = (totalInterest / principal) * (12 / termMonths) * 100;

  const bestRateForTerm = bestRates[termMonths.toString()];
  const isBestRate = bestRateForTerm && annualRate >= bestRateForTerm;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Số tiền gửi (VND)</label>
          <input
            type="text"
            value={formatVND(principal)}
            onChange={(e) => setPrincipal(parseVND(e.target.value))}
            className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-4 py-3 text-lg font-medium"
          />
          <input
            type="range"
            min={10_000_000}
            max={5_000_000_000}
            step={10_000_000}
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--bankng-primary)]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Lãi suất năm (%/năm)
          </label>
          <input
            type="number"
            min={1}
            max={15}
            step={0.1}
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-4 py-3 text-lg font-medium"
          />
          <input
            type="range"
            min={1}
            max={12}
            step={0.1}
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--bankng-primary)]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Kỳ hạn gửi (tháng)
          </label>
          <select
            value={termMonths}
            onChange={(e) => setTermMonths(Number(e.target.value))}
            className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-4 py-3 text-lg font-medium"
          >
            {SAVINGS_TERMS.map((term) => (
              <option key={term} value={term}>
                {TERM_LABELS[term]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="rounded-lg border border-[var(--bankng-border)] bg-[var(--bankng-surface)] p-6">
          <div className="mb-4 text-sm text-[var(--bankng-text-secondary)]">
            Số tiền nhận được khi đáo hạn
          </div>
          <div className="text-3xl font-bold text-[var(--bankng-rate-highlight)]">
            {formatVND(maturityAmount)}
          </div>
          <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
            sau {termMonths} tháng
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white p-4">
            <div className="text-xs text-[var(--bankng-text-secondary)]">Tiền lãi</div>
            <div className="mt-1 font-semibold text-[var(--bankng-warning)]">
              {formatVND(totalInterest)}
            </div>
          </div>
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white p-4">
            <div className="text-xs text-[var(--bankng-text-secondary)]">Lãi suất hiệu quả năm</div>
            <div className="mt-1 font-semibold">{effectiveAPY.toFixed(2)}%</div>
          </div>
        </div>

        {bestRateForTerm && (
          <div className="rounded-lg border border-[var(--bankng-rate-highlight)] bg-[var(--bankng-rate-highlight)]/5 p-4">
            <div className="text-xs text-[var(--bankng-text-secondary)]">
              Lãi suất tốt nhất hiện tại ({TERM_LABELS[termMonths.toString()]})
            </div>
            <div className="mt-1 font-semibold text-[var(--bankng-rate-highlight)]">
              {bestRateForTerm.toFixed(2)}% / năm
            </div>
            {isBestRate && (
              <div className="mt-2 text-xs text-[var(--bankng-rate-highlight)]">
                ✓ Bạn đang hưởng lãi suất tốt nhất
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SavingsCalculatorPage() {
  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6">
          <Link className="text-sm text-[var(--bankng-primary)]" href="/">
            ← Trang chủ
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Công cụ tính lãi suất tiết kiệm</h1>
          <p className="mt-2 text-[var(--bankng-text-secondary)]">
            Tính toán số tiền lãi nhận được khi gửi tiết kiệm, so sánh với lãi suất thị trường.
          </p>
        </div>

        <SavingsCalculatorClient bestRates={{}} />

        <div className="mt-8 rounded-lg border border-[var(--bankng-border)] bg-white p-6">
          <h3 className="font-semibold">Lưu ý</h3>
          <ul className="mt-2 space-y-1 text-sm text-[var(--bankng-text-secondary)]">
            <li>- Kết quả chỉ mang tính tham khảo, chưa bao gồm phí và chi phí khác.</li>
            <li>- Lãi suất thực tế phụ thuộc vào chính sách ngân hàng tại thời điểm đăng ký.</li>
            <li>- Một số ngân hàng có chương trình khuyến mãi cho lãi suất online.</li>
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
