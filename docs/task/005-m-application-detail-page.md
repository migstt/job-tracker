# Application Detail Page with Stage History

> **ID:** 5-m
> **Status:** TESTING
> **Completed:** Oct 12, 2026
> **Implementation Notes:** Lint and build pass. Nobody has opened, edited, or deleted an application in a browser yet, and the second-user check was not done.
> **Priority:** HIGH
> **Type:** feature
> **Version Impact:** minor
> **Created:** Oct 12, 2026
> **Platform:** Web
> **Automation:** manual

## Overview

One page per application at `/applications/[id]`. It shows everything saved about the job, the message I sent, and how the stage changed over time. From here I can edit or delete the application. No schema change is needed: the `stage_events` rows are already written by a database trigger.

## Requirements

### Must Have
- [x] `/applications/[id]` shows company, role, stage, and every saved field
- [x] Long text (job post, message sent, notes) keeps its line breaks. A section with no text is not shown
- [x] The job link opens in a new tab, and only when it starts with `http` or `https`
- [x] Stage history lists every stage change with its date, oldest first
- [x] "Edit" button goes to the edit form. After a save or a cancel, the form comes back to this page
- [x] "Delete" button asks to confirm in a shadcn `alert-dialog`, then deletes and goes to the list with a toast
- [x] In the list, the company name links to this page
- [x] An id that is not mine or does not exist shows the not found page
- [ ] Works at 375px, with the keyboard, in light and dark mode
- [x] `pnpm lint` and `pnpm build` pass

### Nice to Have
- [ ] Change the stage from this page without opening the full form
- [ ] Add a note or a different date to a stage change

## Current State

Task 4 added the list, the add form, and the edit form at `/applications/[id]/edit`. The company name in the list links to the edit form. There is no way to delete an application.

**Current Files:**
| File | Purpose |
|------|---------|
| `src/features/applications/queries.ts` | List, get, insert, update |
| `src/features/applications/actions.ts` | `createApplication`, `updateApplication` |
| `src/features/applications/components/application-form.tsx` | Add and edit form. Always returns to the list |
| `src/features/applications/components/application-list.tsx` | Company links to the edit form |
| `src/app/(app)/applications/[id]/edit/page.tsx` | Checks the id with its own regex |
| `src/components/stage-badge.tsx` | Badge for one stage |
| `src/lib/dates.ts` | `formatDate` |

## Proposed Solution

### Architecture

- **Layout:** two columns from the `lg` width up. Left: details and the long text sections. Right: next step and stage history. One column on a phone.
- **Id check in one place:** both the detail page and the edit page read `[id]`, so `parseApplicationId` goes in `src/features/applications/rules.ts`, a pure function.
- **Stage history is read only.** The trigger from task 1 writes it. This page only lists it.
- **Delete:** `deleteApplication(id)` action checks the user and the id. `stage_events` rows go with it (`on delete cascade`). The confirm dialog is a small client component.
- **Form return path:** `ApplicationForm` gets a `returnTo` prop, used by Cancel and after a save.
- **Monochrome:** the delete button is the `outline` variant. The warning is in the dialog text, not in a color.

### File Changes

| Action | File | Description |
|--------|------|-------------|
| CREATE | `src/features/applications/rules.ts` | `parseApplicationId` |
| CREATE | `src/features/applications/components/application-details.tsx` | The saved fields |
| CREATE | `src/features/applications/components/stage-history.tsx` | List of stage changes |
| CREATE | `src/features/applications/components/delete-application-button.tsx` | Button and confirm dialog (client) |
| CREATE | `src/app/(app)/applications/[id]/page.tsx` | Detail page |
| MODIFY | `src/features/applications/queries.ts` | `listStageEvents`, `deleteApplicationRow` |
| MODIFY | `src/features/applications/actions.ts` | `deleteApplication` |
| MODIFY | `src/features/applications/components/application-form.tsx` | `returnTo` prop |
| MODIFY | `src/features/applications/components/application-list.tsx` | Link to the detail page |
| MODIFY | `src/app/(app)/applications/[id]/edit/page.tsx` | Use `parseApplicationId`, return to the detail page |
| MODIFY | `src/app/(app)/applications/new/page.tsx` | Pass `returnTo` |

## Implementation Steps

### Step 1: Queries, rule, and action
Add `parseApplicationId`, `listStageEvents`, `deleteApplicationRow`, and `deleteApplication`.

### Step 2: Components
Build `ApplicationDetails`, `StageHistory`, and `DeleteApplicationButton` (`pnpm dlx shadcn@latest add alert-dialog`).

### Step 3: Page and links
Build the detail page. Point the list at it. Add `returnTo` to the form.

### Step 4: Check
Run `pnpm lint` and `pnpm build`. Ask Miguel to open, edit, and delete an application in his browser.

## Testing Checklist

- [ ] Clicking a company in the list opens its detail page
- [ ] A new application shows one history row: "Added as Draft"
- [ ] Changing the stage in the edit form adds a history row, and the form returns to the detail page
- [ ] Empty long text sections are not shown
- [ ] The job link opens in a new tab
- [ ] Delete asks first. Cancel keeps the row. Confirm removes it and its history
- [ ] `/applications/abc` and `/applications/999999` show not found
- [ ] A second user gets not found on the first user's detail URL
- [ ] 375px, keyboard only, light and dark mode

## Dependencies

- Required packages: shadcn `alert-dialog`
- Required APIs: none
- Blocked by: nothing. Task 4 is coded, its look is still to be checked by Miguel

## Notes for Implementation Agent

- Read `AGENTS.md` and the project `CLAUDE.md` first. `params` is a promise.
- shadcn here is built on Base UI. Compose with `render`, not `asChild`.
- Arguments of a Server Action come from the browser. Check the id in `deleteApplication`.
- No migration in this task. Do not add test rows with real data.
- The Today page and the follow-up rules are task 6.

## Related

- Plan: [PLAN.md](../PLAN.md)
- Previous task: [004-m-applications-list-add-edit.md](004-m-applications-list-add-edit.md)
