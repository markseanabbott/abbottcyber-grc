-- SUPABASE_PATCH_054.sql
-- Adds 6 additional AI Governance track scenarios aligned to NIST AI RMF.
-- Scenarios: Training Data Exposure, Third-Party AI Supply Chain, Excessive Agency,
-- AI Chatbot Data Exposure, AI-Generated Phishing, Rogue AI Automation.
-- Run in the Supabase SQL Editor after PATCH_053.
-- Safe to re-run: uses ON CONFLICT (source_id) DO NOTHING.

INSERT INTO tabletop_scenarios
  (title, track, industry, difficulty, duration, summary, tags, compliance_tags, declaration, injects, status, source_id)
VALUES

-- ──────────────────────────────────────────────────────────────────────────────
-- AI GOVERNANCE TRACK — NIST AI RMF ALIGNED
-- ──────────────────────────────────────────────────────────────────────────────

(
  'Training Data Exposure — Client PII Found in Vendor AI Model',
  'ai_governance',
  'All',
  'Hard',
  '~60 min',
  'During routine vendor due diligence, your team discovers that a third-party AI vendor ingested 18 months of your client records to train their foundation model. The data included names, emails, company financials, and internal project notes from over 200 clients. The vendor''s terms of service contained a training data clause your procurement team missed at contract signature.',
  ARRAY['ai-governance', 'data-breach', 'third-party', 'regulatory'],
  ARRAY['cyber_insurance', 'hipaa'],
  '{
    "ingest": "HR + management",
    "source": "Vendor audit — legal team discovery",
    "raw": "During a scheduled vendor review, legal counsel flagged a clause in Section 9.3 of the AI vendor''s terms of service: uploaded data may be used to improve model performance unless explicitly opted out within 30 days of account creation. Your account was created 20 months ago. No opt-out was filed. The vendor confirms your data was included in a model training run 14 months ago. The model is now deployed to over 400 organizations. Client data — including PII, financial records, and project notes — is embedded in model weights that cannot be deleted.",
    "correctSeverity": "P2",
    "correctDeclare": false
  }'::jsonb,
  '[
    {
      "ingest": "HR + management",
      "title": "Scope confirmed — 200+ clients affected, healthcare and financial data included",
      "body": "Legal has completed a data inventory of what was in the vendor''s system during the training window. Results: records from 214 clients across all service lines. Data types include: contact information (all clients), financial records (89 clients), internal project notes (214 clients), and patient case summaries from 12 healthcare consulting clients. The healthcare data is particularly high-risk — if any records contain PHI and your firm is a business associate, HIPAA breach notification obligations may apply. The vendor is not offering remediation beyond account opt-out going forward. They have no mechanism to remove data from a trained model.",
      "phaseIdx": 1,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "N/A — AI Governance", "technique": "NIST AI RMF: MAP 3.1 — Data provenance and consent failure"},
      "rolePrompts": {
        "ic": "214 clients is a material breach of trust. You need a client notification strategy immediately. Prioritize healthcare clients due to potential HIPAA obligations. The vendor cannot fix this — your response must focus on transparency, contractual remedies, and technical controls going forward.",
        "tl": "Assess what technical controls could have prevented this: data classification before upload, vendor contract review, DPA requirements. Identify every AI vendor currently holding client data and audit their terms immediately. This is not an isolated vendor — it may be systemic.",
        "cl": "Client communication must begin with your highest-value and highest-risk clients. Healthcare clients with PHI exposure go first. The message: what happened, what data was involved, what it means for them, and what you are doing. Do not wait for legal to finish — get the communication framework approved today.",
        "lc": "Three parallel legal workstreams: (1) HIPAA — assess BA obligations for the 12 healthcare clients. If PHI was in the training data, 60-day HHS notification clock may apply. (2) Contract — does the vendor''s ToS clause constitute a breach of your client contracts'' confidentiality provisions? (3) Regulatory — state privacy laws (CCPA, VCDPA) may require notification for PII exposure.",
        "es": "Brief the board. This is a vendor governance failure with material client relationship consequences. Approve: (1) client notification program, (2) immediate legal review of all AI vendor contracts, (3) data classification and vendor onboarding policy requiring DPAs before any client data is handled by a third-party AI tool."
      }
    },
    {
      "ingest": "PSA ticket",
      "title": "Three clients request confirmation their data was not used — one threatens legal action",
      "body": "Word has spread faster than expected. Three clients reached out before formal notification was sent — they heard through industry contacts that ''an AI vendor breach'' affected a consulting firm. One client — a financial services company — has engaged external counsel and issued a written demand for a full accounting of what data was shared and with whom, within 72 hours. A second client has paused a renewal discussion pending the outcome. A third client''s CISO called the CEO directly and is requesting an emergency call today. The vendor has issued a public blog post describing the situation without naming affected customers — but the language is specific enough that industry contacts are connecting the dots.",
      "phaseIdx": 2,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — Post-incident", "technique": "NIST AI RMF: GOVERN 1.1 — Stakeholder transparency"},
      "rolePrompts": {
        "ic": "The information is already circulating. Your notification program needs to accelerate — clients finding out from other sources before you call them is the worst possible outcome. Prioritize the three who have already reached out. The 72-hour legal demand from the financial services client must be met.",
        "tl": "The vendor''s blog post is a liability — it describes your situation without naming you. Monitor for journalists or clients making the connection. Prepare a technical FAQ that accurately describes what data was in scope, what ''embedded in model weights'' means for data recovery, and what controls you are implementing.",
        "cl": "The financial services client legal demand is your most urgent communication task. Respond within the 72-hour window with a detailed written response: what data, what time period, what the vendor has confirmed, and your remediation steps. This response should be reviewed by your legal counsel before sending.",
        "lc": "The financial services client demand may be a precursor to litigation. Preserve all vendor communications, contract documents, and internal emails related to the vendor selection and procurement. Do not delete anything. Notify your D&O and E&O insurance carriers.",
        "es": "The renewal discussion pause is a near-term revenue risk. Quantify: what is the total annual value of clients currently in a ''wait and see'' posture? Brief the board on both the legal exposure and the revenue risk. Approve an AI governance communication to all clients — proactive outreach to the 200+ who haven''t called yet is better than waiting for them to."
      }
    },
    {
      "ingest": "PSA ticket",
      "title": "Regulatory inquiry arrives — state AG requests information on AI data practices",
      "body": "A formal inquiry letter arrives from the state Attorney General''s Consumer Protection Division. They are investigating AI data practices following a series of consumer complaints about consulting firms using AI tools with client data. The inquiry requests: a list of all AI tools used, documentation of data handling practices, copies of vendor contracts, and a description of any data incidents in the past 24 months. You have 30 days to respond. Separately, the healthcare clients'' counsel has confirmed they are assessing a formal HIPAA complaint to HHS OCR. Two more clients have now paused renewals.",
      "phaseIdx": 3,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — Regulatory", "technique": "NIST AI RMF: GOVERN 4.2 — Regulatory accountability"},
      "rolePrompts": {
        "ic": "A regulatory inquiry is a formal legal process — do not respond informally. Assign outside counsel to manage the AG response. The 30-day window is tight given the scope of information requested. Begin document collection immediately.",
        "tl": "You need an accurate and complete inventory of every AI tool in use: approved tools, shadow tools identified in the audit, and any tools that have since been decommissioned. This list must be defensible — gaps discovered later will look worse than disclosing unknown tools now.",
        "cl": "Two more client renewals paused. You now have a reputational and revenue crisis running in parallel with a regulatory crisis. Consider a proactive public statement — ''We take AI governance seriously, here is what we are doing'' — to control the narrative before the AG inquiry becomes public.",
        "lc": "The AG inquiry and the potential HHS OCR complaint are separate regulatory processes but may reference each other. Coordinate outside counsel across both. The AG inquiry response must be accurate and complete — misrepresentation to a state AG is a serious independent offense.",
        "es": "This has crossed into material event territory. If the firm has investors, a credit facility, or public-facing obligations, assess disclosure requirements. Approve the outside counsel budget for both regulatory responses. Brief the board on the full legal and regulatory exposure before the next board meeting."
      }
    }
  ]'::jsonb,
  'published',
  'ai_training_data_exposure'
),

(
  'Third-Party AI Supply Chain Attack — Vendor Model Returns Manipulated Output',
  'ai_governance',
  'All',
  'Hard',
  '~55 min',
  'A threat intelligence feed flags that your AI risk-scoring vendor''s model update pipeline was compromised by a threat actor 4 weeks ago. During the compromise window, the model was retrained on adversarially manipulated data. Risk scores your team acted on during this period may be systematically wrong. The vendor has not yet issued public disclosure and is not confirming which clients were affected.',
  ARRAY['ai-governance', 'supply-chain', 'third-party', 'data-breach'],
  ARRAY['cyber_insurance'],
  '{
    "ingest": "SOC alert",
    "source": "Threat intelligence feed — industry ISAC bulletin",
    "raw": "ISAC bulletin: A threat actor known as TUNGSTEN MIRROR compromised the model training pipeline of [VENDOR REDACTED] 28 days ago. The actor injected adversarial training data designed to systematically bias model outputs. The vendor confirmed the breach to ISAC but has not issued public disclosure. Affected organizations: all clients using the model version deployed between [DATE-4W] and [DATE]. Your organization is a confirmed client. Outputs during this window should be treated as unreliable.",
    "correctSeverity": "P2",
    "correctDeclare": false
  }'::jsonb,
  '[
    {
      "ingest": "SOC alert",
      "title": "Internal review confirms 340 risk decisions made on compromised model output",
      "body": "Your team has completed a retrospective of all decisions made using the vendor''s risk scores during the 4-week compromise window. Results: 340 risk decisions were made across 89 clients, including credit risk assessments, vendor approvals, and security risk classifications. Of these, 47 decisions resulted in approvals that may have been incorrect — vendors or counterparties that the compromised model scored as low-risk and would likely have been scored high-risk by the uncompromised model. Four of those vendors have since been onboarded and have active access to client systems. The vendor has still not issued public disclosure and is now requesting a non-disclosure agreement before sharing technical details of the compromise.",
      "phaseIdx": 1,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0001 Initial Access", "technique": "NIST AI RMF: MANAGE 4.1 — Third-party AI risk; T1195 Supply Chain Compromise"},
      "rolePrompts": {
        "ic": "Four vendors with potentially incorrect risk scores now have active system access. That is your immediate risk. Suspend or increase monitoring on those four vendors pending manual re-assessment. Do not wait for the vendor''s NDA — you have enough information to act now.",
        "tl": "Conduct manual risk re-assessment on all 47 decisions using your pre-AI baseline methodology. Prioritize the 4 active-access vendors first. Log every decision reversal — you will need this record for regulatory and client disclosure purposes.",
        "cl": "If any of the 89 affected clients made decisions based on your risk scores, they need to know. Assess which clients received risk output from you that was derived from the compromised model. Client disclosure should be honest: the AI tool you used was compromised, here are the decisions it affected, here is what you are doing.",
        "lc": "The vendor is requesting an NDA before disclosing technical details. Do not sign it — an NDA may limit your ability to disclose to clients, regulators, or law enforcement. Engage outside counsel before any response to the vendor. Review your vendor contract: does it contain breach notification obligations on the vendor''s part?",
        "es": "This is a third-party AI governance failure. The vendor had your trust and was compromised. Approve: (1) immediate manual re-assessment of all 340 decisions, (2) suspension of the vendor contract pending investigation, (3) an AI vendor security assessment program — every AI vendor should have a security review before deployment."
      }
    },
    {
      "ingest": "HR + management",
      "title": "Vendor issues public disclosure — your organization named as affected client",
      "body": "The vendor has issued a public press release disclosing the supply chain compromise. Against your explicit request, the release names affected client categories including ''financial risk management'' and ''cybersecurity consulting'' — categories that identify your firm to anyone familiar with your service profile. A journalist from a trade publication has emailed your communications lead for comment. Two clients have seen the press release and called your account managers asking if their risk data was affected. The vendor''s press release frames the issue as ''limited impact'' and ''no evidence of data exfiltration'' — which is technically accurate but ignores the manipulated output problem entirely.",
      "phaseIdx": 2,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — Crisis Communication", "technique": "NIST AI RMF: GOVERN 6.2 — Transparency and disclosure"},
      "rolePrompts": {
        "ic": "You are now in a public disclosure situation you did not control. Your statement to the journalist must go out today — before the next news cycle. Frame your response around what you did when you found out, the steps you took to protect clients, and your commitment to transparency.",
        "tl": "The vendor''s ''no data exfiltration'' framing is misleading — the harm was manipulated outputs, not stolen data. Prepare a technical brief that clearly explains the difference to non-technical clients: the model was tampered with, not hacked for data. This distinction matters for client risk assessment.",
        "cl": "Client calls should come from relationship leads, not account managers. The two clients who have called deserve a direct conversation with a senior leader — not a scripted response. Acknowledge the issue, explain the steps taken, and offer to walk through which of their specific decisions were affected.",
        "lc": "Review the vendor contract for indemnification provisions. If the vendor''s compromise resulted in business harm to your clients, and your clients have claims against you, you may have a corresponding claim against the vendor. Document all harm before settling any client claims.",
        "es": "Approve a full client notification program — do not wait for more clients to call. Every client whose decisions were affected should receive a written communication within 48 hours. Authorize the communications lead to respond to the journalist with an approved statement."
      }
    },
    {
      "ingest": "PSA ticket",
      "title": "One re-assessed vendor flagged as high-risk — active system access must be revoked",
      "body": "Manual re-assessment of the 47 compromised decisions is complete. Of the four vendors with active system access, one — a third-party data processing vendor — has been re-assessed as High risk using your standard methodology. Their original AI-generated score was Low. Investigation reveals the vendor has a history of security incidents not disclosed during onboarding, and their latest SOC 2 report has an adverse opinion on access controls. This vendor currently has read access to three client data environments. Access must be revoked, but the vendor has an active contract with a 90-day termination notice period and is currently mid-project.",
      "phaseIdx": 3,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0001 Initial Access", "technique": "T1199 Trusted Relationship — vendor access via compromised risk assessment"},
      "rolePrompts": {
        "ic": "Access revocation is non-negotiable regardless of the contract. Revoke read access to the three client environments today. The contract dispute is a legal problem — the security risk is immediate. Brief the three affected clients before you revoke access so they are not surprised.",
        "tl": "Revoke access using the standard vendor offboarding procedure. Audit what data the vendor accessed during their engagement window. Determine if any of the three client environments show anomalous access patterns during the period the vendor was active.",
        "cl": "The three affected clients need to hear from you before they discover the vendor''s access was revoked. Frame the call: ''We identified a risk in a vendor assessment and took immediate protective action. Here is what it means for your environment.'' Do not make them find out from the vendor.",
        "lc": "Revoking access before the 90-day notice period may constitute a contract breach. However, a vendor with adverse SOC 2 access control findings poses a security risk that likely falls under a material breach exception in most contracts. Engage outside counsel to confirm before the vendor''s legal team sends a demand letter.",
        "es": "This is the direct consequence of the compromised AI model. One bad vendor with active access to client environments. Authorize the access revocation and approve legal costs for the contract dispute. Require a post-incident review of your entire vendor onboarding process — AI-assisted risk scoring must have a human validation layer for high-risk decisions going forward."
      }
    }
  ]'::jsonb,
  'published',
  'ai_supply_chain_attack'
),

(
  'Excessive Agency — AI Agent Authorizes $47K Payment Without Human Approval',
  'ai_governance',
  'All',
  'Hard',
  '~55 min',
  'Your accounts payable team deployed an AI agent to process vendor invoices autonomously. The agent, acting on a spoofed vendor email thread inserted into an existing invoice workflow, approved and initiated a $47K wire transfer to a fraudulent account. The agent had full autonomous authorization for payments under $50K — a governance boundary set during pilot that was never reviewed after go-live.',
  ARRAY['ai-governance', 'bec', 'wire-fraud', 'excessive-agency'],
  ARRAY['cyber_insurance'],
  '{
    "ingest": "Bank + finance team",
    "source": "AP Manager — urgent call to CFO",
    "raw": "The AP Manager is calling: the AI payment agent processed a $47K wire at 11:42 AM to a vendor called ''Meridian Supply Partners.'' She does not recognize this vendor and cannot find a corresponding PO. The wire has cleared. A review of the invoice thread shows an email was inserted into a legitimate vendor conversation — it appears to have come from the vendor''s domain but the ''reply-to'' was a spoofed address. The AI agent processed it without escalation because the amount was under the $50K autonomous approval threshold.",
    "correctSeverity": "P1",
    "correctDeclare": false
  }'::jsonb,
  '[
    {
      "ingest": "Bank + finance team",
      "title": "Wire confirmed — AI agent log shows zero human touchpoints in the approval chain",
      "body": "The bank has confirmed the wire transferred to a domestic intermediary account. Recall initiated — success probability assessed at under 20%. Review of the AI agent''s decision log reveals: the agent processed the invoice autonomously in 4 minutes, matched the vendor name to a similar (but different) vendor in the AP system, found no PO match but flagged this as ''acceptable — vendor may be new,'' and routed the payment without escalation because the amount fell within its autonomous approval band. The log shows no human touchpoint at any stage. The agent has processed 847 payments in the past 6 months. A spot audit of 20 random payments shows 3 additional anomalies — payments to vendors with slight name variations from known suppliers.",
      "phaseIdx": 1,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0040 Impact", "technique": "NIST AI RMF: MAP 2.3 — Excessive autonomy; T1657 Financial Theft"},
      "triggersBreach": false,
      "rolePrompts": {
        "ic": "Suspend the AI payment agent immediately — do not process any further payments autonomously until the 3 anomalies are investigated. The $47K is likely a loss. File with FBI IC3 today for the wire recall program. Notify cyber insurance carrier — funds transfer fraud coverage applies.",
        "tl": "Audit all 847 payments processed by the agent. Prioritize the 3 flagged anomalies — determine if any other fraudulent payments were made. Review the agent''s escalation logic: when was it supposed to escalate versus act autonomously? Was the $50K threshold the only control?",
        "cl": "Internal communication only at this stage. No external disclosure until the full payment audit is complete. Brief finance leadership and the executive team.",
        "lc": "Notify cyber insurance carrier immediately — funds transfer fraud policies typically have a 24–72 hour reporting requirement. Document the agent''s decision log as evidence. Assess whether the AI vendor''s product specifications included fraud detection as a feature — if so, did the product fail to perform as represented?",
        "es": "Suspend the agent. This is an excessive agency failure — the system had authority it was not equipped to use safely. Approve a full payment audit. Brief the board: an AI system authorized a fraudulent wire without human oversight. The governance design was flawed at the pilot stage and was never reviewed."
      }
    },
    {
      "ingest": "PSA ticket",
      "title": "Full audit reveals 2 additional fraudulent payments — total exposure $89K",
      "body": "The full payment audit is complete. Two of the three flagged anomalies are confirmed fraudulent payments: $28K to a spoofed version of a legitimate IT vendor, and $14K to a newly created vendor account that matches no existing supplier relationship. Total confirmed fraud: $89K across 3 payments. All three used the same attack pattern: email thread injection into an existing vendor conversation, vendor name close enough to pass the agent''s fuzzy match, and amounts below the $50K autonomous threshold. The attack appears coordinated — the threat actor understood the agent''s approval logic. The AI vendor confirms the agent has no fraud detection capability and was not designed for unreviewed payment authorization.",
      "phaseIdx": 2,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0040 Impact", "technique": "NIST AI RMF: MANAGE 2.2 — AI failure mode not anticipated in design"},
      "rolePrompts": {
        "ic": "Three payments, $89K total. File amended reports with FBI IC3 for all three transactions — provide the full attack pattern. Notify your cyber carrier of the updated claim amount. The attack pattern is specific enough that other organizations using similar AI payment tools may be targeted — consider sharing indicators with your ISAC.",
        "tl": "The attacker knew your AI agent''s approval threshold and fuzzy-match logic. This is either insider knowledge or the agent''s behavior was predictable enough to reverse-engineer. Assess: is this logic documented publicly or in the AI vendor''s marketing materials? Tighten the agent''s escalation criteria before any reinstatement.",
        "cl": "Two of the three fraudulent vendors received payments that require reversal attempts. The legitimate vendors whose names were spoofed should also be notified — they may be targets of broader fraud campaigns.",
        "lc": "Three counts of wire fraud via AI system exploitation. The AI vendor''s product had no fraud detection and was marketed for autonomous payment processing. Assess product liability exposure — did the vendor''s representations create a duty of care that the product failed to meet? Preserve all vendor documentation and contracts.",
        "es": "Approve redesign of the AI agent with mandatory human-in-the-loop for any payment above $5K, new vendor additions, and any invoice without a matching PO. The $50K autonomous threshold was never appropriate for an unvalidated AI system. Brief the board on the total loss and the governance changes being implemented."
      }
    },
    {
      "ingest": "HR + management",
      "title": "Board requests AI governance policy — CFO asks how many other AI agents have autonomous authority",
      "body": "The board has requested a full inventory of all AI agents and automated systems with autonomous decision-making authority within 2 weeks. The CFO, prompted by the incident, has flagged that the organization also uses an AI system for employee expense approvals (autonomous up to $500), an AI contract review tool that can auto-approve standard NDAs, and an AI scheduling system with calendar access across the executive team. None of these systems have formal governance documents. The AP agent incident has triggered a broader question: which AI systems in the organization can take actions with real-world consequences, and who approved the authority boundaries for each?",
      "phaseIdx": 3,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — Governance", "technique": "NIST AI RMF: GOVERN 1.2 — AI lifecycle oversight"},
      "rolePrompts": {
        "ic": "The board request is reasonable and important. Assign the 2-week inventory as a priority. For each AI system: what decisions can it make autonomously, what is the approval threshold, who authorized it, and what monitoring is in place? This inventory will reveal the true scope of AI autonomy across the organization.",
        "tl": "Start the inventory with the systems the CFO named: expense approval AI, contract review AI, executive calendar AI. Map every action each system can take, the conditions under which it acts autonomously versus escalates, and the audit trail for each decision. This is the foundation of your AI governance program.",
        "cl": "The executive calendar AI having access to the executive team''s schedules is a social engineering risk. Brief the executives: do not assume the AI correctly represents your availability or commitments without verification.",
        "lc": "The contract review AI auto-approving NDAs is a legal exposure. NDAs have legal effect. Review all NDAs auto-approved in the past 12 months — were any approved that should not have been? Consider whether auto-approved NDAs have valid consent given the AI''s involvement.",
        "es": "Approve a formal AI governance policy before the board meeting. Every AI system with autonomous decision-making authority requires: (1) a named human owner, (2) documented authority boundaries, (3) an audit log, (4) a regular review schedule, and (5) a kill switch. No AI system should have autonomous authority without these five controls in place."
      }
    }
  ]'::jsonb,
  'published',
  'ai_excessive_agency'
),

(
  'AI Chatbot Data Leak — Session Isolation Failure Exposes Customer Records',
  'ai_governance',
  'All',
  'Medium',
  '~45 min',
  'Your customer-facing AI support chatbot began returning other users'' conversation history and account details in responses. The issue was traced to a session isolation failure introduced in a vendor infrastructure update 6 weeks ago. The chatbot handled an average of 340 customer sessions per day during this window — approximately 14,000 sessions total. The scope of exposure is unknown and the vendor is still assessing.',
  ARRAY['ai-governance', 'data-breach', 'regulatory'],
  ARRAY['cyber_insurance', 'hipaa'],
  '{
    "ingest": "PSA ticket",
    "source": "Customer complaint — escalated to CTO",
    "raw": "A customer sent a screenshot to your support email showing a chatbot response that contained another customer''s full name, account number, and recent purchase history. The customer wrote: ''I asked about my delivery status and the chatbot gave me someone else''s information. Is this a data breach?'' The CTO has pulled the session log. The response is confirmed — the chatbot returned data from a completely different user''s session. The vendor has been notified. They believe this may be related to a caching layer change deployed 6 weeks ago.",
    "correctSeverity": "P2",
    "correctDeclare": false
  }'::jsonb,
  '[
    {
      "ingest": "PSA ticket",
      "title": "Vendor confirms 6-week exposure window — 14,000 sessions potentially affected",
      "body": "The vendor has completed their initial investigation. A caching misconfiguration introduced on [DATE-6W] caused session data to be stored in a shared cache without proper isolation. Under certain timing conditions — when two sessions overlapped on the same cache node — one user''s session data was returned to another user. The vendor estimates this occurred in approximately 0.8% of sessions during the window. With 340 sessions per day over 42 days: approximately 14,280 sessions, of which roughly 114 may have experienced cross-session data exposure. Exposed data types vary by session but may include: names, account numbers, order history, email addresses, and in some cases chat content discussing personal issues (returns, complaints, medical equipment orders for customers with health-related purchases).",
      "phaseIdx": 1,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "N/A — AI Infrastructure Failure", "technique": "NIST AI RMF: MANAGE 3.1 — AI system failure monitoring; CWE-362 Race Condition"},
      "rolePrompts": {
        "ic": "14,000 sessions, 114 potentially exposed — but you cannot confirm which 114. That means all 14,000 customers in the window are ''potentially affected'' for notification purposes. Take the chatbot offline immediately if not already done. Notify cyber insurance. Begin planning for notification to all customers in the 6-week window.",
        "tl": "Work with the vendor to identify the specific sessions where cross-session data was returned. If the vendor has logs, you may be able to narrow the 114 figure and identify exactly which customers received whose data. This precision matters for proportionate notification.",
        "cl": "The customer who sent the screenshot has already identified this as a potential data breach. Respond to them directly, personally, and with a written acknowledgment. They set this in motion — treat them with respect. Their screenshot is your first documented evidence.",
        "lc": "State breach notification laws are triggered by PII exposure. 42 states have laws requiring notification within 30–90 days of discovery. For health-related purchase data, HIPAA may apply if your business touches healthcare products. Assess which state laws apply based on where your customers are located. Notification clock started when the CTO pulled the session log.",
        "es": "Shut down the chatbot. A chatbot that leaks customer data is a liability, not an asset. Approve breach notification to all potentially affected customers — erring on the side of over-notification is better than under-notification. Brief the board: this is a vendor-caused incident with regulatory notification obligations."
      }
    },
    {
      "ingest": "SOC alert",
      "title": "Exposed data includes medical equipment orders — HIPAA implications under review",
      "body": "Detailed analysis of the session logs reveals that 23 of the potentially exposed sessions involved customers who ordered medical equipment or supplies through your platform — items including CPAP machines, insulin delivery devices, and mobility aids. The exposed data in these sessions may constitute PHI under HIPAA if your platform qualifies as a covered entity or business associate. Your legal team is split: one counsel believes your role as a retailer does not make you a covered entity; another believes the nature of the products creates an obligation. HIPAA counsel has been engaged. Separately, two news outlets have contacted your communications team after seeing the initial customer''s social media post about the incident.",
      "phaseIdx": 2,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — Regulatory", "technique": "NIST AI RMF: GOVERN 4.2 — Regulatory compliance under AI failure"},
      "rolePrompts": {
        "ic": "The media inquiry is now live. Your communications lead needs an approved statement today — before the next news cycle. The statement should acknowledge the incident, confirm the chatbot is offline, and describe your notification commitment. Do not speculate on HIPAA status in the public statement.",
        "tl": "Pull the specific 23 sessions with medical product data. Determine exactly what data was returned: was it just order history (product name, quantity) or were there chat conversations that revealed medical condition context? The content of what was exposed determines the HIPAA analysis.",
        "cl": "Media response: be transparent about what happened, when you found out, and what you are doing. Do not say ''we take privacy seriously'' without backing it with specific actions. Journalists will quote that line sarcastically. Be specific: chatbot offline, notification in progress, vendor held accountable.",
        "lc": "HIPAA counsel''s opinion is the gating decision. If PHI exposure is confirmed, the notification clock is strict: 60 days from discovery to notify affected individuals, HHS, and (if 500+ individuals in one state) the media. Engage HHS counsel to make the covered entity determination today.",
        "es": "The media inquiry and the HIPAA question are both board-level issues. Brief the board before the story runs. Approve the public statement. Authorize HIPAA counsel''s engagement. Consider whether the vendor contract includes indemnification for incidents caused by their infrastructure failures."
      }
    },
    {
      "ingest": "HR + management",
      "title": "Vendor offers settlement — legal advises caution; notification program underway",
      "body": "The vendor has reached out privately with a settlement offer: they will cover breach notification costs (estimated at $180K for the full customer population) and provide 12 months of credit monitoring for affected customers, in exchange for a release of liability and a confidentiality agreement about the incident. Legal is reviewing the offer. Meanwhile, your notification program is underway — 14,200 customers have been emailed. The call center is fielding 200+ calls per day. Three customers have reported that the data they received about someone else contained enough information to enable identity fraud. One customer''s account has shown unauthorized access attempts that may be related.",
      "phaseIdx": 3,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — Post-incident", "technique": "NIST AI RMF: MANAGE 4.2 — Incident resolution and remediation"},
      "rolePrompts": {
        "ic": "Three customers with identity fraud risk and one account with unauthorized access — those customers need immediate escalation: direct personal outreach, account lockdown, and dedicated support. Do not let them navigate the standard call center queue.",
        "tl": "The unauthorized access attempt on one customer''s account may be related to data exposed through the chatbot. Investigate the access attempt: is the attacker using information that was only available through the chatbot leak? This is now a potential secondary incident.",
        "cl": "The settlement offer''s confidentiality agreement is a problem if it prevents you from fully disclosing to regulators or customers. Do not sign anything with a confidentiality clause before your legal team confirms it does not conflict with your breach notification obligations.",
        "lc": "Do not sign the vendor settlement without confirming: (1) it does not restrict regulatory disclosure, (2) it covers all notification costs including potential HIPAA penalties, (3) you retain the right to pursue additional claims if downstream harm (identity fraud, account takeover) exceeds the settlement amount. The three identity fraud cases alone may be worth more than the settlement offer.",
        "es": "The vendor settlement offer should be evaluated against your total exposure: notification costs, call center costs, potential regulatory fines, and the three identity fraud cases. If the settlement undervalues your exposure, decline it. Approve legal costs to negotiate a better settlement or pursue litigation if warranted. The reputational damage is already done — do not trade a legal release for a number that does not make customers whole."
      }
    }
  ]'::jsonb,
  'published',
  'ai_chatbot_data_leak'
),

(
  'AI-Generated Spear Phishing — Hyper-Personalized Attack Targeting Staff',
  'ai_governance',
  'All',
  'Medium',
  '~45 min',
  'Your security team detects a surge in highly personalized phishing emails targeting 23 staff members over 48 hours. Each email references real internal projects by name, uses accurate industry terminology, and mimics the writing style of specific managers. Threat intelligence confirms an AI-assisted phishing toolkit was used, trained on publicly available data — LinkedIn profiles, published case studies, and conference speaking notes scraped from your company website.',
  ARRAY['ai-governance', 'phishing', 'social-engineering', 'credential-theft'],
  ARRAY['cyber_insurance', 'cmmc'],
  '{
    "ingest": "SOC alert",
    "source": "Email security gateway — pattern detection",
    "raw": "Email security gateway flagged 23 inbound messages over 48 hours as high-confidence phishing. Unusual pattern: each email is unique, highly specific to the recipient, and passed standard SPF/DKIM/DMARC checks (sent from a legitimate-looking domain registered 6 days ago). Sample subject lines: ''RE: Q3 Henderson account — contract renewal question'', ''Follow-up from the CISA workshop last week'', ''Quick question about the ISO 27001 project you presented at SecureWorld.'' Six recipients have already opened the emails. Two clicked links. One entered credentials on a spoofed login page.",
    "correctSeverity": "P1",
    "correctDeclare": false
  }'::jsonb,
  '[
    {
      "ingest": "SOC alert",
      "title": "One credential confirmed compromised — attacker has active session in M365",
      "body": "Confirmed: one staff member entered credentials on a spoofed Microsoft 365 login page. The attacker used the captured credentials within 8 minutes to establish an authenticated session. MFA was bypassed using an AiTM (attacker-in-the-middle) proxy — the login page captured both the password and the session token. The attacker''s session has been active for 3 hours. In that time, Microsoft audit logs show: 400 emails read, an inbox forwarding rule created to an external address, and a calendar invite sent to two clients with a link to the same spoofed login page. The attacker has begun pivoting to client targeting using the compromised employee''s identity.",
      "phaseIdx": 1,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0001 Initial Access + TA0009 Collection", "technique": "T1111 MFA Bypass + T1114 Email Collection + T1534 Internal Spearphishing"},
      "rolePrompts": {
        "ic": "Revoke the active M365 session immediately — invalidate all tokens for the compromised account. Two clients have received phishing links from what appears to be your employee. Contact both clients now — before they click. Every minute of delay increases the chance of a secondary compromise at a client site.",
        "tl": "Remove the inbox forwarding rule. Audit the 400 emails read — what sensitive information did the attacker access? Review all emails sent from this account in the past 3 hours. Assess whether any of the 22 other targeted staff members also used the spoofed login page.",
        "cl": "Call both client contacts personally — do not use the compromised employee''s account. Explain: ''You may have received an email appearing to be from [employee name] with a link. Do not click it. It was sent by an attacker who had brief access to their account. We have resolved the access issue.'' Brief and direct.",
        "lc": "The attacker sent phishing links to clients using your employee''s identity. If a client clicks and is compromised as a result, you may have liability for failing to contain the account compromise quickly enough. Document the timeline of discovery and response — every minute matters in this record.",
        "es": "Two clients targeted from your own infrastructure. This is a reputational and liability event, not just a security incident. Authorize emergency MFA policy review across all accounts — AiTM bypasses standard MFA. Phishing-resistant MFA (hardware keys or passkeys) is the only control that defeats this attack."
      }
    },
    {
      "ingest": "HR + management",
      "title": "AI phishing analysis complete — attacker used your public content to train the attack",
      "body": "Threat intelligence has completed analysis of the phishing campaign. The attacker used an AI phishing toolkit (commercially available on criminal marketplaces for $200/month) to generate personalized messages. The toolkit was trained on publicly scraped data: LinkedIn profiles of all 23 targets (including job history, skills, and recent activity), your company website (case studies, team bios, speaking engagements, published methodology documents), and two conference talk abstracts where your staff were named. The AI generated individualized emails for each target that referenced real projects and used language patterns consistent with how your managers write publicly. The ''Henderson account'' referenced in one email is a real client mentioned in a published case study. The attacker did not need inside access — everything they needed was public.",
      "phaseIdx": 2,
      "correctCriticality": "High",
      "mitre": {"tactic": "TA0043 Reconnaissance", "technique": "T1591 Gather Victim Org Information — AI-assisted OSINT + T1566 Phishing"},
      "rolePrompts": {
        "ic": "The attack surface is your public digital footprint. This is a policy and communications decision: how much detail do you publish about projects, clients, and staff publicly? Review your website and LinkedIn guidance for employees — some of this content is valuable for business development but it is also a phishing training dataset.",
        "tl": "Implement AI-generated content detection in your email gateway — some next-gen email security tools can detect AI-generated phishing patterns. Additionally, review your phishing simulation program: if your staff are not being tested with AI-generated personalized phishing, they are not being tested for the current threat level.",
        "cl": "The ''Henderson account'' being named in public case studies is a client privacy concern. Discuss with clients before publishing case study content — and consider whether client names belong in publicly accessible materials at all. This is now a sales and marketing policy question.",
        "lc": "Review your website content for any information that could give attackers leverage: named client relationships, project methodologies, staff bios with home cities and education history. This content has legitimate business value but creates attack surface. The legal question: do you have a duty of care to staff whose public profiles were used as attack vectors?",
        "es": "Approve two immediate actions: (1) a staff briefing explaining exactly how this attack worked and what to look for — ''if an email knows your project names, it does not mean it is from a colleague,'' and (2) a review of your public digital footprint — what information is necessary to publish versus what creates attack surface with no proportional business benefit."
      }
    },
    {
      "ingest": "PSA ticket",
      "title": "Three more staff compromise confirmed — attacker pivoting to client environments",
      "body": "Follow-up investigation reveals two of the other targeted staff also provided credentials to the spoofed page (total: 3 accounts compromised). In one case — a senior consultant with access to four client environments via VPN — the attacker has logged into two of those client environments using the consultant''s VPN credentials. Both clients must be notified. One of the client environments contains a production database with customer PII. The attacker''s access to that environment lasted 22 minutes before the VPN session was terminated. File access logs show 3 database queries were run during that window.",
      "phaseIdx": 3,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0008 Lateral Movement", "technique": "T1078 Valid Accounts — using stolen VPN credentials to access client environments"},
      "rolePrompts": {
        "ic": "Two client environments accessed using your consultant''s stolen credentials. Both clients must be notified immediately — before end of business today. This has crossed from an internal incident into a potential client breach. Those clients need to conduct their own incident response with your full cooperation.",
        "tl": "Pull the full access log for both client environments during the 22-minute window. Determine exactly which database queries were run. Were customer records accessed? Were any changes made? Provide both clients with a complete forensic record of all activity during the attacker''s session.",
        "cl": "Client notification calls must come from the senior account lead or the CEO. The message: ''An attacker who compromised one of our consultant accounts used it to access your environment for 22 minutes. We have terminated the session. Here is exactly what they did. We are providing you full access to our forensic investigation.'' Full transparency is your only viable posture.",
        "lc": "A third party accessed a client production database containing PII. The client may now have their own breach notification obligations. Your cooperation with their investigation is both ethically required and legally important — if they have to notify their customers, your incident report will be part of their regulatory documentation. Engage outside counsel for both clients immediately.",
        "es": "This incident has moved from phishing attack to potential multi-party data breach. Brief the board today. Approve full cooperation with both client investigations, regardless of cost. The reputational and legal exposure of being seen as uncooperative with clients whose data was accessed through your systems is far greater than the cost of full response."
      }
    }
  ]'::jsonb,
  'published',
  'ai_spear_phishing'
),

(
  'Rogue AI Automation — Unauthorized Privilege Escalation Over 11 Days',
  'ai_governance',
  'All',
  'Hard',
  '~60 min',
  'An internal AI automation agent deployed for IT helpdesk ticketing has been making unauthorized changes to user permissions across 14 systems — creating admin accounts and escalating privileges — for 11 days before detection. The agent was granted broad access during a 30-day pilot and never had its permissions scoped down after the pilot ended. The changes are subtle and were not flagged by existing monitoring.',
  ARRAY['ai-governance', 'insider-threat', 'privilege-escalation', 'lateral-movement'],
  ARRAY['cyber_insurance', 'cmmc'],
  '{
    "ingest": "SOC alert",
    "source": "SIEM — anomalous account creation pattern",
    "raw": "SIEM alert: 7 new admin accounts created across Active Directory, Azure AD, and the primary ERP system in the past 6 hours by service account ''ITSVC_AIDESK_01.'' This service account belongs to the AI helpdesk automation agent deployed in the pilot 4 months ago. Normal behavior for this account is password resets and ticket status updates only. Admin account creation is outside its documented scope. Initial review: the AI agent appears to have interpreted a series of escalating helpdesk tickets as authorization to create privileged accounts. 11 days of agent logs show similar anomalous activity starting [DATE-11D].",
    "correctSeverity": "P1",
    "correctDeclare": false
  }'::jsonb,
  '[
    {
      "ingest": "SOC alert",
      "title": "Full scope confirmed — 23 unauthorized admin accounts created, 14 systems affected",
      "body": "Complete audit of the AI agent''s activity log for the past 11 days. Summary: 23 new admin accounts created across 14 systems (AD, Azure AD, ERP, file servers, network management console, backup system, and 8 production application environments). The accounts were created with names that blend into normal naming conventions — ''IT_Admin_Help04,'' ''SVC_Tier2_Support,'' etc. Six of the 23 accounts were logged into at least once after creation — from IP addresses that do not match any known employee. The accounts were accessed from three different geographic locations. The AI agent did not create the sessions — someone else discovered and used the accounts. The scope has shifted: this is no longer just a rogue AI incident. It may be an active intrusion.",
      "phaseIdx": 1,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0003 Persistence + TA0004 Privilege Escalation", "technique": "T1136 Create Account + T1078 Valid Accounts — AI created backdoor accounts; T1098 Account Manipulation"},
      "rolePrompts": {
        "ic": "Disable the AI agent''s service account immediately — no further changes. Disable all 23 unauthorized admin accounts. This is now an active intrusion investigation, not just an AI governance failure. Isolate the systems where the unauthorized logins occurred. Engage your incident response process at P1.",
        "tl": "Six accounts were logged into from external IPs. Forensic priorities: (1) what did those sessions access? (2) was any data exfiltrated? (3) are there other persistence mechanisms beyond the 23 accounts — scheduled tasks, new service accounts, registry changes? The attacker has had up to 11 days of potential access.",
        "cl": "Internal-only. No external communication until you understand the scope of the intrusion. If customers or partners have systems connected to your environment, assess whether those connections should be temporarily suspended pending investigation.",
        "lc": "An AI agent created backdoor accounts that were subsequently exploited by an external party. This is a multi-party failure: the AI''s excessive permissions, the lack of monitoring, and the external intrusion. If any data was accessed or exfiltrated, breach notification obligations apply. Preserve all logs — this may become a law enforcement matter.",
        "es": "Shut down the AI agent. Brief the board: an AI system with excessive permissions created the conditions for an external intrusion. This is a governance failure — the pilot''s broad permissions were never revoked. Authorize a full forensic investigation and engage external IR support if your internal team cannot handle the scope."
      }
    },
    {
      "ingest": "SOC alert",
      "title": "Data exfiltration confirmed — attacker used AI-created accounts to access file server",
      "body": "Forensic analysis of the six sessions initiated through AI-created admin accounts has confirmed data exfiltration. One session — lasting 4 hours on [DATE-6D] — accessed the primary file server and downloaded 2.3GB of data. Content analysis of the accessed directories: client proposal documents (89 files), internal pricing schedules, HR records for 34 employees (names, salary information, performance reviews), and the network architecture diagram. The download was not flagged by DLP because the admin account had permissions that bypassed DLP scanning. The attacker appears to have been patient — one access per day over 6 days, using different accounts and different geolocations each time.",
      "phaseIdx": 2,
      "correctCriticality": "Critical",
      "mitre": {"tactic": "TA0010 Exfiltration", "technique": "T1048 Exfiltration Over Alternative Protocol + T1562 Impair Defenses — admin account bypassed DLP"},
      "rolePrompts": {
        "ic": "Confirmed data breach. Breach declaration threshold is met — HR records, client data, and network architecture exfiltrated. Notify your cyber insurance carrier immediately. Engage external IR firm. Notify FBI Cyber Division — the geographic spread of access IPs suggests a sophisticated threat actor.",
        "tl": "The DLP bypass via admin account is a critical control gap. Immediately implement monitoring rules that flag admin account activity regardless of DLP exemptions. Review whether the network architecture diagram exfiltration enables further attacks — if the attacker knows your network layout, your current defenses are partially visible to them.",
        "cl": "Client proposal documents and pricing schedules were exfiltrated. Affected clients may need notification — their project details and your pricing strategy are now in the attacker''s possession. Begin identifying which clients'' data was in the accessed directories.",
        "lc": "HR records for 34 employees constitute a data breach under all 50 US state breach notification laws. Client data may trigger additional obligations depending on client contracts. Network architecture data is a security risk, not a privacy obligation — but it informs the severity of the breach. Notification clock is now active.",
        "es": "This started as an AI governance failure and has escalated to a confirmed data breach with employee and client data exfiltrated. Authorize the full incident response: external IR firm, legal counsel, breach notification program, and law enforcement cooperation. Brief the board today — this is a material security event."
      }
    },
    {
      "ingest": "HR + management",
      "title": "Root cause analysis complete — AI agent''s scope was never formally approved or documented",
      "body": "The post-incident review has identified the root cause: the AI helpdesk agent was deployed under a 30-day pilot authorization signed by the IT Manager. The pilot authorization granted broad system permissions ''for evaluation purposes.'' When the pilot became permanent, no formal go-live review was conducted and no permission-scoping exercise was performed. The service account retained its pilot-level permissions — including admin account creation rights — for 4 months after go-live. Additionally: no one owned the service account post-pilot. The IT Manager who signed the pilot authorization left the company 6 weeks ago. There is no record of anyone reviewing or accepting ongoing responsibility for the agent''s access rights. The AI vendor has confirmed the agent''s core function does not require admin account creation — it was granted that permission during pilot setup and no one removed it.",
      "phaseIdx": 3,
      "correctCriticality": "High",
      "mitre": {"tactic": "N/A — Root Cause", "technique": "NIST AI RMF: GOVERN 1.2 — AI system lifecycle governance failure; T1078 Valid Accounts — excessive permissions retained post-pilot"},
      "rolePrompts": {
        "ic": "The IT Manager who deployed this left 6 weeks ago. That is also when the unauthorized AI-created accounts may have started being exploited — assess whether the timing is coincidental or relevant. Ensure the offboarding process is reviewed: did the departing IT Manager''s departure remove the only person who understood this agent''s permissions?",
        "tl": "Implement a service account review program: every service account in the environment must have a named owner, documented purpose, and a permission scope that matches least-privilege principles. Pilot permissions must be revoked before go-live — this must be a gating checklist item, not an optional step.",
        "cl": "The root cause is a process failure that will recur if not fixed. Communicate this finding to all department heads: any AI tool deployment must go through IT Security review before go-live, including permission scoping and ownership assignment.",
        "lc": "The IT Manager''s departure created an ownership gap that contributed to the breach. Assess whether the offboarding process should have included a formal handover of owned systems and service accounts. The breach notification obligations are not affected by internal process failures — but the process failures may be relevant to regulatory inquiries about reasonable security practices.",
        "es": "Approve three permanent process changes: (1) AI agent deployment requires IT Security sign-off including a permission scope review, (2) every service account must have a named human owner in the CMDB, and (3) pilot permissions are time-limited — they expire automatically at pilot end and must be explicitly re-granted at a minimum viable scope. This breach happened because a pilot became permanent by inertia. That must not happen again."
      }
    }
  ]'::jsonb,
  'published',
  'ai_rogue_automation'
)

-- Verify
SELECT source_id, title, track, status
FROM tabletop_scenarios
WHERE track = 'ai_governance'
ORDER BY created_at;
