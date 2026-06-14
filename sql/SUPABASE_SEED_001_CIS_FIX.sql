-- ============================================================
-- SUPABASE_SEED_001_CIS_FIX.sql
-- Fixes capitalised answer values (Yes/No/Partial) in the 3 seeded
-- CIS assessments for Abbott Cyber Consulting.
-- The CIS scoring function expects lowercase (yes/no/partial).
-- Run once in Supabase SQL Editor.
-- ============================================================

UPDATE assessments
SET answers = (
  SELECT jsonb_object_agg(k, to_jsonb(lower(v #>> '{}')))
  FROM jsonb_each(answers) AS t(k, v)
)
WHERE module = 'cis'
  AND org_id = (SELECT id FROM organisations WHERE name = 'Abbott Cyber Consulting' LIMIT 1);
