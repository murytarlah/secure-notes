-- Secure Notes: the notes table, locked down with row-level security.
-- Run once in the Supabase SQL Editor.

create table public.notes (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null check (length(trim(title)) > 0),
  body        text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- "My notes, newest first" runs on every visit.
create index notes_user_id_created_at_idx on public.notes (user_id, created_at desc);

-- Privacy is enforced by the database itself.
alter table public.notes enable row level security;

grant select, insert, update, delete on public.notes to authenticated;

create policy "Users can view their own notes"
  on public.notes for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can insert their own notes"
  on public.notes for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users can update their own notes"
  on public.notes for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users can delete their own notes"
  on public.notes for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- No policy for anon: logged-out visitors can read or change nothing.
