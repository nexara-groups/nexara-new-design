'use client';
import React from 'react';
import ContactDetails from '../ContactDetails';
import { COPY } from '@/lib/copy';
import { DATA } from '@/lib/data';
import { LOCAL_FAQS } from '@/lib/seo';
import { useBriefForm } from '@/lib/shared';
import { divisionLabel, voiced, type Theme } from '@/lib/site';
import { PageFinder } from './PageFinder';
import { changedLines } from '@/lib/contact-hero';
import { useMagnet, usePointerTilt } from './useHeroMotion';
import { finderItems } from '@/lib/finder';
import { FORMS_ENABLED, TurnstileWidget, WIDGET_THEME, submitForm } from '../TurnstileWidget';

const CHANNEL_TRACK: Record<string, 'presence' | 'visibility' | 'performance'> = {
  academy: 'presence',
  marketing: 'visibility',
  labs: 'performance',
};

// The brief as a scope card: one row per answer, the row the visitor just changed flashes (opacity overlay, CSS only).
// Rows are read from the same brief text the form sends; the page's own date line never flashes.
function BriefPreview({ text }: { text: string }) {
  const previous = React.useRef(text);
  const [flash, setFlash] = React.useState<{ id: number; lines: number[] }>({ id: 0, lines: [] });
  React.useEffect(() => {
    const lines = changedLines(previous.current, text);
    previous.current = text;
    if (lines.length) setFlash((f) => ({ id: f.id + 1, lines }));
  }, [text]);
  const lines = text.split('\n');
  const rows = lines.map((line, i) => ({ line, i })).filter(({ line }) => /^[^:]+: /.test(line) && !/^Generated on/.test(line));
  const isEmpty = (v: string) => /not specified/i.test(v);
  const filled = rows.filter(({ line }) => !isEmpty(line.slice(line.indexOf(': ') + 2))).length;
  const title = lines[0] ?? '';
  const stamp = lines.find((l) => /^Generated on/.test(l)) ?? '';
  return (
    <div className="nx-ct-preview" role="group" aria-label={title}>
      <div className="nx-ct-pv-head"><b>{title}</b><span>{filled}/{rows.length}</span></div>
      <div className="nx-ct-pv-bar" aria-hidden="true"><i style={{ width: `${(filled / Math.max(rows.length, 1)) * 100}%` }} /></div>
      {rows.map(({ line, i }) => {
        const cut = line.indexOf(': ');
        const value = line.slice(cut + 2);
        const changed = flash.lines.includes(i);
        const cls = ['nx-ct-bl', changed ? 'is-changed' : '', isEmpty(value) ? 'is-empty' : ''].filter(Boolean).join(' ');
        return <p key={changed ? `${i}-${flash.id}` : i} className={cls}><span>{line.slice(0, cut)}</span><b>{isEmpty(value) ? 'Not yet' : value}</b></p>;
      })}
      <p className="nx-ct-pv-foot">{stamp.replace('Generated on: ', 'Drafted ')}</p>
    </div>
  );
}

export function ContactPage({ theme, detail }: { theme: Theme; detail: string | null }) {
  const t = <T,>(value: { neo: T; trust: T }) => voiced(value, theme);
  const copy = COPY.contact;
  const contact = DATA.contact[theme];
  const faqs = LOCAL_FAQS.contact || [];
  const [open, setOpen] = React.useState<number[]>([0]);
  const root = React.useRef<HTMLElement>(null);
  const engineRef = React.useRef<HTMLDivElement>(null);
  const ctaRef = React.useRef<HTMLAnchorElement>(null);
  usePointerTilt(engineRef, { max: 4 });
  useMagnet(ctaRef);
  const {
    formData,
    handleChange,
    handleLaneSelect,
    handleSubmit: openMailClient,
    briefText,
    showSuccess,
  } = useBriefForm(detail, { scrollSelector: '.nx-ct-form-card' });

  // Server send (Turnstile + consent) when the keys are configured; the mail client is the fallback.
  const [consent, setConsent] = React.useState(false);
  const [token, setToken] = React.useState('');
  const [resetKey, setResetKey] = React.useState(0);
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = React.useState('');
  const honeypot = React.useRef<HTMLInputElement>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!FORMS_ENABLED) return openMailClient(event);
    event.preventDefault();
    if (!consent) return setError(t(copy.errors.consent));
    if (!token) return setError(t(copy.errors.captcha));
    setStatus('sending');
    setError('');
    const failure = await submitForm({ kind: 'enquiry', email: formData.email, name: formData.name, brief: formData, briefText, consent, token, website: honeypot.current?.value || '' });
    if (!failure) return setStatus('sent');
    setStatus('idle');
    setResetKey((n) => n + 1);
    if (failure === 'consent' || failure === 'email' || failure === 'captcha' || failure === 'rate') return setError(t(copy.errors[failure]));
    setError(t(copy.errors.fallback));
    openMailClient(event);
  };

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ready = () => el.classList.add('is-ready');
    const fallback = window.setTimeout(ready, 2500);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ready();
      return () => window.clearTimeout(fallback);
    }
    let cancelled = false;
    let revert: (() => void) | undefined;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const q = (s: string) => el.querySelectorAll(s);
      const ctx = gsap.context(() => {
        // Hero entrance is CSS-only (shared.css), so it never waits on this import.
        gsap.from(q('.nx-ct-form-card'), { opacity: 0, y: 28, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: q('.nx-ct-form-card')[0], start: 'top 82%' } });
      }, el);
      ready();
      revert = () => ctx.revert();
    }).catch(() => { if (!cancelled) ready(); });
    return () => { cancelled = true; window.clearTimeout(fallback); revert?.(); };
  }, []);

  const channelTitle = (section: string, title: string) => (
    section === 'home' ? t(copy.combined) : divisionLabel(section, theme) || title
  );

  return (
    <main className="nx-ct" ref={root}>
      <section className="nx-ct-hero" id="overview">
        <div className="nx-ct-wrap nx-ct-hero-grid">
          <div>
            <p className="nx-ct-kicker">{contact.eyebrow}</p>
            <h1 className="nx-ct-h1">{t(copy.lines).map((line) => <span className="nx-ct-ln" key={line}><span>{line}</span></span>)}</h1>
            <p className="nx-ct-leave">{t(copy.leave)}</p>
            <div className="nx-hero-actions">
              <a ref={ctaRef} className="nx-ct-cta nx-ct-cta--lg nx-magnet" href="#brief">{t(copy.start)}</a>
              <a className="nx-ct-mail" href={`mailto:${contact.accent}`}>{contact.accent}</a>
            </div>
          </div>
          <div className="nx-ct-engine nx-tilt" ref={engineRef} aria-label={t(copy.preview)}>
            <p className="nx-ct-preview-label">{t(copy.preview)}</p>
            {/* Same state as the lanes in the form below: choosing here preselects the lane there. */}
            <div className="nx-ct-lanes nx-ct-lanes--hero" role="group" aria-label={t(copy.channels)}>
              {DATA.contact.channels.map((channel) => (
                <button
                  key={channel.section}
                  type="button"
                  className={formData.section === channel.section ? 'is-active' : undefined}
                  data-track={CHANNEL_TRACK[channel.section] ?? 'presence'}
                  aria-pressed={formData.section === channel.section}
                  onClick={() => handleChange('section', channel.section)}
                >
                  {channelTitle(channel.section, channel.title)}
                </button>
              ))}
            </div>
            <BriefPreview text={briefText} />
          </div>
        </div>
      </section>

      <section className="nx-ct-wrap nx-ct-block" id="details">
        <ContactDetails theme={theme} className="nx-ct-details" />
      </section>

      <section className="nx-ct-wrap nx-ct-block" id="channels">
        <h2 className="nx-ct-sec-h">{t(copy.channels)}</h2>
        <p className="nx-ct-lede">{t(copy.channelsBody)}</p>
        <div className="nx-ct-channels">
          {DATA.contact.channels.map((channel) => {
            const active = formData.section === channel.section;
            return (
              <button
                key={channel.title}
                type="button"
                className={`nx-ct-channel${active ? ' is-active' : ''}`}
                data-track={CHANNEL_TRACK[channel.section] ?? 'presence'}
                onClick={() => handleLaneSelect(channel.section)}
                aria-pressed={active}
              >
                <h3>{channelTitle(channel.section, channel.title)}</h3>
                <p>{channel.body}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="nx-ct-wrap nx-ct-block" id="brief">
        {status === 'sent' ? (
          <div className="nx-ct-success" role="status">
            <h2 className="nx-ct-sec-h">{t(copy.sent)}</h2>
            <p>{t(copy.sentHint)}</p>
            <pre className="nx-ct-preview">{briefText}</pre>
          </div>
        ) : showSuccess ? (
          <div className="nx-ct-success">
            <h2 className="nx-ct-sec-h">{t(copy.success)}</h2>
            <p>{t(copy.successHint)}</p>
            <a className="nx-ct-mail" href={DATA.contact.enquiry.href}>{contact.accent}</a>
          </div>
        ) : (
          <div className="nx-ct-form-grid">
            <form className="nx-ct-form-card" onSubmit={handleSubmit}>
              <h2 className="nx-ct-sec-h">{t(copy.formTitle)}</h2>
              <p className="nx-ct-lede">{t(copy.formBody)}</p>

              <fieldset className="nx-ct-fields">
                <legend>{t(copy.fields.section)}</legend>
                <p className="nx-ct-hint">{t(copy.hints.section)}</p>
                <div className="nx-ct-lanes">
                  {DATA.contact.channels.map((channel) => (
                    <button
                      key={channel.section}
                      type="button"
                      className={formData.section === channel.section ? 'is-active' : undefined}
                      data-track={CHANNEL_TRACK[channel.section] ?? 'presence'}
                      onClick={() => handleChange('section', channel.section)}
                    >
                      {channelTitle(channel.section, channel.title)}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="nx-ct-row">
                <label>
                  <span>{t(copy.fields.name)}</span>
                  <small>{t(copy.hints.name)}</small>
                  <input type="text" value={formData.name} placeholder={t(copy.placeholders.name)} onChange={(e) => handleChange('name', e.target.value)} />
                </label>
                <label>
                  <span>{t(copy.fields.email)}</span>
                  <small>{t(copy.hints.email)}</small>
                  <input type="email" required={FORMS_ENABLED} value={formData.email} placeholder={t(copy.placeholders.email)} onChange={(e) => handleChange('email', e.target.value)} />
                </label>
              </div>

              <div className="nx-ct-row">
                <label>
                  <span>{t(copy.fields.city)}</span>
                  <small>{t(copy.hints.city)}</small>
                  <select value={formData.city} onChange={(e) => handleChange('city', e.target.value)}>
                    {DATA.market.cities.map((city) => <option key={city} value={city}>{city}</option>)}
                  </select>
                </label>
                <label>
                  <span>{t(copy.fields.timeline)}</span>
                  <small>{t(copy.hints.timeline)}</small>
                  <select value={formData.timeline} onChange={(e) => handleChange('timeline', e.target.value)}>
                    {copy.timelineValues.map((value, i) => (
                      <option key={value} value={value}>{t(copy.timelines[i]!)}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                <span>{t(copy.fields.audience)}</span>
                <small>{t(copy.hints.audience)}</small>
                <input type="text" value={formData.audience} placeholder={t(copy.placeholders.audience)} onChange={(e) => handleChange('audience', e.target.value)} />
              </label>
              <label>
                <span>{t(copy.fields.context)}</span>
                <small>{t(copy.hints.context)}</small>
                <textarea value={formData.context} placeholder={t(copy.placeholders.context)} onChange={(e) => handleChange('context', e.target.value)} />
              </label>
              <label>
                <span>{t(copy.fields.success)}</span>
                <small>{t(copy.hints.success)}</small>
                <input type="text" value={formData.successMetric} placeholder={t(copy.placeholders.success)} onChange={(e) => handleChange('successMetric', e.target.value)} />
              </label>

              {FORMS_ENABLED && (
                <>
                  <input ref={honeypot} className="nx-hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  <label className="nx-ct-consent">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
                    <span>{t(copy.consent)} <a href="/privacy-policy.html">{t(copy.privacy)}</a>.</span>
                  </label>
                  <TurnstileWidget action="enquiry" onToken={setToken} resetKey={resetKey} className="nx-ts" theme={t(WIDGET_THEME)} />
                </>
              )}
              {error && <p className="nx-form-error" role="alert">{error}</p>}
              <button className="nx-ct-cta nx-ct-cta--lg" type="submit" disabled={status === 'sending'}>{status === 'sending' ? t(copy.sending) : t(copy.submit)}</button>
            </form>

            <aside className="nx-ct-check">
              <p className="nx-ct-kicker">{t(copy.checklistTitle)}</p>
              <p className="nx-ct-lede">{t(copy.checklistBody)}</p>
              <ul>
                {DATA.contact.checklist.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <a className="nx-ct-mail" href={DATA.contact.enquiry.href}>{contact.accent}</a>
            </aside>
          </div>
        )}
      </section>

      <div className="nx-ct-wrap nx-ct-block nx-ct-faq-grid" id="faqs">
        <h2 className="nx-ct-sec-h">{t(copy.faqs)}</h2>
        <dl className="nx-ct-faqs">
          {faqs.map(([question, answer], i) => {
            const isOpen = open.includes(i);
            return (
              <div key={question}>
                <dt>
                  <button type="button" aria-expanded={isOpen} aria-controls={`nx-ct-faq-${i}`} onClick={() => setOpen((list) => (list.includes(i) ? list.filter((n) => n !== i) : [...list, i]))}>
                    {question}<span className="nx-ct-plus" aria-hidden="true" />
                  </button>
                </dt>
                <dd id={`nx-ct-faq-${i}`} className={isOpen ? undefined : 'is-shut'}><span><span>{answer}</span></span></dd>
              </div>
            );
          })}
        </dl>
      </div>
      <PageFinder
        label={t(COPY.finder.contact.label)}
        overview={t(COPY.finder.overview)}
        items={finderItems('contact', theme)}
        end=""
      />
    </main>
  );
}
