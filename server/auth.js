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
    SELECT u.id, u.email, u.name, u.role, u.country
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

// ── Recuperación de contraseña ──
// El token viaja por correo en texto plano, pero en la base se guarda solo su hash:
// si alguien llegara a leer la tabla, no puede usar los tokens pendientes.
const RESET_MINUTES = 60;
const RESET_MAX_PER_HOUR = 5;   // pedidos por cuenta
const RESET_COOLDOWN_SEC = 60;  // espera mínima entre un pedido y el siguiente

const hashToken = (t) => crypto.createHash('sha256').update(String(t)).digest('hex');

// Devuelve el token en claro (para el enlace del correo) o null si el usuario pidió demasiados.
export async function createPasswordReset(userId) {
  await ensureSchema();

  // Los cortes se calculan acá y viajan como timestamps: más simple y predecible
  // que mandar un intervalo como parámetro y confiar en el casteo de Postgres.
  const hourAgo = new Date(Date.now() - 3600000);
  const cooldownAgo = new Date(Date.now() - RESET_COOLDOWN_SEC * 1000);

  const [recent] = await sql`
    SELECT
      COUNT(*) FILTER (WHERE created_at > ${hourAgo})::int     AS last_hour,
      COUNT(*) FILTER (WHERE created_at > ${cooldownAgo})::int AS in_cooldown
    FROM password_resets
    WHERE user_id = ${userId}
  `;
  if (recent.in_cooldown > 0 || recent.last_hour >= RESET_MAX_PER_HOUR) return null;

  // Un pedido nuevo invalida los anteriores: solo el último enlace enviado funciona.
  await sql`UPDATE password_resets SET used_at = now() WHERE user_id = ${userId} AND used_at IS NULL`;

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + RESET_MINUTES * 60000);
  await sql`
    INSERT INTO password_resets (token_hash, user_id, expires_at)
    VALUES (${hashToken(token)}, ${userId}, ${expiresAt})
  `;
  return { token, expiresAt, minutes: RESET_MINUTES };
}

// Marca el token como usado y devuelve el id del usuario, en una sola operación atómica:
// dos pedidos simultáneos con el mismo token no pueden pasar los dos.
export async function consumePasswordReset(token) {
  await ensureSchema();
  if (!token) return null;
  const rows = await sql`
    UPDATE password_resets
    SET used_at = now()
    WHERE token_hash = ${hashToken(token)} AND used_at IS NULL AND expires_at > now()
    RETURNING user_id
  `;
  return rows[0] ? rows[0].user_id : null;
}

// Tras cambiar la contraseña se cierran todas las sesiones abiertas de esa cuenta:
// si alguien había entrado con la contraseña vieja, queda afuera.
export async function deleteSessionsForUser(userId) {
  await ensureSchema();
  await sql`DELETE FROM sessions WHERE user_id = ${userId}`;
}

export async function updatePassword(userId, newPassword) {
  await ensureSchema();
  const hash = await hashPassword(newPassword);
  await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${userId}`;
}
