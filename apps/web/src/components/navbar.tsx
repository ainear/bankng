"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// ─── nav structure ────────────────────────────────────────────────────────────
interface NavChild {
  label: string;
  href: string;
  desc?: string;
  emoji?: string;
}

interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  {
    label: "Cá nhân",
    children: [
      {
        label: "Vay mua nhà",
        href: "/compare/vay-mua-nha",
        emoji: "🏠",
        desc: "So sánh lãi suất vay mua nhà từ 30+ ngân hàng",
      },
      {
        label: "Vay mua xe",
        href: "/compare/vay-mua-xe",
        emoji: "🚗",
        desc: "Gói vay ô tô, xe máy lãi suất tốt nhất",
      },
      {
        label: "Vay tín chấp",
        href: "/compare/vay-tin-chap",
        emoji: "💳",
        desc: "Vay không tài sản đảm bảo, giải ngân nhanh",
      },
      {
        label: "Thẻ tín dụng",
        href: "/compare/the-tin-dung",
        emoji: "💰",
        desc: "So sánh thẻ hoàn tiền, dặm bay, cashback",
      },
      {
        label: "Gửi tiết kiệm",
        href: "/compare/tiet-kiem",
        emoji: "🏦",
        desc: "Lãi suất tiết kiệm cao nhất cập nhật hàng ngày",
      },
      {
        label: "Tính lãi suất",
        href: "/danh-gia-nhanh/tiet-kiem",
        emoji: "🧮",
        desc: "Công cụ tính lãi vay & tiết kiệm",
      },
      {
        label: "Chấm điểm tín dụng",
        href: "/cham-diem-tin-dung",
        emoji: "🛡️",
        desc: "Mô phỏng chấm điểm CIC cá nhân & gợi ý vay",
      },
    ],
  },
  {
    label: "Doanh nghiệp",
    children: [
      {
        label: "Vay kinh doanh",
        href: "/compare/vay-kinh-doanh",
        emoji: "🏢",
        desc: "Vay vốn lưu động, đầu tư doanh nghiệp",
      },
      {
        label: "Tín dụng doanh nghiệp",
        href: "/compare/the-tin-dung",
        emoji: "💼",
        desc: "Thẻ tín dụng cho doanh nghiệp & SME",
      },
      {
        label: "Vay dự án",
        href: "/compare/vay-kinh-doanh",
        emoji: "📊",
        desc: "Tài trợ dự án bất động sản, xây dựng",
      },
      {
        label: "Tính khả năng vay",
        href: "/danh-gia-nhanh/vay-kinh-doanh",
        emoji: "🧮",
        desc: "Ước tính hạn mức vay doanh nghiệp",
      },
    ],
  },
  { label: "Công cụ", href: "/cong-cu-tinh" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Sản phẩm cộng đồng", href: "/san-pham-cong-dong" },
  { label: "Nhân viên Ngân hàng", href: "/danh-sach-bankers" },
  { label: "Thuật ngữ", href: "/thuat-ngu" },
];

// ─── component ────────────────────────────────────────────────────────────────
export function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 border-b border-emerald-500/10 bg-white/80 backdrop-blur-md shadow-xs"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg height="32" width="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="var(--bankng-primary)" />
            <text
              x="16" y="22"
              textAnchor="middle"
              fill="white"
              fontSize="16"
              fontWeight="bold"
            >
              B
            </text>
          </svg>
          <span className="text-lg font-bold text-[var(--bankng-text-primary)]">
            Bankng
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    openDropdown === item.label
                      ? "bg-[var(--bankng-primary)]/8 text-[var(--bankng-primary)]"
                      : "text-[var(--bankng-text-primary)] hover:bg-[var(--bankng-surface-muted)]"
                  }`}
                >
                  {item.label}
                  <svg
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      openDropdown === item.label ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M2.5 4.5L6 8L9.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                {openDropdown === item.label && (
                  <div
                    className="absolute left-0 top-full pt-1"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="rounded-xl border border-[var(--bankng-border)] bg-white p-2 shadow-xl min-w-[420px]">
                      <div className="grid grid-cols-2 gap-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpenDropdown(null)}
                            className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-[var(--bankng-surface-muted)]"
                          >
                            <span className="mt-0.5 text-xl leading-none">{child.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-[var(--bankng-text-primary)] group-hover:text-[var(--bankng-primary)]">
                                {child.label}
                              </div>
                              {child.desc && (
                                <div className="mt-0.5 text-xs text-[var(--bankng-text-secondary)] leading-snug">
                                  {child.desc}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href ?? "/"}
                className="rounded-md px-3 py-2 text-sm font-medium text-[var(--bankng-text-primary)] hover:bg-[var(--bankng-surface-muted)] transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/banker/dang-ky"
            className="rounded-md border border-[var(--bankng-border)] px-3 py-1.5 text-xs font-medium text-[var(--bankng-text-secondary)] hover:border-[var(--bankng-primary)] hover:text-[var(--bankng-primary)] transition-colors"
          >
            Đăng ký NV tư vấn
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md bg-[var(--bankng-primary)] px-4 py-1.5 text-sm font-medium text-white hover:bg-[var(--bankng-primary)]/90 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center rounded-md p-2 text-[var(--bankng-text-primary)] hover:bg-[var(--bankng-surface-muted)] lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--bankng-border)] bg-white px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-[var(--bankng-text-primary)] hover:bg-[var(--bankng-surface-muted)]"
                    onClick={() =>
                      setMobileExpanded((v) => (v === item.label ? null : item.label))
                    }
                  >
                    {item.label}
                    <svg
                      className={`h-4 w-4 transition-transform ${
                        mobileExpanded === item.label ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M2.5 4.5L6 8L9.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l-2 border-[var(--bankng-border)] pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--bankng-text-secondary)] hover:bg-[var(--bankng-surface-muted)] hover:text-[var(--bankng-primary)]"
                        >
                          <span>{child.emoji}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href ?? "/"}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--bankng-text-primary)] hover:bg-[var(--bankng-surface-muted)]"
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="mt-3 flex flex-col gap-2 border-t border-[var(--bankng-border)] pt-3">
              <Link
                href="/banker/dang-ky"
                onClick={() => setMobileOpen(false)}
                className="rounded-md border border-[var(--bankng-border)] px-4 py-2 text-center text-sm font-medium text-[var(--bankng-text-secondary)]"
              >
                Đăng ký NV tư vấn
              </Link>
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-md bg-[var(--bankng-primary)] px-4 py-2 text-center text-sm font-medium text-white"
              >
                Đăng nhập
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}