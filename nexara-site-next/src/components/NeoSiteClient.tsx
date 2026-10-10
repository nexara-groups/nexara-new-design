'use client';
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
// Was registered once, globally, in the old app's main.jsx entry point — Next.js's
// App Router has no equivalent single entry point, and no file here re-registered
// it, so ScrollTrigger.create() threw "_context is not a function" at runtime.
if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof window !== 'undefined') Object.assign(window, { gsap, ScrollTrigger });
import { DATA } from '@/lib/data';
import { STATIC_PAGES, HAS_SCROLL_ANIMATION } from '@/lib/shared';
import { useRouter } from 'next/navigation';
import { setNeoRouter } from '@/lib/neo-router';
import { NotFound } from './NotFound';
import { SiteNav } from './shared/SiteNav';
import { SiteFooter } from './shared/SiteFooter';
import { Breadcrumbs } from './shared/Breadcrumbs';
import { Home } from './shared/Home';
import { SectionPage } from './neo/SectionShell';
import { ContactPage } from './shared/ContactPage';
import { Proof } from './shared/Proof';
import { About } from './shared/About';
import { MarketingPage } from './shared/MarketingPage';
import { AcademyPage } from './shared/AcademyPage';
import { LabsPage } from './shared/LabsPage';
const NeoGuide = dynamic(()=>import('./neo/Guide').then(module=>module.NeoGuide),{ssr:false});
import { useSmoothScroll } from './useSmoothScroll';

function Site({ theme, page, detail }: { theme: 'trust' | 'neo'; page: string; detail: string | null }) {
  const router = useRouter();
  React.useEffect(() => { setNeoRouter(router); }, [router]);
  useSmoothScroll();
  const isNeo = theme === "neo";
  const [guideReady,setGuideReady]=React.useState(false);
  // The cursor guide is pure motion: never mounted for visitors who ask for reduced motion.
  React.useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=setTimeout(()=>setGuideReady(true),900);return()=>clearTimeout(timer);},[]);
  const section = (DATA.sections as Record<string, (typeof DATA.sections)[keyof typeof DATA.sections]>)[page];
  React.useEffect(() => { window.scrollTo(0, 0); }, [theme, page, detail]);
  const validPage = section || STATIC_PAGES.includes(page);
  const className = isNeo ? "site neo" : "site trust";
  return (
    <div className={className}>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteNav theme={theme} page={page} detail={detail} />
      <div id="main">
        {(page !== 'home' || !validPage) && (
          <Breadcrumbs
            theme={theme}
            page={validPage ? page : 'notfound'}
            detail={validPage ? detail : null}
            currentLabel={validPage ? undefined : 'Not found'}
          />
        )}
        {page === "home" && <Home theme={theme} />}
        {section && (page === 'marketing' ? <MarketingPage theme={theme} /> : page === 'academy' ? <AcademyPage theme={theme} /> : page === 'labs' ? <LabsPage theme={theme} detail={detail} /> : <SectionPage theme={theme} section={section} detail={detail} />)}
        {page === "customers" && <Proof theme={theme} detail={detail} />}
        {page === "company" && <About theme={theme} />}
        {page === "contact" && <ContactPage theme={theme} detail={detail} />}
        {!validPage && <NotFound theme={theme} page={page} />}
      </div>
      {/* Key by page only — tab (detail) switches must not remount the guide or jolt scroll. */}
      {guideReady && isNeo && HAS_SCROLL_ANIMATION && <NeoGuide key={page} />}
      <SiteFooter theme={theme} />
    </div>
  );
}

export { Site };
