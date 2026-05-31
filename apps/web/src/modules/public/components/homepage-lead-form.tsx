"use client";

import { useState } from "react";

type BankOption = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
};

type Props = {
  banks: BankOption[];
};

const PROVINCES = [
  { code: "HN", name: "Hà Nội" },
  { code: "HCM", name: "Hồ Chí Minh" },
  { code: "DN", name: "Đà Nẵng" },
  { code: "HP", name: "Hải Phòng" },
  { code: "CT", name: "Cần Thơ" },
  { code: "BD", name: "Bình Dương" },
  { code: "DNai", name: "Đồng Nai" },
  { code: "KH", name: "Khánh Hòa" },
  { code: "QN", name: "Quảng Ninh" },
  { code: "NA", name: "Nghệ An" },
  { code: "TB", name: "Thái Bình" },
  { code: "HD", name: "Hải Dương" },
  { code: "BN", name: "Bắc Ninh" },
  { code: "VT", name: "Bà Rịa - Vũng Tàu" },
  { code: "LA", name: "Long An" },
  { code: "TG", name: "Tiền Giang" },
  { code: "AG", name: "An Giang" },
  { code: "DT", name: "Đồng Tháp" },
  { code: "LD", name: "Lâm Đồng" },
  { code: "BTh", name: "Bình Thuận" },
  { code: "PY", name: "Phú Yên" },
  { code: "BinhDinh", name: "Bình Định" },
  { code: "QB", name: "Quảng Bình" },
  { code: "QT", name: "Quảng Trị" },
  { code: "TTH", name: "Thừa Thiên Huế" },
  { code: "TuyenQuang", name: "Tuyên Quang" },
  { code: "YenBai", name: "Yên Bái" },
  { code: "LC", name: "Lào Cai" },
  { code: "LS", name: "Lạng Sơn" },
  { code: "CB", name: "Cao Bằng" },
  { code: "HaGiang", name: "Hòa Giang" },
  { code: "SonLa", name: "Sơn La" },
  { code: "HoaBinh", name: "Hòa Bình" },
  { code: "PhuTho", name: "Phú Thọ" }
];

export function HomepageLeadForm({ banks }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [bankSlug, setBankSlug] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !province || !bankSlug) {
      setStatus({ type: "error", msg: "Vui lòng điền đầy đủ các thông tin bắt buộc (*)." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined,
          message: message || `Cần tư vấn nhanh lãi suất tiết kiệm & vay tại ngân hàng ${bankSlug}`,
          sourcePage: "/",
          contextType: "bank",
          contextSlug: bankSlug,
          provinceCode: province,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          msg: data.message || "Đăng ký tư vấn thành công! Chuyên viên sẽ liên hệ với bạn trong thời gian sớm nhất.",
        });
        // Reset form
        setName("");
        setPhone("");
        setEmail("");
        setProvince("");
        setBankSlug("");
        setMessage("");
      } else {
        setStatus({
          type: "error",
          msg: data.message || "Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-12" id="consultation-form">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-white/70 p-8 shadow-xl backdrop-blur-md md:p-10">
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl" />

        <div className="relative text-center">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            ✉️ Hỗ trợ 24/7
          </span>
          <h2 className="mt-3 text-2xl font-black md:text-3xl">Cần tư vấn nhanh?</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            Để lại thông tin bên dưới, thuật toán AI sẽ tự động phân phối thông tin và kết nối bạn với chuyên viên ngân hàng uy tín nhất trong vòng 24 giờ.
          </p>
        </div>

        {status && (
          <div
            className={`mt-6 rounded-xl border p-4 text-sm transition-all duration-300 ${
              status.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <div className="flex gap-2">
              <span>{status.type === "success" ? "✅" : "⚠️"}</span>
              <p className="font-medium">{status.msg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Họ và tên */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullname" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                id="fullname"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên của bạn..."
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại liên hệ..."
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Tỉnh / Thành */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="province" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Khu vực cần hỗ trợ <span className="text-red-500">*</span>
              </label>
              <select
                id="province"
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
              >
                <option value="" disabled>-- Chọn Tỉnh / Thành phố --</option>
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ngân hàng muốn vay/gửi */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bank" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ngân hàng mong muốn <span className="text-red-500">*</span>
              </label>
              <select
                id="bank"
                required
                value={bankSlug}
                onChange={(e) => setBankSlug(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
              >
                <option value="" disabled>-- Chọn ngân hàng --</option>
                {banks.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.shortName ?? b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Email (Tuỳ chọn) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email (Tùy chọn)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập địa chỉ email..."
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Lời nhắn chi tiết */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nhu cầu tài chính chi tiết
            </label>
            <textarea
              id="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ví dụ: Cần vay mua nhà kỳ hạn 15 năm, hạn mức 2 tỷ; Hoặc cần gửi tiết kiệm online 500 triệu..."
              className="w-full rounded-xl border border-slate-200 bg-white/50 p-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 px-8 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/10 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-600/20 active:scale-95 disabled:scale-100 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Đang xử lý thông tin...</span>
                </div>
              ) : (
                "Gửi thông tin đăng ký nhanh 🚀"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
