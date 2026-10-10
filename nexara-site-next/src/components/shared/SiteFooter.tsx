'use client';
import React from 'react';
import Link from 'next/link';
import FooterContact from '../FooterContact';
import { routePath } from '@/lib/seo';
import { FOOTER_BLURB, FOOTER_COLUMNS, LEGAL_LINKS, voiced, type Theme } from '@/lib/site';
import { openCookiePreferences } from '../CookieConsent';

export function SiteFooter({ theme }: { theme: Theme }) {
  return (
    <footer className="nx-footer">
      <div className="nx-footer-grid">
        <div className="nx-footer-brand">
          <Link prefetch={false} className="nx-nav-logo" href={routePath(theme, 'home')} aria-label="Nexara home">
            <img src="/brand/nexara-mark.svg" alt="" width={32} height={32} />
            <span>Nexara</span>
          </Link>
          <p>{voiced(FOOTER_BLURB, theme)}</p>
          <FooterContact />
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <nav className="nx-footer-col" aria-label={voiced(col.label, theme)} key={col.label.neo}>
            <span className="nx-footer-label">{voiced(col.label, theme)}</span>
            {col.links.map((l) => <Link prefetch={false} key={l.label.neo} className={l.sub ? 'is-sub' : undefined} href={routePath(theme, l.page, l.detail ?? null) + (l.anchor ? '#' + l.anchor : '')}>{voiced(l.label, theme)}</Link>)}
          </nav>
        ))}
        <nav className="nx-footer-col" aria-label="Legal">
          <span className="nx-footer-label">Legal</span>
          {LEGAL_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          <button type="button" onClick={openCookiePreferences}>Cookie preferences</button>
        </nav>
      </div>
      <div className="nx-footer-bar">
        <p>© 2026 Nexara Private Limited · Visakhapatnam, India</p>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top <span aria-hidden="true">↑</span></button>
      </div>
    </footer>
  );
}
