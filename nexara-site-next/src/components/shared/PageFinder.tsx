'use client';
import React from 'react';
import Link from 'next/link';
import { getLenis } from '../useSmoothScroll';

// The bottom section bar, one component for every page and both themes. Mount it inside the page's
// <main>: hero/end selectors are looked up there, and the bar picks up that page's colour tokens
// (`.nx-mk .nx-finder` etc. in shared.css). The query shows the section you're in; each section
// fills as you read it; the CTA is the page's next step.

export interface FinderItem { id: string; label: string; track?: string }
// '#id' scrolls within the page; anything else is a route.
export interface FinderCta { label: string; href: string }

const Arrow = () => (
  <svg width={16} height={16} viewBox="0 0 18 18" aria-hidden="true">
    <path d="M3 9h11M10 4.5L14.5 9 10 13.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const chromeTop = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nx-chrome-top')) || 72;

export function scrollToSection(id: string) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = id === 'overview' ? null : document.getElementById(id);
  if (id !== 'overview' && !el) return;
  const target = el ? Math.max(0, el.getBoundingClientRect().top + window.scrollY - chromeTop() - 16) : 0;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(target, { immediate: reduced });
  else window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
  history.replaceState(null, '', '#' + id);
  requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
}

export function PageFinder({
  label,
  overview,
  items,
  cta,
  hero = '#overview',
  end = '#ask',
  spyEnd,
  yieldTo = false,
}: {
  label: string;
  overview: string;
  items: FinderItem[];
  cta?: FinderCta;
  /** Selector (within the page) for the hero; the bar shows once it has mostly scrolled away. */
  hero?: string;
  /** Selector (within the page) for the closing ask; the bar hides when it comes on screen. The footer always hides it. */
  end?: string;
  /** Selector past which no section is current (defaults to `end`). */
  spyEnd?: string;
  /** Step aside for another bottom dock (Marketing's mobile phase record). */
  yieldTo?: boolean;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const segs = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const list = React.useRef(items);
  list.current = items;
  const [shown, setShown] = React.useState(false);
  const [current, setCurrent] = React.useState('overview');
  const ids = items.map((item) => item.id).join(' ');

  React.useEffect(() => {
    const scope = ref.current?.parentElement;
    if (!scope) return;
    const spy = () => {
      const line = chromeTop() + 68;
      const vh = window.innerHeight;
      let id = 'overview';
      list.current.forEach((item, i) => {
        const box = document.getElementById(item.id)?.getBoundingClientRect();
        if (box && box.top <= line) id = item.id;
        const read = box ? Math.min(1, Math.max(0, (line - box.top) / Math.max(box.height, 1))) : 0;
        segs.current[i]?.style.setProperty('--p', String(read));
      });
      const endBox = end ? scope.querySelector(end)?.getBoundingClientRect() : undefined;
      const doneBox = spyEnd ? scope.querySelector(spyEnd)?.getBoundingClientRect() : endBox;
      if (doneBox && doneBox.top <= line) id = '';
      setCurrent(id);
      const heroBox = scope.querySelector(hero)?.getBoundingClientRect();
      const heroGone = heroBox ? heroBox.bottom < vh * 0.35 : window.scrollY > vh * 0.6;
      const footerTop = document.querySelector('.nx-footer')?.getBoundingClientRect().top ?? Infinity;
      const endHere = (!!endBox && endBox.top < vh * 0.8) || footerTop < vh;
      setShown(heroGone && !endHere);
    };
    spy();
    // Hash jumps, accordions and GSAP pins move content without a native scroll event.
    const layout = new ResizeObserver(() => spy());
    layout.observe(scope);
    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', spy);
    return () => { layout.disconnect(); window.removeEventListener('scroll', spy); window.removeEventListener('resize', spy); };
  }, [ids, hero, end, spyEnd]);

  const go = (id: string) => (event: React.MouseEvent) => { event.preventDefault(); scrollToSection(id); };
  const currentIndex = current ? items.findIndex((item) => item.id === current) : items.length;
  const query = current === 'overview' ? overview : items.find((item) => item.id === current)?.label ?? cta?.label ?? overview;
  const tint = items.find((item) => item.id === current)?.track;

  return (
    <nav
      ref={ref}
      className={`nx-finder${shown ? ' is-shown' : ''}${yieldTo ? ' is-yield' : ''}`}
      aria-label={label}
      data-track={tint}
      inert={!shown}
    >
      <a className="nx-finder-q" href="#overview" onClick={go('overview')} aria-current={current === 'overview' ? 'location' : undefined}>
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <strong key={query}>{query}</strong>
        <i className="nx-finder-caret" aria-hidden="true" />
      </a>
      <span className="nx-finder-segs">
        {items.map((item, i) => (
          <a
            key={item.id}
            ref={(node) => { segs.current[i] = node; }}
            href={'#' + item.id}
            data-track={item.track}
            className={current === item.id ? 'is-current' : i < currentIndex ? 'is-done' : undefined}
            aria-current={current === item.id ? 'location' : undefined}
            onClick={go(item.id)}
          >
            <span className="nx-finder-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <span className="nx-finder-l">{item.label}</span>
            <i aria-hidden="true" />
          </a>
        ))}
      </span>
      {cta && (cta.href.startsWith('#')
        ? <a className="nx-finder-cta" href={cta.href} onClick={go(cta.href.slice(1))}>{cta.label} <Arrow /></a>
        : <Link prefetch={false} className="nx-finder-cta" href={cta.href}>{cta.label} <Arrow /></Link>)}
    </nav>
  );
}
