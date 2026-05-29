---
name: slug
description: "Skill for the [slug] area of bankng. 6 symbols across 3 files."
---

# [slug]

6 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `apps/`
- Understanding how getPublicProduct, generateMetadata, ProductDetailPage work
- Modifying [slug]-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `apps/web/src/modules/public/data.ts` | getPublicProduct, getPublicBank |
| `apps/web/src/app/product/[slug]/page.tsx` | generateMetadata, ProductDetailPage |
| `apps/web/src/app/bank/[slug]/page.tsx` | generateMetadata, BankDetailPage |

## Entry Points

Start here when exploring this area:

- **`getPublicProduct`** (Function) — `apps/web/src/modules/public/data.ts:78`
- **`generateMetadata`** (Function) — `apps/web/src/app/product/[slug]/page.tsx:8`
- **`ProductDetailPage`** (Function) — `apps/web/src/app/product/[slug]/page.tsx:25`
- **`getPublicBank`** (Function) — `apps/web/src/modules/public/data.ts:122`
- **`generateMetadata`** (Function) — `apps/web/src/app/bank/[slug]/page.tsx:8`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getPublicProduct` | Function | `apps/web/src/modules/public/data.ts` | 78 |
| `generateMetadata` | Function | `apps/web/src/app/product/[slug]/page.tsx` | 8 |
| `ProductDetailPage` | Function | `apps/web/src/app/product/[slug]/page.tsx` | 25 |
| `getPublicBank` | Function | `apps/web/src/modules/public/data.ts` | 122 |
| `generateMetadata` | Function | `apps/web/src/app/bank/[slug]/page.tsx` | 8 |
| `BankDetailPage` | Function | `apps/web/src/app/bank/[slug]/page.tsx` | 23 |

## How to Explore

1. `gitnexus_context({name: "getPublicProduct"})` — see callers and callees
2. `gitnexus_query({query: "[slug]"})` — find related execution flows
3. Read key files listed above for implementation details
