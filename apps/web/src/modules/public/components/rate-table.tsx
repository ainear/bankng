"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicBadge } from "./public-badge";
import type { RateMatrixRow } from "../rate-matrix";
import { cleanLogoUrl } from "../../../components/bank-logo-helper";

type Props = {
  rows: RateMatrixRow[];
  terms: string[];
};

function getFreshnessLabel(effectiveFrom: Date, now: Date) {
  const ageDays = (now.getTime() - effectiveFrom.getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays <= 7) return { label: "Mới", tone: "success" as const };
  if (ageDays <= 30) return { label: "Gần đây", tone: "warning" as const };
  return { label: "Cũ", tone: "danger" as const };
}

const TERM_LABELS: Record<string, string> = {
  "1": "1 tháng",
  "3": "3 tháng",
  "6": "6 tháng",
  "9": "9 tháng",
  "12": "12 tháng",
  "24": "24 tháng",
  "36": "36 tháng",
};

const BANK_TYPE_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "big4", label: "Big 4" },
  { value: "private", label: "Ngân hàng Tư nhân" },
  { value: "foreign", label: "Ngân hàng Nước ngoài" },
];

export function RateTable({ rows: initialRows, terms }: Props) {
  const [bankType, setBankType] = useState("all");
  const [sortTerm, setSortTerm] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const now = new Date();

  // Client-side filtering
  const filteredRows = initialRows.filter((row) => {
    if (bankType === "all") return true;
    if (bankType === "big4") return isBig4(row.bankSlug);
    if (bankType === "private") return isPrivate(row.bankSlug);
    if (bankType === "foreign") return isForeign(row.bankSlug);
    return true;
  });

  const sortedRows = sortTerm
    ? [...filteredRows].sort((a, b) => {
        const aRate = a.rates[sortTerm]?.rateValue ?? -1;
        const bRate = b.rates[sortTerm]?.rateValue ?? -1;
        return sortDir === "desc" ? bRate - aRate : aRate - bRate;
      })
    : filteredRows;

  // Tìm lãi suất cao nhất mỗi kỳ hạn để highlight
  const bestRatePerTerm: Record<string, number> = {};
  for (const term of terms) {
    const rates = filteredRows
      .map((r) => r.rates[term]?.rateValue ?? 0)
      .filter((v) => v > 0);
    bestRatePerTerm[term] = rates.length > 0 ? Math.max(...rates) : 0;
  }

  if (filteredRows.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-[var(--bankng-text-secondary)]">
        Chưa có dữ liệu tiết kiệm cho bộ lọc này.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-md border border-[var(--bankng-border)] p-1 text-xs">
          <span className="px-3 py-1.5 font-medium text-[var(--bankng-text-secondary)]">
            Lãi suất niêm yết
          </span>
        </div>

        <select
          value={bankType}
          onChange={(e) => setBankType(e.target.value)}
          className="min-h-10 rounded-xl border border-emerald-500/10 bg-white/80 backdrop-blur-md px-4 text-sm font-bold text-slate-700 outline-none shadow-xs transition-all focus:border-emerald-500 cursor-pointer"
        >
          {BANK_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              🏦 Phân loại: {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-emerald-500/10 bg-white/80 backdrop-blur-md shadow-sm">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[var(--bankng-text-primary)] border-b border-[var(--bankng-border)]">
              <th className="px-4 py-3.5 text-left font-black text-[var(--bankng-text-primary)]">#</th>
              <th className="px-4 py-3.5 text-left font-black text-[var(--bankng-text-primary)]">Ngân hàng</th>
              {terms.map((term) => (
                <th
                  key={term}
                  className={`cursor-pointer px-3 py-3.5 text-right font-black transition-colors hover:text-[var(--bankng-primary)] ${
                    sortTerm === term
                      ? "bg-emerald-500/5 text-[var(--bankng-primary)]"
                      : "text-[var(--bankng-text-secondary)]"
                  }`}
                  onClick={() => {
                    if (sortTerm === term) {
                      if (sortDir === "desc") setSortDir("asc");
                      else { setSortTerm(null); setSortDir("desc"); }
                    } else {
                      setSortTerm(term);
                      setSortDir("desc");
                    }
                  }}
                >
                  <div className="flex flex-col items-end gap-1">
                    <span className="whitespace-nowrap">{TERM_LABELS[term]}</span>
                    <div className="flex items-center gap-0.5 text-[10px]">
                      {sortTerm === term && (
                        <span className="font-bold text-emerald-600">{sortDir === "desc" ? "▼ giảm" : "▲ tăng"}</span>
                      )}
                      {sortTerm !== term && (
                        <span className="opacity-30">⇅ lọc</span>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {sortedRows.map((row, idx) => (
              <tr
                key={row.bankSlug}
                className="hover:bg-emerald-50/30 hover:scale-[1.002] transition-all duration-200"
              >
                <td className="px-4 py-4 text-slate-500 font-semibold">{idx + 1}</td>
                <td className="px-4 py-4">
                  <Link
                    href={`/bank/${row.bankSlug}`}
                    className="flex items-center gap-2.5 font-bold text-[var(--bankng-text-primary)] hover:text-[var(--bankng-primary)] transition-colors"
                  >
                    {cleanLogoUrl(row.bankLogoUrl) ? (
                      <Image
                        src={cleanLogoUrl(row.bankLogoUrl)!}
                        alt={row.bankName}
                        width={26}
                        height={26}
                        className="h-6.5 w-6.5 rounded-md object-contain border border-slate-100"
                      />
                    ) : (
                      <div className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 font-black text-[10px]">
                        {row.bankShortName?.[0] ?? row.bankName[0]}
                      </div>
                    )}
                    <span className="whitespace-nowrap">{row.bankShortName ?? row.bankName}</span>
                  </Link>
                </td>
                {terms.map((term) => {
                  const rate = row.rates[term];
                  if (!rate) {
                    return (
                      <td key={term} className="px-3 py-4 text-center text-slate-400 font-semibold">
                        —
                      </td>
                    );
                  }
                  const isBest = rate.rateValue === bestRatePerTerm[term] && rate.rateValue > 0;
                  const freshness = getFreshnessLabel(rate.effectiveFrom, now);
                  return (
                    <td key={term} className={`px-3 py-4 text-right transition-colors ${isBest ? "bg-emerald-50/40" : ""}`}>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          {isBest && (
                            <span className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-[8px] font-black tracking-wider text-white uppercase shadow-xs">TOP</span>
                          )}
                          <span className={`font-black text-base ${
                            isBest ? "text-emerald-600" : "text-slate-800"
                          }`}>
                            {rate.rateValue.toFixed(2)}%
                          </span>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                          freshness.tone === "success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : freshness.tone === "warning"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                          {freshness.label}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function isBig4(slug: string) {
  return ["vietcombank", "vietinbank", "bidv", "agribank"].includes(slug);
}

function isForeign(slug: string) {
  return [
    "shinhanbank", "standardchartered", "citibank", "hsbc",
    "publicbank", "cimb", "uob", "hongleong", "woori",
  ].includes(slug);
}

function isPrivate(slug: string) {
  return !isBig4(slug) && !isForeign(slug);
}