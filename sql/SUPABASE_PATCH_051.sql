-- SUPABASE_PATCH_051.sql
-- Adds compliance_tags column to tabletop_scenarios and seeds 8 platform scenarios
-- across BCDR, Executive, AI Governance, and PCI DSS tracks.
-- Run in the Supabase SQL Editor after PATCH_050.
-- Safe to re-run: uses ON CONFLICT DO NOTHING via unique source_id checks.

-- Step 1: Add compliance_tags column (missing from PATCH_050)
ALTER TABLE tabletop_scenarios
  ADD COLUMN IF NOT EXISTS compliance_tags text[] DEFAULT '{}';

-- Step 2: Seed platform scenarios
-- These are org_id = NULL (shared, platform-wide).
-- status = 'published' so they appear in the Scenario Library.

-- ──────────────────────────────────────────────────────────────────────────────
-- BCDR TRACK
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO tabletop_scenarios
  (title, track, industry, difficulty, duration, summary, tags, compliance_tags, declaration, injects, status, source_id)
VALUES (
  'Primary Datacenter Power Failure — DR Activation',
  'bcdr',
  'All',
  'Medium',
  '~45 min',
  'The primary datacenter loses power at 6 AM on a weekday. UPS systems fail to sustain load, the generator does not start. The DR site exists but has not been tested in 18 months. RTO and RPO are contractually committed to enterprise clients. The team must decide: activate DR and accept unknown risks, or wait out the outage.',
  ARRAY['bcdr', 'availability'],
  ARRAY['cyber_insurance'],
  '{
    "ingest": "PSA ticket",
    "source": "NOC — automated monitoring",
    "raw": "CRITICAL: All systems at the primary datacenter are unreachable as of 06:14. Power draw dropped to zero. UPS battery status was normal at last check. Generator self-test passed two weeks ago. 14 enterprise clients and all internal systems are affected. Secondary site is warm-standby.",
    "correctSeverity": "P1",
    "correctDeclare": false
  }'::jsonb,
  '[
    {
      "ingest": "Technician anomaly",
      "title": "Generator failure confirmed — utility ETA 4–6 hours",
      "body": "On-site engineer reports the generator started but a fuel line fault caused shutdown 90 seconds later. Emergency generator repair is estimated at 3–4 hours. Utility company confirms a substation fault — power restoration ETA is 4–6 hours. Current battery backup provides approximately 8 minutes of power to critical systems. Three enterprise clients have SLA commitments of 99.9% uptime (max 44 min/month downtime). Two are already calling.",
      "phaseIdx": 1,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "N/A — BCDR", "technique": "Availability failure"},
      "rolePrompts": {
        "ic": "Decision: initiate DR failover now, before battery expires? Failover was last tested 18 months ago — unknown reliability. If you wait and batteries die, failover starts from a cold state. Make the call.",
        "tl": "Initiate DR pre-checks now — validate replication status and determine how stale the DR data is. What is the current RPO? How many transactions have not replicated? Can we do a controlled shutdown of primary before battery fails?",
        "cl": "Notify the three SLA-committed clients now — they are already calling. Be honest about the ETA. Draft a proactive notice to all 14 clients. Do not promise a restoration time you cannot keep.",
        "lc": "Review SLA commitments immediately. At 4–6 hours, some clients will have a right to SLA credit. Does your contract cap liability for outages caused by utility failure (force majeure)? Advise the IC before promises are made to clients.",
        "es": "Authorise the DR failover decision. If DR fails, the downside is worse than a controlled wait — but batteries expire in 8 minutes. Who has authority to approve the call? Make the decision now."
      }
    },
    {
      "ingest": "Technician anomaly",
      "title": "DR failover initiated — critical database 6 hours behind on replication",
      "body": "DR failover is underway. Most services are coming online at the secondary site. However, the core ERP database replication was paused 6 hours ago due to a replication conflict that was never resolved by the on-call team. Six hours of transactions — including order processing, billing, and inventory updates — are not in DR. The primary site data is now inaccessible. Data reconciliation will be required post-recovery. Two enterprise clients have escalated to executive level.",
      "phaseIdx": 2,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — BCDR", "technique": "Data loss during failover"},
      "rolePrompts": {
        "ic": "Document the 6-hour RPO breach. Who approved the replication conflict being left unresolved? This is an audit finding. Communicate the data gap to affected clients before they discover it themselves.",
        "tl": "Assess what can be reconstructed: email-based order confirmations, bank transaction records, manual logs. What is the reconciliation effort — hours or days? Can you restore partial functionality while reconciliation proceeds?",
        "cl": "Brief the two escalated enterprise clients directly. Acknowledge the data gap, explain what is being done to reconcile, and give a timeline. No minimising — they need accurate information to brief their own teams.",
        "lc": "The unresolved replication conflict is a documented failure that contributed to data loss. This is relevant to SLA breach claims and potentially E&O liability. Preserve all records of the replication conflict ticket and who had visibility.",
        "es": "The replication conflict was known and unresolved. This is a process failure, not just a technology failure. After recovery, commission a BCDR programme review — test frequency, escalation paths, and on-call authority. Brief the board."
      }
    },
    {
      "ingest": "HR + management",
      "title": "Full recovery — post-incident review reveals DR plan had not been updated in 2 years",
      "body": "Primary site power is restored after 7.5 hours. DR performed reasonably well except for the database replication gap. Post-incident review reveals: the DR runbook referenced 3 systems that were decommissioned in 2024, two contacts in the escalation tree had left the company, and the last full DR test was 26 months ago (not 18 as believed). SLA breach credits are owed to 3 clients totalling approximately $18,000. One client has requested a formal incident report and updated BCDR documentation within 30 days.",
      "phaseIdx": 3,
      "correctCriticality": "Medium",
      "mitre": {"tactic": "N/A — Post-incident", "technique": "Process gap"},
      "rolePrompts": {
        "ic": "Assign owners for each gap identified: runbook update, contact list refresh, DR test scheduling. Set 30-day and 90-day milestones. The client requesting the formal report gets it — this is also good practice.",
        "tl": "Update the DR runbook this week. Remove decommissioned systems, verify all recovery steps are accurate, and schedule a DR test within 60 days. The test must include the database replication validation.",
        "cl": "Prepare the formal incident report for the requesting client. Include: timeline, root cause, what was recovered, what data was affected, and the remediation plan. Transparent and professionally written.",
        "lc": "Issue the SLA credits proactively — do not wait for clients to invoice them. Proactive credit issuance reduces churn risk and demonstrates good faith. Confirm whether the incident triggers any insurance reporting obligation.",
        "es": "Approve the BCDR programme investment: annual DR testing, quarterly runbook reviews, and a documented on-call authority matrix. The $18K in SLA credits is cheap compared to client loss — but the root cause is programme neglect, and that needs board-level visibility."
      }
    }
  ]'::jsonb,
  'published',
  'bcdr_dc_failure'
),
(
  'Critical SaaS Vendor Shutdown — 30-Day Notice',
  'bcdr',
  'All',
  'Hard',
  '~60 min',
  'Your core payroll and HR SaaS vendor sends an email: they are shutting down in 30 days. No acquirer has been found. Data export is available for 30 days, after which all data is deleted. Payroll runs in 8 days. The organisation has no secondary system and the contract has no data portability clause.',
  ARRAY['bcdr', 'third-party', 'availability'],
  ARRAY['cyber_insurance'],
  '{
    "ingest": "PSA ticket",
    "source": "CEO — forwarded vendor shutdown notice",
    "raw": "CEO forwarded an email from your payroll/HR SaaS vendor. Subject: Important Notice — Service Discontinuation. They are ceasing operations in 30 days due to funding failure. All data must be exported within this window. After 30 days, all data will be permanently deleted. Your next payroll run is in 8 days and the platform is the system of record for all employee compensation, hours, and tax withholdings.",
    "correctSeverity": "P1",
    "correctDeclare": false
  }'::jsonb,
  '[
    {
      "ingest": "Technician anomaly",
      "title": "Payroll in 8 days — platform still running but vendor is non-responsive",
      "body": "The vendor platform is still accessible. You have exported a full data backup (CSV format — not importable to any major payroll system without transformation). The vendor support line is unmanned. The CEO of the vendor has not responded to email. Your HR team has identified two potential replacement platforms: one can onboard in 3–5 weeks (misses this payroll cycle), and one claims 5–7 business day onboarding but has never handled an emergency migration of this scale. Manual payroll processing via your bank is technically possible but requires certified payroll calculations that your HR team is not set up to perform.",
      "phaseIdx": 1,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "N/A — BCDR", "technique": "Third-party vendor failure"},
      "rolePrompts": {
        "ic": "Three options: (1) rush the fast-onboard replacement — high risk, unknown. (2) Manual payroll via bank — requires external payroll service. (3) Pay this cycle manually from last cycle''s data and clean up next cycle. What can you actually execute in 8 days?",
        "tl": "Export EVERYTHING from the vendor platform today — not just payroll data but employee records, tax withholdings (YTD), direct deposit info, benefits enrollment, and historical pay stubs. Transform the CSV into a format usable by the most likely replacement.",
        "cl": "Communicate with employees now. They have a right to know payroll may be disrupted. Set expectations: payroll will be delivered, you are managing a vendor crisis. Do not be vague — employees will find out.",
        "lc": "Missing payroll is a legal liability in most jurisdictions. Research your obligations: how long do you have before a missed payroll becomes a labour law violation? Is there a manual payroll option via your bank that meets legal requirements? What does your contract with the vendor say about service continuity?",
        "es": "Authorise emergency spend for an external payroll processing firm to handle this cycle manually. Cost is secondary to meeting the payroll deadline. Communicate with the board — missed payroll is a trust-destroying event."
      }
    },
    {
      "ingest": "Technician anomaly",
      "title": "Data export complete — transformation reveals 18 months of missing records",
      "body": "The full data export is complete. During transformation for import into the replacement platform, IT discovers that 18 months of timesheet records and 4 months of expense reimbursement records are missing from the export — they exist in the platform UI but were not included in the export files. The vendor export tool has a known bug (discovered via their community forum) that omits records older than a certain date. The vendor is unreachable. The missing data affects overtime calculations, YTD tax withholdings, and pending expense claims totalling approximately $34,000.",
      "phaseIdx": 2,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — BCDR", "technique": "Data integrity failure"},
      "rolePrompts": {
        "ic": "The missing data affects legal payroll accuracy. Can you reconstruct it from bank records, email approvals, or manager approvals? What is the litigation risk of running payroll with potentially incorrect YTD data?",
        "tl": "Screen-scrape or manually export the missing records while the platform is still up. Use the UI, browser developer tools, or any API access available. Every record is potentially worth real money — prioritise expense claims and overtime.",
        "cl": "Do not tell employees their data may be missing until you know the scope and have a recovery plan. Premature disclosure creates panic with no actionable information.",
        "lc": "Running payroll with incorrect YTD tax data creates employer tax liability. Consult your payroll accountant immediately. The vendor has potentially breached their contract by failing to provide a complete data export — document this for any future claim.",
        "es": "Authorise the manual data reconstruction effort — it is cheaper than the liability of incorrect payroll. Escalate to the vendor''s investors or board if you have any contact information. This vendor failure may be recoverable under your commercial cyber or professional liability policy."
      }
    },
    {
      "ingest": "HR + management",
      "title": "Replacement onboarded — lessons learned and vendor risk gaps identified",
      "body": "The emergency payroll cycle was processed manually with an external firm at a cost of $4,200. The replacement platform was onboarded within 11 days (missing the first payroll cycle by 3 days — employees were paid 3 days late). Post-incident review reveals: no vendor risk assessment was ever performed on the payroll platform, the contract had no SLA, no data portability clause, and no business continuity requirement. The same gap exists for three other critical SaaS platforms the organisation relies on.",
      "phaseIdx": 3,
      "correctCriticality": "Medium",
      "mitre": {"tactic": "N/A — Post-incident", "technique": "Vendor risk gap"},
      "rolePrompts": {
        "ic": "Assign a vendor risk assessment programme — every critical SaaS platform needs a DR plan and data portability verification. The three other at-risk platforms need immediate review.",
        "tl": "For each critical SaaS dependency: confirm data export capability today (test it), document the export format and transformation requirements, and identify a replacement with estimated onboarding time. This is your BCDR documentation for vendor failure.",
        "cl": "Communicate with employees about the 3-day delay — acknowledge it, explain why, and confirm it will not happen again. A brief all-hands or email from the CEO is appropriate.",
        "lc": "Update all new SaaS contracts to include: data portability clause, 90-day notice for service discontinuation, SLA minimums, and right to audit. Retroactively negotiate these terms with existing critical vendors on renewal.",
        "es": "Approve a vendor risk programme as a standing operational requirement. The $4,200 emergency payroll cost plus team disruption is the lesson cost — invest in preventing recurrence across all critical vendors."
      }
    }
  ]'::jsonb,
  'published',
  'bcdr_critical_vendor'
),

-- ──────────────────────────────────────────────────────────────────────────────
-- EXECUTIVE TRACK
-- ──────────────────────────────────────────────────────────────────────────────

(
  'Ransomware Ransom Decision — Board-Level Pay or Rebuild',
  'executive',
  'All',
  'Hard',
  '~45 min',
  'Full encryption event. Backups are corrupted or missing. The ransom demand is $500K in cryptocurrency. Insurance will cover $300K. Rebuilding from scratch is estimated at 3–5 weeks of downtime. The board must decide: pay and recover in days, or rebuild over weeks and lose clients. There is no right answer.',
  ARRAY['ransomware', 'extortion'],
  ARRAY['cyber_insurance'],
  '{
    "ingest": "SOC alert",
    "source": "CISO — post-containment briefing",
    "raw": "All servers and 90% of endpoints are encrypted. LockBit affiliate. Ransom note on every screen: $500,000 USD in Bitcoin, 72-hour deadline, price doubles after 48 hours. We have confirmed: backup server was encrypted 4 days ago before we detected anything. Offsite tape backup is 3 weeks old. Rebuilding estimates: 3–5 weeks minimum. Insurance policy limit is $1M with a $300K ransom sub-limit and 3-day waiting period.",
    "correctSeverity": "P1",
    "correctDeclare": true
  }'::jsonb,
  '[
    {
      "ingest": "SOC alert",
      "title": "Technical assessment complete — no clean recovery path without ransom",
      "body": "Forensic team assessment: the encryption is LockBit 3.0 with no known decryption vulnerability. Rebuilding from the 3-week-old tape backup means 3 weeks of lost transactions and data. Full rebuild from scratch (hardware, OS, applications, data re-entry) is estimated at 4–5 weeks and $280,000 in labour and infrastructure. Key systems affected include the ERP, CRM, and all client-facing platforms. Three enterprise clients have already emailed asking for system access restoration timelines. One has mentioned their own contractual obligations depend on your system availability.",
      "phaseIdx": 1,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0040 Impact", "technique": "T1486 Data Encrypted for Impact"},
      "triggersBreach": true,
      "rolePrompts": {
        "ic": "Frame the decision for the board clearly: pay $500K (recover in 3–5 days, lose $200K after insurance), or rebuild ($280K cost, 4–5 weeks, risk losing clients). What is the revenue impact of 4–5 weeks of downtime vs $200K out of pocket? Prepare the numbers.",
        "tl": "Validate the rebuild estimate — is 4–5 weeks realistic or pessimistic? What could be done faster if you prioritised only the most critical systems? Identify the minimum viable recovery: what systems do you NEED in week 1 vs week 3?",
        "cl": "The board decision must remain confidential. No external communication about the ransom or the decision-making process. Clients need a status update — give them a timeline without revealing you are considering payment.",
        "lc": "Confirm: paying a ransom may have legal implications depending on the jurisdiction and sanctioned entities list — check the attacker group against OFAC. Notify the FBI IC3 regardless of the payment decision. Insurance carrier must be on a call before payment is authorised — the $300K sub-limit has conditions.",
        "es": "This is your decision with the board. The financial analysis: $200K out-of-pocket vs $280K rebuild plus 4–5 weeks of revenue loss. What is your weekly revenue? What is the cost of losing one enterprise client permanently? Frame the risk and make a recommendation."
      }
    },
    {
      "ingest": "Bank + finance team",
      "title": "48-hour deadline passes — price doubles to $1M",
      "body": "The board spent 52 hours deliberating. The 48-hour deadline has passed and the ransom has doubled to $1M — beyond the insurance sub-limit by $700K. The attacker has sent a follow-up message: they have exfiltrated 40GB of data before encrypting, and will publish it on their leak site in 72 hours if payment is not received. The leaked data includes client contracts, employee data, and financial records. The situation has now escalated from a recovery decision to a combined recovery and breach notification decision.",
      "phaseIdx": 2,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0010 Exfiltration + TA0040 Impact", "technique": "Double extortion"},
      "rolePrompts": {
        "ic": "The calculus has changed: this is now a double-extortion scenario. Payment at $1M is $700K above the insurance sub-limit. Non-payment means public data leak in 72 hours. Breach notification obligations exist regardless of payment. What is the board''s position?",
        "tl": "Assess the exfiltration claim — is it credible? Review egress logs from the pre-detection period. If 40GB was transferred, where did it go? What data categories were in those files? This determines notification scope.",
        "cl": "Prepare for the leak scenario now — assume it happens in 72 hours and draft the breach notification and press response. If data is published, you need to respond within hours, not days. The leak itself becomes the news.",
        "lc": "The exfiltration constitutes a confirmed breach regardless of whether you pay. Notification obligations are triggered now. FBI notification required. Insurance carrier must be updated on the scope change. OFAC check on the attacker group is now critical — payment to a sanctioned entity is a federal offence.",
        "es": "Recommend to the board: begin breach notification program now regardless of the payment decision. The data leak is coming either way — getting ahead of it with proactive notification is better than reacting to the leak site publication. Authorise notification spend."
      }
    },
    {
      "ingest": "HR + management",
      "title": "Board decision made — managing the aftermath",
      "body": "The board has made their decision (facilitator discretion: either outcome is valid for discussion). Participants should discuss: if they paid, what happens in the next 30 days (decryption, post-recovery audit, insurance claim, FBI cooperation, client communication about the exfiltration)? If they did not pay, what happens (rebuild timeline, data leak management, client notification, press response, client retention)? The goal of this inject is a structured post-decision debrief.",
      "phaseIdx": 3,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — Post-decision", "technique": "Recovery"},
      "rolePrompts": {
        "ic": "If paid: immediate post-payment actions — verify decryptor works before confirming payment receipt, run forensics to confirm attacker access is closed, do NOT assume paying means they are gone. If not paid: rebuild prioritisation — what comes back in day 1, week 1, week 2?",
        "tl": "Either path: a full forensic investigation is mandatory. How did they get in? How long were they in before encryption? What controls failed? This is your post-incident report for insurance, clients, and the board.",
        "cl": "Breach notification program goes out regardless of the payment decision — the exfiltration happened. Client communication on the restoration timeline is also needed. Two separate messages, two separate tracks.",
        "lc": "Insurance claim documentation: gather all costs, timelines, and decisions with dates. The carrier will require a full incident timeline. If paid: confirm payment was OFAC-clean. File police report and FBI IC3 report. Both are required for most cyber insurance claims.",
        "es": "Board debrief: what would have prevented this? The backup failure is the critical gap — a working air-gapped backup would have eliminated the ransom option entirely. Authorise a backup programme audit and DR test schedule as the first post-incident action."
      }
    }
  ]'::jsonb,
  'published',
  'exec_ransom_decision'
),
(
  'Breach Gone Public — Crisis Communications Under Fire',
  'executive',
  'All',
  'Medium',
  '~45 min',
  'A significant customer data breach occurred 3 weeks ago. Legal and the CISO recommended notifying customers before going public. While the notification program was being prepared, a journalist received a tip from an unknown source and published a story this morning — naming your company, describing the breach, and quoting "a source familiar with the matter." Customers learned about the breach from the news before receiving the official notice.',
  ARRAY['data-breach', 'regulatory', 'compliance-response'],
  ARRAY['cyber_insurance'],
  '{
    "ingest": "HR + management",
    "source": "VP Communications — urgent call",
    "raw": "The story just went live on a major tech news outlet. It correctly identifies the breach date, the number of affected customers (approximately 45,000), and that we had not yet notified customers. The reporter has been calling the main line since 7 AM. Customer service is being overwhelmed. Our planned notification email was scheduled to go out Friday — three days from now. Social media is already picking it up.",
    "correctSeverity": "P2",
    "correctDeclare": false
  }'::jsonb,
  '[
    {
      "ingest": "HR + management",
      "title": "Customer notification was not yet sent — 45,000 customers learned from the news",
      "body": "Confirmed: the breach notification email has not gone out. Three weeks elapsed between breach discovery and today. The internal justification was completing the forensic investigation before notifying — legal considered this reasonable. The article is factually accurate about the breach. Customer service has received 340 calls in two hours. Your company Instagram and LinkedIn are filling with angry comments. Two enterprise clients have emailed their account managers asking for an emergency call. Your stock (if publicly traded) or your largest investor has called.",
      "phaseIdx": 1,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — Reputational", "technique": "N/A"},
      "rolePrompts": {
        "ic": "Two immediate priorities: (1) get the breach notification out TODAY — not Friday. The 3-week delay is already bad; sending it after the news story makes it worse. (2) Prepare a public statement within 2 hours. Coordinate both tracks simultaneously.",
        "tl": "Ensure the notification email list is accurate and complete. Can you send today? What approval steps remain? Every hour of delay after the news story is another hour customers feel blindsided. Remove bureaucratic blockers.",
        "cl": "Draft the press statement now — acknowledge, take responsibility, explain what happened, describe what you are doing. Post it to every channel before a second news outlet picks up the story. Do not say ''no comment.'' That amplifies the story.",
        "lc": "Three-week notification delay may constitute a violation depending on your state — many require notification within 30–60 days of discovery. Confirm you are within the legal window. The tip to the journalist may also indicate an internal leak — assess whether that affects your legal strategy.",
        "es": "Brief the board immediately. Approve the accelerated notification send today. The delay decision was defensible legally, but the optics are damaging — own it in the public statement. Do not blame the forensic investigation timeline publicly."
      }
    },
    {
      "ingest": "Technician anomaly",
      "title": "Second news story — reporter has internal email showing leadership debated delay",
      "body": "A second article has been published — this time with an excerpt from an internal email where a senior executive wrote ''we should delay notification until after the board meeting next week to avoid questions during the fundraise.'' The email is authentic. The reporter is asking for comment on whether the notification delay was motivated by business concerns rather than investigative necessity. Regulators in two states have now opened inquiries. The board chair has called an emergency meeting.",
      "phaseIdx": 2,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "N/A — Reputational + Regulatory", "technique": "N/A"},
      "rolePrompts": {
        "ic": "This is now a governance crisis, not just a breach crisis. The email suggests the delay was intentional for business reasons — that changes the regulatory and legal exposure significantly. Coordinate the response with legal and the board chair before any public statement.",
        "tl": "Preserve all internal communications relating to the notification delay decision. Do not delete anything. Legal hold applies to all email and messaging records from the breach discovery date forward.",
        "cl": "No public comment on the internal email until legal has reviewed it and the board has met. Holding statement only: ''We are reviewing the matter and will have a statement following our board meeting today.'' Do not confirm or deny the email''s authenticity.",
        "lc": "The email is likely discoverable in regulatory proceedings. Assess whether the delay constituted wilful concealment — this changes civil penalty exposure significantly. Outside counsel with regulatory experience is required immediately. Notify your D&O carrier.",
        "es": "The board meeting is critical. The executive who sent that email needs to be represented by personal counsel — their interests may diverge from the company''s. Consider whether the board chair should lead the public response rather than the executive team. This is a governance moment."
      }
    },
    {
      "ingest": "Bank + finance team",
      "title": "State AG opens formal investigation — enterprise client threatens termination",
      "body": "Two state attorneys general have issued formal investigative demands for all records related to the breach and the notification timeline. Your largest enterprise client (22% of ARR) has sent a formal notice that they are reviewing the contract for breach — their data was included in the incident. Their legal team is asking for the internal email and the decision timeline. Three other enterprise clients have placed account holds pending review. The board has met and is requesting a briefing from outside counsel on director liability.",
      "phaseIdx": 3,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "N/A — Regulatory + Legal", "technique": "N/A"},
      "rolePrompts": {
        "ic": "Prioritise the largest enterprise client — losing 22% of ARR in addition to the breach is an existential risk. Assign your CEO and General Counsel to manage that relationship directly. Regulatory responses are important but can be managed through outside counsel.",
        "tl": "Prepare the complete technical incident timeline for the AG responses. This must be factually accurate and complete — inconsistencies between your technical record and other evidence will be devastating.",
        "cl": "Full public transparency is now the only viable strategy. Hiding or minimising anything will be used against you. Issue a comprehensive public statement: what happened, what you did, what you should have done differently, and what you are doing now. Take accountability.",
        "lc": "Director liability is a real concern given the email. D&O coverage has conditions — ensure all directors understand they need personal counsel for the AG investigation. Company counsel and director counsel may have conflicting interests. Engage separate outside counsel for the company response.",
        "es": "The board must decide on executive accountability: does the executive who sent the email remain in their role? The answer affects regulatory posture, client relationships, and staff morale. There is no neutral option — a decision either way sends a signal."
      }
    }
  ]'::jsonb,
  'published',
  'exec_breach_comm'
),

-- ──────────────────────────────────────────────────────────────────────────────
-- AI GOVERNANCE TRACK
-- ──────────────────────────────────────────────────────────────────────────────

(
  'Shadow AI — Employee Uploads Client Financial Data to ChatGPT',
  'ai_governance',
  'All',
  'Medium',
  '~45 min',
  'A financial analyst used ChatGPT to build a financial model for a client engagement. To do so, they uploaded five years of the client''s unredacted financial records including P&L statements, client contracts, and payroll data. The client discovered the upload when their own IT team found the data referenced in a ChatGPT conversation log. The client is a Fortune 500 company and their data was uploaded without consent.',
  ARRAY['ai-governance', 'insider-threat', 'data-exfiltration'],
  ARRAY['cyber_insurance', 'hipaa'],
  '{
    "ingest": "HR + management",
    "source": "Client CISO — direct email to your CEO",
    "raw": "We received an email from the CISO of Hartwell Industries (your largest client) addressed to your CEO. Subject: Urgent — Potential Data Breach via AI Tool. Their IT team discovered that a member of your staff uploaded Hartwell''s confidential financial data to ChatGPT last month. They have a log showing the upload. They are requesting an immediate call and a written explanation of your AI data handling policies.",
    "correctSeverity": "P2",
    "correctDeclare": false
  }'::jsonb,
  '[
    {
      "ingest": "HR + management",
      "title": "Employee confirms upload — believed ChatGPT was safe for confidential data",
      "body": "HR has spoken to the employee. They confirm uploading the data and stated they did not know this was against policy. Their explanation: ''ChatGPT is just a tool, like a search engine — I didn''t think the data went anywhere.'' Review of your internal policies: there is no explicit AI tool policy. The employee handbook references ''confidential data'' but does not mention AI platforms. The employee used ChatGPT Plus (a paid personal account, not a company-sanctioned tool). OpenAI''s default settings at the time included model training on user inputs unless opted out — the employee did not know this setting existed.",
      "phaseIdx": 1,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — AI Governance", "technique": "Unauthorized data sharing via AI tool"},
      "rolePrompts": {
        "ic": "This is a client relationship crisis and a policy gap. The employee acted in good faith under a policy vacuum — discipline is secondary to remediation. Priority: manage the client relationship and assess the data exposure. Assign legal to assess notification obligations.",
        "tl": "Contact OpenAI to determine: (1) was the data used for training? (2) can it be deleted? (3) has anyone else accessed it? OpenAI has a data deletion process — initiate it immediately. Document the request and any responses.",
        "cl": "Call the client CISO and CEO today — before they call again. Acknowledge what happened, confirm you are investigating, and give them a timeline for a written response. Do not be defensive. This client is too important to lose over a policy gap.",
        "lc": "Review the client contract: does it contain a confidentiality clause covering data shared with third parties? Does uploading to OpenAI constitute a breach of contract? Assess breach notification obligations — was any data PII under applicable state law? If the client data included employee information, additional obligations may apply.",
        "es": "Authorise the client remediation response. Brief the board. Issue an immediate AI tool policy via email today — all employees, before end of business. Embargo all use of non-approved AI tools with client data effective immediately."
      }
    },
    {
      "ingest": "Technician anomaly",
      "title": "Audit reveals 7 employees using AI tools with client data — multiple clients affected",
      "body": "Following the initial discovery, IT conducted a rapid audit of browser history and cloud upload logs. Result: 7 employees have used personal AI tool accounts (ChatGPT, Gemini, Copilot via personal Microsoft accounts) to process client data in the past 6 months. Three different clients are affected. One case involves a healthcare consulting client — employee notes uploaded to ChatGPT included patient case summaries with names and diagnoses. HIPAA may apply to that client''s data. The total scope is significantly larger than the initial incident.",
      "phaseIdx": 2,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "N/A — AI Governance", "technique": "Systemic shadow AI use"},
      "rolePrompts": {
        "ic": "This is now a systemic problem, not an isolated incident. Three clients affected, potential HIPAA breach. Each client needs individual notification. Assign a dedicated response lead to each affected client. The internal audit scope needs to expand — are there more cases?",
        "tl": "Extend the audit: email logs, cloud storage, browser extensions. Implement technical controls today: block known AI tool domains at the firewall for corporate devices. Evaluate enterprise-grade AI tools with proper data handling agreements as legitimate alternatives.",
        "cl": "Three client notification tracks — each client gets a personal call from the CEO or Managing Partner before any written notice. Each situation is different; tailor the communication to what their data actually was and what the exposure means for them.",
        "lc": "The healthcare client''s patient data is a potential HIPAA breach. 60-day notification clock may apply depending on the client''s status as a covered entity or BA. Engage HIPAA counsel immediately. All three client contracts must be reviewed for data handling obligations. Notify your cyber carrier.",
        "es": "Approve an enterprise AI governance programme: approved tool list, data classification policy, employee training, and technical controls. The cost of doing nothing is losing multiple clients. This is a board-level governance failure — recommend a formal AI policy adoption at the next board meeting."
      }
    },
    {
      "ingest": "PSA ticket",
      "title": "Clients demand written AI data handling policy — one threatens contract termination",
      "body": "All three affected clients have responded. Hartwell Industries (largest client) has issued a formal cure notice under their contract — they require a written AI data handling policy, evidence of employee training completion, and a technical control audit within 30 days. A second client has accepted your apology and is monitoring. The healthcare consulting client has engaged their own legal counsel and is requesting a full HIPAA breach assessment. Your proposal pipeline has also been affected — two prospective clients have asked about your AI governance posture during contract negotiations.",
      "phaseIdx": 3,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — Post-incident", "technique": "Policy and governance remediation"},
      "rolePrompts": {
        "ic": "The 30-day cure notice from Hartwell is your highest priority. Assign a dedicated project lead. The deliverables are: written policy, training completion records, technical control evidence. These need to be real, not performative.",
        "tl": "Deliver the technical controls: approved AI tool list, data classification labels in email and file systems, browser-level controls on personal AI tool access, and enterprise AI tools with proper DPAs. Document everything for the Hartwell audit response.",
        "cl": "Your AI governance posture is now a competitive differentiator — or a liability. Draft a one-page ''Our AI Policy'' summary for prospective clients. The two pipeline clients are an opportunity: show them you''ve addressed this proactively.",
        "lc": "Complete the HIPAA assessment for the healthcare client. The breach assessment must determine: was PHI actually in the uploaded notes? Was the AI tool a HIPAA business associate? If yes, notification to HHS and patients may be required. This is the highest-risk element of the incident.",
        "es": "Approve the enterprise AI programme budget. Brief the board on the full scope: 7 employees, 3 clients, potential HIPAA exposure, Hartwell cure notice. Frame it as a governance response, not a disciplinary matter. The policy gap is an organisational failure, not just an employee failure."
      }
    }
  ]'::jsonb,
  'published',
  'ai_tool_shadow'
),
(
  'Deepfake CEO Fraud — $180K Wire Transfer Authorised',
  'ai_governance',
  'All',
  'Hard',
  '~60 min',
  'A finance team member received a video call that appeared to show the CEO and CFO on a Teams meeting, authorising an urgent $180K wire transfer to a new vendor for a confidential acquisition. The video was a deepfake. The wire has cleared. The "vendor" does not exist. The real CEO and CFO were in a board meeting with their phones off.',
  ARRAY['ai-governance', 'bec', 'wire-fraud', 'social-engineering'],
  ARRAY['cyber_insurance'],
  '{
    "ingest": "Bank + finance team",
    "source": "Finance Manager — urgent call to CFO",
    "raw": "Finance manager is calling in a panic. She sent a $180K wire two hours ago after a Teams meeting with who she believed was the CEO and CFO. They told her it was for a confidential acquisition — do not tell anyone. She just ran into the real CFO in the hallway and mentioned it. The real CFO has no knowledge of any wire. The CFO called the bank — the wire has cleared to an account in a jurisdiction they cannot recall. No acquisition is in progress.",
    "correctSeverity": "P1",
    "correctDeclare": false
  }'::jsonb,
  '[
    {
      "ingest": "Bank + finance team",
      "title": "Wire confirmed cleared — bank initiated recall but probability is low",
      "body": "The bank confirmed: the $180K wire transferred to an account at a foreign bank. A recall request has been initiated — success probability is less than 15% once funds leave a domestic correspondent bank. Forensic review of the finance manager''s laptop shows: the Teams call came from an external account with a display name matching the CEO. The video quality was high — only subtle lip-sync lag was notable. The finance manager reports the ''CEO'' mentioned a specific acquisition target by name (a real company the CEO had mentioned in passing at a team lunch). The attacker had specific internal knowledge.",
      "phaseIdx": 1,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0040 Impact", "technique": "T1657 Financial Theft via Social Engineering + AI Deepfake"},
      "triggersBreach": true,
      "rolePrompts": {
        "ic": "The wire is likely gone. Focus: (1) preserve all forensic evidence of the call. (2) notify cyber insurance carrier today — wire fraud is typically covered under social engineering / funds transfer fraud coverage. (3) notify FBI IC3 — they have a wire recall programme with higher success rates than bank-to-bank. (4) identify the internal knowledge leak.",
        "tl": "Forensic priorities: capture the Teams call log (Microsoft can provide metadata), the caller''s external account, the display of the deepfake video. Analyse how the attacker knew the acquisition target name — who had access to that information? Check for email compromise or insider knowledge.",
        "cl": "Internal-only communication at this stage. Do not tell employees about the deepfake — the attacker may have additional targets in the company. Brief only leadership and finance team leads.",
        "lc": "Notify the cyber insurance carrier immediately — funds transfer fraud coverage has strict reporting timelines (often 24–72 hours). The FBI IC3 wire recall programme occasionally recovers funds if reported quickly. File both today.",
        "es": "Brief the board today. The $180K is likely a loss. The more important question: how did the attacker know the acquisition target name? That suggests either email compromise, an insider, or significant OSINT. An internal security assessment is required."
      }
    },
    {
      "ingest": "SOC alert",
      "title": "Email compromise discovered — attacker had read access for 6 weeks",
      "body": "Microsoft 365 audit logs reveal an attacker has had read access to the CEO''s email account for 6 weeks using a compromised OAuth token. They read hundreds of emails including M&A discussions, board meeting materials, and internal strategy documents. The Teams account used for the deepfake call was created by the attacker using a Microsoft consumer account with the CEO''s display name and photo. The attacker also accessed the company SharePoint and downloaded the latest board package. The initial access vector appears to be a phishing email sent 6 weeks ago that the CEO clicked.",
      "phaseIdx": 2,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0009 Collection + TA0001 Initial Access", "technique": "T1114 Email Collection + T1528 Steal Application Access Token"},
      "rolePrompts": {
        "ic": "The wire fraud is a symptom — the root cause is a 6-week email compromise. Revoke all OAuth tokens for the CEO account immediately. Audit all other executive accounts for similar tokens. The board package was exfiltrated — brief the board chair on what was in it.",
        "tl": "Full OAuth token audit across all executive accounts. Revoke and require re-authentication. Enable conditional access policies that block OAuth from non-managed devices. Review SharePoint access logs — what else was downloaded in the 6-week window?",
        "cl": "The board package exfiltration is a material event if the company is publicly traded or has investor disclosure obligations. Brief the CEO on what was in the board package and whether any of it constitutes material non-public information.",
        "lc": "Six weeks of email access means the attacker may have read privileged communications with counsel. Assess attorney-client privilege implications. If board materials included M&A information or financial data, SEC disclosure obligations may apply. Brief outside counsel immediately.",
        "es": "The attacker read 6 weeks of the CEO''s email including M&A strategy. Assess: did they act on any of that information? Could they have front-run a deal, tipped a competitor, or extracted other value beyond the wire? The $180K may be the smallest part of the damage."
      }
    },
    {
      "ingest": "HR + management",
      "title": "Finance team shaken — second wire attempt intercepted",
      "body": "Three days after the initial incident, a second deepfake call was attempted — this time targeting the Accounts Payable manager with a $95K wire request. The AP manager recognised the lip-sync lag from the all-staff briefing and refused, calling the CFO directly to verify. The second attempt failed. However, the AP manager is visibly shaken and three finance team members have asked HR about the safety of their roles. The attacker group appears to be retrying. FBI IC3 has confirmed they are tracking this threat group and have 4 other victims in similar industries.',
      "phaseIdx": 3,
      "correctCriticality": "High",
      "mitre": {"tactic": "TA0040 Impact", "technique": "Social Engineering — Deepfake repeat attempt"},
      "rolePrompts": {
        "ic": "The second attempt intercepted is a success — your training worked. Reinforce the new verification procedure immediately across all staff. The FBI tracking intelligence is valuable — cooperate fully and share whatever they need.",
        "tl": "Implement a verbal verification code system for all wire transfers: any wire request — regardless of apparent source — requires a verbal code phrase confirmed via a pre-established direct call (not video). Brief the finance team on this procedure today.",
        "cl": "Brief all staff about the second attempt — but frame it as a success. ''Our training worked. Here is what the AP manager did right.'' This builds confidence rather than fear. The threat group is likely to try again.",
        "lc": "FBI cooperation is in your interest — provide all logs, account details, and evidence. Confirm your cyber insurance claim is in progress and has received the FBI case number. The claim may cover both the $180K loss and the incident response costs.",
        "es": "Authorise a deepfake awareness programme: all-staff training, a verification code protocol, and a policy requiring dual approval for any wire transfer over a defined threshold. The $180K loss funds a significant security improvement programme. Make that investment now."
      }
    }
  ]'::jsonb,
  'published',
  'ai_deepfake_fraud'
),

-- ──────────────────────────────────────────────────────────────────────────────
-- PCI DSS TRACK
-- ──────────────────────────────────────────────────────────────────────────────

(
  'PCI DSS — Physical Card Skimmer Discovered on POS Terminal',
  'operational',
  'Hospitality',
  'Medium',
  '~60 min',
  'At close of business, a front desk supervisor discovers a card skimmer device attached to one of three POS terminals. The device appears professional and may have been in place for weeks. You are a PCI DSS merchant and must follow the PCI Incident Response Plan. Forensic and notification obligations begin immediately.',
  ARRAY['card-theft', 'pos-malware', 'supply-chain'],
  ARRAY['pci_dss', 'cyber_insurance'],
  '{
    "ingest": "Technician anomaly",
    "source": "Front desk supervisor — closing inspection",
    "raw": "Supervisor found a small plastic device attached to the card reader slot on Terminal 2 at the front desk. It looks like it was designed to blend in — same colour as the reader. She almost missed it. I pulled it off — it seems to have a small memory chip inside. The terminal has been running all day. I don''t know how long it''s been there. The other two terminals look normal.",
    "correctSeverity": "P2",
    "correctDeclare": false
  }'::jsonb,
  '[
    {
      "ingest": "Technician anomaly",
      "title": "Forensic analysis — skimmer has been in place for approximately 3 weeks",
      "body": "Payment processor forensics on the removed skimmer: it is a professional overlay skimmer with a 16GB chip capable of storing approximately 10,000 card records. Chip analysis reveals it contains 2,847 card records collected over what appears to be 21 days. The records include full track 2 data (card number, expiry, CVV) sufficient for card cloning. Terminal 2 processes an average of 135 transactions per day. The other two terminals were physically inspected and are clean. Security camera review shows a person spent approximately 90 seconds at the terminal 3 weeks ago during a busy check-in period — they appear to have installed it then.",
      "phaseIdx": 1,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0006 Credential Access", "technique": "T1056.001 Input Capture — Hardware Keylogger"},
      "rolePrompts": {
        "ic": "PCI DSS requires immediate notification to your payment processor and acquiring bank — do this now, tonight. Do not process any cards on any terminal until all three are forensically cleared. Notify your cyber insurance carrier. Secure the physical skimmer as evidence — do not touch it further.",
        "tl": "Take all three terminals offline immediately. Notify the payment processor''s security team (they have a 24/7 IR line). The skimmer must be preserved as evidence — do not attempt further forensic analysis yourself. Document the camera footage before it overwrites.",
        "cl": "No public statement tonight. Brief hotel leadership only. Guests who checked in or checked out using Terminal 2 in the past 21 days are at risk — you will need to notify them, but the scope must be confirmed first.",
        "lc": "PCI DSS Section 12.10.7 requires immediate response and forensics by a PCI Forensic Investigator (PFI). Your acquiring bank will mandate a PFI engagement — initiate that contact now. State breach notification laws apply to payment card data. Card brands (Visa/Mastercard) have their own notification timelines — typically 24–72 hours.",
        "es": "Brief the owner or GM immediately. PCI breach fines can reach $100K/month if not managed correctly. The key decisions tonight: engage a PFI, notify the acquiring bank, and take terminals offline. These are non-negotiable PCI requirements."
      }
    },
    {
      "ingest": "Bank + finance team",
      "title": "Acquiring bank notified — fraud already detected on 140 of the captured cards",
      "body": "Your acquiring bank and Visa/Mastercard have been notified. The payment brands report that 140 of the 2,847 card numbers from the skimmer have already been used fraudulently — totalling approximately $34,000 in fraudulent charges across 140 cardholders in the past 10 days. The PFI engagement has been initiated. Card brands are issuing charge-backs to your merchant account for the fraudulent transactions. You are also liable for the PFI cost (typically $20,000–$50,000) as the breached merchant. The camera footage has been secured.",
      "phaseIdx": 2,
      "correctCriticality": "High",
      "mitre": {"tactic": "TA0010 Exfiltration", "technique": "Card data stolen for fraudulent use"},
      "rolePrompts": {
        "ic": "Coordinate between the PFI, legal, and the acquiring bank. Your job is to ensure PFI has access to everything they need and that no evidence is disturbed. Card brand timelines for your formal breach notification report will be set by the acquiring bank — track them.",
        "tl": "Provide the PFI with full access: terminals, camera footage, network logs, any access records for the terminal area. The PFI is the lead forensic investigator — do not conduct parallel forensics that could contaminate their work.",
        "cl": "Guest notification scope is 2,847 cards over 21 days. Compile the guest list from your PMS records for that date range — anyone who used Terminal 2. Prepare a notification letter. Card brands require you notify affected cardholders.",
        "lc": "State breach notification required for payment card data in most jurisdictions. Card brand rules (Visa CISP, Mastercard SDP) have their own notification and remediation timelines — your acquiring bank will communicate these. PCI fine exposure: assessed per month until remediation is confirmed — engage your PCI compliance programme manager.",
        "es": "Financial impact: $34K in charge-backs plus PFI cost plus notification cost plus potential PCI fines. Budget for total exposure of $75–150K. Review your cyber insurance coverage — skimmer incidents are typically covered under payment card breach coverage. Confirm with your carrier today."
      }
    },
    {
      "ingest": "PSA ticket",
      "title": "Notification complete — PCI remediation plan and re-assessment required",
      "body": "All 2,847 guests have been notified by mail as required. 23 guests have called to report they received the letter. Guest relations has handled all calls — responses have been empathetic and the hotel is offering a complimentary night to affected guests. The PFI has completed their initial report: root cause is inadequate physical security of the POS terminals. Required remediation includes: PCI-compliant terminal mounting, tamper-evident seals, daily terminal inspection checklist, and security camera coverage of all POS terminals. You will be required to complete a new PCI SAQ or QSA assessment to restore full merchant status.',
      "phaseIdx": 3,
      "correctCriticality": "Medium",
      "mitre": {"tactic": "N/A — Post-incident", "technique": "PCI remediation"},
      "rolePrompts": {
        "ic": "The PFI remediation plan is a compliance requirement, not a recommendation. Assign the property manager to own the physical security improvements. Set a 30-day completion target for the physical controls so you can demonstrate progress to your acquiring bank.",
        "tl": "Implement the technical and physical controls: tamper-evident seals on all terminals, daily inspection sign-off procedure, camera coverage audit, and network segmentation review of the POS environment. Document everything for the re-assessment.",
        "cl": "The complimentary night offer to affected guests is the right call — it acknowledges the impact without admitting a specific legal liability. Track uptake and cost. Update the hotel''s security messaging on the website proactively — ''we take your security seriously'' is better coming from you than being forced out.",
        "lc": "Work with the acquiring bank and PFI on your re-assessment timeline. Cooperating fully and completing remediation quickly reduces fine exposure. Confirm with your cyber carrier that the claim includes PFI costs and charge-backs — most PCI breach riders cover both.",
        "es": "Approve the full remediation budget. The total cost of this incident (PFI + charge-backs + notification + complimentary nights + re-assessment) is the cost of inadequate physical security. Invest in the prevention programme now: regular PCI self-assessments, annual QSA review, and physical terminal security as a standing checklist."
      }
    }
  ]'::jsonb,
  'published',
  'pci_card_skimmer'
),
(
  'PCI DSS — Full PAN Data Discovered in Application Logs',
  'operational',
  'Technology / SaaS',
  'Hard',
  '~75 min',
  'During a QSA pre-assessment review, a consultant discovers that your payment processing application has been logging full Primary Account Numbers (PANs) in debug mode for an unknown period. The logs are retained for 90 days and are backed up offsite. This is a clear violation of PCI DSS Requirement 3.3. The scope of your cardholder data environment is now uncertain.',
  ARRAY['card-theft', 'compliance-response', 'data-breach'],
  ARRAY['pci_dss', 'cyber_insurance'],
  '{
    "ingest": "Technician anomaly",
    "source": "QSA — pre-assessment review call",
    "raw": "The QSA called to flag an urgent finding before the formal assessment begins. While reviewing log samples you provided, they found full PANs in the application debug logs — unmasked, unencrypted. They are asking: how long has debug mode been enabled? Who has access to these logs? Are the logs backed up? This will require immediate remediation before the QSA can proceed, and may require a breach notification depending on the log retention and access history.",
    "correctSeverity": "P2",
    "correctDeclare": false
  }'::jsonb,
  '[
    {
      "ingest": "Technician anomaly",
      "title": "Debug logging has been running for 14 months — 90-day retention means PANs in active logs",
      "body": "Engineering investigation: debug mode was enabled 14 months ago during a performance troubleshooting exercise and was never turned off. The application has logged approximately 340,000 transactions in that period. Current 90-day retention window contains approximately 72,000 transactions with full PAN data in the application logs. Logs are stored in the application server, replicated to a centralised log management platform, and backed up weekly to offsite cloud storage. Access to the log platform: 12 engineers, 3 DevOps contractors. No evidence of exfiltration — but no way to definitively confirm.",
      "phaseIdx": 1,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0009 Collection", "technique": "T1005 Data from Local System — PAN in logs"},
      "rolePrompts": {
        "ic": "Disable debug logging immediately. Rotate all credentials for the log platform. Initiate a full access audit: who accessed those logs in the past 90 days, what did they download or query? Notify your acquiring bank — this is required under PCI DSS and needs to happen today.",
        "tl": "Kill debug mode now across all environments. Purge the PAN-containing logs from the active log platform after preserving a forensic copy. Review the log management platform for any export or query history that might indicate the PAN data was accessed externally. Audit the backup files — can PAN data be selectively purged from those?",
        "cl": "Internal only at this stage. Do not notify customers until the scope assessment is complete and legal has reviewed notification obligations. No public statement.",
        "lc": "PCI DSS Requirement 3.3 prohibits storing PAN data post-authorisation except in specific encrypted circumstances. This is a clear violation. Your acquiring bank notification is mandatory under PCI. Breach notification under state law: PANs are covered payment card data — notification may be required even without confirmed exfiltration if PANs were accessible to unauthorised parties (the contractors). Engage PCI counsel immediately.",
        "es": "Brief the board — this is a serious compliance failure. The QSA pre-assessment likely saved you from a worse outcome during the formal assessment. Authorise full cooperation with the QSA and acquiring bank. Budget for PCI breach response: acquiring bank reporting, possible PFI engagement, and potential fine exposure."
      }
    },
    {
      "ingest": "SOC alert",
      "title": "Access audit reveals contractor accessed logs with PAN data 6 times in past 90 days",
      "body": "Log platform access audit results: one DevOps contractor (engaged through a staffing firm, currently off-boarded 3 weeks ago) accessed the production log platform 6 times in the past 90 days, including two exports of log files totalling 4.2GB. The exports were classified as routine debugging at the time — no one flagged them. The contractor had a legitimate role but there was no need-to-know for payment data. The contractor''s offboarding checklist shows their access credentials were revoked, but the exports happened before offboarding. The contractor is reachable via the staffing firm.",
      "phaseIdx": 2,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0010 Exfiltration", "technique": "T1048 Exfiltration over Alternative Protocol — Log export"},
      "triggersBreach": true,
      "rolePrompts": {
        "ic": "Confirmed exfiltration of PAN data by an unauthorised party (no need-to-know). This is now a confirmed PCI breach. Acquiring bank must be notified immediately. PFI engagement is now required — this is not optional under PCI DSS. Contact the contractor through the staffing firm with legal counsel present.",
        "tl": "Preserve all access logs, export records, and file metadata. Do not alert the contractor through any channel before legal is ready — this is potential evidence in a criminal matter. Confirm the 4.2GB exports: what file content was in those exports? How many unique PANs?",
        "cl": "Breach notification to cardholders is now likely required. Do not notify until you know the scope — how many unique card numbers were in the 4.2GB export? Get that number from the engineering team before drafting notices.",
        "lc": "Contractor export of PAN data is likely a criminal matter — CFAA and potentially fraud statutes apply. Do not contact the contractor without legal counsel. Refer to FBI for potential criminal investigation. Your acquiring bank notification triggers the formal PCI breach process. File a claim with your cyber carrier now.",
        "es": "This incident has escalated to a confirmed breach with a potential insider element. Brief the board with full facts. The reputational and financial exposure is significant: PCI fines, cardholder notification costs, PFI costs, and potential criminal referral. Authorise the full response budget."
      }
    },
    {
      "ingest": "PSA ticket",
      "title": "PCI scope reassessment required — QSA pauses formal assessment",
      "body": "The QSA has paused the formal PCI assessment pending resolution of the breach. Under PCI DSS, you cannot complete a successful assessment while a breach investigation is in progress. The acquiring bank has placed your merchant account under enhanced monitoring and is requiring a Forensic Investigator report before restoring normal processing fees. Your legal team has confirmed: PAN data from the export (approximately 14,200 unique card numbers) meets the notification threshold in 31 states. The contractor has not responded to the staffing firm''s outreach.",
      "phaseIdx": 3,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — Post-incident", "technique": "PCI scope and remediation"},
      "rolePrompts": {
        "ic": "Three parallel tracks: (1) PFI engagement — get under contract this week. (2) Cardholder notification program — 14,200 notices, 31 states. (3) Code-level remediation — eliminate all PAN logging and implement a log scanning tool to detect future occurrences. Set milestones on all three.",
        "tl": "Implement: (1) disable debug logging permanently in all environments — move to structured logging that masks PAN data by design. (2) Implement a log scanning rule that alerts on any string matching PAN format (16-digit sequences). (3) Review ALL logging configurations for any other sensitive data (CVV, expiry, auth codes). (4) Document all remediation steps for the PFI and QSA.",
        "cl": "14,200 cardholder notifications — most will go by mail as required. Prepare a dedicated email inbox and call line for cardholder enquiries. Draft a press statement for the scenario where a cardholder notifies the media. Brief customer-facing staff on what to say if asked.",
        "lc": "File with all 31 applicable state AGs as required. PCI fines from Visa and Mastercard will be assessed through your acquiring bank — negotiate the timeline and remediation milestones to minimise ongoing fine assessment. The contractor non-response is concerning — brief the FBI on the investigative status and seek their assistance in locating them.",
        "es": "Approve the full remediation budget: PFI ($25–50K), notification program ($30–80K), legal costs, PCI fines, and QSA re-assessment. Total exposure: $150–300K minimum. This incident was preventable — a PCI compliance review prior to the debug mode being enabled would have caught this configuration. Invest in a developer security training programme and a pre-deployment PCI controls checklist."
      }
    }
  ]'::jsonb,
  'published',
  'pci_pan_in_logs'
);
