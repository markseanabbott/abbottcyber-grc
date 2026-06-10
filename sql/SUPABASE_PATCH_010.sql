-- ============================================================
-- SUPABASE_PATCH_010
-- Purpose: Generic framework_notes table for AI framework assessments
--          (NIST AI RMF, ISO 42001, future frameworks)
--          + ai_rmf_profile column on organisation_profiles
-- Run manually in Supabase SQL Editor.
-- ============================================================

-- ── framework_notes ──────────────────────────────────────────
-- Org-scoped notes per framework control item.
-- Persists across assessment runs (not tied to a specific assessment_id).
CREATE TABLE IF NOT EXISTS framework_notes (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id            uuid REFERENCES organisations(id) ON DELETE CASCADE NOT NULL,
  module            text NOT NULL,          -- 'nist_ai' | 'iso42001' | future
  item_id           text NOT NULL,          -- e.g. 'GOVERN-1.1' or '4.1'
  note              text,
  evidence_url      text,
  evidence_filename text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  UNIQUE(org_id, module, item_id)
);

ALTER TABLE framework_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_framework_notes"  ON framework_notes FOR SELECT TO anon        USING (true);
CREATE POLICY "anon_write_framework_notes" ON framework_notes FOR ALL    TO anon        USING (true) WITH CHECK (true);
CREATE POLICY "auth_read_framework_notes"  ON framework_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_write_framework_notes" ON framework_notes FOR ALL    TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER tg_framework_notes_updated_at
  BEFORE UPDATE ON framework_notes
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();

-- ── organisation_profiles: add ai_rmf_profile ────────────────
ALTER TABLE organisation_profiles
  ADD COLUMN IF NOT EXISTS ai_rmf_profile text
  CHECK (ai_rmf_profile IN ('developing', 'implementing', 'optimizing'));
