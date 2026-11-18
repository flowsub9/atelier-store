# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Next.js version warning

`AGENTS.md` says this Next.js (16.x, React 19) has breaking changes vs. training data. Before writing Next code, read the relevant guide in `node_modules/next/dist/docs/` (`01-app`, `02-pages`, `03-architecture`). `next.config.ts` enables `cacheComponents` and `partialPrefetching` — check docs for how these affect data fetching/caching.

## Commands

Package manager: pnpm. Never use npm or create package-lock.json.

- `pnpm dev` — dev server (http://localhost:3000)
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm lint` — ESLint (flat config, `eslint.config.mjs`)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm db:generate` — generate Drizzle SQL migrations into `./drizzle`
- `pnpm db:migrate` — apply migrations
- `pnpm db:push` — push schema directly (no migration files)
- `pnpm db:studio` — Drizzle Studio
- `pnpm db:seed` — seed categories, products and stock (dev only; re-running resets stock quantities)
No test runner configured.

## Environment

Copy `.env.example` to `.env.local`. Needs `DATABASE_URL` (Neon Postgres), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`. `src/db/index.ts` throws at import if `DATABASE_URL` is unset; `drizzle.config.ts` loads `.env.local` then `.env`.

## Architecture

- **Stack**: Next.js App Router in `src/app`, Tailwind v4 via `@tailwindcss/turbopack` loader (configured in `next.config.ts`, not PostCSS), path alias `@/` → `src/`.
- **DB**: `src/db/index.ts` exports a Drizzle client over Neon's serverless HTTP driver (`drizzle-orm/neon-http`) with `schema` from `src/db/schema.ts`.
  - Conventions: write schema fields in camelCase; `casing: "snake_case"` (set in both `drizzle.config.ts` and the client in `src/db/index.ts`, keep them in sync) maps them to snake_case columns. Money is stored as integer cents. Stock lives in its own 1:1 `stock` table, not a column on `products`. Schema changes go through `db:generate` + `db:migrate` (committed SQL in `./drizzle`), not `db:push`. neon-http has no transactions, so use single atomic statements or switch driver.
- **Auth**: Better Auth with email/password. `src/lib/auth.ts` is the server instance (Drizzle adapter, `provider: "pg"`); mounted via `src/app/api/auth/[...all]/route.ts`; `src/lib/auth-client.ts` is the React client.
  - Better Auth needs its tables (user, session, account, verification) in `src/db/schema.ts`. Not there yet — generate with the Better Auth CLI (`npx @better-auth/cli generate`) and add to schema, then run `db:generate`/`db:migrate` (or `db:push`).

## Notes

- `app.log` is a stray untracked log file, not app output to rely on.
