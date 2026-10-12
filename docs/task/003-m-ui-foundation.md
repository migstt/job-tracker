# UI Foundation: Wider Layout and Reusable Components

> **ID:** 3-m
> **Status:** TESTING
> **Completed:** Oct 12, 2026
> **Implementation Notes:** Lint and build pass. Nobody has looked at the pages in a browser yet. Check the width, the tooltips, the avatar, and the new login page in light and dark mode.
> **Priority:** HIGH
> **Type:** enhancement
> **Version Impact:** patch
> **Created:** Oct 12, 2026
> **Platform:** Web
> **Automation:** manual

## Overview

The pages have too much empty space on the left and right. Fix the page width, and build the small set of shared components that every later page will use, so no page repeats layout or markup. Use shadcn components wherever one fits, before writing custom markup.

This task comes before the applications list, so that list is built on the shared parts from the start.

## Requirements

### Must Have
- [x] Less side space: the content area is wider on desktop and keeps a small gutter on phones
- [x] The page width and gutter are defined in one place and used by the header and the main area
- [x] `PageContainer` component for the shared width and gutter
- [x] `PageHeader` takes a title, an optional description, and an optional actions slot (for buttons like "Add application")
- [x] `EmptyState` component, built on the shadcn `empty` component, used by every placeholder page
- [x] `SubmitButton` component with a pending state, used by the Google sign in form
- [x] Sign in error uses the shadcn `alert` component
- [x] User menu shows the shadcn `avatar` with the user's initials, not a plain icon
- [x] Icon-only buttons (theme switch, menu, account) have a shadcn `tooltip`
- [x] No class string for layout is copied between two files
- [ ] Looks right at 375px, 768px, and 1440px, in light and dark mode

### Added on Oct 12 (asked by Miguel at /implement)
- [x] Login page has two parts: a preview with sample data on the left, sign in on the right, with a color change between them
- [x] The site is monochrome: black, white, and grays only

### Nice to Have
- [ ] `loading.tsx` for the `(app)` group using shadcn `skeleton`
- [ ] `not-found.tsx` that uses `EmptyState`

## Current State

Tasks 1 and 2 are done. Sign in and sign out with Google work. The five pages behind the login are placeholders with only a title.

Miguel's feedback on Oct 12, after seeing the app:
- "side spaces are too much, lets lessen it"
- "DRY for components, if possible create reusable things"
- "make use of all shadcn components"

**Current Files:**
| File | Purpose |
|------|---------|
| `src/app/(app)/layout.tsx` | Auth check, header, main. Has `mx-auto max-w-5xl px-4` |
| `src/components/site-header.tsx` | Header. Repeats `mx-auto max-w-5xl px-4` |
| `src/components/page-header.tsx` | Title and description only |
| `src/components/user-menu.tsx` | Account menu with a plain user icon |
| `src/components/theme-toggle.tsx` | Icon button, no tooltip |
| `src/components/mobile-nav.tsx` | Phone menu in a `Sheet` |
| `src/features/auth/components/google-sign-in-button.tsx` | Has its own pending button |
| `src/app/(auth)/login/page.tsx` | Error is a plain `<p>` |
| `src/app/(app)/*/page.tsx` | Five placeholder pages |

## Proposed Solution

### Architecture

- **Width:** `max-w-5xl` (1024px) is the cause of the side space. Use `max-w-7xl` (1280px) with `px-4` on phones and `px-6` from `md` up. Check it in the browser with Miguel before going further, because "too much" is his call.
- **One source for the width:** `PageContainer` holds the width and gutter classes. The header and the main area both use it.
- **Shared components live in `src/components/`.** Feature-only components stay in `src/features/<name>/components/`.
- **shadcn first:** before writing markup, check if a shadcn component does the job. "Use all shadcn components" is read here as "prefer a shadcn component every time one fits", not "add every component in the registry". Ask Miguel if he meant something else.
- **Small props:** each shared component takes only what it shows. No "variant" options that nothing uses yet.

### File Changes

| Action | File | Description |
|--------|------|-------------|
| CREATE | `src/components/page-container.tsx` | Width and gutter, defined once |
| CREATE | `src/components/empty-state.tsx` | Icon, title, description, optional action |
| CREATE | `src/components/submit-button.tsx` | Button with `useFormStatus` pending state |
| CREATE | `src/components/user-avatar.tsx` | Avatar with initials from name or email |
| CREATE | `src/components/icon-button.tsx` | Icon button with a tooltip and an accessible label |
| CREATE | `src/lib/initials.ts` | Pure function: name or email to initials, with a test later |
| CREATE | `src/app/(app)/loading.tsx` | Skeleton while a page loads (nice to have) |
| MODIFY | `src/components/page-header.tsx` | Add the actions slot |
| MODIFY | `src/components/site-header.tsx` | Use `PageContainer` |
| MODIFY | `src/app/(app)/layout.tsx` | Use `PageContainer` |
| MODIFY | `src/components/user-menu.tsx` | Use `UserAvatar` |
| MODIFY | `src/components/theme-toggle.tsx` | Use `IconButton` |
| MODIFY | `src/components/mobile-nav.tsx` | Use `IconButton` for the trigger |
| MODIFY | `src/features/auth/components/google-sign-in-button.tsx` | Use `SubmitButton` |
| MODIFY | `src/app/(auth)/login/page.tsx` | Use `Alert` for the error |
| MODIFY | `src/app/(app)/*/page.tsx` | Use `EmptyState` |
| MODIFY | `src/app/layout.tsx` | Add `TooltipProvider` if the tooltip needs one |

## Implementation Steps

### Step 1: Add the shadcn components
`pnpm dlx shadcn@latest add avatar tooltip alert empty`. Read each new file to learn its parts before using it.

### Step 2: Page width
Create `PageContainer`, use it in the header and the `(app)` layout, and remove the copied classes. Ask Miguel to look at it in the browser.

### Step 3: Shared components
Build `PageHeader` actions slot, `EmptyState`, `SubmitButton`, `UserAvatar`, `IconButton`.

### Step 4: Use them
Update the header, user menu, theme switch, phone menu, sign in button, login page, and the five placeholder pages.

### Step 5: Check for repeats
Search for layout class strings that appear in more than one file. Search for raw `<button>` and hand-made cards or alerts that a shadcn component could replace.

## Testing Checklist

- [ ] At 1440px, the content is clearly wider than before
- [ ] At 375px, there is a small gutter and nothing scrolls sideways
- [ ] Header and page content line up on the left and right edges
- [ ] The user menu shows initials in an avatar
- [ ] Tooltips show on hover and on keyboard focus
- [ ] The Google button still shows "Opening Google…" while it loads
- [ ] A cancelled sign in shows the error in an alert
- [ ] Every placeholder page shows the empty state
- [ ] Light and dark mode both look right
- [ ] `pnpm lint` and `pnpm build` pass

## Deviations

- `loading.tsx` and `not-found.tsx` (nice to have) were not built.
- No test for `initials.ts` yet. The project has no test runner.
- The login preview is `src/features/auth/components/app-preview.tsx`. Its stage names are plain text. Move them to the shared stage list when task 4 adds it.
- Added the shadcn `spinner` for the pending state of `SubmitButton`.
- The Google logo keeps its own colors. The `destructive` (red) theme token is still defined but nothing uses it.

## Dependencies

- Required packages: none new, only shadcn components
- Required APIs: none
- Blocked by: nothing

## Notes for Implementation Agent

- Load the `shadcn` skill first, and `vercel-react-best-practices`.
- This project's shadcn style is `base-nova`, built on Base UI. Compose with the `render` prop, for example `<SheetTrigger render={<Button />}>`. There is no `asChild`.
- `DropdownMenuLabel` must be inside a `DropdownMenuGroup`.
- Follow the Structure, Clean code, and UI rules in `CLAUDE.md`. Flat, no gradients, no heavy shadows.
- Do not build the applications list here. That is the next task.
- Miguel checks the look in his own browser at `http://localhost:3000`. Ask him to look after Step 2.

## Related

- Plan: [PLAN.md](../PLAN.md)
- Previous task: [002-m-login-and-app-shell.md](002-m-login-and-app-shell.md)
