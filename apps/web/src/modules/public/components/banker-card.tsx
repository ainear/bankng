import Link from "next/link";
import Image from "next/image";
import { Avatar, Rating } from "@bankng/ui";
import type { BankerProfile } from "../data-bankers";

type Props = {
  banker: BankerProfile;
};

export function BankerCard({ banker }: Props) {
  return (
    <Link
      href={`/banker/${banker.slug}`}
      className="group block rounded-2xl border border-emerald-500/10 bg-white/80 backdrop-blur-md p-5 shadow-xs transition-all duration-300 hover:border-emerald-500/35 hover:shadow-md hover:shadow-emerald-500/5 hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0 transition-transform group-hover:scale-105 duration-300">
          <Avatar
            src={banker.avatarUrl ?? undefined}
            alt={banker.userName ?? "Banker"}
            size="md"
            className="border border-slate-100 shadow-xs animate-fade-in"
            renderImage={(props) => (
              <Image
                src={props.src}
                alt={props.alt}
                width={40}
                height={40}
                className={props.className}
                priority={false}
              />
            )}
          />
          {banker.isVerified && (
            <span
              title="Đã xác thực"
              className="absolute -bottom-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[var(--bankng-primary)] text-[8px] text-white font-bold border border-white shadow-xs"
            >
              ✓
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-[var(--bankng-text-primary)] truncate group-hover:text-[var(--bankng-primary)] transition-colors leading-snug">
              {banker.userName ?? "Nhân viên"}
            </h3>
            {banker.isVerified && (
              <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-black tracking-wider text-[var(--bankng-primary)] uppercase">
                Xác thực ✨
              </span>
            )}
          </div>

          {banker.title && (
            <p className="mt-0.5 text-xs font-semibold text-[var(--bankng-text-secondary)] truncate">
              {banker.title}
            </p>
          )}

          {banker.bankName && (
            <div className="mt-1 flex items-center gap-1">
              {banker.bankLogoUrl ? (
                <Image
                  src={banker.bankLogoUrl}
                  alt={banker.bankName}
                  width={14}
                  height={14}
                  className="h-3.5 w-3.5 object-contain"
                />
              ) : (
                <span className="text-[10px]">🏦</span>
              )}
              <span className="text-xs font-bold text-[var(--bankng-primary)] truncate">
                {banker.bankName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Rating */}
      {banker.rating > 0 && (
        <div className="mt-3 flex items-center gap-2 bg-slate-50 rounded-lg px-2.5 py-1 w-max border border-slate-200/50">
          <Rating value={banker.rating} showValue />
          <span className="text-[11px] font-semibold text-[var(--bankng-text-secondary)]">
            ({banker.reviewCount} đánh giá)
          </span>
        </div>
      )}

      {/* Bio */}
      {banker.bio && (
        <p className="mt-3 line-clamp-2 text-xs text-[var(--bankng-text-secondary)] font-medium leading-relaxed bg-emerald-50/15 p-2 rounded-lg border border-emerald-500/5">
          {banker.bio}
        </p>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        {banker.cityName ? (
          <span className="text-xs font-bold text-[var(--bankng-text-secondary)]">
            📍 {banker.cityName}
          </span>
        ) : (
          <span />
        )}
        <span className="text-xs font-black text-[var(--bankng-primary)] opacity-100 transition-all group-hover:translate-x-0.5">
          Xem hồ sơ →
        </span>
      </div>
    </Link>
  );
}
