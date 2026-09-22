import { sql, ensureSchema } from '../../server/db.js';
import {
  consumePasswordReset,
  updatePassword,
  deleteSessionsForUser,
  createSession,
  setSessionCookie,
} from '../../server/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  await ensureSchema();

  const { token, password } = req.body || {};
  const cleanPassword = String(password || '');

  if (cleanPassword.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
  }

  const userId = await consumePasswordReset(token);
  if (!userId) {
    return res.status(400).json({ error: 'El enlace ya venció o fue usado. Pedí uno nuevo.' });
  }

  await updatePassword(userId, cleanPassword);

  // Primero se cierran todas las sesiones (incluida la de quien tuviera la contraseña vieja),
  // y recién después se abre la nueva, para no borrar la que acabamos de crear.
  await deleteSessionsForUser(userId);

  const [user] = await sql`SELECT id, email, name, role FROM users WHERE id = ${userId}`;
  const { token: sessionToken, expiresAt } = await createSession(userId);
  setSessionCookie(res, sessionToken, expiresAt);

  // Se devuelve el progreso igual que en login: quien restablece queda adentro y con su avance.
  const progRows = await sql`SELECT data FROM progress WHERE user_id = ${userId}`;
  res.status(200).json({ user, data: progRows[0] ? progRows[0].data : null });
}
