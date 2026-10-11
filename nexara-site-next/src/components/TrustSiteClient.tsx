'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { DATA } from '@/lib/data';
import { STATIC_PAGES } from '@/lib/shared';
import { setTrustRouter } from '@/lib/trust-router';
import { NotFound } from './NotFound';
import { SiteNav } from './shared/SiteNav';
import { SiteFooter } from './shared/SiteFooter';
import { Breadcrumbs } from './shared/Breadcrumbs';
import { Home } from './shared/Home';
import { TrustSectionPage } from './trust/SectionShell';
import { TrustConcierge } from './trust/StaticPages';
import { ContactPage } from './shared/ContactPage';
import { Proof } from './shared/Proof';
import { About } from './shared/About';
import { MarketingPage } from './shared/MarketingPage';
import { AcademyPage } from './shared/AcademyPage';
import { LabsPage } from './shared/LabsPage';
import { useSmoothScroll } from './useSmoothScroll';

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
  useSmoothScroll();
  const section = (DATA.sections as Record<string, (typeof DATA.sections)[keyof typeof DATA.sections]>)[page];
  React.useEffect(() => { window.scrollTo(0, 0); }, [page, detail]);
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
  // Digital Solutions keeps green, Labs amber, Home its own blue skin; everything else is brand blue.
  const accent = page === 'marketing' ? 'green' : page === 'labs' ? 'amber' : page === 'home' ? 'home' : 'blue';
  React.useEffect(() => {
    document.body.dataset.trustAccent = accent;
    return () => { delete document.body.dataset.trustAccent; };
  }, [accent]);
  return (
    <div className={`site trust tsx-site${page === 'home' ? ' trust-home' : page === 'labs' ? ' trust-labs' : ''}`} data-accent={accent}>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteNav theme="trust" page={page} detail={detail} />
      <div id="main">
        {(page !== 'home' || !validPage) && (
          <Breadcrumbs
            theme="trust"
            page={validPage ? page : 'notfound'}
            detail={validPage ? detail : null}
            currentLabel={validPage ? undefined : 'Not found'}
          />
        )}
        {page === 'home'      && <Home theme="trust" />}
        {section && (page === 'marketing' ? <MarketingPage theme="trust" /> : page === 'academy' ? <AcademyPage theme="trust" /> : page === 'labs' ? <LabsPage theme="trust" detail={detail} /> : <TrustSectionPage section={section} detail={detail} />)}
        {page === 'customers' && <Proof theme="trust" detail={detail} />}
        {page === 'company'   && <About theme="trust" />}
        {page === 'contact'   && <ContactPage theme="trust" detail={detail} />}
        {!validPage           && <NotFound theme="trust" page={page} />}
      </div>
      <TrustConcierge page={page} />
      <SiteFooter theme="trust" />
    </div>
  );
}

export { TrustSite };
