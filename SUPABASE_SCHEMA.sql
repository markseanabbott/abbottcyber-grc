-- ============================================================
-- Abbott Cyber GRC Platform — Supabase Schema
-- Run this entire script in Supabase SQL Editor (once)
-- ============================================================

-- ORGANISATIONS (three-tier hierarchy)
create table if not exists organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text not null check (tier in ('grandfather', 'father', 'child')),
  parent_id uuid references organisations(id) on delete cascade,
  industry text,
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- USERS
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  name text not null,
  email text unique not null,
  role text not null check (role in ('admin', 'analyst', 'viewer')),
  created_at timestamptz default now()
);

-- ASSESSMENTS (insurance, CIS, NIST, etc.)
create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  module text not null, -- 'insurance', 'cis', 'nist', 'techstack'
  score integer not null check (score between 0 and 100),
  sec_pct integer,
  ins_pct integer,
  answers jsonb,
  conducted_by text,
  assessed_at date not null default current_date,
  created_at timestamptz default now()
);

-- TABLETOP SESSIONS
create table if not exists tabletop_sessions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organisations(id) on delete cascade,
  scenario_id text not null,
  scenario_title text not null,
  session_code char(6) unique not null,
  status text not null default 'setup' check (status in ('setup','active','complete','expired')),
  facilitator_name text,
  current_inject integer default 0,
  declaration_logged boolean default false,
  tl_assessment text,
  tl_severity text,
  tl_declare boolean,
  breach_declared boolean default false,
  breach_timestamp text,
  breach_rationale text,
  ic_sign_time text,
  es_sign_time text,
  notif_filed boolean default false,
  exercise_log jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TABLETOP PARTICIPANTS
create table if not exists tabletop_participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references tabletop_sessions(id) on delete cascade,
  role_id text not null, -- 'ic','tl','cl','lc','es'
  role_name text not null,
  player_name text not null,
  joined_at timestamptz default now()
);

-- TABLETOP RESPONSES (per inject per role)
create table if not exists tabletop_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references tabletop_sessions(id) on delete cascade,
  inject_index integer not null,
  role_id text not null,
  player_name text,
  response_text text,
  criticality text check (criticality in ('Critical','High','Medium','Low')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(session_id, inject_index, role_id)
);

-- TABLETOP NOTIFICATION CHECKLIST
create table if not exists tabletop_notif_checks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references tabletop_sessions(id) on delete cascade,
  item_id text not null,
  checked boolean default false,
  checked_at timestamptz,
  unique(session_id, item_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Enable RLS on all tables (data isolated by org)
-- ============================================================

alter table organisations enable row level security;
alter table users enable row level security;
alter table assessments enable row level security;
alter table tabletop_sessions enable row level security;
alter table tabletop_participants enable row level security;
alter table tabletop_responses enable row level security;
alter table tabletop_notif_checks enable row level security;

-- For now: open policies using anon key (tighten when auth is added)
-- These allow the artifact to read/write freely with the publishable key

create policy "anon full access orgs" on organisations for all to anon using (true) with check (true);
create policy "anon full access users" on users for all to anon using (true) with check (true);
create policy "anon full access assessments" on assessments for all to anon using (true) with check (true);
create policy "anon full access tt_sessions" on tabletop_sessions for all to anon using (true) with check (true);
create policy "anon full access tt_participants" on tabletop_participants for all to anon using (true) with check (true);
create policy "anon full access tt_responses" on tabletop_responses for all to anon using (true) with check (true);
create policy "anon full access tt_notif" on tabletop_notif_checks for all to anon using (true) with check (true);

-- ============================================================
-- SEED DATA — Abbott Cyber org hierarchy
-- ============================================================

insert into organisations (id, name, tier, parent_id, industry) values
  ('00000000-0000-0000-0000-000000000001', 'Abbott Cyber MSP', 'grandfather', null, 'Consulting'),
  ('00000000-0000-0000-0000-000000000002', 'Hospitality Group', 'father', '00000000-0000-0000-0000-000000000001', 'Hospitality'),
  ('00000000-0000-0000-0000-000000000003', 'Tech & SaaS Clients', 'father', '00000000-0000-0000-0000-000000000001', 'Technology'),
  ('00000000-0000-0000-0000-000000000004', 'The Grand Hotel', 'child', '00000000-0000-0000-0000-000000000002', 'Hospitality'),
  ('00000000-0000-0000-0000-000000000005', 'Harbour Inn & Suites', 'child', '00000000-0000-0000-0000-000000000002', 'Hospitality'),
  ('00000000-0000-0000-0000-000000000006', 'CloudStack Inc.', 'child', '00000000-0000-0000-0000-000000000003', 'Technology')
on conflict (id) do nothing;

-- Seed assessment history for demo orgs
insert into assessments (org_id, module, score, sec_pct, ins_pct, assessed_at) values
  ('00000000-0000-0000-0000-000000000004', 'insurance', 41, 44, 39, '2025-09-15'),
  ('00000000-0000-0000-0000-000000000004', 'insurance', 58, 61, 55, '2025-12-10'),
  ('00000000-0000-0000-0000-000000000004', 'insurance', 67, 70, 64, '2026-03-20'),
  ('00000000-0000-0000-0000-000000000005', 'insurance', 52, 55, 49, '2026-01-08'),
  ('00000000-0000-0000-0000-000000000006', 'insurance', 78, 80, 76, '2026-02-14'),
  ('00000000-0000-0000-0000-000000000006', 'insurance', 83, 85, 81, '2026-04-30')
on conflict do nothing;

-- ============================================================
-- HELPER FUNCTION — generate session codes
-- ============================================================

create or replace function generate_session_code()
returns text language plpgsql as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text := '';
  i integer;
begin
  for i in 1..6 loop
    code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return code;
end;
$$;

-- ============================================================
-- Done. Your GRC Platform database is ready.
-- ============================================================
