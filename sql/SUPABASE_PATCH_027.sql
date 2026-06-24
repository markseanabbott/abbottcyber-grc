-- SUPABASE_PATCH_027.sql
-- Creates pricing_schedule table — per-org tool/SKU catalog
-- MSP (grandfather) sets default rates; client orgs (father) can override per tool type
-- Resolution chain in app: father entry → grandfather entry → MA_TOOLING platform defaults
--
-- tool_type values match assessment question types:
--   mfa, pam, edr, email, cspm, vuln_scanner
--   (extensible — add new types as modules are built)
--
-- Run manually in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS pricing_schedule (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  name         text NOT NULL,
  vendor       text,
  sku          text,
  tool_type    text NOT NULL CHECK (tool_type IN ('mfa','pam','edr','email','cspm','vuln_scanner')),
  model        text NOT NULL CHECK (model IN ('perUser','perEndpoint','fixed')),
  rate_low     numeric NOT NULL CHECK (rate_low >= 0),
  rate_high    numeric CHECK (rate_high >= 0),
  notes        text,
  active       boolean NOT NULL DEFAULT true,
  sort_order   integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pricing_schedule_org_id_idx ON pricing_schedule(org_id);
CREATE INDEX IF NOT EXISTS pricing_schedule_tool_type_idx ON pricing_schedule(org_id, tool_type);

-- auto-update updated_at
CREATE OR REPLACE TRIGGER tg_touch_pricing_schedule
  BEFORE UPDATE ON pricing_schedule
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();

-- RLS
ALTER TABLE pricing_schedule ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS authenticated_all_pricing_schedule ON pricing_schedule;
CREATE POLICY authenticated_all_pricing_schedule ON pricing_schedule
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

COMMENT ON TABLE pricing_schedule IS
  'Per-org tool pricing catalog. Grandfather (MSP) sets defaults for portfolio; father (client) orgs can override. tool_type tags drive matching to assessment question IDs.';
