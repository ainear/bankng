---
name: server
description: "Skill for the Server area of bankng. 13 symbols across 6 files."
---

# Server

13 symbols | 6 files | Cohesion: 96%

## When to Use

- Working with code in `apps/`
- Understanding how parseAdminSessionToken, createAdminSessionToken, verifyAdminSessionToken work
- Modifying server-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `apps/admin/src/modules/auth/server/session.ts` | readRequiredEnv, getAdminCredentials, createAdminCookieValue, verifyAdminCookieValue |
| `packages/auth/src/admin-session.ts` | parseAdminSessionToken, createAdminSessionToken, verifyAdminSessionToken |
| `apps/web/src/modules/public/server/lead-actions.ts` | buildLeadFeedbackPath, buildDuplicateFeedbackPath, submitLeadAction |
| `apps/admin/src/modules/auth/actions.ts` | loginAdminAction |
| `apps/web/src/modules/public/normalize-phone.ts` | normalizePhone |
| `apps/web/src/modules/public/lead-dedupe.ts` | isDuplicateLead |

## Entry Points

Start here when exploring this area:

- **`parseAdminSessionToken`** (Function) — `packages/auth/src/admin-session.ts:14`
- **`createAdminSessionToken`** (Function) — `packages/auth/src/admin-session.ts:28`
- **`verifyAdminSessionToken`** (Function) — `packages/auth/src/admin-session.ts:43`
- **`loginAdminAction`** (Function) — `apps/admin/src/modules/auth/actions.ts:6`
- **`getAdminCredentials`** (Function) — `apps/admin/src/modules/auth/server/session.ts:18`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `parseAdminSessionToken` | Function | `packages/auth/src/admin-session.ts` | 14 |
| `createAdminSessionToken` | Function | `packages/auth/src/admin-session.ts` | 28 |
| `verifyAdminSessionToken` | Function | `packages/auth/src/admin-session.ts` | 43 |
| `loginAdminAction` | Function | `apps/admin/src/modules/auth/actions.ts` | 6 |
| `getAdminCredentials` | Function | `apps/admin/src/modules/auth/server/session.ts` | 18 |
| `createAdminCookieValue` | Function | `apps/admin/src/modules/auth/server/session.ts` | 25 |
| `verifyAdminCookieValue` | Function | `apps/admin/src/modules/auth/server/session.ts` | 33 |
| `normalizePhone` | Function | `apps/web/src/modules/public/normalize-phone.ts` | 0 |
| `isDuplicateLead` | Function | `apps/web/src/modules/public/lead-dedupe.ts` | 0 |
| `submitLeadAction` | Function | `apps/web/src/modules/public/server/lead-actions.ts` | 20 |
| `readRequiredEnv` | Function | `apps/admin/src/modules/auth/server/session.ts` | 8 |
| `buildLeadFeedbackPath` | Function | `apps/web/src/modules/public/server/lead-actions.ts` | 8 |
| `buildDuplicateFeedbackPath` | Function | `apps/web/src/modules/public/server/lead-actions.ts` | 14 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ReviewStagingRateAction → ParseAdminSessionToken` | cross_community | 7 |
| `BulkReviewStagingRateAction → ParseAdminSessionToken` | cross_community | 7 |
| `CreateRateSourceAction → ParseAdminSessionToken` | cross_community | 7 |
| `UpdateRateSourceAction → ParseAdminSessionToken` | cross_community | 7 |
| `VerifyRateAction → ParseAdminSessionToken` | cross_community | 7 |
| `RejectRateAction → ParseAdminSessionToken` | cross_community | 7 |
| `ExpireRateAction → ParseAdminSessionToken` | cross_community | 7 |
| `CreateBranchAction → ParseAdminSessionToken` | cross_community | 7 |
| `UpdateBranchAction → ParseAdminSessionToken` | cross_community | 7 |
| `PublishStagingRateAction → ParseAdminSessionToken` | cross_community | 7 |

## How to Explore

1. `gitnexus_context({name: "parseAdminSessionToken"})` — see callers and callees
2. `gitnexus_query({query: "server"})` — find related execution flows
3. Read key files listed above for implementation details
