"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Định dạng tiền tệ tự động: 1000000000 -> "1.000.000.000đ"
function formatVND(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value).replace(/\s/g, "");
}

export function HeroSearchWidget() {
  const router = useRouter();
  const [type, setType] = useState<"tiet-kiem" | "vay-mua-nha" | "vay-mua-xe" | "vay-tin-chap">("vay-mua-nha");
  const [amount, setAmount] = useState<number>(1000000000); // 1 tỷ mặc định
  const [term, setTerm] = useState<number>(36); // 36 tháng mặc định

  // Cấu hình slider theo loại sản phẩm
  const maxAmount = type === "tiet-kiem" ? 10000000000 : 20000000000; // Tiết kiệm max 10 tỷ, vay max 20 tỷ
  const amountStep = type === "vay-tin-chap" ? 10000000 : 50000000; // Bước nhảy
  const maxTerm = type === "tiet-kiem" ? 36 : 240; // Gửi tiết kiệm max 36 tháng, vay max 20 năm (240 tháng)
  const termStep = 1;

  const handleSearch = () => {
    // Chuyển hướng sang trang so sánh tương ứng
    let targetCategory = "vay-mua-nha";
    if (type === "tiet-kiem") targetCategory = "tiet-kiem";
    else if (type === "vay-mua-xe") targetCategory = "vay-mua-xe";
    else if (type === "vay-tin-chap") targetCategory = "vay-tin-chap";

    router.push(`/compare/${targetCategory}?amount=${amount}&term=${term}`);
  };

  return (
    <div className="glass-panel mx-auto mt-10 max-w-3xl rounded-2xl p-6 shadow-xl shadow-emerald-500/5 animate-fadeIn">
      {/* Product Type Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-emerald-500/10 pb-4 mb-6 justify-center md:justify-start">
        <button
          onClick={() => { setType("vay-mua-nha"); setAmount(1000000000); setTerm(120); }}
          className={`rounded-lg px-4 py-2 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
            type === "vay-mua-nha"
              ? "bg-[var(--bankng-primary)] text-white shadow-md shadow-emerald-500/10"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          🏠 Vay mua nhà
        </button>
        <button
          onClick={() => { setType("vay-mua-xe"); setAmount(500000000); setTerm(60); }}
          className={`rounded-lg px-4 py-2 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
            type === "vay-mua-xe"
              ? "bg-[var(--bankng-primary)] text-white shadow-md shadow-emerald-500/10"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          🚗 Vay mua xe
        </button>
        <button
          onClick={() => { setType("vay-tin-chap"); setAmount(100000000); setTerm(24); }}
          className={`rounded-lg px-4 py-2 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
            type === "vay-tin-chap"
              ? "bg-[var(--bankng-primary)] text-white shadow-md shadow-emerald-500/10"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          💳 Vay tín chấp
        </button>
        <button
          onClick={() => { setType("tiet-kiem"); setAmount(500000000); setTerm(12); }}
          className={`rounded-lg px-4 py-2 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
            type === "tiet-kiem"
              ? "bg-[var(--bankng-primary)] text-white shadow-md shadow-emerald-500/10"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          💰 Gửi tiết kiệm
        </button>
      </div>

      {/* Inputs grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Amount Input & Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-500">Số tiền cần {type === "tiet-kiem" ? "gửi" : "vay"}</span>
            <span className="text-base font-black text-[var(--bankng-primary)]">{formatVND(amount)}</span>
          </div>
          <input
            type="range"
            min={type === "vay-tin-chap" ? 10000000 : 50000000}
            max={maxAmount}
            step={amountStep}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>{type === "vay-tin-chap" ? "10tr" : "50tr"}</span>
            <span>{type === "tiet-kiem" ? "10 tỷ" : "20 tỷ"}</span>
          </div>
        </div>

        {/* Term Input & Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-500">Kỳ hạn mong muốn</span>
            <span className="text-base font-black text-[var(--bankng-primary)]">{term} tháng</span>
          </div>
          <input
            type="range"
            min={1}
            max={maxTerm}
            step={termStep}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>1 tháng</span>
            <span>{maxTerm} tháng ({Math.round(maxTerm / 12)} năm)</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSearch}
          className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-bold py-3.5 px-10 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 active:translate-y-0 cursor-pointer"
        >
          So sánh ngay →
        </button>
      </div>
    </div>
  );
}
