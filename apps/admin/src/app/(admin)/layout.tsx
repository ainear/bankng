import "@bankng/ui/styles.css";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAdminAction } from "@/modules/auth/actions";
import { requireAdminSession } from "@/modules/auth/server/session";

export const metadata: Metadata = {
  title: "Bankng Admin",
  description: "Backoffice van hanh du lieu ngan hang, rates, leads va moderation."
};

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  await requireAdminSession();

  const navigation = [
    { href: "/", label: "Dashboard" },
    { href: "/banks", label: "Banks" },
    { href: "/branches", label: "Branches" },
    { href: "/categories", label: "Categories" },
    { href: "/products", label: "Products" },
    { href: "/rates", label: "Rates" },
    { href: "/leads", label: "Leads" },
    { href: "/audit-logs", label: "Audit Logs" }
  ];

  return (
    <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
      <aside className="border-r border-[var(--bankng-border)] bg-white px-5 py-6">
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--bankng-text-secondary)]">
            Bankng
          </div>
          <div className="mt-1 text-lg font-semibold">Admin Backoffice</div>
        </div>
        <nav className="mt-8 grid gap-2">
          {navigation.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm hover:bg-[var(--bankng-surface-muted)]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAdminAction} className="mt-8">
          <button
            className="rounded-md border border-[var(--bankng-border)] px-3 py-2 text-sm hover:bg-[var(--bankng-surface-muted)]"
            type="submit"
          >
            Dang xuat
          </button>
        </form>
      </aside>
      <div>{children}</div>
    </div>
  );
}
