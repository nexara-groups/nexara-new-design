'use client';
// Theme chrome (Nav + Footer) around server-rendered blog content. The posts are the same in both themes.
import React from 'react';
import { useRouter } from 'next/navigation';
import { SiteNav } from './shared/SiteNav';
import { SiteFooter } from './shared/SiteFooter';
import { setNeoRouter } from '@/lib/neo-router';
import { setTrustRouter } from '@/lib/trust-router';
import type { Theme } from '@/lib/site';
import { useSmoothScroll } from './useSmoothScroll';

export function BlogShell({ theme, detail = null, children }: { theme: Theme; detail?: string | null; children: React.ReactNode }) {
  const router = useRouter();
  React.useEffect(() => { (theme === 'trust' ? setTrustRouter : setNeoRouter)(router); }, [router, theme]);
  useSmoothScroll();
  return (
    <div className={`site ${theme}${theme === 'trust' ? ' tsx-site' : ''}`}>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteNav theme={theme} page="blog" detail={detail} />
      <div id="main" className="nx-light">{children}</div>
      <SiteFooter theme={theme} />
    </div>
  );
}
