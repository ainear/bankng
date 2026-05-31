"use server";

import { prisma } from "@bankng/db";
import { revalidatePath } from "next/cache";

export async function saveVerificationDocumentAction(formData: FormData) {
  const bankerEmail = process.env.BANKER_EMAIL ?? "banker@bankng.local";
  const docType = formData.get("docType") as string;
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { success: false, message: "Vui lòng chọn tệp ảnh hợp lệ." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: bankerEmail } });
    if (!user) return { success: false, message: "Không tìm thấy tài khoản." };

    // Convert file to Base64 to simulate cloud/local file storage in DB
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    const updateData: Record<string, string | null> = {};
    if (docType === "idCardFront") {
      updateData.idCardFront = dataUrl;
    } else if (docType === "idCardBack") {
      updateData.idCardBack = dataUrl;
    } else if (docType === "workBadge") {
      updateData.workBadge = dataUrl;
    } else {
      return { success: false, message: "Loại tài liệu không hợp lệ." };
    }

    await prisma.banker.update({
      where: { userId: user.id },
      data: updateData,
    });

    revalidatePath("/verification");
    revalidatePath("/");
    return { success: true, message: "Tải tài liệu lên thành công." };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Có lỗi xảy ra khi lưu tài liệu. Vui lòng thử lại." };
  }
}

export async function mockAdminApprovalAction(isVerified: boolean) {
  const bankerEmail = process.env.BANKER_EMAIL ?? "banker@bankng.local";

  try {
    const user = await prisma.user.findUnique({ where: { email: bankerEmail } });
    if (!user) return { success: false, message: "Không tìm thấy tài khoản." };

    await prisma.banker.update({
      where: { userId: user.id },
      data: { isVerified },
    });

    revalidatePath("/verification");
    revalidatePath("/");
    return {
      success: true,
      message: isVerified
        ? "Đã kích hoạt giả lập xác thực tài khoản thành công."
        : "Đã hủy giả lập xác thực tài khoản.",
    };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Lỗi hệ thống. Vui lòng thử lại." };
  }
}
