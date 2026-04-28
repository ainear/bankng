import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning" | "danger";
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-[var(--bankng-surface-muted)] text-[var(--bankng-text-secondary)]",
  success: "bg-green-50 text-[var(--bankng-positive)]",
  warning: "bg-amber-50 text-[var(--bankng-warning)]",
  danger: "bg-red-50 text-[var(--bankng-danger)]"
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex w-fit items-center rounded-md px-2 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
