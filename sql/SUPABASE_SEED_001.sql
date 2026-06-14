-- ============================================================
-- SUPABASE_SEED_001.sql — Demo / presentation seed data
-- Target org: Abbott Cyber Consulting (platform tier)
-- Modules: CIS Controls, AI Governance Assessment (ai_unified),
--           AI Tabletop, Operational Tabletop
-- Run manually in Supabase SQL Editor.
-- Uses inline subqueries for org_id — no PL/pgSQL required.
-- ============================================================

-- Safety check: abort if org not found
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM organisations WHERE name = 'Abbott Cyber Consulting') THEN
    RAISE EXCEPTION 'Abbott Cyber Consulting org not found — check seed data';
  END IF;
END $$;

-- ============================================================
-- 1. CIS CONTROLS v8 — 3 assessment runs (IG1 goal, improving trend)
-- ============================================================

-- Run 1: 2026-02-15 — Initial assessment, score 47%
INSERT INTO assessments (org_id, module, score, sec_pct, ins_pct, answers, assessed_at, conducted_by)
VALUES (
  (SELECT id FROM organisations WHERE name = 'Abbott Cyber Consulting' LIMIT 1),
  'cis', 47, 47, 38,
  '{
    "1.1":"no","1.2":"no",
    "2.1":"no","2.2":"partial","2.3":"no",
    "3.1":"partial","3.2":"no","3.3":"partial","3.4":"partial","3.5":"no",
    "4.1":"partial","4.2":"partial","4.3":"no","4.4":"no","4.5":"no",
    "5.1":"partial","5.2":"yes","5.3":"partial","5.4":"no",
    "6.1":"partial","6.2":"partial","6.3":"no","6.4":"no",
    "8.1":"no","8.2":"no",
    "9.1":"yes","9.2":"yes",
    "10.1":"yes","10.2":"partial",
    "11.1":"partial","11.2":"no","11.3":"no",
    "14.1":"partial","14.2":"partial","14.3":"no"
  }',
  '2026-02-15', 'Mark Abbott'
);

-- Run 2: 2026-04-10 — After remediation sprint, score 62%
INSERT INTO assessments (org_id, module, score, sec_pct, ins_pct, answers, assessed_at, conducted_by)
VALUES (
  (SELECT id FROM organisations WHERE name = 'Abbott Cyber Consulting' LIMIT 1),
  'cis', 62, 62, 55,
  '{
    "1.1":"yes","1.2":"partial",
    "2.1":"partial","2.2":"partial","2.3":"partial",
    "3.1":"yes","3.2":"partial","3.3":"yes","3.4":"partial","3.5":"partial",
    "4.1":"yes","4.2":"yes","4.3":"partial","4.4":"partial","4.5":"no",
    "5.1":"yes","5.2":"yes","5.3":"yes","5.4":"partial",
    "6.1":"yes","6.2":"yes","6.3":"partial","6.4":"partial",
    "8.1":"partial","8.2":"no",
    "9.1":"yes","9.2":"yes",
    "10.1":"yes","10.2":"yes",
    "11.1":"yes","11.2":"partial","11.3":"partial",
    "14.1":"yes","14.2":"partial","14.3":"partial"
  }',
  '2026-04-10', 'Mark Abbott'
);

-- Run 3: 2026-06-05 — Current state, score 74%
INSERT INTO assessments (org_id, module, score, sec_pct, ins_pct, answers, assessed_at, conducted_by)
VALUES (
  (SELECT id FROM organisations WHERE name = 'Abbott Cyber Consulting' LIMIT 1),
  'cis', 74, 74, 68,
  '{
    "1.1":"yes","1.2":"yes",
    "2.1":"yes","2.2":"yes","2.3":"partial",
    "3.1":"yes","3.2":"yes","3.3":"yes","3.4":"yes","3.5":"partial",
    "4.1":"yes","4.2":"yes","4.3":"yes","4.4":"partial","4.5":"partial",
    "5.1":"yes","5.2":"yes","5.3":"yes","5.4":"yes",
    "6.1":"yes","6.2":"yes","6.3":"yes","6.4":"partial",
    "8.1":"yes","8.2":"partial",
    "9.1":"yes","9.2":"yes",
    "10.1":"yes","10.2":"yes",
    "11.1":"yes","11.2":"yes","11.3":"partial",
    "14.1":"yes","14.2":"yes","14.3":"yes"
  }',
  '2026-06-05', 'Mark Abbott'
);

-- ============================================================
-- 2. AI GOVERNANCE ASSESSMENT (ai_unified) — 3 runs
-- ============================================================

-- Run 1: 2026-03-01 — Baseline scan, score 51%
INSERT INTO assessments (org_id, module, score, answers, assessed_at, conducted_by)
VALUES (
  (SELECT id FROM organisations WHERE name = 'Abbott Cyber Consulting' LIMIT 1),
  'ai_unified', 51,
  '{
    "_frameworks":"{\"nist\":true,\"iso\":true}",
    "AIG-1.1":"yes","AIG-1.2":"partial","AIG-1.3":"no","AIG-1.4":"no","AIG-1.5":"no",
    "AIG-2.1":"yes","AIG-2.2":"partial","AIG-2.3":"no","AIG-2.4":"no","AIG-2.5":"no",
    "AIG-3.1":"partial","AIG-3.2":"no","AIG-3.3":"no","AIG-3.4":"no","AIG-3.5":"no",
    "AIG-4.1":"partial","AIG-4.2":"partial","AIG-4.3":"no","AIG-4.4":"no",
    "AIG-5.1":"partial","AIG-5.2":"no","AIG-5.3":"no","AIG-5.4":"no","AIG-5.5":"no",
    "AIG-6.1":"partial","AIG-6.2":"no","AIG-6.3":"no","AIG-6.4":"no","AIG-6.5":"no","AIG-6.6":"no",
    "AIG-7.1":"yes","AIG-7.2":"partial","AIG-7.3":"no","AIG-7.4":"no","AIG-7.5":"no","AIG-7.6":"no",
    "AIG-8.1":"partial","AIG-8.2":"no","AIG-8.3":"no","AIG-8.4":"no",
    "AIG-9.1":"no","AIG-9.2":"partial","AIG-9.3":"no","AIG-9.4":"no"
  }',
  '2026-03-01', 'Mark Abbott'
);

-- Run 2: 2026-05-01 — After AI governance framework implementation, score 64%
INSERT INTO assessments (org_id, module, score, answers, assessed_at, conducted_by)
VALUES (
  (SELECT id FROM organisations WHERE name = 'Abbott Cyber Consulting' LIMIT 1),
  'ai_unified', 64,
  '{
    "_frameworks":"{\"nist\":true,\"iso\":true}",
    "AIG-1.1":"yes","AIG-1.2":"yes","AIG-1.3":"partial","AIG-1.4":"partial","AIG-1.5":"no",
    "AIG-2.1":"yes","AIG-2.2":"yes","AIG-2.3":"partial","AIG-2.4":"partial","AIG-2.5":"no",
    "AIG-3.1":"yes","AIG-3.2":"partial","AIG-3.3":"partial","AIG-3.4":"no","AIG-3.5":"no",
    "AIG-4.1":"yes","AIG-4.2":"yes","AIG-4.3":"partial","AIG-4.4":"no",
    "AIG-5.1":"yes","AIG-5.2":"partial","AIG-5.3":"partial","AIG-5.4":"no","AIG-5.5":"no",
    "AIG-6.1":"partial","AIG-6.2":"partial","AIG-6.3":"partial","AIG-6.4":"no","AIG-6.5":"no","AIG-6.6":"no",
    "AIG-7.1":"yes","AIG-7.2":"yes","AIG-7.3":"partial","AIG-7.4":"partial","AIG-7.5":"no","AIG-7.6":"no",
    "AIG-8.1":"partial","AIG-8.2":"partial","AIG-8.3":"no","AIG-8.4":"no",
    "AIG-9.1":"partial","AIG-9.2":"yes","AIG-9.3":"no","AIG-9.4":"no"
  }',
  '2026-05-01', 'Mark Abbott'
);

-- Run 3: 2026-06-10 — Current state, score 72%
INSERT INTO assessments (org_id, module, score, answers, assessed_at, conducted_by)
VALUES (
  (SELECT id FROM organisations WHERE name = 'Abbott Cyber Consulting' LIMIT 1),
  'ai_unified', 72,
  '{
    "_frameworks":"{\"nist\":true,\"iso\":true}",
    "AIG-1.1":"yes","AIG-1.2":"yes","AIG-1.3":"yes","AIG-1.4":"partial","AIG-1.5":"partial",
    "AIG-2.1":"yes","AIG-2.2":"yes","AIG-2.3":"yes","AIG-2.4":"partial","AIG-2.5":"partial",
    "AIG-3.1":"yes","AIG-3.2":"yes","AIG-3.3":"partial","AIG-3.4":"partial","AIG-3.5":"no",
    "AIG-4.1":"yes","AIG-4.2":"yes","AIG-4.3":"yes","AIG-4.4":"partial",
    "AIG-5.1":"yes","AIG-5.2":"yes","AIG-5.3":"partial","AIG-5.4":"partial","AIG-5.5":"no",
    "AIG-6.1":"yes","AIG-6.2":"partial","AIG-6.3":"partial","AIG-6.4":"partial","AIG-6.5":"no","AIG-6.6":"no",
    "AIG-7.1":"yes","AIG-7.2":"yes","AIG-7.3":"yes","AIG-7.4":"partial","AIG-7.5":"partial","AIG-7.6":"no",
    "AIG-8.1":"yes","AIG-8.2":"partial","AIG-8.3":"partial","AIG-8.4":"no",
    "AIG-9.1":"partial","AIG-9.2":"yes","AIG-9.3":"partial","AIG-9.4":"no"
  }',
  '2026-06-10', 'Mark Abbott'
);

-- ============================================================
-- 3. AI TABLETOP — 3 completed exercises
-- ============================================================

-- Exercise 1: AI-01 The Phantom Tool (2026-04-08)
INSERT INTO assessments (org_id, module, score, answers, assessed_at, conducted_by)
VALUES (
  (SELECT id FROM organisations WHERE name = 'Abbott Cyber Consulting' LIMIT 1),
  'ai_tabletop', 0,
  '{
    "scenarioId":"AI-01",
    "scenarioName":"The Phantom Tool",
    "facilitator":"Mark Abbott",
    "injectNotes":{
      "0":"Group flagged no approved AI tool list exists. Shadow AI is common across finance team. No current process to audit browser extensions.",
      "1":"Two confirmed cases where client PII was summarised. Group agreed notification assessment needed. Exposure window: 6 weeks.",
      "2":"Vendor has no security contact. Group noted this tool would never have passed a proper intake process. Intake process gap confirmed.",
      "3":"CFO machine changes the risk profile significantly. Group discussed legal privilege exposure and whether board notification is required."
    },
    "discussionNotes":{
      "0":"Group agreed CCPA likely triggered if California clients in the summarised reports. State breach notification laws require assessment within 72h. Designated legal counsel to assess by EOD.",
      "1":"IT to push MDM policy to block unapproved extensions in next maintenance window. No staff communication until removal is confirmed complete.",
      "2":"Intake process failed entirely — no policy existed. Action: draft AI tool intake policy by end of month with 48h review SLA.",
      "3":"Log preservation priority: browser extension activity logs first (volatile), then files accessed, then egress logs."
    },
    "notifChecks":{"carrier":true,"counsel":true,"irfirm":false,"ftc":false,"stateag":true,"ccpa":true,"hipaa":false,"sec":false,"individuals":false,"le":false}
  }',
  '2026-04-08', 'Mark Abbott'
);

-- Exercise 2: AI-03 The Deepfake Executive (2026-05-12)
INSERT INTO assessments (org_id, module, score, answers, assessed_at, conducted_by)
VALUES (
  (SELECT id FROM organisations WHERE name = 'Abbott Cyber Consulting' LIMIT 1),
  'ai_tabletop', 0,
  '{
    "scenarioId":"AI-03",
    "scenarioName":"The Deepfake Executive",
    "facilitator":"Mark Abbott",
    "injectNotes":{
      "0":"Group immediately noted that LinkedIn and the public board summary contained enough context for the deepfake to be convincing. Mark noted this is a real risk for boutique consulting firms where principals are public-facing.",
      "1":"No out-of-band verification protocol existed. Group noted the urgency framing is a known social engineering trigger. Policy gap: no callback verification for financial transfers above any threshold.",
      "2":"Second attempt reveals the attacker has a list and a script. Group agreed to suspend all wire authorisations pending verbal CEO confirmation regardless of amount.",
      "3":"Carrier must be notified within 72h. Group confirmed cyber policy has a crime rider. Claim value TBD pending forensics.",
      "4":"Forensic confirmation changes internal communications posture. CFO cleared — acted in good faith with no verification protocol available."
    },
    "discussionNotes":{
      "0":"Immediate action: CEO personal mobile number distributed to finance team as sole verification channel for financial instructions. No exceptions.",
      "1":"Root cause: no out-of-band verification protocol. Fix: written policy requiring callback to known personal number before any wire above $5K. No exceptions for urgency.",
      "2":"Carrier notified. SWIFT gpi recall attempt filed. Bank contacted. Funds destination monitored.",
      "3":"Forensic vendor engaged. Evidence preserved. CFO formally briefed and cleared of wrongdoing."
    },
    "notifChecks":{"carrier":true,"counsel":true,"irfirm":true,"ftc":false,"stateag":false,"ccpa":false,"hipaa":false,"sec":false,"individuals":false,"le":true}
  }',
  '2026-05-12', 'Mark Abbott'
);

-- Exercise 3: AI-06 The Shadow Agent (2026-06-03)
INSERT INTO assessments (org_id, module, score, answers, assessed_at, conducted_by)
VALUES (
  (SELECT id FROM organisations WHERE name = 'Abbott Cyber Consulting' LIMIT 1),
  'ai_tabletop', 0,
  '{
    "scenarioId":"AI-06",
    "scenarioName":"The Shadow Agent",
    "facilitator":"Mark Abbott",
    "injectNotes":{
      "0":"Group flagged FTC Act §5 as the most immediate concern — 2,400 undisclosed AI-generated emails likely constitutes a deceptive practice. Group noted no AI communications disclosure policy exists.",
      "1":"API key had platform-wide permissions. Root technical failure: no scoped API keys, no per-application token management.",
      "2":"Customer financial data in personal Notion workspace is an immediate data breach regardless of AI angle. Group treated this as the highest-priority item: legal hold, no deletions.",
      "3":"Developer acted in good faith. Culture issue: no AI intake policy meant no way for them to know this required approval. Group recommended against disciplinary action."
    },
    "discussionNotes":{
      "0":"Immediate: shut down the agent, revoke and rotate the API key, legal hold on Notion workspace. Do not delete anything yet.",
      "1":"Disclosure assessment: 2,400 customers received AI-generated emails without disclosure. Legal to assess FTC deceptive practice exposure and state notification obligations.",
      "2":"Governance fix required: AI use policy with a fast (48h) intake process so developers use it rather than bypass it. Blame-free retrospective with the developer.",
      "3":"AI inventory gap confirmed — no inventory process caught this 3-month-running system. New inventory process to include developer-built tools and API key usage audit."
    },
    "notifChecks":{"carrier":true,"counsel":true,"irfirm":false,"ftc":true,"stateag":true,"ccpa":true,"hipaa":false,"sec":false,"individuals":false,"le":false}
  }',
  '2026-06-03', 'Mark Abbott'
);

-- ============================================================
-- 4. OPERATIONAL TABLETOP — 3 completed sessions
-- ============================================================

-- Session 1: Ransomware via Phishing (2026-03-18)
INSERT INTO tabletop_sessions (
  org_id, scenario_id, scenario_title, session_code, status, facilitator_name,
  current_inject, declaration_logged,
  tl_assessment, tl_severity, tl_declare,
  breach_declared, breach_timestamp, breach_rationale,
  ic_sign_time, es_sign_time, notif_filed, exercise_log
) VALUES (
  (SELECT id FROM organisations WHERE name = 'Abbott Cyber Consulting' LIMIT 1),
  'ransom_phish', 'Ransomware via Phishing', 'RNS001', 'complete', 'Mark Abbott',
  4, true,
  'PCs showing payment popups, files with unusual extensions, 3 machines unresponsive. Same pattern on PMS-01.',
  'P1', true,
  true, '2026-03-18T14:22:00', 'EDR confirmed LockBit-style payload on 4 hosts including PMS server. 78GB exfiltration to mega.nz confirmed in firewall logs.',
  '2026-03-18T14:25:00', '2026-03-18T14:27:00', true,
  '[
    {"time":"13:45","role":"TL","action":"P1 declared. IR plan activated. War room stood up."},
    {"time":"13:52","role":"TL","action":"EDR isolation applied to FRONT-DESK-01/02/03 and BO-PMS-01."},
    {"time":"14:05","role":"IC","action":"Containment confirmed. Forensic imaging initiated on all affected hosts."},
    {"time":"14:15","role":"LC","action":"PIPEDA RROSH assessment commenced. Cyber counsel notified."},
    {"time":"14:18","role":"ES","action":"Manual check-in authorised. GM notified. Insurer contacted."},
    {"time":"14:22","role":"IC","action":"Breach declaration triggered — IC sign at 14:22."},
    {"time":"14:27","role":"ES","action":"Breach co-signed by ES at 14:27. Formal breach record logged."},
    {"time":"14:35","role":"TL","action":"Firewall egress logs confirm 78GB to mega.nz. Exfil confirmed."},
    {"time":"14:50","role":"CL","action":"Guest notification template drafted and submitted for legal review."},
    {"time":"15:10","role":"LC","action":"OPC + BC OIPC notified. 72h carrier notification filed."},
    {"time":"15:30","role":"TL","action":"Clean backup from 18h prior verified by IR firm. Restore plan approved by IC and ES."}
  ]'
);

-- Session 2: BEC Wire Fraud (2026-04-22)
INSERT INTO tabletop_sessions (
  org_id, scenario_id, scenario_title, session_code, status, facilitator_name,
  current_inject, declaration_logged,
  tl_assessment, tl_severity, tl_declare,
  breach_declared, breach_timestamp, breach_rationale,
  ic_sign_time, es_sign_time, notif_filed, exercise_log
) VALUES (
  (SELECT id FROM organisations WHERE name = 'Abbott Cyber Consulting' LIMIT 1),
  'bec_wire', 'BEC Wire Fraud', 'BEC001', 'complete', 'Mark Abbott',
  3, true,
  'CEO questioning a $47K wire he never approved. Finance got a Teams message and email from the CEO account.',
  'P2', true,
  false, NULL, NULL,
  NULL, NULL, false,
  '[
    {"time":"09:10","role":"IC","action":"P2 declared. CEO M365 session revoked immediately. MFA reset initiated."},
    {"time":"09:18","role":"TL","action":"M365 audit log review: login from Eastern Europe at 02:14, MFA fatigue attack confirmed. Malicious inbox rules identified and removed."},
    {"time":"09:25","role":"ES","action":"Bank contacted for SWIFT gpi wire recall. Written authorisation provided."},
    {"time":"09:32","role":"TL","action":"CFO account also compromised — same IP range, MFA push accepted at 02:31. Scope expanded."},
    {"time":"09:40","role":"IC","action":"CFO account revoked. All financial approvals from CFO email in 48h window under review."},
    {"time":"09:55","role":"LC","action":"$31K of $47K recovered via recall. $16K withdrawn to overseas account — unrecoverable."},
    {"time":"10:10","role":"TL","action":"6-day dwell period confirmed. All emails treated as compromised. Counterparties notified not to act on CEO/CFO instructions from that window."},
    {"time":"10:30","role":"IC","action":"Attacker evicted. Number-matching MFA deployed org-wide. Legacy auth disabled."}
  ]'
);

-- Session 3: Overnight Vishing (2026-05-20)
INSERT INTO tabletop_sessions (
  org_id, scenario_id, scenario_title, session_code, status, facilitator_name,
  current_inject, declaration_logged,
  tl_assessment, tl_severity, tl_declare,
  breach_declared, breach_timestamp, breach_rationale,
  ic_sign_time, es_sign_time, notif_filed, exercise_log
) VALUES (
  (SELECT id FROM organisations WHERE name = 'Abbott Cyber Consulting' LIMIT 1),
  'overnight_vishing', 'Overnight Vishing', 'VSH001', 'complete', 'Mark Abbott',
  3, true,
  'Night manager reports overnight staff let in fake Agilysys support call at 3am via remote access. Session open 40 minutes.',
  'P2', true,
  true, '2026-05-20T08:45:00', 'pms_svc and domain admin credentials captured via keylogger in RAT. Bulk SELECT on guest_profiles: 6,200 rows exported to guests_export.7z. Attacker had DA access for 45 minutes.',
  '2026-05-20T08:50:00', '2026-05-20T08:53:00', true,
  '[
    {"time":"07:30","role":"TL","action":"RAT confirmed on FRONT-DESK-04. AnyDesk installed silently at 03:22. C2 active to Ukraine IP. Host isolated."},
    {"time":"07:45","role":"IC","action":"P2 declared. War room activated. Memory dump captured before isolation."},
    {"time":"08:00","role":"TL","action":"Keylogger in RAT confirmed. pms_svc and domain admin credentials captured. Both accounts disabled immediately."},
    {"time":"08:10","role":"ES","action":"PMS downtime authorised. Manual check-in procedures activated. GM notified."},
    {"time":"08:20","role":"TL","action":"PMS audit logs: 6,200 guest records queried and archived between 04:03-04:44. guests_export.7z created."},
    {"time":"08:30","role":"LC","action":"PIPEDA RROSH assessment: passport numbers + tokenised cards = near-certain. Cyber counsel engaged."},
    {"time":"08:45","role":"IC","action":"Breach declaration triggered. Exfil archive confirmed. IC sign 08:50."},
    {"time":"08:53","role":"ES","action":"Breach co-signed by ES. OPC + BC OIPC notification clock started."},
    {"time":"09:15","role":"TL","action":"Root cause: no callback verification policy for vendor support calls. Agilysys confirms no call was made. Spoofed VOIP number confirmed."},
    {"time":"09:30","role":"CL","action":"Guest notification template drafted. Credit monitoring offer approved."}
  ]'
);
