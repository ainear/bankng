"use server";

import { prisma } from "@bankng/db";

export type BankerRegistrationState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

export async function submitBankerRegistration(
  prevState: BankerRegistrationState,
  formData: FormData
): Promise<BankerRegistrationState> {
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const fullName = formData.get("fullName") as string;
  const bankId = formData.get("bankId") as string;
  const title = formData.get("title") as string | null;
  const provinceCode = formData.get("provinceCode") as string | null;

  // Validate
  const errors: Record<string, string> = {};

  if (!fullName || fullName.trim().length < 2) {
    errors.fullName = "Vui lòng nhập họ tên (ít nhất 2 ký tự)";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Vui lòng nhập email hợp lệ";
  }

  if (!phone || !/^[0-9]{9,11}$/.test(phone.replace(/\s/g, ""))) {
    errors.phone = "Vui lòng nhập số điện thoại hợp lệ (9-11 số)";
  }

  if (!bankId) {
    errors.bankId = "Vui lòng chọn ngân hàng";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin",
      errors,
    };
  }

  try {
    // Check if email already registered
    const existing = await prisma.bankerRegistration.findFirst({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return {
        success: false,
        message: "Email này đã được đăng ký. Vui lòng chờ phiếu duyệt.",
      };
    }

    await prisma.bankerRegistration.create({
      data: {
        email: email.toLowerCase().trim(),
        phone: phone.replace(/\s/g, ""),
        fullName: fullName.trim(),
        bankId,
        title: title?.trim() || null,
        provinceCode: provinceCode || null,
        status: "pending",
      },
    });

    return {
      success: true,
      message: "Đăng ký thành công! Vui lòng chờ phiếu duyệt trong 24-48 giờ.",
    };
  } catch (error) {
    console.error("Failed to register banker:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
    };
  }
}

export async function getBanks() {
  return prisma.bank.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, shortName: true },
  });
}
