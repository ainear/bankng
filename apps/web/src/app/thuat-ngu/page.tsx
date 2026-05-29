"use client";

import { useState } from "react";
import Link from "next/link";

interface GlossaryTerm {
  term: string;
  englishTerm?: string;
  definition: string;
  level: "Cơ bản" | "Trung cấp" | "Nâng cao";
  category: "Huy động" | "Tín dụng" | "Thẻ" | "Bảo hiểm" | "Quản trị rủi ro" | "Pháp chế" | "Khác";
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "AML",
    englishTerm: "Anti-Money Laundering",
    definition: "Phòng chống rửa tiền - tập hợp các quy định, luật pháp và quy trình nhằm ngăn chặn việc hợp pháp hóa nguồn tiền thu được từ các hoạt động bất hợp pháp.",
    level: "Trung cấp",
    category: "Pháp chế",
  },
  {
    term: "ATM",
    englishTerm: "Automated Teller Machine",
    definition: "Máy giao dịch tự động cho phép khách hàng thực hiện các giao dịch cơ bản như rút tiền, kiểm tra số dư, chuyển khoản mà không cần nhân viên hỗ trợ tại quầy.",
    level: "Cơ bản",
    category: "Thẻ",
  },
  {
    term: "Bancassurance",
    englishTerm: "Bancassurance",
    definition: "Mô hình phân phối các sản phẩm bảo hiểm thông qua mạng lưới chi nhánh và cơ sở khách hàng của ngân hàng thương mại.",
    level: "Cơ bản",
    category: "Bảo hiểm",
  },
  {
    term: "Bảo hiểm khoản vay",
    englishTerm: "Credit Life Insurance",
    definition: "Loại hình bảo hiểm tự nguyện bảo đảm trả thay nợ vay cho ngân hàng trong trường hợp người đi vay gặp rủi ro bất ngờ về sức khỏe, tính mạng.",
    level: "Cơ bản",
    category: "Bảo hiểm",
  },
  {
    term: "Bảo hiểm nhân thọ",
    englishTerm: "Life Insurance",
    definition: "Hợp đồng bảo hiểm cam kết chi trả một số tiền nhất định cho người thụ hưởng khi người được bảo hiểm qua đời hoặc sống đến một thời hạn xác định.",
    level: "Cơ bản",
    category: "Bảo hiểm",
  },
  {
    term: "Bảo hiểm phi nhân thọ",
    englishTerm: "Non-life Insurance",
    definition: "Loại hình bảo hiểm bồi thường cho các tổn thất vật chất, tài sản, trách nhiệm dân sự hoặc tai nạn ngoài ý muốn của người được bảo hiểm.",
    level: "Cơ bản",
    category: "Bảo hiểm",
  },
  {
    term: "Bảo lãnh ngân hàng",
    englishTerm: "Bank Guarantee",
    definition: "Cam kết bằng văn bản của ngân hàng với bên gọi thầu/đối tác về việc sẽ thực hiện nghĩa vụ tài chính thay cho khách hàng của mình nếu họ vi phạm hợp đồng.",
    level: "Trung cấp",
    category: "Tín dụng",
  },
  {
    term: "Basel",
    englishTerm: "Basel Accords",
    definition: "Bộ tiêu chuẩn quốc tế về giám sát ngân hàng và quản trị rủi ro (Basel I, II, III), do Ủy ban Basel đề xuất nhằm bảo đảm tính an toàn của hệ thống tài chính toàn cầu.",
    level: "Nâng cao",
    category: "Quản trị rủi ro",
  },
  {
    term: "CAR",
    englishTerm: "Capital Adequacy Ratio",
    definition: "Tỷ lệ an toàn vốn tối thiểu - đo lường lượng vốn tự có của ngân hàng so với tổng tài sản có rủi ro, nhằm đảm bảo khả năng thanh toán khi gặp khủng hoảng.",
    level: "Nâng cao",
    category: "Quản trị rủi ro",
  },
  {
    term: "CASA",
    englishTerm: "Current Account Savings Account",
    definition: "Tỷ lệ tiền gửi không kỳ hạn (tiền gửi thanh toán) trên tổng nguồn vốn huy động của ngân hàng. CASA cao giúp ngân hàng giảm chi phí vốn đầu vào đáng kể.",
    level: "Nâng cao",
    category: "Huy động",
  },
  {
    term: "Cashback",
    englishTerm: "Cashback",
    definition: "Chương trình ưu đãi hoàn lại một tỷ lệ phần trăm tiền mặt dựa trên doanh số giao dịch thanh toán khi chi tiêu bằng thẻ tín dụng hoặc thẻ ghi nợ.",
    level: "Cơ bản",
    category: "Thẻ",
  },
  {
    term: "Cầm cố tài sản",
    englishTerm: "Pledge of Assets",
    definition: "Việc người đi vay giao tài sản là động sản hoặc các giấy tờ có giá (sổ tiết kiệm, trái phiếu) cho ngân hàng nắm giữ để bảo đảm nghĩa vụ trả nợ vay.",
    level: "Cơ bản",
    category: "Tín dụng",
  },
  {
    term: "Cho vay hợp vốn",
    englishTerm: "Syndicated Loan",
    definition: "Hình thức cấp tín dụng trong đó một nhóm từ hai tổ chức tín dụng trở lên cùng tham gia cho vay đối với một dự án lớn của khách hàng doanh nghiệp.",
    level: "Nâng cao",
    category: "Tín dụng",
  },
  {
    term: "Amortization",
    englishTerm: "Debt Amortization",
    definition: "Quá trình phân bổ và thanh toán dần khoản nợ (gồm cả gốc và lãi) theo các kỳ hạn định trước trong suốt thời hạn vay.",
    level: "Trung cấp",
    category: "Tín dụng",
  },
  {
    term: "APY",
    englishTerm: "Annual Percentage Yield",
    definition: "Tỷ suất lợi nhuận thực tế hàng năm khi gửi tiết kiệm, có tính đến tác động của cơ chế lãi kép (lãi cộng dồn vào gốc để tính lãi kỳ tiếp theo).",
    level: "Trung cấp",
    category: "Huy động",
  },
  {
    term: "EMI",
    englishTerm: "Equated Monthly Installment",
    definition: "Số tiền trả góp cố định hàng tháng mà người vay phải thanh toán cho ngân hàng, bao gồm một phần tiền gốc và một phần tiền lãi.",
    level: "Cơ bản",
    category: "Tín dụng",
  },
  {
    term: "Credit Score",
    englishTerm: "Credit Score",
    definition: "Điểm tín dụng cá nhân được chấm bởi tổ chức thông tin tín dụng (như CIC tại Việt Nam) dựa trên lịch sử thanh toán nợ, số lượng khoản vay và mức độ tin cậy.",
    level: "Cơ bản",
    category: "Khác",
  },
  {
    term: "LTV",
    englishTerm: "Loan-to-Value Ratio",
    definition: "Tỷ lệ khoản vay trên giá trị tài sản bảo đảm. Đây là thước đo rủi ro tín dụng của ngân hàng khi duyệt hồ sơ vay thế chấp.",
    level: "Trung cấp",
    category: "Tín dụng",
  },
  {
    term: "DTI",
    englishTerm: "Debt-to-Income Ratio",
    definition: "Tỷ lệ nợ trên thu nhập hàng tháng của người vay, dùng để đánh giá khả năng trích thu nhập trả nợ mà không ảnh hưởng lớn đến cuộc sống tối thiểu.",
    level: "Trung cấp",
    category: "Tín dụng",
  },
  {
    term: "NIM",
    englishTerm: "Net Interest Margin",
    definition: "Biên thu nhập lãi thuần - chênh lệch tỷ lệ phần trăm giữa doanh thu tiền lãi ngân hàng thu được với chi phí lãi trả cho người gửi tiền.",
    level: "Nâng cao",
    category: "Quản trị rủi ro",
  },
];

const ALPHABET = ["Tất cả", "A", "B", "C", "D", "E", "G", "H", "L", "N", "P", "V"];

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("Tất cả");
  const [selectedLevel, setSelectedLevel] = useState<string>("Tất cả");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");

  // Filter logic
  const filteredTerms = GLOSSARY_TERMS.filter((item) => {
    // 1. Search filter
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.englishTerm && item.englishTerm.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Letter filter
    let matchesLetter = true;
    if (selectedLetter !== "Tất cả") {
      matchesLetter = item.term.toUpperCase().startsWith(selectedLetter);
    }

    // 3. Level filter
    let matchesLevel = true;
    if (selectedLevel !== "Tất cả") {
      matchesLevel = item.level === selectedLevel;
    }

    // 4. Category filter
    let matchesCategory = true;
    if (selectedCategory !== "Tất cả") {
      matchesCategory = item.category === selectedCategory;
    }

    return matchesSearch && matchesLetter && matchesLevel && matchesCategory;
  });

  // Group filtered terms by first letter
  const groupedTerms = filteredTerms.reduce<Record<string, typeof GLOSSARY_TERMS>>(
    (acc, item) => {
      const letter = item.term[0].toUpperCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(item);
      return acc;
    },
    {}
  );

  const sortedLetters = Object.keys(groupedTerms).sort();

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      {/* Decorative background gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-[var(--bankng-primary)]/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[60%] w-[50%] rounded-full bg-[var(--bankng-primary)]/5 blur-[120px]" />
      </div>

      <section className="mx-auto max-w-5xl px-6 py-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--bankng-primary)] hover:underline"
            href="/"
          >
            ← Trang chủ
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--bankng-text-primary)]">
            Từ điển Thuật ngữ Ngân hàng
          </h1>
          <p className="mt-3 text-lg text-[var(--bankng-text-secondary)] max-w-2xl">
            Giải thích chi tiết và trực quan toàn bộ các khái niệm, chỉ số nghiệp vụ tài chính ngân hàng Việt Nam & Quốc tế.
          </p>
        </div>

        {/* Interactivity Filters Panel */}
        <div className="mb-10 rounded-2xl border border-[var(--bankng-border)] bg-white/70 p-6 shadow-sm backdrop-blur-md">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search Input */}
            <div className="md:col-span-1">
              <label htmlFor="search-input" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                Tìm kiếm thuật ngữ
              </label>
              <div className="relative">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Ví dụ: Lãi suất, APY, DTI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-medium shadow-inner transition-colors focus:border-[var(--bankng-primary)] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--bankng-text-secondary)] hover:text-red-500"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>

            {/* Level Selector */}
            <div>
              <label htmlFor="level-select" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                Độ khó / Cấp độ
              </label>
              <select
                id="level-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-medium shadow-sm transition-colors focus:border-[var(--bankng-primary)] focus:outline-none"
              >
                <option value="Tất cả">Tất cả cấp độ</option>
                <option value="Cơ bản">🟢 Cơ bản</option>
                <option value="Trung cấp">🟡 Trung cấp</option>
                <option value="Nâng cao">🔴 Nâng cao</option>
              </select>
            </div>

            {/* Category Selector */}
            <div>
              <label htmlFor="category-select" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
                Chuyên mục nghiệp vụ
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-[var(--bankng-border)] bg-white px-4 py-3 text-sm font-medium shadow-sm transition-colors focus:border-[var(--bankng-primary)] focus:outline-none"
              >
                <option value="Tất cả">Tất cả chuyên mục</option>
                <option value="Huy động">💰 Huy động</option>
                <option value="Tín dụng">🏠 Tín dụng & Vay</option>
                <option value="Thẻ">💳 Nghiệp vụ Thẻ</option>
                <option value="Bảo hiểm">🛡️ Bảo hiểm</option>
                <option value="Quản trị rủi ro">📊 Quản trị rủi ro</option>
                <option value="Pháp chế">⚖️ Pháp chế</option>
                <option value="Khác">🔍 Khác</option>
              </select>
            </div>
          </div>

          {/* Quick Alphabet Filtering */}
          <div className="mt-6 border-t border-[var(--bankng-border)] pt-5">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-[var(--bankng-text-secondary)]">
              Lọc nhanh theo chữ cái đầu
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ALPHABET.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-semibold transition-all ${
                    selectedLetter === letter
                      ? "bg-[var(--bankng-primary)] text-white shadow-md shadow-[var(--bankng-primary)]/10"
                      : "border border-[var(--bankng-border)] bg-white text-[var(--bankng-text-primary)] hover:bg-[var(--bankng-surface)]"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 text-sm text-[var(--bankng-text-secondary)] font-medium">
          Tìm thấy <span className="text-[var(--bankng-primary)] font-bold">{filteredTerms.length}</span> thuật ngữ phù hợp.
        </div>

        {/* Empty State */}
        {filteredTerms.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--bankng-border)] bg-white/40 p-12 text-center backdrop-blur-sm">
            <span className="text-4xl">🔍</span>
            <h3 className="mt-4 text-base font-bold text-[var(--bankng-text-primary)]">
              Không tìm thấy thuật ngữ nào
            </h3>
            <p className="mt-2 text-sm text-[var(--bankng-text-secondary)] max-w-md mx-auto">
              Thử tìm kiếm với từ khóa khác hoặc xóa bớt bộ lọc để hiển thị toàn bộ danh sách.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLetter("Tất cả");
                setSelectedLevel("Tất cả");
                setSelectedCategory("Tất cả");
              }}
              className="mt-5 rounded-xl bg-[var(--bankng-primary)] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[var(--bankng-primary)]/90"
            >
              Reset bộ lọc
            </button>
          </div>
        )}

        {/* Grouped Terms Cards */}
        <div className="space-y-10">
          {sortedLetters.map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-6">
              <h2 className="mb-5 inline-block border-b-2 border-[var(--bankng-primary)] pb-1 text-2xl font-black text-[var(--bankng-primary)]">
                Chữ {letter}
              </h2>
              <div className="grid gap-5 md:grid-cols-2">
                {groupedTerms[letter].map((item) => (
                  <div
                    key={item.term}
                    className="group relative flex flex-col justify-between rounded-2xl border border-[var(--bankng-border)] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div>
                      {/* Badge Tags Row */}
                      <div className="mb-3 flex items-center justify-between">
                        <span
                          className={`rounded-lg px-2.5 py-0.5 text-xxs font-bold uppercase tracking-wider ${
                            item.level === "Cơ bản"
                              ? "bg-green-50 text-green-700"
                              : item.level === "Trung cấp"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {item.level}
                        </span>
                        <span className="rounded-lg bg-[var(--bankng-surface-muted)] px-2.5 py-0.5 text-xxs font-bold text-[var(--bankng-text-secondary)]">
                          {item.category}
                        </span>
                      </div>

                      {/* Title & Eng Sub */}
                      <h3 className="text-lg font-bold text-[var(--bankng-text-primary)] group-hover:text-[var(--bankng-primary)] transition-colors">
                        {item.term}
                      </h3>
                      {item.englishTerm && (
                        <span className="mt-0.5 block text-xs font-semibold text-[var(--bankng-text-secondary)] italic">
                          ({item.englishTerm})
                        </span>
                      )}

                      {/* Definition */}
                      <p className="mt-3 text-sm leading-relaxed text-[var(--bankng-text-secondary)]">
                        {item.definition}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Context Banner CTA */}
        <div className="mt-16 rounded-2xl border border-[var(--bankng-border)] bg-gradient-to-r from-emerald-800 to-teal-900 p-8 text-white shadow-xl text-center md:text-left relative overflow-hidden">
          <div className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold">Bạn là chuyên gia tài chính ngân hàng?</h3>
              <p className="mt-2 text-sm text-emerald-100/90 max-w-xl leading-relaxed">
                Đồng hành cùng cộng đồng Bankng để cập nhật, hiệu đính thêm các thuật ngữ mới hoặc kết nối trực tiếp với khách hàng tiềm năng.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 shrink-0">
              <Link href="/danh-sach-bankers">
                <button className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-900 shadow-md transition-transform hover:scale-105 active:scale-100">
                  Danh sách Bankers 📌
                </button>
              </Link>
              <Link href="/tin-tuc">
                <button className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20">
                  Đọc bài viết phân tích
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
