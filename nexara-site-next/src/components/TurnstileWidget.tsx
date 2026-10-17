'use client';
import React from 'react';
import { TURNSTILE_TEST_SITE_KEY, type FormKind } from '@/lib/forms';

// Public site key, inlined at build. Outside production we fall back to Cloudflare's always-pass test key;
// in production with no key the server forms stay switched off (FORMS_ENABLED is false).
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (process.env.NODE_ENV === 'production' ? '' : TURNSTILE_TEST_SITE_KEY);
export const FORMS_ENABLED = Boolean(TURNSTILE_SITE_KEY);
/** Neo is a dark skin, Trust a light one; pass through voiced() so shared components stay theme-agnostic. */
export const WIDGET_THEME = { neo: 'dark', trust: 'light' } as const;

type Turnstile = {
  render(el: HTMLElement, opts: Record<string, unknown>): string;
  reset(id: string): void;
  remove(id: string): void;
};
declare global { interface Window { turnstile?: Turnstile } }

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let loading: Promise<Turnstile> | null = null;
function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile missing')));
    s.onerror = () => { loading = null; reject(new Error('turnstile failed to load')); };
    document.head.appendChild(s);
  });
  return loading;
}

/** Renders the challenge and reports the token (or '' when it expires or errors). Bump `resetKey` to get a fresh token after a failed submit. */
export function TurnstileWidget({ action, onToken, resetKey = 0, className, theme = 'auto' }: { action: FormKind; onToken: (token: string) => void; resetKey?: number; className?: string; theme?: 'auto' | 'light' | 'dark' }) {
  const host = React.useRef<HTMLDivElement>(null);
  const widget = React.useRef<string | null>(null);
  const report = React.useRef(onToken);
  report.current = onToken;

  React.useEffect(() => {
    if (!FORMS_ENABLED) return;
    let cancelled = false;
    loadTurnstile().then((ts) => {
      if (cancelled || !host.current || widget.current) return;
      widget.current = ts.render(host.current, {
        sitekey: TURNSTILE_SITE_KEY,
        action,
        theme,
        appearance: 'always',
        callback: (token: string) => report.current(token),
        'expired-callback': () => report.current(''),
        'error-callback': () => report.current(''),
      });
    }).catch(() => report.current(''));
    return () => {
      cancelled = true;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [action, theme]);

  React.useEffect(() => {
    if (resetKey && widget.current) { window.turnstile?.reset(widget.current); report.current(''); }
  }, [resetKey]);

  if (!FORMS_ENABLED) return null;
  return <div ref={host} className={className} />;
}

/** POST to /api/submit. Returns the server's error code, or null on success. */
export async function submitForm(payload: Record<string, unknown>): Promise<string | null> {
  try {
    const res = await fetch('/api/submit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...payload, page: window.location.pathname }) });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    return res.ok && data.ok ? null : data.error || 'send';
  } catch {
    return 'network';
  }
}
