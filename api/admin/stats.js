import { sql, ensureSchema } from '../../server/db.js';
import { isAdminRequest } from '../../server/adminAuth.js';

// Solo lectura: nunca inserta, actualiza ni borra nada de la tabla de usuarios.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAdminRequest(req)) return res.status(401).json({ error: 'No autorizado' });
  await ensureSchema();

  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM users`;
  const users = await sql`
    SELECT id, name, email, role, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT 500
  `;
  res.status(200).json({ count, users });
}
