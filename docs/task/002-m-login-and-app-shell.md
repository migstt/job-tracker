# Login and App Shell

> **ID:** 2-m
> **Status:** PLANNED
> **Priority:** HIGH
> **Type:** feature
> **Version Impact:** minor
> **Created:** Oct 12, 2026
> **Platform:** Web
> **Automation:** manual

## Overview

Add email and password login with Supabase Auth, and the layout every page will use: a header with the nav links, a sign out button, and a theme switch. Pages behind the login send you to `/login` if you are not signed in.

## Requirements

### Must Have
- [ ] `/login` page with email and password, clear error text when it fails
- [ ] Sign out
- [ ] All routes except `/login` need a signed-in user
- [ ] Header nav: Today, Applications, Skipped, Stats
- [ ] On a phone, the nav opens from a menu button (shadcn `Sheet`)
- [ ] Light and dark mode
- [ ] Empty placeholder pages for each nav link

### Nice to Have
- [ ] Sign up is turned off in Supabase, so only my account exists

## Current State

Default create-next-app home page. Supabase clients exist after task 1.

**Current Files:**
| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout |
| `src/app/page.tsx` | Default home page, to be replaced |
| `src/lib/supabase/server.ts` | Server client (from task 1) |

## Proposed Solution

Use route groups: `(auth)` for the login page and `(app)` for everything behind the login. The `(app)` layout checks the user on the server and redirects if there is none. A `proxy.ts` file refreshes the session cookie.

### Architecture

- Login and sign out are Server Actions.
- The auth check uses the server client, never a value read only from the cookie.
- UI follows the rules in `docs/PLAN.md`: flat, neutral, no gradients.

### File Changes

| Action | File | Description |
|--------|------|-------------|
| CREATE | `src/proxy.ts` | Refresh the Supabase session |
| CREATE | `src/app/(auth)/login/page.tsx` | Login form |
| CREATE | `src/app/(auth)/login/actions.ts` | `login` and `logout` actions |
| CREATE | `src/app/(app)/layout.tsx` | Auth check, header, main area |
| CREATE | `src/components/site-header.tsx` | Nav, mobile menu, sign out |
| CREATE | `src/components/theme-toggle.tsx` | Light and dark switch |
| CREATE | `src/app/(app)/page.tsx` | Today (placeholder) |
| CREATE | `src/app/(app)/applications/page.tsx` | Placeholder |
| CREATE | `src/app/(app)/skipped/page.tsx` | Placeholder |
| CREATE | `src/app/(app)/stats/page.tsx` | Placeholder |
| DELETE | `src/app/page.tsx` | Replaced by `(app)/page.tsx` |
| MODIFY | `src/app/layout.tsx` | Title, theme provider, toaster |

## Implementation Steps

### Step 1: Session refresh
Add `src/proxy.ts` using `@supabase/ssr`. Check the Next.js 16 docs for the proxy file name and API.

### Step 2: Login page and actions
Build the form with shadcn `Card`, `Input`, `Label`, `Button`. Show the error under the form.

### Step 3: App layout
Add the `(app)` layout with the auth check and the header.

### Step 4: Mobile nav and theme
Add the `Sheet` menu for small screens and the theme toggle.

## Testing Checklist

- [ ] Opening `/` while signed out goes to `/login`
- [ ] Wrong password shows an error and stays on `/login`
- [ ] Right password goes to `/`
- [ ] Sign out goes back to `/login`
- [ ] At 375px wide, the nav is a menu button and nothing scrolls sideways
- [ ] Tab key reaches every link and button

## Dependencies

- Required packages: `next-themes`
- Required APIs: Supabase Auth
- Blocked by: task 1

## Notes for Implementation Agent

- Load the `shadcn`, `supabase`, and `vercel-react-best-practices` skills first.
- Create my user by hand in the Supabase dashboard. Do not build a sign up page.

## Related

- Plan: [PLAN.md](../PLAN.md)
