@AGENTS.md

# Job Tracker

A web app to track my job applications. It knows my follow-up rules and shows what to do today. It is also my learning project, so explain choices that are not obvious and keep the code easy to read.

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
- Docker is not installed here. Work against the linked cloud project.

## UI rules

- Simple and flat. No gradients, no heavy shadows, no animations for show.
- Neutral colors. Use color only for stage badges and overdue items.
- Must work at 375px wide. Tables become a list of cards on small screens.
- Every field has a label. Every page works with the keyboard.
- Light and dark mode both look right.

## Privacy

- This repo is public. Never commit real application data, company contact names, or pay I asked for.
- Seed and demo data must be fake.
- Never commit `.env.local`.

## Commits

- One-line commit message. No body, no author line, no `Co-Authored-By`.
