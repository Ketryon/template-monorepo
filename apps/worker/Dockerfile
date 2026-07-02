FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate
WORKDIR /app

# ─── Dependencies ───────────────────────────────────────

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/worker/package.json ./apps/worker/
RUN pnpm install --frozen-lockfile

# ─── Build ──────────────────────────────────────────────

FROM deps AS builder
COPY apps/worker/ ./apps/worker/
RUN pnpm --filter "worker" build

# ─── Runner ─────────────────────────────────────────────

FROM base AS runner
ENV NODE_ENV=production

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 appuser
USER appuser

COPY --from=builder --chown=appuser:nodejs /app ./

EXPOSE 3005
ENV PORT=3005

CMD ["node", "apps/worker/dist/index.js"]
