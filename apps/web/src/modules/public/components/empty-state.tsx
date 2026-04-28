import { Card } from "@bankng/ui";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <Card title={title}>
      <p className="text-sm text-[var(--bankng-text-secondary)]">{description}</p>
    </Card>
  );
}
