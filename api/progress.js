import { sql, ensureSchema } from '../server/db.js';
import { getSessionUser } from '../server/auth.js';

export default async function handler(req, res) {
  await ensureSchema();
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: 'No autenticado' });

  if (req.method === 'GET') {
    const rows = await sql`SELECT data FROM progress WHERE user_id = ${user.id}`;
    return res.status(200).json({ data: rows[0] ? rows[0].data : null });
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    // POST también se acepta porque navigator.sendBeacon (usado al cerrar la pestaña) sólo puede enviar POST.
    let data = req.body;
    if (!data || typeof data !== 'object') {
      try { data = JSON.parse(req.body || '{}'); } catch (e) { data = {}; }
    }
    await sql`
      INSERT INTO progress (user_id, data, updated_at)
      VALUES (${user.id}, ${JSON.stringify(data)}::jsonb, now())
      ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    `;
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
