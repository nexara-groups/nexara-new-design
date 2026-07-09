'use client';

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
        <p>© 2026 Nexara Private Limited (Nexara Groups) · Visakhapatnam, India</p>
      </div>
      <div>
        {Object.values(DATA.sections).map((s) => <button key={s.id} onClick={() => routeTo(theme, s.id)}>{s.name}</button>)}
        <button onClick={() => routeTo(theme, "company")}>Company</button>
        <button onClick={() => routeTo(theme, "contact")}>Contact</button>
        <a href="/privacy-policy.html">Privacy</a>
        <a href="/terms-of-service.html">Terms</a>
        <a href="/cookie-policy.html">Cookies</a>
        <a href="/data-deletion.html">Data Deletion</a>
        <button onClick={openCookiePreferences}>Cookie Preferences</button>
      </div>
    </footer>
  );
}

export { Footer };
