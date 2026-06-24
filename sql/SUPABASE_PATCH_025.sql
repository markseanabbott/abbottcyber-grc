-- SUPABASE_PATCH_025.sql
-- Adds the ma_assessments table for the M&A Cyber Due Diligence module.
-- Run manually in the Supabase SQL Editor. Do NOT run automatically.

CREATE TABLE IF NOT EXISTS ma_assessments (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  target_name           text NOT NULL,
  deal_type             text,
  target_industry       text,
  target_employee_band  text,
  deal_value_band       text,
  risk_tolerance        text CHECK (risk_tolerance IN ('conservative','moderate','aggressive')) DEFAULT 'moderate',
  assessor              text,
  assessed_at           date,
  framing               jsonb DEFAULT '{}',
  answers               jsonb DEFAULT '{}',
  score                 numeric,
  category_scores       jsonb,
  total_cost_low        integer,
  total_cost_high       integer,
  risk_rating           text,
  status                text CHECK (status IN ('draft','complete')) DEFAULT 'draft',
  linked_org_id         uuid REFERENCES organisations(id),
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

ALTER TABLE ma_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_all_ma" ON ma_assessments
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER tg_touch_ma_assessments
  BEFORE UPDATE ON ma_assessments
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();
