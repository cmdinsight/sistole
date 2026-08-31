import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sql, ensureSchema } from './db.js';

export const normEmail = (e) => String(e || '').trim().toLowerCase();

// Vercel resuelve esto solo (edge geo-IP) en cada request — no hace falta guardar ni consultar la IP.
// Código ISO de 2 letras (ej. 'UY', 'AR') o null si no está disponible (ej. en desarrollo local).
export function getCountryFromReq(req) {
  const c = req.headers['x-vercel-ip-country'];
  return c ? String(c).toUpperCase() : null;
}

export async function hashPassword(pw) {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw, hash) {
  return bcrypt.compare(pw, hash);
}

const SESSION_DAYS = 180;
const COOKIE_NAME = 'sistole_session';

export async function createSession(userId) {
  await ensureSchema();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
  await sql`INSERT INTO sessions (token, user_id, expires_at) VALUES (${token}, ${userId}, ${expiresAt})`;
  return { token, expiresAt };
}

export function setSessionCookie(res, token, expiresAt) {
  const maxAge = Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`);
}

export function clearSessionCookie(res) {
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

export function getTokenFromReq(req) {
  return parseCookies(req)[COOKIE_NAME];
}

export async function getSessionUser(req) {
  await ensureSchema();
  const token = getTokenFromReq(req);
  if (!token) return null;
  const rows = await sql`
    SELECT u.id, u.email, u.name, u.role
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token} AND s.expires_at > now()
  `;
  return rows[0] || null;
}

export async function deleteSessionByToken(token) {
  if (!token) return;
  await ensureSchema();
  await sql`DELETE FROM sessions WHERE token = ${token}`;
}
