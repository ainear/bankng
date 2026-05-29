---
name: leads
description: "Skill for the Leads area of bankng. 11 symbols across 8 files."
---

# Leads

11 symbols | 8 files | Cohesion: 43%

## When to Use

- Working with code in `apps/`
- Understanding how verifyRateAction, rejectRateAction, deleteVariantAction work
- Modifying leads-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `apps/admin/src/modules/rates/actions.ts` | verifyRateAction, rejectRateAction |
| `apps/admin/src/modules/leads/actions.ts` | revalidateLeads, updateLeadAction |
| `apps/banker/src/modules/leads/actions.ts` | getBankerEmail, updateBankerLeadStatusAction |
| `apps/admin/src/modules/products/actions.ts` | deleteVariantAction |
| `apps/admin/src/modules/categories/actions.ts` | deleteCategoryAction |
| `apps/admin/src/modules/leads/history.ts` | shouldAppendLeadHistory |
| `apps/admin/src/modules/shared/server/audit-log.ts` | recordAuditLog |
| `apps/admin/src/modules/shared/server/admin-actor.ts` | getAdminActor |

## Entry Points

Start here when exploring this area:

- **`verifyRateAction`** (Function) — `apps/admin/src/modules/rates/actions.ts:181`
- **`rejectRateAction`** (Function) — `apps/admin/src/modules/rates/actions.ts:216`
- **`deleteVariantAction`** (Function) — `apps/admin/src/modules/products/actions.ts:165`
- **`deleteCategoryAction`** (Function) — `apps/admin/src/modules/categories/actions.ts:67`
- **`shouldAppendLeadHistory`** (Function) — `apps/admin/src/modules/leads/history.ts:0`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `verifyRateAction` | Function | `apps/admin/src/modules/rates/actions.ts` | 181 |
| `rejectRateAction` | Function | `apps/admin/src/modules/rates/actions.ts` | 216 |
| `deleteVariantAction` | Function | `apps/admin/src/modules/products/actions.ts` | 165 |
| `deleteCategoryAction` | Function | `apps/admin/src/modules/categories/actions.ts` | 67 |
| `shouldAppendLeadHistory` | Function | `apps/admin/src/modules/leads/history.ts` | 0 |
| `updateLeadAction` | Function | `apps/admin/src/modules/leads/actions.ts` | 18 |
| `recordAuditLog` | Function | `apps/admin/src/modules/shared/server/audit-log.ts` | 11 |
| `getAdminActor` | Function | `apps/admin/src/modules/shared/server/admin-actor.ts` | 3 |
| `updateBankerLeadStatusAction` | Function | `apps/banker/src/modules/leads/actions.ts` | 10 |
| `revalidateLeads` | Function | `apps/admin/src/modules/leads/actions.ts` | 13 |
| `getBankerEmail` | Function | `apps/banker/src/modules/leads/actions.ts` | 6 |

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

## Connected Areas

| Area | Connections |
|------|-------------|
| Rates | 8 calls |
| Products | 5 calls |
| Staging | 5 calls |

## How to Explore

1. `gitnexus_context({name: "verifyRateAction"})` — see callers and callees
2. `gitnexus_query({query: "leads"})` — find related execution flows
3. Read key files listed above for implementation details
