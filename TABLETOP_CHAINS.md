# Tabletop Story Board — Chain & Tag Reference

> **Purpose:** Reference for the TB2 branching inject system. Use this to understand the tag vocabulary, add new cards, or design new archetypes. This file is the human-readable companion to the `tt_inject_cards` table in Supabase.

---

## How the system works

### The grid model

Each archetype (ransomware, BEC, insider, vendor_compromise) has a **fixed stage skeleton** — an ordered list of ATT&CK-aligned stages that every session walks through, one card per stage. The branching effect comes from having **multiple option cards at each stage**, each requiring different predecessor tags and granting different successor tags.

The engine (TB5) picks one card per stage by:
1. Filtering to cards at the next `chain_stage` whose `requires` tags are all present in the current session tag state.
2. Weighting the eligible cards by their `weight` column.
3. Picking one at random from the weighted pool.

### The tag state

The session maintains a running set of **granted tags**. Every card played adds its `grants` tags to the set. The next stage's eligible cards are those whose `requires` tags are all in that set.

- `requires: []` (empty) — card is eligible from any prior state (used for stage-1 openers).
- `grants: []` (empty, terminal) — card ends the chain; typically impact-stage cards.

### Card columns in `tt_inject_cards`

| Column | Purpose |
|--------|---------|
| `id` | Unique identifier, e.g. `R1a`, `B2c` |
| `archetype` | `ransomware` / `bec` / `insider` / `vendor_compromise` |
| `track` | `ir` / `bcdr` / `exec` / `vendor` |
| `chain_stage` | Integer position in the skeleton (1 = first stage) |
| `stage_label` | Human label for the stage, e.g. `Initial Access` |
| `requires` | JSON array of tags that must be in state before this card is eligible |
| `grants` | JSON array of tags added to state when this card is played |
| `weight` | Integer; higher = more likely to be picked (default 10, lower = rarer) |
| `title` | Short inject headline |
| `body` | Full inject text shown to all roles (authored in TB4) |
| `role_prompts` | JSON object keyed by role_id — per-role prompt (authored in TB4) |
| `mitre_tactic` | MITRE ATT&CK tactic label |
| `mitre_technique` | MITRE ATT&CK technique label |
| `correct_criticality` | `Critical` / `High` / `Medium` / `Low` |
| `nist_phase_idx` | 0=Prepare, 1=Detect/Analyze, 2=Contain, 3=Eradicate, 4=Recover, 5=Post-Incident |

### How to add a new card

1. Pick the archetype and stage it belongs to.
2. Look at what tags the prior stage's cards grant (see the grids below).
3. Set `requires` to the subset of prior-stage tags your new card needs.
4. Set `grants` to whatever new tags your card introduces (or `[]` if terminal).
5. Make sure at least one card in the *next* stage can receive your new grants tags — otherwise the session will dead-end.
6. Set `weight` (10 = normal, 7 = rarer variant, 13 = slightly more common).
7. Insert the row in Supabase. No code change required.

---

## Ransomware

**Track:** `ir` | **Stages:** 6 | **Total cards:** 21

### Stage skeleton

```
Stage 1  Initial Access          TA0001
Stage 2  Execution & C2          TA0002
Stage 3  Credential Access       TA0006
Stage 4  Priv Esc & Lateral      TA0004 / TA0008
Stage 5  Pre-Impact              TA0005 / TA0009 / TA0010
Stage 6  Impact (terminal)       TA0040
```

### Tag vocabulary

| Tag | Meaning |
|-----|---------|
| `access:email` | Entry via phishing / email vector |
| `access:web` | Entry via web-facing exploitation |
| `access:interactive` | Entry via direct interactive access (RDP) |
| `foothold:achieved` | Any foothold established (universal — granted by all stage-1 cards) |
| `c2:established` | C2 channel active (granted by all stage-2 cards) |
| `c2:beaconing` | Automated beacon (Cobalt Strike style) |
| `c2:webshell` | Web shell persistence on edge device |
| `c2:interactive` | Attacker manually present in session |
| `persistence:established` | Persistence mechanism installed (LOTL path) |
| `creds:domain_user` | Domain user credentials obtained |
| `creds:service_account` | Service account credentials obtained |
| `creds:local_admin` | Local admin credentials obtained |
| `priv:domain_admin` | Domain admin achieved |
| `lateral:complete` | Full lateral movement across domain |
| `lateral:partial` | Partial lateral movement, stops short of DC |
| `backups:disabled` | Shadow copies / backup agent compromised |
| `exfil:complete` | Data exfiltrated (double extortion lever armed) |
| `extortion:leverage` | Exfil leverage confirmed |
| `payload:staged` | Ransomware payload pre-staged on reachable hosts |
| `defense:blind` | EDR / AV disabled |
| `impact:imminent` | Pre-conditions met, detonation ready (granted by all stage-5 cards) |

### Stage 1 — Initial Access (TA0001)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| R1a | Phishing — malicious macro attachment delivered to employee | *(none)* | `access:email` · `foothold:achieved` | 10 | High | 1 |
| R1b | VPN / edge appliance exploit on unpatched CVE | *(none)* | `access:web` · `foothold:achieved` | 10 | Critical |  1 |
| R1c | RDP brute force on externally exposed port | *(none)* | `access:interactive` · `foothold:achieved` | 10 | High | 1 |

### Stage 2 — Execution & C2 (TA0002)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| R2a | Macro executes — Cobalt Strike / Sliver beacon dropped in memory | `access:email` | `c2:established` · `c2:beaconing` | 10 | Critical | 1 |
| R2b | Web shell planted on compromised edge device | `access:web` | `c2:established` · `c2:webshell` | 10 | Critical | 1 |
| R2c | Attacker deploys tooling via live RDP session | `access:interactive` | `c2:established` · `c2:interactive` | 10 | Critical | 1 |
| R2d | LOTL — PowerShell scheduled task, no beacon | `foothold:achieved` | `c2:established` · `persistence:established` | 7 | High | 1 |

> R2d is valid after any stage-1 card (all grant `foothold:achieved`) but is less common (weight 7). It opens the low-noise path through R3d.

### Stage 3 — Credential Access (TA0006)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| R3a | LSASS dump via Mimikatz or equivalent | `c2:established` | `creds:domain_user` | 10 | Critical | 1 |
| R3b | Kerberoasting — service account TGS tickets cracked offline | `c2:established` | `creds:service_account` · `creds:domain_user` | 10 | Critical | 1 |
| R3c | Pass-the-hash with NTLM stolen from local SAM | `c2:established` | `creds:local_admin` | 10 | High | 1 |
| R3d | Browser credential harvest + stored password dump | `persistence:established` | `creds:domain_user` | 10 | High | 1 |

> R3b grants two credential tags — it unlocks both R4a and R4b at stage 4.
> R3d is only reachable via R2d (the LOTL path).

### Stage 4 — Privilege Escalation & Lateral Movement (TA0004 / TA0008)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| R4a | Service account pivots to domain controller | `creds:service_account` | `priv:domain_admin` · `lateral:complete` | 10 | Critical | 2 |
| R4b | Pass-the-hash / pass-the-ticket to domain controller | `creds:domain_user` | `priv:domain_admin` · `lateral:complete` | 10 | Critical | 2 |
| R4c | Local admin relay — spreads to nearby hosts, stops short of DC | `creds:local_admin` | `lateral:partial` | 10 | High | 2 |

> After R3b (grants both `creds:service_account` and `creds:domain_user`) → R4a and R4b are both valid options.
> After R3a or R3d → only R4b available.
> After R3c → only R4c available.

### Stage 5 — Pre-Impact (TA0005 / TA0009 / TA0010)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| R5a | Shadow copy deletion + backup agent disabled | `priv:domain_admin` | `backups:disabled` · `impact:imminent` | 10 | Critical | 2 |
| R5b | 80 GB data staged and exfiltrated — double extortion lever armed | `lateral:complete` | `exfil:complete` · `extortion:leverage` · `impact:imminent` | 10 | Critical | 2 |
| R5c | Ransomware payload pre-staged across all reachable hosts | `lateral:partial` | `payload:staged` · `impact:imminent` | 10 | Critical | 2 |
| R5d | EDR / AV disabled domain-wide via GPO | `priv:domain_admin` | `defense:blind` · `impact:imminent` | 10 | Critical | 2 |
| R5e | EDR silenced on reachable hosts (partial blind) | `lateral:partial` | `defense:blind` · `impact:imminent` | 10 | High | 2 |

> After R4a / R4b (grant `priv:domain_admin` + `lateral:complete`) → R5a, R5b, R5d all valid (3 options).
> After R4c (grants `lateral:partial` only) → R5c and R5e valid (2 options).
> Note: R5b requires only `lateral:complete`, so it does NOT require `priv:domain_admin`. A path via R4b → R5b is valid (PTH gives domain admin AND lateral:complete).

### Stage 6 — Impact, terminal (TA0040)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| R6a | Ransomware deployed via GPO or remote execution script | `impact:imminent` | *(terminal)* | 10 | Critical | 2 |
| R6b | Encrypt + threaten public data leak (double extortion) | `exfil:complete` | *(terminal)* | 10 | Critical | 2 |
| R6c | Backup destruction first, then encrypt — no clean recovery path | `backups:disabled` | *(terminal)* | 10 | Critical | 2 |

> R6a is always available (every stage-5 card grants `impact:imminent`).
> R6b is only available after R5b.
> R6c is only available after R5a.

---

### Ransomware — example paths

#### Path 1 — Classic phishing, no recovery path
`R1a → R2a → R3a → R4b → R5a → R6c`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | R1a Phishing attachment | `access:email`, `foothold:achieved` |
| 2 | R2a Cobalt Strike beacon | `c2:established`, `c2:beaconing` |
| 3 | R3a LSASS dump | `creds:domain_user` |
| 4 | R4b PTH to DC | `priv:domain_admin`, `lateral:complete` |
| 5 | R5a Shadow copy deletion | `backups:disabled`, `impact:imminent` |
| 6 | R6c Backup-first encrypt | *(terminal)* |

Narrative: Front-desk staff clicks a macro. Cobalt Strike beacon establishes quietly. Attacker dumps LSASS, moves laterally to DC, destroys backups, then detonates. No clean restore path exists.

---

#### Path 2 — VPN exploit, double extortion
`R1b → R2b → R3b → R4a → R5b → R6b`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | R1b VPN CVE exploit | `access:web`, `foothold:achieved` |
| 2 | R2b Web shell on edge | `c2:established`, `c2:webshell` |
| 3 | R3b Kerberoasting | `creds:service_account`, `creds:domain_user` |
| 4 | R4a Service account to DC | `priv:domain_admin`, `lateral:complete` |
| 5 | R5b 80 GB exfiltrated | `exfil:complete`, `extortion:leverage`, `impact:imminent` |
| 6 | R6b Encrypt + data leak threat | *(terminal)* |

Narrative: Attacker enters via an unpatched VPN CVE, plants a web shell, cracks a kerberoastable service account, achieves DA, quietly steals 80 GB of guest PII, then detonates encryption with a public-leak threat. Two ransom levers simultaneously.

---

#### Path 3 — RDP brute force, LOTL, blind EDR
`R1c → R2d → R3d → R4b → R5d → R6a`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | R1c RDP brute force | `access:interactive`, `foothold:achieved` |
| 2 | R2d LOTL scheduled task | `c2:established`, `persistence:established` |
| 3 | R3d Browser credential harvest | `creds:domain_user` |
| 4 | R4b PTH to DC | `priv:domain_admin`, `lateral:complete` |
| 5 | R5d EDR/AV disabled via GPO | `defense:blind`, `impact:imminent` |
| 6 | R6a Standard ransomware deploy | *(terminal)* |

Narrative: Attacker grinds through an exposed RDP port, uses only built-in Windows tools to stay under radar, harvests credentials from browser storage, achieves DA, turns off every endpoint defence via GPO, then detonates. No C2 beacon ever fires — a quiet, opportunistic attack that evades detection until impact.

---

## BEC

**Track:** `ir` | **Stages:** 5 | **Total cards:** 16

### Stage skeleton

```
Stage 1  Initial Access / Infiltration        TA0001 / TA0043
Stage 2  Reconnaissance                       TA0007 / T1114
Stage 3  Account Position / Impersonation     TA0043 / T1078
Stage 4  Social Engineering / Fraud Execute   TA0043 / T1566.002
Stage 5  Financial Impact (terminal)
```

### Tag vocabulary

| Tag | Meaning |
|-----|---------|
| `access:phishing` | Entry via credential harvest phishing |
| `access:lookalike` | Typosquat / lookalike domain configured |
| `access:credential_stuffing` | Password reuse exploit on real account |
| `email:account_compromised` | Real employee email account taken over |
| `email:lookalike_active` | Lookalike domain operational and sending |
| `recon:complete` | Org chart, approval workflow, and thresholds understood |
| `recon:inbox_monitored` | Hidden inbox rules set to monitor email traffic |
| `recon:thread_harvested` | Live payment thread identified in compromised inbox |
| `recon:osint_only` | Recon via public sources only — no account access |
| `vendor:identified` | Specific active vendor relationship found in emails |
| `trust:established` | Attacker holds a trusted sender position |
| `exec:impersonated` | Executive persona ready for wire request |
| `vendor:impersonated` | Vendor persona ready for invoice fraud |
| `thread:hijacked` | Attacker is inline in an active payment thread |
| `urgency:applied` | Time-pressure tactic deployed |
| `wire:requested` | Fraudulent wire transfer request sent |
| `invoice:substituted` | Banking details changed on legitimate invoice |
| `payroll:diverted` | Payroll diversion instruction submitted |
| `fraud:submitted` | Any fraud instruction sent (universal — granted by all stage-4 cards) |

### Stage 1 — Initial Access / Infiltration (TA0001 / TA0043)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| B1a | IT help-desk spear phish harvests executive O365 credentials | *(none)* | `access:phishing` · `email:account_compromised` | 10 | High | 1 |
| B1b | Attacker registers typosquat domain — one character off from client domain | *(none)* | `access:lookalike` · `email:lookalike_active` | 10 | Medium | 1 |
| B1c | Finance team password found in credential database from prior breach | *(none)* | `access:credential_stuffing` · `email:account_compromised` | 7 | High | 1 |

### Stage 2 — Reconnaissance (TA0007 / T1114)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| B2a | Hidden inbox rules set — attacker monitors payment approvals in real time | `email:account_compromised` | `recon:complete` · `recon:inbox_monitored` | 10 | High | 1 |
| B2b | OSINT sweep — LinkedIn, filed accounts, press releases reveal CFO name and approval thresholds | `access:lookalike` | `recon:complete` · `recon:osint_only` | 10 | Medium | 1 |
| B2c | Attacker reads live payment threads — vendor relationships and pending invoices catalogued | `email:account_compromised` | `recon:complete` · `recon:thread_harvested` · `vendor:identified` | 10 | High | 1 |

> B2a and B2c are both valid after B1a / B1c (account compromised). B2b is only valid after B1b (lookalike). B2c grants extra `vendor:identified` tag enabling B3b.

### Stage 3 — Account Position / Impersonation (TA0043 / T1078)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| B3a | Attacker poses as CEO via compromised account — targets CFO with "confidential wire" framing | `recon:complete` | `trust:established` · `exec:impersonated` | 10 | High | 1 |
| B3b | Attacker impersonates vendor — sends updated banking details from lookalike or compromised email | `recon:complete` | `trust:established` · `vendor:impersonated` | 10 | High | 1 |
| B3c | Thread hijack — attacker replies inline to active payment thread from the compromised account | `recon:thread_harvested` | `trust:established` · `thread:hijacked` · `exec:impersonated` | 10 | Critical | 1 |

> B3c is only reachable via B2c. Rated Critical — inline thread replies are nearly undetectable without email forensics.

### Stage 4 — Social Engineering / Fraud Execution (TA0043 / T1566.002)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| B4a | Urgent same-day wire request — CEO cites confidential acquisition, instructs CFO not to call | `exec:impersonated` | `urgency:applied` · `wire:requested` · `fraud:submitted` | 10 | Critical | 1 |
| B4b | Invoice arrives with updated ACH / wire details — existing vendor relationship exploited | `vendor:impersonated` | `invoice:substituted` · `wire:requested` · `fraud:submitted` | 10 | High | 1 |
| B4c | Payroll diversion — attacker impersonates employee and submits direct-deposit change to HR | `trust:established` | `payroll:diverted` · `fraud:submitted` | 7 | High | 1 |
| B4d | Thread hijack wire request — attacker continues real payment thread with changed banking details | `thread:hijacked` | `urgency:applied` · `wire:requested` · `fraud:submitted` | 10 | Critical | 1 |

> All stage-4 cards grant `fraud:submitted` — universal convergence tag for stage 5.
> B4a and B4d also grant `urgency:applied`, enabling the B5b terminal outcome.

### Stage 5 — Financial Impact (terminal)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| B5a | Wire transfer authorized and processed — funds reach mule account within 90 minutes | `fraud:submitted` | *(terminal)* | 10 | Critical | 2 |
| B5b | Attacker calls back posing as bank to "verify" the transfer — cancellation window closes | `urgency:applied` | *(terminal)* | 10 | Critical | 2 |
| B5c | Payroll diversion runs silently for three pay cycles before discovered on reconciliation | `payroll:diverted` | *(terminal)* | 7 | High | 2 |

> B5a is available after any stage-4 card (all grant `fraud:submitted`).
> B5b requires `urgency:applied` — only available after B4a or B4d.
> B5c requires `payroll:diverted` — only available after B4c.

---

### BEC — example paths

#### Path 1 — Phishing, exec impersonation, double-tap prevents reversal
`B1a → B2a → B3a → B4a → B5b`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | B1a Spear phish | `access:phishing`, `email:account_compromised` |
| 2 | B2a Inbox rules | `recon:complete`, `recon:inbox_monitored` |
| 3 | B3a CEO impersonation | `trust:established`, `exec:impersonated` |
| 4 | B4a Urgent wire request | `urgency:applied`, `wire:requested`, `fraud:submitted` |
| 5 | B5b Double-tap phone call | *(terminal)* |

#### Path 2 — Lookalike domain, vendor fraud, wire processed
`B1b → B2b → B3b → B4b → B5a`

#### Path 3 — Phishing, thread hijack, inline wire request
`B1a → B2c → B3c → B4d → B5b`

---

## Insider

**Track:** `ir` | **Stages:** 5 | **Total cards:** 19

### Stage skeleton

```
Stage 1  Initial Act / Motivation         (insider misuse — no external MITRE tactic)
Stage 2  Reconnaissance & Data Mapping    TA0007 / T1083
Stage 3  Data Staging                     TA0009 / T1005 / T1213
Stage 4  Exfiltration                     TA0010 / T1052 / T1567
Stage 5  Impact (terminal)
```

### Tag vocabulary

| Tag | Meaning |
|-----|---------|
| `motive:grievance` | Disgruntled employee — passed over, facing termination, or retaliating |
| `motive:competitive` | Insider going to a competitor — collecting data for new employer |
| `motive:financial` | Insider selling data for money (external handler) |
| `access:privileged` | IT admin / DBA with elevated system access |
| `access:standard` | Standard employee access — no admin privileges |
| `access:deprovision_missed` | Terminated employee whose account was not revoked |
| `insider:active` | Insider is actively misusing access (universal — granted by all stage-1 cards) |
| `recon:data_mapped` | High-value data stores and locations identified |
| `recon:db_queried` | Broad database queries run outside normal job scope |
| `recon:share_browsed` | File share browsing — poorly permissioned folders identified |
| `recon:dlp_gap` | Gap in DLP coverage identified and confirmed |
| `recon:remote_access` | Stale remote-access credentials used to re-enter environment |
| `data:ready` | Data prepared for exfiltration (universal — granted by all stage-3 cards) |
| `data:staged_local` | Data copied to local device / drive |
| `data:staged_cloud` | Data staged to personal cloud storage |
| `data:staged_usb` | Data on USB device |
| `data:volume_high` | Large volume of data staged (3 GB+) |
| `data:volume_moderate` | Moderate volume, multiple smaller transfers |
| `impact:data_loss` | Data confirmed exfiltrated (universal — granted by all stage-4 cards) |

### Stage 1 — Initial Act / Motivation

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| I1a | Disgruntled IT admin queries HR and finance records outside job scope after being passed over | *(none)* | `motive:grievance` · `access:privileged` · `insider:active` | 10 | High | 1 |
| I1b | Sales rep accepts position at competitor — begins archiving client contact and pricing data | *(none)* | `motive:competitive` · `access:standard` · `insider:active` | 10 | High | 1 |
| I1c | Finance analyst approached by external party and agrees to exfiltrate financial data for payment | *(none)* | `motive:financial` · `access:standard` · `insider:active` | 7 | Critical | 1 |
| I1d | Terminated employee AD account not disabled — remote access continues 48 hours post-termination | *(none)* | `motive:grievance` · `access:deprovision_missed` · `insider:active` | 7 | Critical | 1 |

### Stage 2 — Reconnaissance & Data Mapping (TA0007 / T1083)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| I2a | Privileged user runs broad database queries, maps tables containing PII, financial records, and IP | `access:privileged` | `recon:data_mapped` · `recon:db_queried` | 10 | High | 1 |
| I2b | Standard user browses file shares, identifies folders with insufficient access controls | `access:standard` | `recon:data_mapped` · `recon:share_browsed` | 10 | Medium | 1 |
| I2c | Insider tests DLP behavior with small transfers and confirms personal cloud storage is not scanned | `access:standard` | `recon:dlp_gap` · `recon:data_mapped` | 7 | High | 1 |
| I2d | Terminated employee uses stale VPN credentials to re-enter environment and navigate shared drives | `access:deprovision_missed` | `recon:data_mapped` · `recon:remote_access` | 10 | Critical | 1 |

> I2a — privileged path only. I2b and I2c — standard access paths. I2d — deprovision-failure path only.
> I2c requires `access:standard` (not `insider:active`) — restricted to deliberate insiders, not stale accounts.

### Stage 3 — Data Staging (TA0009 / T1005 / T1213)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| I3a | Insider runs bulk export of customer database to local Downloads folder — 3.2 GB | `recon:data_mapped` | `data:staged_local` · `data:volume_high` · `data:ready` | 10 | High | 2 |
| I3b | Files copied to personal Dropbox via browser — DLP gap confirmed exploited | `recon:dlp_gap` | `data:staged_cloud` · `data:volume_moderate` · `data:ready` | 10 | High | 2 |
| I3c | USB device plugged in — 6 GB of files copied; endpoint protection does not block USB | `recon:data_mapped` | `data:staged_usb` · `data:volume_high` · `data:ready` | 7 | High | 2 |
| I3d | Files emailed to personal Gmail in small batches over two weeks — under single-file size threshold | `recon:data_mapped` | `data:staged_cloud` · `data:volume_moderate` · `data:ready` | 7 | High | 2 |

> I3b is only valid after I2c (DLP gap identified). All others require `recon:data_mapped` (granted by all stage-2 cards).
> All stage-3 cards grant `data:ready` — universal convergence for stage 4.

### Stage 4 — Exfiltration (TA0010 / T1052 / T1567)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| I4a | Insider resigns and walks out with USB containing client database — discovered during exit interview | `data:staged_usb` | `impact:data_loss` | 10 | High | 2 |
| I4b | Cloud sync completes overnight — 4.7 GB confirmed downloaded to personal device | `data:staged_cloud` | `impact:data_loss` | 10 | High | 2 |
| I4c | IR team locates local staging file — but forensics confirms a prior USB copy was already made | `data:staged_local` | `impact:data_loss` | 10 | High | 2 |
| I4d | Insider transfers data directly to competitor via secure file transfer — large outbound transfer logged | `motive:competitive` · `data:ready` | `impact:data_loss` | 7 | Critical | 2 |

> I4a–I4c gated by their specific staging tag. I4d requires both `motive:competitive` (stage 1) and `data:ready` (stage 3) — available only on the I1b path.

### Stage 5 — Impact (terminal)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| I5a | Competitor announces product matching stolen IP within 90 days — data confirmed used | `impact:data_loss` | *(terminal)* | 10 | High | 2 |
| I5b | Regulatory notification required — PII of 50,000+ individuals confirmed exfiltrated | `impact:data_loss` | *(terminal)* | 10 | Critical | 2 |
| I5c | Insider arrested at airport with USB — criminal referral filed, data partially recovered | `data:staged_usb` | *(terminal)* | 7 | High | 2 |

> I5a and I5b available after any stage-4 card. I5c requires the USB staging path.

---

### Insider — example paths

#### Path 1 — Privileged admin, bulk DB export, local staging found late
`I1a → I2a → I3a → I4c → I5b`

#### Path 2 — Competitive departure, DLP gap exploited, cloud sync
`I1b → I2c → I3b → I4b → I5a`

#### Path 3 — Terminated employee, stale access, USB walk-out, arrest
`I1d → I2d → I3c → I4a → I5c`

---

## Vendor Compromise

**Track:** `ir` | **Stages:** 5 | **Total cards:** 17

### Stage skeleton

```
Stage 1  Vendor Compromise              TA0001 / T1195 Supply Chain / T1078
Stage 2  Vendor Reconnaissance          TA0007 / T1583
Stage 3  Client Pivot                   TA0008 / T1199 Trusted Relationship
Stage 4  Client Discovery & Pre-Impact  TA0007 / TA0009
Stage 5  Impact (terminal)              TA0040
```

### Tag vocabulary

| Tag | Meaning |
|-----|---------|
| `vendor:compromised` | Attacker has a foothold in vendor environment |
| `vendor:msp_access` | Vendor has MSP-level RMM / PAM access to client systems |
| `vendor:api_access` | Vendor has API integration access to client data |
| `vendor:software_update` | Vendor delivers software updates to client endpoints |
| `access:credential_stuffing` | Vendor account gained via password reuse |
| `access:phishing` | Vendor technician phished — RAT installed |
| `access:credential_exposure` | API key found in public repository |
| `access:supply_chain` | Trojanized signed update delivered to clients |
| `recon:complete` | Attacker understands client landscape and integration points |
| `recon:client_list` | Full client org list and admin access scope mapped from MSP console |
| `recon:api_scope` | API endpoints and accessible data types understood |
| `recon:update_targets` | Which clients have auto-update enabled and push schedule confirmed |
| `trust:elevated` | Vendor has trusted / implicit access to client environment |
| `pivot:via_rmm` | Attacker pivoted to client using vendor RMM tool |
| `pivot:via_api` | Attacker accessed client data via trusted API integration |
| `pivot:via_update` | Trojanized update executed on client endpoints |
| `client:foothold` | Attacker has active foothold in client environment (universal — granted by all stage-3 cards) |
| `client:targeted` | Specific high-value client selected for deeper exploitation |
| `client:admin_creds` | Client admin credentials obtained |
| `exfil:staging` | Client PII being staged for exfiltration via API |
| `impact:imminent` | Pre-conditions for major impact met (universal — granted by all stage-4 cards) |

### Stage 1 — Vendor Compromise (TA0001 / T1195 / T1078)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| V1a | MSP management console accessed via credential stuffing on reused password | *(none)* | `vendor:compromised` · `vendor:msp_access` · `access:credential_stuffing` | 10 | Critical | 1 |
| V1b | MSP technician spear-phished — RAT installed on their workstation | *(none)* | `vendor:compromised` · `vendor:msp_access` · `access:phishing` | 10 | Critical | 1 |
| V1c | SaaS vendor API key exposed in a public GitHub repository | *(none)* | `vendor:compromised` · `vendor:api_access` · `access:credential_exposure` | 10 | High | 1 |
| V1d | Trojanized software update — backdoor inserted into signed patch pushed to all managed clients | *(none)* | `vendor:compromised` · `vendor:software_update` · `access:supply_chain` | 7 | Critical | 1 |

### Stage 2 — Vendor Reconnaissance (TA0007 / T1583)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| V2a | Attacker maps all client orgs in MSP console — identifies clients with admin-level RMM agents | `vendor:msp_access` | `recon:complete` · `recon:client_list` · `trust:elevated` | 10 | High | 1 |
| V2b | Attacker reviews API documentation and live traffic to understand accessible client endpoints | `vendor:api_access` | `recon:complete` · `recon:api_scope` | 10 | Medium | 1 |
| V2c | Update server analysis confirms which clients have auto-update enabled and next push schedule | `vendor:software_update` | `recon:complete` · `recon:update_targets` | 10 | High | 1 |

### Stage 3 — Client Pivot (TA0008 / T1199)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| V3a | RMM tool executes PowerShell across all managed clients — legitimate tool, no alerts triggered | `vendor:msp_access` · `recon:client_list` | `pivot:via_rmm` · `client:foothold` | 10 | Critical | 1 |
| V3b | API token used to pull live customer PII from client via existing integration | `vendor:api_access` · `recon:api_scope` | `pivot:via_api` · `client:foothold` | 10 | High | 1 |
| V3c | Trojanized update auto-installs on 23 client endpoints — backdoor active in production | `vendor:software_update` · `recon:update_targets` | `pivot:via_update` · `client:foothold` | 10 | Critical | 1 |
| V3d | Attacker selects highest-value client from MSP console and pivots via privileged RMM agent | `trust:elevated` · `recon:client_list` | `pivot:via_rmm` · `client:foothold` · `client:targeted` | 7 | Critical | 1 |

> V3a–V3c each require specific vendor access + matching recon tag. V3d requires both `trust:elevated` and `recon:client_list` — only available via V2a, enabling a targeted single-client pivot.

### Stage 4 — Client Discovery & Pre-Impact (TA0007 / TA0009)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| V4a | BloodHound-equivalent run via RMM — full AD map acquired, domain admin path confirmed | `pivot:via_rmm` | `client:admin_creds` · `impact:imminent` | 10 | Critical | 2 |
| V4b | API pivot exposes complete customer PII dataset — attacker begins staged exfiltration | `pivot:via_api` | `exfil:staging` · `impact:imminent` | 10 | High | 2 |
| V4c | Backdoor on 23 endpoints begins silent credential harvesting and lateral reconnaissance | `pivot:via_update` | `client:admin_creds` · `impact:imminent` | 10 | Critical | 2 |

> All stage-4 cards grant `impact:imminent` — universal convergence for stage 5.

### Stage 5 — Impact (terminal)

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| V5a | Ransomware deployed across client environment via RMM — all managed clients encrypted simultaneously | `impact:imminent` | *(terminal)* | 10 | Critical | 2 |
| V5b | Complete customer PII exfiltrated silently via API — discovered weeks later via dark web alert | `exfil:staging` | *(terminal)* | 10 | Critical | 2 |
| V5c | Client admin credentials sold on dark web — multiple threat actors gain independent access | `client:admin_creds` | *(terminal)* | 7 | Critical | 2 |

> V5a always available (every stage-4 card grants `impact:imminent`).
> V5b requires the API path (`exfil:staging` from V4b).
> V5c requires admin credentials — available after V4a or V4c.

---

### Vendor Compromise — example paths

#### Path 1 — MSP credential stuffing, mass RMM ransomware deploy
`V1a → V2a → V3a → V4a → V5a`

#### Path 2 — API key exposed, silent PII theft discovered on dark web
`V1c → V2b → V3b → V4b → V5b`

#### Path 3 — Trojanized update, credential harvest, dark web sale
`V1d → V2c → V3c → V4c → V5c`

---

## BCDR track

> **Status: Planned for TB12 — designed after the IR track archetypes are seeded and TB5–TB10 are built.**

**Track:** `bcdr` | **Planned stages:** 7 (Impact, Assess, Activate BCP, Failover/DR, Recover, Resume, Review)

---

*Last updated: 2026-07-02 (TB2 complete — all 4 IR archetypes designed and seeded; 73 cards total)*