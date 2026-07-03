# Prompt for Claude Code — add "TB Story Board" to Supabase backlog

Paste everything below the line into Claude Code.

---

Add a new backlog section called "TB Story Board" with 13 items, TB1 through TB13.

IMPORTANT:
- Do this in the Supabase table public.backlog_items ONLY.
- Do NOT touch, read, or edit the local backlog.json file. Ignore it entirely.

Table schema (public.backlog_items):
id text PK, section_id text, section_title text, section_phase int, sort_order int, text text, done bool, priority text, notes text, dependencies jsonb, status text (CHECK in 'add','edit','completed','cancelled').

Insert as a single re-runnable upsert (ON CONFLICT (id) DO UPDATE) so it is safe to run more than once. For every row:
- section_id = 'tb_storyboard'
- section_title = 'TB Story Board'
- section_phase = 3
- done = false
- status = 'add'
- sort_order = the number in the id (TB1 -> 1 ... TB13 -> 13)
- dependencies = jsonb array of prerequisite TB ids
- text MUST begin with its TB id (e.g. 'TB1 - ...')

THE 13 ITEMS (id | priority | dependencies | text):

TB1 | Critical | [] | TB1 - Precedence data model: add fields to the inject object (chainStage, requires[], grants[], scenarioTypes[], track). Foundation - every later item depends on this.

TB2 | High | [TB1] | TB2 - Kill chain sequences per archetype: define 3 to 5 fixed ATT&CK-ordered chains each for ransomware, BEC, insider, vendor compromise. Chain order is the precedence backbone.

TB3 | High | [TB1] | TB3 - Kickoff story pool: 3 to 5 opener stories per archetype (initial access vector plus business framing). Launch with ransomware, BEC, and one more = 6 to 9 stories. Industry flavor is parameterization, not extra stories.

TB4 | High | [TB2, TB3] | TB4 - Haiku offline authoring plus curation: bulk-draft inject bodies and rolePrompts along each chain with Haiku, then human-review into the static deck. Nothing unreviewed is shown to clients.

TB5 | High | [TB1, TB4] | TB5 - Precedence selection engine: at runtime filter the deck to cards whose requires-tags are met and scenario matches, then pick weighted by role and random. Lightweight state machine, no live AI.

TB6 | High | [TB1] | TB6 - Response card library: author action cards scoped by role x NIST phase x scenario type, roughly 8 to 12 per role per phase, including plausible-but-wrong distractor cards.

TB7 | High | [TB6] | TB7 - Appropriateness matrix: map each response card x scenario x phase to correct / defensible-partial / inappropriate / not-applicable. Encodes rules like BEC does not need endpoint isolation.

TB8 | High | [TB6] | TB8 - New Supabase table tabletop_card_plays (session_id, inject_index, role_id, player_name, card_ids jsonb, comment, appropriateness jsonb). Write as the next numbered SQL patch; Mark runs it.

TB9 | High | [TB6, TB8] | TB9 - Card hand UI in the inject view: deal the role/phase/scenario-filtered hand, let the player select cards plus add a comment plus submit. Role-scoped to preserve the fog of war.

TB10 | High | [TB7, TB9] | TB10 - Scoring plus AAR integration: grade the played hand against the appropriateness matrix (correct +, missed critical -, inappropriate -, partial credit) and feed into the existing rubric and AAR.

TB11 | Medium | [TB3, TB5] | TB11 - Randomized run mode (facilitated): facilitator picks the archetype, system randomizes which story and chain within it. Full randomness is reserved for autonomous mode.

TB12 | Medium | [TB1, TB6, TB7] | TB12 - BCDR track generalization: use the track field to add a BCDR sequence (Impact, Assess, Activate BCP, Failover, Recover, Resume, Review), BCDR response cards, and a BCDR appropriateness map. Same engine, different content.

TB13 | Low | [TB5, TB10] | TB13 - Fully autonomous mode (future state): no facilitator, live inject delivery, auto-scoring and auto-AAR. Build only once clients run tabletops several times per year.

Confirm the 13 rows are in public.backlog_items when done. Do not modify any other table or any local file.
