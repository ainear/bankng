"use client";

import { useState } from "react";
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
    <main className="min-h-screen bg-slate-50/50 pb-20 pt-10">
      <div className="mx-auto max-w-6xl px-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500 font-medium">
          <a href="/" className="hover:text-emerald-600">Trang chủ</a>
          <span>/</span>
          <span className="text-slate-800">Thuật ngữ ngân hàng</span>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-gradient-to-br from-emerald-600/5 via-white to-white p-8 md:p-12 shadow-sm">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="relative max-w-2xl text-center md:text-left">
            <span className="rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
              📚 Thư viện tài chính AI
            </span>
            <h1 className="mt-5 text-3xl font-black md:text-4xl tracking-tight">
              Từ điển Thuật ngữ <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Ngân hàng</span>
            </h1>
            <p className="mt-4 text-sm font-semibold text-slate-600 leading-relaxed">
              Tra cứu định nghĩa, thuật ngữ viết tắt và các chỉ số quản trị tài chính ngân hàng chuẩn xác, được biên soạn dễ hiểu theo các quy chuẩn Việt Nam và Quốc tế (Basel, NHNN).
            </p>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          {/* Ô tìm kiếm */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm thuật ngữ (VD: CASA, NIM, nợ xấu, LTV)..."
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
            />
            <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
          </div>

          {/* Bộ lọc A-Z */}
          <div className="mt-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Tra cứu nhanh theo ký tự (A-Z)</div>
            <div className="flex flex-wrap gap-1.5">
              {ALPHABET.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`min-h-8 min-w-8 rounded-lg text-xs font-bold transition-all ${
                    selectedLetter === letter
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/10"
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
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Lọc theo chuyên mục tài chính</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
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
          <div className="text-sm font-semibold text-slate-600">
            Tìm thấy <span className="text-emerald-700 font-bold">{filteredTerms.length}</span> thuật ngữ phù hợp
          </div>
          {(selectedLetter !== "Tất cả" || selectedCategory !== "Tất cả" || searchQuery !== "") && (
            <button
              onClick={() => {
                setSelectedLetter("Tất cả");
                setSelectedCategory("Tất cả");
                setSearchQuery("");
              }}
              className="text-xs font-bold text-emerald-600 hover:underline"
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
                  : "bg-red-50 text-red-700 border-red-200";

              return (
                <div
                  key={term.id}
                  id={term.slug}
                  className={`group rounded-2xl border bg-white p-6 transition-all duration-300 ${
                    isExpanded
                      ? "border-emerald-500 shadow-md shadow-emerald-500/5"
                      : "border-slate-200 hover:border-emerald-500/40 hover:shadow-xs"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          {term.title}
                        </h2>
                        {term.englishName && (
                          <span className="text-xs font-medium text-slate-400">
                            ({term.englishName})
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="rounded-full border bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {term.category}
                        </span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${levelColor}`}>
                          {term.level}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(term.id)}
                      className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                        isExpanded
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{isExpanded ? "Thu nhỏ ▲" : "Xem chi tiết ▼"}</span>
                    </button>
                  </div>

                  <p className="mt-4 text-sm text-slate-600 font-medium leading-relaxed">
                    {term.excerpt}
                  </p>

                  {isExpanded && (
                    <div className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600 leading-relaxed animate-fadeIn">
                      <div className="font-bold text-slate-800 mb-2">📚 Giải thích chi tiết chuyên sâu:</div>
                      <p className="bg-slate-50 rounded-xl p-4 border border-slate-100 font-medium">
                        {term.content}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <span className="text-4xl">🔍</span>
            <h3 className="mt-4 text-sm font-bold text-slate-700">Không tìm thấy thuật ngữ nào</h3>
            <p className="mt-1 text-xs text-slate-400">Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc.</p>
            <button
              onClick={() => {
                setSelectedLetter("Tất cả");
                setSelectedCategory("Tất cả");
                setSearchQuery("");
              }}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95"
            >
              Xem tất cả thuật ngữ
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
