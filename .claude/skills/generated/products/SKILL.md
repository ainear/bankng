---
name: products
description: "Skill for the Products area of bankng. 19 symbols across 6 files."
---

# Products

19 symbols | 6 files | Cohesion: 66%

## When to Use

- Working with code in `apps/`
- Understanding how toSlug, createRateAction, updateRateAction work
- Modifying products-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `apps/admin/src/modules/products/actions.ts` | revalidateProducts, createProductAction, updateProductAction, createVariantAction, updateVariantAction |
| `apps/admin/src/modules/shared/server/form-values.ts` | parseBooleanField, parseOptionalStringField, parseOptionalNumberField, parseOptionalIntegerField, parseRequiredDateField |
| `apps/admin/src/modules/categories/actions.ts` | revalidateCategories, createCategoryAction, updateCategoryAction |
| `apps/admin/src/modules/banks/actions.ts` | revalidateBanks, createBankAction, updateBankAction |
| `apps/admin/src/modules/rates/actions.ts` | createRateAction, updateRateAction |
| `packages/shared-utils/src/slug.ts` | toSlug |

## Entry Points

Start here when exploring this area:

- **`toSlug`** (Function) — `packages/shared-utils/src/slug.ts:0`
- **`createRateAction`** (Function) — `apps/admin/src/modules/rates/actions.ts:84`
- **`updateRateAction`** (Function) — `apps/admin/src/modules/rates/actions.ts:124`
- **`createProductAction`** (Function) — `apps/admin/src/modules/products/actions.ts:23`
- **`updateProductAction`** (Function) — `apps/admin/src/modules/products/actions.ts:51`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `toSlug` | Function | `packages/shared-utils/src/slug.ts` | 0 |
| `createRateAction` | Function | `apps/admin/src/modules/rates/actions.ts` | 84 |
| `updateRateAction` | Function | `apps/admin/src/modules/rates/actions.ts` | 124 |
| `createProductAction` | Function | `apps/admin/src/modules/products/actions.ts` | 23 |
| `updateProductAction` | Function | `apps/admin/src/modules/products/actions.ts` | 51 |
| `createVariantAction` | Function | `apps/admin/src/modules/products/actions.ts` | 97 |
| `updateVariantAction` | Function | `apps/admin/src/modules/products/actions.ts` | 129 |
| `createCategoryAction` | Function | `apps/admin/src/modules/categories/actions.ts` | 17 |
| `updateCategoryAction` | Function | `apps/admin/src/modules/categories/actions.ts` | 40 |
| `createBankAction` | Function | `apps/admin/src/modules/banks/actions.ts` | 17 |
| `updateBankAction` | Function | `apps/admin/src/modules/banks/actions.ts` | 47 |
| `parseBooleanField` | Function | `apps/admin/src/modules/shared/server/form-values.ts` | 0 |
| `parseOptionalStringField` | Function | `apps/admin/src/modules/shared/server/form-values.ts` | 4 |
| `parseOptionalNumberField` | Function | `apps/admin/src/modules/shared/server/form-values.ts` | 13 |
| `parseOptionalIntegerField` | Function | `apps/admin/src/modules/shared/server/form-values.ts` | 18 |
| `parseRequiredDateField` | Function | `apps/admin/src/modules/shared/server/form-values.ts` | 23 |
| `revalidateProducts` | Function | `apps/admin/src/modules/products/actions.ts` | 17 |
| `revalidateCategories` | Function | `apps/admin/src/modules/categories/actions.ts` | 12 |
| `revalidateBanks` | Function | `apps/admin/src/modules/banks/actions.ts` | 12 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `CreateRateAction → ParseAdminSessionToken` | cross_community | 6 |
| `UpdateRateAction → ParseAdminSessionToken` | cross_community | 6 |
| `CreateRateAction → ReadRequiredEnv` | cross_community | 5 |
| `UpdateRateAction → ReadRequiredEnv` | cross_community | 5 |
| `CreateProductAction → ParseAdminSessionToken` | cross_community | 5 |
| `UpdateProductAction → ParseAdminSessionToken` | cross_community | 5 |
| `CreateVariantAction → ParseAdminSessionToken` | cross_community | 5 |
| `UpdateVariantAction → ParseAdminSessionToken` | cross_community | 5 |
| `CreateCategoryAction → ParseAdminSessionToken` | cross_community | 5 |
| `UpdateCategoryAction → ParseAdminSessionToken` | cross_community | 5 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Rates | 12 calls |
| Leads | 12 calls |
| Staging | 10 calls |

## How to Explore

1. `gitnexus_context({name: "toSlug"})` — see callers and callees
2. `gitnexus_query({query: "products"})` — find related execution flows
3. Read key files listed above for implementation details
