import { sql, ensureSchema } from '../../server/db.js';
import { isAdminRequest } from '../../server/adminAuth.js';

// Solo lectura: nunca inserta, actualiza ni borra nada.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAdminRequest(req)) return res.status(401).json({ error: 'No autorizado' });
  await ensureSchema();

  const items = await sql`
    SELECT f.id, f.type, f.message, f.page, f.created_at, u.name, u.email
    FROM feedback f
    JOIN users u ON u.id = f.user_id
    ORDER BY f.created_at DESC
    LIMIT 300
  `;

  res.status(200).json({ items });
}
