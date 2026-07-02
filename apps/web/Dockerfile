FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate
WORKDIR /app

# ─── Dependencies ───────────────────────────────────────

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
RUN pnpm install --frozen-lockfile

# ─── Build ──────────────────────────────────────────────

FROM deps AS builder
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ARG CLERK_SECRET_KEY
ARG DATABASE_URL

RUN pnpm --filter "@ketryon/database" build
RUN pnpm --filter "web" build

# ─── Runner ─────────────────────────────────────────────

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app ./

EXPOSE 3000
ENV PORT=3000

CMD ["pnpm", "--filter", "web", "start"]
