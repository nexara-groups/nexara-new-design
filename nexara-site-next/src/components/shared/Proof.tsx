'use client';
import React from 'react';
import Link from 'next/link';
import { DATA, neoSectionName } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { PROOF_FLOW, divisionLabel, voiced, type ProofBlock, type Theme } from '@/lib/site';
import { LOCAL_FAQS, routePath } from '@/lib/seo';
import { FaqBand } from './FaqBand';
import { clientDomain } from '@/lib/clients';
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

function liveFor(divisionId?: string) {
  return DATA.work.live.filter((item) => item.url && (!divisionId || item.teams.includes(divisionId as 'marketing' | 'labs')));
}


export function Proof({ theme, detail }: { theme: Theme; detail: string | null }) {
  const t = <T,>(value: { neo: T; trust: T }) => voiced(value, theme);
  const copy = COPY.proof;
  const division = detail ? (DATA.sections as Record<string, Division | undefined>)[detail] ?? null : null;
  const root = React.useRef<HTMLElement>(null);
  const [viewed, setViewed] = React.useState<string[]>([]);

  const markViewed = React.useCallback((url: string) => {
    setViewed((list) => (list.includes(url) ? list : [...list, url]));
  }, []);

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
          .from(q('.nx-pf-index li'), { opacity: 0, y: 12, duration: 0.45, stagger: 0.08, ease: 'power3.out' }, 0.7)
          .from(q('.nx-pf-leave'), { opacity: 0, y: 14, duration: 0.8, ease: 'power3.out' }, 1.05);
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
  const name = division
    ? voiced({ neo: neoSectionName(division) as string, trust: divisionLabel(division.id, 'trust') }, theme)
    : '';
  const title = division ? t(copy.hero.divisionTitle).replace('%s', name) : t(copy.hero.title);
  const accent = division ? t(copy.hero.divisionAccent) : t(copy.hero.accent);
  const body = division ? t(copy.hero.divisionBody) : t(copy.hero.body);
  const lines = division ? [name, t(copy.hero.divisionLine)] : [...copy.hero.lines[theme]];
  const foundCount = live.filter((item) => viewed.includes(item.url)).length;

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
          <aside className="nx-pf-index" aria-label={t(copy.hero.record)}>
            <div className="nx-pf-rec-head">
              <p>{t(copy.hero.record)}</p>
              <span className="nx-pf-count" aria-hidden="true"><b>{foundCount}</b><small>/{live.length || 0}</small></span>
            </div>
            {live.length === 0 ? (
              <p className="nx-pf-empty">{t(copy.builds.empty)}</p>
            ) : (
              <ol>
                {live.map((item) => {
                  const found = viewed.includes(item.url);
                  return (
                    <li key={item.url} className={found ? 'is-found' : undefined}>
                      <span className="nx-pf-tick" aria-hidden="true"><Tick /></span>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <span className="nx-pf-label">{item.name}</span>
                        <span className="nx-pf-host">{clientDomain(item.url)}</span>
                      </a>
                      <span className="nx-pf-state" key={found ? 'done' : 'miss'}>{found ? t(copy.hero.done) : t(copy.hero.pending)}</span>
                    </li>
                  );
                })}
              </ol>
            )}
          </aside>
        </div>
      </section>
    ),
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
        <Builds theme={theme} divisionId={division?.id} onViewed={markViewed} />
      </>
    ),
    cta: () => (
      <section className="nx-pf-ask" id="ask" aria-label={t(copy.cta.title)}>
        <div className="nx-pf-wrap">
          <div className="nx-pf-ask-card">
            <h2>{t(copy.cta.title)}</h2>
            <p>{t(copy.cta.body)}</p>
            <Link prefetch={false} className="nx-pf-cta nx-pf-cta--lg" href={routePath(theme, 'contact')}>
              {t(copy.cta.primary)} <Arrow />
            </Link>
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
