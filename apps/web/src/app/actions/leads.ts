"use server";

import { prisma } from "@bankng/db";
import { revalidatePath } from "next/cache";

export type LeadFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

export async function submitLead(
  prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string | null;
  const message = formData.get("message") as string | null;
  const provinceCode = formData.get("provinceCode") as string | null;
  const sourcePage = formData.get("sourcePage") as string;
  const contextType = formData.get("contextType") as string;
  const contextSlug = formData.get("contextSlug") as string;
  const assignedToId = formData.get("assignedToId") as string | null;

  // Validate
  const errors: Record<string, string> = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Vui lòng nhập họ tên (ít nhất 2 ký tự)";
  }

  if (!phone || !/^[0-9]{9,11}$/.test(phone.replace(/\s/g, ""))) {
    errors.phone = "Vui lòng nhập số điện thoại hợp lệ (9-11 số)";
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Vui lòng nhập email hợp lệ";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin",
      errors,
    };
  }

  try {
    // Chống spam: kiểm tra trùng SĐT trong 24h cùng context
    const phoneNormalized = phone.replace(/\s/g, "").replace(/^0/, "+84");
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const duplicate = await prisma.lead.findFirst({
      where: {
        phoneNormalized,
        contextType: contextType || "general",
        contextSlug: contextSlug || "",
        createdAt: { gte: since24h },
      },
    });

    if (duplicate) {
      return {
        success: true,
        message: "Chúng tôi đã nhận yêu cầu của bạn. Nhân viên sẽ liên hệ sớm nhất.",
      };
    }

    await prisma.lead.create({
      data: {
        name: name.trim(),
        phone: phone.replace(/\s/g, ""),
        phoneNormalized,
        email: email?.trim() || null,
        message: message?.trim() || null,
        provinceCode: provinceCode || null,
        sourcePage: sourcePage || "/",
        contextType: contextType || "general",
        contextSlug: contextSlug || "",
        status: "new",
        assignedToId: assignedToId || null,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      message: "Cảm ơn bạn! Nhân viên tư vấn sẽ liên hệ trong vòng 24 giờ.",
    };
  } catch (error) {
    console.error("Failed to submit lead:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
    };
  }
}
