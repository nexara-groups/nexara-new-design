'use client';
import React from 'react';
import Link from 'next/link';
import { DATA, neoSectionName } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { PROOF_FLOW, divisionLabel, voiced, type ProofBlock, type Theme } from '@/lib/site';
import { LOCAL_FAQS, routePath } from '@/lib/seo';
import { FaqBand } from './FaqBand';
import { CLIENTS } from '@/lib/clients';
import { NotFound } from '../NotFound';
import { Builds } from './HomeBlocks';
import { getLenis } from '../useSmoothScroll';
import { PageFinder } from './PageFinder';
import { finderItems } from '@/lib/finder';

type Division = (typeof DATA.sections)[keyof typeof DATA.sections];
const FILTERS = ['academy', 'marketing', 'labs'] as const;
const TRACK: Record<(typeof FILTERS)[number], 'presence' | 'visibility' | 'performance'> = {
  academy: 'presence',
  marketing: 'visibility',
  labs: 'performance',
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

const ico = (d: React.ReactNode) => (
  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
// One glyph per "why us" card, in COPY.proof.why.cards order.
const WHY_ICONS = [
  ico(<><circle cx="12" cy="8" r="3.6" /><path d="M5 20c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4" /></>),
  ico(<><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h4" /></>),
  ico(<><circle cx="12" cy="12" r="3" /><path d="M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8" /></>),
  ico(<><circle cx="9" cy="10" r="4.5" /><circle cx="15" cy="10" r="4.5" /><circle cx="12" cy="15" r="4.5" /></>),
  ico(<><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9.5h8M8 12.5h5" /></>),
  ico(<><path d="M4 12l8-8 8 8-8 8z" /><circle cx="12" cy="12" r="1.8" /></>),
];
const WHY_TRACKS = ['presence', 'visibility', 'performance'] as const;

function liveFor(divisionId?: string) {
  return CLIENTS.filter((item) => item.url && (!divisionId || item.teams.includes(divisionId as 'marketing' | 'labs')));
}


export function Proof({ theme, detail }: { theme: Theme; detail: string | null }) {
  const t = <T,>(value: { neo: T; trust: T }) => voiced(value, theme);
  const copy = COPY.proof;
  const division = detail ? (DATA.sections as Record<string, Division | undefined>)[detail] ?? null : null;
  const root = React.useRef<HTMLElement>(null);
  const [pick, setPick] = React.useState(0);

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
        tl.from(q('.nx-pf-ln > span'), { yPercent: 105, duration: 1.1, stagger: 0.12 })
          .from(q('.nx-pf-index'), { y: 40, opacity: 0, scale: 0.97, duration: 1, ease: 'power3.out' }, 0.25)
          .from(q('.nx-pf-frames > li'), { opacity: 0, y: 14, scale: 0.96, duration: 0.5, stagger: 0.07, ease: 'power3.out' }, 0.7)
          .from(q('.nx-pf-leave'), { opacity: 0, y: 14, duration: 0.8, ease: 'power3.out' }, 1.05);
        q('.nx-pf-fact b').forEach((node) => {
          const to = Number(node.getAttribute('data-to'));
          if (!Number.isFinite(to) || to === 0) return;
          const counter = { v: 0 };
          node.textContent = '0';
          gsap.to(counter, { v: to, duration: 1.3, ease: 'power2.out', onUpdate: () => { node.textContent = String(Math.round(counter.v)); }, scrollTrigger: { trigger: node, start: 'top 90%', once: true } });
        });
        const reveal = (sel: string, trigger: string, vars: gsap.TweenVars = {}) => {
          if (!q(sel).length) return;
          gsap.from(q(sel), { opacity: 0, y: 36, duration: 0.9, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: q(trigger)[0], start: 'top 82%', once: true }, ...vars });
        };
        reveal('.nx-pf-why-card', '.nx-pf-why-grid');
        reveal('.nx-pf-step', '.nx-pf-steps', { y: 28, stagger: 0.14 });
        reveal('.nx-pf-match-grid > *', '.nx-pf-match-grid', { y: 28, stagger: 0.12 });
        gsap.from(q('.nx-pf-ask-card'), { opacity: 0, y: 40, scale: 0.98, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: q('.nx-pf-ask')[0], start: 'top 80%' } });
      }, el);
      ready();
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(() => { if (!cancelled) refresh(); });
      jumpToHash();
      revert = () => { window.removeEventListener('load', refresh); ctx.revert(); };
    }).catch(() => { if (!cancelled) ready(); });

    return () => { cancelled = true; window.clearTimeout(fallback); revert?.(); };
  }, [detail]);

  if (detail && !division) return <NotFound theme={theme} page={`customers/${detail}`} />;

  const live = liveFor(division?.id);
  const wall = live.filter((item) => item.place !== 'In-house');
  const name = division
    ? voiced({ neo: neoSectionName(division) as string, trust: divisionLabel(division.id, 'trust') }, theme)
    : '';
  const title = division ? t(copy.hero.divisionTitle).replace('%s', name) : t(copy.hero.title);
  const accent = division ? t(copy.hero.divisionAccent) : t(copy.hero.accent);
  const body = division ? t(copy.hero.divisionBody) : t(copy.hero.body);
  const lines = division ? [name, t(copy.hero.divisionLine)] : [...copy.hero.lines[theme]];

  const BLOCKS: Record<ProofBlock, () => React.ReactNode> = {
    hero: () => (
      <section className="nx-pf-hero" id="overview">
        <div className="nx-pf-wrap nx-pf-hero-grid">
          <div>
            <p className="nx-pf-kicker">{name ? `${name} / ${t(copy.hero.kicker)}` : t(copy.hero.kicker)}</p>
            <h1 className="nx-pf-h1">
              {lines.map((line) => <span className="nx-pf-ln" key={line}><span>{line}</span></span>)}
            </h1>
            <p className="nx-pf-leave">{accent}</p>
            <p className="nx-pf-lead">{body}</p>
          </div>
          <aside className="nx-pf-index" aria-label={t(copy.hero.wall)}>
            <div className="nx-pf-rec-head">
              <p>{t(copy.hero.wall)}</p>
              <span className="nx-pf-count" aria-hidden="true">{wall.length}</span>
            </div>
            <ul className="nx-pf-frames">
              {wall.map((item) => (
                <li key={item.url}>
                  <a className="nx-pf-frame" href={item.url} target="_blank" rel="noopener noreferrer">
                    <span className="nx-pf-why-logo nx-pf-frame-logo"><img src={item.logo} alt="" loading="lazy" decoding="async" /></span>
                    <span className="nx-pf-label">{item.name}</span>
                  </a>
                </li>
              ))}
              <li className="nx-pf-frame-you">
                <Link prefetch={false} href={routePath(theme, 'contact')}>
                  <span className="nx-pf-frame-plus" aria-hidden="true">+</span>
                  <b>{t(copy.hero.yours)}</b>
                  <span>{t(copy.hero.yoursCta)} <Arrow size={16} /></span>
                </Link>
              </li>
            </ul>
          </aside>
        </div>
      </section>
    ),
    facts: () => {
      if (division) return null;
      const counts = [CLIENTS.filter((c) => c.place !== 'In-house').length, 3, 1, 0];
      return (
        <section className="nx-pf-facts" aria-label={t(copy.facts.label)}>
          <dl className="nx-pf-wrap nx-pf-facts-grid">
            {copy.facts.items.map((item, i) => (
              <div className="nx-pf-fact" key={i}>
                <dt><b data-to={counts[i]}>{counts[i]}</b></dt>
                <dd>{t(item.label)}</dd>
              </div>
            ))}
          </dl>
        </section>
      );
    },
    builds: () => (
      <>
        <nav className="nx-pf-nav" aria-label={t(copy.builds.filterLabel)}>
          <div className="nx-pf-wrap">
            <Link
              prefetch={false}
              href={routePath(theme, 'customers')}
              className={!division ? 'is-active' : undefined}
              aria-current={!division ? 'page' : undefined}
            >
              {t(copy.builds.filterAll)}
              <span>{DATA.work.live.filter((item) => item.url).length}</span>
            </Link>
            {FILTERS.map((id) => (
              <Link
                prefetch={false}
                key={id}
                href={routePath(theme, 'customers', id)}
                data-track={TRACK[id]}
                className={division?.id === id ? 'is-active' : undefined}
                aria-current={division?.id === id ? 'page' : undefined}
              >
                {divisionLabel(id, theme)}
                <span>{liveFor(id).length}</span>
              </Link>
            ))}
          </div>
        </nav>
        <Builds theme={theme} divisionId={division?.id} hideFilters />
      </>
    ),
    why: () => {
      if (division) return null;
      const logos = CLIENTS.filter((c) => c.place !== 'In-house');
      return (
        <section className="nx-pf-sec nx-pf-why" id="why" aria-labelledby="nx-pf-why-h">
          <div className="nx-pf-wrap">
            <header className="nx-pf-sec-head">
              <p className="nx-pf-kicker">{t(copy.why.kicker)}</p>
              <h2 className="nx-pf-h2" id="nx-pf-why-h">{t(copy.why.title)}</h2>
              <p className="nx-pf-sec-lede">{t(copy.why.lede)}</p>
            </header>
            <ul className="nx-pf-why-grid">
              {copy.why.cards.map((card, i) => (
                <li className={`nx-pf-why-card nx-pf-why-card--${i + 1}`} data-track={WHY_TRACKS[i % 3]} key={i}>
                  <span className="nx-pf-why-ico">{WHY_ICONS[i]}</span>
                  <h3>{t(card.title)}</h3>
                  <p>{t(card.body)}</p>
                  {i === copy.why.cards.length - 1 && (
                    <span className="nx-pf-why-logos" aria-hidden="true">
                      {logos.map((c) => <span className="nx-pf-why-logo" key={c.url}><img src={c.logo} alt="" loading="lazy" decoding="async" /></span>)}
                      <span className="nx-pf-why-logo nx-pf-why-logo--you">{t(copy.why.yours)}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    },
    how: () => {
      if (division) return null;
      return (
        <section className="nx-pf-sec nx-pf-how" id="how" aria-labelledby="nx-pf-how-h">
          <div className="nx-pf-wrap">
            <header className="nx-pf-sec-head">
              <p className="nx-pf-kicker">{t(copy.how.kicker)}</p>
              <h2 className="nx-pf-h2" id="nx-pf-how-h">{t(copy.how.title)}</h2>
              <p className="nx-pf-sec-lede">{t(copy.how.lede)}</p>
            </header>
            <ol className="nx-pf-steps">
              {copy.how.steps.map((step, i) => (
                <li className="nx-pf-step" key={i}>
                  <span className="nx-pf-step-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{t(step.title)}</h3>
                  <p>{t(step.body)}</p>
                  <span className="nx-pf-gate"><Tick /><span><small>{t(copy.how.gate)}</small>{t(step.gate)}</span></span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      );
    },
    match: () => {
      if (division) return null;
      const opt = copy.match.options[pick] ?? copy.match.options[0]!;
      const client = opt.client ? CLIENTS.find((c) => c.name === opt.client) : undefined;
      return (
        <section className="nx-pf-sec nx-pf-match" id="match" aria-labelledby="nx-pf-match-h">
          <div className="nx-pf-wrap">
            <header className="nx-pf-sec-head">
              <p className="nx-pf-kicker">{t(copy.match.kicker)}</p>
              <h2 className="nx-pf-h2" id="nx-pf-match-h">{t(copy.match.title)}</h2>
              <p className="nx-pf-sec-lede">{t(copy.match.lede)}</p>
            </header>
            <div className="nx-pf-match-grid">
              <div className="nx-pf-pick" role="group" aria-label={t(copy.match.title)}>
                {copy.match.options.map((o, i) => (
                  <button type="button" key={o.id} data-track={TRACK[o.team]} className={i === pick ? 'is-active' : undefined} aria-pressed={i === pick} onClick={() => setPick(i)}>
                    <span>{t(o.label)}</span><Arrow size={16} />
                  </button>
                ))}
              </div>
              <article className="nx-pf-result" key={opt.id} data-track={TRACK[opt.team]} aria-live="polite">
                <p className="nx-pf-result-k">{t(copy.match.handled)}</p>
                <h3>{divisionLabel(opt.team, theme)}</h3>
                <p className="nx-pf-result-line">{t(opt.line)}</p>
                <div className="nx-pf-result-proof">
                  <p className="nx-pf-result-k">{t(copy.match.proof)}</p>
                  {client ? (
                    <a href={client.url} target="_blank" rel="noopener noreferrer" className="nx-pf-result-client">
                      <span className="nx-pf-why-logo"><img src={client.logo} alt="" loading="lazy" decoding="async" /></span>
                      <span><b>{client.name}</b><small>{client.line}</small></span>
                      <span className="nx-pf-result-open">{t(copy.match.open)} ↗</span>
                    </a>
                  ) : (
                    <p className="nx-pf-result-none">{t(copy.match.noProof)}</p>
                  )}
                </div>
                <div className="nx-pf-result-actions">
                  <Link prefetch={false} className="nx-pf-cta" href={routePath(theme, 'contact')}>{t(copy.match.cta)} <Arrow /></Link>
                  <Link prefetch={false} className="nx-text-link" href={routePath(theme, opt.team)}>{t(copy.match.team)} →</Link>
                </div>
              </article>
            </div>
          </div>
        </section>
      );
    },
    cta: () => (
      <section className="nx-pf-ask" id="ask" aria-label={t(copy.cta.title)}>
        <div className="nx-pf-wrap">
          <div className="nx-pf-ask-card">
            <h2>{t(copy.cta.title)}</h2>
            <p>{t(copy.cta.body)}</p>
            <Link prefetch={false} className="nx-pf-cta nx-pf-cta--lg" href={routePath(theme, 'contact')}>
              {t(copy.cta.primary)} <Arrow />
            </Link>
            <p className="nx-pf-reach">
              {t(copy.cta.call)} <a href={DATA.contact.phone.href}>{DATA.contact.phone.display}</a>
              <span aria-hidden="true"> · </span>
              {t(copy.cta.visit)} <a href={DATA.contact.address.mapsHref} target="_blank" rel="noopener noreferrer">{DATA.contact.address.street.split(',').pop()!.trim()}, Visakhapatnam</a>
            </p>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <main className="nx-pf" ref={root}>
      {PROOF_FLOW.map((block) => <React.Fragment key={block}>{BLOCKS[block]()}</React.Fragment>)}
      {!division && (
        <FaqBand
          theme={theme}
          copy={{ kicker: { neo: 'Questions', trust: 'Questions' }, title: { neo: 'About the work.', trust: 'About the delivery record.' } }}
          faqs={LOCAL_FAQS.customers || []}
          sectionId="faqs"
        />
      )}
      <PageFinder
        label={t(COPY.finder.customers.label)}
        overview={t(COPY.finder.overview)}
        items={finderItems('customers', theme)}
        cta={{ label: t(COPY.finder.customers.cta), href: routePath(theme, 'contact') }}
      />
    </main>
  );
}
