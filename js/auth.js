// ============================================================
// AUTH STATE
// ============================================================
const SB_AUTH_KEY = 'ac_auth_v1';

let authState = {
  user: null,        // Supabase auth user { id, email }
  session: null,     // { access_token, refresh_token, expires_at }
  profile: null,     // users table row
  accessOrgs: [],    // org IDs for analyst / viewer explicit access
};

// ============================================================
// SESSION STORAGE
// ============================================================
function authSaveSession(session, user) {
  try { sessionStorage.setItem(SB_AUTH_KEY, JSON.stringify({ session, user })); } catch {}
}
function authLoadStoredSession() {
  try { const r = sessionStorage.getItem(SB_AUTH_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function authClearSession() {
  try { sessionStorage.removeItem(SB_AUTH_KEY); } catch {}
}

// ============================================================
// AUTH API CALLS
// ============================================================
async function authSignIn(email, password) {
  const res = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Sign-in failed');
  return data;
}

async function authSignOut() {
  if (authState.session?.access_token) {
    try {
      await fetch(`${SB_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${authState.session.access_token}` },
      });
    } catch {}
  }
  authState = { user: null, session: null, profile: null, accessOrgs: [] };
  authClearSession();
}

// Deletes a Supabase auth account by auth UUID. Requires SB_SERVICE_KEY.
// Throws if service key is not configured or the API call fails.
async function authAdminDeleteUser(authId) {
  if (!SB_SERVICE_KEY) throw new Error('Service role key not configured — add SB_SERVICE_KEY to js/supabase.js');
  const res = await fetch(`${SB_URL}/auth/v1/admin/users/${authId}`, {
    method: 'DELETE',
    headers: { 'apikey': SB_SERVICE_KEY, 'Authorization': `Bearer ${SB_SERVICE_KEY}` },
  });
  if (!res.ok && res.status !== 404) {
    const t = await res.text();
    throw new Error(`Auth delete failed: ${res.status} ${t}`);
  }
}

// Creates a new Supabase auth account. Returns the auth UUID only.
// The session returned by /signup is intentionally discarded so the caller remains logged in.
async function authCreateAuthUser(email, password) {
  const res = await fetch(`${SB_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Failed to create auth account');
  const uid = data.user?.id;
  if (!uid) throw new Error('Auth account created but no user ID returned — email may already be registered');
  return uid;
}

async function authRefreshToken(refreshToken) {
  const res = await fetch(`${SB_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) throw new Error('Token refresh failed');
  return res.json();
}

// ============================================================
// BOOTSTRAP — called once at app startup before init()
// Returns true if user is authenticated and profile loaded.
// ============================================================
async function authBootstrap() {
  const stored = authLoadStoredSession();
  if (!stored?.session?.access_token) return false;

  const { session, user } = stored;
  const now = Math.floor(Date.now() / 1000);

  if (session.expires_at && session.expires_at < now + 60) {
    try {
      const refreshed = await authRefreshToken(session.refresh_token);
      const newSession = {
        access_token: refreshed.access_token,
        refresh_token: refreshed.refresh_token,
        expires_at: now + (refreshed.expires_in || 3600),
      };
      authState.session = newSession;
      authState.user = refreshed.user || user;
      authSaveSession(newSession, authState.user);
    } catch {
      authClearSession();
      return false;
    }
  } else {
    authState.session = session;
    authState.user = user;
  }

  try {
    await authLoadProfile();
    return true;
  } catch (e) {
    console.warn('Auth profile load failed:', e.message);
    authClearSession();
    return false;
  }
}

async function authLoadProfile() {
  const rows = await sbFetch(`users?auth_id=eq.${authState.user.id}&select=*`);
  if (!rows?.length) throw new Error('No profile found for this account — contact your administrator');
  authState.profile = rows[0];
  if (['analyst', 'viewer'].includes(authState.profile.role)) {
    const access = await sbFetch(`user_org_access?user_id=eq.${authState.profile.id}&select=org_id`);
    authState.accessOrgs = (access || []).map(r => r.org_id);
  }
}

// ============================================================
// ROLE HELPERS
// ============================================================
function isViewOnly()    { return (viewAsState?.role || authState.profile?.role) === 'viewer'; }
function isAdmin()       { return ['platform_admin','org_admin'].includes(viewAsState?.role || authState.profile?.role || ''); }
function isPlatformAdmin() { return authState.profile?.role === 'platform_admin'; } // always real role — not overridden by view-as

// ============================================================
// LOGIN SCREEN
// ============================================================
function renderLoginScreen(errorMsg = '') {
  return `<div id="loginScreen" style="
      position:fixed;inset:0;background:linear-gradient(135deg,#152168 0%,#1a3a8f 55%,#07B4D9 100%);
      display:flex;align-items:center;justify-content:center;z-index:9999;
    ">
    <div style="background:#fff;border-radius:16px;padding:2.5rem 2rem;width:100%;max-width:380px;
      box-shadow:0 24px 64px rgba(0,0,0,0.35);font-family:'Inter',sans-serif">
      <div style="text-align:center;margin-bottom:2rem">
        <div style="width:54px;height:54px;background:linear-gradient(135deg,#152168,#07B4D9);border-radius:14px;
          display:flex;align-items:center;justify-content:center;margin:0 auto 0.75rem;font-size:24px">🛡️</div>
        <div style="font-size:21px;font-weight:700;color:#152168;letter-spacing:-0.3px">Abbott Cyber</div>
        <div style="font-size:12px;color:#5a6a8a;margin-top:3px">GRC Platform — Secure Sign In</div>
      </div>
      ${errorMsg ? `<div style="background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;padding:10px 12px;
        border-radius:8px;font-size:12px;margin-bottom:1.25rem;line-height:1.4">${errorMsg}</div>` : ''}
      <form onsubmit="loginSubmit(event)">
        <div style="margin-bottom:1rem">
          <label style="display:block;font-size:10px;font-weight:700;color:#1a2340;margin-bottom:5px;
            text-transform:uppercase;letter-spacing:0.06em">Email Address</label>
          <input id="loginEmail" type="email" required autocomplete="email" placeholder="you@example.com"
            style="width:100%;padding:10px 12px;border:1.5px solid #dde3ef;border-radius:8px;
            font-family:'Inter',sans-serif;font-size:13px;color:#1a2340;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#07B4D9'" onblur="this.style.borderColor='#dde3ef'">
        </div>
        <div style="margin-bottom:1.75rem">
          <label style="display:block;font-size:10px;font-weight:700;color:#1a2340;margin-bottom:5px;
            text-transform:uppercase;letter-spacing:0.06em">Password</label>
          <input id="loginPassword" type="password" required autocomplete="current-password"
            style="width:100%;padding:10px 12px;border:1.5px solid #dde3ef;border-radius:8px;
            font-family:'Inter',sans-serif;font-size:13px;color:#1a2340;outline:none;box-sizing:border-box"
            onfocus="this.style.borderColor='#07B4D9'" onblur="this.style.borderColor='#dde3ef'">
        </div>
        <button type="submit" id="loginBtn" style="width:100%;padding:12px;
          background:linear-gradient(135deg,#152168,#1a2a7a);color:#fff;border:none;border-radius:8px;
          font-family:'Inter',sans-serif;font-size:14px;font-weight:700;cursor:pointer;letter-spacing:0.02em">
          Sign In →
        </button>
      </form>
    </div>
  </div>`;
}

async function loginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginBtn');
  btn.textContent = 'Signing in…';
  btn.disabled = true;

  try {
    const data = await authSignIn(email, password);
    const now = Math.floor(Date.now() / 1000);
    const session = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: now + (data.expires_in || 3600),
    };
    authState.session = session;
    authState.user = data.user;
    authSaveSession(session, data.user);
    await authLoadProfile();

    document.getElementById('loginScreen')?.remove();
    document.getElementById('appShell').style.display = '';
    await bootApp();
  } catch (err) {
    document.getElementById('loginScreen')?.remove();
    document.body.insertAdjacentHTML('beforeend', renderLoginScreen(err.message));
  }
}

async function doSignOut() {
  await authSignOut();
  allOrgs = []; currentOrg = null; orgAssessments = {};
  activeNav = 'home'; activeNavSection = 'g_dashboard';
  document.getElementById('appShell').style.display = 'none';
  document.getElementById('userChipContainer').innerHTML = '';
  document.getElementById('mainContent').innerHTML = '';
  document.getElementById('loginScreen')?.remove();
  document.body.insertAdjacentHTML('beforeend', renderLoginScreen());
}

function renderUserMenu() {
  if (!authState.profile) return '';
  const roleLabels = {
    platform_admin: 'Platform Admin', org_admin: 'Org Admin',
    analyst: 'Analyst', viewer: 'View Only',
  };

  // In view-as mode: show the viewed user's identity, with an exit button — no dropdown
  if (typeof viewAsState !== 'undefined' && viewAsState) {
    const ini = (viewAsState.name || viewAsState.email || '?')
      .split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const roleLbl = roleLabels[viewAsState.role] || viewAsState.role;
    return `<div style="display:flex;align-items:center;gap:8px;padding:0 4px 0 12px;border-left:1px solid var(--border)">
      <div style="text-align:right">
        <div style="font-size:11px;font-weight:700;color:var(--text);line-height:1.3">${escH(viewAsState.name || viewAsState.email)}</div>
        <div style="font-size:9px;color:#92400e;text-transform:uppercase;letter-spacing:0.05em;font-weight:700">${roleLbl}</div>
      </div>
      <div class="user-avatar" style="background:#92400e">${ini}</div>
    </div>`;
  }

  // Normal mode: show real user with dropdown
  const ini = (authState.profile.name || authState.profile.email || '?')
    .split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const roleLbl = roleLabels[authState.profile.role] || authState.profile.role;
  const isAdminUser = authState.profile.role === 'platform_admin' || authState.profile.role === 'org_admin';
  const displayName = escH(authState.profile.name || authState.profile.email);
  return `<div class="user-menu" id="userMenuWrapper">
    <button class="user-menu-btn" onclick="toggleUserMenu()">
      <div style="text-align:right">
        <div style="font-size:11px;font-weight:700;color:var(--text);line-height:1.3">${displayName}</div>
        <div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em">${roleLbl}</div>
      </div>
      <div class="user-avatar">${ini}</div>
    </button>
    <div class="user-menu-dropdown" id="userMenuDD" style="display:none">
      <div class="user-menu-header">
        <div class="user-menu-name">${displayName}</div>
        <div class="user-menu-role">${roleLbl}</div>
      </div>
      ${isAdminUser ? `<button class="user-menu-item" onclick="closeUserMenu();setNav('orgs')">🏢 Organisation Manager</button>` : ''}
      ${isAdminUser ? `<button class="user-menu-item" onclick="closeUserMenu();setNav('users')">👥 User Management</button>` : ''}
      ${isAdminUser ? `<div class="user-menu-divider"></div>` : ''}
      <button class="user-menu-item danger" onclick="doSignOut()">🚪 Sign Out</button>
    </div>
  </div>`;
}

function toggleUserMenu() {
  const dd = document.getElementById('userMenuDD');
  if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}

function closeUserMenu() {
  const dd = document.getElementById('userMenuDD');
  if (dd) dd.style.display = 'none';
}
