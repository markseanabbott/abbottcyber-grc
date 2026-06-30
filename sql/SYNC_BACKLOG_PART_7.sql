-- SYNC_BACKLOG_PART_7.sql -- items 241-280 of 396
-- Run all 10 parts. Safe to re-run.

INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t11c', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 4, 'Three ingestion points: SOC alert, technician anomaly, PSA customer ticket', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t12', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 5, 'Role-filtered inject cards: each role sees situation-appropriate information per inject', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t12a', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 6, 'Roles: Incident Commander (vCISO), Technical Lead, Communications Lead, Legal/Compliance, Executive Sponsor (assumed by ops participant)', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t12b', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 7, 'Executive Sponsor role card: displayed at breach declaration gate explaining assumed-role mindset and responsibilities', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t13', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 8, 'Playbook alignment: map exercise steps to existing IR / DR playbooks', false, 'Critical', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t14', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 9, 'Gap identification: note where playbook breaks down or team is unsure during exercise', false, 'Critical', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t15', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 10, 'Tool availability check: confirm which tools/systems would be available during a real incident', false, 'Critical', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t16', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 11, 'Escalation path practice: comms test baked into role-specific injects', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t17', 'tabletop_operational', 'Tabletop â€” Operational Track (IT / Security Team)', 3, 12, 'Real-time response log: each role logs actions and decisions per inject', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t18', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 0, 'Scenarios: ransomware with ransom demand decision, regulatory breach notification, reputational crisis, M&A cyber due diligence failure, cyber insurance claim', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t19', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 1, 'Business impact framing: scenarios presented in revenue, reputation, and regulatory terms â€” not technical', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t20', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 2, 'Decision inject cards: executives presented with choices â€” pay/don''t pay, notify/delay, shut down/continue operations', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t21', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 3, 'Legal & regulatory prompts: when does GDPR/PIPEDA breach notification clock start, who is the regulator', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t22', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 4, 'Board communication exercise: draft a stakeholder communication under simulated pressure', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t23', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 5, 'Insurance review prompt: what does the policy cover, what are the exclusions', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t24', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 6, 'Executive debrief template: document decisions made, rationale, and what would be done differently', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t25', 'tabletop_executive', 'Tabletop â€” Executive Track (C-Suite / Board)', 3, 7, 'Cyber risk appetite discussion: use exercise outcome to calibrate exec risk tolerance', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t26', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 0, 'Scenarios: critical vendor ransomware impact, supply chain compromise (SolarWinds-style), vendor data breach exposing client data, vendor going dark during incident', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t27', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 1, 'Vendor notification drill: how and when does the vendor notify you, is it in the contract', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t28', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 2, 'Shared responsibility mapping: who owns what during a vendor-side incident', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t29', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 3, 'Vendor IR plan review: does the vendor have an IR plan, can you see it, does it meet your standards', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t30', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 4, 'Substitution/continuity exercise: if this vendor went offline for 72hrs, what is the fallback', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t31', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 5, 'Contractual gap identification: log SLA/notification gaps discovered during the exercise', false, 'Low', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t32', 'tabletop_vendor', 'Tabletop â€” Vendor / Third-Party Track', 3, 6, 'Vendor scorecard update: findings from exercise feed back into vendor risk register', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t33', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 0, 'After Action Report (AAR): auto-generated from facilitator notes, response logs, and criticality ratings captured during exercise', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t34', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 1, 'AAR sections: summary metrics, TL declaration accuracy, MITRE mapping revealed, criticality accuracy by role, full event timeline, breach declaration record, IR plan comparison', true, NULL, NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_aar_mitre_1', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 2, 'Static visual rendered at session end showing the full scenario branch tree with the path the team actually took highlighted. Taken nodes in cyan, avoided branches dimmed/dashed, unreached nodes grayed. Built from inject_path on tabletop_sessions and MITRE tactic/technique tags on each inject node.', true, 'High', NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('tt_aar_mitre_2', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 3, 'Step-through replay of the session â€” each inject lights up on the MITRE tactic timeline in sequence. Facilitator or client steps forward and backward inject by inject during debrief. Shows inject delivered, branch taken, and MITRE technique triggered. Built entirely from existing session data.', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t34a', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 4, 'IR plan comparison â€” automated: upload ratified IR plan document and auto-compare against exercise event log', false, 'Critical', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t35', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 5, 'Action items log: capture owners, due dates, and priority for each identified gap', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t36', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 6, 'Action items linked to risk register: gaps auto-create or update risk entries', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t37', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 7, 'Action item tracking: open / in progress / closed with due date alerts', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t38', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 8, 'Exercise history: full log of all exercises run per org with AAR attached', true, 'High', NULL, '[]', 'completed')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t39', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 9, 'Trend view: which gaps recur across multiple exercises over time', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t40', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 10, 'Grandfather/Father visibility: view exercise completion status across Child orgs', false, 'Medium', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t41', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 11, 'Export AAR to PDF: branded, client-ready after action report (Anthropic API)', false, 'High', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t42', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 12, 'Export action items to Excel: same format as risk register for consistency', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t43', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 13, 'Compliance evidence: mark exercises as evidence for NIST / ISO / SOC 2 audit readiness', false, NULL, NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t44', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 14, 'Vendor Breach Scenario Inject: post-TPRA, offer to generate a one-page tabletop scenario pre-populated from the assessment â€” data categories exposed, regulatory notification clock (jurisdiction already captured at intake), decision-maker identification, cyber insurance trigger, and DPA contractual rights. No manual prep required.', false, 'Critical', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
INSERT INTO backlog_items (id, section_id, section_title, section_phase, sort_order, "text", done, priority, notes, dependencies, status)
VALUES ('t45', 'tabletop_aar', 'Tabletop â€” After Action & Reporting', 3, 15, 'Findings-to-Remediation Loop: tabletop gaps (missing DPA, unknown notification timeline, no IR decision tree) output as structured action items in the same format as TPRA findings â€” feeding directly into the client''s risk register and remediation roadmap. Closes the loop no competing platform currently closes.', false, 'Critical', NULL, '[]', 'add')
ON CONFLICT (id) DO UPDATE SET
  section_id=EXCLUDED.section_id, section_title=EXCLUDED.section_title, section_phase=EXCLUDED.section_phase, sort_order=EXCLUDED.sort_order, "text"=EXCLUDED."text", done=EXCLUDED.done, priority=EXCLUDED.priority, status=EXCLUDED.status, updated_at=now();
