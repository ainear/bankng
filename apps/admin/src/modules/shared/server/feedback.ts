const feedbackCatalog = {
  bank_created: {
    tone: "success",
    title: "Da tao bank",
    description: "Bank moi da duoc them vao catalog."
  },
  bank_updated: {
    tone: "success",
    title: "Da cap nhat bank",
    description: "Thong tin bank da duoc luu."
  },
  bank_deleted: {
    tone: "success",
    title: "Da xoa bank",
    description: "Bank da duoc go khoi catalog va audit log da duoc ghi."
  },
  branch_created: {
    tone: "success",
    title: "Da tao branch",
    description: "Branch moi da san sang de gan rates theo khu vuc."
  },
  branch_updated: {
    tone: "success",
    title: "Da cap nhat branch",
    description: "Thong tin chi nhanh da duoc cap nhat."
  },
  branch_deleted: {
    tone: "success",
    title: "Da xoa branch",
    description: "Branch da duoc go khoi catalog va audit log da duoc ghi."
  },
  category_created: {
    tone: "success",
    title: "Da tao category",
    description: "Category moi da duoc them vao catalog."
  },
  category_updated: {
    tone: "success",
    title: "Da cap nhat category",
    description: "Category da duoc luu."
  },
  category_deleted: {
    tone: "success",
    title: "Da xoa category",
    description: "Category da duoc go khoi catalog."
  },
  product_created: {
    tone: "success",
    title: "Da tao product",
    description: "Product moi da duoc them vao catalog."
  },
  product_updated: {
    tone: "success",
    title: "Da cap nhat product",
    description: "Product da duoc cap nhat."
  },
  product_deleted: {
    tone: "success",
    title: "Da xoa product",
    description: "Product da duoc go khoi catalog."
  },
  variant_created: {
    tone: "success",
    title: "Da tao variant",
    description: "Variant moi da san sang cho rate snapshots."
  },
  variant_updated: {
    tone: "success",
    title: "Da cap nhat variant",
    description: "Variant da duoc cap nhat."
  },
  variant_deleted: {
    tone: "success",
    title: "Da xoa variant",
    description: "Variant da duoc xoa khoi product."
  },
  rate_source_created: {
    tone: "success",
    title: "Da tao rate source",
    description: "Nguon du lieu moi da san sang de dung cho verification."
  },
  rate_source_updated: {
    tone: "success",
    title: "Da cap nhat rate source",
    description: "Nguon rate da duoc cap nhat."
  },
  rate_source_deleted: {
    tone: "success",
    title: "Da xoa rate source",
    description: "Nguon rate da duoc xoa khoi danh muc."
  },
  rate_created: {
    tone: "success",
    title: "Da tao rate snapshot",
    description: "Rate moi da duoc them vao he thong."
  },
  rate_updated: {
    tone: "success",
    title: "Da cap nhat rate snapshot",
    description: "Rate snapshot da duoc cap nhat."
  },
  rate_verified: {
    tone: "success",
    title: "Da verify rate",
    description: "Rate da duoc xac minh va luu lich su verification."
  },
  rate_rejected: {
    tone: "warning",
    title: "Da reject rate",
    description: "Rate da duoc danh dau can xem lai truoc khi dung."
  },
  rate_expired: {
    tone: "warning",
    title: "Da expire rate",
    description: "Rate da duoc danh dau het hieu luc."
  },
  rate_deleted: {
    tone: "success",
    title: "Da xoa rate snapshot",
    description: "Rate snapshot da duoc xoa khoi he thong."
  },
  lead_updated: {
    tone: "success",
    title: "Da cap nhat lead",
    description: "Trang thai/assignment cua lead da duoc luu."
  },
  staging_approved: {
    tone: "success",
    title: "Da duyet staging rate",
    description: "Staging rate da duoc approve va publish."
  },
  staging_rejected: {
    tone: "warning",
    title: "Da tu choi staging rate",
    description: "Staging rate da duoc reject."
  },
  staging_bulk_approved: {
    tone: "success",
    title: "Da duyet nhieu staging rates",
    description: "Cac staging rates da duoc approve."
  },
  staging_bulk_rejected: {
    tone: "warning",
    title: "Da tu choi nhieu staging rates",
    description: "Cac staging rates da duoc reject."
  },
  staging_deleted: {
    tone: "success",
    title: "Da xoa staging rate",
    description: "Staging rate da duoc xoa khoi he thong."
  },
  crawl_cancelled: {
    tone: "warning",
    title: "Da huy crawl job",
    description: "Crawl job da duoc cancel boi admin."
  },
  crawl_retry_started: {
    tone: "success",
    title: "Da kich hoat retry crawl",
    description: "Crawl job da duoc reset de retry."
  },
  staging_published: {
    tone: "success",
    title: "Da publish staging rate",
    description: "Rate da duoc tao trong InterestRateSnapshot."
  },
  staging_bulk_published: {
    tone: "success",
    title: "Da publish nhieu staging rates",
    description: "Cac rates da duoc tao trong InterestRateSnapshot."
  }
} as const;

export type FeedbackCode = keyof typeof feedbackCatalog;

export function buildFeedbackPath(pathname: string, code: FeedbackCode) {
  return `${pathname}?feedback=${code}`;
}

export function resolveFeedback(code?: string | null) {
  if (!code) {
    return null;
  }

  return feedbackCatalog[code as FeedbackCode] ?? null;
}
