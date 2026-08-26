import { getTokenFromReq, deleteSessionByToken, clearSessionCookie } from '../../server/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  await deleteSessionByToken(getTokenFromReq(req));
  clearSessionCookie(res);
  res.status(200).json({ ok: true });
}
