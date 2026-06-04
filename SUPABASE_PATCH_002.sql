-- ============================================================
-- Abbott Cyber GRC Platform — Patch 002
-- Adds techstack_responses table for the Technology Stack Survey
-- Run in Supabase SQL Editor
-- ============================================================

-- TECHSTACK RESPONSES
-- Holds the latest answer per (org, question). The unique constraint
-- enables PostgREST upsert-on-conflict so re-saving is idempotent.
-- Snapshot history (for trend lines) is written to the existing
-- `assessments` table with module = 'techstack', same pattern as insurance.

create table if not exists techstack_responses (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references organisations(id) on delete cascade,
  question_id     text not null,
  category_id     text not null,
  answer          text not null check (answer in ('yes','no','na','partial')),
  partial_detail  text,
  -- Machine tags duplicated here so downstream consumers (MSP catalog matcher,
  -- framework auto-scoper) can join without re-reading the question definition.
  tool_category   text,
  question_type   text check (question_type in ('presence','coverage','feature','process')),
  derive_strategy text default 'standard',
  assessed_at     date not null default current_date,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique(org_id, question_id)
);

-- RLS — open anon policy for now, tighten when auth lands
alter table techstack_responses enable row level security;
drop policy if exists "anon full access techstack_responses" on techstack_responses;
create policy "anon full access techstack_responses"
  on techstack_responses for all to anon using (true) with check (true);

-- Auto-touch updated_at on row updates
create or replace function tg_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists techstack_responses_touch on techstack_responses;
create trigger techstack_responses_touch
  before update on techstack_responses
  for each row execute function tg_touch_updated_at();

-- ============================================================
-- Verify
-- ============================================================
-- After running, this should return 0 rows (no responses yet):
select count(*) as response_count from techstack_responses;

-- And this should show your new table:
select table_name from information_schema.tables
where table_schema = 'public' and table_name = 'techstack_responses';

-- ============================================================
-- Future patches (NOT in this one):
--   PATCH_003 — techstack_questions reference table, once MSPs can
--               manage their own question sets without code deploys.
--   PATCH_004 — msp_tools catalog, once the MSP portfolio loader is built.
--               (msp_id, tool_category, vendor, product, tier).
--               Joins on tool_category against techstack_responses to drive
--               sell / upgrade / replace classification per client.
-- ============================================================
