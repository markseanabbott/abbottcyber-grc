#!/usr/bin/env node
// tabletop/generate_grids.mjs
// Regenerates AUTOGEN blocks in storyboard files and FLOWMAP_INDEX.md from tt_inject_cards.
// Validates nist_phase_idx against CANONICAL before writing anything.
// A mismatch exits with an error listing every divergent card.
//
// Usage: node tabletop/generate_grids.mjs
// Requires Node 18+ (built-in fetch). Reads SUPABASE_URL and SUPABASE_ANON_KEY from .env.

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = resolve(__dir, '..');

// ── .env loader ────────────────────────────────────────────────────────────
function loadEnv() {
  const env = {};
  try {
    const text = readFileSync(resolve(ROOT, '.env'), 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
      if (m) env[m[1].trim()] = m[2].trim();
    }
  } catch {
    console.error('ERROR: could not read .env from repo root');
    process.exit(1);
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    console.error('ERROR: .env must contain SUPABASE_URL and SUPABASE_ANON_KEY');
    process.exit(1);
  }
  return env;
}

// ── Canonical NIST phase mapping ───────────────────────────────────────────
// CANONICAL is the single authoritative source. FLOWMAP_INDEX.md derives its
// mapping table from this object via the AUTOGEN:nistmapping block.
// Structure: archetype → stage (1-based) → nist_phase_idx
const CANONICAL = {
  ransomware:        { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3 },
  bec:               { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3 },
  insider:           { 1: 1, 2: 1, 3: 2, 4: 3, 5: 3 },
  vendor_compromise: { 1: 1, 2: 1, 3: 2, 4: 3, 5: 3 },
};

const NIST_LABELS = { 1: 'Detect/Analyze', 2: 'Contain', 3: 'Eradicate' };

// Fallback stage labels — used only when stage_label is null in the DB
const STAGE_LABELS = {
  ransomware: {
    1: 'Initial Access',
    2: 'Execution & C2',
    3: 'Credential Access',
    4: 'Privilege Escalation & Lateral Movement',
    5: 'Pre-Impact',
    6: 'Impact (terminal)',
  },
  bec: {
    1: 'Initial Access / Infiltration',
    2: 'Reconnaissance',
    3: 'Account Position / Impersonation',
    4: 'Fraud Execution',
    5: 'Financial Impact (terminal)',
  },
  insider: {
    1: 'Initial Act / Motivation',
    2: 'Reconnaissance & Data Mapping',
    3: 'Data Staging',
    4: 'Exfiltration',
    5: 'Impact (terminal)',
  },
  vendor_compromise: {
    1: 'Vendor Compromise',
    2: 'Vendor Reconnaissance',
    3: 'Client Pivot',
    4: 'Client Discovery & Pre-Impact',
    5: 'Impact (terminal)',
  },
};

// Storyboard file paths for each archetype (file names are short; DB archetype IDs are the keys)
const STORYBOARD_FILES = {
  ransomware:        resolve(__dir, 'storyboard', 'ransomware.md'),
  bec:               resolve(__dir, 'storyboard', 'bec.md'),
  insider:           resolve(__dir, 'storyboard', 'insider.md'),
  vendor_compromise: resolve(__dir, 'storyboard', 'vendor.md'),
};

const INDEX_FILE = resolve(__dir, 'FLOWMAP_INDEX.md');

// ── Supabase fetch ──────────────────────────────────────────────────────────
const FETCH_LIMIT = 500;

async function fetchCards(url, key) {
  const res = await fetch(
    `${url}/rest/v1/tt_inject_cards?select=*&order=archetype,chain_stage,id&limit=${FETCH_LIMIT}`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) {
    const body = await res.text();
    console.error(`ERROR: Supabase returned ${res.status}: ${body}`);
    process.exit(1);
  }
  const cards = await res.json();
  if (cards.length >= FETCH_LIMIT) {
    console.warn(`  WARN: fetch returned ${cards.length} rows (= limit). Results may be truncated — increase FETCH_LIMIT or paginate.`);
  }
  return cards;
}

// ── Tag renderers ─────────────────────────────────────────────────────────
function renderRequires(arr) {
  if (!arr || arr.length === 0) return '*(none)*';
  return arr.map(t => `\`${t}\``).join(' · ');
}

function renderGrants(arr) {
  if (!arr || arr.length === 0) return '*(terminal)*';
  return arr.map(t => `\`${t}\``).join(' · ');
}

// ── AUTOGEN block replacer ─────────────────────────────────────────────────
function replaceBlock(fileContent, blockName, content) {
  const startMarker = `<!-- AUTOGEN:${blockName} START -->`;
  const endMarker   = `<!-- AUTOGEN:${blockName} END -->`;

  const startIdx = fileContent.indexOf(startMarker);
  const endIdx   = fileContent.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.warn(`  WARN: AUTOGEN markers for "${blockName}" not found — skipping`);
    return fileContent;
  }

  return (
    fileContent.slice(0, startIdx + startMarker.length) +
    '\n' + content +
    fileContent.slice(endIdx)
  );
}

// ── NIST mapping table builder ─────────────────────────────────────────────
// Derives the canonical mapping table from the CANONICAL object.
function buildNistMappingTable() {
  const archetypes = Object.keys(CANONICAL);
  const maxStage   = Math.max(...archetypes.map(a => Math.max(...Object.keys(CANONICAL[a]).map(Number))));
  const stageCols  = Array.from({ length: maxStage }, (_, i) => `S${i + 1}`);

  const header = `| Archetype (DB id) | ${stageCols.join(' | ')} |`;
  const sep    = `|-------------------|${stageCols.map(() => '----').join('|')}|`;

  const rows = archetypes.map(arch => {
    const cells = Array.from({ length: maxStage }, (_, i) => {
      const val = CANONICAL[arch][i + 1];
      return val !== undefined ? String(val) : '—';
    });
    return `| \`${arch}\` | ${cells.join(' | ')} |`;
  });

  return [
    '',
    header,
    sep,
    ...rows,
    '',
    'Phase key: **1** = Detect/Analyze · **2** = Contain · **3** = Eradicate',
    '',
  ].join('\n');
}

// ── Card grid builder ───────────────────────────────────────────────────────
function buildGrid(archetype, cards) {
  const canon  = CANONICAL[archetype];
  const stages = Object.keys(canon).map(Number).sort((a, b) => a - b);
  const lines  = [''];

  for (const stage of stages) {
    const nistPhase  = canon[stage];
    const nistLabel  = NIST_LABELS[nistPhase];
    const stageCards = cards.filter(c => c.chain_stage === stage);
    // Prefer stage_label from DB; fall back to hardcoded STAGE_LABELS
    const stageLabel = stageCards[0]?.stage_label ?? STAGE_LABELS[archetype]?.[stage] ?? `Stage ${stage}`;

    lines.push(`**Stage ${stage} — ${stageLabel} · ${nistLabel}**`);
    lines.push('');
    lines.push('| Card | Title | Requires | Grants | Weight | Criticality | NIST phase |');
    lines.push('|------|-------|----------|--------|--------|-------------|------------|');

    if (stageCards.length === 0) {
      lines.push('| — | *(no cards at this stage)* | | | | | |');
    } else {
      for (const c of stageCards) {
        const req = renderRequires(c.requires);
        const grt = renderGrants(c.grants);
        lines.push(`| ${c.id} | ${c.title} | ${req} | ${grt} | ${c.weight ?? 10} | ${c.correct_criticality ?? '—'} | ${c.nist_phase_idx} |`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const env = loadEnv();
  console.log('Fetching cards from Supabase...');
  const allCards = await fetchCards(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  console.log(`  ${allCards.length} card(s) returned`);

  // Validate nist_phase_idx against canonical mapping
  const mismatches = [];
  for (const card of allCards) {
    const arch  = card.archetype;
    const stage = card.chain_stage;
    const canon = CANONICAL[arch];
    if (!canon) continue;
    const expected = canon[stage];
    if (expected !== undefined && card.nist_phase_idx !== expected) {
      mismatches.push(
        `  ${card.id} (${arch} S${stage}): DB nist_phase_idx=${card.nist_phase_idx}, canonical expects ${expected}`
      );
    }
  }

  if (mismatches.length > 0) {
    console.error('\nERROR: nist_phase_idx mismatch — fix the DB first, then re-run.\n');
    console.error('Divergent cards:');
    for (const m of mismatches) console.error(m);
    process.exit(1);
  }
  console.log('  Phase validation passed.\n');

  // Update FLOWMAP_INDEX.md — canonical mapping table
  const indexContent = readFileSync(INDEX_FILE, 'utf8');
  const updatedIndex = replaceBlock(indexContent, 'nistmapping', buildNistMappingTable());
  if (updatedIndex === indexContent) {
    console.log('  FLOWMAP_INDEX.md: no change');
  } else {
    writeFileSync(INDEX_FILE, updatedIndex, 'utf8');
    console.log('  FLOWMAP_INDEX.md: updated');
  }

  // Write each archetype storyboard
  for (const [archetype, filePath] of Object.entries(STORYBOARD_FILES)) {
    const cards = allCards.filter(c => c.archetype === archetype);
    if (cards.length === 0) {
      console.log(`  ${archetype}: no cards in DB — skipping`);
      continue;
    }

    let fileContent;
    try {
      fileContent = readFileSync(filePath, 'utf8');
    } catch {
      console.warn(`  WARN: ${filePath} not found — skipping`);
      continue;
    }

    const grid    = buildGrid(archetype, cards);
    const updated = replaceBlock(fileContent, `cardgrid:${archetype}`, grid);

    if (updated === fileContent) {
      console.log(`  ${archetype}: no change (${cards.length} cards)`);
    } else {
      writeFileSync(filePath, updated, 'utf8');
      const stageCount = Object.keys(CANONICAL[archetype]).length;
      console.log(`  ${archetype}: updated (${cards.length} cards · ${stageCount} stages)`);
    }
  }

  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
