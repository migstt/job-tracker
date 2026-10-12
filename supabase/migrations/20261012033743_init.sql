-- First schema: applications, their stage history, skipped jobs, and per-user settings.
-- Every table is owned by one user and protected by Row Level Security.

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

create type public.application_stage as enum (
  'draft',
  'applied',
  'screening',
  'technical',
  'final',
  'offer',
  'rejected',
  'no_reply'
);

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.applications (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  company text not null,
  role text not null,
  source text,
  job_url text,
  job_post text,
  remote text,
  pay_text text,
  pay_min_php integer,
  pay_max_php integer,
  my_ask text,
  resume_used text,
  message_sent text,
  contact_name text,
  stage public.application_stage not null default 'draft',
  applied_on date,
  next_step text,
  next_step_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_pay_not_negative
    check (pay_min_php >= 0 and pay_max_php >= 0),
  constraint applications_pay_range
    check (pay_min_php <= pay_max_php)
);

create table public.stage_events (
  id bigint generated always as identity primary key,
  application_id bigint not null references public.applications (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  from_stage public.application_stage,
  to_stage public.application_stage not null,
  happened_on date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

create table public.skipped_jobs (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  seen_on date not null default current_date,
  title text not null,
  source text,
  job_url text,
  reason text,
  created_at timestamptz not null default now()
);

create table public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  follow_up_days smallint not null default 7,
  no_reply_days smallint not null default 14,
  updated_at timestamptz not null default now(),
  constraint user_settings_follow_up_days_range
    check (follow_up_days between 1 and 90),
  constraint user_settings_no_reply_after_follow_up
    check (no_reply_days > follow_up_days and no_reply_days <= 180)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- Postgres does not index foreign keys by itself. RLS filters on user_id in
-- every query, so each user_id needs an index.
-- ---------------------------------------------------------------------------

create index applications_user_id_idx on public.applications (user_id);
create index stage_events_user_id_idx on public.stage_events (user_id);
create index stage_events_application_id_idx on public.stage_events (application_id);
create index skipped_jobs_user_id_idx on public.skipped_jobs (user_id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

-- Keeps updated_at correct no matter which client changes the row.
create function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

create trigger user_settings_set_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();

-- Writes the stage history in the database, so the app cannot forget to log it.
-- Runs as the signed-in user, so the stage_events insert policy still applies.
create function public.log_stage_change()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.stage_events (application_id, user_id, from_stage, to_stage)
    values (new.id, new.user_id, null, new.stage);
  elsif new.stage is distinct from old.stage then
    insert into public.stage_events (application_id, user_id, from_stage, to_stage)
    values (new.id, new.user_id, old.stage, new.stage);
  end if;
  return new;
end;
$$;

create trigger applications_log_stage_change
  after insert or update of stage on public.applications
  for each row execute function public.log_stage_change();

-- Gives each new user a settings row with the default follow-up days.
-- It must be SECURITY DEFINER because the auth service, not the user, inserts
-- into auth.users. It lives in a schema the Data API does not expose, so
-- nobody can call it over the API.
create schema private;

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- ---------------------------------------------------------------------------
-- Access
-- Grants decide which roles can reach a table at all.
-- RLS policies decide which rows they see. Both are needed.
-- ---------------------------------------------------------------------------

revoke all on public.applications, public.stage_events, public.skipped_jobs, public.user_settings
  from anon;

grant select, insert, update, delete on public.applications to authenticated;
grant select, insert, update, delete on public.stage_events to authenticated;
grant select, insert, update, delete on public.skipped_jobs to authenticated;
-- No delete: the settings row lives as long as the user does.
grant select, insert, update on public.user_settings to authenticated;

alter table public.applications enable row level security;
alter table public.stage_events enable row level security;
alter table public.skipped_jobs enable row level security;
alter table public.user_settings enable row level security;

-- (select auth.uid()) is wrapped in a select so Postgres runs it once per
-- query, not once per row.

-- applications
create policy "Owner can read applications"
  on public.applications for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Owner can add applications"
  on public.applications for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Owner can change applications"
  on public.applications for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Owner can delete applications"
  on public.applications for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- stage_events
create policy "Owner can read stage events"
  on public.stage_events for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- The extra check stops a user from adding history to someone else's application.
create policy "Owner can add stage events to own applications"
  on public.stage_events for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.applications a
      where a.id = application_id
        and a.user_id = (select auth.uid())
    )
  );

create policy "Owner can change stage events"
  on public.stage_events for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Owner can delete stage events"
  on public.stage_events for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- skipped_jobs
create policy "Owner can read skipped jobs"
  on public.skipped_jobs for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Owner can add skipped jobs"
  on public.skipped_jobs for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Owner can change skipped jobs"
  on public.skipped_jobs for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Owner can delete skipped jobs"
  on public.skipped_jobs for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- user_settings
create policy "Owner can read settings"
  on public.user_settings for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Owner can add settings"
  on public.user_settings for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Owner can change settings"
  on public.user_settings for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
