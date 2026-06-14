const SB_URL = 'https://sssyimtkvmtgjpusedvq.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzc3lpbXRrdm10Z2pwdXNlZHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NzA1NTMsImV4cCI6MjA5NDU0NjU1M30.FxQaJn97YewSQi6s45nw1LgMRfBj8xhswLM47_Q2zXI';
// Service role key — loaded from js/secrets.js (gitignored).
// Fallback to empty string; auth user deletion will show a warning if not set.
const SB_SERVICE_KEY = (typeof _SB_SERVICE_KEY !== 'undefined') ? _SB_SERVICE_KEY : '';

async function sbFetch(path, method = 'GET', body = null, extraHeaders = {}) {
  // Block writes in view-as preview mode (prevent accidental data changes while impersonating)
  if (['POST','PATCH','PUT','DELETE'].includes(method) && typeof viewAsState !== 'undefined' && viewAsState) {
    throw new Error('Write operations are disabled while in View As mode — exit to make changes');
  }
  // Block write operations for view-only users (role=viewer)
  if (['POST','PATCH','PUT','DELETE'].includes(method) &&
      typeof isViewOnly === 'function' && isViewOnly()) {
    throw new Error('You have view-only access — changes are disabled for your account');
  }

  // Use the authenticated user's session token when available, fall back to anon key
  const bearerToken = (typeof authState !== 'undefined' && authState?.session?.access_token)
    ? authState.session.access_token
    : SB_KEY;
  const headers = {
    'apikey': SB_KEY,
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (method === 'POST' && !extraHeaders.Prefer) headers.Prefer = 'return=representation';
  Object.assign(headers, extraHeaders);
  let res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined
  });

  // Auto-refresh on 401 JWT expired and retry once
  if (res.status === 401 && typeof authRefreshToken === 'function' &&
      typeof authState !== 'undefined' && authState?.session?.refresh_token) {
    try {
      const now = Math.floor(Date.now() / 1000);
      const refreshed = await authRefreshToken(authState.session.refresh_token);
      authState.session = {
        access_token: refreshed.access_token,
        refresh_token: refreshed.refresh_token,
        expires_at: now + (refreshed.expires_in || 3600),
      };
      if (typeof authSaveSession === 'function') authSaveSession(authState.session, authState.user);
      // Retry with new token
      headers['Authorization'] = `Bearer ${refreshed.access_token}`;
      res = await fetch(`${SB_URL}/rest/v1/${path}`, {
        method, headers,
        body: body ? JSON.stringify(body) : undefined
      });
    } catch {
      if (typeof authSignOut === 'function') authSignOut();
      throw new Error('Session expired — please sign in again');
    }
  }

  if (!res.ok) { const t = await res.text(); throw new Error(`${res.status}: ${t}`); }
  if (res.status === 204) return null;
  return res.json();
}

const sb = {
  orgs: () => sbFetch('organisations?select=*&order=tier.asc,name.asc'),
  assessments: (orgId) => sbFetch(`assessments?org_id=eq.${orgId}&order=assessed_at.asc`),
  saveAssessment: (d) => sbFetch('assessments', 'POST', d),
  createOrg: (d) => sbFetch('organisations', 'POST', d),
  updateOrg: (id, patch) => sbFetch(`organisations?id=eq.${id}`, 'PATCH', patch, { Prefer: 'return=representation' }),
  deleteOrg: (id) => sbFetch(`organisations?id=eq.${id}`, 'DELETE', null, { Prefer: 'return=representation' }),
  deleteAssessment: (id) => sbFetch(`assessments?id=eq.${id}`, 'DELETE'),
  updateAssessment: (id, patch) => sbFetch(`assessments?id=eq.${id}`, 'PATCH', patch, { Prefer: 'return=representation' }),
};

// Organisation Profiles persistence layer
sb.profiles = {
  getAll: () => sbFetch('organisation_profiles?select=*'),
  get: (orgId) => sbFetch(`organisation_profiles?org_id=eq.${orgId}&select=*`),
  upsert: (row) => sbFetch('organisation_profiles', 'POST', row, { Prefer: 'resolution=merge-duplicates,return=representation' }),
};

// Technology Stack Survey persistence layer
sb.techstack = {
  getResponses: (orgId) => sbFetch(`techstack_responses?org_id=eq.${orgId}&select=*`),
  upsertResponse: (row) => sbFetch('techstack_responses', 'POST', row, { Prefer: 'resolution=merge-duplicates,return=representation' }),
  // Snapshot to assessments table for trend tracking (same pattern as insurance module)
  saveSnapshot: (d) => sbFetch('assessments', 'POST', d),
};

// Third-Party Risk Assessment persistence layer
sb.tpra = {
  getAll: (orgId) => sbFetch(`vendor_assessments?org_id=eq.${orgId}&order=created_at.desc`),
  upsert: (row) => sbFetch('vendor_assessments', 'POST', row, { Prefer: 'resolution=merge-duplicates,return=representation' }),
  update: (id, patch) => sbFetch(`vendor_assessments?id=eq.${id}`, 'PATCH', patch, { Prefer: 'return=representation' }),
  delete: (id) => sbFetch(`vendor_assessments?id=eq.${id}`, 'DELETE'),
};

// CIS POAM persistence layer (PATCH_008)
sb.cisPoam = {
  getForAssessment: (assessmentId) => sbFetch(`cis_poam_items?assessment_id=eq.${assessmentId}&select=*`),
  upsertAll: (rows) => sbFetch('cis_poam_items', 'POST', rows, { Prefer: 'resolution=merge-duplicates,return=representation' }),
  deleteAllForAssessment: (assessmentId) => sbFetch(`cis_poam_items?assessment_id=eq.${assessmentId}`, 'DELETE'),
};

// Framework Notes persistence layer (PATCH_010) — generic, reusable across AI frameworks
sb.frameworkNotes = {
  get: (orgId, module) => sbFetch(`framework_notes?org_id=eq.${orgId}&module=eq.${module}&select=*`),
  upsert: (rows) => sbFetch('framework_notes', 'POST', rows, { Prefer: 'resolution=merge-duplicates,return=representation' }),
};

// CIS Safeguard Notes persistence layer (PATCH_007)
sb.cisNotes = {
  getForAssessment: (assessmentId) => sbFetch(`cis_safeguard_notes?assessment_id=eq.${assessmentId}&select=*`),
  upsertAll: (rows) => sbFetch('cis_safeguard_notes', 'POST', rows, { Prefer: 'resolution=merge-duplicates,return=representation' }),
  deleteAllForAssessment: (assessmentId) => sbFetch(`cis_safeguard_notes?assessment_id=eq.${assessmentId}`, 'DELETE'),
};

// User management persistence layer
sb.users = {
  getAll: () => sbFetch('users?select=*&order=name.asc'),
  getByOrg: (orgId) => sbFetch(`users?org_id=eq.${orgId}&select=*&order=name.asc`),
  create: (row) => sbFetch('users', 'POST', row),
  update: (id, patch) => sbFetch(`users?id=eq.${id}`, 'PATCH', patch, { Prefer: 'return=representation' }),
  delete: (id) => sbFetch(`users?id=eq.${id}`, 'DELETE'),
};

// Platform Settings persistence layer (PATCH_013)
sb.settings = {
  get:  ()      => sbFetch('platform_settings?singleton=eq.true&select=*'),
  save: (patch) => sbFetch('platform_settings?singleton=eq.true', 'PATCH', patch, { Prefer: 'return=representation' }),
};

// Audit Log persistence layer (PATCH_011)
sb.auditLog = {
  insert: (row) => sbFetch('audit_log', 'POST', row, { Prefer: 'return=minimal' }),
  getRecent: (days, orgIds) => {
    const since = new Date(Date.now() - days * 86400000).toISOString();
    let q = `audit_log?created_at=gte.${encodeURIComponent(since)}&order=created_at.desc&limit=500`;
    if (orgIds && orgIds.length) q += `&org_id=in.(${orgIds.join(',')})`;
    return sbFetch(q);
  },
};

// Fire-and-forget audit log writer. Never throws, never blocks the calling action.
function auditLog(eventType, targetType, targetName, details) {
  try {
    const actor = (typeof authState !== 'undefined') ? authState.user : null;
    const org   = (typeof currentOrg !== 'undefined') ? currentOrg : null;
    sb.auditLog.insert({
      org_id:      org?.id   || null,
      actor_name:  actor?.user_metadata?.name || actor?.email || 'Unknown',
      actor_email: actor?.email || null,
      event_type:  eventType,
      target_type: targetType,
      target_name: targetName || null,
      details:     details || null,
    }).catch(() => {});
  } catch (_) {}
}

// User org access — explicit org assignments for analyst/viewer roles
sb.userOrgAccess = {
  getForUser: (userId) => sbFetch(`user_org_access?user_id=eq.${userId}&select=*`),
  upsertAll: (rows) => sbFetch('user_org_access', 'POST', rows, { Prefer: 'resolution=merge-duplicates,return=representation' }),
  deleteForUser: (userId) => sbFetch(`user_org_access?user_id=eq.${userId}`, 'DELETE'),
};

// Tabletop persistence layer — wraps Supabase calls for the operational tabletop module.
sb.tt = {
  // RPC: ask the DB for a fresh 6-char session code (alphabet defined in SUPABASE_SCHEMA.sql)
  newCode: async () => {
    const r = await sbFetch('rpc/generate_session_code', 'POST', {});
    return typeof r === 'string' ? r : (r && r[0]) || '';
  },
  createSession: async (row) => {
    const r = await sbFetch('tabletop_sessions', 'POST', row);
    return Array.isArray(r) ? r[0] : r;
  },
  updateSession: (id, patch) => sbFetch(`tabletop_sessions?id=eq.${id}`, 'PATCH', patch, { Prefer: 'return=representation' }),
  getSession: async (id) => {
    const r = await sbFetch(`tabletop_sessions?id=eq.${id}&select=*`);
    return r && r[0];
  },
  upsertResponse: (row) => sbFetch('tabletop_responses', 'POST', row, { Prefer: 'resolution=merge-duplicates,return=representation' }),
  upsertNotif: (row) => sbFetch('tabletop_notif_checks', 'POST', row, { Prefer: 'resolution=merge-duplicates,return=representation' }),
  appendLog: (sessionId, exerciseLog) => sbFetch(`tabletop_sessions?id=eq.${sessionId}`, 'PATCH', { exercise_log: exerciseLog, updated_at: new Date().toISOString() }, { Prefer: 'return=representation' }),
  // Multiplayer methods
  getSessionByCode: async (code) => {
    const r = await sbFetch(`tabletop_sessions?session_code=eq.${encodeURIComponent(code)}&select=*`);
    return r && r[0] ? r[0] : null;
  },
  getParticipants: async (sessionId) => {
    const r = await sbFetch(`tabletop_participants?session_id=eq.${sessionId}&select=*&order=joined_at.asc`);
    return r || [];
  },
  claimRole: async (row) => {
    const r = await sbFetch('tabletop_participants', 'POST', row, { Prefer: 'return=representation' });
    return Array.isArray(r) ? r[0] : r;
  },
  getResponses: async (sessionId, injectIdx) => {
    const r = await sbFetch(`tabletop_responses?session_id=eq.${sessionId}&inject_index=eq.${injectIdx}&select=*`);
    return r || [];
  },
};
