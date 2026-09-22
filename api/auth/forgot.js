import { sql, ensureSchema } from '../../server/db.js';
import { normEmail, createPasswordReset } from '../../server/auth.js';
import { sendEmail, resetEmail, emailConfigured, appUrl } from '../../server/email.js';

const LANGS = ['es', 'en', 'pt'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Un fallo de configuración sí se reporta: no depende de si la cuenta existe,
  // así que no revela nada, y sin esto el problema sería invisible.
  if (!emailConfigured()) {
    return res.status(503).json({ error: 'El envío de correo no está configurado. Escribinos y te ayudamos a entrar.' });
  }

  await ensureSchema();

  const { email, lang } = req.body || {};
  const cleanEmail = normEmail(email);
  const cleanLang = LANGS.includes(lang) ? lang : 'es';

  if (!cleanEmail.includes('@')) {
    return res.status(400).json({ error: 'Ingresá un correo válido.' });
  }

  // De acá en adelante la respuesta es siempre la misma, exista o no la cuenta:
  // si distinguiéramos, cualquiera podría averiguar qué correos están registrados.
  // Los errores de envío se registran en el log del servidor, no en la respuesta.
  try {
    const rows = await sql`SELECT id, name, email FROM users WHERE email = ${cleanEmail}`;
    const user = rows[0];

    if (user) {
      // null = pidió demasiadas veces seguidas; se corta en silencio, sin enviar nada.
      const reset = await createPasswordReset(user.id);
      if (reset) {
        const link = `${appUrl()}/?reset=${reset.token}`;
        const { subject, html, text } = resetEmail({
          name: user.name,
          link,
          lang: cleanLang,
          minutes: reset.minutes,
        });
        await sendEmail({ to: user.email, subject, html, text });
      }
    }
  } catch (err) {
    console.error('[forgot] fallo al preparar o enviar el correo:', err);
  }

  res.status(200).json({ ok: true });
}
