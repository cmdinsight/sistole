import { sql, ensureSchema } from '../server/db.js';
import { getSessionUser, getCountryFromReq } from '../server/auth.js';

const ROLES = ['medico', 'estudiante', 'otro'];

export default async function handler(req, res) {
  await ensureSchema();
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: 'No autenticado' });

  if (req.method === 'GET') {
    // Rellena el país en cuentas que se crearon antes de esta función, o que nunca volvieron a
    // pasar por login (la sesión se restaura sola). Solo escribe si faltaba, no en cada carga.
    if (!user.country) {
      const country = getCountryFromReq(req);
      if (country) {
        await sql`UPDATE users SET country = ${country} WHERE id = ${user.id}`;
        user.country = country;
      }
    }
    return res.status(200).json({ user });
  }

  if (req.method === 'PATCH') {
    const { name, role } = req.body || {};
    const cleanName = String(name || '').trim();
    if (!cleanName) return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
    const cleanRole = ROLES.includes(role) ? role : user.role;

    const [updated] = await sql`
      UPDATE users SET name = ${cleanName}, role = ${cleanRole} WHERE id = ${user.id}
      RETURNING id, email, name, role
    `;
    return res.status(200).json({ user: updated });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
