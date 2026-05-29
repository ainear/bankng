"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { submitBankerRegistration, type BankerRegistrationState } from "@/app/actions/banker-registration";

const initialState: BankerRegistrationState = {
  success: false,
  message: "",
};

const PROVINCES = [
  { value: "", label: "Chọn tỉnh/thành" },
  { value: "HN", label: "Hà Nội" },
  { value: "HCM", label: "Hồ Chí Minh" },
  { value: "DN", label: "Đà Nẵng" },
  { value: "CT", label: "Cần Thơ" },
  { value: "HP", label: "Hải Phòng" },
  { value: "BR", label: "Bình Dương" },
  { value: "DNI", label: "Đồng Nai" },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-[var(--bankng-primary)] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--bankng-primary)]/90 disabled:opacity-50"
    >
      {pending ? "Đang xử lý..." : "Đăng ký ngay"}
    </button>
  );
}

export default function BankerRegistrationPage() {
  const [state, formAction] = useActionState(submitBankerRegistration, initialState);

  if (state.success) {
    return (
      <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
        <section className="mx-auto max-w-lg px-6 py-16 text-center">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold">Đăng ký thành công!</h1>
          <p className="mt-4 text-[var(--bankng-text-secondary)]">
            {state.message}
          </p>
          <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">
            Chúng tôi sẽ kiểm tra thông tin và phản hồi trong 24–48h.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-[var(--bankng-primary)] hover:underline"
          >
            ← Quay về trang chủ
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto max-w-lg px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Đăng ký tài khoản Nhân viên Tư vấn</h1>
          <p className="mt-2 text-[var(--bankng-text-secondary)]">
            Điền thông tin để đăng ký làm nhân viên tư vấn trên Bankng.
          </p>
        </div>

        <form action={formAction} className="space-y-4 rounded-lg border border-[var(--bankng-border)] bg-white p-6">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Họ tên <span className="text-[var(--bankng-warning)]">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              minLength={2}
              placeholder="Nhập họ tên đầy đủ"
              className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-4 py-2.5 text-sm"
            />
            {state.errors?.fullName && (
              <p className="mt-1 text-xs text-[var(--bankng-warning)]">{state.errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Email <span className="text-[var(--bankng-warning)]">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="email@nganhang.com"
              className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-4 py-2.5 text-sm"
            />
            {state.errors?.email && (
              <p className="mt-1 text-xs text-[var(--bankng-warning)]">{state.errors.email}</p>
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
            <label className="mb-1 block text-sm font-medium">
              Ngân hàng làm việc <span className="text-[var(--bankng-warning)]">*</span>
            </label>
            <select
              name="bankId"
              required
              className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-4 py-2.5 text-sm"
            >
              <option value="">Chọn ngân hàng</option>
              <option value="demo-bank">Demo Bank</option>
            </select>
            {state.errors?.bankId && (
              <p className="mt-1 text-xs text-[var(--bankng-warning)]">{state.errors.bankId}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Chức danh</label>
            <input
              type="text"
              name="title"
              placeholder="VD: Chuyên Viên Tư Vấn"
              className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Tỉnh/Thành</label>
            <select
              name="provinceCode"
              className="w-full rounded-md border border-[var(--bankng-border)] bg-white px-4 py-2.5 text-sm"
            >
              {PROVINCES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {state.message && !state.success && (
            <p className="text-sm text-[var(--bankng-warning)]">{state.message}</p>
          )}

          <SubmitButton />

          <p className="text-xs text-[var(--bankng-text-secondary)] text-center">
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <Link href="/dieu-khoan" className="text-[var(--bankng-primary)] hover:underline">
              điều khoản sử dụng
            </Link>{" "}
            của chúng tôi.
          </p>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-[var(--bankng-text-secondary)]">Chưa có tài khoản? </span>
          <Link href="/danh-sach-bankers" className="font-medium text-[var(--bankng-primary)] hover:underline">
            Xem danh sách nhân viên
          </Link>
        </div>
      </section>
    </main>
  );
}
