# Job Tracker Plan

A web app to track job applications. It should do more than a sheet: it knows your follow-up rules and tells you what to do today.

Anyone can sign in and use it. Each user sees only their own data.

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
- Use a shadcn component when one fits, before writing custom markup.
- Little empty space at the sides. The page width is defined once, in `PageContainer`.

## Pages

| Route | What it shows |
| --- | --- |
| `/login` | Sign in with Google |
| `/` | Today: follow-ups due, overdue items, drafts not sent |
| `/applications` | All applications, with search and a stage filter |
| `/applications/new` | Add form |
| `/applications/[id]` | One application: details, job post, message sent, history |
| `/skipped` | Jobs I looked at and did not apply to |
| `/stats` | Counts by stage per week, reply rate per source |
| `/settings` | Follow-up days, export my data, delete my account |

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

**user_settings**: user_id (primary key), follow_up_days (default 7), no_reply_days (default 14), updated_at. One row per user, made on first sign in.

## Follow-up rules

- An application is "due" when `next_step_on` is today or earlier.
- If the stage is still Applied `follow_up_days` after `applied_on`, show "follow up". Default is 7.
- If the stage is still Applied `no_reply_days` after `applied_on`, show "mark No reply". Default is 14.
- When I change the stage, a row is added to `stage_events`.

## Build order

Each line becomes one task doc in `docs/task/` when I get to it.

| # | Task | Why this order |
| --- | --- | --- |
| 1 | Supabase project, schema, RLS | Everything needs the database |
| 2 | Sign in with Google, app shell | Layout and nav for all pages |
| 3 | UI foundation: wider layout, shared components | Later pages reuse these, so nothing is repeated |
| 4 | Applications list, add, edit | The core of the app |
| 5 | Application detail page with stage history | One page per job |
| 6 | Today page with the follow-up rules | The main win over a sheet |
| 7 | CSV import | Real data from day one, and anyone can bring their sheet |
| 8 | Skipped jobs and repeat warning | Small, uses the same patterns |
| 9 | Stats page | Practice for a dashboard test task |
| 10 | Settings: follow-up days, export, delete account | Needed before other people use it |
| 11 | Deploy to Vercel, demo account, privacy note | Something to show in interviews |
| 12 | Paste a job post, AI fills the form, with a daily limit per user | The AI part |

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
- Users trust the app with private data (pay, contacts, notes). RLS is tested for every table.
- A user can export their data and delete their account with all their rows.
- Sign in is Google only. No email and password login, so the app stores no passwords and sends no emails.
- My own import file with real rows is in `.gitignore`.
- `.env.local` is never committed.
