import { getBankers, getBankerStats, isOffline as isBankersOffline } from "@/modules/public/data-bankers";
import { BankerDirectoryClient } from "./banker-directory-client";
import { OfflineAlert } from "@/components/offline-alert";

export const dynamic = "force-dynamic";

export default async function BankersPage() {
  const [bankers, stats] = await Promise.all([
    getBankers({ limit: 100 }),
    getBankerStats(),
  ]);

  const isOffline = isBankersOffline;

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      {isOffline && <OfflineAlert />}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Danh sách Nhân viên Ngân hàng</h1>
          <p className="mt-2 text-[var(--bankng-text-secondary)]">
            Liên hệ trực tiếp với nhân viên ngân hàng để được tư vấn sản phẩm và dịch vụ.
          </p>
        </div>

        <BankerDirectoryClient bankers={bankers} stats={stats} />
      </section>
    </main>
  );
}
