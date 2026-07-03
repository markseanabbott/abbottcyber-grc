# Archetype: BEC (Business Email Compromise)

> See [../FLOWMAP_INDEX.md](../FLOWMAP_INDEX.md) for engine rules, NIST phase key, role key, and canonical phase mapping.
> **Card grids below are generated from `tt_inject_cards` — do not edit them by hand. Run `node tabletop/generate_grids.mjs` to refresh.**

**Track:** IR | **Stages:** 5 | **Cards:** 16 | **Roles:** IC / TL / CL / LC / ES

---

## Stage skeleton

| Stage | Label | ATT&CK | NIST phase |
|-------|-------|--------|------------|
| 1 | Initial Access / Infiltration | TA0001 / TA0043 | Detect/Analyze |
| 2 | Reconnaissance | TA0007 / T1114 | Detect/Analyze |
| 3 | Account Position / Impersonation | TA0043 / T1078 | Contain |
| 4 | Fraud Execution | TA0043 / T1566.002 | Contain |
| 5 | Financial Impact (terminal) | — | Eradicate |

---

## Card grids

<!-- AUTOGEN:cardgrid:bec START -->

**Stage 1 — Initial Access / Infiltration · Detect/Analyze**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| B1a | IT help-desk spear phish harvests executive O365 credentials | *(none)* | `access:phishing` · `email:account_compromised` | 10 | High | 1 |
| B1b | Attacker registers typosquat domain - one character off from client domain | *(none)* | `access:lookalike` · `email:lookalike_active` | 10 | Medium | 1 |
| B1c | Finance team password found in credential database from prior breach | *(none)* | `access:credential_stuffing` · `email:account_compromised` | 7 | High | 1 |

**Stage 2 — Reconnaissance · Detect/Analyze**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| B2a | Hidden inbox rules set - attacker monitors payment approvals in real time | `email:account_compromised` | `recon:complete` · `recon:inbox_monitored` | 10 | High | 1 |
| B2b | OSINT sweep reveals CFO name, approval thresholds, and active vendor relationships | `access:lookalike` | `recon:complete` · `recon:osint_only` | 10 | Medium | 1 |
| B2c | Attacker reads live payment threads - vendor relationships and pending invoices catalogued | `email:account_compromised` | `recon:complete` · `recon:thread_harvested` · `vendor:identified` | 10 | High | 1 |

**Stage 3 — Account Position / Impersonation · Contain**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| B3a | Attacker poses as CEO - targets CFO with confidential wire framing | `recon:complete` | `trust:established` · `exec:impersonated` | 10 | High | 2 |
| B3b | Attacker impersonates vendor - sends updated banking details from lookalike address | `recon:complete` | `trust:established` · `vendor:impersonated` | 10 | High | 2 |
| B3c | Thread hijack - attacker replies inline to active payment thread from compromised account | `recon:thread_harvested` | `trust:established` · `thread:hijacked` · `exec:impersonated` | 10 | Critical | 2 |

**Stage 4 — Fraud Execution · Contain**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| B4a | Urgent same-day wire request - CEO cites confidential acquisition, instructs CFO not to call | `exec:impersonated` | `urgency:applied` · `wire:requested` · `fraud:submitted` | 10 | Critical | 2 |
| B4b | Invoice arrives with updated ACH / wire details - existing vendor relationship exploited | `vendor:impersonated` | `invoice:substituted` · `wire:requested` · `fraud:submitted` | 10 | High | 2 |
| B4c | Payroll diversion - attacker impersonates employee and submits direct-deposit change to HR | `trust:established` | `payroll:diverted` · `fraud:submitted` | 7 | High | 2 |
| B4d | Thread hijack wire request - real payment thread continued with changed banking details | `thread:hijacked` | `urgency:applied` · `wire:requested` · `fraud:submitted` | 10 | Critical | 2 |

**Stage 5 — Financial Impact (terminal) · Eradicate**

| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |
|------|-------|----------|--------|--------|-------------|------------|
| B5a | Wire transfer authorized and processed - funds reach mule account within 90 minutes | `fraud:submitted` | *(terminal)* | 10 | Critical | 3 |
| B5b | Attacker calls back posing as bank to verify the transfer - cancellation window closes | `urgency:applied` | *(terminal)* | 10 | Critical | 3 |
| B5c | Payroll diversion runs silently for three pay cycles before discovered on reconciliation | `payroll:diverted` | *(terminal)* | 7 | High | 3 |
<!-- AUTOGEN:cardgrid:bec END -->

---

## Example paths

**Path 1 — Phishing, exec impersonation, double-tap** `B1a → B2a → B3a → B4a → B5b`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | B1a Spear phish harvests exec credentials | `access:phishing`, `email:account_compromised` |
| 2 | B2a Inbox rules set — payment monitoring | `recon:complete`, `recon:inbox_monitored` |
| 3 | B3a CEO impersonation, CFO targeted | `trust:established`, `exec:impersonated` |
| 4 | B4a Same-day wire — "don't call" instruction | `urgency:applied`, `wire:requested`, `fraud:submitted` |
| 5 | B5b Attacker calls back as bank, closes window | *(terminal)* |

Narrative: Executive account taken via spear phish. Attacker monitors email for 4 days, then sends a same-day wire request as the CEO. Finance calls the bank to reverse — attacker calls first posing as the bank and closes the window.

Key discussion: What is your call-back verification procedure for wire requests? Does "the CEO said not to call" override your controls? Who has authority to instruct a reversal request?

---

**Path 2 — Lookalike domain, vendor invoice fraud** `B1b → B2b → B3b → B4b → B5a`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | B1b Typosquat domain registered | `access:lookalike`, `email:lookalike_active` |
| 2 | B2b OSINT sweep — CFO and thresholds identified | `recon:complete`, `recon:osint_only` |
| 3 | B3b Vendor impersonation, updated banking details | `trust:established`, `vendor:impersonated` |
| 4 | B4b Invoice with new ACH details processed | `invoice:substituted`, `wire:requested`, `fraud:submitted` |
| 5 | B5a Wire processed — funds in mule account | *(terminal)* |

Narrative: Attacker registers a one-character typosquat and does full OSINT. Sends an updated-banking-details invoice for an active vendor relationship. Wire processed — no real account was ever compromised.

Key discussion: How do you verify changed payment details? What is your vendor payment verification procedure? Does accounts payable call back on a known number before processing banking changes?

---

**Path 3 — Thread hijack, inline wire** `B1a → B2c → B3c → B4d → B5b`

| Stage | Card | Tag state after |
|-------|------|-----------------|
| 1 | B1a Spear phish harvests exec credentials | `access:phishing`, `email:account_compromised` |
| 2 | B2c Live payment threads read — vendor catalogued | `recon:complete`, `recon:thread_harvested`, `vendor:identified` |
| 3 | B3c Thread hijack — attacker replies inline | `trust:established`, `thread:hijacked`, `exec:impersonated` |
| 4 | B4d Thread hijack wire with changed banking | `urgency:applied`, `wire:requested`, `fraud:submitted` |
| 5 | B5b Follow-up call closes cancellation window | *(terminal)* |

Narrative: Phishing gets the account. Attacker reads a live payment thread, waits for the right moment, then replies inline as if continuing a real conversation. Wire goes through; follow-up call closes cancellation window. Most convincing BEC vector — no new thread started.

Key discussion: Would your finance team recognize that the reply domain changed? Do you have email authentication (DMARC, DKIM) that would flag a reply from a different domain?

---

*Card grids generated from `tt_inject_cards` via `tabletop/generate_grids.mjs`. Run the script to refresh after any DB change.*
