import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[var(--bankng-primary)] text-white hover:bg-[var(--bankng-primary-hover)]",
  secondary:
    "border border-[var(--bankng-border)] bg-white text-[var(--bankng-text-primary)] hover:bg-[var(--bankng-surface-muted)]",
  ghost: "text-[var(--bankng-primary)] hover:bg-[var(--bankng-surface-muted)]"
};

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--bankng-accent)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
