"use client";

import { useState } from "react";

export function OfflineAlert() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="w-full bg-amber-500/15 border-b border-amber-500/25 px-6 py-3.5 backdrop-blur-md text-amber-900 transition-all duration-300">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <p className="text-xs md:text-sm font-medium leading-relaxed">
            <strong className="font-bold">Thông báo hệ thống:</strong> Máy chủ dữ liệu hiện đang bảo trì. 
            Bạn đang trải nghiệm hệ thống ở <span className="underline font-semibold decoration-amber-500/40">chế độ Offline/Demo</span> với dữ liệu mô phỏng. 
            Các tính năng đăng ký, tư vấn có thể tạm thời bị gián đoạn.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="flex-shrink-0 text-amber-800 hover:text-amber-950 bg-amber-500/10 hover:bg-amber-500/20 p-1.5 rounded-lg transition-all text-sm font-semibold cursor-pointer"
          aria-label="Đóng thông báo"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
