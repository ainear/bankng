"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleFeedback = () => {
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  return (
    <div className="w-full">
      {/* Tabs Selector & Stats Bar */}
      <div className="mb-6 flex flex-col gap-4 border-b border-emerald-500/10 pb-2 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-1 justify-center md:justify-start">
          <button
            onClick={() => setActiveTab("saving")}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm md:text-base border-b-2 transition-all cursor-pointer ${
              activeTab === "saving"
                ? "border-emerald-600 text-emerald-700 bg-emerald-50/30"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            💰 Lãi suất Tiết kiệm
          </button>
          <button
            onClick={() => setActiveTab("loan")}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm md:text-base border-b-2 transition-all cursor-pointer ${
              activeTab === "loan"
                ? "border-emerald-600 text-emerald-700 bg-emerald-50/30"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            🏦 Gói Vay Ưu Đãi
          </button>
        </div>

        {/* View count, update date and feedback buttons */}
        <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-500 px-2 md:px-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">👁️ 24,912 lượt xem</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700">📅 Cập nhật: Hôm nay</span>
          </div>
          <button
            onClick={handleFeedback}
            className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 font-bold text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            💬 Góp ý
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackSuccess && (
        <div className="fixed bottom-5 right-5 z-50 animate-fadeIn rounded-2xl bg-emerald-600 text-white px-5 py-3 shadow-xl flex items-center gap-2 font-bold text-sm">
          <span>✨</span> Cảm ơn bạn đã đóng góp ý kiến giúp Bankng hoàn thiện hơn!
        </div>
      )}

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
            <div className="text-center py-12 rounded-2xl border border-[var(--bankng-border)] bg-white shadow-xs">
              <span className="text-4xl">🏦</span>
              <p className="mt-3 font-semibold text-slate-600">Dữ liệu các gói vay đang được cập nhật</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-emerald-500/10 bg-white/80 backdrop-blur-md shadow-sm">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[var(--bankng-text-primary)] border-b border-[var(--bankng-border)]">
                    <th className="px-4 py-3.5 font-black">#</th>
                    <th className="px-4 py-3.5 font-black">Ngân hàng</th>
                    <th className="px-4 py-3.5 font-black">Gói sản phẩm</th>
                    <th className="px-4 py-3.5 font-black">Loại gói</th>
                    <th className="px-4 py-3.5 font-black text-right">Lãi suất năm</th>
                    <th className="px-4 py-3.5 font-black text-right">Hạn mức vay min</th>
                    <th className="px-4 py-3.5 font-black text-right">Kỳ hạn tối đa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {loanProducts.map((p, idx) => {
                    const cleanLogo = cleanLogoUrl(p.bankLogoUrl);
                    return (
                      <tr key={p.id} className="hover:bg-emerald-50/30 hover:scale-[1.002] transition-all duration-200">
                        <td className="px-4 py-4 text-slate-500 font-semibold">{idx + 1}</td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/bank/${p.bankSlug}`}
                            className="flex items-center gap-2.5 font-bold text-slate-800 hover:text-[var(--bankng-primary)] transition-colors"
                          >
                            {cleanLogo ? (
                              <Image
                                src={cleanLogo}
                                alt={p.bankName}
                                width={26}
                                height={26}
                                className="h-6.5 w-6.5 rounded-md object-contain border border-slate-100"
                              />
                            ) : (
                              <div className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 font-black text-[10px]">
                                {p.bankName.slice(0, 3)}
                              </div>
                            )}
                            <span>{p.bankName}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-4 font-black text-slate-800">
                          <Link href={`/product/${p.id}`} className="hover:text-[var(--bankng-primary)] transition-colors">
                            {p.productName}
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200/50">
                            {p.categoryName}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-black text-emerald-600 text-base">
                              {p.rateValue?.toFixed(2)}%
                            </span>
                            {p.termValue && (
                              <span className="text-[10px] text-slate-400 font-semibold">
                                Ưu đãi {p.termValue} tháng
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-slate-600">
                          {p.minAmount ? `${(p.minAmount / 1000000).toLocaleString("vi-VN")} triệu` : "Không giới hạn"}
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-slate-600">
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
