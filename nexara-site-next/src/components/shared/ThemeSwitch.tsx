import React from 'react';
import Link from 'next/link';
import { routePath } from '@/lib/seo';
import type { Theme } from '@/lib/site';

const STYLES: { theme: Theme; label: string; hint: string }[] = [
  { theme: 'neo', label: 'Neo', hint: 'Switch to the Neo style: bold, dark, casual' },
  { theme: 'trust', label: 'Trust', hint: 'Switch to the Trust style: light, formal, corporate' },
];

// Same page, other style: /neo/labs <-> /trust/labs, /blog/x <-> /trust/blog/x, and so on.
export function ThemeSwitch({ theme, page, detail }: { theme: Theme; page: string; detail?: string | null }) {
  return (
    <div className="nx-switch" role="group" aria-label="Switch style">
      <span className="nx-switch-label" aria-hidden="true">Style</span>
      {STYLES.map((s) => {
        const active = s.theme === theme;
        return (
          <Link
            key={s.theme}
            prefetch={false}
            href={routePath(s.theme, page, detail ?? null)}
            className={active ? 'active' : undefined}
            aria-current={active ? 'true' : undefined}
            aria-label={active ? `${s.label} style (current)` : s.hint}
            title={active ? `${s.label} style (current)` : s.hint}
          >
            {s.label}
          </Link>
        );
      })}
    </div>
  );
}
