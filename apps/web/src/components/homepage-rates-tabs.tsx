"use client";

import { useState } from "react";
import Link from "next/link";
import { RateTable } from "@/modules/public/components/rate-table";
import { cleanLogoUrl } from "@/components/bank-logo-helper";

interface LoanProduct {
  id: string;
  bankName: string;
  bankLogoUrl: string | null;
  bankSlug: string;
  productName: string;
  categoryName: string;
  categorySlug: string;
  rateValue: number | null;
  termValue: number | null;
  minAmount: number | null;
  maxTermMonth: number | null;
}

interface Props {
  savingRows: any[];
  savingTerms: string[];
  loanProducts: LoanProduct[];
}

export function HomepageRatesTabs({ savingRows, savingTerms, loanProducts }: Props) {
  const [activeTab, setActiveTab] = useState<"saving" | "loan">("saving");

  return (
    <div className="w-full">
      {/* Tabs Selector */}
      <div className="flex border-b border-emerald-500/10 mb-8 justify-center">
        <button
          onClick={() => setActiveTab("saving")}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm md:text-base border-b-2 transition-all cursor-pointer ${
            activeTab === "saving"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          💰 Lãi suất Tiết kiệm
        </button>
        <button
          onClick={() => setActiveTab("loan")}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm md:text-base border-b-2 transition-all cursor-pointer ${
            activeTab === "loan"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          🏦 Gói Vay Ưu Đãi
        </button>
      </div>

      {/* Saving Rates Tab Content */}
      {activeTab === "saving" && (
        <div className="animate-fadeIn">
          <RateTable rows={savingRows} terms={savingTerms} />
        </div>
      )}

      {/* Loan Products Tab Content */}
      {activeTab === "loan" && (
        <div className="animate-fadeIn">
          {loanProducts.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-[var(--bankng-border)] bg-white">
              <span className="text-4xl">🏦</span>
              <p className="mt-3 font-semibold text-slate-600">Dữ liệu các gói vay đang được cập nhật</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[var(--bankng-border)] bg-white">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[var(--bankng-text-primary)] border-b border-[var(--bankng-border)]">
                    <th className="px-4 py-3.5 font-bold">#</th>
                    <th className="px-4 py-3.5 font-bold">Ngân hàng</th>
                    <th className="px-4 py-3.5 font-bold">Gói sản phẩm</th>
                    <th className="px-4 py-3.5 font-bold">Loại gói</th>
                    <th className="px-4 py-3.5 font-bold text-right">Lãi suất năm</th>
                    <th className="px-4 py-3.5 font-bold text-right">Hạn mức vay min</th>
                    <th className="px-4 py-3.5 font-bold text-right">Kỳ hạn tối đa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {loanProducts.map((p, idx) => {
                    const cleanLogo = cleanLogoUrl(p.bankLogoUrl);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-4 text-slate-500 font-medium">{idx + 1}</td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/bank/${p.bankSlug}`}
                            className="flex items-center gap-2.5 font-semibold text-slate-800 hover:text-[var(--bankng-primary)]"
                          >
                            {cleanLogo ? (
                              <img
                                src={cleanLogo}
                                alt={p.bankName}
                                className="h-6 w-6 rounded-sm object-contain"
                              />
                            ) : (
                              <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                                {p.bankName.slice(0, 3)}
                              </div>
                            )}
                            <span>{p.bankName}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-800">
                          <Link href={`/product/${p.id}`} className="hover:text-[var(--bankng-primary)]">
                            {p.productName}
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                            {p.categoryName}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-extrabold text-emerald-600 text-base">
                              {p.rateValue?.toFixed(2)}%
                            </span>
                            {p.termValue && (
                              <span className="text-[10px] text-slate-400 font-medium">
                                Ưu đãi {p.termValue} tháng
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right font-medium text-slate-600">
                          {p.minAmount ? `${(p.minAmount / 1000000).toLocaleString("vi-VN")} triệu` : "Không giới hạn"}
                        </td>
                        <td className="px-4 py-4 text-right font-medium text-slate-600">
                          {p.maxTermMonth ? `${p.maxTermMonth} tháng` : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
