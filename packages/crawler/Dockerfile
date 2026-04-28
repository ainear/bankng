FROM mcr.microsoft.com/playwright:v1.56.1-jammy

# Already has: Node 18+, Chromium, ffmpeg, fonts

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/crawler/package.json ./packages/crawler/
COPY packages/db ./packages/db
COPY packages/auth ./packages/auth
COPY packages/shared-types ./packages/shared-types
COPY packages/shared-utils ./packages/shared-utils

# Install dependencies (includes @prisma/client, playwright)
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm -F @bankng/db prisma generate --schema packages/db/prisma/schema.prisma

# Copy crawler source
COPY packages/crawler/src ./packages/crawler/src

ENV NODE_ENV=production
ENV DATABASE_URL=

# One-shot crawl on container start
CMD ["pnpm", "--filter", "@bankng/crawler", "start"]
