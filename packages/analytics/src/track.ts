import type { AnalyticsPayload } from "./events";

export function trackEvent(payload: AnalyticsPayload) {
  return {
    ...payload,
    createdAt: payload.createdAt ?? new Date().toISOString()
  };
}
