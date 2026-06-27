-- SUPABASE_PATCH_048.sql
-- gov6: Vendor criticality and risk tier fields for vendor_directory table.
-- Adds: criticality, criticality_rationale, risk_tier, data_access (jsonb),
--       jurisdiction, data_residency, certifications (jsonb)
-- Safe: ALTER TABLE only — no existing data or columns are modified.
-- Run manually in the Supabase SQL Editor.

ALTER TABLE vendor_directory
  ADD COLUMN IF NOT EXISTS criticality            text
    CHECK (criticality IN ('Critical','High','Moderate','Low')),
  ADD COLUMN IF NOT EXISTS criticality_rationale  text,
  ADD COLUMN IF NOT EXISTS risk_tier              text
    CHECK (risk_tier IN ('Critical','High','Moderate','Low')),
  ADD COLUMN IF NOT EXISTS data_access            jsonb NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS jurisdiction           text,
  ADD COLUMN IF NOT EXISTS data_residency         text,
  ADD COLUMN IF NOT EXISTS certifications         jsonb NOT NULL DEFAULT '[]';
