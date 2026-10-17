import { buildConfirmationEmail, buildInboxEmail, confirmUrl, INBOX, signConfirmation, TURNSTILE_ACTION, validateSubmission, type FormKind } from '@/lib/forms';
import { formsEnv, isProd, json, publicOrigin, sameOrigin, sendMail, underLimit } from '@/lib/forms-server';

// One endpoint for the contact brief and the newsletter signup.
// Order matters: cheap checks first, then the rate limit, then Turnstile, then the paid email call.
// Enquiry: emailed to INBOX. Newsletter: only a confirmation link goes to the address typed in; INBOX hears
// about the subscriber from /api/submit/confirm once they confirm (double opt-in).
// Missing secrets in production → 503, and the contact form falls back to the visitor's mail client.

async function verifyTurnstile(secret: string, token: string, ip: string, kind: FormKind, host: string): Promise<boolean> {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip || undefined }),
    });
    if (!res.ok) return false;
    const result = (await res.json()) as { success?: boolean; action?: string; hostname?: string; metadata?: { result_with_testing_key?: boolean } };
    if (result.success !== true) return false;
    // Test keys report no action and hostname "example.com"; there is nothing to check.
    if (result.metadata?.result_with_testing_key === true) return !isProd;
    return result.action === TURNSTILE_ACTION[kind] && result.hostname === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false, error: 'origin' }, 403);

  let body: unknown;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'invalid' }, 400); }
  const checked = validateSubmission(body);
  // Pretend success to bots that filled the honeypot, so they learn nothing.
  if (!checked.ok && checked.error === 'spam') return json({ ok: true });
  if (!checked.ok) return json({ ok: false, error: checked.error }, 400);
  const { value } = checked;

  const env = formsEnv();
  if (!env.turnstileSecret || (isProd && !env.resendKey) || (value.kind === 'newsletter' && !env.signingSecret)) return json({ ok: false, error: 'unavailable' }, 503);

  const ip = request.headers.get('cf-connecting-ip') || '';
  if (!(await underLimit(env.limiter, `${value.kind}:${ip || 'unknown'}`))) return json({ ok: false, error: 'rate' }, 429);
  if (!(await verifyTurnstile(env.turnstileSecret, value.token, ip, value.kind, new URL(request.url).hostname))) return json({ ok: false, error: 'captcha' }, 400);

  if (value.kind === 'newsletter') {
    const link = confirmUrl(publicOrigin(request), await signConfirmation(env.signingSecret, value.email));
    return (await sendMail(env, { to: value.email, ...buildConfirmationEmail(link) })) ? json({ ok: true, confirm: true }) : json({ ok: false, error: 'send' }, 502);
  }

  const mail = buildInboxEmail(value, { at: new Date().toISOString(), ip, country: request.headers.get('cf-ipcountry') || '' });
  return (await sendMail(env, { to: INBOX, ...mail })) ? json({ ok: true }) : json({ ok: false, error: 'send' }, 502);
}
