-- ============================================================
-- SUPABASE_PATCH_015.sql
-- Restructure risk_register: from 18-row auto-calculated CIS model
-- to POAM-driven individual risk items.
--
-- Run AFTER PATCH_014 (and its backfill) have been applied.
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================


-- ─── 1. CLEAN EXISTING DATA ─────────────────────────────────────────────────
-- Remove auto-generated rows (the backfilled 18-row-per-org data).
-- These were never real risk items — replacing with the POAM-driven model.

DELETE FROM risk_acceptance_log;
DELETE FROM ig_change_log;
DELETE FROM risk_register;


-- ─── 2. DROP OLD TRIGGER + FUNCTIONS ────────────────────────────────────────

DROP TRIGGER IF EXISTS tg_cis_assessment_risk ON assessments;
DROP FUNCTION IF EXISTS tg_cis_assessment_recalculate();
DROP FUNCTION IF EXISTS initialize_risk_register(uuid, uuid, integer);
DROP FUNCTION IF EXISTS recalculate_risk_register(uuid, uuid);
DROP FUNCTION IF EXISTS handle_ig_change(uuid, uuid, integer, text);
DROP FUNCTION IF EXISTS accept_risk(uuid, text, text, timestamptz);


-- ─── 3. RESTRUCTURE risk_register ───────────────────────────────────────────

-- Drop old unique constraint (references columns we're removing)
ALTER TABLE risk_register DROP CONSTRAINT IF EXISTS risk_register_org_id_control_category_id_key;

-- Drop old risk_status check (values are changing)
ALTER TABLE risk_register DROP CONSTRAINT IF EXISTS risk_register_risk_status_check;

-- Drop columns from the old auto-calculated design
ALTER TABLE risk_register DROP COLUMN IF EXISTS assessment_id;
ALTER TABLE risk_register DROP COLUMN IF EXISTS framework_id;
ALTER TABLE risk_register DROP COLUMN IF EXISTS control_category_id;
ALTER TABLE risk_register DROP COLUMN IF EXISTS client_ig_level;
ALTER TABLE risk_register DROP COLUMN IF EXISTS in_scope;
ALTER TABLE risk_register DROP COLUMN IF EXISTS inherent_risk_score;
ALTER TABLE risk_register DROP COLUMN IF EXISTS calculated_risk_score;
ALTER TABLE risk_register DROP COLUMN IF EXISTS calculated_risk_rating;
ALTER TABLE risk_register DROP COLUMN IF EXISTS finding_count_total;
ALTER TABLE risk_register DROP COLUMN IF EXISTS finding_count_fail;
ALTER TABLE risk_register DROP COLUMN IF EXISTS finding_count_pass;
ALTER TABLE risk_register DROP COLUMN IF EXISTS finding_count_compensating;
ALTER TABLE risk_register DROP COLUMN IF EXISTS last_calculated_at;

-- Add new columns
ALTER TABLE risk_register ADD COLUMN IF NOT EXISTS source          text NOT NULL DEFAULT 'cis_poam';
ALTER TABLE risk_register ADD COLUMN IF NOT EXISTS poam_assessment_id uuid REFERENCES assessments(id) ON DELETE SET NULL;
ALTER TABLE risk_register ADD COLUMN IF NOT EXISTS safeguard_id   text;      -- '6.3'; null for manual risks
ALTER TABLE risk_register ADD COLUMN IF NOT EXISTS control_number text;      -- '06'
ALTER TABLE risk_register ADD COLUMN IF NOT EXISTS risk_title     text;
ALTER TABLE risk_register ADD COLUMN IF NOT EXISTS risk_description text;
ALTER TABLE risk_register ADD COLUMN IF NOT EXISTS residual_risk_rating text;
ALTER TABLE risk_register ADD COLUMN IF NOT EXISTS risk_owner     text;
ALTER TABLE risk_register ADD COLUMN IF NOT EXISTS treatment_notes text;
ALTER TABLE risk_register ADD COLUMN IF NOT EXISTS due_date       date;
ALTER TABLE risk_register ADD COLUMN IF NOT EXISTS resolved_date  timestamptz;

-- New CHECK constraints
ALTER TABLE risk_register ALTER COLUMN risk_status SET DEFAULT 'Open';
ALTER TABLE risk_register ADD CONSTRAINT risk_register_risk_status_check
  CHECK (risk_status IN ('Open', 'In Progress', 'Accepted', 'Closed', 'Transferred'));

ALTER TABLE risk_register ADD CONSTRAINT risk_register_source_check
  CHECK (source IN ('cis_poam', 'manual', 'tpra'));

-- Partial unique index: one risk_register row per (org, safeguard).
-- NULLs are excluded so manual risks (safeguard_id IS NULL) can coexist freely.
CREATE UNIQUE INDEX IF NOT EXISTS risk_register_org_safeguard_uidx
  ON risk_register (org_id, safeguard_id)
  WHERE safeguard_id IS NOT NULL;


-- ─── 4. FUNCTION: sync_cis_poam_to_risk_register ────────────────────────────
-- Called from the app after every cisSavePoam() save.
-- Upserts one risk_register row per POAM item.
-- POAM is the source of truth for: title, status, owner, target date, rationale.
-- Risk register is the only place for: residual_risk_rating (professional judgement).

CREATE OR REPLACE FUNCTION sync_cis_poam_to_risk_register(
  p_org_id        uuid,
  p_assessment_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  p          RECORD;
  v_status   text;
  v_title    text;
  v_desc     text;
  v_inherent text;
  v_ctrl_num text;
BEGIN
  FOR p IN
    SELECT * FROM cis_poam_items
    WHERE org_id = p_org_id AND assessment_id = p_assessment_id
  LOOP
    -- Derive 2-digit control number from safeguard_id (e.g. '6.3' → '06')
    v_ctrl_num := LPAD(SPLIT_PART(p.safeguard_id, '.', 1), 2, '0');

    -- Map POAM status + risk_decision to risk_register status
    -- risk_decision takes precedence for transfer/accept; status drives open/progress/remediated
    v_status := CASE
      WHEN p.risk_decision = 'transfer'                          THEN 'Transferred'
      WHEN p.status = 'remediated'                               THEN 'Closed'
      WHEN p.status = 'accepted' OR p.risk_decision = 'accept'  THEN 'Accepted'
      WHEN p.status = 'in_progress'                              THEN 'In Progress'
      ELSE                                                            'Open'
    END;

    -- Pull safeguard name from seed data (risk_subcontrols)
    SELECT sc.subcontrol_name INTO v_title
    FROM risk_subcontrols sc
    JOIN risk_control_categories rcc ON rcc.id = sc.control_category_id
    WHERE sc.subcontrol_number = p.safeguard_id
      AND rcc.framework_id = (SELECT id FROM risk_frameworks WHERE code = 'CIS_V8')
    LIMIT 1;

    -- Pull control-level threat scenario as the risk description
    SELECT rcc.threat_scenario, rcc.inherent_risk_rating
    INTO v_desc, v_inherent
    FROM risk_control_categories rcc
    WHERE rcc.control_number = v_ctrl_num
      AND rcc.framework_id = (SELECT id FROM risk_frameworks WHERE code = 'CIS_V8')
    LIMIT 1;

    -- Upsert: conflict on (org_id, safeguard_id) via partial index
    INSERT INTO risk_register (
      org_id, source, poam_assessment_id, safeguard_id, control_number,
      risk_title, risk_description,
      inherent_risk_rating, risk_status,
      risk_owner, treatment_notes, due_date,
      acceptance_rationale, acceptance_date,
      resolved_date,
      created_at, updated_at
    ) VALUES (
      p_org_id, 'cis_poam', p_assessment_id, p.safeguard_id, v_ctrl_num,
      COALESCE(v_title, 'CIS ' || p.safeguard_id),
      v_desc,
      COALESCE(v_inherent, 'Medium'),
      v_status,
      p.assigned_to, p.risk_rationale, p.target_date,
      CASE WHEN v_status IN ('Accepted','Transferred') THEN p.risk_rationale ELSE NULL END,
      CASE WHEN v_status = 'Accepted' THEN NOW() ELSE NULL END,
      CASE WHEN v_status = 'Closed'   THEN NOW() ELSE NULL END,
      NOW(), NOW()
    )
    ON CONFLICT (org_id, safeguard_id) WHERE safeguard_id IS NOT NULL
    DO UPDATE SET
      poam_assessment_id = EXCLUDED.poam_assessment_id,
      risk_title         = EXCLUDED.risk_title,
      risk_description   = EXCLUDED.risk_description,
      inherent_risk_rating = EXCLUDED.inherent_risk_rating,
      -- POAM drives status; preserve a manual 'Accepted' only until POAM closes/transfers it
      risk_status = CASE
        WHEN EXCLUDED.risk_status IN ('Closed', 'Transferred')                        THEN EXCLUDED.risk_status
        WHEN risk_register.risk_status = 'Accepted'
          AND EXCLUDED.risk_status NOT IN ('Closed', 'Transferred', 'Accepted')       THEN 'Accepted'
        ELSE EXCLUDED.risk_status
      END,
      -- POAM fields (owner, notes, date) override if non-null; don't wipe data entered in risk register
      risk_owner         = COALESCE(EXCLUDED.risk_owner,      risk_register.risk_owner),
      treatment_notes    = COALESCE(EXCLUDED.treatment_notes, risk_register.treatment_notes),
      due_date           = COALESCE(EXCLUDED.due_date,        risk_register.due_date),
      acceptance_rationale = COALESCE(EXCLUDED.acceptance_rationale, risk_register.acceptance_rationale),
      acceptance_date    = CASE
        WHEN EXCLUDED.risk_status = 'Accepted' AND risk_register.acceptance_date IS NULL
          THEN NOW() ELSE risk_register.acceptance_date END,
      resolved_date      = CASE
        WHEN EXCLUDED.risk_status = 'Closed' AND risk_register.resolved_date IS NULL
          THEN NOW() ELSE risk_register.resolved_date END,
      updated_at         = NOW();
  END LOOP;
END;
$$;


-- ─── 5. VERIFICATION ────────────────────────────────────────────────────────
-- After running this patch, go to CIS → open a POAM → save it.
-- The risk register should now show individual items from that POAM.

-- Check table structure:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'risk_register' ORDER BY ordinal_position;

-- Check rows after a POAM save:
-- SELECT safeguard_id, risk_title, risk_status, inherent_risk_rating
-- FROM risk_register WHERE org_id = '<org-uuid>' ORDER BY safeguard_id;

-- ============================================================
-- END OF PATCH_015
-- ============================================================
