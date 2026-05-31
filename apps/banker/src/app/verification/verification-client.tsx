"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveVerificationDocumentAction, mockAdminApprovalAction } from "./actions";

interface BankerData {
  title: string | null;
  bio: string | null;
  cityName: string | null;
  provinceCode: string | null;
  bankId: string | null;
  phonePublic: string | null;
  specialties: string | null;
  idCardFront: string | null;
  idCardBack: string | null;
  workBadge: string | null;
  isVerified: boolean;
}

export function VerificationClient({ banker }: { banker: BankerData | null }) {
  const [isPending, startTransition] = useTransition();
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ success: boolean; text: string } | null>(null);

  const checklistStatus = {
    profile: !!(banker?.title && banker?.bio && banker?.phonePublic && banker?.specialties),
    bank: !!banker?.bankId,
    id: !!(banker?.idCardFront && banker?.idCardBack),
    badge: !!banker?.workBadge,
  };

  const completedCount = Object.values(checklistStatus).filter(Boolean).length;
  const totalCount = 4;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(docType);
    setMsg(null);

    const formData = new FormData();
    formData.append("docType", docType);
    formData.append("file", file);

    startTransition(async () => {
      const res = await saveVerificationDocumentAction(formData);
      setUploadingDoc(null);
      if (res.success) {
        setMsg({ success: true, text: res.message });
      } else {
        setMsg({ success: false, text: res.message });
      }
    });
  };

  const handleMockApproval = (approve: boolean) => {
    setMsg(null);
    startTransition(async () => {
      const res = await mockAdminApprovalAction(approve);
      if (res.success) {
        setMsg({ success: true, text: res.message });
      } else {
        setMsg({ success: false, text: res.message });
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Messages */}
      {msg && (
        <div
          className={`rounded-xl border p-4 text-sm transition-all duration-300 ${
            msg.success
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {msg.success ? "✓ " : "✗ "}
          {msg.text}
        </div>
      )}

      {/* Status banner */}
      <div
        className={`flex items-center gap-4 rounded-xl border p-5 transition-all duration-300 ${
          banker?.isVerified
            ? "bg-green-50 border-green-200"
            : "bg-yellow-50 border-yellow-200"
        }`}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl ${
            banker?.isVerified ? "bg-green-100" : "bg-yellow-100"
          }`}
        >
          {banker?.isVerified ? "✅" : "⏳"}
        </div>
        <div>
          <div className={`font-bold text-base ${banker?.isVerified ? "text-green-800" : "text-yellow-800"}`}>
            {banker?.isVerified ? "Tài khoản đã được xác minh" : "Đang chờ xác minh hồ sơ"}
          </div>
          <div className={`mt-0.5 text-sm ${banker?.isVerified ? "text-green-700" : "text-yellow-700"}`}>
            {banker?.isVerified
              ? "Tuyệt vời! Hồ sơ của bạn đã được phê duyệt. Hệ thống đã bắt đầu tự động phân phối leads."
              : "Vui lòng hoàn thành 4 bước xác minh bên dưới để admin phê duyệt tài khoản của bạn."}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl border border-[var(--bankng-border)] bg-white p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-[var(--bankng-text-primary)]">Tiến trình xác minh</span>
          <span className="font-bold text-[var(--bankng-primary)]">{progressPct}% hoàn thành ({completedCount}/{totalCount} bước)</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[var(--bankng-primary)] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-4">
        {/* Step 1: Profile completed */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-5 transition-all ${
            checklistStatus.profile
              ? "border-green-200 bg-green-50/40"
              : "border-[var(--bankng-border)] bg-white"
          }`}
        >
          <div className="flex gap-4">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                checklistStatus.profile ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {checklistStatus.profile ? "✓" : "1"}
            </div>
            <div>
              <div className={`font-semibold text-sm ${checklistStatus.profile ? "text-green-800" : "text-[var(--bankng-text-primary)]"}`}>
                Hoàn thiện thông tin hồ sơ
              </div>
              <div className="text-xs text-[var(--bankng-text-secondary)] mt-0.5">
                Yêu cầu: Đã cập nhật Chức danh, Giới thiệu, Số điện thoại và Chuyên môn.
              </div>
            </div>
          </div>
          {!checklistStatus.profile && (
            <Link
              href="/profile"
              className="shrink-0 rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-2 text-center text-xs font-semibold text-[var(--bankng-text-primary)] hover:bg-[var(--bankng-surface-muted)] transition-colors"
            >
              Cập nhật hồ sơ →
            </Link>
          )}
        </div>

        {/* Step 2: Linked bank */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-5 transition-all ${
            checklistStatus.bank
              ? "border-green-200 bg-green-50/40"
              : "border-[var(--bankng-border)] bg-white"
          }`}
        >
          <div className="flex gap-4">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                checklistStatus.bank ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {checklistStatus.bank ? "✓" : "2"}
            </div>
            <div>
              <div className={`font-semibold text-sm ${checklistStatus.bank ? "text-green-800" : "text-[var(--bankng-text-primary)]"}`}>
                Liên kết ngân hàng công tác
              </div>
              <div className="text-xs text-[var(--bankng-text-secondary)] mt-0.5">
                Yêu cầu: Liên kết với ngân hàng nơi bạn đang làm việc để nhận leads đúng nguồn.
              </div>
            </div>
          </div>
          {!checklistStatus.bank && (
            <Link
              href="/profile"
              className="shrink-0 rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-2 text-center text-xs font-semibold text-[var(--bankng-text-primary)] hover:bg-[var(--bankng-surface-muted)] transition-colors"
            >
              Liên kết ngay →
            </Link>
          )}
        </div>

        {/* Step 3: CCCD upload */}
        <div
          className={`rounded-xl border p-5 transition-all ${
            checklistStatus.id
              ? "border-green-200 bg-green-50/40"
              : "border-[var(--bankng-border)] bg-white"
          }`}
        >
          <div className="flex gap-4 mb-4">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                checklistStatus.id ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {checklistStatus.id ? "✓" : "3"}
            </div>
            <div>
              <div className={`font-semibold text-sm ${checklistStatus.id ? "text-green-800" : "text-[var(--bankng-text-primary)]"}`}>
                Xác minh Căn cước công dân (CCCD)
              </div>
              <div className="text-xs text-[var(--bankng-text-secondary)] mt-0.5">
                Yêu cầu: Tải lên ảnh CCCD rõ nét cả 2 mặt trước và sau để xác minh danh tính pháp lý.
              </div>
            </div>
          </div>

          {/* Upload Grid */}
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            {/* Front card */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--bankng-border)] p-4 bg-[var(--bankng-surface-muted)]/30 hover:bg-[var(--bankng-surface-muted)]/50 transition-colors relative min-h-[140px]">
              {banker?.idCardFront ? (
                <div className="w-full text-center">
                  <p className="text-xs font-semibold text-green-700 mb-2">✓ Đã tải lên ảnh mặt trước</p>
                  <img
                    src={banker.idCardFront}
                    alt="CCCD Mặt trước"
                    className="mx-auto h-24 object-cover rounded-lg border border-[var(--bankng-border)]"
                  />
                  <label className="mt-2 inline-block cursor-pointer text-xs font-medium text-[var(--bankng-primary)] hover:underline">
                    Thay đổi ảnh
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "idCardFront")}
                      disabled={isPending}
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-center">
                  <span className="text-2xl mb-1">🪪</span>
                  <span className="text-xs font-semibold text-[var(--bankng-text-primary)]">Tải lên CCCD Mặt trước</span>
                  <span className="text-[10px] text-[var(--bankng-text-secondary)] mt-1">Định dạng JPG, PNG</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "idCardFront")}
                    disabled={isPending}
                  />
                </label>
              )}
              {uploadingDoc === "idCardFront" && (
                <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center text-xs font-semibold text-[var(--bankng-primary)]">
                  Đang tải lên...
                </div>
              )}
            </div>

            {/* Back card */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--bankng-border)] p-4 bg-[var(--bankng-surface-muted)]/30 hover:bg-[var(--bankng-surface-muted)]/50 transition-colors relative min-h-[140px]">
              {banker?.idCardBack ? (
                <div className="w-full text-center">
                  <p className="text-xs font-semibold text-green-700 mb-2">✓ Đã tải lên ảnh mặt sau</p>
                  <img
                    src={banker.idCardBack}
                    alt="CCCD Mặt sau"
                    className="mx-auto h-24 object-cover rounded-lg border border-[var(--bankng-border)]"
                  />
                  <label className="mt-2 inline-block cursor-pointer text-xs font-medium text-[var(--bankng-primary)] hover:underline">
                    Thay đổi ảnh
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "idCardBack")}
                      disabled={isPending}
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-center">
                  <span className="text-2xl mb-1">🪪</span>
                  <span className="text-xs font-semibold text-[var(--bankng-text-primary)]">Tải lên CCCD Mặt sau</span>
                  <span className="text-[10px] text-[var(--bankng-text-secondary)] mt-1">Định dạng JPG, PNG</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "idCardBack")}
                    disabled={isPending}
                  />
                </label>
              )}
              {uploadingDoc === "idCardBack" && (
                <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center text-xs font-semibold text-[var(--bankng-primary)]">
                  Đang tải lên...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 4: Work badge upload */}
        <div
          className={`rounded-xl border p-5 transition-all ${
            checklistStatus.badge
              ? "border-green-200 bg-green-50/40"
              : "border-[var(--bankng-border)] bg-white"
          }`}
        >
          <div className="flex gap-4 mb-4">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                checklistStatus.badge ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {checklistStatus.badge ? "✓" : "4"}
            </div>
            <div>
              <div className={`font-semibold text-sm ${checklistStatus.badge ? "text-green-800" : "text-[var(--bankng-text-primary)]"}`}>
                Tải lên Thẻ nhân viên ngân hàng
              </div>
              <div className="text-xs text-[var(--bankng-text-secondary)] mt-0.5">
                Yêu cầu: Ảnh chụp thẻ đeo nhân viên hoặc giấy xác nhận công tác có dấu mộc và logo ngân hàng.
              </div>
            </div>
          </div>

          {/* Upload card */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--bankng-border)] p-5 bg-[var(--bankng-surface-muted)]/30 hover:bg-[var(--bankng-surface-muted)]/50 transition-colors relative min-h-[140px] mt-4">
            {banker?.workBadge ? (
              <div className="w-full text-center">
                <p className="text-xs font-semibold text-green-700 mb-2">✓ Đã tải lên ảnh thẻ nhân viên</p>
                <img
                  src={banker.workBadge}
                  alt="Thẻ nhân viên"
                  className="mx-auto h-28 object-cover rounded-lg border border-[var(--bankng-border)]"
                />
                <label className="mt-3 inline-block cursor-pointer text-xs font-medium text-[var(--bankng-primary)] hover:underline">
                  Thay đổi ảnh
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "workBadge")}
                    disabled={isPending}
                  />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-center py-4">
                <span className="text-3xl mb-1">🏷️</span>
                <span className="text-xs font-semibold text-[var(--bankng-text-primary)]">Tải lên ảnh Thẻ nhân viên</span>
                <span className="text-[10px] text-[var(--bankng-text-secondary)] mt-1">Định dạng JPG, PNG</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "workBadge")}
                  disabled={isPending}
                />
              </label>
            )}
            {uploadingDoc === "workBadge" && (
              <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center text-xs font-semibold text-[var(--bankng-primary)]">
                Đang tải lên...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tester Tool Panel */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🛠️</span>
          <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wider">Hộp công cụ kiểm thử (Tester Mode)</h3>
        </div>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Sử dụng bảng điều khiển này để bỏ qua thời gian chờ admin duyệt hồ sơ thực tế. Bạn có thể tự kích hoạt hoặc hủy kích hoạt trạng thái "Đã xác thực" của tài khoản để kiểm tra sự thay đổi trực quan trên toàn bộ hệ thống ngay lập tức.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleMockApproval(true)}
            disabled={isPending}
            className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-green-700 shadow-sm disabled:opacity-50"
          >
            {isPending ? "Đang xử lý..." : "⚡ Giả lập phê duyệt (Xác thực tài khoản)"}
          </button>
          <button
            onClick={() => handleMockApproval(false)}
            disabled={isPending}
            className="rounded-lg border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-50 disabled:opacity-50"
          >
            {isPending ? "Đang xử lý..." : "Reset trạng thái (Chờ xác minh)"}
          </button>
        </div>
      </div>
    </div>
  );
}
