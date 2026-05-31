"use client";

import { useState } from "react";
import { cleanLogoUrl } from "@/components/bank-logo-helper";

interface BankData {
  id: string;
  name: string;
  shortName: string | null;
  slug: string;
  logoUrl: string | null;
  products: {
    name: string;
    categorySlug: string;
    variants: {
      minAmount: number | null;
      maxTermMonth: number | null;
      rates: {
        rateValue: number;
        termValue: number | null;
      }[];
    }[];
  }[];
}

interface Props {
  banks: BankData[];
}

export function DynamicCompareMatrix({ banks }: Props) {
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [compareType, setCompareType] = useState<"vay-mua-nha" | "tiet-kiem">("vay-mua-nha");

  const handleToggleBank = (bankId: string) => {
    if (selectedBanks.includes(bankId)) {
      setSelectedBanks(selectedBanks.filter(id => id !== bankId));
    } else {
      if (selectedBanks.length >= 3) {
        alert("Bro chỉ có thể so sánh tối đa 3 ngân hàng song song nhé!");
        return;
      }
      setSelectedBanks([...selectedBanks, bankId]);
    }
  };

  // Lọc lấy các ngân hàng được chọn
  const activeBanks = banks.filter(b => selectedBanks.includes(b.id));

  // Trích xuất thông tin sản phẩm so sánh tương ứng với loại so sánh
  const compareResults = activeBanks.map(b => {
    const product = b.products.find(p => p.categorySlug === compareType);
    const variant = product?.variants[0];
    const rate = variant?.rates[0];

    return {
      name: b.shortName ?? b.name,
      logoUrl: cleanLogoUrl(b.logoUrl),
      productName: product?.name ?? "Chưa cấu hình gói",
      rateValue: rate ? `${rate.rateValue.toFixed(2)}%` : "N/A",
      termValue: rate?.termValue ? `${rate.termValue} tháng` : "N/A",
      minAmount: variant?.minAmount ? `${(variant.minAmount / 1000000).toLocaleString("vi-VN")} triệu` : "Không giới hạn",
      maxTerm: variant?.maxTermMonth ? `${variant.maxTermMonth} tháng` : "N/A",
      insuranceRequired: compareType === "vay-mua-nha" ? "Không ép buộc" : "Không áp dụng",
      penaltyRate: compareType === "vay-mua-nha" ? "1.5% - 2.0% (năm đầu)" : "0.0% (rút gốc trước hạn nhận lãi không kỳ hạn)",
      advantage: compareType === "vay-mua-nha" ? "Phê duyệt nhanh, biên độ thấp" : "Nhận lãi online tiện lợi"
    };
  });

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl shadow-emerald-500/5 mt-8 animate-fadeIn">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">⚖️ Tự so sánh đối chiếu Song song</h2>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Chọn tối đa 3 ngân hàng để so sánh lãi suất và các điều kiện chi tiết
          </p>
        </div>
        {/* Toggle loại so sánh */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setCompareType("vay-mua-nha")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              compareType === "vay-mua-nha" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🏠 Vay mua nhà
          </button>
          <button
            onClick={() => setCompareType("tiet-kiem")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              compareType === "tiet-kiem" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            💰 Gửi tiết kiệm
          </button>
        </div>
      </div>

      {/* Danh sách ngân hàng để tick chọn */}
      <div className="mb-8">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Bước 1: Chọn ngân hàng so sánh</span>
        <div className="flex flex-wrap gap-2">
          {banks.map(b => {
            const isSelected = selectedBanks.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => handleToggleBank(b.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/5 font-bold"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {b.logoUrl && (
                  <img
                    src={cleanLogoUrl(b.logoUrl) || "https://vietqr.net/portal-assets/img/logo-vietqr.png"}
                    alt={b.name}
                    className="h-4 w-4 rounded-sm object-contain"
                  />
                )}
                {b.shortName ?? b.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bảng kết quả so sánh song song */}
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Bước 2: Kết quả đối chiếu chi tiết</span>
        
        {selectedBanks.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <span className="text-3xl">⚖️</span>
            <p className="mt-2 text-sm font-semibold text-slate-500">Vui lòng tick chọn ít nhất 1 ngân hàng ở trên để bắt đầu so sánh</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-800 border-b border-slate-100">
                  <th className="px-4 py-3.5 font-bold w-1/4">Tiêu chí so sánh</th>
                  {compareResults.map((r, i) => (
                    <th key={i} className="px-4 py-3.5 font-bold text-center border-l border-slate-100">
                      <div className="flex flex-col items-center gap-1.5">
                        {r.logoUrl && (
                          <img src={r.logoUrl} alt={r.name} className="h-8 w-8 object-contain" />
                        )}
                        <span className="font-extrabold text-slate-900 text-sm">{r.name}</span>
                      </div>
                    </th>
                  ))}
                  {/* Fill columns if less than 3 */}
                  {Array.from({ length: 3 - compareResults.length }).map((_, i) => (
                    <th key={`empty-${i}`} className="px-4 py-3.5 font-medium text-slate-300 text-center border-l border-slate-100">
                      Chọn thêm ngân hàng
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* Lãi suất */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-bold text-slate-900 bg-slate-50/30">Lãi suất hàng năm</td>
                  {compareResults.map((r, i) => (
                    <td key={i} className="px-4 py-4 text-center font-extrabold text-emerald-600 text-base border-l border-slate-100">
                      {r.rateValue}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareResults.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="px-4 py-4 text-center text-slate-300 border-l border-slate-100">—</td>
                  ))}
                </tr>

                {/* Ưu đãi */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-500">Thời gian ưu đãi</td>
                  {compareResults.map((r, i) => (
                    <td key={i} className="px-4 py-4 text-center font-medium border-l border-slate-100">
                      {r.termValue}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareResults.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="px-4 py-4 text-center text-slate-300 border-l border-slate-100">—</td>
                  ))}
                </tr>

                {/* Tên gói */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-500">Gói sản phẩm</td>
                  {compareResults.map((r, i) => (
                    <td key={i} className="px-4 py-4 text-center font-semibold text-slate-800 border-l border-slate-100 text-xs">
                      {r.productName}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareResults.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="px-4 py-4 text-center text-slate-300 border-l border-slate-100">—</td>
                  ))}
                </tr>

                {/* Hạn mức tối thiểu */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-500">Hạn mức tối thiểu</td>
                  {compareResults.map((r, i) => (
                    <td key={i} className="px-4 py-4 text-center font-medium border-l border-slate-100">
                      {r.minAmount}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareResults.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="px-4 py-4 text-center text-slate-300 border-l border-slate-100">—</td>
                  ))}
                </tr>

                {/* Kỳ hạn tối đa */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-500">Kỳ hạn tối đa</td>
                  {compareResults.map((r, i) => (
                    <td key={i} className="px-4 py-4 text-center font-medium border-l border-slate-100">
                      {r.maxTerm}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareResults.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="px-4 py-4 text-center text-slate-300 border-l border-slate-100">—</td>
                  ))}
                </tr>

                {/* Phí mua bảo hiểm */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-500">Mua kèm bảo hiểm</td>
                  {compareResults.map((r, i) => (
                    <td key={i} className="px-4 py-4 text-center font-medium text-slate-600 border-l border-slate-100">
                      {r.insuranceRequired}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareResults.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="px-4 py-4 text-center text-slate-300 border-l border-slate-100">—</td>
                  ))}
                </tr>

                {/* Phí phạt trước hạn */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-500">Phí phạt trả trước hạn</td>
                  {compareResults.map((r, i) => (
                    <td key={i} className="px-4 py-4 text-center font-medium text-red-600 border-l border-slate-100 text-xs">
                      {r.penaltyRate}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareResults.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="px-4 py-4 text-center text-slate-300 border-l border-slate-100">—</td>
                  ))}
                </tr>

                {/* Ưu điểm nổi bật */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-bold text-slate-900 bg-slate-50/30">Đánh giá ưu điểm</td>
                  {compareResults.map((r, i) => (
                    <td key={i} className="px-4 py-4 text-center font-bold text-emerald-700 border-l border-slate-100 text-xs bg-emerald-50/10">
                      {r.advantage}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareResults.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="px-4 py-4 text-center text-slate-300 border-l border-slate-100">—</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
