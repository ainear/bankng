import "@bankng/ui/styles.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
        {children}
      </body>
    </html>
  );
}
