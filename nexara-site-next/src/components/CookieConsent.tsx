'use client';

/*
 * Cookie consent banner + preferences modal (Nexara).
 * Google Consent Mode v2: analytics stays denied until the visitor opts in.
 * Styled by ./consent.css (cc-* classes). Mounted globally in app.jsx.
 *
 * Reopen preferences from anywhere:
 *   import { openCookiePreferences } from './CookieConsent.jsx';
 *   <button onClick={openCookiePreferences}>Cookie Preferences</button>
 */

import React from 'react';

const { useCallback, useEffect, useState } = React;

const STORE_KEY = 'cc-consent';
const PRIVACY_URL = '/privacy-policy.html';
const COOKIE_URL = '/cookie-policy.html';

function readConsent() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
  } catch {
    return null;
  }
}

/** Delete GA cookies so a reject/withdraw takes effect immediately. */
function clearGaCookies() {
  const host = location.hostname;
  const domains = ['', host, `.${host}`];
  const parts = host.split('.');
  if (parts.length > 2) domains.push(`.${parts.slice(-2).join('.')}`);
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (name.startsWith('_ga') || name === '_gid') {
      domains.forEach((d) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/${d ? `;domain=${d}` : ''}`;
      });
    }
  });
}

/** Call from anywhere (footer link, etc.) to reopen the preferences modal. */
export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent('cc:open-preferences'));
}

export default function CookieConsent({ theme }: { theme: 'trust' | 'neo' | null }) {
  const [showBanner, setShowBanner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const cur = readConsent();
    if (!cur) setShowBanner(true);
    setAnalytics(cur ? cur.analytics : false);

    const openPrefs = () => {
      const c = readConsent();
      setAnalytics(c ? c.analytics : false);
      setModalOpen(true);
    };
    window.addEventListener('cc:open-preferences', openPrefs);
    window.openCookiePreferences = openPrefs;

    const onKey = (e) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('cc:open-preferences', openPrefs);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const save = useCallback((allowAnalytics) => {
    const rec = {
      necessary: true,
      analytics: allowAnalytics,
      ts: new Date().toISOString(),
      v: 1,
    };
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(rec));
    } catch {
      /* storage unavailable */
    }
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: allowAnalytics ? 'granted' : 'denied',
      });
    }
    if (!allowAnalytics) clearGaCookies();
    setShowBanner(false);
    setModalOpen(false);
  }, []);

  return (
    <>
      <div className={`cc-banner${showBanner ? ' show' : ''}${theme === 'trust' ? ' cc-theme-trust' : ''}`} role="dialog" aria-label="Cookie consent">
        <div className="cc-banner-inner">
          <div className="cc-banner-text">
            <strong>We value your privacy</strong>
            <p>
              We use essential cookies to run this site and, with your consent, analytics to
              understand how it's used. See our <a href={COOKIE_URL}>Cookie Policy</a> and{' '}
              <a href={PRIVACY_URL}>Privacy Policy</a>.
            </p>
          </div>
          <div className="cc-banner-actions">
            <button type="button" className="cc-btn cc-btn-ghost" onClick={() => setModalOpen(true)}>
              Preferences
            </button>
            <button type="button" className="cc-btn cc-btn-ghost" onClick={() => save(false)}>
              Reject all
            </button>
            <button type="button" className="cc-btn cc-btn-solid" onClick={() => save(true)}>
              Accept all
            </button>
          </div>
        </div>
      </div>

      <div
        className={`cc-modal${modalOpen ? ' open' : ''}${theme === 'trust' ? ' cc-theme-trust' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Cookie preferences"
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalOpen(false);
        }}
      >
        <div className="cc-modal-card">
          <button type="button" className="cc-modal-close" aria-label="Close" onClick={() => setModalOpen(false)}>
            ✕
          </button>
          <h3>Cookie Preferences</h3>
          <p className="cc-modal-lead">
            Choose which cookies we may use. Essential cookies are always on because the site can't
            function without them. You can change this anytime.
          </p>

          <div className="cc-row">
            <div className="cc-row-text">
              <strong>Strictly necessary</strong>
              <span>Remembers your cookie choice and keeps the site secure. Always active.</span>
            </div>
            <span className="cc-locked">Always on</span>
          </div>

          <div className="cc-row">
            <div className="cc-row-text">
              <strong>Analytics — Google Analytics</strong>
              <span>
                Helps us understand visits and improve the site. Sets <code>_ga</code> /{' '}
                <code>_ga_*</code> cookies.
              </span>
            </div>
            <label className="cc-switch">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
              <span className="cc-slider" />
            </label>
          </div>

          <div className="cc-modal-actions">
            <button type="button" className="cc-btn cc-btn-ghost" onClick={() => save(false)}>
              Reject all
            </button>
            <button type="button" className="cc-btn cc-btn-solid" onClick={() => save(analytics)}>
              Save choices
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
