-- ============================================================
-- SUPABASE_PATCH_005 — Third-Party Risk Assessment (TPRA)
-- Run this in the Supabase SQL Editor.
-- ============================================================

-- vendor_assessments: one row per vendor assessment per org
CREATE TABLE IF NOT EXISTS vendor_assessments (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id              UUID          REFERENCES organisations(id) ON DELETE CASCADE,
  vendor_name         TEXT          NOT NULL,
  product_name        TEXT          DEFAULT '',
  website             TEXT          DEFAULT '',
  assessor            TEXT          DEFAULT '',

  -- Assessment status
  status              TEXT          DEFAULT 'draft'
                                    CHECK (status IN ('draft', 'complete')),

  -- Risk tier and rationale
  tier                TEXT          CHECK (tier IN ('Critical', 'High', 'Moderate', 'Low')),
  tier_rationale      TEXT          DEFAULT '',

  -- Data context
  jurisdiction        TEXT          DEFAULT '',
  data_residency      TEXT          DEFAULT '',
  data_categories     JSONB         DEFAULT '[]',   -- array of category IDs
  provided_docs       TEXT          DEFAULT '',      -- notes on gated docs the client provided

  -- Vendor profile (JSONB keyed by attribute)
  vendor_profile      JSONB         DEFAULT '{}',   -- { legal_entity, founded, size, ... }
  profile_confidence  JSONB         DEFAULT '{}',   -- { legal_entity: 'Verified'|'Inferred'|'Unknown', ... }

  -- Risk findings
  findings            JSONB         DEFAULT '[]',   -- array of { area, severity, confidence, applies_to, detail, recommendation }

  -- Outputs
  recommendations     TEXT          DEFAULT '',
  outstanding_items   JSONB         DEFAULT '[]',   -- array of strings (vendor follow-up questions)

  -- Timestamps
  created_at          TIMESTAMPTZ   DEFAULT NOW(),
  completed_at        TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- Row Level Security (matches pattern used by all other tables in this project)
ALTER TABLE vendor_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access — vendor_assessments"
  ON vendor_assessments
  FOR ALL
  USING (true);

-- Index for fast per-org lookups
CREATE INDEX IF NOT EXISTS vendor_assessments_org_id_idx
  ON vendor_assessments (org_id);
