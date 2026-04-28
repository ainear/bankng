# Sprint Planning — Bankng Comparative Analytics

Generated: 2026-04-28
Duration: 6 weeks (3 x 2-week sprints)
Goal: Crawl nganhang.com data + deliver comparative analytics to paying customers

---

## Phase 0 — Week 0 (Pre-Sprint, ASAP)

**Legal check + spike completion**

| Task | Owner | Status | Notes |
|------|-------|--------|-------|
| Confirm legal status of crawling nganhang.com | CEO | ⏳ Pending | robots.txt OK, ToS 404 — need direct confirmation |
| Technical spike: validate 5-page crawl works | Dev | ⏳ Pending | Run `pnpm --filter @bankng/crawler start` to test |
| Customer calls: 3 paying customers on comparison view | CEO | ⏳ Pending | 3 questions ready (see below) |

---

## Sprint 1: Foundation (Week 1–2)

**Goal: Staging review UI + crawler first run + seed data**

### Week 1: Staging Review + Crawler Run

| Task | Deliverable | Status |
|------|-------------|--------|
| Install Playwright browsers for crawler | `pnpm playwright install` | ✅ Done |
| Write `CrawlJob` + `CrawlStagingRate` Prisma migration | DB schema | ✅ Done |
| Admin `/staging` page with stats + filters + bulk actions | UI page | ✅ Done |
| `publishStagingRateAction` → create InterestRateSnapshot | Action | ✅ Done |
| `bulkPublishStagingRateAction` | Action | ✅ Done |
| **Run crawler on nganhang.com** (5 pages) | Staging data | ⏳ Todo |
| Validate crawled data quality | QA checklist | ⏳ Todo |

### Week 2: Crawler Refinement + First Publish

| Task | Deliverable | Status |
|------|-------------|--------|
| Fix selector parsing based on actual site HTML | Updated crawler | ⏳ Todo |
| Run full crawl (all product categories) | Staging + 50+ rates | ⏳ Todo |
| Admin: bulk approve verified staging rates | Publish flow | ⏳ Todo |
| Seed demo data for customer demo | DB seed | ⏳ Todo |
| **Sprint 1 demo**: admin sees crawled rates + can publish | Demo | ⏳ Todo |

**Sprint 1 Exit Criteria:**
- [ ] 50+ rates in staging, 10+ published to InterestRateSnapshot
- [ ] Admin can approve/reject/bulk-publish from `/staging`
- [ ] Customer can see published rates on `/compare/[category]`

---

## Sprint 2: API + Analytics Layer (Week 3–4)

**Goal: API routes + analytics dashboard + customer access**

### Week 3: API Routes + Public Compare

| Task | Deliverable | Status |
|------|-------------|--------|
| `GET /api/compare` with category/bank/sort/term filters | API route | ✅ Done |
| `GET /api/rates` with pagination | API route | ✅ Done |
| `GET /api/banks` with slug lookup + productCount | API route | ✅ Done |
| Validate API responses against live DB | QA | ⏳ Todo |
| Add rate limiting to API (future) | Config | ⏳ Future |

### Week 4: Analytics Dashboard MVP

| Task | Deliverable | Status |
|------|-------------|--------|
| `/compare/[category]` page — filter by bank/term/rate | UI page | ✅ Done |
| Rate card component with freshness badge | UI component | ✅ Done |
| Lead CTA form on compare page | Form | ✅ Done |
| Analytics dashboard shell (CSS charts first) | UI | ⏳ Todo |
| D3.js deferred — only if CSS charts insufficient | Decision | ⏳ Todo |

**Sprint 2 Exit Criteria:**
- [ ] All 3 API routes return correct data
- [ ] Customer can compare 2-5 banks on `/compare/[category]` in <30s
- [ ] At least 1 paying customer confirms value

---

## Sprint 3: Polish + Launch (Week 5–6)

**Goal: Production-ready + customer onboarding**

### Week 5: Production Hardening

| Task | Deliverable | Status |
|------|-------------|--------|
| Set `secure: true` on session cookies for prod | Auth fix | ⏳ Todo |
| Add rate limiting on `/api/*` routes | Security | ⏳ Todo |
| Deploy to Vercel (web) + Railway (crawler) | Infra | ⏳ Todo |
| PostHog events for analytics feature usage | Tracking | ⏳ Todo |
| Sentry error monitoring setup | Monitoring | ⏳ Todo |

### Week 6: Launch + Customer Onboarding

| Task | Deliverable | Status |
|------|-------------|--------|
| Customer call: show demo to 3 paying customers | Onboarding | ⏳ Todo |
| Collect feedback on comparison view fields | Feedback | ⏳ Todo |
| Fix any issues from customer feedback | Iteration | ⏳ Todo |
| **GOAL: 3 paying customers using new feature** | Success metric | ⏳ Todo |

**Sprint 3 Exit Criteria:**
- [ ] 80% accuracy on crawled data (validate against manual sample)
- [ ] User can compare 2-5 banks in <30 seconds
- [ ] 3 paying customers using feature in week 1
- [ ] Zero data incidents

---

## Success Metrics

| Metric | Target | How to measure |
|--------|--------|---------------|
| Data accuracy | 80%+ | Manual spot-check 10 rates against nganhang.com |
| Comparison speed | <30s (from 30-60min) | Time from search to side-by-side view |
| Paying customers | 3+ in week 1 | PostHog event `feature_used` |
| Data incidents | 0 | Zero customer complaints about wrong rates |
| Legal compliance | Clean | No cease-and-desist from nganhang.com |

---

## Open Questions (Blockers)

1. **Legal**: nganhang.com ToS 404 — need written confirmation before proceeding with crawler on prod
2. **Data refresh frequency**: Daily? Weekly? Affects crawler schedule design
3. **Comparison view**: 2 banks side-by-side vs filter-based? (Customer call will decide)

---

## Customer Call: 3 Questions for Paying Customers

**Purpose: Validate what to show in the comparison view**

```
Q1: Khi so sánh 2 ngân hàng cho cùng 1 sản phẩm (VD: vay mua nhà 5 tỷ, 20 năm),
   bạn MUỐN thấy thông tin gì đầu tiên?

Q2: Thông tin nào dưới đây quan trọng nhất khi ra quyết định?
   - Lãi suất (tỷ lệ %)
   - Phí (phí phạt trả nợ sớm, phí xử lý hồ sơ)
   - Kỳ hạn tối thiểu/tối đa
   - Yêu cầu thu nhập
   - Yêu cầu tài sản đảm bảo

Q3: Bạn có muốn thấy lịch sử lãi suất (rate theo thời gian) không?
   - Có (để thấy xu hướng)
   - Không (chỉ cần rate hiện tại)
```