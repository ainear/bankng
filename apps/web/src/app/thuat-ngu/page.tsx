"use client";

import { useState } from "react";
import Link from "next/link";
import { TERMINOLOGIES } from "@/modules/public/data-terminology";

const ALPHABET = ["Tất cả", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];
const CATEGORIES = ["Tất cả", "Huy động", "Tín dụng", "Thẻ", "Bảo hiểm", "Pháp chế", "Quản trị rủi ro", "Đầu tư"];

export default function TerminologyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("Tất cả");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter logic
  const filteredTerms = TERMINOLOGIES.filter((term) => {
    // 1. Search Query
    const matchesSearch =
      term.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.content.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Letter Filter
    const matchesLetter =
      selectedLetter === "Tất cả" ||
      term.title.toUpperCase().startsWith(selectedLetter);

    // 3. Category Filter
    const matchesCategory =
      selectedCategory === "Tất cả" || term.category === selectedCategory;

    return matchesSearch && matchesLetter && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] pb-20 pt-10">
      {/* Decorative gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[50%] w-[45%] rounded-full bg-[var(--bankng-primary)]/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[15%] h-[50%] w-[45%] rounded-full bg-[var(--bankng-primary)]/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500 font-bold">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-slate-800">Thuật ngữ ngân hàng</span>
        </div>

        {/* Hero Header - Enhanced Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-white/70 backdrop-blur-xl p-8 md:p-12 shadow-sm">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          <div className="relative max-w-3xl text-center md:text-left">
            <span className="rounded-full bg-emerald-100/80 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 border border-emerald-200/50">
              📚 Thư viện tài chính AI
            </span>
            <h1 className="mt-5 text-3xl font-black md:text-4.5xl tracking-tight leading-tight">
              Từ điển Thuật ngữ <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Ngân hàng</span>
            </h1>
            <p className="mt-4 text-sm font-semibold text-slate-600 leading-relaxed max-w-2xl">
              Tra cứu định nghĩa, thuật ngữ viết tắt và các chỉ số quản trị tài chính ngân hàng chuẩn xác, được biên soạn dễ hiểu theo các quy chuẩn Việt Nam và Quốc tế (Basel, NHNN).
            </p>
          </div>
        </div>

        {/* Search and Filters Bar - Premium Glassmorphism */}
        <div className="mt-8 rounded-2xl border border-emerald-500/10 bg-white/80 backdrop-blur-md p-6 shadow-xs">
          {/* Ô tìm kiếm */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Tìm kiếm thuật ngữ (VD: CASA, NIM, nợ xấu, LTV)..."
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-6 pr-4 text-sm font-semibold outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Bộ lọc A-Z */}
          <div className="mt-6">
            <div className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3">Tra cứu nhanh theo ký tự (A-Z)</div>
            <div className="flex flex-wrap gap-1.5">
              {ALPHABET.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`min-h-8 min-w-8 rounded-lg text-xs font-black transition-all active:scale-95 cursor-pointer ${
                    selectedLetter === letter
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Bộ lọc Danh mục */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3">Lọc theo chuyên mục tài chính</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-black transition-all active:scale-95 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-600">
            Tìm thấy <span className="text-emerald-700 font-black">{filteredTerms.length}</span> thuật ngữ phù hợp
          </div>
          {(selectedLetter !== "Tất cả" || selectedCategory !== "Tất cả" || searchQuery !== "") && (
            <button
              onClick={() => {
                setSelectedLetter("Tất cả");
                setSelectedCategory("Tất cả");
                setSearchQuery("");
              }}
              className="text-xs font-black text-emerald-600 hover:underline cursor-pointer"
            >
              Xóa bộ lọc ✕
            </button>
          )}
        </div>

        {/* List of terminologies */}
        {filteredTerms.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {filteredTerms.map((term) => {
              const isExpanded = expandedId === term.id;
              
              // Cấp độ badge styles
              const levelColor =
                term.level === "Cơ bản"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : term.level === "Trung cấp"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-rose-50 text-rose-700 border-rose-200";

              return (
                <div
                  key={term.id}
                  id={term.slug}
                  className={`group rounded-2xl border bg-white/80 backdrop-blur-md p-6 transition-all duration-300 hover:-translate-y-0.5 ${
                    isExpanded
                      ? "border-emerald-500 shadow-md shadow-emerald-500/5 bg-white"
                      : "border-emerald-500/10 hover:border-emerald-500/35 hover:shadow-xs"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-extrabold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          {term.title}
                        </h2>
                        {term.englishName && (
                          <span className="text-xs font-bold text-slate-400">
                            ({term.englishName})
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[9px] font-black text-slate-500 uppercase tracking-wider">
                          {term.category}
                        </span>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${levelColor}`}>
                          {term.level}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(term.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-black transition-all active:scale-95 cursor-pointer ${
                        isExpanded
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{isExpanded ? "Thu nhỏ ▲" : "Xem chi tiết ▼"}</span>
                    </button>
                  </div>

                  <p className="mt-4 text-sm text-slate-600 font-semibold leading-relaxed">
                    {term.excerpt}
                  </p>

                  {isExpanded && (
                    <div className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600 leading-relaxed animate-fadeIn">
                      <div className="font-black text-slate-800 mb-2 flex items-center gap-1.5">
                        <span>📚</span> Giải thích chi tiết chuyên sâu:
                      </div>
                      <p className="bg-emerald-50/20 rounded-xl p-4 border border-emerald-500/5 font-semibold text-slate-700 leading-relaxed">
                        {term.content}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center shadow-xs">
            <span className="text-4xl">🔍</span>
            <h3 className="mt-4 text-sm font-black text-slate-700">Không tìm thấy thuật ngữ nào</h3>
            <p className="mt-1 text-xs text-slate-400 font-bold">Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc.</p>
            <button
              onClick={() => {
                setSelectedLetter("Tất cả");
                setSelectedCategory("Tất cả");
                setSearchQuery("");
              }}
              className="mt-4 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md hover:bg-emerald-700 active:scale-95 cursor-pointer"
            >
              Xem tất cả thuật ngữ
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
