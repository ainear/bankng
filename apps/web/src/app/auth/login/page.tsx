import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập hệ thống | Bankng",
  description: "Cổng đăng nhập điều hướng dành cho nhân viên ngân hàng (Banker) và quản trị viên (Admin) của Bankng.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 relative overflow-hidden px-6 py-12">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-violet-600/20 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-4xl z-10 space-y-8">
        {/* Back Link */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-wider bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-full px-4 py-2"
          >
            ← Quay lại Trang chủ
          </Link>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500/10 px-4 py-2 border border-blue-500/20">
            <svg height="24" width="24" viewBox="0 0 32 32" fill="none" className="animate-pulse">
              <rect width="32" height="32" rx="6" fill="#2563eb" />
              <text x="16" y="22" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">B</text>
            </svg>
            <span className="text-sm font-bold text-blue-400 tracking-wide">Bankng Gateway</span>
          </div>
          <h1 className="text-3xl font-extrabold md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
            Đăng Nhập Hệ Thống
          </h1>
          <p className="max-w-xl mx-auto text-sm text-slate-400 leading-relaxed">
            Chào mừng bạn quay trở lại. Hãy lựa chọn cổng kết nối phù hợp với vai trò của bạn bên dưới.
          </p>
        </div>

        {/* Portal Options Grid */}
        <div className="grid gap-6 md:grid-cols-2 pt-4">
          {/* Banker Option */}
          <a
            href="https://banker-lovat.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-700/60 bg-slate-800/40 backdrop-blur-lg p-6 md:p-8 transition-all hover:border-blue-500/50 hover:bg-slate-800/60 shadow-lg hover:shadow-blue-500/5"
          >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-2xl group-hover:scale-110 transition-transform">
                👤
              </div>
              <h3 className="mt-5 text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                Cổng Nhân viên Ngân hàng (Banker)
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                Dành cho các tư vấn viên tín dụng và tiết kiệm đăng nhập để quản lý yêu cầu tư vấn (Leads), lọc khách hàng theo địa bàn và tương tác chốt Deal.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:translate-x-1.5 transition-transform uppercase tracking-wider">
              Truy cập Banker Portal →
            </div>
          </a>

          {/* Admin Option */}
          <a
            href="https://bankng-admin.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-700/60 bg-slate-800/40 backdrop-blur-lg p-6 md:p-8 transition-all hover:border-violet-500/50 hover:bg-slate-800/60 shadow-lg hover:shadow-violet-500/5"
          >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-2xl group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <h3 className="mt-5 text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                Cổng Quản trị hệ thống (Admin CMS)
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                Dành cho Ban điều hành và biên tập viên duyệt hồ sơ Banker, cập nhật danh mục, phê duyệt sản phẩm tài chính và cấu hình tham số hệ thống.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-violet-400 group-hover:translate-x-1.5 transition-transform uppercase tracking-wider">
              Truy cập Admin CMS →
            </div>
          </a>
        </div>

        {/* Retail User Notice */}
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/20 backdrop-blur-sm p-6 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[10px] font-bold text-amber-400 tracking-wider uppercase mb-3">
            💡 Dành cho Khách hàng cá nhân
          </span>
          <h4 className="text-sm font-semibold text-slate-200">Bạn đang tìm kiếm so sánh lãi suất và các công cụ tính toán?</h4>
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
            Bạn **không cần** đăng nhập hay tạo tài khoản! Mọi công cụ tính toán vay mua nhà, vay mua xe, gửi tiết kiệm và so sánh lãi suất của Bankng đều được mở cửa hoàn toàn **miễn phí 100%** và phục vụ trực tiếp cho mọi người dùng đại chúng.
          </p>
          <div className="mt-4">
            <Link
              href="/compare/tiet-kiem"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline transition-colors"
            >
              So sánh Lãi suất Tiết kiệm ngay →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
