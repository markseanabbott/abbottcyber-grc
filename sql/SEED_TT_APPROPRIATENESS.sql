-- SEED_TT_APPROPRIATENESS.sql
-- TB7: Populates the appropriateness column on all 154 tt_response_cards.
-- Safe to re-run: UPDATE only, no INSERT. Requires SEED_TT_RESPONSE_CARDS.sql rows.
--
-- Shape per card:
--   appropriateness = {
--     "ransomware":       { "rating": "...", "weight": 1|2 },
--     "bec":              { "rating": "...", "weight": 1|2 },
--     "insider":          { "rating": "...", "weight": 1|2 },
--     "vendor_compromise":{ "rating": "...", "weight": 1|2 }
--   }
--
-- rating values:
--   correct             -- right action in this scenario at this phase
--   defensible-partial  -- reasonable but incomplete or context-dependent
--   inappropriate       -- plausible-but-wrong; TB9 WILL deal this card as a distractor
--   not-applicable      -- irrelevant/nonsensical; TB9 will NOT deal this card
--
-- weight:  1 = normal  |  2 = critical (must-do or catastrophic-if-wrong)
--
-- TB9 dealing rule: deal correct + defensible-partial + inappropriate; skip not-applicable only.
-- TB10 scoring uses rating + weight to award/penalise points; math is TB10, not this file.
--
-- Shape change from PATCH_061 comment: that comment described { "archetype:nist_phase": "rating" }.
-- TB7 uses { "archetype": { "rating": "...", "weight": N } } -- keyed by scenario only,
-- since nist_phase is already its own column. The jsonb column has no CHECK constraint; fully compatible.

-- ============================================================
-- IC (Incident Commander) — 34 cards
-- ============================================================

-- IC / detect_analyze
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-IC-1-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-IC-1-02';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-IC-1-03';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-IC-1-04';
-- BEC: endpoint memory forensics is the wrong reflex for an email-based attack (plausible distractor)
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"inappropriate","weight":1},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-IC-1-05';
-- BEC: spec-mandated defensible-partial (external IR useful but not standard for pure email fraud)
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"defensible-partial","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-IC-1-06';
-- Late insurer notification can void coverage — critical in all scenarios
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-IC-1-07';
-- Catastrophic in all: tips off attacker, premature disclosure liability
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-IC-1-08';
-- Catastrophic in all: destroys evidence, no containment plan
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-IC-1-09';

-- IC / contain
-- BEC: no network spread — segmentation is a plausible-wrong security reflex
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"inappropriate","weight":1},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-IC-2-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-IC-2-02';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-IC-2-03';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-IC-2-04';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-IC-2-05';
-- No ransom demand in BEC, insider, or vendor_compromise archetypes
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"not-applicable","weight":1},"vendor_compromise":{"rating":"not-applicable","weight":1}}'::jsonb WHERE id = 'RC-IC-2-06';
-- Insider: financially-motivated insider (diverted wires) is a real pattern — defensible-partial
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"not-applicable","weight":1},"bec":{"rating":"correct","weight":2},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"not-applicable","weight":1}}'::jsonb WHERE id = 'RC-IC-2-07';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"not-applicable","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-IC-2-08';

-- IC / eradicate
-- BEC: no systems to rebuild; Insider: depends on destructiveness — defensible-partial
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-IC-3-01';
-- If attacker still has valid creds, eradication is incomplete — critical in all
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-IC-3-02';
-- Regulatory notification clock is already running — critical in all
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-IC-3-03';
-- HR action only relevant when an employee is the threat actor
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"not-applicable","weight":1},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"not-applicable","weight":1}}'::jsonb WHERE id = 'RC-IC-3-04';
-- BEC: pausing is defensible (confirm scope) but less critical — no spreading threat
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"defensible-partial","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-IC-3-05';
-- Catastrophic: ops resume while threat may still be active
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-IC-3-06';

-- IC / recover
-- BEC: no systems taken offline — restore is irrelevant; Insider: depends on destructive scope
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-IC-4-01';
-- Recovery criteria gate is critical in all scenarios
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-IC-4-02';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-IC-4-03';
-- BEC: no downtime; Insider: partial — destructive insider yes, data-theft insider less so
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-IC-4-04';
-- Catastrophic in all: may restore a compromised or encrypted backup
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-IC-4-05';
-- BEC: no system recovery to sign off on
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-IC-4-06';

-- IC / post_incident
-- Skipping AAR = forfeiting the primary learning mechanism — critical in all
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-IC-5-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-IC-5-02';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-IC-5-03';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-IC-5-04';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-IC-5-05';

-- ============================================================
-- TL (Technical Lead) — 37 cards
-- ============================================================

-- TL / detect_analyze
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-1-01';
-- BEC: reaching for memory forensics when the threat is an email account is a plausible-wrong reflex
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"inappropriate","weight":1},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-1-02';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-1-03';
-- BEC: no lateral movement on endpoints; Insider: could involve lateral movement
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"inappropriate","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-1-04';
-- BEC: endpoint isolation when the threat is an email account is wrong but tempting
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"inappropriate","weight":1},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-1-05';
-- I/V: email headers help if initial access was phishing — secondary but defensible
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":2},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"defensible-partial","weight":1}}'::jsonb WHERE id = 'RC-TL-1-06';
-- Insider: contacting the suspect user tips them off — critical mistake
-- Vendor: contacting vendor's user could prematurely alert them — defensible-partial
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"defensible-partial","weight":1}}'::jsonb WHERE id = 'RC-TL-1-07';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-TL-1-08';

-- TL / contain
-- BEC: isolating systems for forensics when there are no compromised endpoints is a reflex error
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"inappropriate","weight":1},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-2-01';
-- BEC: no C2 infrastructure in email fraud; Insider: may have exfil endpoint — partial
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"inappropriate","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-2-02';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-2-03';
-- BEC: network segmentation is a technical overreach in an email-only incident
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"inappropriate","weight":1},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-2-04';
-- Only relevant when vendor access was the specific attack vector
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"not-applicable","weight":1},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"not-applicable","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-2-05';
-- BEC: deploying EDR to endpoints is wrong tool for an email-based attack
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"inappropriate","weight":1},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-2-06';
-- BEC: no compromised endpoint to reimage
-- Insider: destroys forensic evidence against the employee — critical mistake
-- Vendor: removes known-bad tooling but imprecise — defensible-partial
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"defensible-partial","weight":1}}'::jsonb WHERE id = 'RC-TL-2-07';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-TL-2-08';
-- BEC: no C2 to monitor; Insider: monitoring exfil channel before severing reveals scope
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-TL-2-09';

-- TL / eradicate
-- Documenting attack path is prerequisite for safe rebuild in all scenarios
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-3-01';
-- BEC: no systems to rebuild; Insider: partial — depends on whether insider caused system damage
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-3-02';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-3-03';
-- R/V: attackers set persistence via inbox rules/OAuth in many breach types — partial but worth doing
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"defensible-partial","weight":1},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"defensible-partial","weight":1}}'::jsonb WHERE id = 'RC-TL-3-04';
-- BEC/Insider: no software vulnerability was exploited in these scenarios
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"not-applicable","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-3-05';
-- BEC: no data loss requiring backup restore; Insider: partial if they deleted/corrupted data
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-3-06';
-- Catastrophic: may leave backdoors undiscovered
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-TL-3-07';
-- BEC: nothing to rebuild — hold is not-applicable
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-TL-3-08';

-- TL / recover
-- BEC: no system restoration needed; Insider: partial — depends on damage scope
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-4-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-4-02';
-- BEC: EDR sweep is wrong tool for email-account recovery (distractor); Insider: endpoints relevant
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"inappropriate","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-4-03';
-- Catastrophic: parallel restore means one reinfected system can spread to the rest
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-TL-4-04';
-- Re-enabling vendor access only applies when vendor access was revoked in containment
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"not-applicable","weight":1},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"not-applicable","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-TL-4-05';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-TL-4-06';
-- BEC: continued monitoring of email account is defensible but less formal than a 72hr window
-- Insider: 72hr enhanced monitoring is correct — insider might have remaining access or accomplices
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"defensible-partial","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-TL-4-07';

-- TL / post_incident
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-TL-5-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-TL-5-02';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-TL-5-03';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-TL-5-04';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-TL-5-05';

-- ============================================================
-- CL (Communications Lead) — 30 cards
-- ============================================================

-- CL / detect_analyze
-- Comms silence at detect phase is critical in all scenarios — premature disclosure has legal consequences
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-CL-1-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-1-02';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-1-03';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-CL-1-04';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-CL-1-05';

-- CL / contain
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-CL-2-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-2-02';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-2-03';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-2-04';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-CL-2-05';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-CL-2-06';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-2-07';
-- B/I: board messaging warranted for significant BEC loss or insider incident — defensible
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"defensible-partial","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-2-08';

-- CL / eradicate
-- BEC: notification obligation is highest (financial fraud + likely PII) — weight 2
-- Vendor: breach notification may apply if data was exfiltrated — defensible-partial
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"defensible-partial","weight":1}}'::jsonb WHERE id = 'RC-CL-3-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-3-02';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-3-03';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-CL-3-04';
-- Disclose technical details = aids attackers, exposes org to further harm
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-CL-3-05';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-3-06';
-- No external notification without Legal sign-off — critical gate in all scenarios
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-CL-3-07';

-- CL / recover
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-4-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-4-02';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-4-03';
-- Catastrophic: false all-clear before systems confirmed clean
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-CL-4-04';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-4-05';

-- CL / post_incident
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-5-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-5-02';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-5-03';
-- Publishing a detailed post-mortem publicly exposes org to litigation and aids future attackers
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-CL-5-04';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-CL-5-05';

-- ============================================================
-- LC (Legal Counsel) — 29 cards
-- ============================================================

-- LC / detect_analyze
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-LC-1-01';
-- BEC: email/financial evidence is less forensically complex — weight 1 vs 2 elsewhere
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-LC-1-02';
-- Missing the insurer notification window can void coverage — critical in all
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-LC-1-03';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-LC-1-04';

-- LC / contain
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-LC-2-01';
-- Employment law only applies when an employee is the threat actor
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"not-applicable","weight":1},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"not-applicable","weight":1}}'::jsonb WHERE id = 'RC-LC-2-02';
-- Litigation hold is critical across all scenarios — evidence must be preserved
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-LC-2-03';
-- BEC: vendor contracts relevant (BEC often targets vendor payment relationships)
-- Vendor: critical — reviewing notification/liability obligations in the vendor agreement
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"not-applicable","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"not-applicable","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-LC-2-04';
-- Catastrophic: filing regulatory notifications before scope is confirmed
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-LC-2-05';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-LC-2-06';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-LC-2-07';

-- LC / eradicate
-- Determining whether a reportable breach occurred is the threshold question in all scenarios
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-LC-3-01';
-- Vendor: CCPA/state AG could apply if vendor exfiltrated PII — defensible-partial
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"defensible-partial","weight":1}}'::jsonb WHERE id = 'RC-LC-3-02';
-- BEC/Vendor: HIPAA applies if PHI may have been accessed — defensible-partial (org-dependent)
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"defensible-partial","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"defensible-partial","weight":1}}'::jsonb WHERE id = 'RC-LC-3-03';
-- Insider: FBI referral defensible if the insider committed significant criminal acts
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-LC-3-04';
-- I/V: SEC disclosure applies if the incident is material to a public company
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"defensible-partial","weight":1}}'::jsonb WHERE id = 'RC-LC-3-05';
-- Insider: wire recall relevant if the insider diverted funds — defensible-partial
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"not-applicable","weight":1},"bec":{"rating":"correct","weight":2},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"not-applicable","weight":1}}'::jsonb WHERE id = 'RC-LC-3-06';
-- Catastrophic: filing all notifications simultaneously without completing scope assessment
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-LC-3-07';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-LC-3-08';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-LC-3-09';

-- LC / recover
-- Missed notification deadlines = regulatory violation — critical in all
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-LC-4-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-LC-4-02';
-- Insider: confidentiality about the implicated employee is especially critical
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-LC-4-03';
-- Catastrophic: releasing litigation holds destroys evidence before legal proceedings conclude
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-LC-4-04';

-- LC / post_incident
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-LC-5-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-LC-5-02';
-- BEC/Insider: vendor contract improvements not applicable (no vendor relationship implicated)
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"not-applicable","weight":1},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-LC-5-03';
-- Ensuring all regulatory filings are confirmed complete is critical — closes loop on obligations
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-LC-5-04';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-LC-5-05';

-- ============================================================
-- ES (Executive Sponsor) — 24 cards
-- ============================================================

-- ES / detect_analyze
-- ES must acknowledge and authorize — critical gate that enables IC to act with resources
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-ES-1-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-ES-1-02';
-- Catastrophic: breaks IC command structure, creates confusion
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-ES-1-03';

-- ES / contain
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-ES-2-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-ES-2-02';
-- BEC: board briefing warranted for significant financial loss — defensible-partial (severity-dependent)
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"defensible-partial","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-ES-2-03';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-ES-2-04';
-- Catastrophic: ransom payment without IR/Legal advice — sanctions exposure, no guarantee
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-ES-2-05';
-- Catastrophic: unauthorized public disclosure during an active incident
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-ES-2-06';
-- BEC: full ops suspension is an overreaction to email fraud — inappropriate distractor
-- Insider: full suspension is also an overreaction unless destructive sabotage occurred
-- Vendor: may be warranted if vendor had deep production access — defensible-partial
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"inappropriate","weight":1},"insider":{"rating":"inappropriate","weight":1},"vendor_compromise":{"rating":"defensible-partial","weight":1}}'::jsonb WHERE id = 'RC-ES-2-07';

-- ES / eradicate
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-ES-3-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-ES-3-02';
-- HR action only relevant when an employee is the threat actor
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"not-applicable","weight":1},"bec":{"rating":"not-applicable","weight":1},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"not-applicable","weight":1}}'::jsonb WHERE id = 'RC-ES-3-03';
-- Wire recall only relevant in financial fraud; Insider: partial if fraud component exists
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"not-applicable","weight":1},"bec":{"rating":"correct","weight":2},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"not-applicable","weight":1}}'::jsonb WHERE id = 'RC-ES-3-04';
-- Catastrophic: declaring resolved at eradicate phase before recovery criteria are met
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-ES-3-05';

-- ES / recover
-- ES return-to-operations authorization is the final gate — critical in all
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-ES-4-01';
-- BEC: board recovery briefing warranted for significant financial incident — defensible
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"defensible-partial","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-ES-4-02';
-- Catastrophic: bypassing validation is how re-infection or incomplete remediation occurs
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-ES-4-03';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-ES-4-04';

-- ES / post_incident
-- AAR board presentation is critical — organizational accountability and future investment
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":2},"bec":{"rating":"correct","weight":2},"insider":{"rating":"correct","weight":2},"vendor_compromise":{"rating":"correct","weight":2}}'::jsonb WHERE id = 'RC-ES-5-01';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-ES-5-02';
-- Insider: customers/partners briefing partial — depends on whether they were affected
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"defensible-partial","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-ES-5-03';
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"correct","weight":1},"bec":{"rating":"correct","weight":1},"insider":{"rating":"correct","weight":1},"vendor_compromise":{"rating":"correct","weight":1}}'::jsonb WHERE id = 'RC-ES-5-04';
-- Catastrophic: declining AAR = no learning, no accountability, regulatory risk
UPDATE public.tt_response_cards SET updated_at = now(), appropriateness = '{"ransomware":{"rating":"inappropriate","weight":2},"bec":{"rating":"inappropriate","weight":2},"insider":{"rating":"inappropriate","weight":2},"vendor_compromise":{"rating":"inappropriate","weight":2}}'::jsonb WHERE id = 'RC-ES-5-05';
