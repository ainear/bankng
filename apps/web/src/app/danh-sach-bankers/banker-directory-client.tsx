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

const PROVINCES = [
  { value: "", label: "Tất cả tỉnh/thành" },
  { value: "HN", label: "Hà Nội" },
  { value: "HCM", label: "Hồ Chí Minh" },
  { value: "DN", label: "Đà Nẵng" },
  { value: "CT", label: "Cần Thơ" },
  { value: "HP", label: "Hải Phòng" },
  { value: "BR", label: "Bình Dương" },
  { value: "DNI", label: "Đồng Nai" },
];

export function BankerDirectoryClient({ bankers, stats }: Props) {
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [filteredBankers, setFilteredBankers] = useState(bankers);

  const handleSearch = (value: string) => {
    setSearch(value);
    filterBankers(value, province);
  };

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    filterBankers(search, value);
  };

  const filterBankers = (searchTerm: string, provinceTerm: string) => {
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

    setFilteredBankers(result);
  };

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-4 py-2 text-sm"
          />
        </div>
        <select
          value={province}
          onChange={(e) => handleProvinceChange(e.target.value)}
          className="min-h-9 rounded-md border border-[var(--bankng-border)] bg-white px-3 text-sm"
        >
          {PROVINCES.map((p) => (
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
            <BankerCard key={banker.id} banker={banker} />
          ))}
        </div>
      )}
    </div>
  );
}
