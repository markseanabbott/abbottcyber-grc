-- SUPABASE_PATCH_046: AI Tool → Application Inventory link + regulatory scope on ai_org_tools
-- Adds an optional FK so an AI tool entry can be linked to a parent Application Inventory record.
-- Also adds granular regulatory scope tagging (SOX, PCI-DSS, HIPAA, PIPEDA + freetext Other).
-- Run manually in the Supabase SQL Editor.

ALTER TABLE ai_org_tools
  ADD COLUMN IF NOT EXISTS app_inventory_id    uuid REFERENCES app_inventory(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS regulatory_scope      jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS regulatory_scope_other text;

COMMENT ON COLUMN ai_org_tools.app_inventory_id     IS 'Optional FK to app_inventory — links this AI tool to its parent application entry. BCDR/criticality can be inherited from there.';
COMMENT ON COLUMN ai_org_tools.regulatory_scope     IS 'Array of regulatory framework names this AI tool is in scope for, e.g. ["SOX","PCI-DSS"]';
COMMENT ON COLUMN ai_org_tools.regulatory_scope_other IS 'Freetext for any additional regulatory frameworks not covered by the standard list';
