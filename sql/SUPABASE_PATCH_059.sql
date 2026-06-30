-- SUPABASE_PATCH_059.sql
-- Backfill exercise_score for all completed tabletop sessions.
-- Strategy:
--   1. Add exercise_score column (IF NOT EXISTS, safe repeat of PATCH_057).
--   2. Extract from exercise_log if ttFinalise was already called (exact stored score).
--   3. Compute from tabletop_responses + tabletop_notif_checks using
--      hardcoded correct values per scenario (matches JS ttComputeExerciseScore formula).
-- Safe to re-run — only updates rows where exercise_score IS NULL.

-- ── Step 1: ensure column exists ────────────────────────────────────────────
ALTER TABLE tabletop_sessions
  ADD COLUMN IF NOT EXISTS exercise_score integer;

-- ── Step 2: extract from exercise_log where available ───────────────────────
-- Covers sessions where "Mark exercise complete" was already clicked after
-- PATCH_057 was applied. exercise_log entry: { type: "exercise_complete",
-- detail: { exercise_score: N } }
UPDATE tabletop_sessions
SET exercise_score = (
  SELECT (entry -> 'detail' ->> 'exercise_score')::integer
  FROM   jsonb_array_elements(exercise_log) AS entry
  WHERE  entry ->> 'type' = 'exercise_complete'
    AND  entry -> 'detail' ->> 'exercise_score' IS NOT NULL
  LIMIT  1
)
WHERE status = 'complete'
  AND exercise_score IS NULL
  AND exercise_log IS NOT NULL
  AND jsonb_array_length(exercise_log) > 0;

-- ── Step 3: compute from stored response / notif data ───────────────────────
-- Uses the same 4-dimension weighted formula as ttComputeExerciseScore():
--   Criticality accuracy   35%   (tabletop_responses vs hardcoded correct per scenario+inject)
--   Declaration quality    30%   (tl_severity + tl_declare vs hardcoded correct per scenario)
--   IR phase coverage      20%   (simplified: any responses = 100%, none = 0%)
--   Notification complete  15%   (tabletop_notif_checks checked / total)

WITH

-- ── Hardcoded correct declaration values per scenario ──────────────────────
correct_decl(scenario_id, correct_severity, correct_declare) AS (
  VALUES
    ('ransom_phish',          'P1', true),
    ('bec_wire',              'P2', true),
    ('overnight_vishing',     'P2', true),
    ('pos_compromise',        'P1', true),
    ('msp_rma_pivot',         'P1', true),
    ('reservation_data_leak', 'P1', true),
    ('ddos_extortion',        'P2', false),
    ('aitm_cred_theft',       'P2', true),
    ('reg_audit_surprise',    'P2', false),
    ('insider_threat',        'P2', false),
    ('cloud_misconfig',       'P2', true),
    ('supply_chain_sw',       'P2', true),
    ('bcdr_dc_outage',        'P2', false),
    ('bcdr_power_failure',    'P2', false),
    ('bcdr_keyman',           'P2', false),
    ('bcdr_supplier',         'P2', false),
    ('bcdr_site_loss',        'P1', true)
),

-- ── Hardcoded correct criticality per (scenario, inject_index) ─────────────
correct_crit(scenario_id, inject_index, correct_criticality) AS (
  VALUES
    -- ransom_phish (5 injects)
    ('ransom_phish', 0, 'Critical'),
    ('ransom_phish', 1, 'Critical'),
    ('ransom_phish', 2, 'Critical'),
    ('ransom_phish', 3, 'Critical'),
    ('ransom_phish', 4, 'High'),
    -- bec_wire (4 injects)
    ('bec_wire', 0, 'High'),
    ('bec_wire', 1, 'Critical'),
    ('bec_wire', 2, 'Critical'),
    ('bec_wire', 3, 'Medium'),
    -- overnight_vishing (4 injects)
    ('overnight_vishing', 0, 'Critical'),
    ('overnight_vishing', 1, 'Critical'),
    ('overnight_vishing', 2, 'Critical'),
    ('overnight_vishing', 3, 'High'),
    -- pos_compromise (4 injects)
    ('pos_compromise', 0, 'Critical'),
    ('pos_compromise', 1, 'Critical'),
    ('pos_compromise', 2, 'High'),
    ('pos_compromise', 3, 'High')
),

-- ── Criticality accuracy per session ──────────────────────────────────────
crit_agg AS (
  SELECT
    r.session_id,
    COUNT(*) FILTER (WHERE r.criticality IS NOT NULL)                                       AS total_ratings,
    COUNT(*) FILTER (WHERE r.criticality IS NOT NULL
                       AND r.criticality = cc.correct_criticality)                          AS correct_ratings
  FROM tabletop_responses r
  JOIN tabletop_sessions  s  ON s.id = r.session_id
  JOIN correct_crit       cc ON cc.scenario_id   = s.scenario_id
                             AND cc.inject_index  = r.inject_index
  GROUP BY r.session_id
),

-- ── Notif completeness per session ─────────────────────────────────────────
notif_agg AS (
  SELECT
    session_id,
    COUNT(*) FILTER (WHERE checked = true) AS checked_count,
    COUNT(*)                               AS total_count
  FROM tabletop_notif_checks
  GROUP BY session_id
),

-- ── Assemble all components ────────────────────────────────────────────────
computed AS (
  SELECT
    s.id AS session_id,

    -- Declaration quality (30%): severity 15pt + declare 15pt → 0 / 50 / 100
    (
      CASE WHEN s.tl_severity = cd.correct_severity       THEN 50 ELSE 0 END +
      CASE WHEN COALESCE(s.tl_declare, false) = cd.correct_declare THEN 50 ELSE 0 END
    )::numeric AS decl_score,

    -- Criticality accuracy (35%): correct / total rated, 0 if no ratings
    CASE
      WHEN ca.total_ratings > 0
        THEN ROUND((ca.correct_ratings::numeric / ca.total_ratings) * 100)
      ELSE 0
    END AS crit_score,

    -- IR phase coverage (20%): simplified — any responses submitted = 100%
    CASE WHEN COALESCE(ca.total_ratings, 0) > 0 THEN 100 ELSE 0 END AS phase_score,

    -- Notification completeness (15%)
    CASE
      WHEN COALESCE(na.total_count, 0) > 0
        THEN ROUND((na.checked_count::numeric / na.total_count) * 100)
      ELSE 0
    END AS notif_score

  FROM tabletop_sessions s
  LEFT JOIN correct_decl cd ON cd.scenario_id = s.scenario_id
  LEFT JOIN crit_agg     ca ON ca.session_id  = s.id
  LEFT JOIN notif_agg    na ON na.session_id  = s.id
  WHERE s.status = 'complete'
    AND s.exercise_score IS NULL
)

UPDATE tabletop_sessions ts
SET exercise_score = GREATEST(0, LEAST(100,
  ROUND(
    c.crit_score  * 0.35 +
    c.decl_score  * 0.30 +
    c.phase_score * 0.20 +
    c.notif_score * 0.15
  )::integer
))
FROM computed c
WHERE ts.id = c.session_id;
