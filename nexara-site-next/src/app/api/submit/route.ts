import { getCloudflareContext } from '@opennextjs/cloudflare';
import { buildInboxEmail, INBOX, TURNSTILE_ACTION, TURNSTILE_TEST_SECRET, validateSubmission, type FormKind } from '@/lib/forms';

// One endpoint for the contact brief and the newsletter signup.
// Order matters: cheap checks first, then the rate limit, then Turnstile, then the paid email call.
// Without TURNSTILE_SECRET_KEY or RESEND_API_KEY in production it answers 503, and the
// contact form falls back to opening the visitor's mail client, as it did before this endpoint existed.

declare global {
  interface CloudflareEnv {
    TURNSTILE_SECRET_KEY?: string;
    RESEND_API_KEY?: string;
    /** e.g. "Nexara <forms@nexaragroups.com>". The domain must be verified in Resend. */
    FORMS_FROM?: string;
    FORM_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
  }
}

const isProd = process.env.NODE_ENV === 'production';
const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

function env(): CloudflareEnv {
  try { return getCloudflareContext().env; } catch { return {} as CloudflareEnv; }
}

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
  const origin = request.headers.get('origin');
  const host = new URL(request.url).hostname;
  if (origin && new URL(origin).hostname !== host) return json({ ok: false, error: 'origin' }, 403);

  let body: unknown;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'invalid' }, 400); }
  const checked = validateSubmission(body);
  // Pretend success to bots that filled the honeypot, so they learn nothing.
  if (!checked.ok && checked.error === 'spam') return json({ ok: true });
  if (!checked.ok) return json({ ok: false, error: checked.error }, 400);
  const { value } = checked;

  const e = env();
  const secret = e.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY || (isProd ? '' : TURNSTILE_TEST_SECRET);
  const resendKey = e.RESEND_API_KEY || process.env.RESEND_API_KEY || '';
  if (!secret || (isProd && !resendKey)) return json({ ok: false, error: 'unavailable' }, 503);

  const ip = request.headers.get('cf-connecting-ip') || '';
  if (e.FORM_LIMITER) {
    const { success } = await e.FORM_LIMITER.limit({ key: `${value.kind}:${ip || 'unknown'}` });
    if (!success) return json({ ok: false, error: 'rate' }, 429);
  }

  if (!(await verifyTurnstile(secret, value.token, ip, value.kind, host))) return json({ ok: false, error: 'captcha' }, 400);

  const mail = buildInboxEmail(value, { at: new Date().toISOString(), ip, country: request.headers.get('cf-ipcountry') || '' });
  if (!resendKey) {
    // Local development only: show what would have been sent.
    console.info(`[forms] would email ${INBOX}\nSubject: ${mail.subject}\nReply-To: ${mail.replyTo}\n\n${mail.text}`);
    return json({ ok: true, dev: true });
  }
  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${resendKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: e.FORMS_FROM || process.env.FORMS_FROM || 'Nexara Forms <forms@nexaragroups.com>', to: [INBOX], reply_to: mail.replyTo, subject: mail.subject, text: mail.text }),
  }).catch(() => null);
  if (!sent?.ok) {
    console.error(`[forms] Resend failed: ${sent?.status ?? 'network'} ${sent ? await sent.text().catch(() => '') : ''}`);
    return json({ ok: false, error: 'send' }, 502);
  }
  return json({ ok: true });
}
