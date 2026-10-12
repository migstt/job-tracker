# Tasks

Task tracking for the development workflow. The full build order is in [docs/PLAN.md](docs/PLAN.md).

---

## Planned

Tasks ready for `/implement {ID}`.

| ID | Task | Priority | Task Doc | Created |
|----|------|----------|----------|---------|

---

## In Progress

| ID | Task | Started | Task Doc | Status |
|----|------|---------|----------|--------|

---

## Testing

Tasks being tested via `/test`.

| ID | Task | Task Doc | Test Report | Status |
|----|------|----------|-------------|--------|
| 1 | Supabase Project, Schema, and RLS | [001-m-supabase-schema.md](docs/task/001-m-supabase-schema.md) | Pending | Database checks passed. No UI to test |
| 4 | Applications: List, Add, and Edit | [004-m-applications-list-add-edit.md](docs/task/004-m-applications-list-add-edit.md) | Pending | Lint and build pass. Form rules checked with sample input. Not tried in a browser yet |
| 3 | UI Foundation: Wider Layout and Reusable Components | [003-m-ui-foundation.md](docs/task/003-m-ui-foundation.md) | Pending | Lint and build pass. Look not checked in a browser yet |
| 2 | Sign In and App Shell | [002-m-login-and-app-shell.md](docs/task/002-m-login-and-app-shell.md) | Pending | Sign in and sign out confirmed by Miguel on Oct 12. Phone width and keyboard not checked |

---

## Approved

Tested and approved. Ready for `/document` then `/ship`.

| ID | Task | Task Doc | Feature Doc | Test Report | Approved |
|----|------|----------|-------------|-------------|----------|

---

## Ready to Ship

PRs created via `/ship`. **Items stay here until `/release` is run** (even after merge).

| ID | Task | Branch | PR | Merged | Task Doc |
|----|------|--------|----|--------|----------|

---

## Shipped

Released items. Only `/release` moves items here with version number.

| ID | Task | PR | Release | Shipped |
|----|------|-----|---------|---------|
