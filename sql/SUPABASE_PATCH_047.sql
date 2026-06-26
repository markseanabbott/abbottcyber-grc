-- ============================================================
-- SUPABASE_PATCH_047.sql
-- Add risk_id: auto-generated human-readable identifier for
-- risk_register rows (e.g. RSK-0001, RSK-0042).
--
-- Run in: Supabase Dashboard → SQL Editor
-- Safe to re-run (all statements are idempotent).
-- ============================================================


-- 1. Create the sequence (starts at 1, never resets)
CREATE SEQUENCE IF NOT EXISTS risk_register_seq START 1;


-- 2. Add the column (nullable so existing rows aren't immediately broken)
ALTER TABLE risk_register ADD COLUMN IF NOT EXISTS risk_id text;


-- 3. Unique constraint (one ID per row globally)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'risk_register_risk_id_key'
  ) THEN
    ALTER TABLE risk_register ADD CONSTRAINT risk_register_risk_id_key UNIQUE (risk_id);
  END IF;
END;
$$;


-- 4. Trigger function: auto-assign RSK-NNNN on INSERT if not supplied
CREATE OR REPLACE FUNCTION tg_risk_register_set_risk_id()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.risk_id IS NULL THEN
    NEW.risk_id := 'RSK-' || LPAD(nextval('risk_register_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tg_risk_register_risk_id ON risk_register;
CREATE TRIGGER tg_risk_register_risk_id
  BEFORE INSERT ON risk_register
  FOR EACH ROW EXECUTE FUNCTION tg_risk_register_set_risk_id();


-- 5. Backfill existing rows (oldest first so IDs are chronologically ordered)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT id FROM risk_register
    WHERE risk_id IS NULL
    ORDER BY created_at ASC
  LOOP
    UPDATE risk_register
    SET risk_id = 'RSK-' || LPAD(nextval('risk_register_seq')::text, 4, '0')
    WHERE id = r.id;
  END LOOP;
END;
$$;


-- ─── VERIFICATION ───────────────────────────────────────────
-- After running, check a sample:
-- SELECT risk_id, risk_title, source, created_at
-- FROM risk_register ORDER BY risk_id LIMIT 20;
--
-- Confirm trigger fires on new inserts by opening CIS → POAM → Save,
-- then check: SELECT risk_id FROM risk_register ORDER BY created_at DESC LIMIT 5;
-- ============================================================
-- END OF PATCH_047
-- ============================================================
