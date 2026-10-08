'use client';
import React from 'react';
import Link from 'next/link';
import { routePath } from '@/lib/seo';
import { DATA } from '@/lib/data';
import { routeTo } from '@/lib/neo-router';
import { getLenis } from '../useSmoothScroll';
const { useState } = React;

// Minimal shape actually read by SubNav/BreadcrumbBar below — DATA.sections
// entries carry many more fields (hero, cards, faqs, etc.) that aren't typed
// here since this group never touches them.
type Subpage = {
  slug: string;
  title: string;
};

type Section = {
  id: string;
  name?: string;
  subpages: Subpage[];
};

interface NavProps {
  theme: string;
  page: string;
  detail?: string | null;
}

interface BreadcrumbBarProps {
  page: string;
  detail?: string | null;
}

interface SubNavProps {
  theme: string;
  section: Section;
  active?: Subpage | null;
}

function Nav({ theme, page, detail }: NavProps) {
  const [hoveredPage, setHoveredPage] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const linkRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({});
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null);
  const litPage = hoveredPage ?? (DATA.nav.some((item) => item.page === page) ? page : null);

  // Sliding highlight: one pill that glides to the hovered link and rests on the current page.
  React.useLayoutEffect(() => {
    const place = () => {
      const el = litPage ? linkRefs.current[litPage] : null;
      setInd(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [litPage]);

  // Floating bar: slims once scrolled, tucks away scrolling down, returns scrolling up.
  React.useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      root.classList.toggle('neo-nav-scrolled', y > 24);
      if (Math.abs(y - lastY) < 6) return;
      const hide = y > lastY && y > 160 && !root.classList.contains('neo-menu-open');
      root.classList.toggle('neo-nav-hidden', hide);
      lastY = y;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      root.classList.remove('neo-nav-scrolled', 'neo-nav-hidden');
    };
  }, []);
  // Close on navigation; while open, freeze the page behind and let Esc close it.
  React.useEffect(() => { setMenuOpen(false); }, [page, detail]);
  React.useEffect(() => {
    if (!menuOpen) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.classList.remove('neo-nav-hidden');
    document.documentElement.classList.add('neo-menu-open');
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.documentElement.classList.remove('neo-menu-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);
  return (
    <header className={`nav${menuOpen ? ' menu-open' : ''}`}>
      <Link prefetch={false} className="logo" href="/"  aria-label="Nexara home"
        style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src="/brand/nexara-mark.svg" alt="" style={{ height: 28, display: 'block', filter: 'drop-shadow(0 0 7px rgba(160,200,255,.5))' }} />
        Nexara
      </Link>
      <nav onMouseLeave={() => setHoveredPage(null)}>
        <span className="neo-nav-ind" aria-hidden="true"
          style={ind ? { width: ind.w, transform: `translateX(${ind.x}px)`, opacity: 1 } : { opacity: 0 }} />
        {DATA.nav.map((item) => {
          const active = page === item.page;
          const lit = hoveredPage ? hoveredPage === item.page : active;
          return (
            <Link prefetch={false}
              key={item.page}
              ref={(el) => { linkRefs.current[item.page] = el; }}
              onFocus={() => setHoveredPage(item.page)}
              onBlur={() => setHoveredPage(null)}
              className={`${active ? 'active' : ''}${!active && hoveredPage === item.page ? ' hover-lit' : ''}`}
              href={theme ? `/${theme}/${item.page}` : `/trust/${item.page}`}

              onMouseEnter={() => setHoveredPage(item.page)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="theme-pill">
        <Link prefetch={false} className={theme === "neo" ? "active" : ""} href={routePath("neo",page,detail)} >Neo</Link>
        <Link prefetch={false} className={theme === "trust" ? "active" : ""} href={routePath("trust",page,detail)} >Trust</Link>
      </div>
      <Link prefetch={false} className="neo-nav-cta" href={`/${theme || 'neo'}/contact`}>
        Start a project <span className="arr" aria-hidden="true">↗</span>
      </Link>
      <button type="button" className="neo-menu-btn" aria-expanded={menuOpen} aria-controls="neo-menu"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((v) => !v)}>
        <span /><span />
      </button>
      <div id="neo-menu" className="neo-menu" hidden={!menuOpen} data-lenis-prevent>
        <nav aria-label="Main">
          {DATA.nav.map((item, i) => (
            <Link prefetch={false} key={item.page} className={page === item.page ? 'active' : ''}
              href={`/${theme || 'trust'}/${item.page}`} onClick={() => setMenuOpen(false)}
              style={{ '--i': i } as React.CSSProperties}>
              <span className="neo-menu-idx">0{i + 1}</span>{item.label}
            </Link>
          ))}
        </nav>
        <Link prefetch={false} className="neo-menu-cta" href={`/${theme || 'neo'}/contact`} onClick={() => setMenuOpen(false)}>
          Start a project <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}


function BreadcrumbBar({ page, detail }: BreadcrumbBarProps) {
  const section = (DATA.sections as Record<string, Section>)[page];
  const labels: Record<string, string> = { customers: "Proof", company: "Company", contact: "Contact" };
  const current = section ? section.name : labels[page];
  const subpage = detail ? section?.subpages.find((item) => item.slug === detail)?.title : null;
  // A lone "Nexara" crumb (home) says nothing — skip the strip entirely.
  if (!current) return null;
  return (
    <div className="breadcrumb-bar" aria-label="Current location">
      <span>Nexara</span>
      {current && <><span className="breadcrumb-sep">/</span><span>{current}</span></>}
      {subpage && <><span className="breadcrumb-sep">/</span><span>{subpage}</span></>}
    </div>
  );
}


function SubNav({ theme, section, active }: SubNavProps) {
  return (
    <nav className="subnav" aria-label="Section navigation">
      <Link prefetch={false} className={!active ? "active" : ""} href={`/${theme}/${section.id}`}>Overview</Link>
      {section.subpages.map((item) => (
        <Link prefetch={false} key={item.slug} className={active?.slug === item.slug ? "active" : ""} href={`/${theme}/${section.id}/${item.slug}`}>
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export { Nav, BreadcrumbBar, SubNav };
