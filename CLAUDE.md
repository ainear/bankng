# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

bankng is a fintech comparison platform (inspired by nganhang.com) with 4 Next.js apps and shared packages in a pnpm monorepo. The platform helps users compare bank rates, find bankers, and get financial advice.

## Setup Commands

```bash
pnpm install                    # Install all dependencies
cp .env.example .env.local     # Set up environment variables
pnpm db:generate              # Generate Prisma client
pnpm db:migrate                # Run database migrations
pnpm db:seed                  # Seed database with sample data
pnpm dev                      # Start all apps in dev mode
```

## Verification Commands

```bash
pnpm lint                      # Lint all packages
pnpm typecheck                # TypeScript type check all packages
pnpm test                     # Run unit tests
pnpm build                    # Build all apps
pnpm test:e2e                 # Run Playwright end-to-end tests
```

## Per-Package Commands

```bash
pnpm -F @bankng/web typecheck  # Typecheck web app only
pnpm -F @bankng/db db:seed     # Run DB seed only
pnpm -F @bankng/db db:migrate  # Run migrations only
```

## Architecture

### Apps (`apps/*`)
- **`web`** — Public SEO site (rate comparison, bankers, news, loan calculators)
- **`admin`** — Backoffice for managing banks, products, rates
- **`banker`** — Banker portal for bankers to manage their profiles and leads
- **`api`** — API/BFF health and future domain endpoints

### Packages (`packages/*`)
- **`db`** — Prisma client singleton (`prisma` export), schema (`prisma/schema.prisma`), seed (`seed.ts`)
- **`ui`** — Shared UI components (Button, Card, Badge, Avatar, Rating, etc.)
- **`auth`** — Authentication module (Supabase-based)
- **`shared-utils`** — Shared utilities (slug.ts, etc.)
- **`shared-types`** — Shared TypeScript types
- **`config`** — Shared configuration
- **`analytics`** — Analytics module
- **`crawler`** — Web crawler for rate data
- **`rules`** — Linting rules

### Key Patterns

**Next.js App Router conventions:**
- `params` is a `Promise` in Next.js 15 — always `await` it
- Dynamic route folder `[slug]` → param key is `"slug"`
- Dynamic route folder `[loan-type]` → param key is `"loan-type"` (hyphenated)
- Server Components for data fetching; `"use client"` for interactive UI

**Server Actions (form submissions):**
- Actions live in `app/actions/` directory
- Use `useActionState` (React 19) not `useFormState`
- Use `useFormStatus` for submit button pending state
- `revalidatePath()` clears Next.js cache after mutations

**Prisma (`packages/db`):**
- Schema at `packages/db/prisma/schema.prisma`
- Client exported as `export * from "./client"` — import as `import { prisma } from "@bankng/db"`
- All mutations go through `prisma.*.create/update/upsert` — no raw SQL unless unavoidable

## Codebase Navigation (GitNexus)

This project is indexed by GitNexus. Use MCP tools to understand code and assess impact before editing:

- **`gitnexus_query({query: "concept"})`** — Find execution flows for a concept
- **`gitnexus_context({name: "symbolName"})`** — Full context on a symbol (callers, callees, execution flows)
- **`gitnexus_impact({target: "symbolName", direction: "upstream"})`** — Blast radius analysis before editing

Generated area skills at `.claude/skills/generated/` (products, rates, staging, server, leads, cluster_7, public, slug, branches) provide targeted context when working in those areas.

## Important Constraints

- **NEVER commit without running `gitnexus_detect_changes()`** — verifies your changes only affect expected symbols
- **ALWAYS run impact analysis before editing a symbol** — report blast radius and risk level to user
- **NEVER rename symbols with find-and-replace** — use `gitnexus_rename` which understands the call graph
- **NEVER ignore HIGH or CRITICAL risk warnings** from impact analysis

## Deployment

See `DEPLOY.md` for full deployment instructions. Apps deploy to Vercel, crawler to Render. Key points:
- Each Vercel project needs `rootDirectory` set to the app folder (e.g., `apps/web`)
- Build command per app: `cd ../.. && pnpm -F @bankng/db db:generate && pnpm -F <app> build`
- Environment variables documented in `DEPLOY.md`

## Additional Context (from existing CLAUDE.md)

The existing GitNexus integration is already loaded above and provides additional "Always Do" and "Never Do" rules for code intelligence. Those rules take precedence over generic guidance when GitNexus tools are available.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **bankng** (2110 symbols, 3509 relationships, 109 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/bankng/context` | Codebase overview, check index freshness |
| `gitnexus://repo/bankng/clusters` | All functional areas |
| `gitnexus://repo/bankng/processes` | All execution flows |
| `gitnexus://repo/bankng/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
