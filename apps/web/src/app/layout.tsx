import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "Bankng — So sánh lãi suất ngân hàng Việt Nam",
    template: "%s | Bankng — So sánh lãi suất ngân hàng Việt Nam",
  },
  description:
    "So sánh lãi suất tiết kiệm, vay mua nhà, vay tiêu dùng từ hơn 40 ngân hàng Việt Nam. Dữ liệu cập nhật, minh bạch và chính xác — hỗ trợ bởi Bankng.",
  keywords: [
    "so sánh lãi suất ngân hàng",
    "lãi suất tiết kiệm",
    "vay mua nhà",
    "vay tiêu dùng",
    "ngân hàng Việt Nam",
    "so sánh sản phẩm tài chính",
    "bankng",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://bankng.vn",
    siteName: "Bankng",
    title: "Bankng — So sánh lãi suất ngân hàng Việt Nam",
    description:
      "So sánh lãi suất tiết kiệm, vay mua nhà, vay tiêu dùng từ hơn 40 ngân hàng Việt Nam. Dữ liệu cập nhật, minh bạch và chính xác.",
  },
  metadataBase: new URL("https://bankng.vn"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
