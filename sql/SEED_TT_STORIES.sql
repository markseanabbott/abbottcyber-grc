-- SEED_TT_STORIES.sql
-- 12 opener stories across 4 IR archetypes: ransomware, bec, insider, vendor_compromise
-- entry_card_id = first inject players see (detection point, not attacker stage-1)
-- detection_maturity: early / mid / late
-- Safe to re-run: ON CONFLICT (id) DO UPDATE
-- Requires: SUPABASE_PATCH_063.sql must be run first

-- ============================================================
-- RANSOMWARE (3 stories)
-- ============================================================

INSERT INTO public.tt_stories (id, archetype, track, title, opener_text, business_context, notes, entry_card_id, detection_maturity)
VALUES (
  'story_r01',
  'ransomware',
  'ir',
  'A Monday Morning That Starts Going Wrong',
  $txt$It is Monday morning at {{org_name}}. Staff are arriving and inboxes are filling. At 8:47 AM a member of the finance team opens an email with a document attachment from what appears to be a recognized vendor. When prompted to enable editing, they click yes. They scroll through the document, find nothing unusual, and close it.

At 9:08 AM your endpoint detection platform fires an alert. A process launched from the Office document opened twenty minutes earlier is attempting to establish an outbound connection to an external IP address. The detection engine has classified it as high confidence — a beaconing pattern consistent with a C2 framework.

The alert is sitting in your monitoring queue. The finance team member is still at their desk. No other systems have reported anything yet.$txt$,
  $txt$Phishing attachment opened by finance team member, macro executed, C2 beacon established. Detection occurs at the C2 establishment stage — EDR alert on the beaconing process. Backstory vector: R1a (phishing attachment). Entry point for the exercise: R2a.$txt$,
  NULL,
  'R2a',
  'early'
)
ON CONFLICT (id) DO UPDATE SET
  title              = EXCLUDED.title,
  opener_text        = EXCLUDED.opener_text,
  business_context   = EXCLUDED.business_context,
  notes              = EXCLUDED.notes,
  entry_card_id      = EXCLUDED.entry_card_id,
  detection_maturity = EXCLUDED.detection_maturity;

INSERT INTO public.tt_stories (id, archetype, track, title, opener_text, business_context, notes, entry_card_id, detection_maturity)
VALUES (
  'story_r02',
  'ransomware',
  'ir',
  'Movement in the Domain Nobody Authorized',
  $txt$Overnight on Tuesday your SIEM correlation engine generates a high-priority alert: a pass-the-hash authentication event has been detected against your primary domain controller. The source is a workstation used by a mid-level IT technician. The credential being passed belongs to a different account — one with domain administrator privileges.

A quick log pull on that workstation shows an RDP session established from an external IP address late Friday evening using valid credentials for the IT technician's account. The session ran a series of commands and closed after forty minutes. Activity on that workstation over the weekend has been intermittent but steady.

It is Wednesday morning. The domain controller authentication succeeded. Something in your environment now holds domain admin rights. You do not yet know what it is doing with them.$txt$,
  $txt$Initial access via RDP brute-force Friday evening (R1c backstory). Attacker spent the weekend deploying tooling and harvesting credentials. Exercise begins at the moment domain admin privilege escalation is detected via the SIEM. Nothing destructive has happened. Backstory vector: R1c. Entry point: R4b.$txt$,
  NULL,
  'R4b',
  'mid'
)
ON CONFLICT (id) DO UPDATE SET
  title              = EXCLUDED.title,
  opener_text        = EXCLUDED.opener_text,
  business_context   = EXCLUDED.business_context,
  notes              = EXCLUDED.notes,
  entry_card_id      = EXCLUDED.entry_card_id,
  detection_maturity = EXCLUDED.detection_maturity;

INSERT INTO public.tt_stories (id, archetype, track, title, opener_text, business_context, notes, entry_card_id, detection_maturity)
VALUES (
  'story_r03',
  'ransomware',
  'ir',
  'Something Is Deleting Backups',
  $txt$At 2:31 AM your backup monitoring platform sends a critical alert: the backup agent on three servers has been stopped and volume shadow copies are being deleted. The deletions started twelve minutes ago and are still running across multiple systems.

A preliminary log review shows the commands were executed under a domain administrator account that performed its last authorized activity six days ago. VPN appliance logs from that time show an exploit attempt against a publicly disclosed CVE — the appliance was not in the most recent patch cycle.

The shadow copy deletions are still in progress. No files have been renamed or encrypted. Whatever comes next has not happened yet.$txt$,
  $txt$VPN appliance CVE exploitation six days ago (R1b backstory), web shell and credential access established since. Exercise begins at the shadow copy deletion and backup agent disable stage. Ransomware is staged and detonation is imminent but has not occurred — players have a narrow window to act. Backstory vector: R1b. Entry point: R5a.$txt$,
  NULL,
  'R5a',
  'late'
)
ON CONFLICT (id) DO UPDATE SET
  title              = EXCLUDED.title,
  opener_text        = EXCLUDED.opener_text,
  business_context   = EXCLUDED.business_context,
  notes              = EXCLUDED.notes,
  entry_card_id      = EXCLUDED.entry_card_id,
  detection_maturity = EXCLUDED.detection_maturity;

-- ============================================================
-- BEC (3 stories)
-- ============================================================

INSERT INTO public.tt_stories (id, archetype, track, title, opener_text, business_context, notes, entry_card_id, detection_maturity)
VALUES (
  'story_b01',
  'bec',
  'ir',
  'The Wire Request Sitting in the Approval Queue',
  $txt$At 4:45 PM on a Thursday your finance approver receives an email that appears to be from the CEO. The subject is marked urgent. The message explains that a confidential acquisition is in its final stages, instructs the recipient not to call as the CEO is in meetings, and requests a same-day wire transfer to an account provided in the body of the email. The amount is material.

The sender domain is one character off from {{org_name}}'s own — close enough to pass a quick glance. The thread includes what appears to be prior correspondence with an external legal firm, though that contact's address is from a free webmail provider.

The request is in the approval queue. The CEO is genuinely travelling and has not responded to messages. No funds have moved.$txt$,
  $txt$BEC via lookalike domain registration (B1b backstory). OSINT used to identify CEO travel schedule and finance approver (B2b backstory). Exercise begins at the moment the wire request arrives and the finance team is questioning whether to act. Funds have not moved. Backstory vector: B1b. Entry point: B4a.$txt$,
  NULL,
  'B4a',
  'mid'
)
ON CONFLICT (id) DO UPDATE SET
  title              = EXCLUDED.title,
  opener_text        = EXCLUDED.opener_text,
  business_context   = EXCLUDED.business_context,
  notes              = EXCLUDED.notes,
  entry_card_id      = EXCLUDED.entry_card_id,
  detection_maturity = EXCLUDED.detection_maturity;

INSERT INTO public.tt_stories (id, archetype, track, title, opener_text, business_context, notes, entry_card_id, detection_maturity)
VALUES (
  'story_b02',
  'bec',
  'ir',
  'Inbox Rules That Nobody Set',
  $txt$During a routine security review on a Tuesday afternoon an IT analyst flags unusual activity on the accounts payable manager's mailbox. A set of inbox rules were created at 6:14 AM yesterday — rules that automatically route messages containing certain subjects to an archive folder and mark them read before the account holder sees them.

Pulling authentication logs for the same account reveals a successful login at 6:11 AM from an IP address registered to a hosting provider with no connection to {{org_name}}. The AP manager was not at work at that time. This is the first time that IP address has appeared in the environment's logs.

The AP manager is currently in the building and their account is active. No financial transactions have been flagged. The inbox rules are still operating.$txt$,
  $txt$AP manager credentials compromised via credential stuffing from a prior breach (B1c backstory). Exercise begins at the point IT discovers the malicious inbox rules and foreign login — before any fraudulent payment has occurred. Players are responding to a detected compromise, not a loss event. Backstory vector: B1c. Entry point: B2a.$txt$,
  NULL,
  'B2a',
  'early'
)
ON CONFLICT (id) DO UPDATE SET
  title              = EXCLUDED.title,
  opener_text        = EXCLUDED.opener_text,
  business_context   = EXCLUDED.business_context,
  notes              = EXCLUDED.notes,
  entry_card_id      = EXCLUDED.entry_card_id,
  detection_maturity = EXCLUDED.detection_maturity;

INSERT INTO public.tt_stories (id, archetype, track, title, opener_text, business_context, notes, entry_card_id, detection_maturity)
VALUES (
  'story_b03',
  'bec',
  'ir',
  'A Client Called to Say Something Went Wrong',
  $txt$A client calls {{org_name}} at 9:15 AM. They received an email last week from a senior member of your team with instructions to update a payment record before the next billing cycle. They followed the instruction. They are now calling to confirm the new details are correct because something is making them uneasy.

The senior team member being referenced did not send that email. When IT pulls the account's authentication history, they find it has been accessed from an unrecognized IP address for the past three weeks, with inbox forwarding rules active and a pattern of outbound messages the account holder did not write.

You are looking at a live account compromise that has been operating undetected for three weeks. The client call is the first indication that fraud may have occurred. You do not yet know the full scope.$txt$,
  $txt$Executive O365 credentials harvested via spear-phishing three weeks ago (B1a backstory). Attacker monitored inbox and impersonated exec externally. Exercise begins after a client call surfaces a fraudulent payment instruction and the account compromise is discovered simultaneously. Damage has occurred but scope is unknown. Backstory vector: B1a. Entry point: B5a.$txt$,
  NULL,
  'B5a',
  'late'
)
ON CONFLICT (id) DO UPDATE SET
  title              = EXCLUDED.title,
  opener_text        = EXCLUDED.opener_text,
  business_context   = EXCLUDED.business_context,
  notes              = EXCLUDED.notes,
  entry_card_id      = EXCLUDED.entry_card_id,
  detection_maturity = EXCLUDED.detection_maturity;

-- ============================================================
-- INSIDER THREAT (3 stories)
-- ============================================================

INSERT INTO public.tt_stories (id, archetype, track, title, opener_text, business_context, notes, entry_card_id, detection_maturity)
VALUES (
  'story_i01',
  'insider',
  'ir',
  'An Alert in the Middle of a Handover',
  $txt$A member of your sales team submitted their resignation three days ago. Their two-week handover period has begun — client introductions, documentation, the normal process. This morning at 11:22 AM your DLP tool fires an alert: the employee's account is uploading files via a browser session to an external cloud storage address not on the approved list.

The transfer is still in progress according to the alert. The volume counter is climbing. The employee is currently in a handover meeting in a conference room on the same floor as their desk.

You do not yet know what files are being transferred or whether this is the first time it has happened.$txt$,
  $txt$Sales rep accepted competitor offer, mapped file shares, and confirmed a DLP gap via small test transfers before staging in volume (I1b, I2b, I2c backstory). Exercise begins as the DLP fires mid-transfer with the employee still on-site. Transfer outcome depends on how quickly players respond. Backstory vector: I1b. Entry point: I3b.$txt$,
  NULL,
  'I3b',
  'mid'
)
ON CONFLICT (id) DO UPDATE SET
  title              = EXCLUDED.title,
  opener_text        = EXCLUDED.opener_text,
  business_context   = EXCLUDED.business_context,
  notes              = EXCLUDED.notes,
  entry_card_id      = EXCLUDED.entry_card_id,
  detection_maturity = EXCLUDED.detection_maturity;

INSERT INTO public.tt_stories (id, archetype, track, title, opener_text, business_context, notes, entry_card_id, detection_maturity)
VALUES (
  'story_i02',
  'insider',
  'ir',
  'Database Queries at Midnight',
  $txt$At 12:04 AM your SIEM generates an alert that escalates from medium to high within three minutes: a privileged account associated with a systems administrator is executing a sequence of queries against the HR database. The queries are broad — employee records, compensation data, employment contract fields. This account's documented role does not include access to HR or payroll systems.

The queries ran for fifteen minutes and stopped at 12:19 AM. Authentication logs show a remote desktop session from a residential IP address consistent with the administrator's home address.

The administrator is scheduled to report to work this morning. They are unaware the access has been flagged.$txt$,
  $txt$Disgruntled IT admin recently passed over for promotion using legitimate privileged access to query systems outside job scope (I1a backstory). Exercise begins at the SIEM alert on after-hours out-of-scope database queries. No data exfiltration confirmed. Players must investigate without alerting the subject. Backstory vector: I1a. Entry point: I2a.$txt$,
  NULL,
  'I2a',
  'early'
)
ON CONFLICT (id) DO UPDATE SET
  title              = EXCLUDED.title,
  opener_text        = EXCLUDED.opener_text,
  business_context   = EXCLUDED.business_context,
  notes              = EXCLUDED.notes,
  entry_card_id      = EXCLUDED.entry_card_id,
  detection_maturity = EXCLUDED.detection_maturity;

INSERT INTO public.tt_stories (id, archetype, track, title, opener_text, business_context, notes, entry_card_id, detection_maturity)
VALUES (
  'story_i03',
  'insider',
  'ir',
  'An Account in the Access Review That Should Not Be There',
  $txt$During a quarterly access review a junior IT analyst cross-references active directory accounts against the current contractor roster. One entry does not match: a contractor whose engagement ended six months ago still has an active account, active VPN access, and according to authentication logs has used both to connect to the environment eight times in the past month.

The most recent login was four days ago. Post-login activity shows a VPN session followed by network share browsing on the internal file server and several file opens in a folder containing operational documentation.

The former contractor was never formally notified their access would be closed. You do not yet know if this is them, someone who obtained their credentials, or something else.$txt$,
  $txt$Contractor account was never deprovisioned after the engagement ended (I1d backstory). Account has been used periodically for one month. Exercise begins at the access review discovery. VPN and file share activity is confirmed but scope and intent are unknown. Backstory vector: I1d. Entry point: I2d.$txt$,
  NULL,
  'I2d',
  'early'
)
ON CONFLICT (id) DO UPDATE SET
  title              = EXCLUDED.title,
  opener_text        = EXCLUDED.opener_text,
  business_context   = EXCLUDED.business_context,
  notes              = EXCLUDED.notes,
  entry_card_id      = EXCLUDED.entry_card_id,
  detection_maturity = EXCLUDED.detection_maturity;

-- ============================================================
-- VENDOR COMPROMISE (3 stories)
-- ============================================================

INSERT INTO public.tt_stories (id, archetype, track, title, opener_text, business_context, notes, entry_card_id, detection_maturity)
VALUES (
  'story_v01',
  'vendor_compromise',
  'ir',
  'A 3 AM Login to the Admin Console',
  $txt$At 3:22 AM your RMM platform generates a login alert on an administrative account belonging to one of your senior technicians. The source IP address is registered to a hosting provider in Eastern Europe with no connection to your business. The session authenticated successfully — correct credentials, and no MFA challenge because the device fingerprint matched a previously trusted session.

Over the following eleven minutes the session opened the client management dashboard, pulled the full client list, and accessed device inventories and network topology exports for several managed accounts. At 3:33 AM the session disconnected.

Your technician was not working. It is now 6 AM and no commands have been pushed to any client environment. The session occurred six hours ago.$txt$,
  $txt$MSP technician credentials compromised via credential stuffing from a personal account breach (V1a backstory). Exercise begins at the RMM login alert. Attacker performed client-list reconnaissance but has not pivoted to any client environment. Players are responding before managed client impact occurs. Backstory vector: V1a. Entry point: V2a.$txt$,
  NULL,
  'V2a',
  'early'
)
ON CONFLICT (id) DO UPDATE SET
  title              = EXCLUDED.title,
  opener_text        = EXCLUDED.opener_text,
  business_context   = EXCLUDED.business_context,
  notes              = EXCLUDED.notes,
  entry_card_id      = EXCLUDED.entry_card_id,
  detection_maturity = EXCLUDED.detection_maturity;

INSERT INTO public.tt_stories (id, archetype, track, title, opener_text, business_context, notes, entry_card_id, detection_maturity)
VALUES (
  'story_v02',
  'vendor_compromise',
  'ir',
  'A Vendor Disclosure That Raises More Questions Than It Answers',
  $txt$At 8:30 AM your primary SaaS vendor sends {{org_name}} a security notification. A developer accidentally committed a live API key to a public GitHub repository eighteen months ago. A security researcher discovered it and disclosed it to the vendor yesterday. The key was revoked two hours ago.

While it was active, the key carried read and write access to client configuration data and, depending on the endpoint, the ability to act on behalf of managed accounts. The repository was publicly accessible for the full eighteen-month period.

The vendor is investigating whether the key was accessed by anyone other than the researcher. They do not have an answer yet. You have clients whose data sits inside this platform.$txt$,
  $txt$SaaS vendor API key committed to a public GitHub repo 18 months ago (V1c backstory). Vendor has disclosed and revoked the key. Exercise begins at notification receipt — scope of unauthorized access is unconfirmed. Players must respond under uncertainty: assess client impact, manage the vendor relationship, and handle regulatory obligations before the facts are established. Backstory vector: V1c. Entry point: V2b.$txt$,
  NULL,
  'V2b',
  'early'
)
ON CONFLICT (id) DO UPDATE SET
  title              = EXCLUDED.title,
  opener_text        = EXCLUDED.opener_text,
  business_context   = EXCLUDED.business_context,
  notes              = EXCLUDED.notes,
  entry_card_id      = EXCLUDED.entry_card_id,
  detection_maturity = EXCLUDED.detection_maturity;

INSERT INTO public.tt_stories (id, archetype, track, title, opener_text, business_context, notes, entry_card_id, detection_maturity)
VALUES (
  'story_v03',
  'vendor_compromise',
  'ir',
  'The Same Alert, Across Multiple Clients, at 3 AM',
  $txt$Beginning at 3:07 AM your monitoring stack starts generating alerts from multiple managed client environments simultaneously. The alerts vary by client — unexpected scheduled task creations on some systems, unusual outbound connections on others, unfamiliar service registrations on a third. Different clients, different symptoms, all within the same ninety-minute window.

A common thread emerges: every affected system received an automatic software update from a platform vendor you manage on behalf of all these clients between 2:00 AM and 3:00 AM. The update was digitally signed and passed all verification checks at the time.

At 6:45 AM the vendor's security team calls to confirm their build pipeline was compromised. The update contained a backdoor. Distribution completed overnight. Every system that accepted the update in the past five hours has the backdoor installed and active.$txt$,
  $txt$Vendor build pipeline infiltrated, trojanized signed update pushed overnight (V1d backstory), update server confirmed auto-update targets beforehand (V2c backstory). Exercise begins after endpoint alerts fire across multiple client environments and the vendor confirms the compromise. Backdoor is active but what it has done is unknown. Backstory vector: V1d. Entry point: V3c.$txt$,
  NULL,
  'V3c',
  'mid'
)
ON CONFLICT (id) DO UPDATE SET
  title              = EXCLUDED.title,
  opener_text        = EXCLUDED.opener_text,
  business_context   = EXCLUDED.business_context,
  notes              = EXCLUDED.notes,
  entry_card_id      = EXCLUDED.entry_card_id,
  detection_maturity = EXCLUDED.detection_maturity;
