'use client';

import Link from 'next/link';
import FooterContact from '../FooterContact';
import { routePath } from '@/lib/seo';
import { DATA } from '@/lib/data';
import { routeTo } from '@/lib/neo-router';
import { openCookiePreferences } from '../CookieConsent';

interface FooterProps {
  theme: 'trust' | 'neo';
}

function Footer({ theme }: FooterProps) {
  return (
    <footer className="footer">
      <div>
        <strong>Nexara</strong>
        <p>Academy, Digital Marketing and Labs. One company, two presentations.</p>
        <FooterContact />
        <p>© 2026 Nexara Private Limited (Nexara Groups) · Visakhapatnam, India</p>
      </div>
      <div>
        {Object.values(DATA.sections).map((s) => <Link prefetch={false} key={s.id} href={routePath(theme,s.id)}>{s.name}</Link>)}
        <Link prefetch={false} href={routePath(theme,"company")}>Company</Link>
        <Link prefetch={false} href={routePath(theme,"contact")}>Contact</Link>
        <nav className="footer-legal" aria-label="Legal"><a href="/privacy-policy.html">Privacy</a>
        <a href="/terms-of-service.html">Terms</a>
        <a href="/cookie-policy.html">Cookies</a>
        <a href="/data-deletion.html">Data Deletion</a>
        </nav>
        <button onClick={openCookiePreferences}>Cookie Preferences</button>
      </div>
    </footer>
  );
}

export { Footer };
