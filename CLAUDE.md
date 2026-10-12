@AGENTS.md

# Job Tracker

A web app to track job applications. It knows your follow-up rules and shows what to do today. Anyone can sign in with Google, and each user sees only their own data. It is also my learning project, so explain choices that are not obvious and keep the code easy to read.

Read `docs/PLAN.md` first. It has the pages, data model, UI rules, and build order.

## Stack

- Next.js 16, App Router, TypeScript, `src/` folder, `@/*` import alias
- shadcn/ui (style `base-nova`, built on Base UI, not Radix) with Tailwind 4
- Supabase: Postgres, Auth, Row Level Security
- pnpm

## Commands

- `pnpm dev` starts the dev server
- `pnpm lint` and `pnpm build` must both pass before a task is done
- `pnpm dlx shadcn@latest add <name>` adds a UI component

## Workflow

- Work is tracked in `TASKS.md`. Each task has a doc in `docs/task/`.
- Flow: `/task` → `/implement` → `/test` → `/document` → `/ship`.
- One task at a time. Do not build things that are not in the task doc.

## Structure

Code is grouped by feature. Each layer has one job, and a layer only calls the layer below it.

```
src/
  app/                    routes only: pages, layouts, loading and error files
  features/<name>/        one folder per feature (applications, today, stats, ...)
    components/           UI for this feature
    actions.ts            Server Actions: check user, check input, call queries
    queries.ts            all Supabase reads and writes for this feature
    schema.ts             Zod schemas, shared by forms and actions
    rules.ts              plain functions with no database or React (follow-up rules, pay math)
    rules.test.ts         unit tests for the rules
  components/             shared app components (header, page title, empty state)
  components/ui/          shadcn components
  lib/                    shared helpers (supabase clients, dates, formatting)
```

- Pages stay thin: get data from `queries.ts`, pass it to components.
- Components never call Supabase. Only `queries.ts` does.
- Business rules live in `rules.ts` as pure functions, so they are easy to test.
- A feature does not import from another feature's inner files. Shared code moves to `lib/` or `components/`.

## Clean code

- One job per file and per function. If a name needs "and", split it.
- Do not repeat yourself, but wait for the third copy before making a shared helper. Two similar things are often not the same thing.
- One source of truth: stages, their labels, and their badge colors are defined once and imported everywhere. Types come from the database types and Zod schemas, not written by hand twice.
- Depend on small inputs. A function takes the fields it needs, not a whole Supabase client or a whole row when one date is enough.
- Add to the code by adding a new file or case, not by editing many old ones.
- Clear names over comments. Comment only the "why".
- No dead code, no unused exports, no options nobody uses yet.

## Code rules

- Server Components by default. Add `"use client"` only when a component needs state or browser APIs.
- Change data with Server Actions. Check the user inside every action.
- Check all form input on the server.
- Use the generated types in `src/lib/supabase/database.types.ts`. No `any`.
- Do not edit files in `src/components/ui/` by hand unless needed. Build app components in `src/components/`.
- Skills to load when they fit: `shadcn`, `supabase`, `supabase-postgres-best-practices`, `vercel-react-best-practices`.

## Database rules

- Every schema change is a new file in `supabase/migrations/`. Never change the schema only in the dashboard.
- Every table has `user_id` and RLS turned on, with policies for the owner only.
- Never use the service role key in the app.
- Other people's private data is in this database. Every new table needs RLS tests for a second user.
- Docker is not installed here. Work against the linked cloud project.

## UI rules

- Simple and flat. No gradients, no heavy shadows, no animations for show.
- Neutral colors. Use color only for stage badges and overdue items.
- Must work at 375px wide. Tables become a list of cards on small screens.
- Every field has a label. Every page works with the keyboard.
- Light and dark mode both look right.
- Use a shadcn component when one fits, before writing custom markup.
- Keep side space small. The page width and gutter are defined once and shared by the header and the pages.
- Build shared components for anything used on more than one page (page header, empty state, submit button, and so on).

## Things that are easy to get wrong

- **Cache Components is on** (`cacheComponents: true` in `next.config.ts`). A page or layout that reads cookies cannot be prerendered. The `(app)` layout and the login page set `export const instant = false` for this.
- **`createClient()` on the server calls `await connection()` first.** Without it, Next.js reports a `Date.now()` error from the Supabase client.
- **shadcn here is built on Base UI, not Radix.** Compose with the `render` prop, for example `<SheetTrigger render={<Button />}>`. There is no `asChild`. `DropdownMenuLabel` must be inside a `DropdownMenuGroup`.
- **Auth checks use `getCurrentUser()`** from `src/features/auth/queries.ts`. It uses `getClaims()`, which verifies the token. Never use `getSession()` on the server.
- **One Supabase project is used for both dev and prod.** A migration hits real data. Test SQL inside a transaction that rolls back.
- **`pnpm supabase migration new <name>` waits for input** when run without a terminal. Add `</dev/null`.
- **The dev server log is at `.next/dev/logs/next-development.log`.** Read it to see server and browser errors.

## Privacy

- This repo is public. Never commit real application data, company contact names, or pay I asked for.
- Seed and demo data must be fake.
- Never commit `.env.local`.

## Commits

- One-line commit message. No body, no author line, no `Co-Authored-By`.
