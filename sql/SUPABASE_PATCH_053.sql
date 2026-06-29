-- SUPABASE_PATCH_053.sql
-- Fixes Commonwealth English spellings in PATCH_051 scenario data.
-- Converts all British spellings to US English across title, summary,
-- declaration, and injects fields for the 8 platform scenarios.
-- Safe to re-run (idempotent — replace on already-correct text is a no-op).

UPDATE tabletop_scenarios
SET
  -- Fix title (text field)
  title = replace(replace(replace(replace(replace(
    title,
    'Authorised',  'Authorized'),
    'authorised',  'authorized'),
    'Authorising', 'Authorizing'),
    'authorising', 'authorizing'),
    'Authorise',   'Authorize'),

  -- Fix summary (text field)
  summary = replace(replace(replace(replace(replace(replace(replace(
    summary,
    'organisation',  'organization'),
    'Organisation',  'Organization'),
    'authorising',   'authorizing'),
    'Authorising',   'Authorizing'),
    'programme',     'program'),
    'Programme',     'Program'),
    'labour',        'labor'),

  -- Fix declaration jsonb
  declaration = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
    declaration::text,
    'Authorisation',   'Authorization'),
    'authorisation',   'authorization'),
    'Authorising',     'Authorizing'),
    'authorising',     'authorizing'),
    'Authorised',      'Authorized'),
    'authorised',      'authorized'),
    'Authorise',       'Authorize'),
    'authorise',       'authorize'),
    'organisational',  'organizational'),
    'Organisational',  'Organizational'),
    'organisation',    'organization'),
    'Organisation',    'Organization'),
    'Programme',       'Program'),
    'programme',       'program'),
    'Labour',          'Labor'),
    'labour',          'labor'),
    'Prioritisation',  'Prioritization'),
    'prioritisation',  'prioritization'),
    'Prioritised',     'Prioritized'),
    'prioritised',     'prioritized'),
    'Prioritise',      'Prioritize'),
    'prioritise',      'prioritize'),
    'minimising',      'minimizing'),
    'Minimising',      'Minimizing'),
    'minimise',        'minimize'),
    'Minimise',        'Minimize'),
    'wilful',          'willful'),
    'offence',         'offense'),
    'colour',          'color'),
    'enquiries',       'inquiries')
    )::jsonb,

  -- Fix injects jsonb (same replacements)
  injects = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
    injects::text,
    'Authorisation',   'Authorization'),
    'authorisation',   'authorization'),
    'Authorising',     'Authorizing'),
    'authorising',     'authorizing'),
    'Authorised',      'Authorized'),
    'authorised',      'authorized'),
    'Authorise',       'Authorize'),
    'authorise',       'authorize'),
    'organisational',  'organizational'),
    'Organisational',  'Organizational'),
    'organisation',    'organization'),
    'Organisation',    'Organization'),
    'Programme',       'Program'),
    'programme',       'program'),
    'Labour',          'Labor'),
    'labour',          'labor'),
    'Prioritisation',  'Prioritization'),
    'prioritisation',  'prioritization'),
    'Prioritised',     'Prioritized'),
    'prioritised',     'prioritized'),
    'Prioritise',      'Prioritize'),
    'prioritise',      'prioritize'),
    'minimising',      'minimizing'),
    'Minimising',      'Minimizing'),
    'minimise',        'minimize'),
    'Minimise',        'Minimize'),
    'wilful',          'willful'),
    'offence',         'offense'),
    'colour',          'color'),
    'enquiries',       'inquiries'),
    'Analyse',         'Analyze')
    )::jsonb

WHERE source_id IN (
  'bcdr_dc_failure',
  'bcdr_critical_vendor',
  'exec_ransom_decision',
  'exec_breach_comm',
  'ai_tool_shadow',
  'ai_deepfake_fraud',
  'pci_card_skimmer',
  'pci_pan_in_logs'
);

-- Verify title fix
SELECT source_id, title FROM tabletop_scenarios
WHERE source_id IN (
  'bcdr_dc_failure','bcdr_critical_vendor',
  'exec_ransom_decision','exec_breach_comm',
  'ai_tool_shadow','ai_deepfake_fraud',
  'pci_card_skimmer','pci_pan_in_logs'
)
ORDER BY created_at;
