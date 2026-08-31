import { sql, ensureSchema } from '../../server/db.js';
import { normEmail, hashPassword, createSession, setSessionCookie, getCountryFromReq } from '../../server/auth.js';

const ROLES = ['medico', 'estudiante', 'otro'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  await ensureSchema();

  const { name, email, password, role } = req.body || {};
  const cleanEmail = normEmail(email);
  const cleanName = String(name || '').trim();
  const cleanPassword = String(password || '');

  if (!cleanName || !cleanEmail.includes('@') || cleanPassword.length < 8) {
    return res.status(400).json({ error: 'Datos inválidos. La contraseña debe tener al menos 8 caracteres.' });
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${cleanEmail}`;
  if (existing.length) {
    return res.status(409).json({ error: 'Ya existe una cuenta con ese correo. Iniciá sesión.' });
  }

  const hash = await hashPassword(cleanPassword);
  const cleanRole = ROLES.includes(role) ? role : 'estudiante';
  const country = getCountryFromReq(req);

  const [user] = await sql`
    INSERT INTO users (email, password_hash, name, role, country)
    VALUES (${cleanEmail}, ${hash}, ${cleanName}, ${cleanRole}, ${country})
    RETURNING id, email, name, role
  `;

  const { token, expiresAt } = await createSession(user.id);
  setSessionCookie(res, token, expiresAt);
  res.status(200).json({ user });
}
