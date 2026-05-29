import "@bankng/ui/styles.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BankerSidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Bankng Banker Portal",
  description: "Portal quản lý hồ sơ, xác minh và leads dành cho nhân viên tư vấn ngân hàng.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
        <div className="flex min-h-screen">
          <BankerSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
