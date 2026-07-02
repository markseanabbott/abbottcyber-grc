-- ============================================================
-- TB Story Board  ->  backlog_items rows
-- Inserts the 13 tabletop card/story-system items in build order.
-- Run in the Supabase SQL Editor.
--
-- Table name confirmed: public.backlog_items
-- section_phase = 3 (tabletop track, per CLAUDE.md)
-- status = 'add' (valid per backlog_items_status_check)
-- created_at / updated_at fall back to defaults (now())
-- ============================================================

INSERT INTO public.backlog_items
  (id, section_id, section_title, section_phase, sort_order, text, done, priority, dependencies, status)
VALUES
  ('TB1', 'tb_storyboard', 'TB Story Board', 3, 1,
   'TB1 - Precedence data model: add fields to the inject object (chainStage, requires[], grants[], scenarioTypes[], track). Foundation - every later item depends on this.',
   false, 'Critical', '[]'::jsonb, 'add'),

  ('TB2', 'tb_storyboard', 'TB Story Board', 3, 2,
   'TB2 - Kill chain sequences per archetype: define 3 to 5 fixed ATT&CK-ordered chains each for ransomware, BEC, insider, vendor compromise. Chain order is the precedence backbone.',
   false, 'High', '["TB1"]'::jsonb, 'add'),

  ('TB3', 'tb_storyboard', 'TB Story Board', 3, 3,
   'TB3 - Kickoff story pool: 3 to 5 opener stories per archetype (initial access vector plus business framing). Launch with ransomware, BEC, and one more = 6 to 9 stories. Industry flavor is parameterization, not extra stories.',
   false, 'High', '["TB1"]'::jsonb, 'add'),

  ('TB4', 'tb_storyboard', 'TB Story Board', 3, 4,
   'TB4 - Haiku offline authoring plus curation: bulk-draft inject bodies and rolePrompts along each chain with Haiku, then human-review into the static deck. Nothing unreviewed is shown to clients.',
   false, 'High', '["TB2","TB3"]'::jsonb, 'add'),

  ('TB5', 'tb_storyboard', 'TB Story Board', 3, 5,
   'TB5 - Precedence selection engine: at runtime filter the deck to cards whose requires-tags are met and scenario matches, then pick weighted by role and random. Lightweight state machine, no live AI.',
   false, 'High', '["TB1","TB4"]'::jsonb, 'add'),

  ('TB6', 'tb_storyboard', 'TB Story Board', 3, 6,
   'TB6 - Response card library: author action cards scoped by role x NIST phase x scenario type, roughly 8 to 12 per role per phase, including plausible-but-wrong distractor cards.',
   false, 'High', '["TB1"]'::jsonb, 'add'),

  ('TB7', 'tb_storyboard', 'TB Story Board', 3, 7,
   'TB7 - Appropriateness matrix: map each response card x scenario x phase to correct / defensible-partial / inappropriate / not-applicable. Encodes rules like BEC does not need endpoint isolation.',
   false, 'High', '["TB6"]'::jsonb, 'add'),

  ('TB8', 'tb_storyboard', 'TB Story Board', 3, 8,
   'TB8 - New Supabase table tabletop_card_plays (session_id, inject_index, role_id, player_name, card_ids jsonb, comment, appropriateness jsonb). Write as the next numbered SQL patch; Mark runs it.',
   false, 'High', '["TB6"]'::jsonb, 'add'),

  ('TB9', 'tb_storyboard', 'TB Story Board', 3, 9,
   'TB9 - Card hand UI in the inject view: deal the role/phase/scenario-filtered hand, let the player select cards plus add a comment plus submit. Role-scoped to preserve the fog of war.',
   false, 'High', '["TB6","TB8"]'::jsonb, 'add'),

  ('TB10', 'tb_storyboard', 'TB Story Board', 3, 10,
   'TB10 - Scoring plus AAR integration: grade the played hand against the appropriateness matrix (correct +, missed critical -, inappropriate -, partial credit) and feed into the existing rubric and AAR.',
   false, 'High', '["TB7","TB9"]'::jsonb, 'add'),

  ('TB11', 'tb_storyboard', 'TB Story Board', 3, 11,
   'TB11 - Randomized run mode (facilitated): facilitator picks the archetype, system randomizes which story and chain within it. Full randomness is reserved for autonomous mode.',
   false, 'Medium', '["TB3","TB5"]'::jsonb, 'add'),

  ('TB12', 'tb_storyboard', 'TB Story Board', 3, 12,
   'TB12 - BCDR track generalization: use the track field to add a BCDR sequence (Impact, Assess, Activate BCP, Failover, Recover, Resume, Review), BCDR response cards, and a BCDR appropriateness map. Same engine, different content.',
   false, 'Medium', '["TB1","TB6","TB7"]'::jsonb, 'add'),

  ('TB13', 'tb_storyboard', 'TB Story Board', 3, 13,
   'TB13 - Fully autonomous mode (future state): no facilitator, live inject delivery, auto-scoring and auto-AAR. Build only once clients run tabletops several times per year.',
   false, 'Low', '["TB5","TB10"]'::jsonb, 'add');
