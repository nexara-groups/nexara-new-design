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

/** The message that lands in INBOX. Reply-To is the visitor, so replying in Outlook answers them directly. */
export function buildInboxEmail(value: Extract<Validated, { ok: true }>['value'], meta: { at: string; ip: string; country: string }) {
  const footer = [
    '',
    '---',
    `Received: ${meta.at}`,
    `Page: ${value.page || 'unknown'}`,
    `Consent: given (version ${CONSENT_VERSION})`,
    `Network: ${meta.country || '??'} · ${meta.ip || 'unknown IP'}`,
  ];
  if (value.kind === 'newsletter') {
    return {
      subject: `Newsletter signup: ${value.email}`,
      replyTo: value.email,
      text: [
        `${value.email} subscribed to the Nexara newsletter.`,
        '',
        'Add them to the mailing list. To honour an unsubscribe, remove them and reply to confirm.',
        ...footer,
      ].join('\n'),
    };
  }
  const who = value.name ? `${value.name} <${value.email}>` : value.email;
  return {
    subject: `Project enquiry${value.brief?.section ? ` (${value.brief.section})` : ''}: ${value.name || value.email}`,
    replyTo: value.email,
    text: [`From: ${who}`, '', value.briefText || JSON.stringify(value.brief, null, 2), ...footer].join('\n'),
  };
}
