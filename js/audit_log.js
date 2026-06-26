'use strict';

// ============================================================
// AUDIT LOG VIEWER — Platform admin only
// Reads from audit_log table (written by auditLog() throughout the app).
// Login events captured since auth.js was wired (after first deployment).
// ============================================================

let alState = {
  items:       [],
  loading:     false,
  days:        30,
  eventFilter: 'all',
  actorFilter: '',
  expanded:    {},
};

const AL_EVENT_STYLES = {
  login:    { color: '#15803d', bg: '#dcfce7', label: 'Login'    },
  logout:   { color: '#6b7280', bg: '#f3f4f6', label: 'Logout'   },
  save:     { color: '#1d4ed8', bg: '#dbeafe', label: 'Save'     },
  create:   { color: '#1d4ed8', bg: '#dbeafe', label: 'Create'   },
  update:   { color: '#1d4ed8', bg: '#dbeafe', label: 'Update'   },
  delete:   { color: '#dc2626', bg: '#fee2e2', label: 'Delete'   },
  revoke:   { color: '#dc2626', bg: '#fee2e2', label: 'Revoke'   },
  export:   { color: '#7c3aed', bg: '#ede9fe', label: 'Export'   },
  download: { color: '#7c3aed', bg: '#ede9fe', label: 'Download' },
  approve:  { color: '#059669', bg: '#d1fae5', label: 'Approve'  },
  reject:   { color: '#b45309', bg: '#fef3c7', label: 'Reject'   },
};

function _alEventStyle(eventType) {
  const key = (eventType || '').toLowerCase().split('_')[0];
  return AL_EVENT_STYLES[key] || { color: 'var(--muted)', bg: '#f0f4fa', label: eventType || '—' };
}

function _alOrgName(orgId) {
  if (!orgId) return '—';
  const org = (typeof orgList !== 'undefined' ? orgList : []).find(o => o.id === orgId);
  return org?.name || orgId.slice(0, 8) + '…';
}

// ============================================================
// LOAD
// ============================================================
async function alLoad() {
  alState.loading = true;
  const wrap = document.getElementById('alTableWrap');
  if (wrap) wrap.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--muted)">
    <div class="spinner" style="margin:0 auto 1rem;width:22px;height:22px;border-color:rgba(21,33,104,.15);border-top-color:var(--navy)"></div>
    <div style="font-size:12px">Loading…</div>
  </div>`;
  try {
    const days = alState.days === 'all' ? 3650 : parseInt(alState.days);
    const rows = await sb.auditLog.getRecent(days, null);
    alState.items = Array.isArray(rows) ? rows : [];
  } catch(e) {
    alState.items = [];
    toast('Failed to load audit log: ' + e.message, '#dc2626');
  }
  alState.loading = false;
  const w2 = document.getElementById('alTableWrap');
  if (w2) w2.innerHTML = alRenderTable();
  const stats = document.getElementById('alStats');
  if (stats) stats.innerHTML = alRenderStats();
}

// ============================================================
// RENDER — MAIN
// ============================================================
function renderAuditLog() {
  if (!isPlatformAdmin()) {
    return `<div class="card" style="padding:2rem;text-align:center;color:var(--muted)">
      <div style="font-size:2rem;margin-bottom:.5rem">🔒</div>
      <div style="font-weight:700;color:var(--text)">Platform Admins Only</div>
    </div>`;
  }

  const dayOpts = [
    { val: 7,     label: 'Last 7 days'  },
    { val: 30,    label: 'Last 30 days' },
    { val: 90,    label: 'Last 90 days' },
    { val: 'all', label: 'All time'     },
  ];

  const eventTypes = ['all','login','save','update','create','delete','export','revoke','approve','reject'];

  return `
    <div style="max-width:1100px;margin:0 auto">

      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.1rem;flex-wrap:wrap">
        <div>
          <h2 style="margin:0;font-size:20px;font-weight:800;color:var(--navy)">🔍 Audit Log</h2>
          <div style="font-size:12px;color:var(--muted);margin-top:2px">Platform-wide activity — logins, saves, deletes, exports</div>
        </div>
        <button class="btn btn-outline btn-sm" style="margin-left:auto" onclick="alRefresh()">↺ Refresh</button>
      </div>

      <div id="alStats" style="margin-bottom:1rem">${alRenderStats()}</div>

      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:.65rem 1rem;align-items:center">
        <select onchange="alSetFilter('eventFilter',this.value)"
          style="font-size:12px;border:1px solid var(--border);border-radius:6px;padding:5px 8px;background:#fff;color:var(--text)">
          ${eventTypes.map(t => `<option value="${t}" ${alState.eventFilter===t?'selected':''}>${t==='all'?'All Events':t.charAt(0).toUpperCase()+t.slice(1)}</option>`).join('')}
        </select>
        <select onchange="alSetFilter('days',this.value)"
          style="font-size:12px;border:1px solid var(--border);border-radius:6px;padding:5px 8px;background:#fff;color:var(--text)">
          ${dayOpts.map(d => `<option value="${d.val}" ${String(alState.days)===String(d.val)?'selected':''}>${d.label}</option>`).join('')}
        </select>
        <input type="text" placeholder="Filter by actor email…" value="${escH(alState.actorFilter)}"
          oninput="alSetFilter('actorFilter',this.value)"
          style="font-size:12px;border:1px solid var(--border);border-radius:6px;padding:5px 8px;flex:1;min-width:160px;color:var(--text)">
        ${alState.eventFilter!=='all'||alState.actorFilter
          ? `<button class="btn btn-outline btn-sm" onclick="alResetFilters()">✕ Reset</button>`
          : ''}
      </div>

      <div id="alTableWrap" class="card" style="padding:0;overflow:hidden;overflow-x:auto">${alRenderTable()}</div>
    </div>`;
}

function alRenderStats() {
  const items = alState.items;
  if (!items.length) return '';
  const logins  = items.filter(i => (i.event_type||'').toLowerCase() === 'login').length;
  const actors  = new Set(items.map(i => i.actor_email).filter(Boolean)).size;
  const deletes = items.filter(i => (i.event_type||'').toLowerCase().startsWith('delete')).length;
  return `<div style="display:flex;gap:.75rem;flex-wrap:wrap">
    ${[
      { val: items.length, label: 'Total Events',  col: 'var(--navy)'  },
      { val: logins,       label: 'Logins',        col: '#15803d'       },
      { val: actors,       label: 'Unique Actors', col: '#7c3aed'       },
      { val: deletes,      label: 'Deletes',       col: '#dc2626'       },
    ].map(s => `<div style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:.6rem 1rem;min-width:100px;box-shadow:0 1px 3px rgba(21,33,104,.05)">
      <div style="font-size:22px;font-weight:800;color:${s.col}">${s.val}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:1px">${s.label}</div>
    </div>`).join('')}
  </div>`;
}

function alRenderTable() {
  if (!alState.items.length) {
    return `<div style="padding:3rem;text-align:center;color:var(--muted)">
      <div style="font-size:32px;margin-bottom:.75rem">📋</div>
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px">No events yet</div>
      <div style="font-size:12px">Events will appear here as activity occurs across the platform.</div>
    </div>`;
  }

  const filtered = alState.items.filter(item => {
    if (alState.eventFilter !== 'all') {
      if (!(item.event_type||'').toLowerCase().includes(alState.eventFilter)) return false;
    }
    if (alState.actorFilter) {
      const af = alState.actorFilter.toLowerCase();
      if (!(item.actor_email||'').toLowerCase().includes(af) &&
          !(item.actor_name||'').toLowerCase().includes(af)) return false;
    }
    return true;
  });

  if (!filtered.length) {
    return `<div style="padding:2rem;text-align:center;color:var(--muted);font-size:13px">No events match the current filters.</div>`;
  }

  let lastDay = null;
  const rows = filtered.map(item => {
    const dt     = new Date(item.created_at);
    const day    = dt.toLocaleDateString('en-CA');
    const time   = dt.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false });
    const dayStr = dt.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const es     = _alEventStyle(item.event_type);
    const isNew  = day !== lastDay;
    lastDay = day;

    const detailRaw = item.details;
    const detailStr = detailRaw
      ? (typeof detailRaw === 'string' ? detailRaw : JSON.stringify(detailRaw, null, 2))
      : '';
    const isExpanded = !!alState.expanded[item.id];

    const daySep = isNew
      ? `<tr><td colspan="6" style="padding:6px 12px 4px;background:var(--bg);border-top:1px solid var(--border);font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.08em">${dayStr}</td></tr>`
      : '';

    return daySep + `
      <tr style="border-bottom:1px solid var(--border);${detailStr?'cursor:pointer':''}"
        ${detailStr?`onclick="alToggleExpand('${item.id}')" title="${isExpanded?'Collapse':'Expand'} details"`:''}
        onmouseover="this.style.background='#fafbfe'" onmouseout="this.style.background=''">
        <td style="padding:7px 10px;font-size:11px;color:var(--muted);white-space:nowrap;vertical-align:top">${time}</td>
        <td style="padding:7px 10px;vertical-align:top">
          <div style="font-size:12px;font-weight:700;color:var(--text)">${escH(item.actor_name||'—')}</div>
          <div style="font-size:10px;color:var(--muted)">${escH(item.actor_email||'')}</div>
        </td>
        <td style="padding:7px 10px;font-size:11px;color:var(--muted);vertical-align:top;white-space:nowrap">${escH(_alOrgName(item.org_id))}</td>
        <td style="padding:7px 10px;vertical-align:top;white-space:nowrap">
          <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;background:${es.bg};color:${es.color}">${escH(es.label)}</span>
        </td>
        <td style="padding:7px 10px;vertical-align:top">
          <div style="font-size:12px;font-weight:600;color:var(--text)">${escH(item.target_type||'—')}</div>
          <div style="font-size:11px;color:var(--muted)">${escH(item.target_name||'')}</div>
        </td>
        <td style="padding:7px 10px;vertical-align:top;max-width:240px">
          ${detailStr && isExpanded
            ? `<pre style="font-size:10px;color:var(--muted);white-space:pre-wrap;word-break:break-word;margin:0;background:var(--bg);border-radius:4px;padding:4px 6px;max-height:120px;overflow-y:auto">${escH(detailStr)}</pre>`
            : detailStr
            ? `<span style="font-size:10px;color:var(--muted);font-style:italic">▶ expand</span>`
            : ''}
        </td>
      </tr>`;
  }).join('');

  return `<table style="width:100%;border-collapse:collapse;font-size:12px;min-width:680px">
    <thead><tr style="background:var(--bg);border-bottom:2px solid var(--border)">
      <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;white-space:nowrap">Time</th>
      <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase">Actor</th>
      <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase">Org</th>
      <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase">Event</th>
      <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase">Target</th>
      <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase">Details</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

// ============================================================
// INTERACTIONS
// ============================================================
function alSetFilter(key, val) {
  alState[key] = val;
  if (key === 'days') {
    alLoad();
  } else {
    const wrap = document.getElementById('alTableWrap');
    if (wrap) wrap.innerHTML = alRenderTable();
  }
}

function alResetFilters() {
  alState.eventFilter = 'all';
  alState.actorFilter = '';
  const mc = document.getElementById('mainContent');
  if (mc && activeNav === 'audit_log') mc.innerHTML = renderAuditLog();
}

function alRefresh() { alLoad(); }

function alToggleExpand(id) {
  alState.expanded[id] = !alState.expanded[id];
  const wrap = document.getElementById('alTableWrap');
  if (wrap) wrap.innerHTML = alRenderTable();
}

// ============================================================
// WINDOW EXPORTS
// ============================================================
window.renderAuditLog = renderAuditLog;
window.alLoad         = alLoad;
window.alSetFilter    = alSetFilter;
window.alResetFilters = alResetFilters;
window.alRefresh      = alRefresh;
window.alToggleExpand = alToggleExpand;
