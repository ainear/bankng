---
name: cluster-7
description: "Skill for the Cluster_7 area of bankng. 7 symbols across 2 files."
---

# Cluster_7

7 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `packages/`
- Understanding how runCrawl, launchBrowser work
- Modifying cluster_7-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `packages/crawler/src/crawler.ts` | delay, parseRateValue, parseTerm, crawlPage, runCrawl (+1) |
| `packages/crawler/src/index.ts` | main |

## Entry Points

Start here when exploring this area:

- **`runCrawl`** (Function) — `packages/crawler/src/crawler.ts:93`
- **`launchBrowser`** (Function) — `packages/crawler/src/crawler.ts:106`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `runCrawl` | Function | `packages/crawler/src/crawler.ts` | 93 |
| `launchBrowser` | Function | `packages/crawler/src/crawler.ts` | 106 |
| `main` | Function | `packages/crawler/src/index.ts` | 6 |
| `delay` | Function | `packages/crawler/src/crawler.ts` | 3 |
| `parseRateValue` | Function | `packages/crawler/src/crawler.ts` | 7 |
| `parseTerm` | Function | `packages/crawler/src/crawler.ts` | 12 |
| `crawlPage` | Function | `packages/crawler/src/crawler.ts` | 18 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Main → Delay` | intra_community | 4 |
| `Main → ParseRateValue` | intra_community | 4 |
| `Main → ParseTerm` | intra_community | 4 |

## How to Explore

1. `gitnexus_context({name: "runCrawl"})` — see callers and callees
2. `gitnexus_query({query: "cluster_7"})` — find related execution flows
3. Read key files listed above for implementation details
