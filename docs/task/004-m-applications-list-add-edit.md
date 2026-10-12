# Applications: List, Add, and Edit

> **ID:** 4-m
> **Status:** PLANNED
> **Priority:** HIGH
> **Type:** feature
> **Version Impact:** minor
> **Created:** Oct 12, 2026
> **Platform:** Web
> **Automation:** manual

## Overview

The core of the app: a page that lists my applications, a form to add one, and the same form to edit one. It uses the `applications` table from task 1 and the shared components from task 3. No schema change is needed.

## Requirements

### Must Have
- [ ] `/applications` lists the signed-in user's applications, newest first
- [ ] The list is a table from the `md` width up, and a list of cards on a phone
- [ ] Each row shows company, role, source, stage, applied date, and next step with its date
- [ ] Search by company or role, and a stage filter. Both live in the URL (`?q=` and `?stage=`), so a link or a reload keeps them
- [ ] Empty state with an "Add application" button when there are no rows, and a different one when a search finds nothing
- [ ] `/applications/new` has the add form
- [ ] `/applications/[id]/edit` has the same form, filled in
- [ ] Company and role are required. Every other field is optional
- [ ] All input is checked on the server with Zod. Errors show under the field
- [ ] After a save, go back to the list and show a toast
- [ ] Stages, their labels, and their badge style are defined once and used by the list, the form, and the login preview
- [ ] Stage badges are monochrome (see Architecture)
- [ ] An id that is not mine or does not exist shows the not found page
- [ ] `pnpm lint` and `pnpm build` pass

### Nice to Have
- [ ] Delete an application, with a confirm dialog
- [ ] `loading.tsx` for the list using shadcn `skeleton`
- [ ] `not-found.tsx` that uses `EmptyState`

## Current State

`/applications` is a placeholder page with an empty state. The `applications` table, its RLS policies, and the generated types exist. A database trigger writes to `stage_events` on every insert and stage change, so the app must not write stage history itself.

**Current Files:**
| File | Purpose |
|------|---------|
| `src/app/(app)/applications/page.tsx` | Placeholder page |
| `src/components/page-header.tsx` | Title, description, actions slot |
| `src/components/empty-state.tsx` | Icon, title, description, action |
| `src/components/submit-button.tsx` | Submit button with pending state |
| `src/features/auth/components/app-preview.tsx` | Login preview. Its stage names are plain text |
| `src/features/auth/queries.ts` | `getCurrentUser()` |
| `src/lib/supabase/server.ts` | `createClient()` for the server |
| `src/lib/supabase/database.types.ts` | Generated types, with the `application_stage` enum |
| `supabase/migrations/20261012033743_init.sql` | Table, checks, triggers, policies |

## Proposed Solution

### Architecture

- **Feature folder:** `src/features/applications/` with `queries.ts`, `actions.ts`, `schema.ts`, and `components/`. Pages stay thin.
- **Stages are shared, not owned by one feature.** The login preview (auth feature) also needs them, and a feature must not import another feature's files. So the stage list goes in `src/lib/stages.ts` and the badge in `src/components/stage-badge.tsx`.
- **Stage type comes from the database types** (`Database["public"]["Enums"]["application_stage"]`), not typed by hand. `stages.ts` uses a `Record<Stage, ...>` so a missing stage is a type error.
- **Monochrome badges.** Four looks, using only the shadcn `Badge` variants:

  | Stages | Look |
  |--------|------|
  | draft | `outline` with a dashed border |
  | applied, screening, technical, final | `secondary` (gray fill) |
  | offer | `default` (solid black, white in dark mode) |
  | rejected, no_reply | `outline` with muted text |

- **Search and filter on the server.** The page reads `searchParams` and passes `q` and `stage` to `listApplications()`. The filter controls are a small client component that updates the URL. Ignore a `stage` value that is not in the enum.
- **Form:** one `ApplicationForm` client component for add and edit. It uses `useActionState` with a Server Action that returns field errors. Build it with the shadcn `field` component (`FieldGroup`, `Field`, `FieldLabel`, `FieldError`).
- **Actions:** `createApplication` and `updateApplication`. Each one checks the user with `getCurrentUser()`, parses the form with the Zod schema, calls a query, then redirects. RLS is the second guard, not the only one.
- **Insert never sends `user_id`.** The column default is `auth.uid()`.
- **Edit page, not a dialog.** The form has about 18 fields. A full page works better on a phone and gives each application its own URL.

### Form fields

| Group | Fields |
|-------|--------|
| The job | company*, role*, source, job_url, remote, pay_text, pay_min_php, pay_max_php |
| My application | stage, applied_on, my_ask, resume_used, contact_name, message_sent |
| Next step | next_step, next_step_on |
| Notes | job_post, notes |

Rules for `schema.ts`:
- Trim text. Save an empty string as `null`.
- `job_url` must be an `http` or `https` URL when given.
- `pay_min_php` and `pay_max_php` are whole numbers, 0 or more, and min is not above max. The database has the same checks.
- `applied_on` is required when the stage is not `draft`.
- `stage` must be one of the enum values.

### File Changes

| Action | File | Description |
|--------|------|-------------|
| CREATE | `src/lib/stages.ts` | Stage type, order, labels, badge look |
| CREATE | `src/components/stage-badge.tsx` | `Badge` for one stage |
| CREATE | `src/lib/dates.ts` | Format a `date` column for display |
| CREATE | `src/features/applications/schema.ts` | Zod schema for the form |
| CREATE | `src/features/applications/queries.ts` | `listApplications`, `getApplication`, `insertApplication`, `updateApplicationRow` |
| CREATE | `src/features/applications/actions.ts` | `createApplication`, `updateApplication` |
| CREATE | `src/features/applications/components/application-list.tsx` | Table on wide screens, cards on a phone |
| CREATE | `src/features/applications/components/application-filters.tsx` | Search box and stage select (client) |
| CREATE | `src/features/applications/components/application-form.tsx` | Add and edit form (client) |
| CREATE | `src/app/(app)/applications/new/page.tsx` | Add page |
| CREATE | `src/app/(app)/applications/[id]/edit/page.tsx` | Edit page |
| MODIFY | `src/app/(app)/applications/page.tsx` | Real list |
| MODIFY | `src/features/auth/components/app-preview.tsx` | Use `StageBadge` |
| MODIFY | `package.json` | Add `zod` |

## Implementation Steps

### Step 1: Stages
Create `src/lib/stages.ts` and `StageBadge`. Use `StageBadge` in the login preview and change its fake rows to use stage keys.

### Step 2: Add what is missing
`pnpm add zod` and `pnpm dlx shadcn@latest add field`. Read the new `field.tsx` before using it.

### Step 3: Schema and queries
Write `schema.ts` and `queries.ts`. The list query selects only the columns the list shows. `getApplication(id)` returns `null` when there is no row.

### Step 4: Actions and form
Write the two actions and `ApplicationForm`. Use `SubmitButton`. Keep what the user typed when the server returns errors.

### Step 5: Pages
List page with `PageHeader` (the "Add application" button goes in `actions`), filters, list, and both empty states. Then the add and edit pages. Call `notFound()` when `getApplication` returns `null`.

### Step 6: Check
Run `pnpm lint` and `pnpm build`. Ask Miguel to add, edit, search, and filter in his browser, at phone and desktop width, in light and dark mode.

## Testing Checklist

- [ ] Add with only company and role works, and the row shows as Draft
- [ ] Add with an empty company shows an error under the field and keeps the other input
- [ ] Stage "Applied" with no applied date shows an error
- [ ] Pay min above pay max shows an error
- [ ] Edit changes the row, and a stage change adds one row to `stage_events`
- [ ] Search finds by company and by role, and the stage filter works with it
- [ ] `?stage=bad` does not break the page
- [ ] `/applications/999999/edit` shows not found
- [ ] A second user sees none of the first user's rows and gets not found on their edit URL
- [ ] At 375px the list is cards and nothing scrolls sideways
- [ ] The form works with the keyboard only, and every field has a label
- [ ] Light and dark mode both look right

## Dependencies

- Required packages: `zod`, shadcn `field`
- Required APIs: none
- Blocked by: nothing. Task 3 is coded, its look is still to be checked by Miguel

## Notes for Implementation Agent

- Load the `shadcn`, `supabase`, and `vercel-react-best-practices` skills.
- Read `AGENTS.md`: this is Next.js 16 with Cache Components on. Check `node_modules/next/dist/docs/` for `searchParams`, `params`, `useActionState` forms, and `notFound` before writing the pages. `params` and `searchParams` are promises.
- The `(app)` layout already sets `instant = false` and checks the user. Still check the user inside every action.
- shadcn here is built on Base UI. Compose with `render`, not `asChild`. `SelectItem` goes inside `SelectGroup`.
- One Supabase project is used for dev and prod. This task has no migration. Do not add test rows with real company names, contacts, or pay.
- The repo is public. Placeholders and examples in the form must be made up.
- There is no test runner yet, so no unit tests in this task. Vitest comes with the follow-up rules in task 6.
- Do not build the detail page or the stage history view. That is task 5.

## Related

- Plan: [PLAN.md](../PLAN.md)
- Previous task: [003-m-ui-foundation.md](003-m-ui-foundation.md)
