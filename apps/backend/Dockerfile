FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate
WORKDIR /app

# ─── Dependencies ───────────────────────────────────────

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/database/package.json ./packages/database/
RUN pnpm install --frozen-lockfile

# ─── Build ──────────────────────────────────────────────

FROM deps AS builder
COPY packages/ ./packages/
COPY apps/backend/ ./apps/backend/

RUN pnpm --filter "@ketryon/database" build
RUN pnpm --filter "backend" build

# ─── Runner ─────────────────────────────────────────────

FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser
USER appuser

COPY --from=builder --chown=appuser:nodejs /app ./

EXPOSE 8080
ENV PORT=8080

CMD ["pnpm", "--filter", "backend", "start"]
