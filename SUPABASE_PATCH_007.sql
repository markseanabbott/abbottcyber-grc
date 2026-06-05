-- SUPABASE_PATCH_007.sql
-- Adds cis_safeguard_notes table for per-safeguard assessor comments and
-- future evidence file attachments (evidence_url, evidence_filename).
-- Run manually in the Supabase SQL Editor. Never run automatically.

CREATE TABLE IF NOT EXISTS cis_safeguard_notes (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id       uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  org_id              uuid NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  safeguard_id        text NOT NULL,
  comment             text,
  evidence_url        text,        -- Supabase Storage path (Phase 2)
  evidence_filename   text,        -- Original filename shown in UI (Phase 2)
  evidence_size_bytes integer,     -- For display / quota checks (Phase 2)
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now(),
  UNIQUE(assessment_id, safeguard_id)
);

ALTER TABLE cis_safeguard_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all" ON cis_safeguard_notes
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE TRIGGER tg_cis_notes_updated_at
  BEFORE UPDATE ON cis_safeguard_notes
  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();
