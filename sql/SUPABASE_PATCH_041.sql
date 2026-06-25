-- SUPABASE_PATCH_041.sql
-- Extends app_inventory with risk/criticality (gov2), BCDR (gov3), and IR classification (gov4) fields.
-- Safe: adds new nullable columns only. No existing data is modified.
-- Run manually in the Supabase SQL Editor.

-- ── gov2: Risk & Criticality ───────────────────────────────────────────────────
ALTER TABLE app_inventory
  ADD COLUMN IF NOT EXISTS criticality         text    CHECK (criticality IN ('Critical','High','Medium','Low')),
  ADD COLUMN IF NOT EXISTS criticality_rationale text,
  ADD COLUMN IF NOT EXISTS in_regulatory_scope boolean NOT NULL DEFAULT false;

-- ── gov3: BCDR Classification ─────────────────────────────────────────────────
ALTER TABLE app_inventory
  ADD COLUMN IF NOT EXISTS bcdr_priority      text    CHECK (bcdr_priority IN ('Tier 1','Tier 2','Tier 3')),
  ADD COLUMN IF NOT EXISTS bcdr_rto           text,   -- Recovery Time Objective (e.g. "4 hours")
  ADD COLUMN IF NOT EXISTS bcdr_rpo           text,   -- Recovery Point Objective (e.g. "1 hour")
  ADD COLUMN IF NOT EXISTS bcdr_backup_method text,
  ADD COLUMN IF NOT EXISTS bcdr_dependencies  text,   -- free-text: "Depends on Azure AD, Stripe"
  ADD COLUMN IF NOT EXISTS bcdr_owner         text;

-- ── gov4: IR Classification ───────────────────────────────────────────────────
ALTER TABLE app_inventory
  ADD COLUMN IF NOT EXISTS ir_in_scope          boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ir_priority_tier     text,   -- P1 / P2 / P3 / P4
  ADD COLUMN IF NOT EXISTS ir_tech_contact      text,
  ADD COLUMN IF NOT EXISTS ir_vendor_contact    text,
  ADD COLUMN IF NOT EXISTS ir_escalation_path   text,
  ADD COLUMN IF NOT EXISTS ir_last_incident_date date;
