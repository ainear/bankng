import { prisma } from "@bankng/db";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

async function getBankerProfile() {
  try {
    const bankerEmail = process.env.BANKER_EMAIL ?? "banker@bankng.local";
    const user = await prisma.user.findUnique({
      where: { email: bankerEmail },
      include: {
        profile: true,
        bankerProfile: {
          include: {
            bank: { select: { name: true, slug: true } },
          },
        },
      },
    });
    return user;
  } catch {
    return null;
  }
}

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

export default async function ProfilePage() {
  const user = await getBankerProfile();
  const banker = user?.bankerProfile;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--bankng-text-primary)]">Hồ sơ của bạn</h1>
        <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
          Thông tin này sẽ hiển thị công khai trên trang danh sách nhân viên.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Preview card */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-[var(--bankng-text-secondary)] uppercase tracking-wide">
            Xem trước hồ sơ
          </h2>
          <div className="rounded-xl border border-[var(--bankng-border)] bg-white p-5">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 pb-4 border-b border-[var(--bankng-border)]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bankng-primary)]/10 text-2xl font-bold text-[var(--bankng-primary)]">
                {user?.profile?.fullName
                  ? user.profile.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
                  : "?"}
              </div>
              <div className="text-center">
                <div className="font-semibold text-[var(--bankng-text-primary)]">
                  {user?.profile?.fullName ?? user?.email?.split("@")[0] ?? "Chưa có tên"}
                </div>
                {banker?.title && (
                  <div className="mt-0.5 text-sm text-[var(--bankng-text-secondary)]">{banker.title}</div>
                )}
                {banker?.bank?.name && (
                  <div className="mt-1 text-sm font-medium text-[var(--bankng-primary)]">{banker.bank.name}</div>
                )}
              </div>

              {/* Verification badge */}
              {banker?.isVerified ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  ✓ Đã xác thực
                </span>
              ) : (
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                  ⏳ Chờ xác minh
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-[var(--bankng-text-primary)]">
                  {banker?.rating ? Number(banker.rating).toFixed(1) : "—"}
                </div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">Đánh giá TB</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[var(--bankng-text-primary)]">
                  {banker?.reviewCount ?? 0}
                </div>
                <div className="text-xs text-[var(--bankng-text-secondary)]">Lượt đánh giá</div>
              </div>
            </div>

            {banker?.bio && (
              <p className="mt-4 text-sm text-[var(--bankng-text-secondary)] line-clamp-4">
                {banker.bio}
              </p>
            )}
          </div>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-[var(--bankng-text-secondary)] uppercase tracking-wide">
            Chỉnh sửa thông tin
          </h2>
          <ProfileForm
            defaultValues={{
              title: banker?.title ?? "",
              bio: banker?.bio ?? "",
              cityName: banker?.cityName ?? "",
              provinceCode: banker?.provinceCode ?? "",
            }}
            provinces={PROVINCES}
          />
        </div>
      </div>
    </div>
  );
}
