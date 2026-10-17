import { buildSubscribedEmail, INBOX, verifyConfirmation } from '@/lib/forms';
import { formsEnv, isProd, json, sameOrigin, sendMail, underLimit } from '@/lib/forms-server';

// Second step of the newsletter double opt-in. Called by the Confirm button on /newsletter/confirm with the
// signed { e, t, s } from the emailed link. Only now does INBOX learn about the subscriber.
// No database, so a repeat click emails INBOX again; the rate limit keeps that small.

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false, error: 'origin' }, 403);
  const env = formsEnv();
  if (!env.signingSecret || (isProd && !env.resendKey)) return json({ ok: false, error: 'unavailable' }, 503);

  const ip = request.headers.get('cf-connecting-ip') || '';
  if (!(await underLimit(env.limiter, `confirm:${ip || 'unknown'}`))) return json({ ok: false, error: 'rate' }, 429);

  let body: unknown;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'invalid' }, 400); }
  const email = await verifyConfirmation(env.signingSecret, body);
  if (!email) return json({ ok: false, error: 'expired' }, 400);

  const mail = buildSubscribedEmail(email, { at: new Date().toISOString(), ip, country: request.headers.get('cf-ipcountry') || '' });
  return (await sendMail(env, { to: INBOX, ...mail })) ? json({ ok: true }) : json({ ok: false, error: 'send' }, 502);
}
