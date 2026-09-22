// ── Envío de correo transaccional ──
// Todo el acoplamiento con el proveedor vive en sendEmail(). Cambiar de Resend a
// SendGrid, Postmark o SMTP es reescribir esa única función; el resto no se entera.
//
// Variables de entorno:
//   RESEND_API_KEY  clave del proveedor (sin ella, /api/auth/forgot responde 503)
//   EMAIL_FROM      remitente verificado, ej. "Sístole <no-reply@cmdtech.uy>"
//   APP_URL         base de los enlaces, ej. "https://sistole.cmdtech.uy"

const FROM = process.env.EMAIL_FROM || 'Sístole <no-reply@cmdtech.uy>';

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

// A propósito NO se arma la URL con el header Host de la request: un atacante puede
// falsificarlo y conseguir que el enlace del correo apunte a su propio dominio,
// llevándose el token. La base sale de configuración, nunca de la request.
export function appUrl() {
  return (process.env.APP_URL || 'https://sistole.cmdtech.uy').replace(/\/+$/, '');
}

export async function sendEmail({ to, subject, html, text }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY no configurada');

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
  });

  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`Error del proveedor de correo (${r.status}): ${body.slice(0, 300)}`);
  }
}

// ── Plantilla del correo de recuperación, en los tres idiomas de la app ──
const COPY = {
  es: {
    subject: 'Restablecer tu contraseña de Sístole',
    hi: (n) => `Hola ${n},`,
    body: 'Recibimos un pedido para restablecer la contraseña de tu cuenta en Sístole.',
    cta: 'Elegir una contraseña nueva',
    expires: (m) => `El enlace vence en ${m} minutos y se puede usar una sola vez.`,
    ignore: 'Si no pediste esto, podés ignorar este correo: tu contraseña no cambia hasta que uses el enlace.',
    fallback: 'Si el botón no funciona, copiá y pegá esta dirección en tu navegador:',
  },
  en: {
    subject: 'Reset your Sístole password',
    hi: (n) => `Hi ${n},`,
    body: 'We received a request to reset the password for your Sístole account.',
    cta: 'Choose a new password',
    expires: (m) => `The link expires in ${m} minutes and can only be used once.`,
    ignore: "If you didn't request this, you can ignore this email — your password won't change until you use the link.",
    fallback: "If the button doesn't work, copy and paste this address into your browser:",
  },
  pt: {
    subject: 'Redefinir sua senha do Sístole',
    hi: (n) => `Olá ${n},`,
    body: 'Recebemos um pedido para redefinir a senha da sua conta no Sístole.',
    cta: 'Escolher uma nova senha',
    expires: (m) => `O link expira em ${m} minutos e pode ser usado uma única vez.`,
    ignore: 'Se você não pediu isso, pode ignorar este e-mail: sua senha não muda até você usar o link.',
    fallback: 'Se o botão não funcionar, copie e cole este endereço no seu navegador:',
  },
};

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function resetEmail({ name, link, lang, minutes }) {
  const t = COPY[lang] || COPY.es;
  const safeName = escapeHtml(name || '');
  const safeLink = escapeHtml(link);

  const text = [
    t.hi(name || ''),
    '',
    t.body,
    '',
    link,
    '',
    t.expires(minutes),
    t.ignore,
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:#03060c;padding:24px 32px;">
          <span style="color:#e2e8f0;font-size:20px;font-weight:700;letter-spacing:-0.3px;">Sístole</span>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 16px;font-size:15px;color:#0f172a;">${t.hi(safeName)}</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#334155;">${t.body}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr><td style="border-radius:10px;background:#4338ca;">
              <a href="${safeLink}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">${t.cta}</a>
            </td></tr>
          </table>
          <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#64748b;">${t.expires(minutes)}</p>
          <p style="margin:0 0 24px;font-size:13px;line-height:1.6;color:#64748b;">${t.ignore}</p>
          <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;">${t.fallback}</p>
          <p style="margin:0;font-size:12px;word-break:break-all;"><a href="${safeLink}" style="color:#4338ca;">${safeLink}</a></p>
        </td></tr>
        <tr><td style="padding:16px 32px 24px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">Sístole · CMD Tech</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject: t.subject, html, text };
}
