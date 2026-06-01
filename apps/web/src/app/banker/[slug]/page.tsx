import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Avatar, Rating } from "@bankng/ui";
import { getBanker } from "@/modules/public/data-bankers";
import { LeadFormClient } from "./lead-form-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const banker = await getBanker(slug);

  if (!banker) {
    return {
      title: "Chuyên viên ngân hàng không tồn tại | Bankng",
      description: "Hồ sơ chuyên viên ngân hàng bạn đang tìm kiếm hiện không tồn tại hoặc đã được di chuyển."
    };
  }

  const title = `${banker.userName} - ${banker.title ?? "Chuyên viên tư vấn"} tại ${banker.bankName ?? "Ngân hàng"} | Bankng`;
  const description = `Liên hệ trực tiếp với chuyên viên ${banker.userName} hỗ trợ tại ${banker.cityName ?? "Việt Nam"} để được tư vấn miễn phí các sản phẩm tài chính thế mạnh: ${banker.bio ? banker.bio.slice(0, 80) : ""}. Cập nhật hồ sơ xác thực và đánh giá của khách hàng.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      ...(banker.avatarUrl ? { images: [banker.avatarUrl] } : {}),
    },
  };
}

function formatDate(date: Date) {
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function BankerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const banker = await getBanker(slug);

  if (!banker) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `https://bankng.vn/banker/${slug}#person`,
        "name": banker.userName,
        "jobTitle": banker.title ?? "Chuyên viên tư vấn tài chính",
        "worksFor": {
          "@type": "Organization",
          "name": banker.bankName ?? "Ngân hàng"
        },
        "image": banker.avatarUrl,
        "email": banker.userEmail
      },
      {
        "@type": "ProfessionalService",
        "@id": `https://bankng.vn/banker/${slug}#service`,
        "name": `Tư vấn tài chính - ${banker.userName}`,
        "image": banker.avatarUrl,
        "priceRange": "$$",
        "telephone": "0988.291.512",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": banker.cityName ?? "Việt Nam",
          "addressRegion": banker.cityName ?? "Việt Nam",
          "addressCountry": "VN"
        },
        ...(banker.rating > 0 ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": banker.rating.toString(),
            "reviewCount": banker.reviewCount.toString(),
            "bestRating": "5",
            "worstRating": "1"
          }
        } : {})
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6">
          <Link className="text-sm text-[var(--bankng-primary)]" href="/danh-sach-bankers">
            ← Quay lại danh sách
          </Link>
        </div>

        {/* Profile header */}
        <div className="rounded-lg border border-[var(--bankng-border)] bg-white p-6">
          <div className="flex items-start gap-4">
            <Avatar
              src={banker.avatarUrl ?? undefined}
              alt={banker.userName ?? "Banker"}
              size="lg"
              renderImage={(props) => (
                <Image
                  src={props.src}
                  alt={props.alt}
                  width={56}
                  height={56}
                  className={props.className}
                  priority={true}
                />
              )}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{banker.userName}</h1>
                {banker.isVerified && (
                  <span className="rounded-full bg-[var(--bankng-primary)]/10 px-2 py-0.5 text-xs text-[var(--bankng-primary)]">
                    Đã xác thực
                  </span>
                )}
              </div>
              {banker.title && (
                <p className="mt-1 text-[var(--bankng-text-secondary)]">{banker.title}</p>
              )}
              {banker.bankName && (
                <Link
                  href={`/bank/${banker.bankSlug}`}
                  className="mt-1 text-[var(--bankng-primary)] hover:underline"
                >
                  {banker.bankName}
                </Link>
              )}
              {banker.cityName && (
                <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">
                  📍 {banker.cityName}
                </p>
              )}
            </div>
          </div>

          {banker.rating > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <Rating value={banker.rating} showValue />
              <span className="text-sm text-[var(--bankng-text-secondary)]">
                ({banker.reviewCount} đánh giá)
              </span>
            </div>
          )}

          {banker.bio && (
            <p className="mt-4 text-[var(--bankng-text-secondary)]">{banker.bio}</p>
          )}
        </div>

        {/* Contact form */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white p-6">
            <h3 className="font-semibold">Liên hệ {banker.userName}</h3>
            <p className="mt-1 text-sm text-[var(--bankng-text-secondary)]">
              Để lại thông tin để được tư vấn về sản phẩm phù hợp.
            </p>
            <div className="mt-4">
              <LeadFormClient
                sourcePage={`/banker/${slug}`}
                contextType="banker"
                contextSlug={slug}
              />
            </div>
          </div>

          {/* Contact info */}
          <div className="rounded-lg border border-[var(--bankng-border)] bg-white p-6">
            <h3 className="font-semibold">Thông tin liên hệ</h3>
            {banker.userEmail && (
              <p className="mt-3 text-sm text-[var(--bankng-text-secondary)]">
                Email: {banker.userEmail}
              </p>
            )}
            <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">
              Ngày tham gia: {formatDate(banker.createdAt)}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 rounded-lg border border-[var(--bankng-border)] bg-[var(--bankng-surface)] p-6 text-center">
          <h3 className="font-semibold">Cần tư vấn thêm?</h3>
          <p className="mt-2 text-sm text-[var(--bankng-text-secondary)]">
            {banker.userName} sẽ liên hệ bạn trong 24h để tư vấn các sản phẩm phù hợp.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/danh-gia-nhanh/vay-mua-nha">
              <button className="rounded-md bg-[var(--bankng-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--bankng-primary)]/90">
                Tính toán vay mua nhà
              </button>
            </Link>
            <Link href="/danh-gia-nhanh/tiet-kiem">
              <button className="rounded-md border border-[var(--bankng-border)] bg-white px-4 py-2 text-sm font-medium hover:bg-[var(--bankng-surface)]">
                Tính lãi tiết kiệm
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
