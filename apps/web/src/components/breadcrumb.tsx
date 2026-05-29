import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[var(--bankng-text-secondary)]">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          {index > 0 && (
            <svg
              aria-hidden="true"
              className="h-3 w-3 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 16 16"
            >
              <path d="M5 3l6 5-6 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {item.href && index < items.length - 1 ? (
            <Link
              className="hover:text-[var(--bankng-primary)] hover:underline"
              href={item.href}
            >
              {item.label}
            </Link>
          ) : (
            <span
              aria-current={index === items.length - 1 ? "page" : undefined}
              className={index === items.length - 1 ? "font-medium text-[var(--bankng-text-primary)]" : ""}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
