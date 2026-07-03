-- ============================================================
-- SUPABASE_PATCH_020.sql
-- AI Governance POAM → Risk Register integration
--
-- Run in: Supabase Dashboard → SQL Editor → New Query
--
-- What this does:
--   1. Extends the risk_register.source CHECK to include 'ai_poam'
--   2. Adds a partial unique index so each AI control has at most
--      one risk_register row per org
--   3. Creates sync_ai_poam_to_risk_register() — called from JS
--      after every aiuSavePoam() save
-- ============================================================

-- 1. Extend source CHECK constraint
--    Default PostgreSQL name for this constraint is risk_register_source_check.
--    Drop and re-add to add 'ai_poam'.
ALTER TABLE risk_register DROP CONSTRAINT IF EXISTS risk_register_source_check;
ALTER TABLE risk_register
  ADD CONSTRAINT risk_register_source_check
  CHECK (source IN ('cis_poam', 'manual', 'tpra', 'ai_poam', 'tabletop'));

-- 2. Partial unique index — one risk_register row per org per AI control
CREATE UNIQUE INDEX IF NOT EXISTS uq_rr_ai_poam
  ON risk_register(org_id, safeguard_id)
  WHERE source = 'ai_poam';

-- 3. Sync function
--    Accepts pre-built items from JS (titles/descriptions are in JS constants, not the DB).
--    Each item in p_items:
--      { safeguard_id, risk_title, risk_description, inherent_risk_rating,
--        risk_status, risk_owner, treatment_notes, due_date }
--    On conflict: updates status/ownership/notes; preserves manually-set residual rating.
CREATE OR REPLACE FUNCTION sync_ai_poam_to_risk_register(
  p_org_id        uuid,
  p_assessment_id uuid,
  p_items         jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  item jsonb;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO risk_register (
      org_id, source, poam_assessment_id, safeguard_id,
      risk_title, risk_description,
      inherent_risk_rating, residual_risk_rating,
      risk_status, risk_owner, treatment_notes, due_date
    )
    VALUES (
      p_org_id,
      'ai_poam',
      p_assessment_id,
      item->>'safeguard_id',
      item->>'risk_title',
      item->>'risk_description',
      item->>'inherent_risk_rating',
      item->>'inherent_risk_rating',   -- residual starts equal to inherent
      item->>'risk_status',
      NULLIF(item->>'risk_owner', ''),
      NULLIF(item->>'treatment_notes', ''),
      CASE
        WHEN NULLIF(item->>'due_date', '') IS NOT NULL
        THEN (item->>'due_date')::date
        ELSE NULL
      END
    )
    ON CONFLICT (org_id, safeguard_id) WHERE source = 'ai_poam'
    DO UPDATE SET
      poam_assessment_id   = EXCLUDED.poam_assessment_id,
      risk_title           = EXCLUDED.risk_title,
      risk_description     = EXCLUDED.risk_description,
      inherent_risk_rating = EXCLUDED.inherent_risk_rating,
      risk_status          = EXCLUDED.risk_status,
      -- Preserve manual edits to owner/notes/date if the synced value is blank
      risk_owner      = COALESCE(NULLIF(EXCLUDED.risk_owner,      ''), risk_register.risk_owner),
      treatment_notes = COALESCE(NULLIF(EXCLUDED.treatment_notes, ''), risk_register.treatment_notes),
      due_date        = COALESCE(EXCLUDED.due_date,                    risk_register.due_date),
      updated_at      = now();
  END LOOP;
END;
$$;

-- 4. Grant execute (matching PATCH_016 pattern for CIS sync function)
GRANT EXECUTE ON FUNCTION sync_ai_poam_to_risk_register(uuid, uuid, jsonb)
  TO authenticated, anon;
