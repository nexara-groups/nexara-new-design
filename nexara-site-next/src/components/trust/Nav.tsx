'use client';
import React from 'react';
import Link from 'next/link';
import { routePath } from '@/lib/seo';
import { DATA } from '@/lib/data';
import { routeTo } from '@/lib/trust-router';
import { getLenis } from '../useSmoothScroll';
import { getTrustNavLabel, TRUST_NAV_ICONS, TRUST_SHEET_DESCS } from './shared';

type DetailSlug = string | null;

interface TrustNavProps {
  page: string;
  detail?: DetailSlug;
}

function TrustNav({ page, detail }: TrustNavProps) {
  const navRef = React.useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [hoveredPage, setHoveredPage] = React.useState<string | null>(null);
  const [dragY, setDragY] = React.useState(0);
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const burgerRef = React.useRef<HTMLButtonElement>(null);
  const dragStart = React.useRef<number | null>(null);

  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    // Tuck away while scrolling down, come back on any scroll up.
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 8);
      if (Math.abs(y - lastY) < 6) return;
      nav.classList.toggle('is-tucked', y > lastY && y > 160 && !nav.classList.contains('menu-open'));
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  React.useEffect(() => { setMenuOpen(false); }, [page, detail]);
  React.useEffect(() => { if (!menuOpen) setDragY(0); }, [menuOpen]);

  const onSheetTouchStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0]!.clientY;
  };
  const onSheetTouchMove = (e: React.TouchEvent) => {
    if (dragStart.current === null) return;
    const delta = Math.max(0, e.touches[0]!.clientY - dragStart.current);
    setDragY(delta);
  };
  const onSheetTouchEnd = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (dragY > 110) {
      setMenuOpen(false);
    } else {
      setDragY(0);
    }
  };
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const lenis = getLenis();
    if (menuOpen) lenis?.stop();
    navRef.current?.classList.toggle('menu-open', menuOpen);
    if (menuOpen) navRef.current?.classList.remove('is-tucked');
    return () => { document.body.style.overflow = ''; if (menuOpen) lenis?.start(); };
  }, [menuOpen]);
  React.useEffect(()=>{
    if(!menuOpen)return;
    const sheet=sheetRef.current;
    const links=()=>Array.from(sheet?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')||[]);
    links()[0]?.focus();
    const key=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){setMenuOpen(false);burgerRef.current?.focus();}
      if(event.key==='Tab'){const items=[...links(),...(burgerRef.current?[burgerRef.current]:[])];const first=items[0],last=items.at(-1);
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}
    };
    document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key);
  },[menuOpen]);
  return (
    <header className="tsx-nav" ref={navRef} role="banner">
      <div className="tsx-nav-inner">
        <Link prefetch={false} className="tsx-logo" href="/trust"  aria-label="Nexara home">
          <img src="/brand/nexara-logo-compact.svg" alt="Nexara" style={{ height: 30, display: 'block' }} />
        </Link>
        <nav aria-label="Primary">
          <ul className="tsx-nav-links tsx-tubelight" onMouseLeave={() => setHoveredPage(null)}>
            {DATA.nav.map(item => {
              const active = page === item.page;
              const glowing = hoveredPage ? hoveredPage === item.page : active;
              return (
                <li key={item.page}>
                  <Link prefetch={false}
                    className={`tsx-tubelight-btn${active ? ' active' : ''}${!active && hoveredPage === item.page ? ' hovered' : ''}`}
                    href={`/trust/${item.page}`}

                    onMouseEnter={() => setHoveredPage(item.page)}
                  >
                    {glowing && (
                      <span className={`tsx-tubelight-glow${!active && hoveredPage === item.page ? ' tsx-tubelight-glow--hover' : ''}`} aria-hidden="true">
                        <span className="tsx-tubelight-bar" />
                        <span className="tsx-tubelight-blur1" />
                        <span className="tsx-tubelight-blur2" />
                        <span className="tsx-tubelight-blur3" />
                      </span>
                    )}
                    <span className="tsx-tubelight-icon">{(TRUST_NAV_ICONS as Record<string, React.ReactNode>)[item.page]}</span>
                    {getTrustNavLabel(item)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="tsx-nav-right">
          <div className="theme-pill tsx-theme-pill" role="group" aria-label="Theme mode">
            <Link prefetch={false} href={routePath("neo",page,detail)} >Neo</Link>
            <Link prefetch={false} className="active" href={routePath("trust",page,detail)} >Trust</Link>
          </div>
          <Link prefetch={false} className="tsx-nav-cta" href="/trust/contact" >Talk to us <span aria-hidden="true">→</span></Link>
          <button ref={burgerRef} aria-controls="trust-mobile-menu" className="tsx-nav-burger" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(o => !o)}>
            <span className={"tsx-burger-icon" + (menuOpen ? ' is-open' : '')}><i /><i /></span>
          </button>
        </div>
      </div>
      {menuOpen && <div className="tsx-nav-backdrop" aria-hidden="true" onClick={() => setMenuOpen(false)} />}
      <div ref={sheetRef} id="trust-mobile-menu" inert={!menuOpen}
        className={"tsx-nav-sheet" + (menuOpen ? ' is-open' : '')}
        role="dialog" aria-label="Menu" aria-hidden={!menuOpen}
        onTouchStart={onSheetTouchStart}
        onTouchMove={onSheetTouchMove}
        onTouchEnd={onSheetTouchEnd}
        style={dragY > 0 ? { transform: `translateY(${dragY}px)`, transition: 'transform 0ms' } : undefined}
      >
        <div className="tsx-nav-sheet-handle" aria-hidden="true" />
        <nav className="tsx-nav-sheet-links" aria-label="Primary mobile">
          {DATA.nav.map((item) => (
            <Link prefetch={false} key={item.page} className={"tsx-nav-sheet-row" + (page === item.page ? ' active' : '')} href={`/trust/${item.page}`} onClick={()=>setMenuOpen(false)}>
              <span className="tsx-sheet-label">{getTrustNavLabel(item)}</span>
              <span className="tsx-sheet-desc">{TRUST_SHEET_DESCS[item.page]}</span>
            </Link>
          ))}
        </nav>
        <div className="tsx-nav-sheet-footer">
          <Link prefetch={false} className="tsx-nav-sheet-cta" href="/trust/contact" onClick={()=>setMenuOpen(false)}>
            Start a Project <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export { TrustNav };
