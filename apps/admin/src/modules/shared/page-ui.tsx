import { Badge, Button, Card, Input } from "@bankng/ui";
import type { ReactNode } from "react";

export function AdminPage({
  badge,
  title,
  description,
  feedback,
  children
}: {
  badge: string;
  title: string;
  description: string;
  feedback?: {
    tone: "success" | "warning" | "danger" | "neutral";
    title: string;
    description: string;
  } | null;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10">
        <Badge>{badge}</Badge>
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-3 text-sm text-[var(--bankng-text-secondary)]">{description}</p>
        </div>
        {feedback ? (
          <div
            className="rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-3"
            data-feedback-tone={feedback.tone}
          >
            <div className="text-sm font-semibold">{feedback.title}</div>
            <div className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              {feedback.description}
            </div>
          </div>
        ) : null}
        {children}
      </section>
    </main>
  );
}

export function SectionCard({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card title={title}>
      {description ? (
        <p className="mb-4 text-sm text-[var(--bankng-text-secondary)]">{description}</p>
      ) : null}
      <div className="grid gap-4">{children}</div>
    </Card>
  );
}

export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  rows = 4
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium text-[var(--bankng-text-primary)]">
      <span>{label}</span>
      <textarea
        className="min-h-24 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--bankng-accent)]"
        defaultValue={defaultValue ?? ""}
        name={name}
        rows={rows}
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium text-[var(--bankng-text-primary)]">
      <span>{label}</span>
      <select
        className="min-h-10 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--bankng-accent)]"
        defaultValue={defaultValue}
        name={name}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-md border border-[var(--bankng-border)] bg-white px-3 py-2 text-sm">
      <input defaultChecked={defaultChecked} name={name} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}

export function FormActions({
  primaryLabel,
  secondary
}: {
  primaryLabel: string;
  secondary?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="submit">{primaryLabel}</Button>
      {secondary}
    </div>
  );
}

export function DataTable({
  headers,
  rows
}: {
  headers: string[];
  rows: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--bankng-border)] bg-white">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-[var(--bankng-surface-muted)] text-[var(--bankng-text-secondary)]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export function TableCell({ children }: { children: ReactNode }) {
  return <td className="border-t border-[var(--bankng-border)] px-4 py-3 align-top">{children}</td>;
}

export function SummaryTile({
  label,
  value,
  hint
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <Card title={label}>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">{hint}</p>
    </Card>
  );
}

export { Button, Input };
