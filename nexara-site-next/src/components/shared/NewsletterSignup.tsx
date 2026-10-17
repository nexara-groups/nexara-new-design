'use client';
import React from 'react';
import { COPY } from '@/lib/copy';
import { voiced, type Theme } from '@/lib/site';
import { FORMS_ENABLED, TurnstileWidget, WIDGET_THEME, submitForm } from '../TurnstileWidget';

// Footer newsletter signup, both themes. Email + Turnstile + explicit consent, as on Happy Farms.
// No database: each signup is emailed to info@ (see lib/forms.ts). Hidden until the Turnstile site key is set.
export function NewsletterSignup({ theme }: { theme: Theme }) {
  const copy = COPY.contact.newsletter;
  const errors = COPY.contact.errors;
  const t = <T,>(value: { neo: T; trust: T }) => voiced(value, theme);
  const [email, setEmail] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [token, setToken] = React.useState('');
  const [resetKey, setResetKey] = React.useState(0);
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = React.useState('');
  const honeypot = React.useRef<HTMLInputElement>(null);
  const id = React.useId();

  if (!FORMS_ENABLED) return null;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!consent) return setError(t(errors.consent));
    if (!token) return setError(t(errors.captcha));
    setStatus('sending');
    setError('');
    const failure = await submitForm({ kind: 'newsletter', email, consent, token, website: honeypot.current?.value || '' });
    if (!failure) return setStatus('done');
    setStatus('idle');
    setResetKey((n) => n + 1);
    setError(failure === 'email' || failure === 'captcha' || failure === 'rate' || failure === 'consent' ? t(errors[failure]) : t(copy.failed));
  };

  return (
    <section className="nx-news" aria-labelledby={`${id}-title`}>
      <div className="nx-news-copy">
        <h2 id={`${id}-title`}>{t(copy.title)}</h2>
        <p>{t(copy.body)}</p>
      </div>
      {status === 'done' ? (
        <p className="nx-news-done" role="status">{t(copy.done)}</p>
      ) : (
        <form className="nx-news-form" onSubmit={onSubmit} noValidate>
          <div className="nx-news-row">
            <label className="nx-sr" htmlFor={`${id}-email`}>{t(copy.placeholder)}</label>
            <input id={`${id}-email`} type="email" required autoComplete="email" value={email} placeholder={t(copy.placeholder)} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? t(COPY.contact.sending) : t(copy.submit)}</button>
          </div>
          <input ref={honeypot} className="nx-hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <TurnstileWidget action="newsletter" onToken={setToken} resetKey={resetKey} className="nx-ts" theme={t(WIDGET_THEME)} />
          <label className="nx-news-consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>{t(copy.consent)} <a href="/privacy-policy.html">{t(COPY.contact.privacy)}</a>.</span>
          </label>
          {error && <p className="nx-form-error" role="alert">{error}</p>}
        </form>
      )}
    </section>
  );
}
