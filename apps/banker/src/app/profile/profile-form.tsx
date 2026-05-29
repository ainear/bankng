"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfileAction } from "./actions";

interface DefaultValues {
  title: string;
  bio: string;
  cityName: string;
  provinceCode: string;
}

interface Province {
  value: string;
  label: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[var(--bankng-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--bankng-primary)]/90 disabled:opacity-60"
    >
      {pending ? "Đang lưu..." : "Lưu hồ sơ"}
    </button>
  );
}

export function ProfileForm({
  defaultValues,
  provinces,
}: {
  defaultValues: DefaultValues;
  provinces: Province[];
}) {
  const [state, action] = useActionState(
    async (_prev: { success: boolean; message: string } | null, formData: FormData) => {
      return updateProfileAction(formData);
    },
    null
  );

  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (state?.success) {
      setSuccessMsg(state.message);
      const t = setTimeout(() => setSuccessMsg(""), 4000);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <form action={action} className="space-y-5 rounded-xl border border-[var(--bankng-border)] bg-white p-6">
      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--bankng-text-primary)]">
          Chức danh
        </label>
        <input
          type="text"
          name="title"
          defaultValue={defaultValues.title}
          placeholder="VD: Chuyên Viên Tư Vấn Vay Mua Nhà"
          className="w-full rounded-lg border border-[var(--bankng-border)] px-4 py-2.5 text-sm focus:border-[var(--bankng-primary)] focus:outline-none"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--bankng-text-primary)]">
          Giới thiệu bản thân
        </label>
        <textarea
          name="bio"
          defaultValue={defaultValues.bio}
          rows={4}
          placeholder="Mô tả ngắn về kinh nghiệm, chuyên môn và lĩnh vực tư vấn của bạn..."
          className="w-full resize-none rounded-lg border border-[var(--bankng-border)] px-4 py-2.5 text-sm focus:border-[var(--bankng-primary)] focus:outline-none"
        />
      </div>

      {/* Location */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--bankng-text-primary)]">
            Tỉnh/Thành
          </label>
          <select
            name="provinceCode"
            defaultValue={defaultValues.provinceCode}
            className="w-full rounded-lg border border-[var(--bankng-border)] px-4 py-2.5 text-sm focus:border-[var(--bankng-primary)] focus:outline-none"
          >
            {provinces.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--bankng-text-primary)]">
            Quận/Huyện
          </label>
          <input
            type="text"
            name="cityName"
            defaultValue={defaultValues.cityName}
            placeholder="VD: Quận Cầu Giấy, Hà Nội"
            className="w-full rounded-lg border border-[var(--bankng-border)] px-4 py-2.5 text-sm focus:border-[var(--bankng-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          ✓ {successMsg}
        </div>
      )}
      {state && !state.success && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
