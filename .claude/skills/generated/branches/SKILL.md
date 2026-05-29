---
name: branches
description: "Skill for the Branches area of bankng. 4 symbols across 1 files."
---

# Branches

4 symbols | 1 files | Cohesion: 32%

## When to Use

- Working with code in `apps/`
- Understanding how createBranchAction, updateBranchAction, deleteBranchAction work
- Modifying branches-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `apps/admin/src/modules/branches/actions.ts` | revalidateBranches, createBranchAction, updateBranchAction, deleteBranchAction |

## Entry Points

Start here when exploring this area:

- **`createBranchAction`** (Function) — `apps/admin/src/modules/branches/actions.ts:18`
- **`updateBranchAction`** (Function) — `apps/admin/src/modules/branches/actions.ts:42`
- **`deleteBranchAction`** (Function) — `apps/admin/src/modules/branches/actions.ts:70`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `createBranchAction` | Function | `apps/admin/src/modules/branches/actions.ts` | 18 |
| `updateBranchAction` | Function | `apps/admin/src/modules/branches/actions.ts` | 42 |
| `deleteBranchAction` | Function | `apps/admin/src/modules/branches/actions.ts` | 70 |
| `revalidateBranches` | Function | `apps/admin/src/modules/branches/actions.ts` | 11 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `CreateBranchAction → ParseAdminSessionToken` | cross_community | 7 |
| `UpdateBranchAction → ParseAdminSessionToken` | cross_community | 7 |
| `DeleteBranchAction → ParseAdminSessionToken` | cross_community | 7 |
| `CreateBranchAction → ReadRequiredEnv` | cross_community | 6 |
| `UpdateBranchAction → ReadRequiredEnv` | cross_community | 6 |
| `DeleteBranchAction → ReadRequiredEnv` | cross_community | 6 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Products | 4 calls |
| Rates | 3 calls |
| Leads | 3 calls |
| Staging | 3 calls |

## How to Explore

1. `gitnexus_context({name: "createBranchAction"})` — see callers and callees
2. `gitnexus_query({query: "branches"})` — find related execution flows
3. Read key files listed above for implementation details
