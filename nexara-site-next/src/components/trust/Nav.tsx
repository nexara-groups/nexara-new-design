'use client';
import React from 'react';
import { DATA } from '@/lib/data';
import { routeTo } from '@/lib/trust-router';
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
  const dragStart = React.useRef<number | null>(null);

  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
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
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);
  return (
    <header className="tsx-nav" ref={navRef} role="banner">
      <div className="tsx-nav-inner">
        <a className="tsx-logo" href="/trust" onClick={(e) => { e.preventDefault(); routeTo('trust', 'home'); }} aria-label="Nexara home">
          <img src="/brand/nexara-logo.svg" alt="Nexara" style={{ height: 48, display: 'block' }} />
        </a>
        <nav aria-label="Primary">
          <ul className="tsx-nav-links tsx-tubelight" onMouseLeave={() => setHoveredPage(null)}>
            {DATA.nav.map(item => {
              const active = page === item.page;
              const glowing = hoveredPage ? hoveredPage === item.page : active;
              return (
                <li key={item.page}>
                  <a
                    className={`tsx-tubelight-btn${active ? ' active' : ''}${!active && hoveredPage === item.page ? ' hovered' : ''}`}
                    href={`/trust/${item.page}`}
                    onClick={(e) => { e.preventDefault(); routeTo('trust', item.page); }}
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
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="tsx-nav-right">
          <div className="theme-pill tsx-theme-pill" role="group" aria-label="Theme mode">
            <a type="button" href={detail ? `/neo/${page}/${detail}` : `/neo/${page}`} onClick={(e) => { e.preventDefault(); routeTo('neo', page, detail); }}>Neo</a>
            <a type="button" className="active" href={detail ? `/trust/${page}/${detail}` : `/trust/${page}`} onClick={(e) => { e.preventDefault(); routeTo('trust', page, detail); }}>Trust</a>
          </div>
          <a className="tsx-nav-cta" href="/trust/contact" onClick={(e) => { e.preventDefault(); routeTo('trust', 'contact'); }}>Talk to us <span aria-hidden="true">→</span></a>
          <button className="tsx-nav-burger" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(o => !o)}>
            <span className={"tsx-burger-icon" + (menuOpen ? ' is-open' : '')}><i /><i /></span>
          </button>
        </div>
      </div>
      {menuOpen && <div className="tsx-nav-backdrop" aria-hidden="true" onClick={() => setMenuOpen(false)} />}
      <div
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
            <a key={item.page} className={"tsx-nav-sheet-row" + (page === item.page ? ' active' : '')} href={`/trust/${item.page}`} onClick={(e) => { e.preventDefault(); setMenuOpen(false); routeTo('trust', item.page); }}>
              <span className="tsx-sheet-label">{getTrustNavLabel(item)}</span>
              <span className="tsx-sheet-desc">{TRUST_SHEET_DESCS[item.page]}</span>
            </a>
          ))}
        </nav>
        <div className="tsx-nav-sheet-footer">
          <a className="tsx-nav-sheet-cta" href="/trust/contact" onClick={(e) => { e.preventDefault(); setMenuOpen(false); routeTo('trust', 'contact'); }}>
            Start a Project <span className="arr" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export { TrustNav };
