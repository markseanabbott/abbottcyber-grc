-- ============================================================
-- SUPABASE_PATCH_017.sql
-- Risk Register: consolidate from per-safeguard rows to per-control rows.
--
-- Previous design (PATCH_015): one risk_register row per POAM safeguard.
-- New design: one row per CIS Control Group (1–18) per org, aggregating
-- all safeguard gaps within that control into a single risk entry.
--
-- Stable key: UNIQUE(org_id, control_number) WHERE control_number IS NOT NULL
--
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================


-- ─── 1. CLEAR OLD PER-SAFEGUARD CIS POAM ROWS ───────────────────────────────
-- They'll be re-synced at control level after this patch is applied.

DELETE FROM risk_register WHERE source = 'cis_poam';


-- ─── 2. SWAP UNIQUE INDEX ────────────────────────────────────────────────────

DROP INDEX IF EXISTS risk_register_org_safeguard_uidx;

CREATE UNIQUE INDEX IF NOT EXISTS risk_register_org_control_uidx
  ON risk_register (org_id, control_number)
  WHERE control_number IS NOT NULL;


-- ─── 3. REPLACE SYNC FUNCTION ────────────────────────────────────────────────
-- Groups cis_poam_items by CIS Control number.
-- Produces one risk_register row per control per org.
-- Aggregate status: Open beats all; then In Progress; then Closed/Accepted/Transferred.

CREATE OR REPLACE FUNCTION sync_cis_poam_to_risk_register(
  p_org_id        uuid,
  p_assessment_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  g        RECORD;
  v_title  text;
  v_desc   text;
  v_inherent text;
BEGIN
  FOR g IN
    WITH items AS (
      SELECT
        LPAD(SPLIT_PART(safeguard_id, '.', 1), 2, '0') AS ctrl_num,
        safeguard_id,
        assigned_to,
        target_date,
        risk_rationale,
        created_at,
        CASE
          WHEN risk_decision = 'transfer'                        THEN 'Transferred'
          WHEN status = 'remediated'                             THEN 'Closed'
          WHEN status = 'accepted' OR risk_decision = 'accept'  THEN 'Accepted'
          WHEN status = 'in_progress'                            THEN 'In Progress'
          ELSE 'Open'
        END AS item_status
      FROM cis_poam_items
      WHERE org_id = p_org_id AND assessment_id = p_assessment_id
    )
    SELECT
      ctrl_num,
      COUNT(*)                                                              AS gap_count,
      STRING_AGG(safeguard_id, ', ' ORDER BY safeguard_id)                 AS gap_ids,
      MIN(target_date)                                                      AS target_date,
      (array_agg(assigned_to ORDER BY created_at)
        FILTER (WHERE assigned_to IS NOT NULL))[1]                         AS assigned_to,
      (array_agg(risk_rationale ORDER BY created_at)
        FILTER (WHERE risk_rationale IS NOT NULL
          AND risk_rationale NOT LIKE 'POAM not yet completed%'))[1]       AS risk_rationale,
      CASE
        WHEN bool_or(item_status = 'Open')         THEN 'Open'
        WHEN bool_or(item_status = 'In Progress')  THEN 'In Progress'
        WHEN bool_and(item_status = 'Closed')      THEN 'Closed'
        WHEN bool_and(item_status = 'Accepted')    THEN 'Accepted'
        WHEN bool_and(item_status = 'Transferred') THEN 'Transferred'
        ELSE 'Open'
      END AS agg_status
    FROM items
    GROUP BY ctrl_num
  LOOP
    -- Pull control-level name, threat scenario, and inherent risk rating
    SELECT rcc.control_name, rcc.threat_scenario, rcc.inherent_risk_rating
    INTO v_title, v_desc, v_inherent
    FROM risk_control_categories rcc
    WHERE rcc.control_number = g.ctrl_num
      AND rcc.framework_id = (SELECT id FROM risk_frameworks WHERE code = 'CIS_V8')
    LIMIT 1;

    INSERT INTO risk_register (
      org_id, source, poam_assessment_id, safeguard_id, control_number,
      risk_title, risk_description,
      inherent_risk_rating, risk_status,
      risk_owner, treatment_notes, due_date,
      acceptance_rationale, acceptance_date, resolved_date,
      created_at, updated_at
    ) VALUES (
      p_org_id,
      'cis_poam',
      p_assessment_id,
      NULL,                                          -- safeguard_id NULL: this is control-level
      g.ctrl_num,
      COALESCE(v_title, 'CIS Control ' || g.ctrl_num),
      COALESCE(v_desc, '') ||
        ' (' || g.gap_count ||
        ' safeguard gap' || CASE WHEN g.gap_count != 1 THEN 's' ELSE '' END ||
        ': ' || g.gap_ids || ')',
      COALESCE(v_inherent, 'Medium'),
      g.agg_status,
      g.assigned_to,
      COALESCE(g.risk_rationale, 'POAM not yet completed — assign owner, target date, and risk decision.'),
      g.target_date,
      CASE WHEN g.agg_status IN ('Accepted','Transferred') THEN g.risk_rationale ELSE NULL END,
      CASE WHEN g.agg_status = 'Accepted' THEN NOW() ELSE NULL END,
      CASE WHEN g.agg_status = 'Closed'   THEN NOW() ELSE NULL END,
      NOW(), NOW()
    )
    ON CONFLICT (org_id, control_number) WHERE control_number IS NOT NULL
    DO UPDATE SET
      poam_assessment_id   = EXCLUDED.poam_assessment_id,
      risk_title           = EXCLUDED.risk_title,
      risk_description     = EXCLUDED.risk_description,
      inherent_risk_rating = EXCLUDED.inherent_risk_rating,
      risk_status          = CASE
        WHEN EXCLUDED.risk_status IN ('Closed', 'Transferred')
          THEN EXCLUDED.risk_status
        WHEN risk_register.risk_status = 'Accepted'
          AND EXCLUDED.risk_status NOT IN ('Closed', 'Transferred', 'Accepted')
          THEN 'Accepted'
        ELSE EXCLUDED.risk_status
      END,
      risk_owner        = COALESCE(EXCLUDED.risk_owner,      risk_register.risk_owner),
      treatment_notes   = COALESCE(EXCLUDED.treatment_notes, risk_register.treatment_notes),
      due_date          = COALESCE(EXCLUDED.due_date,        risk_register.due_date),
      acceptance_rationale = COALESCE(EXCLUDED.acceptance_rationale, risk_register.acceptance_rationale),
      acceptance_date   = CASE
        WHEN EXCLUDED.risk_status = 'Accepted' AND risk_register.acceptance_date IS NULL
          THEN NOW() ELSE risk_register.acceptance_date END,
      resolved_date     = CASE
        WHEN EXCLUDED.risk_status = 'Closed' AND risk_register.resolved_date IS NULL
          THEN NOW() ELSE risk_register.resolved_date END,
      updated_at        = NOW();
  END LOOP;
END;
$$;


-- ─── 4. VERIFICATION ─────────────────────────────────────────────────────────
-- After running this patch, go to CIS → open a POAM → Save POAM.
-- Risk Register should show one row per CIS Control with gaps, not per safeguard.
--
-- Check rows after a POAM save:
-- SELECT control_number, risk_title, risk_status, gap_count
-- FROM risk_register WHERE org_id = '<org-uuid>' ORDER BY control_number;
-- (gap_count is embedded in risk_description — check that column)

-- ============================================================
-- END OF PATCH_017
-- ============================================================
