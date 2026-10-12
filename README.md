# Template Monorepo

A pnpm-workspace starter for a SaaS-style product: a Next.js web app, an Express API and an Inngest background worker, with a shared Drizzle/PostgreSQL schema package.

## Structure

```
apps/
  web/        Next.js 15 frontend          (port 3000)
  backend/    Express 5 API server         (port 3001)
  worker/     Inngest background jobs      (port 3005)

packages/
  database/   Shared Drizzle ORM schema, types and db client (@ketryon/database)
```

## What's included

- **Web**: Clerk sign-in/sign-up pages and middleware protecting non-public routes, a dashboard page, privacy and terms pages, light/dark theme (`next-themes`) with a sage oklch palette in Tailwind CSS 4, a small `api-client` for calling the backend, security headers in `next.config.ts`, and stub webhook routes for Clerk and Stripe.
- **Backend**: Express 5 with CORS, Clerk middleware, a Redis-backed rate limiter (500 req/min on `/api`), Zod validation helpers, a health route, an example `items` CRUD route, and a Clerk webhook that syncs users into the database. The Stripe webhook is a stub with TODOs.
- **Worker**: an Inngest `serve` endpoint at `/api/inngest` with two example functions — a 3-step `item/process` event handler and a daily cleanup cron.
- **Database**: `users` (synced from Clerk, with a free/premium membership enum) and `items` tables, a drizzle-kit config and a seed script.
- **Docker**: a multi-stage Dockerfile per app.

Webhook signature verification (Svix/Stripe) is left as TODOs.

## Stack

Next.js 15, React 19, Tailwind CSS 4, Clerk, Express 5, ioredis, Zod, Inngest, PostgreSQL, Drizzle ORM, TypeScript (strict), pnpm workspaces. The web app also ships ESLint and Prettier configs.

## Getting started

Requires Node.js, pnpm 10, PostgreSQL and Redis.

```bash
pnpm install
cp .env.example .env

# The backend imports the compiled @ketryon/database package, so build it once
pnpm --filter @ketryon/database build

# Generate and apply migrations
pnpm --filter @ketryon/database db:generate
pnpm --filter @ketryon/database db:migrate

# Start each app (separate terminals)
pnpm --filter web dev
pnpm --filter backend dev
pnpm --filter worker dev
```

Run the [Inngest dev server](https://www.inngest.com/docs/local-development) (`npx inngest-cli@latest dev -u http://localhost:3005/api/inngest`) to trigger worker functions locally.

## Environment variables

[.env.example](.env.example) lists them. The ones the code reads today:

| Variable | Used by |
|----------|---------|
| `DATABASE_URL` | database package, drizzle-kit, seed |
| `REDIS_URL` | backend rate limiter |
| `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk SDKs (web + backend) |
| `CORS_ORIGINS` | backend CORS allow-list (comma-separated) |
| `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL` | web |
| `PORT` | backend / worker |

The Stripe, AWS S3, Inngest keys, `CLERK_WEBHOOK_SECRET` and `OPENAI_API_KEY` entries are placeholders for features you wire up yourself.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages and apps |
| `pnpm clean` | Remove all `dist` and `.next` directories |
| `pnpm --filter web dev` | Start web app (port 3000) |
| `pnpm --filter backend dev` | Start backend API (port 3001) |
| `pnpm --filter worker dev` | Start Inngest worker (port 3005) |
| `pnpm --filter @ketryon/database build` | Compile the shared database package |
| `pnpm --filter @ketryon/database db:generate` | Generate migrations from schema changes |
| `pnpm --filter @ketryon/database db:migrate` | Apply migrations |
| `pnpm --filter @ketryon/database db:push` | Push the schema directly (no migration files) |
| `pnpm --filter @ketryon/database db:studio` | Open Drizzle Studio |
| `pnpm --filter @ketryon/database db:seed` | Run the seed script |

## Docker

Each app has its own multi-stage Dockerfile. Build from the repo root so workspace dependencies resolve:

```bash
docker build -f apps/backend/Dockerfile -t backend .
docker build -f apps/web/Dockerfile -t web .
docker build -f apps/worker/Dockerfile -t worker .
```

## Adding a new app

1. Create a directory under `apps/`
2. Add `"@ketryon/database": "workspace:*"` to its dependencies if it needs the shared schema
3. Run `pnpm install` from the root
4. Build the database package: `pnpm --filter @ketryon/database build`

## Built by Ketryon

Built and used by [Ketryon](https://www.ketryon.com) — a developer on subscription for founders.

## License

MIT — see [LICENSE](LICENSE).
