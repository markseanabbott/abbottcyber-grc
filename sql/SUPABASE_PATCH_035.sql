-- SUPABASE_PATCH_035.sql
-- Creates ai_tool_catalog and ai_tool_components tables with seeded Tier 1 AI tool data.
-- ai_tool_catalog : master list of AI tools (platform admin editable, all users read)
-- ai_tool_components : many-to-many parent→child relationships between tools
-- Run in Supabase SQL Editor. Safe to re-run (uses IF NOT EXISTS / ON CONFLICT DO NOTHING).

-- ── AI TOOL CATALOG ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ai_tool_catalog (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    text NOT NULL,
  vendor                  text,
  category                text DEFAULT 'Foundation LLM',
  tier                    text DEFAULT 'Tier 1',
  is_component            boolean DEFAULT false,
  data_in_scope           text[],
  has_dlp                 boolean DEFAULT false,
  has_sso                 boolean DEFAULT false,
  has_logs                boolean DEFAULT false,
  has_dpa                 boolean DEFAULT false,
  has_soc2                boolean DEFAULT false,
  eu_ai_act               text,
  nist_controls           text[],
  iso42001                text[],
  default_approval_status text CHECK (default_approval_status IN (
                            'approved','approved_enterprise','approved_self_hosted',
                            'conditional','not_approved','under_review'
                          )) DEFAULT 'under_review',
  description             text,
  is_seeded               boolean DEFAULT true,
  sort_order              integer DEFAULT 0,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
);

-- ── AI TOOL COMPONENTS (many-to-many parent → child) ─────────────────────────────

CREATE TABLE IF NOT EXISTS ai_tool_components (
  parent_id   uuid NOT NULL REFERENCES ai_tool_catalog(id) ON DELETE CASCADE,
  child_id    uuid NOT NULL REFERENCES ai_tool_catalog(id) ON DELETE CASCADE,
  PRIMARY KEY (parent_id, child_id)
);

-- ── TRIGGER: auto-update updated_at ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION tg_touch_ai_tool_catalog()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_ai_tool_catalog_updated ON ai_tool_catalog;
CREATE TRIGGER trg_ai_tool_catalog_updated
  BEFORE UPDATE ON ai_tool_catalog
  FOR EACH ROW EXECUTE FUNCTION tg_touch_ai_tool_catalog();

-- ── RLS ──────────────────────────────────────────────────────────────────────────

ALTER TABLE ai_tool_catalog    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_components ENABLE ROW LEVEL SECURITY;

-- Anon: read-only (catalog is public reference data)
DROP POLICY IF EXISTS "anon_read_ai_tool_catalog"    ON ai_tool_catalog;
DROP POLICY IF EXISTS "anon_read_ai_tool_components" ON ai_tool_components;
CREATE POLICY "anon_read_ai_tool_catalog"    ON ai_tool_catalog    FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_ai_tool_components" ON ai_tool_components FOR SELECT TO anon USING (true);

-- Authenticated: full access (app layer enforces platform-admin-only writes)
DROP POLICY IF EXISTS "auth_all_ai_tool_catalog"    ON ai_tool_catalog;
DROP POLICY IF EXISTS "auth_all_ai_tool_components" ON ai_tool_components;
CREATE POLICY "auth_all_ai_tool_catalog"    ON ai_tool_catalog    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_ai_tool_components" ON ai_tool_components FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── SEED DATA ─────────────────────────────────────────────────────────────────────
-- Fixed UUIDs so component relationships resolve correctly.

INSERT INTO ai_tool_catalog (id, name, vendor, category, tier, is_component,
  data_in_scope, has_dlp, has_sso, has_logs, has_dpa, has_soc2,
  eu_ai_act, nist_controls, iso42001, default_approval_status, sort_order) VALUES

-- ── OpenAI ──────────────────────────────────────────────────────────────────────
('10000000-0000-0000-0000-000000000001',
 'OpenAI GPT-4o / API', 'OpenAI', 'Foundation LLM', 'Tier 1', false,
 ARRAY['Text','Code','Images','Audio'],
 false, false, true, true, true,
 'GPAI Model',
 ARRAY['GV-1.5','GV-6.1','MP-1.1','MP-1.2','MP-3.5','MP-4.1','MP-5.1','MS-2.5','MS-3.1','MG-4.1'],
 ARRAY['§6.1.2','§8.2','§8.2.3','§8.2.4','§8.4','§8.5','§8.5.1'],
 'approved_enterprise', 10),

('10000000-0000-0000-0000-000000000002',
 'ChatGPT Enterprise', 'OpenAI', 'Foundation LLM', 'Tier 1', false,
 ARRAY['Text','Documents','Code','Images'],
 true, true, true, true, true,
 'GPAI Model — Limited Risk deployment',
 ARRAY['GV-1.1','GV-1.5','GV-1.7','MP-1.1','MP-1.2','MP-3.5','MS-2.5','MS-2.6','MG-4.1','MG-4.2'],
 ARRAY['§6.1.2','§7.4','§8.2','§8.2.4','§8.4','§8.5','§8.5.1','§9.1'],
 'approved', 20),

('10000000-0000-0000-0000-000000000003',
 'ChatGPT Team', 'OpenAI', 'Foundation LLM', 'Tier 1', false,
 ARRAY['Text','Documents','Code'],
 false, true, true, true, false,
 'GPAI Model — Limited Risk',
 ARRAY['GV-1.1','GV-1.5','MP-1.1','MP-1.2','MS-2.5','MG-4.1'],
 ARRAY['§6.1.2','§8.2','§8.4','§8.5.1'],
 'conditional', 30),

('10000000-0000-0000-0000-000000000004',
 'ChatGPT (Consumer / Free)', 'OpenAI', 'Foundation LLM', 'Tier 1', false,
 ARRAY['Unclassified text only'],
 false, false, false, false, false,
 'GPAI Model — uncontrolled deployment',
 ARRAY['GV-1.1','MP-1.1'],
 ARRAY['§8.2'],
 'not_approved', 40),

-- ── Anthropic Claude ─────────────────────────────────────────────────────────────
('10000000-0000-0000-0000-000000000005',
 'Claude (Anthropic API / Enterprise)', 'Anthropic', 'Foundation LLM', 'Tier 1', false,
 ARRAY['Text','Documents','Code','Images'],
 false, true, true, true, true,
 'GPAI Model',
 ARRAY['GV-1.5','GV-6.1','MP-1.1','MP-1.2','MP-3.5','MP-4.1','MS-2.5','MS-3.1','MG-4.1','MG-4.2'],
 ARRAY['§6.1.2','§8.2','§8.2.3','§8.2.4','§8.4','§8.5','§8.5.1'],
 'approved_enterprise', 50),

('10000000-0000-0000-0000-000000000006',
 'Claude.ai Free', 'Anthropic', 'Foundation LLM', 'Tier 1', false,
 ARRAY['Unclassified text only'],
 false, false, false, false, false,
 'GPAI Model — uncontrolled consumer deployment',
 ARRAY['GV-1.1','MP-1.1'],
 ARRAY['§8.2'],
 'not_approved', 60),

('10000000-0000-0000-0000-000000000007',
 'Claude.ai Pro', 'Anthropic', 'Foundation LLM', 'Tier 1', false,
 ARRAY['Text','Documents','Code'],
 false, false, false, false, false,
 'GPAI Model — consumer deployment',
 ARRAY['GV-1.1','MP-1.1'],
 ARRAY['§8.2'],
 'conditional', 70),

('10000000-0000-0000-0000-000000000008',
 'Claude.ai Max', 'Anthropic', 'Foundation LLM', 'Tier 1', false,
 ARRAY['Text','Documents','Code','Images'],
 false, false, false, false, false,
 'GPAI Model — consumer deployment',
 ARRAY['GV-1.1','MP-1.1','MP-1.2'],
 ARRAY['§8.2'],
 'conditional', 80),

('10000000-0000-0000-0000-000000000009',
 'Claude.ai Team', 'Anthropic', 'Foundation LLM', 'Tier 1', false,
 ARRAY['Text','Documents','Code','Images'],
 false, true, true, true, false,
 'GPAI Model — Limited Risk',
 ARRAY['GV-1.1','GV-1.5','MP-1.1','MP-1.2','MS-2.5','MG-4.1'],
 ARRAY['§6.1.2','§8.2','§8.4','§8.5.1'],
 'conditional', 90),

-- Claude components (is_component = true — sub-applications within Claude subscriptions)
('10000000-0000-0000-0000-000000000014',
 'claude.ai (Web)', 'Anthropic', 'AI Application', 'Tier 1', true,
 ARRAY['Text','Documents','Code','Images'],
 false, false, false, false, false,
 'GPAI Model — Limited Risk',
 ARRAY['GV-1.1','MP-1.1'],
 ARRAY['§8.2'],
 'conditional', 51),

('10000000-0000-0000-0000-000000000015',
 'claude.ai (Desktop)', 'Anthropic', 'AI Application', 'Tier 1', true,
 ARRAY['Text','Documents','Code','Images'],
 false, false, false, false, false,
 'GPAI Model — Limited Risk',
 ARRAY['GV-1.1','MP-1.1'],
 ARRAY['§8.2'],
 'conditional', 52),

('10000000-0000-0000-0000-000000000016',
 'Claude Cowork', 'Anthropic', 'AI Application', 'Tier 1', true,
 ARRAY['Text','Documents','Code','Images'],
 false, false, false, false, false,
 'GPAI Model — Limited Risk',
 ARRAY['GV-1.1','MP-1.1'],
 ARRAY['§8.2'],
 'conditional', 53),

('10000000-0000-0000-0000-000000000017',
 'Claude Code', 'Anthropic', 'AI Application', 'Tier 1', true,
 ARRAY['Text','Code'],
 false, false, false, false, false,
 'GPAI Model',
 ARRAY['GV-1.1','MP-1.1','MP-1.2'],
 ARRAY['§8.2'],
 'conditional', 54),

-- ── Google ───────────────────────────────────────────────────────────────────────
('10000000-0000-0000-0000-000000000010',
 'Google Gemini (API / Vertex AI)', 'Google', 'Foundation LLM', 'Tier 1', false,
 ARRAY['Text','Code','Images','Audio','Video'],
 true, true, true, true, true,
 'GPAI Model',
 ARRAY['GV-1.5','GV-6.1','MP-1.1','MP-1.2','MP-3.5','MP-4.1','MS-2.1','MS-2.5','MS-3.1','MG-4.1'],
 ARRAY['§6.1.2','§8.2','§8.2.4','§8.4','§8.5','§9.1'],
 'approved_enterprise', 100),

('10000000-0000-0000-0000-000000000011',
 'Google Gemini (Consumer / Workspace add-ons)', 'Google', 'Foundation LLM', 'Tier 1', false,
 ARRAY['Text','Email','Docs','Drive'],
 false, true, false, true, false,
 'GPAI — Limited Risk',
 ARRAY['GV-1.1','GV-1.5','MP-1.1'],
 ARRAY['§8.2','§8.4'],
 'conditional', 110),

-- ── Meta ─────────────────────────────────────────────────────────────────────────
('10000000-0000-0000-0000-000000000012',
 'Meta Llama (Self-hosted)', 'Meta AI', 'Foundation LLM — Open Weights', 'Tier 1', false,
 ARRAY['Text','Code','Documents'],
 true, false, false, false, false,
 'GPAI Model — operator controls apply',
 ARRAY['GV-1.5','MP-1.1','MP-1.2','MP-3.5','MP-4.1','MP-5.1','MS-2.5','MS-2.6','MG-1.1','MG-4.2'],
 ARRAY['§6.1.2','§8.2','§8.2.3','§8.5','§8.5.1','§9.1'],
 'approved_self_hosted', 120),

-- ── Mistral ───────────────────────────────────────────────────────────────────────
('10000000-0000-0000-0000-000000000013',
 'Mistral (API / Self-hosted)', 'Mistral AI', 'Foundation LLM', 'Tier 1', false,
 ARRAY['Text','Code'],
 true, false, true, true, false,
 'GPAI Model — EU-based vendor',
 ARRAY['GV-1.5','MP-1.1','MP-1.2','MP-3.5','MP-4.1','MS-2.5','MG-4.1'],
 ARRAY['§6.1.2','§8.2','§8.4'],
 'under_review', 130)

ON CONFLICT (id) DO NOTHING;

-- ── COMPONENT RELATIONSHIPS ───────────────────────────────────────────────────────
-- Claude paid tiers (Enterprise, Max, Team) → 4 Claude application components
-- OpenAI GPT-4o API → ChatGPT Enterprise, ChatGPT Team (access tiers)
-- Google Gemini API → Gemini Consumer / Workspace add-ons

INSERT INTO ai_tool_components (parent_id, child_id) VALUES
  -- Claude (Enterprise) → all 4 components
  ('10000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000014'),
  ('10000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000015'),
  ('10000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000016'),
  ('10000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000017'),
  -- Claude.ai Max → web + desktop + Cowork + Code
  ('10000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000014'),
  ('10000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000015'),
  ('10000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000016'),
  ('10000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000017'),
  -- Claude.ai Team → web + desktop + Cowork (Code is Enterprise/Max only)
  ('10000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000014'),
  ('10000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000015'),
  ('10000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000016'),
  -- OpenAI GPT-4o API → ChatGPT Enterprise, ChatGPT Team
  ('10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003'),
  -- Google Gemini (API / Vertex AI) → Consumer / Workspace add-ons
  ('10000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000011')
ON CONFLICT DO NOTHING;
