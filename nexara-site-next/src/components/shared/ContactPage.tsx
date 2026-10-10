'use client';
import React from 'react';
import ContactDetails from '../ContactDetails';
import { COPY } from '@/lib/copy';
import { DATA } from '@/lib/data';
import { LOCAL_FAQS } from '@/lib/seo';
import { useBriefForm } from '@/lib/shared';
import { divisionLabel, voiced, type Theme } from '@/lib/site';
import { PageFinder } from './PageFinder';
import { finderItems } from '@/lib/finder';

const CHANNEL_TRACK: Record<string, 'presence' | 'visibility' | 'performance'> = {
  academy: 'presence',
  marketing: 'visibility',
  labs: 'performance',
};

export function ContactPage({ theme, detail }: { theme: Theme; detail: string | null }) {
  const t = <T,>(value: { neo: T; trust: T }) => voiced(value, theme);
  const copy = COPY.contact;
  const contact = DATA.contact[theme];
  const faqs = LOCAL_FAQS.contact || [];
  const [open, setOpen] = React.useState<number[]>([0]);
  const root = React.useRef<HTMLElement>(null);
  const {
    formData,
    handleChange,
    handleLaneSelect,
    handleSubmit,
    briefText,
    showSuccess,
  } = useBriefForm(detail, { scrollSelector: '.nx-ct-form-card' });

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
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.from(q('.nx-ct-ln > span'), { yPercent: 105, duration: 1.1, stagger: 0.12 })
          .from(q('.nx-ct-engine'), { y: 40, opacity: 0, scale: 0.97, duration: 1, ease: 'power3.out' }, 0.25)
          .from(q('.nx-ct-leave'), { opacity: 0, y: 14, duration: 0.8, ease: 'power3.out' }, 1.4);
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
            <a className="nx-ct-mail" href={`mailto:${contact.accent}`}>{contact.accent}</a>
          </div>
          <div className="nx-ct-engine" aria-label={t(copy.preview)}>
            <p className="nx-ct-preview-label">{t(copy.preview)}</p>
            <pre className="nx-ct-preview">{briefText}</pre>
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
        {showSuccess ? (
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
                  <input type="email" value={formData.email} placeholder={t(copy.placeholders.email)} onChange={(e) => handleChange('email', e.target.value)} />
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

              <button className="nx-ct-cta nx-ct-cta--lg" type="submit">{t(copy.submit)}</button>
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
