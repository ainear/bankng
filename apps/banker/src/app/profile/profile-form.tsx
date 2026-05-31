"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfileAction } from "./actions";

interface DefaultValues {
  title: string;
  bio: string;
  cityName: string;
  provinceCode: string;
  bankId: string;
  phonePublic: string;
  specialties: string;
}

interface Province {
  value: string;
  label: string;
}

interface Bank {
  id: string;
  name: string;
  shortName: string | null;
}

const SPECIALTIES = [
  { value: "tiet-kiem", label: "Tiết kiệm" },
  { value: "vay-mua-nha", label: "Vay mua nhà" },
  { value: "vay-mua-xe", label: "Vay mua xe" },
  { value: "vay-tieu-dung", label: "Vay tiêu dùng" },
  { value: "the-tin-dung", label: "Thẻ tín dụng" },
  { value: "vay-kinh-doanh", label: "Vay kinh doanh" },
  { value: "vay-tin-chap", label: "Vay tín chấp" },
];

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
  banks,
}: {
  defaultValues: DefaultValues;
  provinces: Province[];
  banks: Bank[];
}) {
  const [state, action] = useActionState(
    async (_prev: { success: boolean; message: string } | null, formData: FormData) => {
      return updateProfileAction(formData);
    },
    null
  );

  const [successMsg, setSuccessMsg] = useState("");
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(
    defaultValues.specialties ? defaultValues.specialties.split(",") : []
  );

  const handleSpecChange = (val: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  useEffect(() => {
    if (state?.success) {
      setSuccessMsg(state.message);
      const t = setTimeout(() => setSuccessMsg(""), 4000);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <form action={action} className="space-y-5 rounded-xl border border-[var(--bankng-border)] bg-white p-6">
      {/* Dynamic hidden input to submit specialties as comma separated string */}
      <input type="hidden" name="specialties" value={selectedSpecs.join(",")} />

      <div className="grid gap-4 sm:grid-cols-2">
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

        {/* Public Phone */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--bankng-text-primary)]">
            Số điện thoại liên hệ công khai
          </label>
          <input
            type="text"
            name="phonePublic"
            defaultValue={defaultValues.phonePublic}
            placeholder="VD: 0987654321"
            className="w-full rounded-lg border border-[var(--bankng-border)] px-4 py-2.5 text-sm focus:border-[var(--bankng-primary)] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Bank Connection */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--bankng-text-primary)]">
            Ngân hàng công tác
          </label>
          <select
            name="bankId"
            defaultValue={defaultValues.bankId}
            className="w-full rounded-lg border border-[var(--bankng-border)] px-4 py-2.5 text-sm focus:border-[var(--bankng-primary)] focus:outline-none"
          >
            <option value="">Chọn ngân hàng</option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.shortName ? `${b.shortName} - ${b.name}` : b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location - Province */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--bankng-text-primary)]">
            Tỉnh/Thành phố
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
      </div>

      {/* Location - City/District */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--bankng-text-primary)]">
          Quận/Huyện, Khu vực hoạt động cụ thể
        </label>
        <input
          type="text"
          name="cityName"
          defaultValue={defaultValues.cityName}
          placeholder="VD: Quận Cầu Giấy, Quận Nam Từ Liêm"
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

      {/* Specialties Checkboxes */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--bankng-text-primary)]">
          Chuyên môn tư vấn (Chọn tất cả những gì bạn hỗ trợ tốt nhất)
        </label>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 rounded-lg border border-[var(--bankng-border)] p-4 bg-[var(--bankng-surface-muted)]/50">
          {SPECIALTIES.map((spec) => {
            const isChecked = selectedSpecs.includes(spec.value);
            return (
              <label
                key={spec.value}
                className="flex items-center gap-2 cursor-pointer rounded-lg p-2 transition-colors hover:bg-white border border-transparent hover:border-[var(--bankng-border)]"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleSpecChange(spec.value)}
                  className="h-4 w-4 rounded border-[var(--bankng-border)] text-[var(--bankng-primary)] focus:ring-[var(--bankng-primary)]"
                />
                <span className="text-sm font-medium text-[var(--bankng-text-primary)]">
                  {spec.label}
                </span>
              </label>
            );
          })}
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

      <div className="flex justify-end pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
