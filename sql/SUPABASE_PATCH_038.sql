-- SUPABASE_PATCH_038.sql
-- Adds Microsoft Copilot (Free), Microsoft 365 Copilot, Azure AI Foundry,
-- Azure APIM, and Expedient Ctrl AI to the ai_tool_catalog seed data.
-- Azure APIM is seeded as a component child of Azure AI Foundry.
-- Run in Supabase SQL Editor after PATCH_037. No destructive changes.

INSERT INTO ai_tool_catalog (
  id, name, vendor, category, tier, is_component,
  data_in_scope, has_dlp, has_sso, has_logs, has_dpa, has_soc2,
  eu_ai_act, nist_controls, iso42001, default_approval_status, is_seeded, sort_order) VALUES

-- ── Microsoft Copilot (Free / Consumer) ──────────────────────────────────────────
('10000000-0000-0000-0000-000000000018',
 'Copilot (Free)', 'Microsoft', 'AI Assistant', 'Tier 1', false,
 ARRAY['Text','Documents','Images','Web content'],
 false, false, false, false, false,
 'GPAI Model — General Purpose (consumer deployment, no enterprise controls)',
 ARRAY['GV-1.1','MP-1.1','MP-1.2'],
 ARRAY['§6.1.2','§8.2'],
 'not_approved', true, 130),

-- ── Microsoft 365 Copilot (Enterprise / Paid) ────────────────────────────────────
-- Integrated into Word, Excel, PowerPoint, Teams, Outlook, OneNote.
-- Data processed inside Microsoft 365 tenant boundary — no training on enterprise data.
-- DLP via Microsoft Purview, SSO via Entra ID, audit logs in Microsoft Purview Audit.
('10000000-0000-0000-0000-000000000019',
 'Microsoft 365 Copilot', 'Microsoft', 'AI Assistant', 'Tier 1', false,
 ARRAY['Text','Documents','Email','Calendar','Meetings','Teams chats'],
 true, true, true, true, true,
 'GPAI Model — Limited Risk (enterprise M365 boundary)',
 ARRAY['GV-1.1','GV-1.5','GV-1.7','GV-6.1','MP-1.1','MP-1.2','MP-3.5','MP-4.1','MS-2.5','MS-2.6','MG-4.1','MG-4.2'],
 ARRAY['§5.2','§6.1.2','§7.4','§8.2','§8.2.3','§8.2.4','§8.4','§8.5','§8.5.1','§9.1'],
 'approved_enterprise', true, 140),

-- ── Azure AI Foundry (formerly Azure AI Studio) ───────────────────────────────────
-- Developer platform for building, deploying, and governing custom AI solutions.
-- Includes Azure OpenAI Service, AI Search, Prompt Flow, Content Safety, Model Catalog.
-- Data stays within Azure tenant; private endpoints and VNet support available.
('10000000-0000-0000-0000-000000000020',
 'Azure AI Foundry', 'Microsoft', 'AI Platform', 'Tier 1', false,
 ARRAY['Text','Code','Documents','API Data','Training Data','Images'],
 true, true, true, true, true,
 'AI System Development Platform — high flexibility, risk depends on deployed models',
 ARRAY['GV-1.1','GV-1.5','GV-1.7','GV-2.1','GV-6.1','MP-1.1','MP-1.2','MP-3.5','MP-4.1','MP-5.1','MS-2.5','MS-2.6','MS-3.1','MG-4.1','MG-4.2'],
 ARRAY['§5.2','§6.1.2','§6.2','§7.4','§8.2','§8.2.3','§8.2.4','§8.4','§8.5','§8.5.1','§9.1','§9.2'],
 'approved_enterprise', true, 150),

-- ── Azure APIM — AI Gateway (component of Azure AI Foundry) ─────────────────────
-- Azure API Management used as an AI gateway: rate limiting, auth, logging,
-- routing, and policy enforcement for AI API calls (OpenAI, custom models, etc.)
('10000000-0000-0000-0000-000000000021',
 'Azure APIM (AI Gateway)', 'Microsoft', 'AI Platform', 'Tier 1', true,
 ARRAY['API Data','Logs','Metadata'],
 true, true, true, true, true,
 'AI Governance Infrastructure — API security and policy enforcement layer',
 ARRAY['GV-1.7','GV-2.1','MP-4.1','MS-2.5','MS-2.6','MG-3.2','MG-4.2'],
 ARRAY['§8.4','§8.5','§9.1'],
 'approved', true, 151),

-- ── Expedient Ctrl AI ─────────────────────────────────────────────────────────────
-- AI governance and management platform from Expedient (managed IT services).
-- Provides visibility, policy enforcement, and control over AI tool usage
-- across the organization. Acts as a usage monitoring and guardrails layer.
('10000000-0000-0000-0000-000000000022',
 'Ctrl AI', 'Expedient', 'AI Governance Platform', 'Tier 2', false,
 ARRAY['AI Usage Logs','Metadata','Policy Data','Prompts','Outputs'],
 true, true, true, true, false,
 'AI Management System Tool — AI governance and observability layer',
 ARRAY['GV-1.1','GV-1.7','GV-2.1','GV-2.2','GV-3.1','GV-6.1','MP-4.1','MG-1.1','MG-2.2','MG-3.2','MG-4.2','MS-1.1','MS-2.5','MS-2.6'],
 ARRAY['§5.2','§6.1.2','§6.2','§7.4','§8.4','§8.5','§9.1','§9.2','§10.1'],
 'under_review', true, 160);

-- ── Component relationship: Azure APIM is a child of Azure AI Foundry ────────────
INSERT INTO ai_tool_components (parent_id, child_id) VALUES
  ('10000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000021')
ON CONFLICT DO NOTHING;
