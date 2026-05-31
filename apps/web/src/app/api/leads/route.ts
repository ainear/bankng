import { prisma } from "@bankng/db";
import { normalizePhoneNumber, routeLeadToBanker } from "@bankng/shared-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message, sourcePage, contextType, contextSlug, provinceCode } = body;

    // Basic validation
    if (!name || !phone || !sourcePage || !contextType || !contextSlug) {
      return Response.json(
        { success: false, message: "Thiếu thông tin bắt buộc." },
        { status: 400 }
      );
    }

    const phoneNormalized = normalizePhoneNumber(phone);

    // 1. Deduplication check (within 24 hours for the same product context)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingLead = await prisma.lead.findFirst({
      where: {
        phoneNormalized,
        contextSlug,
        createdAt: {
          gte: oneDayAgo,
        },
      },
    });

    if (existingLead) {
      return Response.json(
        {
          success: false,
          message: "Số điện thoại này đã đăng ký tư vấn sản phẩm này trong vòng 24 giờ qua. Yêu cầu của bạn đã được tiếp nhận và đang xử lý.",
        },
        { status: 400 }
      );
    }

    // 2. Automated routing using Round-Robin
    const assignedToId = await routeLeadToBanker(
      { provinceCode: provinceCode || null, contextType },
      prisma
    );

    // 3. Create lead and status history in a transaction
    const lead = await prisma.$transaction(async (tx) => {
      const newLead = await tx.lead.create({
        data: {
          name,
          phone,
          phoneNormalized,
          email: email || null,
          message: message || null,
          sourcePage,
          contextType,
          contextSlug,
          provinceCode: provinceCode || null,
          assignedToId,
          status: "new",
        },
      });

      await tx.leadStatusHistory.create({
        data: {
          leadId: newLead.id,
          toStatus: "new",
          note: assignedToId
            ? "Hệ thống tự động gán cho Banker phù hợp dựa trên khu vực và chuyên môn."
            : "Chưa có Banker phù hợp trực tuyến. Đưa vào hàng chờ phân phối chung.",
        },
      });

      return newLead;
    });

    return Response.json({
      success: true,
      message: assignedToId
        ? "Đăng ký tư vấn thành công! Hệ thống đã gán chuyên viên hỗ trợ bạn."
        : "Đăng ký tư vấn thành công! Chuyên viên sẽ liên hệ với bạn trong thời gian sớm nhất.",
      lead,
    });
  } catch (error) {
    console.error("Error in POST /api/leads:", error);
    return Response.json(
      { success: false, message: "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
