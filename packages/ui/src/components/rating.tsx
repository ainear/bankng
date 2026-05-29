import { clsx } from "clsx";

type RatingProps = {
  value: number; // 0-5, supports decimals
  max?: number;
  showValue?: boolean;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
};

export function Rating({ value, max = 5, showValue = true, reviewCount, size = "md", className }: RatingProps) {
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div className={clsx("flex items-center gap-1", className)}>
      {showValue && (
        <span className={clsx("font-semibold", size === "sm" ? "text-xs" : "text-sm")}>
          {value.toFixed(1)}
        </span>
      )}
      <div className={clsx("relative inline-flex", size === "sm" ? "h-3 w-16" : "h-4 w-20")}>
        <div className="absolute inset-0 rounded bg-[var(--bankng-surface-muted)]" />
        <div
          className="absolute inset-y-0 left-0 rounded bg-[var(--bankng-warning)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      {reviewCount !== undefined && (
        <span className={clsx("text-[var(--bankng-text-secondary)]", size === "sm" ? "text-xs" : "text-sm")}>
          ({reviewCount.toLocaleString()} đánh giá)
        </span>
      )}
    </div>
  );
}