import { Badge } from "@bankng/ui";

export function PublicBadge({
  tone = "neutral",
  children
}: {
  tone?: "neutral" | "success" | "warning" | "danger";
  children: string;
}) {
  return <Badge tone={tone}>{children}</Badge>;
}
