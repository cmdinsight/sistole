import { sql, ensureSchema } from '../server/db.js';
import { getSessionUser } from '../server/auth.js';

const TYPES = ['error', 'sugerencia'];
const MAX_LEN = 2000;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  await ensureSchema();
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: 'No autenticado' });

  const { type, message, page } = req.body || {};
  const cleanMessage = String(message || '').trim().slice(0, MAX_LEN);
  const cleanType = TYPES.includes(type) ? type : 'sugerencia';
  if (!cleanMessage) return res.status(400).json({ error: 'Escribí un mensaje antes de enviar.' });

  await sql`
    INSERT INTO feedback (user_id, type, message, page)
    VALUES (${user.id}, ${cleanType}, ${cleanMessage}, ${String(page || '').slice(0, 100)})
  `;
  res.status(200).json({ ok: true });
}
