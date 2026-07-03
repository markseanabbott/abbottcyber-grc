# Tabletop Story Board — Build Plan

Clean, dependency-ordered plan for the tabletop card/story system. This supersedes any earlier backlog attempt.

Storage decision: the game content (stories, inject cards, response cards, and their precedence order) lives in the database, not in code. You add or adjust scenarios, cards, and branching by editing rows in Supabase, no code change required. This scales with your content and keeps you in control.

## How this gets built (methodology)

- Dependency order, top to bottom. Do not start an item until its prerequisites are done. The order below already respects that.
- One item at a time. I tell you what I am about to build, you approve, I build it, you review, we mark it done, then move to the next. No batching.
- Curated, not live. Haiku drafts content offline; you review it before it goes into the tables. Sonnet is used only for the After Action Report. Nothing AI-generated is shown to a client live until autonomous mode (TB13).
- Content lives in the database. Stories, inject cards, and response cards are rows in Supabase. You expand the game from the table editor. The app reads these tables at runtime.
- Precedence is data, not code. Which card can follow which, and how likely, is stored as tags and weights on the card rows. Adjusting the flow means editing rows, not editing the app.
- This is a bolt-on. It extends the existing tabletop engine (inject object, rolePrompts, tteSetRubricScore, criticality accuracy). It is not a rebuild.

## The database tables (built in Phase 0)

Four new tables, all editable by you in Supabase:

1. tt_stories — the kickoff story pool. id, archetype, track, title, opener_text, business_context, notes.
2. tt_inject_cards — the branching inject deck. id, archetype, track, chain_stage, requires (jsonb tags), grants (jsonb tags), weight (int, for the semi-random pick), title, body, role_prompts (jsonb), mitre_tactic, mitre_technique, correct_criticality, nist_phase_idx.
3. tt_response_cards — the player action card library plus appropriateness. id, role_id, nist_phase, track, scenario_types (jsonb), title, body, appropriateness (jsonb: correct / defensible-partial / inappropriate / not-applicable keyed by scenario and phase).
4. tabletop_card_plays — what each player actually did. id, session_id, inject_index, role_id, player_name, card_ids (jsonb), comment, appropriateness (jsonb), created_at, updated_at, UNIQUE(session_id, inject_index, role_id).

How the semi-random branching works: at each stage the engine pulls the cards at the next chain_stage whose requires-tags are satisfied and whose archetype/track matches, then picks one weighted by the weight column. Roughly 3 valid options per stage over a 6-stage chain gives hundreds of distinct playthroughs from ~18 cards, with no new authoring. Add a card row with the right tags and it slots into the branching automatically.

## Build order

### Phase 0 — Foundation (data model plus schema)

TB1 — Precedence data model and database schema (Critical, depends on nothing)
Add precedence fields to the inject object (chainStage, requires, grants, scenarioTypes, and track = ir / bcdr / exec / vendor). Create the four tables above as a numbered SQL patch you run in Supabase. The track field and the schema must exist here, or nothing else can be built or tuned. Everything below depends on this.

### Phase 1 — Author the content deck

TB2 — Kill chain sequences per archetype (High, depends on TB1)
Define 3 to 5 fixed ATT&CK-ordered chains each for ransomware, BEC, insider, and vendor compromise. The chain_stage values plus requires/grants tags are the branching backbone that produces the semi-random effect.

TB3 — Kickoff story pool (High, depends on TB1)
Author 3 to 5 opener stories per archetype into tt_stories (initial access vector plus business framing). Launch with ransomware, BEC, and one more, so 6 to 9 stories. Industry flavor (hotel vs SaaS) is parameterization, not extra stories. Story picks the archetype; the archetype gates which chains are valid.

TB4 — Haiku offline authoring plus curation (High, depends on TB2, TB3)
Use Haiku offline to bulk-draft inject bodies and role_prompts along each chain. You review and curate, then the rows go into tt_inject_cards. Nothing unreviewed reaches a client.

TB5 — Precedence selection engine (High, depends on TB1, TB4)
At runtime, read tt_inject_cards, filter to the next-stage cards whose requires-tags are met and scenario matches, then pick weighted by the weight column and random. Lightweight, no live AI. This is the piece that makes it feel semi-random.

### Phase 2 — Response card mechanic

TB6 — Response card library (High, depends on TB1)
Author action cards into tt_response_cards, scoped by role x NIST phase x scenario type, roughly 8 to 12 per role per phase. Include plausible-but-wrong distractor cards on purpose; they are the assessment signal.

TB7 — Appropriateness matrix (High, depends on TB6)
Fill the appropriateness column on each response card: correct / defensible-partial / inappropriate / not-applicable, keyed by scenario and phase. This is where "BEC does not need endpoint isolation" gets encoded, and you can tune it in Supabase.

TB8 — Card play persistence (High, depends on TB6)
Wire the tabletop_card_plays table (created in TB1) into the app so player choices and their grades are saved, following the tabletop_responses pattern.

TB9 — Card hand UI (High, depends on TB6, TB8)
In the inject view, deal the role/phase/scenario-filtered hand from tt_response_cards, let the player select cards, add a comment, and submit. Role-scoping keeps the fog of war intact.

TB10 — Scoring plus AAR integration (High, depends on TB7, TB9)
On submit, grade the played hand against the appropriateness data: correct played (+), critical missed (-), inappropriate played (-), partial credit for defensible-but-not-optimal. Feed results into the existing rubric and AAR so card choices show in the report.

### Phase 3 — Replay and extension

TB11 — Randomized run mode, facilitated (Medium, depends on TB3, TB5)
Facilitator picks the archetype; the system randomizes which story and which chain it deals within that archetype. This is the replayability layer. Full randomness (no facilitator) is reserved for TB13.

TB12 — BCDR track generalization (Medium, depends on TB1, TB6, TB7)
Use the track field to add BCDR content: a BCDR sequence (Impact, Assess, Activate BCP, Failover/DR, Recover, Resume, Review), BCDR response cards (invoke BCP, fail over to DR site, activate alternate site, run comms tree, verify RTO/RPO), and BCDR appropriateness rows. Same engine and same tables, different rows. Exec and Vendor tracks follow the same pattern later.

### Future state

TB13 — Fully autonomous mode (Low, depends on TB5, TB10)
No facilitator, live inject delivery, auto-scoring, auto-AAR. Build only once you have clients running tabletops several times a year. The curated deck proves the format first.

## Dependency summary

- TB1 (data model plus the four tables) gates everything.
- TB2 and TB3 both need TB1 and can be authored in parallel.
- TB4 needs both TB2 and TB3. TB5 needs TB4.
- TB6 needs only TB1, so the response card track can start early, in parallel with the inject deck work.
- TB7 and TB8 need TB6. TB9 needs TB6 and TB8. TB10 needs TB7 and TB9.
- TB11 needs TB3 and TB5. TB12 needs TB1, TB6, TB7. TB13 needs TB5 and TB10.
