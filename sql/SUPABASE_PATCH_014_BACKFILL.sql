-- ============================================================
-- SUPABASE_PATCH_014_BACKFILL.sql
-- One-time backfill: populate risk_register for all orgs that
-- already have CIS assessments saved before PATCH_014 was run.
--
-- Run AFTER SUPABASE_PATCH_014.sql has been applied.
-- Safe to run multiple times (initialize uses ON CONFLICT DO UPDATE).
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- This block finds the most recent CIS assessment per org,
-- then calls initialize_risk_register + recalculate_risk_register
-- for each one. All existing answer data is carried through.

DO $$
DECLARE
  r      RECORD;
  v_ig   integer;
  v_count integer := 0;
BEGIN
  FOR r IN
    SELECT DISTINCT ON (a.org_id)
      a.org_id,
      a.id            AS assessment_id,
      a.assessed_at,
      o.name          AS org_name
    FROM assessments a
    JOIN organisations o ON o.id = a.org_id
    WHERE a.module = 'cis'
    ORDER BY a.org_id, a.assessed_at DESC
  LOOP
    -- Resolve current IG goal from organisation_profiles (default IG1 if not set)
    SELECT
      CASE cis_goal WHEN 'ig1' THEN 1 WHEN 'ig2' THEN 2 WHEN 'ig3' THEN 3 ELSE 1 END
    INTO v_ig
    FROM organisation_profiles
    WHERE org_id = r.org_id;

    IF v_ig IS NULL THEN v_ig := 1; END IF;

    -- Create (or refresh) the 18 risk_register rows for this org
    PERFORM initialize_risk_register(r.org_id, r.assessment_id, v_ig);

    -- Score all 18 rows from the stored assessment answers
    PERFORM recalculate_risk_register(r.org_id, r.assessment_id);

    v_count := v_count + 1;
    RAISE NOTICE 'Backfilled: % (IG%) — assessment %', r.org_name, v_ig, r.assessment_id;
  END LOOP;

  RAISE NOTICE '--- Backfill complete: % org(s) processed ---', v_count;
END $$;


-- ============================================================
-- VERIFICATION — run this after the DO block to confirm results
-- ============================================================

-- Count of rows created (should be 18 × number of orgs processed):
-- SELECT COUNT(*) FROM risk_register;

-- Summary per org:
-- SELECT o.name, rcc.control_number, rr.inherent_risk_rating,
--        rr.calculated_risk_rating, rr.calculated_risk_score,
--        rr.finding_count_pass, rr.finding_count_fail, rr.risk_status
-- FROM risk_register rr
-- JOIN organisations o ON o.id = rr.org_id
-- JOIN risk_control_categories rcc ON rcc.id = rr.control_category_id
-- ORDER BY o.name, rcc.display_order;

-- ============================================================
-- END OF BACKFILL
-- ============================================================
