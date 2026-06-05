-- SUPABASE_PATCH_008.sql
-- Adds cis_poam_items table for Plan of Action & Milestones per CIS assessment.
-- Each gap (No / Partial safeguard) within an assessment can have one POAM row
-- tracking assignment, target date, risk decision, and remediation status.
-- Run manually in the Supabase SQL Editor. Never run automatically.

CREATE TABLE IF NOT EXISTS cis_poam_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id    uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  org_id           uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  safeguard_id     text NOT NULL,
  assigned_to      text,
  target_date      date,
  risk_decision    text CHECK (risk_decision IN ('remediate','accept','transfer')),
  risk_rationale   text,
  status           text NOT NULL DEFAULT 'open'
                     CHECK (status IN ('open','in_progress','remediated','accepted')),
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now(),
  UNIQUE(assessment_id, safeguard_id)
);

ALTER TABLE cis_poam_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all" ON cis_poam_items
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE TRIGGER tg_cis_poam_updated_at
  BEFORE UPDATE ON cis_poam_items
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();
