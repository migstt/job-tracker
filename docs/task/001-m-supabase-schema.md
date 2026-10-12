# Supabase Project, Schema, and RLS

> **ID:** 1-m
> **Status:** IN PROGRESS (blocked on Step 1)
> **Priority:** HIGH
> **Type:** feature
> **Version Impact:** minor
> **Created:** Oct 12, 2026
> **Platform:** Web
> **Automation:** manual

## Overview

Connect the app to Supabase and create the four tables from `docs/PLAN.md`. The app is for many users. Turn on Row Level Security so each user can only read and change their own rows. The schema lives in SQL migration files in git.

## Requirements

### Must Have
- [ ] Supabase project created and linked with the Supabase CLI
- [ ] `.env.local` with the project URL and publishable key (`.env.example` is done)
- [x] Migration that creates `applications`, `stage_events`, `skipped_jobs`, `user_settings` and the `application_stage` enum
- [x] A `user_settings` row is made for each new user (trigger on `auth.users`), with 7 and 14 days as defaults
- [x] RLS on in all four tables, with select, insert, update, delete policies for the owner only
- [x] Index on every `user_id` and on `stage_events.application_id`
- [x] `updated_at` is set by a trigger on `applications`
- [x] Stage change adds a row to `stage_events` (database trigger)
- [ ] Generated TypeScript types in `src/lib/supabase/database.types.ts`
- [x] Server and browser Supabase clients in `src/lib/supabase/`

### Nice to Have
- [ ] `supabase/seed.sql` with a few fake rows for local work

## Current State

Fresh Next.js 16 project with shadcn/ui. No database code yet.

**Current Files:**
| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout from create-next-app |
| `src/app/page.tsx` | Default home page |
| `src/components/ui/*` | shadcn components |

## Proposed Solution

Use the Supabase CLI for migrations and `@supabase/ssr` for the clients. Keep the stage history in the database with a trigger, so the app cannot forget to log it.

### Architecture

- `bigint generated always as identity` for ids, `timestamptz` for times, `text` for strings.
- `user_id uuid not null default auth.uid() references auth.users on delete cascade`.
- Policies use `(select auth.uid()) = user_id` and are scoped `to authenticated`.
- No service role key in the app. The publishable key plus RLS is enough.

### File Changes

| Action | File | Description |
|--------|------|-------------|
| CREATE | `supabase/config.toml` | From `supabase init` |
| CREATE | `supabase/migrations/<timestamp>_init.sql` | Enum, tables, indexes, triggers, RLS |
| CREATE | `supabase/seed.sql` | Fake rows for local work |
| CREATE | `src/lib/supabase/server.ts` | Server client (cookies) |
| CREATE | `src/lib/supabase/client.ts` | Browser client |
| CREATE | `src/lib/supabase/database.types.ts` | Generated types |
| CREATE | `.env.example` | Names of the env vars, no values |
| MODIFY | `package.json` | Add `@supabase/supabase-js`, `@supabase/ssr`, `supabase` (dev), `db:types` script |

## Implementation Steps

### Step 1: Create the project (Miguel does this)
Create a project at supabase.com. Copy the project URL and the publishable key into `.env.local`. Run `pnpm dlx supabase login` and `pnpm dlx supabase link`.

### Step 2: Install packages
`pnpm add @supabase/supabase-js @supabase/ssr` and `pnpm add -D supabase`. Run `pnpm supabase init`.

### Step 3: Write the migration
`pnpm supabase migration new init`. Write the enum, the four tables, indexes, the new-user trigger, the `updated_at` trigger, the stage history trigger, and the RLS policies.

### Step 4: Push and check
`pnpm supabase db push`. Open the Supabase dashboard and check that RLS shows as on for all four tables. Run the security advisor.

### Step 5: Types and clients
Generate types with `supabase gen types typescript --linked`. Add the server and browser clients, typed with `Database`.

## Testing Checklist

- [ ] With no login, a select on `applications` returns zero rows
- [ ] User A cannot read, update, or delete a row owned by user B, in every table
- [ ] User A cannot insert a row with user B's `user_id`
- [ ] A new user gets one `user_settings` row
- [ ] Deleting a user deletes all their rows
- [ ] Changing `stage` adds one row to `stage_events` with the right from and to
- [ ] Updating a row changes `updated_at`
- [ ] `pnpm build` and `pnpm lint` pass

## Dependencies

- Required packages: `@supabase/supabase-js`, `@supabase/ssr`, `supabase` (dev)
- Required APIs: a Supabase project
- Blocked by: Miguel creating the Supabase project (Step 1)

## Notes for Implementation Agent

- Load the `supabase` and `supabase-postgres-best-practices` skills before writing SQL.
- Read `node_modules/next/dist/docs/` before writing Next.js code. This is Next.js 16 and some APIs changed.
- Docker is not installed on this machine, so there is no local Supabase. Work against the linked cloud project.

## Related

- Plan: [PLAN.md](../PLAN.md)

## Progress Notes (Oct 12)

Written and committed, but not yet run against a database:
- `supabase/migrations/20261012033743_init.sql`
- `src/lib/supabase/env.ts`, `server.ts`, `client.ts`
- `pnpm db:push` and `pnpm db:types` scripts

Still to do after the Supabase project exists:
1. `pnpm supabase login`, then `pnpm supabase link`
2. `pnpm db:push`, then run the security advisor
3. `pnpm db:types`, then add the `Database` type to both clients
4. Run the testing checklist

Changes from the plan:
- `user_settings` has no delete policy. The row is removed only when the user is deleted.
- The new-user trigger function is in a `private` schema, because it must be SECURITY DEFINER and should not be callable over the API.
- The tables have explicit grants for `authenticated` and none for `anon`.
- No `seed.sql` yet. Seed rows need a real user id, and there is no local database.
- Added `src/lib/supabase/env.ts`, so the env vars are read and checked in one place.
