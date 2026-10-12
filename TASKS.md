# Tasks

Task tracking for the development workflow. The full build order is in [docs/PLAN.md](docs/PLAN.md).

---

## Planned

Tasks ready for `/implement {ID}`.

| ID | Task | Priority | Task Doc | Created |
|----|------|----------|----------|---------|
| 3 | UI Foundation: Wider Layout and Reusable Components | HIGH | [003-m-ui-foundation.md](docs/task/003-m-ui-foundation.md) | Oct 12 |

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
