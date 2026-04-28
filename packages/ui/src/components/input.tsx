import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ className, id, label, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-1 text-sm font-medium text-[var(--bankng-text-primary)]">
      {label ? <span>{label}</span> : null}
      <input
        id={inputId}
        className={clsx(
          "min-h-10 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--bankng-accent)]",
          className,
        )}
        {...props}
      />
    </label>
  );
}
