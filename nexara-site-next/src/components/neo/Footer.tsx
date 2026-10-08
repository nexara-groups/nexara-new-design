'use client';

import Link from 'next/link';
import FooterContact from '../FooterContact';
import { routePath } from '@/lib/seo';
import { DATA } from '@/lib/data';
import { openCookiePreferences } from '../CookieConsent';

interface FooterProps {
  theme: 'trust' | 'neo';
}

function Footer({ theme }: FooterProps) {
  return (
    <footer className="footer neo-footer">
      <div className="neo-footer-grid">
        <div className="neo-footer-brand">
          <Link prefetch={false} className="neo-footer-logo" href="/" aria-label="Nexara home">
            <img src="/brand/nexara-mark.svg" alt="" width={32} height={32} />
            <strong>Nexara</strong>
          </Link>
          <p>Academy, Digital Marketing and Labs. One company, two presentations.</p>
          <FooterContact />
        </div>
        <nav className="neo-footer-col" aria-label="Divisions">
          <span className="neo-footer-label">Divisions</span>
          {Object.values(DATA.sections).map((s) => <Link prefetch={false} key={s.id} href={routePath(theme,s.id)}>{s.name}</Link>)}
        </nav>
        <nav className="neo-footer-col" aria-label="Company">
          <span className="neo-footer-label">Company</span>
          <Link prefetch={false} href={routePath(theme,"customers")}>Proof</Link>
          <Link prefetch={false} href={routePath(theme,"company")}>Company</Link>
          <Link prefetch={false} href={routePath(theme,"contact")}>Contact</Link>
        </nav>
        <nav className="neo-footer-col footer-legal" aria-label="Legal">
          <span className="neo-footer-label">Legal</span>
          <a href="/privacy-policy.html">Privacy</a>
          <a href="/terms-of-service.html">Terms</a>
          <a href="/cookie-policy.html">Cookies</a>
          <a href="/data-deletion.html">Data Deletion</a>
          <button type="button" onClick={openCookiePreferences}>Cookie Preferences</button>
        </nav>
      </div>
      <div className="neo-footer-bar">
        <p>© 2026 Nexara Private Limited (Nexara Groups) · Visakhapatnam, India</p>
        <button type="button" className="neo-footer-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top <span aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  );
}

export { Footer };
