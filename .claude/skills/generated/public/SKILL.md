---
name: public
description: "Skill for the Public area of bankng. 6 symbols across 5 files."
---

# Public

6 symbols | 5 files | Cohesion: 100%

## When to Use

- Working with code in `apps/`
- Understanding how getPublicFreshness, filterCompareProducts, getCompareCategory work
- Modifying public-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `apps/web/src/app/compare/[category]/page.tsx` | generateMetadata, CompareCategoryPage |
| `apps/web/src/modules/public/freshness.ts` | getPublicFreshness |
| `apps/web/src/modules/public/filter-products.ts` | filterCompareProducts |
| `apps/web/src/modules/public/data.ts` | getCompareCategory |
| `apps/web/src/modules/public/components/rate-card.tsx` | RateCard |

## Entry Points

Start here when exploring this area:

- **`getPublicFreshness`** (Function) — `apps/web/src/modules/public/freshness.ts:8`
- **`filterCompareProducts`** (Function) — `apps/web/src/modules/public/filter-products.ts:12`
- **`getCompareCategory`** (Function) — `apps/web/src/modules/public/data.ts:42`
- **`RateCard`** (Function) — `apps/web/src/modules/public/components/rate-card.tsx:21`
- **`generateMetadata`** (Function) — `apps/web/src/app/compare/[category]/page.tsx:11`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getPublicFreshness` | Function | `apps/web/src/modules/public/freshness.ts` | 8 |
| `filterCompareProducts` | Function | `apps/web/src/modules/public/filter-products.ts` | 12 |
| `getCompareCategory` | Function | `apps/web/src/modules/public/data.ts` | 42 |
| `RateCard` | Function | `apps/web/src/modules/public/components/rate-card.tsx` | 21 |
| `generateMetadata` | Function | `apps/web/src/app/compare/[category]/page.tsx` | 11 |
| `CompareCategoryPage` | Function | `apps/web/src/app/compare/[category]/page.tsx` | 25 |

## How to Explore

1. `gitnexus_context({name: "getPublicFreshness"})` — see callers and callees
2. `gitnexus_query({query: "public"})` — find related execution flows
3. Read key files listed above for implementation details
