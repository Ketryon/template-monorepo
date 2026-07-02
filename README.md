# Template Monorepo

Ketryon monorepo template — Next.js web + Express backend + Inngest worker with a shared database package.

## Structure

```
apps/
  web/        Next.js 15 frontend          (port 3000)
  backend/    Express 5 API server         (port 3001)
  worker/     Inngest background jobs      (port 3005)

packages/
  database/   Shared Drizzle ORM schema & types (@ketryon/database)
```

## Stack

- **Web**: Next.js 15, React 19, Tailwind CSS 4, Clerk auth, sage design system
- **Backend**: Express 5, Clerk JWT, Redis rate limiting, Zod validation
- **Worker**: Inngest step functions, cron jobs
- **Database**: PostgreSQL, Drizzle ORM, shared across apps via `@ketryon/database`
- **Tooling**: pnpm workspaces, TypeScript strict, Husky, ESLint, Prettier

## Getting started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Generate and run database migrations
pnpm --filter @ketryon/database db:generate
pnpm --filter @ketryon/database db:migrate

# Start all apps in development
pnpm --filter web dev
pnpm --filter backend dev
pnpm --filter worker dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages and apps |
| `pnpm clean` | Remove all dist and .next directories |
| `pnpm --filter web dev` | Start web app (port 3000) |
| `pnpm --filter backend dev` | Start backend API (port 3001) |
| `pnpm --filter worker dev` | Start Inngest worker (port 3005) |
| `pnpm --filter @ketryon/database db:generate` | Generate migrations from schema changes |
| `pnpm --filter @ketryon/database db:migrate` | Apply migrations |
| `pnpm --filter @ketryon/database db:studio` | Open Drizzle Studio |
| `pnpm --filter @ketryon/database db:seed` | Seed the database |

## Environment variables

See [.env.example](.env.example) for all required variables (database, Redis, Clerk, Stripe, S3, Inngest).

## Docker

Each app has its own multi-stage Dockerfile. Builds run from the repo root so workspace dependencies resolve correctly:

```bash
docker build -f apps/backend/Dockerfile -t backend .
docker build -f apps/web/Dockerfile -t web .
docker build -f apps/worker/Dockerfile -t worker .
```

## Adding a new app

1. Create a directory under `apps/`
2. Add `"@ketryon/database": "workspace:*"` to its dependencies if it needs the shared schema
3. Run `pnpm install` from the root
4. Build the database package first: `pnpm --filter @ketryon/database build`
