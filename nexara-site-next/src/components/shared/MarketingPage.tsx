'use client';
import React from 'react';
import Link from 'next/link';
import { DATA } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { routePath, marketingFaqs } from '@/lib/seo';
import { MARKETING_FLOW, MARKETING_TRACKS, voiced, type MarketingBlock, type Theme } from '@/lib/site';
import { getLenis } from '../useSmoothScroll';
import { PageFinder } from './PageFinder';

// The marketing page: one scroll, shared by Neo and Trust. Order comes from MARKETING_FLOW, wording from
// COPY.marketing + DATA.sections.marketing (voiced pairs), skin from the --nx-mk-* tokens in shared.css.
// GSAP is loaded on demand in the effect; without it (or with reduced motion) the page is fully static.

const MARKETING = DATA.sections.marketing;
const PAGE = MARKETING.page;
const TRACKS = MARKETING_TRACKS.map((slug) => MARKETING.subpages.find((p) => p.slug === slug)!);
const Arrow = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
    <path d="M3 9h11M10 4.5L14.5 9 10 13.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function MarketingPage({ theme }: { theme: Theme }) {
  const t = <T,>(value: { neo: T; trust: T }) => voiced(value, theme);
  const copy = COPY.marketing;
  const faqs = marketingFaqs(theme);

  const root = React.useRef<HTMLElement>(null);
  const [reached, setReached] = React.useState(0);
  const [dock, setDock] = React.useState(false);
  const [open, setOpen] = React.useState<number[]>([0]);


  // Nothing is stuck to the top any more, so anchors land just under the SiteNav.
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

  // Mobile progress dock: visible while the phases are on screen.
  React.useEffect(() => {
    const phases = root.current?.querySelector('.nx-mk-phases');
    if (!phases || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setDock(Boolean(entry?.isIntersecting)), { rootMargin: '-50% 0px -40% 0px' });
    io.observe(phases);
    return () => io.disconnect();
  }, []);

  // Motion. Reduced motion (or no GSAP) keeps everything visible and fills the record as phases are reached.
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
      const observers = Array.from(el.querySelectorAll<HTMLElement>('.nx-mk-phase')).map((phase, i) => {
        const io = new IntersectionObserver(([entry]) => {
          if (entry && (entry.isIntersecting || entry.boundingClientRect.top < 0)) reach(i + 1);
        }, { rootMargin: '0px 0px -45% 0px' });
        io.observe(phase);
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
        const query = el.querySelector<HTMLElement>('.nx-mk-query strong');
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.from(q('.nx-mk-ln > span'), { yPercent: 105, duration: 1.1, stagger: 0.12 })
          .from(q('.nx-mk-engine'), { y: 40, opacity: 0, scale: 0.97, duration: 1, ease: 'power3.out' }, 0.25);
        if (query) tl.fromTo(query, { maxWidth: 0 }, { maxWidth: query.scrollWidth + 2, duration: 0.9, ease: 'steps(17)', clearProps: 'maxWidth' }, 0.75);
        tl.from(q('.nx-mk-results li'), { opacity: 0, y: 12, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, 1.55)
          .from(q('.nx-mk-miss'), { opacity: 0, scale: 0.6, duration: 0.45, stagger: 0.1, ease: 'back.out(2.4)' }, 1.75)
          .from(q('.nx-mk-leave'), { opacity: 0, y: 14, duration: 0.8, ease: 'power3.out' }, 2.25);

        // Story: words ink in as you read.
        gsap.fromTo(q('.nx-mk-w'), { opacity: 0.16 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: q('.nx-mk-story')[0], start: 'top 70%', end: 'bottom 55%', scrub: 0.6 } });

        // Phases: rail fill + the record fills phase by phase.
        const phasesEl = q('.nx-mk-phases')[0];
        gsap.to(q('.nx-mk-rail i'), { scaleY: 1, ease: 'none', scrollTrigger: { trigger: phasesEl, start: 'top 55%', end: 'bottom 65%', scrub: 0.4 } });
        q('.nx-mk-phase').forEach((phase, i) => {
          ScrollTrigger.create({ trigger: phase, start: 'top 55%', onEnter: () => reach(i + 1), onLeaveBack: () => setReached(i) });
          gsap.from(phase.querySelectorAll('h2, p'), { opacity: 0, y: 22, duration: 0.8, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: phase, start: 'top 80%' } });
        });
        gsap.from(q('.nx-mk-record'), { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: q('.nx-mk-stage')[0], start: 'top 80%' } });

        // Service lines: rule draws, heading lifts, rows cascade.
        q('.nx-mk-track').forEach((track) => {
          gsap.fromTo(track, { '--rule': 0 }, { '--rule': 1, duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: track, start: 'top 85%' } });
          gsap.from(track.querySelectorAll('.nx-mk-track-head > *'), { opacity: 0, y: 26, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: track, start: 'top 70%' } });
          gsap.from(track.querySelectorAll('.nx-mk-row'), { opacity: 0, x: 40, duration: 0.9, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: track, start: 'top 60%' } });
        });

        const rise = (sel: string, trigger: string, y: number, stagger: number, start = 'top 82%') =>
          gsap.from(q(sel), { opacity: 0, y, duration: 0.85, stagger, ease: 'power3.out', scrollTrigger: { trigger: q(trigger)[0], start } });
        rise('.nx-mk-starts li', '.nx-mk-starts', 28, 0.1, 'top 80%');
        rise('.nx-mk-who p', '.nx-mk-who', 24, 0.1);
        rise('.nx-mk-proof p', '.nx-mk-proof', 40, 0.12);
        gsap.from(q('.nx-mk-ask-card'), { opacity: 0, y: 40, scale: 0.98, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: q('.nx-mk-ask')[0], start: 'top 80%' } });
        gsap.from(q('.nx-mk-ask-card > *'), { opacity: 0, y: 20, duration: 0.8, stagger: 0.1, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: q('.nx-mk-ask')[0], start: 'top 80%' } });
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
  const lastTrack = reached ? PAGE.phases[reached - 1]!.track : undefined;

  const BLOCKS: Record<MarketingBlock, () => React.ReactNode> = {
    hero: () => (
      <section className="nx-mk-hero" id="overview">
        <div className="nx-mk-wrap nx-mk-hero-grid">
          <div>
            <h1 className="nx-mk-h1">{t(PAGE.hero.lines).map((line) => <span className="nx-mk-ln" key={line}><span>{line}</span></span>)}</h1>
            <p className="nx-mk-leave">{t(PAGE.hero.leave)}</p>
          </div>
          <div className="nx-mk-engine">
            <div className="nx-mk-query">
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              <span>{t(copy.search)}</span>
              <strong>{t(PAGE.hero.query)}</strong>
              <i className="nx-mk-caret" aria-hidden="true" />
            </div>
            <ul className="nx-mk-results">
              {PAGE.hero.results.map((r) => <li key={r.trust}><span>{t(r)}</span><span className="nx-mk-miss">{t(PAGE.hero.miss)}</span></li>)}
            </ul>
          </div>
        </div>
      </section>
    ),
    story: () => (
      <section className="nx-mk-story">
        <div className="nx-mk-wrap">
          <p>{t(PAGE.story).split(' ').map((word, i) => <React.Fragment key={i}>{i > 0 && ' '}<span className="nx-mk-w">{word}</span></React.Fragment>)}</p>
        </div>
      </section>
    ),
    phases: () => (
      <div className="nx-mk-wrap nx-mk-stage">
        <div className="nx-mk-phases">
          <div className="nx-mk-rail" aria-hidden="true" data-track={lastTrack}><i /></div>
          {PAGE.phases.map((p, i) => (
            <article className={`nx-mk-phase${i < reached ? ' is-on' : ''}`} data-track={p.track} key={i}>
              <div className="nx-mk-n">{i + 1}</div>
              <h2>{t(p.title)}</h2>
              <p className="nx-mk-lead">{t(p.body)}</p>
              <p className="nx-mk-incl">{t(p.includes)}</p>
              <p className="nx-mk-goal">{t(p.goal)}</p>
            </article>
          ))}
        </div>
        <div className="nx-mk-record-col">
          <aside className="nx-mk-record" aria-label={t(copy.record)}>
            <div className="nx-mk-rec-head">
              <p>{t(copy.record)}</p>
              <span className="nx-mk-count" aria-hidden="true"><b>{reached}</b><small>/{PAGE.record.length}</small></span>
            </div>
            <div className="nx-mk-segs" aria-hidden="true">
              {PAGE.record.map((r, i) => <i key={r.label} data-track={PAGE.phases[i]!.track} className={i < reached ? 'is-on' : undefined} />)}
            </div>
            <ol>
              {PAGE.record.map((r, i) => {
                const found = i < reached;
                return (
                  <li key={r.label} data-track={PAGE.phases[i]!.track} className={found ? 'is-found' : undefined}>
                    <span className="nx-mk-tick" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M3.5 7.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    <span className="nx-mk-label">{r.label}</span>
                    <span className="nx-mk-state" key={found ? 'found' : 'miss'}>{t(found ? r.found : r.miss)}</span>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>
      </div>
    ),
    tracks: () => TRACKS.map((track) => (
      <section className="nx-mk-track" id={track.slug} data-track={track.slug} key={track.slug} aria-labelledby={`nx-mk-${track.slug}-h`}>
        <div className="nx-mk-wrap nx-mk-track-grid">
          <div className="nx-mk-track-head">
            <p className="nx-mk-kicker">{track.title}</p>
            <h2 id={`nx-mk-${track.slug}-h`}>{t(track.heading)}</h2>
            <p className="nx-mk-callout">{t(track.callout)}</p>
          </div>
          <ul className="nx-mk-rows">
            {track.cards.map((card) => <li className="nx-mk-row" key={card.title}><h3>{card.title}</h3><p>{card[theme]}</p></li>)}
          </ul>
        </div>
      </section>
    )),
    starts: () => (
      <div className="nx-mk-wrap nx-mk-block" data-spy-end>
        <h2 className="nx-mk-sec-h">{t(copy.starts)}</h2>
        <ul className="nx-mk-starts">
          {TRACKS.map((track, i) => (
            <li key={track.slug} data-track={track.slug}>
              <a className="nx-mk-start" href={'#' + track.slug} onClick={onAnchor(track.slug)}>
                <h3>{track.title}</h3>
                <p>{t(PAGE.starts[i]!)}</p>
                <span className="nx-mk-go" aria-hidden="true"><Arrow /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    ),
    who: () => (
      <div className="nx-mk-wrap nx-mk-block">
        <h2 className="nx-mk-sec-h">{t(copy.who)}</h2>
        <div className="nx-mk-who">{PAGE.who.map((line, i) => <p key={i} data-track={MARKETING_TRACKS[i]}>{t(line)}</p>)}</div>
      </div>
    ),
    proof: () => (
      <div className="nx-mk-wrap nx-mk-block">
        <h2 className="nx-mk-sec-h">{t(copy.proof)}</h2>
        <div className="nx-mk-proof">{MARKETING.proof.map((item) => <p key={item.name}><strong>{item.name}.</strong> {t(item.result)}.</p>)}</div>
      </div>
    ),
    faqs: () => (
      <div className="nx-mk-wrap nx-mk-block nx-mk-faq-grid">
        <h2 className="nx-mk-sec-h">{t(copy.faqs)}</h2>
        <dl className="nx-mk-faqs">
          {faqs.map(([question, answer], i) => {
            const isOpen = open.includes(i);
            return (
              <div key={question}>
                <dt>
                  <button type="button" aria-expanded={isOpen} aria-controls={`nx-mk-faq-${i}`} onClick={() => toggleFaq(i)}>
                    {question}<span className="nx-mk-plus" aria-hidden="true" />
                  </button>
                </dt>
                <dd id={`nx-mk-faq-${i}`} className={isOpen ? undefined : 'is-shut'}><span><span>{answer}</span></span></dd>
              </div>
            );
          })}
        </dl>
      </div>
    ),
    ask: () => (
      <section className="nx-mk-ask" id="ask">
        <div className="nx-mk-wrap">
          <div className="nx-mk-ask-card">
            <h2>{t(copy.ask.title)}</h2>
            <p>{t(copy.ask.body)}</p>
            <Link prefetch={false} className="nx-mk-cta nx-mk-cta--lg" href={routePath(theme, 'contact', 'marketing')}>{t(copy.ask.cta)} <Arrow /></Link>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <main className="nx-mk" ref={root}>
      {MARKETING_FLOW.map((block) => <React.Fragment key={block}>{BLOCKS[block]()}</React.Fragment>)}
      <PageFinder
        label={t(copy.nav.label)}
        overview={t(copy.nav.overview)}
        items={TRACKS.map((track) => ({ id: track.slug, label: track.title, track: track.slug }))}
        cta={{ label: t(copy.nav.cta), href: '#ask' }}
        spyEnd="[data-spy-end]"
        yieldTo={dock}
      />
      <div className={`nx-mk-dock${dock ? ' is-shown' : ''}`} aria-hidden="true">
        <span className="nx-mk-bars">{PAGE.record.map((r, i) => <i key={r.label} data-track={PAGE.phases[i]!.track} className={i < reached ? 'is-on' : undefined} />)}</span>
        <span className="nx-mk-count"><b>{reached}</b><small>/{PAGE.record.length}</small></span>
      </div>
    </main>
  );
}
