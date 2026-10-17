// Server-submitted forms: the contact brief and the newsletter signup.
// Pure code (no Next or Cloudflare imports) so the route, the components and the tests share one copy.
//
// Delivery is email only: every accepted submission is mailed to INBOX through Resend. There is no database,
// so the newsletter list lives in that inbox and unsubscribe requests are handled by hand.

export type FormKind = 'enquiry' | 'newsletter';

/** Bump when the consent wording changes; it is recorded with every submission. */
export const CONSENT_VERSION = '2026-10-17';

export const INBOX = 'info@nexaragroups.com';

// Cloudflare's documented always-pass test keys. Only ever used outside production.
// https://developers.cloudflare.com/turnstile/troubleshooting/testing/
export const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';
export const TURNSTILE_TEST_SECRET = '1x0000000000000000000000000000000AA';

/** Turnstile `action` per form, checked server-side so a token from one form can't be replayed on the other. */
export const TURNSTILE_ACTION: Record<FormKind, string> = { enquiry: 'enquiry', newsletter: 'newsletter' };

const EMAIL = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;
const LIMITS = { name: 120, email: 254, field: 300, context: 4000, page: 300 } as const;

export interface EnquiryFields { section: string; city: string; timeline: string; audience: string; context: string; successMetric: string; name: string; email: string }
export interface Submission {
  kind: FormKind;
  email: string;
  name?: string;
  brief?: Partial<EnquiryFields>;
  /** Formatted brief text as shown in the on-page preview. */
  briefText?: string;
  page?: string;
  consent: boolean;
  token: string;
  /** Honeypot. Real visitors never see or fill it. */
  website?: string;
}

export type Validated =
  | { ok: true; value: Required<Pick<Submission, 'kind' | 'email' | 'token'>> & Pick<Submission, 'name' | 'brief' | 'briefText' | 'page'> }
  | { ok: false; error: 'invalid' | 'consent' | 'email' | 'captcha' | 'spam' };

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function validateSubmission(input: unknown): Validated {
  if (!input || typeof input !== 'object') return { ok: false, error: 'invalid' };
  const body = input as Record<string, unknown>;
  const kind = body.kind;
  if (kind !== 'enquiry' && kind !== 'newsletter') return { ok: false, error: 'invalid' };
  if (str(body.website, 200)) return { ok: false, error: 'spam' };
  if (body.consent !== true) return { ok: false, error: 'consent' };
  const email = str(body.email, LIMITS.email).toLowerCase();
  if (!EMAIL.test(email)) return { ok: false, error: 'email' };
  const token = str(body.token, 4096);
  if (!token) return { ok: false, error: 'captcha' };
  const page = str(body.page, LIMITS.page);
  if (kind === 'newsletter') return { ok: true, value: { kind, email, token, page } };

  const raw = (body.brief && typeof body.brief === 'object' ? body.brief : {}) as Record<string, unknown>;
  const brief: Partial<EnquiryFields> = {
    section: str(raw.section, 40), city: str(raw.city, 80), timeline: str(raw.timeline, 40),
    audience: str(raw.audience, LIMITS.field), context: str(raw.context, LIMITS.context), successMetric: str(raw.successMetric, LIMITS.field),
  };
  const name = str(body.name, LIMITS.name);
  return { ok: true, value: { kind, email, token, page, name, brief, briefText: str(body.briefText, 6000) } };
}

// ── Newsletter double opt-in ──
// Signup only emails the subscriber a signed link. INBOX hears about them once they confirm, so consent is proven
// by the owner of the address, not by whoever typed it. The link opens a page with a Confirm button (a POST), because
// mail scanners such as Outlook Safe Links fetch links in emails and would otherwise confirm on the owner's behalf.

export const CONFIRM_TTL_SECONDS = 48 * 60 * 60;

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))));
}

export interface ConfirmToken { e: string; t: number; s: string }

/** Signs email + issue time. `e` is the email, base64url so it survives the query string untouched. */
export async function signConfirmation(secret: string, email: string, issuedAt = Math.floor(Date.now() / 1000)): Promise<ConfirmToken> {
  const e = b64url(new TextEncoder().encode(email));
  return { e, t: issuedAt, s: await hmac(secret, `newsletter:${e}:${issuedAt}`) };
}

/** Returns the confirmed email, or null when the signature is wrong, the link expired, or the input is malformed. */
export async function verifyConfirmation(secret: string, input: unknown, now = Math.floor(Date.now() / 1000)): Promise<string | null> {
  if (!input || typeof input !== 'object') return null;
  const { e, t, s } = input as Record<string, unknown>;
  const issued = Number(t);
  if (typeof e !== 'string' || typeof s !== 'string' || !Number.isInteger(issued) || e.length > 400) return null;
  if (issued > now + 60 || now - issued > CONFIRM_TTL_SECONDS) return null;
  const expected = await hmac(secret, `newsletter:${e}:${issued}`);
  if (expected.length !== s.length) return null;
  let diff = 0;
  for (let i = 0; i < s.length; i++) diff |= expected.charCodeAt(i) ^ s.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    const email = new TextDecoder().decode(fromB64url(e));
    return EMAIL.test(email) ? email : null;
  } catch {
    return null;
  }
}

export const confirmUrl = (origin: string, token: ConfirmToken) => `${origin}/newsletter/confirm?e=${token.e}&t=${token.t}&s=${token.s}`;

/** The one email a signup sends to the address typed in. Fixed text: nothing the visitor typed appears in it. */
export function buildConfirmationEmail(link: string) {
  return {
    subject: 'Confirm your Nexara newsletter subscription',
    text: [
      'Someone, hopefully you, asked to receive the Nexara newsletter at this address.',
      '',
      `To confirm, open this link and press Confirm (valid for 48 hours):`,
      link,
      '',
      'If you did not ask for this, ignore this email. You will not be added.',
      '',
      'Nexara Private Limited · nexaragroups.com',
    ].join('\n'),
  };
}

/** Sent to INBOX after the owner of the address confirms. */
export function buildSubscribedEmail(email: string, meta: { at: string; ip: string; country: string }) {
  return {
    subject: `Newsletter subscriber confirmed: ${email}`,
    replyTo: email,
    text: [
      `${email} confirmed their subscription to the Nexara newsletter from a link sent to that address.`,
      '',
      'Add them to the mailing list. To honour an unsubscribe, remove them and reply to confirm.',
      '',
      '---',
      `Confirmed: ${meta.at}`,
      `Consent: double opt-in (version ${CONSENT_VERSION})`,
      `Network: ${meta.country || '??'} · ${meta.ip || 'unknown IP'}`,
    ].join('\n'),
  };
}

/** The enquiry message that lands in INBOX. Reply-To is the visitor, so replying in Outlook answers them directly. */
export function buildInboxEmail(value: Extract<Validated, { ok: true }>['value'], meta: { at: string; ip: string; country: string }) {
  const footer = [
    '',
    '---',
    `Received: ${meta.at}`,
    `Page: ${value.page || 'unknown'}`,
    `Consent: given (version ${CONSENT_VERSION})`,
    `Network: ${meta.country || '??'} · ${meta.ip || 'unknown IP'}`,
  ];
  const who = value.name ? `${value.name} <${value.email}>` : value.email;
  return {
    subject: `Project enquiry${value.brief?.section ? ` (${value.brief.section})` : ''}: ${value.name || value.email}`,
    replyTo: value.email,
    text: [`From: ${who}`, '', value.briefText || JSON.stringify(value.brief, null, 2), ...footer].join('\n'),
  };
}
