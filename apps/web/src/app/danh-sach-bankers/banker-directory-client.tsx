"use client";

import { useState } from "react";
import { BankerCard } from "@/modules/public/components/banker-card";
import type { BankerProfile } from "@/modules/public/data-bankers";

type Props = {
  bankers: BankerProfile[];
  stats: {
    bankerCount: number;
    bankCount: number;
    provinceCount: number;
  };
};

export function BankerDirectoryClient({ bankers, stats }: Props) {
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [bankSlug, setBankSlug] = useState("");
  const [filteredBankers, setFilteredBankers] = useState(bankers);

  // Extract unique provinces dynamically from real data
  const uniqueProvinces = Array.from(
    new Map(
      bankers
        .filter((b) => b.provinceCode)
        .map((b) => [b.provinceCode, b.cityName || b.provinceCode])
    ).entries()
  )
    .map(([code, name]) => ({ value: code!, label: name! }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Extract unique banks dynamically from real data
  const uniqueBanks = Array.from(
    new Map(
      bankers
        .filter((b) => b.bankSlug)
        .map((b) => [b.bankSlug, b.bankName || b.bankSlug])
    ).entries()
  )
    .map(([slug, name]) => ({ value: slug!, label: name! }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const handleSearch = (value: string) => {
    setSearch(value);
    filterBankers(value, province, bankSlug);
  };

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    filterBankers(search, value, bankSlug);
  };

  const handleBankChange = (value: string) => {
    setBankSlug(value);
    filterBankers(search, province, value);
  };

  const filterBankers = (searchTerm: string, provinceTerm: string, bankTerm: string) => {
    let result = bankers;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.userName?.toLowerCase().includes(lower) ||
          b.bio?.toLowerCase().includes(lower) ||
          b.title?.toLowerCase().includes(lower) ||
          b.bankName?.toLowerCase().includes(lower)
      );
    }

    if (provinceTerm) {
      result = result.filter((b) => b.provinceCode === provinceTerm);
    }

    if (bankTerm) {
      result = result.filter((b) => b.bankSlug === bankTerm);
    }

    setFilteredBankers(result);
  };

  return (
    <div className="space-y-8">
      {/* Search and filters - Glassmorphism style */}
      <div className="glass-panel rounded-2xl p-6 shadow-xs flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[280px] relative">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm nhân viên ngân hàng (tên hoặc tiểu sử)..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 font-semibold"
          />
        </div>

        {/* Dropdown Ngân hàng động */}
        <select
          value={bankSlug}
          onChange={(e) => handleBankChange(e.target.value)}
          className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none shadow-xs transition-all focus:border-emerald-500 cursor-pointer"
        >
          <option value="">🏢 Tất cả Ngân hàng</option>
          {uniqueBanks.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>

        {/* Dropdown Tỉnh thành động */}
        <select
          value={province}
          onChange={(e) => handleProvinceChange(e.target.value)}
          className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none shadow-xs transition-all focus:border-emerald-500 cursor-pointer"
        >
          <option value="">📍 Tất cả Tỉnh/Thành</option>
          {uniqueProvinces.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-sm text-[var(--bankng-text-secondary)]">
        <span>{stats.bankerCount} nhân viên</span>
        <span>•</span>
        <span>{stats.bankCount} ngân hàng</span>
        <span>•</span>
        <span>{stats.provinceCount} tỉnh/thành</span>
      </div>

      {/* Banker grid */}
      {filteredBankers.length === 0 ? (
        <div className="py-12 text-center text-[var(--bankng-text-secondary)]">
          Không tìm thấy nhân viên phù hợp.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBankers.map((banker) => (
            <div
              key={banker.id}
              style={{
                contentVisibility: "auto",
                containIntrinsicSize: "0 180px",
              }}
            >
              <BankerCard banker={banker} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
