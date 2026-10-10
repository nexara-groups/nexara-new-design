'use client';
import React from 'react';
import Link from 'next/link';
import { DATA } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { routePath, academyFaqs } from '@/lib/seo';
import { ACADEMY_FLOW, ACADEMY_TRACKS, ACADEMY_TRACK_ROLES, voiced, type AcademyBlock, type Theme } from '@/lib/site';
import { getLenis } from '../useSmoothScroll';
import { PageFinder } from './PageFinder';

// Proof Portfolio: one scroll, Neo + Trust. Structure ACADEMY_FLOW; wording COPY.academy + DATA;
// skin --nx-ac-* in shared.css. Distinct from MarketingPage (no nx-mk layout reuse).

const ACADEMY = DATA.sections.academy;
const PAGE = ACADEMY.page;
const LANES = ACADEMY_TRACKS.map((slug) => ACADEMY.subpages.find((p) => p.slug === slug)!);
// Stamps unlock in pairs as each runway node is reached (4 nodes → 6 stamps).
const STAMPS_PER_NODE = [2, 4, 5, 6] as const;

const Arrow = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
    <path d="M3 9h11M10 4.5L14.5 9 10 13.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function AcademyPage({ theme }: { theme: Theme }) {
  const t = <T,>(value: { neo: T; trust: T }) => voiced(value, theme);
  const copy = COPY.academy;
  const faqs = academyFaqs(theme);

  const root = React.useRef<HTMLElement>(null);
  const [reached, setReached] = React.useState(0);
  const [fitFocus, setFitFocus] = React.useState(0);
  const [open, setOpen] = React.useState<number[]>([0]);

  const stampCount = reached > 0 ? STAMPS_PER_NODE[Math.min(reached, STAMPS_PER_NODE.length) - 1]! : 0;

  const anchorOffset = React.useCallback(() => {
    const chrome = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nx-chrome-top')) || 72;
    return chrome + 16;
  }, []);

  const go = React.useCallback((id: string, instant = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = id === 'overview' ? 0 : Math.max(0, el.getBoundingClientRect().top + window.scrollY - anchorOffset());
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { immediate: instant || reduced });
    else window.scrollTo({ top: target, behavior: instant || reduced ? 'auto' : 'smooth' });
    history.replaceState(null, '', '#' + id);
    requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
  }, [anchorOffset]);

  const onAnchor = (id: string) => (event: React.MouseEvent) => { event.preventDefault(); go(id); };

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    const ready = () => el.classList.add('is-ready');
    const fallback = window.setTimeout(ready, 2500);
    const jumpToHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (id && el.querySelector('#' + CSS.escape(id))) window.setTimeout(() => go(id, true), 60);
    };
    const reach = (n: number) => setReached((r) => Math.max(r, n));
    const staticFill = () => {
      const observers = Array.from(el.querySelectorAll<HTMLElement>('.nx-ac-node')).map((node, i) => {
        const io = new IntersectionObserver(([entry]) => {
          if (entry && (entry.isIntersecting || entry.boundingClientRect.top < 0)) reach(i + 1);
        }, { rootMargin: '0px 0px -40% 0px' });
        io.observe(node);
        return io;
      });
      return () => observers.forEach((io) => io.disconnect());
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ready();
      revert = staticFill();
      jumpToHash();
      return () => { window.clearTimeout(fallback); revert?.(); };
    }

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const q = (s: string) => el.querySelectorAll(s);
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.from(q('.nx-ac-brand'), { opacity: 0, y: 16, duration: 0.7 })
          .from(q('.nx-ac-ln > span'), { yPercent: 105, duration: 1.1, stagger: 0.12 }, 0.15)
          .from(q('.nx-ac-folio'), { y: 36, opacity: 0, duration: 1, ease: 'power3.out' }, 0.2)
          .fromTo(q('.nx-ac-folio-cover'), { scaleX: 1 }, { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'power3.inOut' }, 0.55)
          .from(q('.nx-ac-slot'), { opacity: 0, y: 18, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, 1.1)
          .from(q('.nx-ac-demo-slot'), { opacity: 0, scale: 0.92, duration: 0.55, ease: 'power3.out' }, 1.3)
          .from(q('.nx-ac-chip'), { opacity: 0, scale: 0.6, duration: 0.45, stagger: 0.1, ease: 'back.out(2.4)' }, 1.45)
          .from(q('.nx-ac-leave'), { opacity: 0, y: 14, duration: 0.75, ease: 'power3.out' }, 1.8);

        gsap.fromTo(q('.nx-ac-w'), { opacity: 0.16 }, {
          opacity: 1, stagger: 0.05, ease: 'none',
          scrollTrigger: { trigger: q('.nx-ac-thesis')[0], start: 'top 70%', end: 'bottom 55%', scrub: 0.6 },
        });

        const runway = q('.nx-ac-runway')[0];
        gsap.fromTo(q('.nx-ac-path-fill'), { scaleX: 0 }, {
          scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: runway, start: 'top 60%', end: 'bottom 50%', scrub: 0.45 },
        });
        q('.nx-ac-node').forEach((node, i) => {
          ScrollTrigger.create({
            trigger: node,
            start: 'top 62%',
            onEnter: () => reach(i + 1),
            onLeaveBack: () => setReached(i),
          });
          gsap.from(node, {
            opacity: 0, y: 28, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: node, start: 'top 82%' },
          });
        });
        gsap.from(q('.nx-ac-dossier'), {
          opacity: 0, y: 28, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: runway, start: 'top 75%' },
        });

        q('.nx-ac-lane').forEach((lane) => {
          gsap.from(lane, {
            clipPath: 'inset(0 0 100% 0)', opacity: 0.4, duration: 0.95, ease: 'power3.out',
            scrollTrigger: { trigger: lane, start: 'top 78%' },
          });
          gsap.from(lane.querySelectorAll('.nx-ac-deliver'), {
            opacity: 0, y: 22, duration: 0.7, stagger: 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: lane, start: 'top 70%' },
          });
        });

        gsap.from(q('.nx-ac-fit-row'), {
          opacity: 0, x: -24, duration: 0.75, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: q('.nx-ac-fit')[0], start: 'top 78%' },
        });
        gsap.from(q('.nx-ac-receipt'), {
          opacity: 0, y: 32, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: q('.nx-ac-proof')[0], start: 'top 80%' },
        });
        gsap.from(q('.nx-ac-ask-card'), {
          opacity: 0, y: 36, scale: 0.98, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: q('.nx-ac-ask')[0], start: 'top 80%' },
        });
        gsap.from(q('.nx-ac-ask-ring'), {
          scale: 0.6, opacity: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: q('.nx-ac-ask')[0], start: 'top 80%' },
        });
      }, el);
      ready();
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(() => { if (!cancelled) refresh(); });
      jumpToHash();
      revert = () => { window.removeEventListener('load', refresh); ctx.revert(); };
    }).catch(() => { if (!cancelled) { ready(); revert = staticFill(); } });

    return () => { cancelled = true; window.clearTimeout(fallback); revert?.(); };
  }, [go]);

  const toggleFaq = (i: number) => setOpen((list) => (list.includes(i) ? list.filter((n) => n !== i) : [...list, i]));

  const BLOCKS: Record<AcademyBlock, () => React.ReactNode> = {
    hero: () => (
      <section className="nx-ac-hero" id="overview">
        <div className="nx-ac-wrap nx-ac-hero-grid">
          <div className="nx-ac-hero-copy">
            <p className="nx-ac-brand">{t(PAGE.hero.brand)}</p>
            <h1 className="nx-ac-h1">
              {t(PAGE.hero.lines).map((line) => (
                <span className="nx-ac-ln" key={line}><span>{line}</span></span>
              ))}
            </h1>
            <p className="nx-ac-leave">{t(PAGE.hero.leave)}</p>
          </div>
          <div className="nx-ac-folio" aria-label={t(copy.portfolio)}>
            <div className="nx-ac-folio-cover" aria-hidden="true">
              <span className="nx-ac-folio-mark">{PAGE.hero.initials}</span>
              <span className="nx-ac-folio-title">{t(copy.portfolio)}</span>
            </div>
            <div className="nx-ac-folio-inner">
              <ul className="nx-ac-slots">
                {PAGE.hero.slots.map((slot, i) => (
                  <li className="nx-ac-slot" key={slot.trust}>
                    <span>{t(slot)}</span>
                    <span className="nx-ac-chip">{t(PAGE.hero.miss[i]!)}</span>
                  </li>
                ))}
              </ul>
              <div className="nx-ac-demo-slot">
                <span>{t(PAGE.hero.demo)}</span>
                <span className="nx-ac-chip">{t(PAGE.hero.miss[2]!)}</span>
                <i className="nx-ac-pulse" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
    thesis: () => (
      <section className="nx-ac-thesis">
        <div className="nx-ac-wrap">
          <p>
            {t(PAGE.thesis).split(' ').map((word, i) => (
              <React.Fragment key={i}>{i > 0 && ' '}<span className="nx-ac-w">{word}</span></React.Fragment>
            ))}
          </p>
        </div>
      </section>
    ),
    runway: () => (
      <section className="nx-ac-runway" aria-labelledby="nx-ac-runway-h">
        <div className="nx-ac-wrap">
          <div className="nx-ac-runway-head">
            <h2 id="nx-ac-runway-h">{t(copy.runway)}</h2>
            <p className="nx-ac-runway-lead">Map → Cohort → Proof → Place</p>
          </div>
          <div className="nx-ac-runway-grid">
            <div className="nx-ac-path" aria-hidden="true">
              <i className="nx-ac-path-line" />
              <i className="nx-ac-path-fill" />
            </div>
            <ol className="nx-ac-nodes">
              {PAGE.runway.map((node, i) => (
                <li
                  key={node.path}
                  className={`nx-ac-node${i < reached ? ' is-on' : ''}`}
                  data-track={node.track}
                >
                  <span className="nx-ac-node-n">{i + 1}</span>
                  <h3>{node.path}</h3>
                  <p className="nx-ac-node-time">{node.timing}</p>
                  <p className="nx-ac-node-out">{t(node.outcome)}</p>
                  {node.opens && (
                    <a className="nx-ac-node-link" href={'#' + node.opens} onClick={onAnchor(node.opens)}>
                      {node.opensLabel} <Arrow size={14} />
                    </a>
                  )}
                </li>
              ))}
            </ol>
            <aside className="nx-ac-dossier" aria-label={t(copy.stamps)}>
              <div className="nx-ac-dossier-head">
                <p>{t(copy.stamps)}</p>
                <span className="nx-ac-count" aria-hidden="true">
                  <b>{stampCount}</b><small>/{PAGE.stamps.length}</small>
                </span>
              </div>
              <ol className="nx-ac-stamps">
                {PAGE.stamps.map((stamp, i) => {
                  const found = i < stampCount;
                  return (
                    <li key={stamp.label} data-track={stamp.track} className={found ? 'is-found' : undefined}>
                      <span className="nx-ac-tick" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 14 14">
                          <path d="M3.5 7.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="nx-ac-stamp-label">{stamp.label}</span>
                      <span className="nx-ac-stamp-state" key={found ? 'found' : 'miss'}>
                        {t(found ? stamp.found : stamp.miss)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </aside>
          </div>
        </div>
      </section>
    ),
    lanes: () => (
      <section className="nx-ac-lanes" aria-labelledby="nx-ac-lanes-h">
        <div className="nx-ac-wrap">
          <h2 id="nx-ac-lanes-h" className="nx-ac-sec-h">{t(copy.lanes)}</h2>
          <div className="nx-ac-lane-grid">
            {LANES.map((lane, i) => (
              <article
                key={lane.slug}
                className={`nx-ac-lane${i === 0 ? ' nx-ac-lane--primary' : ''}`}
                id={lane.slug}
                data-track={lane.role}
                aria-labelledby={`nx-ac-${lane.slug}-h`}
              >
                <p className="nx-ac-kicker">{lane.title}</p>
                <h3 id={`nx-ac-${lane.slug}-h`}>{t(lane.heading)}</h3>
                <p className="nx-ac-callout">{t(lane.callout)}</p>
                {i === 0 && <p className="nx-ac-stack-hint">{t(PAGE.stackHint)}</p>}
                <ul className="nx-ac-delivers">
                  {lane.cards.map((card) => (
                    <li className="nx-ac-deliver" key={card.title}>
                      <h4>{card.title}</h4>
                      <p>{card[theme]}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    ),
    fit: () => (
      <section className="nx-ac-fit" data-spy-end aria-labelledby="nx-ac-fit-h">
        <div className="nx-ac-wrap">
          <h2 id="nx-ac-fit-h" className="nx-ac-sec-h">{t(copy.fit)}</h2>
          <div className="nx-ac-fit-chips" role="tablist" aria-label={t(copy.fit)}>
            {PAGE.fit.map((row, i) => (
              <button
                key={row.audience}
                type="button"
                role="tab"
                aria-selected={fitFocus === i}
                className={fitFocus === i ? 'is-on' : undefined}
                data-track={row.track}
                onClick={() => setFitFocus(i)}
              >
                {row.audience}
                {row.role === 'primary' && <small>Primary</small>}
              </button>
            ))}
          </div>
          <ul className="nx-ac-fit-rows">
            {PAGE.fit.map((row, i) => (
              <li key={row.audience} data-track={row.track} className={fitFocus === i ? 'is-focus' : undefined}>
                <a className="nx-ac-fit-row" href={'#' + row.slug} onClick={onAnchor(row.slug)}>
                  <div>
                    <p className="nx-ac-fit-pkg">{row.package}</p>
                    <h3>{row.audience}</h3>
                    <p>{t(row.body)}</p>
                  </div>
                  <span className="nx-ac-go" aria-hidden="true"><Arrow /></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
    proof: () => (
      <section className="nx-ac-proof" id="proof" aria-labelledby="nx-ac-proof-h">
        <div className="nx-ac-wrap">
          <h2 id="nx-ac-proof-h" className="nx-ac-sec-h">{t(copy.proof)}</h2>
          <div className="nx-ac-receipts">
            {ACADEMY.proof.map((item, i) => (
              <p className="nx-ac-receipt" key={item.name} data-track={ACADEMY_TRACK_ROLES[i] ?? 'place'}>
                <strong>{item.name}</strong>
                <span>{t(item.result)}.</span>
                <small>{item.org}</small>
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
    faqs: () => (
      <section className="nx-ac-faqs-band" aria-labelledby="nx-ac-faqs-h">
        <div className="nx-ac-wrap">
          <h2 id="nx-ac-faqs-h" className="nx-ac-sec-h">{t(copy.faqs)}</h2>
          <dl className="nx-ac-faqs">
            {faqs.map(([question, answer], i) => {
              const isOpen = open.includes(i);
              return (
                <div key={question}>
                  <dt>
                    <button type="button" aria-expanded={isOpen} aria-controls={`nx-ac-faq-${i}`} onClick={() => toggleFaq(i)}>
                      {question}<span className="nx-ac-plus" aria-hidden="true" />
                    </button>
                  </dt>
                  <dd id={`nx-ac-faq-${i}`} className={isOpen ? undefined : 'is-shut'}>
                    <span><span>{answer}</span></span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>
    ),
    ask: () => (
      <section className="nx-ac-ask" id="ask">
        <div className="nx-ac-wrap">
          <div className="nx-ac-ask-card">
            <i className="nx-ac-ask-ring" aria-hidden="true" />
            <h2>{t(copy.ask.title)}</h2>
            <p>{t(copy.ask.body)}</p>
            <Link prefetch={false} className="nx-ac-cta nx-ac-cta--lg" href={routePath(theme, 'contact', 'academy')}>
              {t(copy.ask.cta)} <Arrow />
            </Link>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <main className="nx-ac" ref={root}>
      {ACADEMY_FLOW.map((block) => <React.Fragment key={block}>{BLOCKS[block]()}</React.Fragment>)}
      <PageFinder
        label={t(copy.nav.label)}
        overview={t(copy.nav.overview)}
        items={LANES.map((lane) => ({ id: lane.slug, label: lane.title, track: lane.slug }))}
        cta={{ label: t(copy.nav.cta), href: '#ask' }}
        spyEnd="[data-spy-end]"
      />
    </main>
  );
}
