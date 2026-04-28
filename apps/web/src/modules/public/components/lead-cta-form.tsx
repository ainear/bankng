import { Button, Input } from "@bankng/ui";
import { submitLeadAction } from "../server/lead-actions";

export function LeadCtaForm({
  contextSlug,
  contextType,
  sourcePage,
  title,
  description
}: {
  contextSlug: string;
  contextType: string;
  sourcePage: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--bankng-border)] bg-white p-4">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">{description}</p>
      <form action={submitLeadAction} className="mt-4 grid gap-3 md:grid-cols-2">
        <input name="sourcePage" type="hidden" value={sourcePage} />
        <input name="contextType" type="hidden" value={contextType} />
        <input name="contextSlug" type="hidden" value={contextSlug} />
        <Input label="Ho va ten" name="name" required />
        <Input label="So dien thoai" name="phone" required />
        <Input label="Email" name="email" type="email" />
        <Input label="Ghi chu" name="message" />
        <div className="md:col-span-2">
          <Button type="submit">Gui yeu cau tu van</Button>
        </div>
      </form>
    </div>
  );
}
