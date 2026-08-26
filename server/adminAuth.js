import crypto from 'crypto';

const COOKIE_NAME = 'sistole_admin';
const TTL_MS = 12 * 60 * 60 * 1000; // 12h

function sign(payload) {
  const secret = process.env.ADMIN_SECRET || '';
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

// Comparación en tiempo constante para no filtrar la clave por timing.
export function checkAdminSecret(candidate) {
  const real = process.env.ADMIN_SECRET || '';
  if (!real) return false;
  const a = Buffer.from(String(candidate || ''));
  const b = Buffer.from(real);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function issueAdminCookie(res) {
  const expires = Date.now() + TTL_MS;
  const payload = `admin.${expires}`;
  const token = `${payload}.${sign(payload)}`;
  const maxAge = Math.floor(TTL_MS / 1000);
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`);
}

export function clearAdminCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`);
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  header.split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > -1) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}

// Cookie propia y separada de la sesión de usuarios (sistole_session) — no interfiere con el login normal.
export function isAdminRequest(req) {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [tag, expiresStr, sig] = parts;
  if (tag !== 'admin') return false;
  const expires = Number(expiresStr);
  if (!expires || Date.now() > expires) return false;
  const expected = sign(`${tag}.${expiresStr}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
