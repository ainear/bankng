"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitLead, type LeadFormState } from "@/app/actions/leads";

const initialState: LeadFormState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-[var(--bankng-primary)] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--bankng-primary)]/90 disabled:opacity-50"
    >
      {pending ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
    </button>
  );
}

type Props = {
  sourcePage: string;
  contextType?: string;
  contextSlug?: string;
};

export function LeadFormClient({
  sourcePage,
  contextType = "banker",
  contextSlug = "",
}: Props) {
  const [state, formAction] = useActionState(submitLead, initialState);

  if (state.success) {
    return (
      <div className="rounded-lg border border-[var(--bankng-rate-highlight)] bg-[var(--bankng-rate-highlight)]/5 p-6 text-center">
        <div className="text-3xl mb-2">✓</div>
        <h3 className="font-semibold text-[var(--bankng-rate-highlight)]">Gửi thành công!</h3>
        <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="sourcePage" value={sourcePage} />
      <input type="hidden" name="contextType" value={contextType} />
      <input type="hidden" name="contextSlug" value={contextSlug} />

      <div>
        <label className="mb-1 block text-sm font-medium">
          Họ tên <span className="text-[var(--bankng-warning)]">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          minLength={2}
          placeholder="Nhập họ tên của bạn"
          className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-4 py-2.5 text-sm"
        />
        {state.errors?.name && (
          <p className="mt-1 text-xs text-[var(--bankng-warning)]">{state.errors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Số điện thoại <span className="text-[var(--bankng-warning)]">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          required
          placeholder="0912345678"
          className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-4 py-2.5 text-sm"
        />
        {state.errors?.phone && (
          <p className="mt-1 text-xs text-[var(--bankng-warning)]">{state.errors.phone}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          placeholder="email@example.com"
          className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-4 py-2.5 text-sm"
        />
        {state.errors?.email && (
          <p className="mt-1 text-xs text-[var(--bankng-warning)]">{state.errors.email}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Lời nhắn (không bắt buộc)</label>
        <textarea
          name="message"
          rows={3}
          placeholder="Bạn quan tâm đến sản phẩm nào? Có cần tư vấn gì thêm không?"
          className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-4 py-2.5 text-sm resize-none"
        />
      </div>

      {state.message && !state.success && (
        <p className="text-sm text-[var(--bankng-warning)]">{state.message}</p>
      )}

      <SubmitButton />

      <p className="text-xs text-[var(--bankng-text-secondary)] text-center">
        Nhân viên sẽ liên hệ bạn trong 24h làm việc.
      </p>
    </form>
  );
}
