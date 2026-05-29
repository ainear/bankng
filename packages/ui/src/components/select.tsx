import { clsx } from "clsx";
import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export function Select({ className, id, label, error, children, ...props }: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className="grid gap-1 text-sm font-medium text-[var(--bankng-text-primary)]">
      {label ? <span>{label}</span> : null}
      <select
        id={selectId}
        className={clsx(
          "min-h-10 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--bankng-accent)]",
          error && "border-[var(--bankng-danger)]",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-[var(--bankng-danger)]">{error}</span> : null}
    </label>
  );
}