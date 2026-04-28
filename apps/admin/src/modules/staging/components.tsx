"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@bankng/ui";
import { reviewStagingRateAction, bulkReviewStagingRateAction, publishStagingRateAction, bulkPublishStagingRateAction } from "@/modules/staging/actions";

function SubmitButton({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <Button type="submit" disabled={disabled}>
      {children}
    </Button>
  );
}

function PendingRowActions({ id }: { id: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex gap-2">
      <form action={publishStagingRateAction}>
        <input type="hidden" name="id" value={id} />
        <SubmitButton disabled={pending}>Publish</SubmitButton>
      </form>
      <form action={reviewStagingRateAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="action" value="reject" />
        <SubmitButton disabled={pending}>Từ chối</SubmitButton>
      </form>
    </div>
  );
}

function BulkActions() {
  const { pending } = useFormStatus();
  return (
    <div className="flex items-center gap-3 border-b border-[var(--bankng-border)] pb-4 mb-4">
      <span className="text-sm font-medium">Bulk actions:</span>
      <form action={bulkPublishStagingRateAction}>
        <input className="bulk-ids" type="hidden" name="ids" value="" />
        <SubmitButton disabled={pending}>Publish chọn</SubmitButton>
      </form>
      <form action={bulkReviewStagingRateAction}>
        <input type="hidden" name="action" value="reject" />
        <input className="bulk-ids" type="hidden" name="ids" value="" />
        <SubmitButton disabled={pending}>Từ chối chọn</SubmitButton>
      </form>
    </div>
  );
}

export { PendingRowActions, BulkActions };