import Link from "next/link";
import { Avatar, Rating } from "@bankng/ui";
import type { BankerProfile } from "../data-bankers";

type Props = {
  banker: BankerProfile;
};

export function BankerCard({ banker }: Props) {
  return (
    <Link
      href={`/banker/${banker.slug}`}
      className="group block rounded-xl border border-[var(--bankng-border)] bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-[var(--bankng-primary)]/40"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <Avatar
            src={banker.avatarUrl ?? undefined}
            alt={banker.userName ?? "Banker"}
            size="md"
          />
          {banker.isVerified && (
            <span
              title="Đã xác thực"
              className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--bankng-primary)] text-[8px] text-white"
            >
              ✓
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[var(--bankng-text-primary)] truncate group-hover:text-[var(--bankng-primary)] transition-colors">
              {banker.userName ?? "Nhân viên"}
            </h3>
            {banker.isVerified && (
              <span className="shrink-0 rounded-full bg-[var(--bankng-primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--bankng-primary)]">
                Đã xác thực
              </span>
            )}
          </div>

          {banker.title && (
            <p className="mt-0.5 text-xs text-[var(--bankng-text-secondary)] truncate">
              {banker.title}
            </p>
          )}

          {banker.bankName && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-xs font-medium text-[var(--bankng-primary)]">
                {banker.bankName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Rating */}
      {banker.rating > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <Rating value={banker.rating} showValue />
          <span className="text-xs text-[var(--bankng-text-secondary)]">
            ({banker.reviewCount} đánh giá)
          </span>
        </div>
      )}

      {/* Bio */}
      {banker.bio && (
        <p className="mt-2 line-clamp-2 text-xs text-[var(--bankng-text-secondary)]">
          {banker.bio}
        </p>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        {banker.cityName ? (
          <span className="text-xs text-[var(--bankng-text-secondary)]">
            📍 {banker.cityName}
          </span>
        ) : (
          <span />
        )}
        <span className="text-xs font-medium text-[var(--bankng-primary)] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          Xem hồ sơ →
        </span>
      </div>
    </Link>
  );
}
