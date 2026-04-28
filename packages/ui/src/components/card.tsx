import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  children: ReactNode;
};

export function Card({ children, className, title, ...props }: CardProps) {
  return (
    <section
      className={clsx(
        "rounded-lg border border-[var(--bankng-border)] bg-[var(--bankng-surface)] p-5 shadow-sm",
        className,
      )}
      {...props}
    >
      {title ? <h2 className="mb-2 text-base font-semibold">{title}</h2> : null}
      {children}
    </section>
  );
}
