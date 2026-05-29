"use server";

import { prisma } from "@bankng/db";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
  const bankerEmail = process.env.BANKER_EMAIL ?? "banker@bankng.local";

  const title = formData.get("title") as string;
  const bio = formData.get("bio") as string;
  const cityName = formData.get("cityName") as string;
  const provinceCode = formData.get("provinceCode") as string;

  try {
    const user = await prisma.user.findUnique({ where: { email: bankerEmail } });
    if (!user) return { success: false, message: "Không tìm thấy tài khoản." };

    await prisma.banker.update({
      where: { userId: user.id },
      data: {
        title: title || null,
        bio: bio || null,
        cityName: cityName || null,
        provinceCode: provinceCode || null,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/");
    return { success: true, message: "Đã cập nhật hồ sơ thành công." };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại." };
  }
}
