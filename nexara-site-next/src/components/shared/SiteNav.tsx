'use client';
import React from 'react';
import Link from 'next/link';
import { routePath } from '@/lib/seo';
import { NAV, CONTACT_ENTRY, voiced, type Theme } from '@/lib/site';
import { getLenis } from '../useSmoothScroll';
import { ThemeSwitch } from './ThemeSwitch';

// One nav for both themes: same links, same Contact action, same mobile sheet. The skin comes from tokens.
export function SiteNav({ theme, page, detail }: { theme: Theme; page: string; detail?: string | null }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const burgerRef = React.useRef<HTMLButtonElement>(null);
  const home = routePath(theme, 'home');

  // Stay visible while scrolling. Auto-hide fought sticky section tabs (Academy etc.)
  // and left an empty gap — primary wayfinding stays put.
  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => { setMenuOpen(false); }, [page, detail]);

  // While open: freeze the page, trap focus in the sheet, Esc closes.
  React.useEffect(() => {
    navRef.current?.classList.toggle('is-open', menuOpen);
    if (!menuOpen) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    const sheet = sheetRef.current;
    const focusable = () => Array.from(sheet?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])') ?? []);
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); burgerRef.current?.focus(); }
      if (event.key !== 'Tab') return;
      const items = [...focusable(), ...(burgerRef.current ? [burgerRef.current] : [])];
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [menuOpen]);

  const contactActive = page === CONTACT_ENTRY.page;
  return (
    <header className="nx-nav" ref={navRef}>
      <div className="nx-nav-inner">
        <Link prefetch={false} className="nx-nav-logo" href={home} aria-label="Nexara home">
          <img src="/brand/nexara-mark.svg" alt="" width={28} height={28} />
          <span>Nexara</span>
        </Link>
        <nav className="nx-nav-links" aria-label="Primary">
          <ul>
            {NAV.map((item) => (
              <li key={item.page}>
                <Link prefetch={false} href={routePath(theme, item.page)} className={page === item.page ? 'active' : undefined} aria-current={page === item.page ? 'page' : undefined}>
                  {voiced(item.label, theme)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nx-nav-right">
          <ThemeSwitch theme={theme} page={page} detail={detail} />
          <Link prefetch={false} className={`nx-nav-cta${contactActive ? ' active' : ''}`} href={routePath(theme, CONTACT_ENTRY.page)}>
            {voiced(CONTACT_ENTRY.label, theme)} <span aria-hidden="true">→</span>
          </Link>
          <button ref={burgerRef} type="button" className="nx-nav-burger" aria-controls="nx-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            <span aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>
      {menuOpen && <div className="nx-nav-backdrop" aria-hidden="true" onClick={() => setMenuOpen(false)} />}
      <div ref={sheetRef} id="nx-menu" className={`nx-nav-sheet${menuOpen ? ' is-open' : ''}`} role="dialog" aria-label="Menu" aria-hidden={!menuOpen} inert={!menuOpen} data-lenis-prevent>
        <nav aria-label="Primary mobile">
          {NAV.map((item) => (
            <Link prefetch={false} key={item.page} className={page === item.page ? 'active' : undefined} href={routePath(theme, item.page)} onClick={() => setMenuOpen(false)}>
              <strong>{voiced(item.label, theme)}</strong>
              <span>{voiced(item.blurb, theme)}</span>
            </Link>
          ))}
        </nav>
        <Link prefetch={false} className="nx-nav-sheet-cta" href={routePath(theme, CONTACT_ENTRY.page)} onClick={() => setMenuOpen(false)}>
          {voiced(CONTACT_ENTRY.label, theme)} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </header>
  );
}
