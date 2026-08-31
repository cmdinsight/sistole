import { sql, ensureSchema } from '../../server/db.js';
import { normEmail, verifyPassword, createSession, setSessionCookie, getCountryFromReq } from '../../server/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  await ensureSchema();

  const { email, password } = req.body || {};
  const cleanEmail = normEmail(email);

  const rows = await sql`SELECT id, email, name, role, password_hash FROM users WHERE email = ${cleanEmail}`;
  const user = rows[0];
  const ok = user && (await verifyPassword(String(password || ''), user.password_hash));
  if (!ok) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
  }

  const { token, expiresAt } = await createSession(user.id);
  setSessionCookie(res, token, expiresAt);

  // Refresca el país en cada login (si Vercel lo resolvió) — así las cuentas creadas antes de esta
  // función también quedan geolocalizadas, y se actualiza si el usuario inició sesión desde otro país.
  const country = getCountryFromReq(req);
  if (country) await sql`UPDATE users SET country = ${country} WHERE id = ${user.id}`;

  const progRows = await sql`SELECT data FROM progress WHERE user_id = ${user.id}`;
  res.status(200).json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    data: progRows[0] ? progRows[0].data : null,
  });
}
