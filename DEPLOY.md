# Deploy Guide — Bankng

## Tổng quan

| Service | Platform | Plan | Notes |
|---------|----------|------|-------|
| web, admin, banker, api | Vercel | Free | Next.js apps |
| crawler | Render | Free ($0) | Cron job, 750h/tháng |

---

## Bước 1: Vercel Token (nếu chưa có)

```bash
# Kiểm tra token hiện tại
vercel whoami
# Nếu lỗi → token hết hạn

# Lấy token mới: https://vercel.com/account/tokens
# Hoặc: vercel login → authenticate trình duyệt
```

---

## Bước 2: Deploy 4 Next.js Apps lên Vercel

### Cách 1: Qua Dashboard (đơn giản nhất)

1. Vào https://vercel.com/new
2. Import repo `bankng` từ GitHub
3. Framework: Next.js
4. Root Directory: `apps/web` → Deploy
5. Lặp lại cho: `apps/admin`, `apps/banker`, `apps/api`
6. Trong Vercel Dashboard → Environment Variables của từng project, thêm:

**bankng-web:**
```
NEXT_PUBLIC_APP_URL=https://bankng.com
AUTH_URL=https://bankng.com
AUTH_SECRET=<openssl rand -base64 32>
NEXT_PUBLIC_SUPABASE_URL=<từ .env.local>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<từ .env.local>
DIRECT_URL=<từ .env.local>
```

**bankng-admin:**
```
NEXT_PUBLIC_APP_URL=https://admin.bankng.com
AUTH_URL=https://admin.bankng.com
AUTH_SECRET=<same>
ADMIN_EMAIL=admin@bankng.com
ADMIN_PASSWORD=<strong password>
NEXT_PUBLIC_SUPABASE_URL=<từ .env.local>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<từ .env.local>
DIRECT_URL=<từ .env.local>
```

**bankng-banker:**
```
NEXT_PUBLIC_APP_URL=https://banker.bankng.com
AUTH_URL=https://banker.bankng.com
AUTH_SECRET=<same>
BANKER_EMAIL=banker@bankng.com
NEXT_PUBLIC_SUPABASE_URL=<từ .env.local>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<từ .env.local>
DIRECT_URL=<từ .env.local>
```

**bankng-api:**
```
NEXT_PUBLIC_APP_URL=https://api.bankng.com
AUTH_URL=https://api.bankng.com
DATABASE_URL=<từ .env.local>
DIRECT_URL=<từ .env.local>
```

### Cách 2: Qua CLI

```bash
cd /Users/gray/Documents/bankng

# Deploy từng app
vercel deploy apps/web --yes --prod --token <Vercel token>
vercel deploy apps/admin --yes --prod --token <Vercel token>
vercel deploy apps/banker --yes --prod --token <Vercel token>
vercel deploy apps/api --yes --prod --token <Vercel token>
```

---

## Bước 3: Deploy Crawler lên Render (GitHub Integration)

### Điều kiện: Repo phải có trên GitHub

```bash
# Tạo repo GitHub (nếu chưa có)
gh repo create bankng --public --source=. --push
```

### Deploy Cron Job

1. Vào https://render.com → "New" → "Blueprint"
2. Connect GitHub repo `bankng`
3. Render tự động thấy `packages/crawler/render.yaml`
4. Click "Apply" → nhập `DATABASE_URL` trong Render Dashboard
5. **DATABASE_URL**: lấy từ Supabase Dashboard → Connection String

---

## Bước 4: Custom Domains (sau khi deploy thành công)

| App | Domain |
|-----|--------|
| web | bankng.com |
| admin | admin.bankng.com |
| banker | banker.bankng.com |
| api | api.bankng.com |

Vercel Dashboard → Project → Settings → Domains → Add

---

## Env Variables Checklist

```bash
# Generate AUTH_SECRET
openssl rand -base64 32
```

| Variable | web | admin | banker | api | crawler |
|----------|-----|-------|--------|-----|---------|
| AUTH_SECRET | ✅ | ✅ | ✅ | | |
| ADMIN_EMAIL | | ✅ | | | |
| ADMIN_PASSWORD | | ✅ | | | |
| BANKER_EMAIL | | | ✅ | | |
| NEXT_PUBLIC_SUPABASE_URL | ✅ | ✅ | ✅ | | |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ | ✅ | ✅ | | |
| DATABASE_URL | | ✅ | ✅ | ✅ | ✅ |
| DIRECT_URL | ✅ | ✅ | ✅ | ✅ | |
| NODE_ENV | | | | | ✅ |

---

## Kiểm tra sau Deploy

```bash
# Test API
curl https://api.bankng.com/api/banks
curl https://api.bankng.com/api/rates
curl https://api.bankng.com/api/compare

# Test admin login
# Truy cập https://admin.bankng.com → redirect /login
```

---

## Files đã tạo cho deploy

```
vercel.json                          # Vercel multi-app config
packages/crawler/Dockerfile           # Playwright + Node Alpine
packages/crawler/render.yaml          # Render cron blueprint
.env.production.example               # Checklist env vars
DEPLOY.md                            # File này
```
