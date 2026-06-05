-- ============================================================
-- Abbott Cyber GRC Platform — Patch 003
-- Adds organisation_profiles table for risk-relevant metadata
-- Run in Supabase SQL Editor
-- ============================================================

-- ORGANISATION PROFILES
-- Holds extended metadata for each organisation, used to contextualise
-- risk assessments: company size, structure, data handling, regulatory
-- scope, IT maturity, and cloud/vendor posture.
--
-- Design notes:
--   • 1:1 with organisations (unique org_id), ON DELETE CASCADE
--   • managed_by_org_id: future ACL hook — which org can edit this profile
--     (defaults to the parent org; platform tier can always edit anything)
--   • regulatory_scope stored as comma-separated text for simplicity;
--     can be migrated to jsonb array in a future patch once query patterns
--     are known
--   • All band/enum columns use text CHECK constraints so new values can
--     be added without a migration (just update the constraint)

create table if not exists organisation_profiles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null unique references organisations(id) on delete cascade,

  -- ── Size & Structure ─────────────────────────────────────────────
  employee_count_band text check (
    employee_count_band in ('1-10','11-50','51-200','201-500','501-1000','1001+')
  ),
  annual_revenue_band text check (
    annual_revenue_band in ('<$1M','$1M–$5M','$5M–$25M','$25M–$100M','$100M–$500M','$500M+')
  ),
  org_structure text check (
    org_structure in (
      'Private Company','Public Company','Non-Profit',
      'Government / Public Sector','Franchise','Partnership',
      'Sole Trader','Other'
    )
  ),

  -- ── Industry Detail ───────────────────────────────────────────────
  -- sub_industry complements the `industry` field on the organisations table
  sub_industry text,

  -- ── Operational Footprint ─────────────────────────────────────────
  geographic_presence text check (
    geographic_presence in ('Local','Regional','National','International')
  ),
  remote_workforce_pct text check (
    remote_workforce_pct in ('0–10%','10–25%','25–50%','50–75%','75–100%')
  ),

  -- ── Data & Risk Profile ───────────────────────────────────────────
  data_sensitivity text check (
    data_sensitivity in ('Low','Medium','High','Critical')
  ),
  handles_pii               boolean default false,
  handles_payment_data      boolean default false,
  handles_health_data       boolean default false,

  -- ── Regulatory Scope ──────────────────────────────────────────────
  -- Comma-separated list of applicable frameworks/regulations.
  -- Example: 'PCI-DSS,GDPR,SOC 2'
  regulatory_scope text,

  -- ── IT Posture (self-reported context) ───────────────────────────
  it_maturity text check (
    it_maturity in ('Reactive','Developing','Defined','Managed','Optimizing')
  ),
  cloud_adoption text check (
    cloud_adoption in ('None','Partial','Primarily Cloud','Cloud-First')
  ),

  -- ── Third-Party / Vendor Risk ─────────────────────────────────────
  vendor_count_band text check (
    vendor_count_band in ('0–5','6–20','21–50','51+')
  ),
  critical_vendor_dependency boolean default false,

  -- ── Notes ─────────────────────────────────────────────────────────
  notes text,

  -- ── ACL Future-Proofing ───────────────────────────────────────────
  -- Identifies which org is responsible for managing this profile.
  -- Phase 1: always Abbott Cyber (platform) — managed in UI by admin only.
  -- Phase 2 (multi-tenant auth): grandfather can manage own tree;
  --   father can manage own children; child can only view/edit self.
  -- When NULL, falls back to parent org in the hierarchy.
  managed_by_org_id uuid references organisations(id),

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── RLS ────────────────────────────────────────────────────────────
-- Open anon policy for now — tighten when user auth lands (Phase 2).
-- ACL enforcement will be implemented via Supabase auth + RLS policies
-- on this table using managed_by_org_id and the org hierarchy.

alter table organisation_profiles enable row level security;

drop policy if exists "anon full access org_profiles" on organisation_profiles;
create policy "anon full access org_profiles"
  on organisation_profiles for all to anon using (true) with check (true);

-- ── Auto-touch updated_at ──────────────────────────────────────────
-- Reuses the tg_touch_updated_at() function created in PATCH_002.

drop trigger if exists org_profiles_touch on organisation_profiles;
create trigger org_profiles_touch
  before update on organisation_profiles
  for each row execute function tg_touch_updated_at();

-- ── Verify ─────────────────────────────────────────────────────────
-- After running, this should return 0 rows (no profiles yet):
select count(*) as profile_count from organisation_profiles;

-- And this should show your new table:
select table_name from information_schema.tables
where table_schema = 'public' and table_name = 'organisation_profiles';

-- ============================================================
-- ACL Design Notes (for PATCH_005 when auth ships)
-- ============================================================
--
-- Planned RLS replacement policies (Phase 2):
--
-- Platform user:   can read/write all profiles
-- Grandfather user: can read/write profiles where
--                   managed_by_org_id = their org_id
--                   OR the org's parent chain includes their org
-- Father user:     can read/write profiles of their direct children
--                   and their own org
-- Child user:      can read their own profile; write restricted to
--                   non-sensitive fields (notes only)
--
-- The managed_by_org_id field allows explicit delegation:
-- a grandfather org can delegate management of a specific child
-- to a father org without giving the father full tree access.
--
-- ============================================================
-- Future patches (NOT in this one):
--   PATCH_004 — msp_tools catalog (msp_id, tool_category, vendor, product)
--               Joins on tool_category vs techstack_responses to drive
--               sell / upgrade / replace classification per client.
--   PATCH_005 — Supabase Auth integration. Replace anon policies with
--               auth.uid()-based RLS using the users table + org hierarchy.
-- ============================================================
