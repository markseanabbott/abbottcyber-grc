-- SUPABASE_PATCH_045: Regulatory scope fields for Application Inventory
-- Adds granular regulatory framework tagging (SOX, PCI-DSS, HIPAA, PIPEDA, + custom text)
-- Run manually in the Supabase SQL Editor.

ALTER TABLE app_inventory
  ADD COLUMN IF NOT EXISTS regulatory_scope      jsonb  DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS regulatory_scope_other text;

COMMENT ON COLUMN app_inventory.regulatory_scope       IS 'Array of regulatory framework names this app is in scope for, e.g. ["SOX","PCI-DSS"]';
COMMENT ON COLUMN app_inventory.regulatory_scope_other IS 'Freetext for any additional regulatory frameworks not covered by the standard list';
