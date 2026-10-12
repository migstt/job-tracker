# Job Tracker Plan

A web app to track my job applications. It should do more than a sheet: it knows my follow-up rules and tells me what to do today.

## Stack

- Next.js 16 (App Router, TypeScript, `src/` folder)
- shadcn/ui on Tailwind 4, neutral base color
- Supabase: Postgres, Auth, Row Level Security
- SQL migrations in `supabase/migrations/`, kept in git
- Vitest for unit tests, Playwright for one or two full flows
- Vercel for hosting

## UI rules

- Simple and flat. No gradients, no heavy shadows, no animations for show.
- Neutral colors. Color is used only for stage badges and "overdue".
- One font (Geist, already set up).
- Works on a phone first. Tables turn into a list of cards on small screens.
- Light and dark mode from the shadcn theme.
- Every form field has a label. Every page works with the keyboard.

## Pages

| Route | What it shows |
| --- | --- |
| `/login` | Email and password login |
| `/` | Today: follow-ups due, overdue items, drafts not sent |
| `/applications` | All applications, with search and a stage filter |
| `/applications/new` | Add form |
| `/applications/[id]` | One application: details, job post, message sent, history |
| `/skipped` | Jobs I looked at and did not apply to |
| `/stats` | Counts by stage per week, reply rate per source |

## Data model

All tables have `user_id` and Row Level Security, so each user sees only their own rows.

**applications**

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint identity | primary key |
| user_id | uuid | owner, from `auth.users` |
| company | text | can be "name not in post" |
| role | text | |
| source | text | OnlineJobs.ph, JobStreet, Facebook group, ... |
| job_url | text | optional |
| job_post | text | saved copy of the post, because posts get deleted |
| remote | text | free text, for example "Yes, 7 AM to 4 PM PH time" |
| pay_text | text | pay as written in the post |
| pay_min_php, pay_max_php | integer | monthly, converted, so jobs can be compared |
| my_ask | text | what I asked for |
| resume_used | text | |
| message_sent | text | cover letter or message I sent |
| contact_name | text | |
| stage | enum | draft, applied, screening, technical, final, offer, rejected, no_reply |
| applied_on | date | empty while it is a draft |
| next_step | text | |
| next_step_on | date | |
| notes | text | |
| created_at, updated_at | timestamptz | |

**stage_events** (history)

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint identity | |
| application_id | bigint | |
| user_id | uuid | |
| from_stage, to_stage | enum | |
| happened_on | date | |
| note | text | |

**skipped_jobs**: id, user_id, seen_on, title, source, job_url, reason.

## My rules, built in

- An application is "due" when `next_step_on` is today or earlier.
- If the stage is still Applied 7 days after `applied_on`, show "follow up".
- If the stage is still Applied 14 days after `applied_on`, show "mark No reply".
- When I change the stage, a row is added to `stage_events`.

## Build order

Each line becomes one task doc in `docs/task/` when I get to it.

| # | Task | Why this order |
| --- | --- | --- |
| 1 | Supabase project, schema, RLS | Everything needs the database |
| 2 | Login and app shell | Layout and nav for all pages |
| 3 | Applications list, add, edit | The core of the app |
| 4 | Application detail page with stage history | One page per job |
| 5 | Today page with the follow-up rules | The main win over a sheet |
| 6 | Import from `Tracker.md` | Real data from day one |
| 7 | Skipped jobs and repeat warning | Small, uses the same patterns |
| 8 | Stats page | Practice for a dashboard test task |
| 9 | Deploy to Vercel, demo account with fake data | Something to show in interviews |
| 10 | Paste a job post, AI fills the form | The AI part |

## More ideas for later

- Follow-up message draft with a copy button
- Red flags on a job: no pay stated, company not named, personal email, exclusive contract
- Interview checklist per application (my "before each interview" steps)
- Board view (columns by stage) next to the table view
- Weekly goal, for example "5 applications this week"
- Export to Markdown or CSV, so my notes stay in sync
- Daily email with what is due
- Match score: my skills against the tools in the job post

## Privacy

- This repo can be public. Real application data lives only in Supabase.
- The import file with my real rows is in `.gitignore`.
- `.env.local` is never committed.
