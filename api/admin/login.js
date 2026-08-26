import { checkAdminSecret, issueAdminCookie } from '../../server/adminAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { secret } = req.body || {};
  if (!checkAdminSecret(secret)) {
    return res.status(401).json({ error: 'Clave incorrecta' });
  }
  issueAdminCookie(res);
  res.status(200).json({ ok: true });
}
