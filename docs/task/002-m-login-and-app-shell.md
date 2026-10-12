# Sign In and App Shell

> **ID:** 2-m
> **Status:** TESTING
> **Completed:** Oct 12, 2026
> **Implementation Notes:** The code is done and the redirects work. The Google sign in itself is not tested, because the Google provider was still off in Supabase.
> **Priority:** HIGH
> **Type:** feature
> **Version Impact:** minor
> **Created:** Oct 12, 2026
> **Platform:** Web
> **Automation:** manual

## Overview

Let anyone sign in with Google through Supabase Auth. Add the layout every page will use: a header with the nav links, the user menu, and a theme switch. Pages behind the login send you to `/login` if you are not signed in.

## Requirements

### Must Have
- [x] `/login` page with one button: "Continue with Google"
- [x] `/auth/callback` route that finishes the sign in and goes to `/`
- [x] Clear error text on `/login` when sign in fails or is cancelled
- [x] Sign out
- [x] All routes except `/login` and `/auth/callback` need a signed-in user
- [x] Header nav: Today, Applications, Skipped, Stats
- [x] User menu with name or email, Settings link, and Sign out
- [x] On a phone, the nav opens from a menu button (shadcn `Sheet`)
- [x] Light and dark mode
- [x] Empty placeholder pages for each nav link

### Nice to Have
- [x] Short line on `/login` that says what the app does

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

Google is the only way to sign in. There is no email and password login, so there is no sign-up form, no password reset, and no confirmation email.

### Architecture

- Sign in and sign out are Server Actions in `src/features/auth/actions.ts`.
- Sign in calls `signInWithOAuth` and redirects to Google. Google sends the user back to `/auth/callback`, which swaps the code for a session.
- The redirect target after sign in is always a path inside this app. Never trust a full URL from the query string.
- The auth check uses the server client, never a value read only from the cookie.
- UI follows the rules in `docs/PLAN.md`: flat, neutral, no gradients.

### File Changes

| Action | File | Description |
|--------|------|-------------|
| CREATE | `src/proxy.ts` | Refresh the Supabase session |
| CREATE | `src/features/auth/actions.ts` | `signInWithGoogle` and `signOut` actions |
| CREATE | `src/features/auth/components/google-sign-in-button.tsx` | The sign in button |
| CREATE | `src/features/auth/queries.ts` | `getUser()` for layouts and actions |
| CREATE | `src/app/(auth)/login/page.tsx` | Login page |
| CREATE | `src/app/auth/callback/route.ts` | Finish the OAuth sign in |
| CREATE | `src/app/(app)/layout.tsx` | Auth check, header, main area |
| CREATE | `src/components/site-header.tsx` | Nav, mobile menu |
| CREATE | `src/components/user-menu.tsx` | Name, Settings link, Sign out |
| CREATE | `src/components/theme-toggle.tsx` | Light and dark switch |
| CREATE | `src/lib/nav.ts` | The nav links, defined once |
| CREATE | `src/app/(app)/page.tsx` | Today (placeholder) |
| CREATE | `src/app/(app)/applications/page.tsx` | Placeholder |
| CREATE | `src/app/(app)/skipped/page.tsx` | Placeholder |
| CREATE | `src/app/(app)/stats/page.tsx` | Placeholder |
| DELETE | `src/app/page.tsx` | Replaced by `(app)/page.tsx` |
| MODIFY | `src/app/layout.tsx` | Title, theme provider, toaster |
| MODIFY | `.env.example` | Add `NEXT_PUBLIC_SITE_URL` |

## Implementation Steps

### Step 1: Set up Google sign in (Miguel does this)
- Google Cloud Console → Credentials → OAuth client ID (Web). Use the callback URL shown in Supabase.
- Supabase dashboard → Authentication → Providers: turn on Google, paste the client ID and secret.
- Supabase dashboard → Authentication → URL Configuration: add `http://localhost:3000/auth/callback` to the redirect URLs.

### Step 2: Session refresh
Add `src/proxy.ts` using `@supabase/ssr`. Check the Next.js 16 docs for the proxy file name and API.

### Step 3: Sign in, callback, sign out
Add the actions, the callback route, and the login page with shadcn `Card` and `Button`.

### Step 4: App layout
Add the `(app)` layout with the auth check, header, and user menu.

### Step 5: Mobile nav and theme
Add the `Sheet` menu for small screens and the theme toggle.

## Testing Checklist

- [ ] Opening `/` while signed out goes to `/login`
- [ ] Google sign in ends on `/` with my name in the user menu
- [ ] Cancelling at Google shows an error on `/login`
- [ ] A first-time user gets a `user_settings` row
- [ ] A second account sees none of the first account's data
- [ ] Sign out goes back to `/login`
- [ ] At 375px wide, the nav is a menu button and nothing scrolls sideways
- [ ] Tab key reaches every link and button

## Dependencies

- Required packages: `next-themes`
- Required APIs: Supabase Auth, a Google OAuth client
- Blocked by: task 1, and Step 1 above

## Notes for Implementation Agent

- Load the `shadcn`, `supabase`, and `vercel-react-best-practices` skills first.
- Follow the Structure section in `CLAUDE.md`.
- Google only. Do not build email and password login or other providers.
- Production redirect URLs are added in the deploy task.

## Related

- Plan: [PLAN.md](../PLAN.md)

## Implementation Notes (Oct 12)

Checked on the dev server, signed out:
- `/`, `/applications`, and `/settings` redirect to `/login`
- `/login` shows the "Continue with Google" button
- `/auth/callback` with no code goes to `/login?error=failed`
- `/auth/callback?error=access_denied` goes to `/login?error=cancelled` and the page shows the message
- `pnpm lint` and `pnpm build` pass

Not checked yet (needs the Google provider turned on in Supabase):
- The full Google sign in, the user menu, and sign out
- A first-time user getting a `user_settings` row through a real sign in
- The layout at 375px and keyboard use, in a browser

Changes from the plan:
- This project has Cache Components on. A page that reads cookies cannot be prerendered, so the `(app)` layout and the login page set `export const instant = false`. Later, the header can stay static and only the user menu can stream in.
- Added `/settings` as a placeholder, because the user menu links to it.
- Added `src/lib/supabase/proxy.ts` (session refresh logic), `src/lib/site.ts` (name, description, URL), `src/features/auth/errors.ts` (error codes and text), `src/components/nav-links.tsx`, `mobile-nav.tsx`, `theme-provider.tsx`, and `page-header.tsx`.
- The callback takes no "next" URL at all. It always goes to `/`.
- `NEXT_PUBLIC_SITE_URL` is optional and defaults to `http://localhost:3000`.
