-- SEED_TT_RESPONSE_CARDS.sql
-- Response (action) card library for the TB Storyboard engine — IR track, all archetypes.
-- REQUIRES SUPABASE_PATCH_065.sql to be run first (adds the curated column).
-- Safe to re-run: INSERT ... ON CONFLICT (id) DO UPDATE.
-- All cards seeded with curated = false. Review each card and flip to true before live sessions.
--
-- DEALING NOTE — carry into TB7 and TB9:
--   scenario_types marks the scenarios where a card is a CORRECT action (TB7 scoring input).
--   Cards with scenario_types '[]' are hard distractors — wrong in all scenarios.
--   TB9 deals every card for the role+phase EXCEPT those TB7 marks not-applicable for the scenario.
--   Deal: correct + defensible-partial + inappropriate (plausible distractors).
--   Skip: not-applicable only (obviously irrelevant — e.g. "freeze wire transfers" in ransomware).
--   TB9 MUST filter WHERE curated = true.
--
-- Counts: IC=34  TL=37  CL=30  LC=29  ES=24  Total=154
-- Phases:  detect_analyze / contain / eradicate / recover / post_incident
-- Roles:   ic / tl / cl / lc / es

-- ============================================================
-- IC (Incident Commander) — 34 cards
-- ============================================================

-- IC / detect_analyze (9)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-1-01','ic','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Convene the IR team','Stand up all defined IR roles; notify IC, TL, CL, LC, and ES per the IR plan.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-1-02','ic','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Declare P1 — activate IR plan','Formally declare a P1 incident and activate the IR plan per established severity criteria.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-1-03','ic','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Notify Executive Sponsor','Brief the Executive Sponsor on confirmed or suspected incident scope and current status.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-1-04','ic','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Hold — monitor before escalating','Direct the team to continue monitoring for 30 minutes before declaring an incident or escalating.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-1-05','ic','detect_analyze','ir','["ransomware","insider","vendor_compromise"]','Preserve evidence before containment','Direct the Technical Lead to capture memory images, logs, and forensic artifacts before isolating any system.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-1-06','ic','detect_analyze','ir','["ransomware","insider","vendor_compromise"]','Engage external IR firm','Invoke the IR retainer to bring in external forensic and incident response support.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-1-07','ic','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Notify cyber insurance carrier','Contact the cyber insurance carrier to open a potential claim and obtain their approved vendor panel.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-1-08','ic','detect_analyze','ir','[]','Send organization-wide breach alert','Broadcast an email to all staff immediately alerting them to the suspected incident.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-1-09','ic','detect_analyze','ir','[]','Shut down all systems immediately','Direct the Technical Lead to take all systems offline without a containment plan.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- IC / contain (8)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-2-01','ic','contain','ir','["ransomware","insider","vendor_compromise"]','Authorize network segmentation','Approve the Technical Lead''s segmentation plan to isolate affected network segments.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-2-02','ic','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Authorize compromised account suspension','Direct the Technical Lead to disable or reset all confirmed compromised accounts.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-2-03','ic','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Invoke attorney-client privilege','Direct Legal Counsel to assert privilege over all incident communications and documentation.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-2-04','ic','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Restrict all external communications','Hold all public and external communications until Legal and CL approve messaging.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-2-05','ic','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Brief Executive Sponsor — containment status','Provide the Executive Sponsor with a containment update and resource authorization request.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-2-06','ic','contain','ir','["ransomware"]','Authorize ransom negotiation specialist','Engage a specialist to buy time and assess the threat actor''s credibility before deciding on payment.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-2-07','ic','contain','ir','["bec"]','Freeze all pending wire transfers','Direct Finance to place an immediate hold on all pending outbound wires and ACH payments.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-2-08','ic','contain','ir','["ransomware","vendor_compromise"]','Notify vendor partners of the incident','Inform MSP or key technology vendors to coordinate containment on their side.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- IC / eradicate (6)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-3-01','ic','eradicate','ir','["ransomware","vendor_compromise"]','Authorize full environment rebuild','Approve the Technical Lead''s plan to rebuild affected systems from known-clean images.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-3-02','ic','eradicate','ir','["ransomware","bec","insider","vendor_compromise"]','Authorize enterprise-wide credential reset','Direct all passwords and service account credentials to be rotated across the full environment.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-3-03','ic','eradicate','ir','["ransomware","bec","insider","vendor_compromise"]','Direct Legal to assess notification obligations','Brief Legal Counsel to determine regulatory breach notification triggers and applicable timelines.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-3-04','ic','eradicate','ir','["insider"]','Engage HR and physical security — insider','Direct HR and physical security to manage the implicated employee per HR policy and legal guidance.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-3-05','ic','eradicate','ir','["ransomware","insider","vendor_compromise"]','Hold — pause remediation until forensics complete','Direct the team to pause all remediation until the forensic root-cause investigation is signed off.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-3-06','ic','eradicate','ir','[]','Declare incident contained — resume operations','Announce that the incident is contained and authorize normal operations to resume.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- IC / recover (6)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-4-01','ic','recover','ir','["ransomware","vendor_compromise"]','Authorize phased system restoration','Approve the Technical Lead''s restoration sequence — critical systems first, each phase monitoring-validated.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-4-02','ic','recover','ir','["ransomware","bec","insider","vendor_compromise"]','Verify recovery success criteria before sign-off','Direct the Technical Lead to confirm all success criteria before declaring any system clean.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-4-03','ic','recover','ir','["ransomware","bec","insider","vendor_compromise"]','Brief Executive Sponsor — recovery milestone','Update the Executive Sponsor on recovery status and projected return-to-normal timeline.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-4-04','ic','recover','ir','["ransomware","vendor_compromise"]','Authorize business continuity procedures','Approve temporary BC procedures to maintain critical operations during recovery.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-4-05','ic','recover','ir','[]','Restore from backup immediately, verify later','Direct IT to restore from the most recent backup without validating backup integrity first.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-4-06','ic','recover','ir','["ransomware","vendor_compromise"]','Require external IR sign-off before restoration','Mandate external IR firm sign-off before authorizing system restore.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- IC / post_incident (5)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-5-01','ic','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Commission After Action Review','Direct a formal AAR within 72 hours of incident close; assign owners for all action items.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-5-02','ic','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Approve and prioritize remediation roadmap','Authorize and resource the technical remediation items from the AAR for immediate action.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-5-03','ic','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Brief board on incident outcome and response','Present AAR findings and the remediation plan to the board and executive leadership.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-5-04','ic','post_incident','ir','[]','Close incident — no AAR required','Declare the incident formally closed without conducting an After Action Review.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-IC-5-05','ic','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Notify insurer — close claim','Provide the cyber insurance carrier with final incident documentation and close the claim.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- ============================================================
-- TL (Technical Lead) — 37 cards
-- ============================================================

-- TL / detect_analyze (8)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-1-01','tl','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Triage the alert — assign provisional severity','Review the initial signal and assign a provisional severity (P1–P4) per the IR plan criteria. Brief the IC.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-1-02','tl','detect_analyze','ir','["ransomware","insider","vendor_compromise"]','Capture memory image before containment','Take a live memory capture and preserve system state before isolating or touching the affected endpoint.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-1-03','tl','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Preserve logs — increase retention and verbosity','Confirm SIEM, EDR, and endpoint logs are retained; increase verbosity on affected systems immediately.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-1-04','tl','detect_analyze','ir','["ransomware","vendor_compromise"]','Query EDR for lateral movement indicators','Search EDR telemetry for process, network, and file indicators of lateral movement across the environment.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-1-05','tl','detect_analyze','ir','["ransomware","insider","vendor_compromise"]','Isolate the affected endpoint immediately','Disconnect the identified endpoint from the network immediately.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-1-06','tl','detect_analyze','ir','["ransomware","bec"]','Review email headers and mail server logs','Analyze email headers, mail flow logs, and authentication records for phishing or account compromise indicators.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-1-07','tl','detect_analyze','ir','["ransomware","bec"]','Contact the affected user directly','Phone or message the user on the affected system to determine what they clicked or observed.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-1-08','tl','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Hold — gather more indicators before acting','Continue passive observation to collect additional indicators before taking any containment action.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- TL / contain (9)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-2-01','tl','contain','ir','["ransomware","insider","vendor_compromise"]','Isolate affected systems — preserve for forensics','Remove compromised endpoints from the network while keeping them powered and intact for forensic analysis.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-2-02','tl','contain','ir','["ransomware","vendor_compromise"]','Block C2 indicators at the firewall','Push firewall rules to block all identified command-and-control IP addresses and domains.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-2-03','tl','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Disable compromised accounts in Active Directory','Immediately disable all confirmed compromised accounts in AD and revoke active sessions.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-2-04','tl','contain','ir','["ransomware","insider","vendor_compromise"]','Segment the affected network zone','Implement firewall-based segmentation to restrict lateral movement between network zones.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-2-05','tl','contain','ir','["vendor_compromise"]','Terminate vendor remote access immediately','Revoke all active VPN, RMM, and API access for the implicated vendor.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-2-06','tl','contain','ir','["ransomware","insider","vendor_compromise"]','Deploy EDR to endpoints without coverage','Push EDR agent to all endpoints currently lacking coverage to close visibility gaps.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-2-07','tl','contain','ir','["ransomware"]','Reimage the compromised workstation now','Wipe and reimage the affected endpoint immediately to restore a clean state.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-2-08','tl','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Brief IC on containment options with recommendation','Present IC with containment options, a technical recommendation, and the trade-offs of each.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-2-09','tl','contain','ir','["ransomware","vendor_compromise"]','Hold — monitor C2 traffic before severing','Allow C2 communication to continue briefly to collect threat-actor indicators before cutting the connection.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- TL / eradicate (8)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-3-01','tl','eradicate','ir','["ransomware","bec","insider","vendor_compromise"]','Document full attack path before remediation','Map the complete attack path from initial access to impact before touching any system for remediation.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-3-02','tl','eradicate','ir','["ransomware","vendor_compromise"]','Rebuild affected systems from clean gold image','Wipe and rebuild all confirmed compromised systems from validated clean images.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-3-03','tl','eradicate','ir','["ransomware","bec","insider","vendor_compromise"]','Reset all credentials and service accounts','Rotate all domain, local admin, and service account passwords across the full environment.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-3-04','tl','eradicate','ir','["bec","insider"]','Remove malicious inbox rules and OAuth grants','Delete all attacker-installed inbox rules, mail-forwarding rules, and unauthorized OAuth app grants.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-3-05','tl','eradicate','ir','["ransomware","vendor_compromise"]','Patch the exploited vulnerability','Apply the patch or configuration fix for the specific CVE or misconfiguration that was exploited.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-3-06','tl','eradicate','ir','["ransomware","vendor_compromise"]','Validate backup integrity before declaring recovery-ready','Confirm available backups are clean, complete, and unencrypted before presenting a recovery plan to IC.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-3-07','tl','eradicate','ir','[]','Declare eradication complete — no independent verification','Sign off on eradication completeness and proceed to recovery without independent forensic confirmation.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-3-08','tl','eradicate','ir','["ransomware","insider","vendor_compromise"]','Hold — pause rebuilding until full attack path confirmed','Recommend to IC that rebuilding be deferred until forensic investigation has confirmed the complete attack path.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- TL / recover (7)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-4-01','tl','recover','ir','["ransomware","vendor_compromise"]','Restore systems in priority order with per-phase validation','Bring systems online in the agreed priority sequence; confirm EDR visibility and integrity at each step.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-4-02','tl','recover','ir','["ransomware","vendor_compromise"]','Validate backup integrity before restoring','Perform hash and integrity checks on all backup candidates before restoring any system to production.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-4-03','tl','recover','ir','["ransomware","vendor_compromise"]','Confirm full EDR coverage before sign-off','Verify all restored systems have active EDR agents and no visibility gaps before presenting recovery sign-off to IC.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-4-04','tl','recover','ir','[]','Restore all systems simultaneously','Restore every affected system in parallel to return to full operations as quickly as possible.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-4-05','tl','recover','ir','["vendor_compromise"]','Re-enable vendor remote access','Restore the implicated vendor''s RMM and remote access following incident resolution.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-4-06','tl','recover','ir','["ransomware","bec","insider","vendor_compromise"]','Brief IC — all recovery criteria confirmed','Report to IC that all technical recovery criteria are met and systems are ready for production return.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-4-07','tl','recover','ir','["ransomware","vendor_compromise"]','Hold — recommend 72-hour monitoring window','Advise IC to maintain elevated monitoring for 72 hours before formally declaring recovery complete.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- TL / post_incident (5)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-5-01','tl','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Document technical timeline for the AAR','Produce a timestamped technical narrative of the full attack path and response actions for the After Action Review.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-5-02','tl','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Present technical remediation roadmap to IC','Deliver a prioritized list of technical remediations with effort estimates and risk-reduction value.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-5-03','tl','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Identify and close EDR and log coverage gaps','Report all detection and visibility gaps exposed during the incident and propose closure measures.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-5-04','tl','post_incident','ir','[]','Close incident — no technical documentation needed','Archive the case without producing a technical timeline or root-cause document.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-TL-5-05','tl','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Recommend control improvements to prevent recurrence','Brief IC on specific control changes, tooling, or configuration hardening recommended based on the attack path.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- ============================================================
-- CL (Communications Lead) — 30 cards
-- ============================================================

-- CL / detect_analyze (5)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-1-01','cl','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Hold — maintain communications silence','Advise all IR roles to hold all external and non-essential internal communications pending IC direction.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-1-02','cl','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Brief IC on communications risks','Advise the IC on communications risks — premature disclosure, legal liability, and media attention — before any messaging is issued.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-1-03','cl','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Draft internal leadership notification for IC review','Prepare a draft leadership-only internal notification for IC and Legal review before distribution.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-1-04','cl','detect_analyze','ir','[]','Issue public statement acknowledging the incident','Publish an external statement acknowledging the incident on company channels immediately.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-1-05','cl','detect_analyze','ir','[]','Notify customers by email immediately','Send an email notification to all customers disclosing the incident before scope is confirmed.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- CL / contain (8)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-2-01','cl','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Implement communications hold — all external messaging through CL','Establish that all external communications about the incident must be reviewed and approved by CL and Legal before release.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-2-02','cl','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Draft holding statement — for Legal review only','Prepare a draft holding statement for media inquiries; do not release until Legal and IC approve.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-2-03','cl','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Brief leadership team — internal only','Distribute an approved internal update to senior leadership on incident status and next steps.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-2-04','cl','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Coordinate with Legal on regulatory notification timing','Align with Legal Counsel on which communications must be timed to regulatory notification deadlines.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-2-05','cl','contain','ir','[]','Notify affected customers before scope is confirmed','Contact all potentially affected customers to disclose the incident before IC and Legal have approved the notification.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-2-06','cl','contain','ir','[]','Contact media proactively before IC approval','Reach out to press contacts to shape media coverage before IC and Legal have authorized external messaging.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-2-07','cl','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Draft employee communication for IC and Legal approval','Prepare an internal employee communication explaining the situation and what staff should and should not do.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-2-08','cl','contain','ir','["ransomware","vendor_compromise"]','Prepare messaging for board notification','Draft a concise board notification for the Executive Sponsor to use, covering incident scope, status, and next steps.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- CL / eradicate (7)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-3-01','cl','eradicate','ir','["ransomware","bec","insider"]','Draft customer breach notification for Legal review','Prepare a compliant draft breach notification letter for Legal Counsel review before any distribution.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-3-02','cl','eradicate','ir','["ransomware","bec","insider","vendor_compromise"]','Prepare approved employee status update','Draft an internal staff update confirming the incident is being resolved and what employees should do differently.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-3-03','cl','eradicate','ir','["ransomware","bec","insider","vendor_compromise"]','Draft regulatory notification supporting language','Prepare supporting communications language aligned to any regulatory notification Legal Counsel is filing.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-3-04','cl','eradicate','ir','[]','Issue public statement without Legal sign-off','Publish an external statement about the incident scope without Legal Counsel review or IC approval.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-3-05','cl','eradicate','ir','[]','Disclose full technical attack details in customer notification','Include a detailed technical description of the attack method in the customer-facing breach notification letter.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-3-06','cl','eradicate','ir','["ransomware","bec","insider","vendor_compromise"]','Coordinate crisis messaging with Executive Sponsor','Align with the Executive Sponsor on tone, scope, and approval chain for all crisis communications.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-3-07','cl','eradicate','ir','["ransomware","bec","insider","vendor_compromise"]','Hold — await Legal sign-off before any external notification','Advise IC that no external notification should be issued until Legal Counsel has confirmed compliance and approved messaging.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- CL / recover (5)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-4-01','cl','recover','ir','["ransomware","bec","insider","vendor_compromise"]','Issue approved recovery update to customers and stakeholders','Distribute the IC and Legal-approved communications confirming the incident is resolved and systems are restored.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-4-02','cl','recover','ir','["ransomware","bec","insider","vendor_compromise"]','Coordinate media response','Brief the IC on media inquiry status and manage approved media response per the agreed communications plan.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-4-03','cl','recover','ir','["ransomware","bec","insider","vendor_compromise"]','Draft post-recovery statement for IC and Legal approval','Prepare an external recovery statement; route through IC and Legal before publishing.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-4-04','cl','recover','ir','[]','Announce full recovery before IC and TL confirm systems clean','Publish an all-clear message before TL and IC have signed off on technical recovery criteria.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-4-05','cl','recover','ir','["ransomware","bec","insider","vendor_compromise"]','Prepare talking points for Executive Sponsor board presentation','Draft concise communications talking points for the ES to use when briefing the board on incident recovery.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- CL / post_incident (5)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-5-01','cl','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Conduct stakeholder communications debrief','Review all communications issued during the incident with IC and Legal; identify gaps, errors, and timing issues.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-5-02','cl','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Document full communications timeline for AAR','Produce a timestamped record of all internal and external communications for the After Action Review.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-5-03','cl','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Recommend communications protocol improvements','Brief IC on communications process gaps identified during the incident and propose protocol updates.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-5-04','cl','post_incident','ir','[]','Issue detailed public post-mortem statement','Publish a comprehensive public disclosure of what went wrong, what data was affected, and what is being done to fix it.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-CL-5-05','cl','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Confirm all regulatory notification obligations met with Legal','Coordinate with Legal Counsel to verify all required regulatory notifications have been filed and documented.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- ============================================================
-- LC (Legal Counsel) — 29 cards
-- ============================================================

-- LC / detect_analyze (4)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-1-01','lc','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Invoke attorney-client privilege','Direct that all incident communications, documentation, and reports be conducted under attorney-client privilege.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-1-02','lc','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Advise IC on evidence preservation obligations','Brief the IC on legal evidence preservation requirements — chain of custody, log retention, and forensic integrity.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-1-03','lc','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Assess whether cyber insurance notification is triggered','Review the policy terms to determine whether and when the incident must be reported to the cyber insurance carrier.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-1-04','lc','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Hold — await scope confirmation before advising on notification','Advise IC to pause external notification decisions until incident scope is confirmed.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- LC / contain (7)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-2-01','lc','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Brief IC on regulatory notification triggers','Provide the IC with a preliminary assessment of which regulatory notification obligations may apply based on incident type and data affected.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-2-02','lc','contain','ir','["insider"]','Advise on employment law obligations','Brief IC and HR on applicable employment law requirements for an employee-involved incident — suspension procedure, investigation, and evidence handling.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-2-03','lc','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Issue litigation hold','Instruct all IR team members to preserve all incident-related documents, communications, and records for potential litigation.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-2-04','lc','contain','ir','["bec","vendor_compromise"]','Advise on vendor contract obligations','Review vendor and partner contracts for notification obligations, liability caps, indemnity clauses, and SLA breach provisions.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-2-05','lc','contain','ir','[]','File HIPAA breach notification before scope is confirmed','Submit a HIPAA notification to HHS immediately without confirming whether PHI was accessed or exfiltrated.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-2-06','lc','contain','ir','[]','File immediate SEC disclosure','Publish a material cyber incident disclosure to the SEC before the incident scope or materiality is assessed.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-2-07','lc','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Advise IC on communications privilege and messaging risks','Counsel the IC on maintaining privilege in all communications and the legal risk of premature statements.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- LC / eradicate (9)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-3-01','lc','eradicate','ir','["ransomware","bec","insider","vendor_compromise"]','Assess whether a reportable breach has occurred','Determine whether the incident meets the legal threshold for a reportable breach under applicable state law.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-3-02','lc','eradicate','ir','["ransomware","bec","insider"]','Assess CCPA and state AG notification obligations','Determine California Consumer Privacy Act requirements and any state attorney general notification obligations that apply.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-3-03','lc','eradicate','ir','["ransomware","insider"]','Assess HIPAA breach notification requirements','Determine whether the incident triggers HIPAA notification obligations to HHS, affected individuals, and the media.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-3-04','lc','eradicate','ir','["ransomware","bec","vendor_compromise"]','Advise on notifying FBI Cyber Division / IC3','Assess the value of reporting the incident to FBI Cyber Division or the Internet Crime Complaint Center (IC3).','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-3-05','lc','eradicate','ir','["ransomware","bec"]','Assess SEC cyber incident disclosure obligations','Determine whether the incident meets the SEC''s materiality threshold for a Form 8-K or Form 10-K cyber incident disclosure.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-3-06','lc','eradicate','ir','["bec"]','Advise on wire recall and clawback options','Assess legal options for recovering the transferred funds — wire recall through the bank, civil recovery, and FBI referral.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-3-07','lc','eradicate','ir','[]','File all applicable regulatory notifications immediately','Submit all potentially applicable notifications to all regulators simultaneously without completing scope assessment.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-3-08','lc','eradicate','ir','["ransomware","bec","insider","vendor_compromise"]','Advise on civil liability exposure','Assess potential civil litigation exposure and ensure all relevant evidence is preserved and privileged.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-3-09','lc','eradicate','ir','["ransomware","bec","insider","vendor_compromise"]','Hold — advise IC not to notify until full scope confirmed','Counsel IC to defer all regulatory notifications until the full scope and data impact is forensically confirmed.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- LC / recover (4)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-4-01','lc','recover','ir','["ransomware","bec","insider","vendor_compromise"]','Confirm all regulatory notification deadlines are met','Verify that all required notifications have been filed within applicable statutory timelines.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-4-02','lc','recover','ir','["ransomware","bec","insider","vendor_compromise"]','Advise on ongoing monitoring obligations post-notification','Brief IC on any post-notification monitoring, follow-up reporting, or regulatory response obligations.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-4-03','lc','recover','ir','["ransomware","bec","insider","vendor_compromise"]','Advise IC on employee communications and confidentiality','Counsel IC on maintaining confidentiality about implicated individuals and managing HR obligations through recovery.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-4-04','lc','recover','ir','[]','Release all litigation holds on incident resolution','Lift all document retention holds immediately upon incident close.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- LC / post_incident (5)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-5-01','lc','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Assess civil litigation and class action exposure','Review the incident facts for potential civil litigation or class action risk; advise IC and ES on liability posture.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-5-02','lc','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Document legal response timeline for AAR','Produce a timestamped record of all legal decisions, notifications filed, and privilege invocations for the After Action Review.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-5-03','lc','post_incident','ir','["ransomware","vendor_compromise"]','Recommend vendor and MSP contract improvements','Advise IC on contractual gaps — notification timelines, security requirements, liability caps — exposed by the incident.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-5-04','lc','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Confirm all regulatory filings are complete and documented','Verify and document that all required regulatory notifications have been filed and acknowledged.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-LC-5-05','lc','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Advise on regulatory response strategy','Counsel IC and ES on how to manage ongoing regulatory scrutiny, examination, or investigation following the incident.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- ============================================================
-- ES (Executive Sponsor) — 24 cards
-- ============================================================

-- ES / detect_analyze (3)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-1-01','es','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Acknowledge IC briefing — authorize initial investigation','Receive the IC''s briefing, authorize the incident investigation, and confirm the IR team is stood up.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-1-02','es','detect_analyze','ir','["ransomware","bec","insider","vendor_compromise"]','Hold — await IC assessment before acting','Direct the IC to complete their initial assessment and brief you before taking any executive action.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-1-03','es','detect_analyze','ir','[]','Take over operational command of the incident','Assume direct command of the incident response in place of the Incident Commander.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- ES / contain (7)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-2-01','es','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Authorize emergency IR expenditure','Approve emergency budget for IR retainer, external forensics, and containment resources.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-2-02','es','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Co-sign breach declaration with IC','Together with the IC, formally declare a confirmed security incident and activate the breach response protocol.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-2-03','es','contain','ir','["ransomware","vendor_compromise"]','Brief the board of directors','Notify the board of the confirmed incident, current status, and the response plan.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-2-04','es','contain','ir','["ransomware","bec","insider","vendor_compromise"]','Authorize communications hold — all media through CL and Legal','Direct that all public and media communications are held until CL and Legal have reviewed and approved messaging.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-2-05','es','contain','ir','[]','Authorize ransom payment without IR or Legal advice','Instruct Finance to process the ransom demand immediately without engaging an IR specialist or Legal Counsel.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-2-06','es','contain','ir','[]','Acknowledge the incident on company social media','Post a public statement on the organization''s social media channels to get ahead of the story.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-2-07','es','contain','ir','["ransomware"]','Authorize full business operations suspension','Approve a total halt of all business operations until the incident is resolved.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- ES / eradicate (5)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-3-01','es','eradicate','ir','["ransomware","bec","insider","vendor_compromise"]','Authorize remediation budget and resource allocation','Approve the resources required to execute the IC and TL''s remediation plan.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-3-02','es','eradicate','ir','["ransomware","bec","insider","vendor_compromise"]','Approve customer and regulatory notification decision','Authorize Legal and CL to proceed with the approved regulatory and customer notification plan.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-3-03','es','eradicate','ir','["insider"]','Authorize HR action for implicated employee','Direct HR to implement the agreed disciplinary, suspension, or termination action per HR policy and Legal guidance.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-3-04','es','eradicate','ir','["bec"]','Authorize wire recall and legal recovery action','Direct Legal and Finance to initiate wire recall procedures and civil recovery action.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-3-05','es','eradicate','ir','[]','Declare incident resolved — resume normal operations','Announce to the organization that the incident is resolved and authorize full resumption of operations.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- ES / recover (4)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-4-01','es','recover','ir','["ransomware","bec","insider","vendor_compromise"]','Authorize return-to-operations based on IC and TL sign-off','Approve the phased return to normal operations once IC and TL confirm all recovery criteria are met.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-4-02','es','recover','ir','["ransomware","vendor_compromise"]','Brief board on recovery status and timeline','Update the board on recovery progress, projected return-to-normal, and any residual risk.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-4-03','es','recover','ir','[]','Authorize accelerated recovery bypassing security validation','Direct the team to restore operations immediately, bypassing the phased validation process to minimize downtime.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-4-04','es','recover','ir','["ransomware","bec","insider","vendor_compromise"]','Confirm cyber insurance claim is actively managed','Verify with LC that the cyber insurance claim has been filed and is progressing per policy requirements.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

-- ES / post_incident (5)
INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-5-01','es','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Present AAR findings and remediation plan to the board','Brief the board on incident outcome, response quality, lessons learned, and the approved remediation roadmap.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-5-02','es','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Authorize post-incident remediation investment','Approve and resource the remediation items identified in the AAR and prioritized by IC and TL.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-5-03','es','post_incident','ir','["ransomware","bec","vendor_compromise"]','Brief key customers and partners on the incident outcome','Personally brief high-value customers or partners affected by the incident on the resolution and steps taken.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-5-04','es','post_incident','ir','["ransomware","bec","insider","vendor_compromise"]','Approve updated cyber risk appetite and revised IR plan','Review and approve updated cyber risk thresholds and IR plan improvements identified through the AAR.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();

INSERT INTO public.tt_response_cards(id,role_id,nist_phase,track,scenario_types,title,body,appropriateness,curated)
VALUES('RC-ES-5-05','es','post_incident','ir','[]','Decline AAR — incident is closed, no further investment needed','Determine that the incident is resolved and no After Action Review or remediation investment is warranted.','{}',false)
ON CONFLICT(id) DO UPDATE SET role_id=EXCLUDED.role_id,nist_phase=EXCLUDED.nist_phase,track=EXCLUDED.track,scenario_types=EXCLUDED.scenario_types,title=EXCLUDED.title,body=EXCLUDED.body,appropriateness=EXCLUDED.appropriateness,curated=EXCLUDED.curated,updated_at=now();
