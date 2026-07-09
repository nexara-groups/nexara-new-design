'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { DATA } from '@/lib/data';
import { STATIC_PAGES } from '@/lib/shared';
import { setTrustRouter } from '@/lib/trust-router';
import { NotFound } from './NotFound';
import { TrustNav } from './trust/Nav';
import { TrustHome } from './trust/Home';
import { TrustSectionPage } from './trust/SectionShell';
import { TrustCustomers, TrustCompany, TrustContact, TrustConcierge } from './trust/StaticPages';
import { TrustFooter } from './trust/Misc';

function setupTsxFade() {
  document.documentElement.classList.add('js-reveal-ready');
  const els = document.querySelectorAll('.tsx-fade:not(.visible), .tsx-dimline:not(.visible)');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return () => document.documentElement.classList.remove('js-reveal-ready');
  }
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.15 }
  );
  els.forEach(el => obs.observe(el));
  const revealFallback = window.setTimeout(() => {
    els.forEach(el => el.classList.add('visible'));
  }, 900);
  return () => {
    window.clearTimeout(revealFallback);
    obs.disconnect();
    document.documentElement.classList.remove('js-reveal-ready');
  };
}

function TrustSite({ page, detail }: { page: string; detail: string | null }) {
  const router = useRouter();
  React.useEffect(() => { setTrustRouter(router); }, [router]);
  const section = (DATA.sections as Record<string, typeof DATA.sections.academy>)[page];
  React.useEffect(() => { window.scrollTo(0, 0); }, [page]);
  React.useEffect(() => setupTsxFade(), [page, detail]);
  React.useEffect(() => {
    const sel = '.tsx-sol-card,.tsx-gov-card,.tsx-proof-case-card,.tsx-pkg-card,.tsx-subpage-icon-card,.tsx-matrix-row,.tsx-channel-card,.tsx-deliver-card';
    let lastMove: MouseEvent | null = null, moveRaf = 0;
    const move = (e: MouseEvent) => {
      lastMove = e;
      if (moveRaf) return;
      moveRaf = requestAnimationFrame(() => {
        moveRaf = 0;
        const ev = lastMove!;
        const c = (ev.target as HTMLElement).closest && (ev.target as HTMLElement).closest<HTMLElement>(sel);
        if (!c) return;
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100) + '%');
        c.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100) + '%');
      });
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(moveRaf); };
  }, []);
  const validPage = section || STATIC_PAGES.includes(page);
  return (
    <div className="site trust tsx-site">
      <a className="skip-link" href="#main">Skip to content</a>
      <TrustNav page={page} detail={detail} />
      <div id="main" className={page !== 'home' ? 'tsx-main-offset' : ''}>
        {page === 'home'      && <TrustHome />}
        {section              && <TrustSectionPage section={section} detail={detail} />}
        {page === 'customers' && <TrustCustomers detail={detail} />}
        {page === 'company'   && <TrustCompany />}
        {page === 'contact'   && <TrustContact detail={detail} />}
        {!validPage           && <NotFound theme="trust" page={page} />}
      </div>
      <TrustConcierge page={page} />
      <TrustFooter />
    </div>
  );
}

export { TrustSite };
