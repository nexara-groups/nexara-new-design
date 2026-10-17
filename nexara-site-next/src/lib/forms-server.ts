import { getCloudflareContext } from '@opennextjs/cloudflare';
import { TURNSTILE_TEST_SECRET } from './forms';

// Server-only helpers for /api/submit and /api/submit/confirm: secrets, rate limit, Resend.
// Secrets live on the Worker (dashboard → nexara-site → Settings → Variables, type Secret).

declare global {
  interface CloudflareEnv {
    TURNSTILE_SECRET_KEY?: string;
    RESEND_API_KEY?: string;
    /** Random string that signs newsletter confirmation links. Rotating it invalidates unclicked links. */
    FORMS_SIGNING_SECRET?: string;
    /** e.g. "Nexara <forms@nexaragroups.com>". The domain must be verified in Resend. */
    FORMS_FROM?: string;
    FORM_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
  }
}

export const isProd = process.env.NODE_ENV === 'production';
const DEV_SIGNING_SECRET = 'nexara-local-dev-only';

export const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export function formsEnv() {
  let e = {} as CloudflareEnv;
  try { e = getCloudflareContext().env; } catch {}
  const pick = (k: 'TURNSTILE_SECRET_KEY' | 'RESEND_API_KEY' | 'FORMS_SIGNING_SECRET' | 'FORMS_FROM') => e[k] || process.env[k] || '';
  return {
    turnstileSecret: pick('TURNSTILE_SECRET_KEY') || (isProd ? '' : TURNSTILE_TEST_SECRET),
    resendKey: pick('RESEND_API_KEY'),
    signingSecret: pick('FORMS_SIGNING_SECRET') || (isProd ? '' : DEV_SIGNING_SECRET),
    from: pick('FORMS_FROM') || 'Nexara Forms <forms@nexaragroups.com>',
    limiter: e.FORM_LIMITER,
  };
}

/** Rejects cross-site posts. Browsers always send Origin on POST. */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  try { return !origin || new URL(origin).hostname === new URL(request.url).hostname; } catch { return false; }
}

export async function underLimit(limiter: CloudflareEnv['FORM_LIMITER'], key: string): Promise<boolean> {
  if (!limiter) return true;
  return (await limiter.limit({ key })).success;
}

/** Public origin for links in emails. The request URL can be the Worker's internal one, so production is pinned. */
export const publicOrigin = (request: Request) => (isProd ? 'https://nexaragroups.com' : new URL(request.url).origin);

export async function sendMail(env: ReturnType<typeof formsEnv>, mail: { to: string; subject: string; text: string; replyTo?: string }): Promise<boolean> {
  if (!env.resendKey) {
    // Local development only: show what would have been sent.
    console.info(`[forms] would email ${mail.to}\nSubject: ${mail.subject}${mail.replyTo ? `\nReply-To: ${mail.replyTo}` : ''}\n\n${mail.text}`);
    return true;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.resendKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.from, to: [mail.to], subject: mail.subject, text: mail.text, ...(mail.replyTo ? { reply_to: mail.replyTo } : {}) }),
  }).catch(() => null);
  if (!res?.ok) console.error(`[forms] Resend failed: ${res?.status ?? 'network'} ${res ? await res.text().catch(() => '') : ''}`);
  return Boolean(res?.ok);
}
