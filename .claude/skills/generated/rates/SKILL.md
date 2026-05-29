---
name: rates
description: "Skill for the Rates area of bankng. 18 symbols across 13 files."
---

# Rates

18 symbols | 13 files | Cohesion: 66%

## When to Use

- Working with code in `apps/`
- Understanding how getFreshnessIndicator, RatesPage, filterLeads work
- Modifying rates-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `apps/admin/src/modules/rates/actions.ts` | revalidateRates, createRateSourceAction, updateRateSourceAction, deleteRateSourceAction, deleteRateAction (+1) |
| `apps/admin/src/modules/rates/freshness.ts` | getFreshnessIndicator |
| `apps/admin/src/modules/rates/page.tsx` | RatesPage |
| `apps/admin/src/modules/leads/filter.ts` | filterLeads |
| `apps/admin/src/modules/products/page.tsx` | ProductsPage |
| `apps/admin/src/modules/categories/page.tsx` | CategoriesPage |
| `apps/admin/src/modules/branches/page.tsx` | BranchesPage |
| `apps/admin/src/modules/leads/page.tsx` | LeadsPage |
| `apps/admin/src/modules/banks/page.tsx` | BanksPage |
| `apps/admin/src/modules/shared/server/feedback.ts` | resolveFeedback |

## Entry Points

Start here when exploring this area:

- **`getFreshnessIndicator`** (Function) — `apps/admin/src/modules/rates/freshness.ts:8`
- **`RatesPage`** (Function) — `apps/admin/src/modules/rates/page.tsx:25`
- **`filterLeads`** (Function) — `apps/admin/src/modules/leads/filter.ts:6`
- **`ProductsPage`** (Function) — `apps/admin/src/modules/products/page.tsx:23`
- **`CategoriesPage`** (Function) — `apps/admin/src/modules/categories/page.tsx:5`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getFreshnessIndicator` | Function | `apps/admin/src/modules/rates/freshness.ts` | 8 |
| `RatesPage` | Function | `apps/admin/src/modules/rates/page.tsx` | 25 |
| `filterLeads` | Function | `apps/admin/src/modules/leads/filter.ts` | 6 |
| `ProductsPage` | Function | `apps/admin/src/modules/products/page.tsx` | 23 |
| `CategoriesPage` | Function | `apps/admin/src/modules/categories/page.tsx` | 5 |
| `BranchesPage` | Function | `apps/admin/src/modules/branches/page.tsx` | 16 |
| `LeadsPage` | Function | `apps/admin/src/modules/leads/page.tsx` | 14 |
| `BanksPage` | Function | `apps/admin/src/modules/banks/page.tsx` | 5 |
| `resolveFeedback` | Function | `apps/admin/src/modules/shared/server/feedback.ts` | 179 |
| `createRateSourceAction` | Function | `apps/admin/src/modules/rates/actions.ts` | 22 |
| `updateRateSourceAction` | Function | `apps/admin/src/modules/rates/actions.ts` | 43 |
| `deleteRateSourceAction` | Function | `apps/admin/src/modules/rates/actions.ts` | 69 |
| `deleteRateAction` | Function | `apps/admin/src/modules/rates/actions.ts` | 166 |
| `expireRateAction` | Function | `apps/admin/src/modules/rates/actions.ts` | 251 |
| `deleteProductAction` | Function | `apps/admin/src/modules/products/actions.ts` | 83 |
| `AdminProtectedLayout` | Function | `apps/admin/src/app/(admin)/layout.tsx` | 12 |
| `requireAdminSession` | Function | `apps/admin/src/modules/auth/server/session.ts` | 45 |
| `revalidateRates` | Function | `apps/admin/src/modules/rates/actions.ts` | 17 |

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
| Leads | 7 calls |
| Products | 6 calls |
| Staging | 6 calls |
| Server | 1 calls |

## How to Explore

1. `gitnexus_context({name: "getFreshnessIndicator"})` — see callers and callees
2. `gitnexus_query({query: "rates"})` — find related execution flows
3. Read key files listed above for implementation details
