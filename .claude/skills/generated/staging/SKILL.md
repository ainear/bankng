---
name: staging
description: "Skill for the Staging area of bankng. 14 symbols across 5 files."
---

# Staging

14 symbols | 5 files | Cohesion: 52%

## When to Use

- Working with code in `apps/`
- Understanding how reviewStagingRateAction, bulkReviewStagingRateAction, publishStagingRateAction work
- Modifying staging-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `apps/admin/src/modules/staging/actions.ts` | revalidateStaging, reviewStagingRateAction, bulkReviewStagingRateAction, publishStagingRateAction, bulkPublishStagingRateAction (+3) |
| `apps/admin/src/modules/staging/data.ts` | getStagingJobs, getStagingRates, getStagingStats |
| `apps/admin/src/modules/banks/actions.ts` | deleteBankAction |
| `apps/admin/src/modules/shared/server/feedback.ts` | buildFeedbackPath |
| `apps/admin/src/app/staging/page.tsx` | StagingPage |

## Entry Points

Start here when exploring this area:

- **`reviewStagingRateAction`** (Function) — `apps/admin/src/modules/staging/actions.ts:17`
- **`bulkReviewStagingRateAction`** (Function) — `apps/admin/src/modules/staging/actions.ts:64`
- **`publishStagingRateAction`** (Function) — `apps/admin/src/modules/staging/actions.ts:104`
- **`bulkPublishStagingRateAction`** (Function) — `apps/admin/src/modules/staging/actions.ts:181`
- **`deleteStagingRateAction`** (Function) — `apps/admin/src/modules/staging/actions.ts:255`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `reviewStagingRateAction` | Function | `apps/admin/src/modules/staging/actions.ts` | 17 |
| `bulkReviewStagingRateAction` | Function | `apps/admin/src/modules/staging/actions.ts` | 64 |
| `publishStagingRateAction` | Function | `apps/admin/src/modules/staging/actions.ts` | 104 |
| `bulkPublishStagingRateAction` | Function | `apps/admin/src/modules/staging/actions.ts` | 181 |
| `deleteStagingRateAction` | Function | `apps/admin/src/modules/staging/actions.ts` | 255 |
| `cancelCrawlJobAction` | Function | `apps/admin/src/modules/staging/actions.ts` | 270 |
| `retryCrawlJobAction` | Function | `apps/admin/src/modules/staging/actions.ts` | 292 |
| `deleteBankAction` | Function | `apps/admin/src/modules/banks/actions.ts` | 79 |
| `buildFeedbackPath` | Function | `apps/admin/src/modules/shared/server/feedback.ts` | 175 |
| `getStagingJobs` | Function | `apps/admin/src/modules/staging/data.ts` | 4 |
| `getStagingRates` | Function | `apps/admin/src/modules/staging/data.ts` | 13 |
| `getStagingStats` | Function | `apps/admin/src/modules/staging/data.ts` | 44 |
| `StagingPage` | Function | `apps/admin/src/app/staging/page.tsx` | 7 |
| `revalidateStaging` | Function | `apps/admin/src/modules/staging/actions.ts` | 12 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ReviewStagingRateAction → ParseAdminSessionToken` | cross_community | 7 |
| `BulkReviewStagingRateAction → ParseAdminSessionToken` | cross_community | 7 |
| `PublishStagingRateAction → ParseAdminSessionToken` | cross_community | 7 |
| `BulkPublishStagingRateAction → ParseAdminSessionToken` | cross_community | 7 |
| `DeleteStagingRateAction → ParseAdminSessionToken` | cross_community | 7 |
| `CancelCrawlJobAction → ParseAdminSessionToken` | cross_community | 7 |
| `RetryCrawlJobAction → ParseAdminSessionToken` | cross_community | 7 |
| `DeleteBankAction → ParseAdminSessionToken` | cross_community | 7 |
| `ReviewStagingRateAction → ReadRequiredEnv` | cross_community | 6 |
| `BulkReviewStagingRateAction → ReadRequiredEnv` | cross_community | 6 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Leads | 12 calls |
| Rates | 9 calls |
| Products | 3 calls |

## How to Explore

1. `gitnexus_context({name: "reviewStagingRateAction"})` — see callers and callees
2. `gitnexus_query({query: "staging"})` — find related execution flows
3. Read key files listed above for implementation details
