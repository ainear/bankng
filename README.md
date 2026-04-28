# Bankng

Nganhang-style fintech comparison and lead-gen platform.

## Local Setup

```bash
pnpm install
cp .env.example .env.local
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Apps

- `apps/web`: public SEO web.
- `apps/admin`: admin backoffice.
- `apps/banker`: banker portal.
- `apps/api`: API/BFF health and future domain endpoints.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```
