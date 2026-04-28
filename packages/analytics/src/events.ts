export const analyticsEvents = {
  pageView: "page_view",
  categoryView: "category_view",
  productView: "product_view",
  bankView: "bank_view",
  calculatorStart: "calculator_start",
  calculatorComplete: "calculator_complete",
  leadFormOpen: "lead_form_open",
  leadSubmit: "lead_submit",
  bankerProfileView: "banker_profile_view",
  bankerContactClick: "banker_contact_click"
} as const;

export type AnalyticsEventName = (typeof analyticsEvents)[keyof typeof analyticsEvents];

export type AnalyticsPayload = {
  event: AnalyticsEventName;
  sessionId: string;
  userId?: string | null;
  pagePath?: string;
  categorySlug?: string | null;
  productId?: string | null;
  bankId?: string | null;
  bankerId?: string | null;
  leadId?: string | null;
  createdAt?: string;
};
