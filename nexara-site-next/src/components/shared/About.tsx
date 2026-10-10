'use client';
import React from 'react';
import Link from 'next/link';
import { DATA } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { ABOUT_FLOW, voiced, type AboutBlock, type Theme } from '@/lib/site';
import { routePath, LOCAL_FAQS } from '@/lib/seo';
import { Inline, resolveHref } from '../BlogContent';
import { getLenis } from '../useSmoothScroll';
import { PageFinder } from './PageFinder';
import { finderItems } from '@/lib/finder';

const { about, founders } = DATA.company;
const { legal, address } = DATA.contact;
const incorporated = new Date(legal.incorporated + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const initials = (name: string) => name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const TRACKS = ['presence', 'visibility', 'performance'] as const;
const VERIFY: Record<string, string[]> = {
  story: ['incorporated'],
  people: ['directors'],
  facts: ['cin', 'gstin', 'address'],
};

const Arrow = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
    <path d="M3 9h11M10 4.5L14.5 9 10 13.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Tick = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3.5 7.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function inkWords(text: string) {
  return text.split(' ').map((word, i) => (
    <React.Fragment key={i}>{i > 0 && ' '}<span className="nx-ab-w">{word}</span></React.Fragment>
  ));
}

export function About({ theme }: { theme: Theme }) {
  const t = <T,>(value: { neo: T; trust: T }) => voiced(value, theme);
  const copy = COPY.about;
  const faqs = LOCAL_FAQS.company || [];
  const root = React.useRef<HTMLElement>(null);
  const [verified, setVerified] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState<number[]>([0]);

  const dossier = [
    { key: 'incorporated', label: t(copy.legal.incorporated), value: incorporated },
    { key: 'cin', label: t(copy.legal.cin), value: legal.cin },
    { key: 'gstin', label: t(copy.legal.gstin), value: legal.gstin },
    { key: 'address', label: t(copy.legal.address), value: `${address.street}, ${address.city}` },
    { key: 'directors', label: t(copy.people.kicker), value: founders.map((f) => f.name).join(', ') },
  ];

  const mark = React.useCallback((keys: string[]) => {
    setVerified((list) => {
      const next = new Set(list);
      keys.forEach((key) => next.add(key));
      return next.size === list.length && keys.every((key) => list.includes(key)) ? list : [...next];
    });
  }, []);

  React.useEffect(() => {
    const el = root.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observers = Object.entries(VERIFY).map(([id, keys]) => {
      const section = el.querySelector(`#${id}`);
      if (!section) return null;
      const io = new IntersectionObserver(([entry]) => {
        if (entry && (entry.isIntersecting || entry.boundingClientRect.top < 0)) mark(keys);
      }, { rootMargin: '0px 0px -40% 0px' });
      io.observe(section);
      return io;
    });
    return () => observers.forEach((io) => io?.disconnect());
  }, [mark]);

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    const ready = () => el.classList.add('is-ready');
    const fallback = window.setTimeout(ready, 2500);
    const jumpToHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id || !el.querySelector('#' + CSS.escape(id))) return;
      const chrome = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nx-chrome-top')) || 72;
      const target = Math.max(0, document.getElementById(id)!.getBoundingClientRect().top + window.scrollY - chrome - 16);
      window.setTimeout(() => {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(target, { immediate: true });
        else window.scrollTo({ top: target, behavior: 'auto' });
      }, 60);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ready();
      jumpToHash();
      return () => window.clearTimeout(fallback);
    }

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const q = (s: string) => el.querySelectorAll(s);
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.from(q('.nx-ab-ln > span'), { yPercent: 105, duration: 1.1, stagger: 0.12 })
          .from(q('.nx-ab-dossier'), { y: 40, opacity: 0, scale: 0.97, duration: 1, ease: 'power3.out' }, 0.25)
          .from(q('.nx-ab-reg li'), { opacity: 0, y: 12, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, 0.7)
          .from(q('.nx-ab-leave'), { opacity: 0, y: 14, duration: 0.8, ease: 'power3.out' }, 1.1);
        gsap.fromTo(q('.nx-ab-w'), { opacity: 0.16 }, {
          opacity: 1, stagger: 0.05, ease: 'none',
          scrollTrigger: { trigger: q('.nx-ab-story')[0], start: 'top 70%', end: 'bottom 55%', scrub: 0.6 },
        });
        const rise = (sel: string, trigger: string, y = 28, stagger = 0.08) => {
          const node = q(trigger)[0];
          if (!node) return;
          gsap.from(q(sel), { opacity: 0, y, duration: 0.85, stagger, ease: 'power3.out', scrollTrigger: { trigger: node, start: 'top 82%' } });
        };
        rise('.nx-ab-step', '#how');
        rise('.nx-ab-miles li', '#milestones');
        rise('.nx-ab-person', '#people');
        rise('.nx-ab-table > div', '#facts', 22, 0.05);
        rise('.nx-ab-col', '#principles');
        rise('.nx-ab-col', '#standards');
        gsap.from(q('.nx-ab-ask-card'), { opacity: 0, y: 40, scale: 0.98, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: q('.nx-ab-ask')[0], start: 'top 80%' } });
      }, el);
      ready();
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(() => { if (!cancelled) refresh(); });
      jumpToHash();
      revert = () => { window.removeEventListener('load', refresh); ctx.revert(); };
    }).catch(() => { if (!cancelled) ready(); });

    return () => { cancelled = true; window.clearTimeout(fallback); revert?.(); };
  }, []);

  const toggleFaq = (i: number) => setOpen((list) => (list.includes(i) ? list.filter((n) => n !== i) : [...list, i]));
  const foundCount = dossier.filter((row) => verified.includes(row.key)).length;
  const hero = about.hero[theme];

  const BLOCKS: Record<AboutBlock, () => React.ReactNode> = {
    hero: () => (
      <section className="nx-ab-hero" id="overview">
        <div className="nx-ab-wrap nx-ab-hero-grid">
          <div>
            <p className="nx-ab-kicker">{t(copy.hero.kicker)}</p>
            <h1 className="nx-ab-h1">
              <span className="nx-ab-ln"><span>{hero.title}</span></span>
              <span className="nx-ab-ln"><span>{hero.accent}</span></span>
            </h1>
            <p className="nx-ab-leave">{t(copy.hero.leave)}</p>
            <p className="nx-ab-lead">{hero.body}</p>
          </div>
          <aside className="nx-ab-dossier" aria-label={t(copy.hero.record)}>
            <div className="nx-ab-rec-head">
              <p>{t(copy.hero.record)}</p>
              <span className="nx-ab-count" aria-hidden="true"><b>{foundCount}</b><small>/{dossier.length}</small></span>
            </div>
            <ol className="nx-ab-reg">
              {dossier.map((row) => {
                const found = verified.includes(row.key);
                return (
                  <li key={row.key} className={found ? 'is-found' : undefined}>
                    <span className="nx-ab-tick" aria-hidden="true"><Tick /></span>
                    <span className="nx-ab-label">{row.label}</span>
                    <span className="nx-ab-value">{row.value}</span>
                    <span className="nx-ab-state" key={found ? 'done' : 'miss'}>{found ? t(copy.hero.done) : t(copy.hero.pending)}</span>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>
      </section>
    ),
    story: () => (
      <section className="nx-ab-story" id="story" aria-labelledby="nx-ab-story-h">
        <div className="nx-ab-wrap">
          <p className="nx-ab-kicker">{t(copy.story.kicker)}</p>
          <h2 className="nx-ab-sec-h" id="nx-ab-story-h">{inkWords(about.story[theme].title)}</h2>
          <div className="nx-ab-story-copy">
            {about.story[theme].paragraphs.map((p) => <p key={p}><Inline text={p} theme={theme} /></p>)}
          </div>
        </div>
      </section>
    ),
    how: () => (
      <section className="nx-ab-block" id="how" aria-labelledby="nx-ab-how-h">
        <div className="nx-ab-wrap">
          <p className="nx-ab-kicker">{t(copy.how.kicker)}</p>
          <h2 className="nx-ab-sec-h" id="nx-ab-how-h">{t(copy.how.title)}</h2>
          <div className="nx-ab-stage">
            <div className="nx-ab-phases">
              <div className="nx-ab-rail" aria-hidden="true"><i /></div>
              {about.steps[theme].map((step, i) => (
                <article className="nx-ab-step is-on" data-track={TRACKS[i % TRACKS.length]} key={step.title}>
                  <div className="nx-ab-n">{i + 1}</div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
            <aside className="nx-ab-example">
              <p className="nx-ab-kicker">{about.example[theme].label}</p>
              <h3>{about.example[theme].title}</h3>
              <p>{about.example[theme].body}</p>
              <p className="nx-ab-example-links">
                {about.example.links.map((l) => (
                  <Link prefetch={false} key={l.href} href={resolveHref(l.href, theme)}>{t(l.label)}</Link>
                ))}
              </p>
            </aside>
          </div>
        </div>
      </section>
    ),
    milestones: () => (
      <section className="nx-ab-block nx-ab-paper" id="milestones" aria-labelledby="nx-ab-mile-h">
        <div className="nx-ab-wrap">
          <p className="nx-ab-kicker">{t(copy.milestones.kicker)}</p>
          <h2 className="nx-ab-sec-h" id="nx-ab-mile-h">{t(copy.milestones.title)}</h2>
          <ol className="nx-ab-miles">
            {about.milestones.map((m, i) => (
              <li key={(m.name || '') + (m.before || '')} data-track={TRACKS[i % TRACKS.length]}>
                {m.when && <time>{m.when}</time>}
                <strong>
                  {m.before}
                  {m.name && <Link prefetch={false} href={routePath(theme, 'customers')}>{m.name}</Link>}
                  {m.after}
                </strong>
                <p>{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    ),
    people: () => !founders.length ? null : (
      <section className="nx-ab-block" id="people" aria-labelledby="nx-ab-people-h">
        <div className="nx-ab-wrap">
          <p className="nx-ab-kicker">{t(copy.people.kicker)}</p>
          <h2 className="nx-ab-sec-h" id="nx-ab-people-h">{t(copy.people.title)}</h2>
          <ul className="nx-ab-people">
            {founders.map((f, i) => (
              <li className="nx-ab-person" data-track={TRACKS[i % TRACKS.length]} key={f.name}>
                <span className="nx-ab-avatar" aria-hidden={f.photo ? undefined : true}>
                  {f.photo ? <img src={f.photo} alt={`${f.name}, ${f.role}`} loading="lazy" decoding="async" /> : initials(f.name)}
                </span>
                <h3>{f.name}</h3>
                <span className="nx-ab-role">{f.role}</span>
                {f.bio && <p>{f.bio}</p>}
                {f.linkedin && <a href={f.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
    facts: () => (
      <section className="nx-ab-block nx-ab-paper" id="facts" aria-labelledby="nx-ab-facts-h">
        <div className="nx-ab-wrap">
          <p className="nx-ab-kicker">{t(copy.facts.kicker)}</p>
          <h2 className="nx-ab-sec-h" id="nx-ab-facts-h">{t(copy.facts.title)}</h2>
          <dl className="nx-ab-table">
            {DATA.company[theme].facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            <div><dt>{t(copy.legal.name)}</dt><dd>{legal.name}</dd></div>
            <div><dt>{t(copy.legal.website)}</dt><dd>{legal.domain}</dd></div>
            <div><dt>{t(copy.legal.incorporated)}</dt><dd>{incorporated}</dd></div>
            <div><dt>{t(copy.legal.cin)}</dt><dd>{legal.cin}</dd></div>
            <div><dt>{t(copy.legal.gstin)}</dt><dd>{legal.gstin}</dd></div>
            <div className="nx-ab-wide"><dt>{t(copy.legal.address)}</dt><dd>{address.street}, {address.city}</dd></div>
          </dl>
        </div>
      </section>
    ),
    principles: () => (
      <section className="nx-ab-block" id="principles" aria-labelledby="nx-ab-prin-h">
        <div className="nx-ab-wrap">
          <p className="nx-ab-kicker">{t(copy.principles.kicker)}</p>
          <h2 className="nx-ab-sec-h" id="nx-ab-prin-h">{t(copy.principles.title)}</h2>
          <div className="nx-ab-cols">
            {DATA.company[theme].principles.map((p, i) => (
              <article className="nx-ab-col" data-track={TRACKS[i % TRACKS.length]} key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    ),
    standards: () => (
      <section className="nx-ab-block nx-ab-paper" id="standards" aria-labelledby="nx-ab-std-h">
        <div className="nx-ab-wrap">
          <p className="nx-ab-kicker">{t(copy.standards.kicker)}</p>
          <h2 className="nx-ab-sec-h" id="nx-ab-std-h">{t(copy.standards.title)}</h2>
          <div className="nx-ab-cols nx-ab-cols--two">
            {DATA.company[theme].standards.map((s, i) => (
              <article className="nx-ab-col" data-track={TRACKS[i % TRACKS.length]} key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    ),
    faqs: () => !faqs.length ? null : (
      <div className="nx-ab-wrap nx-ab-block nx-ab-faq-grid" id="faqs">
        <h2 className="nx-ab-sec-h" id="nx-ab-faq-h">{t(copy.faqs.title)}</h2>
        <dl className="nx-ab-faqs">
          {faqs.map(([question, answer], i) => {
            const isOpen = open.includes(i);
            return (
              <div key={question}>
                <dt>
                  <button type="button" aria-expanded={isOpen} aria-controls={`nx-ab-faq-${i}`} onClick={() => toggleFaq(i)}>
                    {question}<span className="nx-ab-plus" aria-hidden="true" />
                  </button>
                </dt>
                <dd id={`nx-ab-faq-${i}`} className={isOpen ? undefined : 'is-shut'}><span><span>{answer}</span></span></dd>
              </div>
            );
          })}
        </dl>
      </div>
    ),
    cta: () => (
      <section className="nx-ab-ask" id="ask" aria-label={t(copy.cta.title)}>
        <div className="nx-ab-wrap">
          <div className="nx-ab-ask-card">
            <h2>{t(copy.cta.title)}</h2>
            <p>{t(copy.cta.body)}</p>
            <div className="nx-ab-ask-actions">
              <Link prefetch={false} className="nx-ab-cta nx-ab-cta--lg" href={routePath(theme, 'contact')}>
                {t(copy.cta.primary)} <Arrow />
              </Link>
              <Link prefetch={false} className="nx-ab-text" href={routePath(theme, 'blog')}>{t(copy.cta.secondary)}</Link>
            </div>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <main className="nx-ab" ref={root}>
      {ABOUT_FLOW.map((block) => <React.Fragment key={block}>{BLOCKS[block]()}</React.Fragment>)}
      <PageFinder
        label={voiced(COPY.finder.company.label, theme)}
        overview={voiced(COPY.finder.overview, theme)}
        items={finderItems('company', theme)}
        cta={{ label: voiced(COPY.finder.company.cta, theme), href: routePath(theme, 'contact') }}
      />
    </main>
  );
}

export function CtaBand({ theme, copy, secondary, extra }: {
  theme: Theme;
  copy: { kicker: { neo: string; trust: string }; title: { neo: string; trust: string }; body: { neo: string; trust: string }; primary: { neo: string; trust: string } };
  secondary?: { page: string; label: { neo: string; trust: string } };
  extra?: React.ReactNode;
}) {
  return (
    <section className="nx-section" aria-label={voiced(copy.title, theme)}>
      <div className="nx-inner nx-band">
        <div>
          <p className="nx-kicker">{voiced(copy.kicker, theme)}</p>
          <h2 className="nx-h2">{voiced(copy.title, theme)}</h2>
          <p>{voiced(copy.body, theme)}</p>
        </div>
        <div className="actions">
          {extra}
          {secondary && <Link prefetch={false} className="nx-text-link" href={routePath(theme, secondary.page)}>{voiced(secondary.label, theme)}</Link>}
          <Link prefetch={false} className="nx-btn" href={routePath(theme, 'contact')}>{voiced(copy.primary, theme)} <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
