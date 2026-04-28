# Roadmap: Bankng

## Overview

Build Bankng from operational foundation toward a complete fintech comparison platform.
The first phases established the monorepo, admin catalog/rates system, protected admin workflows, and verification/freshness operations.
The remaining phases expand the public experience, banker workflows, leads, content, trust operations, and release readiness.

## Phases

- [x] **Phase 1: Foundation** - Scaffold monorepo, shared packages, DB/auth baseline, tests, and smoke coverage.
- [x] **Phase 2: Catalog & Rates CRUD** - Build core admin CRUD for banks, categories, products, variants, rate sources, and rates.
- [x] **Phase 3: Admin Protection & Feedback** - Add admin login protection, guarded mutations, mutation feedback, and branch CRUD.
- [x] **Phase 4: Rate Verification & Freshness** - Add rate verification workflow, verification history, and freshness indicators.
- [ ] **Phase 5: Public Compare Experience** - Build public compare/category/product/bank flows from live catalog and rates.
- [ ] **Phase 6: Banker Portal Core** - Expand banker-facing profile and workflow surfaces beyond the shell.
- [ ] **Phase 7: Lead CRM & Routing** - Add lead capture lifecycle and admin/banker lead handling workflows.
- [ ] **Phase 8: Content & SEO Engine** - Add content, glossary, FAQ, and SEO landing infrastructure.
- [ ] **Phase 9: Moderation, Trust & Audit Expansion** - Extend moderation, trust controls, and operational review tooling.
- [ ] **Phase 10: Hardening & Release Readiness** - Tighten performance, security, deployment, and production readiness.

## Phase Details

### Phase 1: Foundation
**Goal**: Establish the monorepo, shared packages, Prisma baseline, testing, and project-local runtime configuration.
**Depends on**: Nothing (first phase)
**Success Criteria** (what must be TRUE):
  1. Public web, admin, banker, and API app shells boot and render.
  2. Root verification commands pass across the monorepo.
  3. Shared DB/auth/rules packages compile and integrate.
**Plans**: 1 plan

Plans:
- [x] 01-01: Scaffold monorepo foundation and baseline verification

### Phase 2: Catalog & Rates CRUD
**Goal**: Build admin CRUD for the core bank/catalog/rates data model and persist mutation history.
**Depends on**: Phase 1
**Success Criteria** (what must be TRUE):
  1. Admin can manage banks, categories, products, variants, rate sources, and rate snapshots.
  2. Audit logs exist for sensitive catalog and rates mutations.
  3. Rates UI renders current catalog-backed data.
**Plans**: 1 plan

Plans:
- [x] 02-01: Implement admin catalog and rates CRUD

### Phase 3: Admin Protection & Feedback
**Goal**: Protect admin workflows and improve operational usability with feedback and branch management.
**Depends on**: Phase 2
**Success Criteria** (what must be TRUE):
  1. Unauthenticated admin users are redirected to login.
  2. Sensitive admin actions are guarded server-side.
  3. Admin sees mutation feedback and can manage branches.
**Plans**: 1 plan

Plans:
- [x] 03-01: Add admin login protection, action guards, feedback, and branch CRUD

### Phase 4: Rate Verification & Freshness
**Goal**: Add operational review workflow for rates and expose freshness/reliability indicators in admin.
**Depends on**: Phase 3
**Success Criteria** (what must be TRUE):
  1. Admin can verify, reject, or expire rates with stored review history.
  2. Freshness state is visible on rate rows.
  3. Source reliability and latest verification metadata are visible in admin.
**Plans**: 1 plan

Plans:
- [x] 04-01: Implement rate verification workflow and freshness indicators

### Phase 5: Public Compare Experience
**Goal**: Build public compare/category/product/bank flows from current catalog and rate data.
**Depends on**: Phase 4
**Success Criteria** (what must be TRUE):
  1. Users can browse compare/category pages backed by live product and rate data.
  2. Product and bank detail pages render meaningful finance data from the shared DB.
  3. Public pages surface trustworthy freshness/source information.
**Plans**: TBD

Plans:
- [ ] 05-01: Build compare/category pages
- [ ] 05-02: Build product and bank detail pages

### Phase 6: Banker Portal Core
**Goal**: Expand banker-facing profile, verification, and workflow surfaces beyond the current shell.
**Depends on**: Phase 5
**Success Criteria** (what must be TRUE):
  1. Banker can manage a meaningful public profile.
  2. Banker sees verification status and relevant workflow state.
  3. Banker portal moves beyond placeholder shell behavior.
**Plans**: TBD

Plans:
- [ ] 06-01: Build banker profile management
- [ ] 06-02: Build banker workflow dashboard

### Phase 7: Lead CRM & Routing
**Goal**: Add lead capture lifecycle and admin/banker lead handling workflows.
**Depends on**: Phase 6
**Success Criteria** (what must be TRUE):
  1. Public users can submit leads through working flows.
  2. Admin can route and track leads.
  3. Banker can receive and act on assigned leads.
**Plans**: TBD

Plans:
- [ ] 07-01: Build lead capture and admin routing
- [ ] 07-02: Build banker lead handling

### Phase 8: Content & SEO Engine
**Goal**: Add content, glossary, FAQ, and SEO landing infrastructure.
**Depends on**: Phase 7
**Success Criteria** (what must be TRUE):
  1. Admin can manage content entities beyond catalog/rates.
  2. Public site can render SEO-oriented article and glossary surfaces.
  3. Structured content supports search distribution and trust building.
**Plans**: TBD

Plans:
- [ ] 08-01: Build content management and rendering
- [ ] 08-02: Build SEO-oriented public surfaces

### Phase 9: Moderation, Trust & Audit Expansion
**Goal**: Extend moderation, trust controls, and operational review tooling.
**Depends on**: Phase 8
**Success Criteria** (what must be TRUE):
  1. Moderation flows exist for risky or externally contributed data.
  2. Trust signals and auditability are stronger across the platform.
  3. Operators can review and act on problematic records efficiently.
**Plans**: TBD

Plans:
- [ ] 09-01: Build moderation queues and trust controls

### Phase 10: Hardening & Release Readiness
**Goal**: Tighten performance, security, deployment, and production readiness.
**Depends on**: Phase 9
**Success Criteria** (what must be TRUE):
  1. Critical user flows are covered by robust verification.
  2. Security and performance issues are reduced to an acceptable release level.
  3. The project is ready for a real release workflow.
**Plans**: TBD

Plans:
- [ ] 10-01: Hardening, release checks, and readiness review

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 1/1 | Complete | 2026-04-21 |
| 2. Catalog & Rates CRUD | 1/1 | Complete | 2026-04-21 |
| 3. Admin Protection & Feedback | 1/1 | Complete | 2026-04-21 |
| 4. Rate Verification & Freshness | 1/1 | Complete | 2026-04-21 |
| 5. Public Compare Experience | 0/2 | Not started | - |
| 6. Banker Portal Core | 0/2 | Not started | - |
| 7. Lead CRM & Routing | 0/2 | Not started | - |
| 8. Content & SEO Engine | 0/2 | Not started | - |
| 9. Moderation, Trust & Audit Expansion | 0/1 | Not started | - |
| 10. Hardening & Release Readiness | 0/1 | Not started | - |
