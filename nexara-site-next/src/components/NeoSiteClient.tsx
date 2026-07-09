'use client';
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
// Was registered once, globally, in the old app's main.jsx entry point — Next.js's
// App Router has no equivalent single entry point, and no file here re-registered
// it, so ScrollTrigger.create() threw "_context is not a function" at runtime.
if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof window !== 'undefined') Object.assign(window, { THREE, gsap, ScrollTrigger });
import { DATA } from '@/lib/data';
import { STATIC_PAGES, HAS_SCROLL_ANIMATION } from '@/lib/shared';
import { useRouter } from 'next/navigation';
import { setNeoRouter } from '@/lib/neo-router';
import { NotFound } from './NotFound';
import { Nav, BreadcrumbBar } from './neo/Nav';
import { Home } from './neo/Home';
import { SectionPage } from './neo/SectionShell';
import { Customers, Company, Contact } from './neo/StaticPages';
import { NeoGuide } from './neo/Guide';
import { Footer } from './neo/Footer';

function Site({ theme, page, detail }: { theme: 'trust' | 'neo'; page: string; detail: string | null }) {
  const router = useRouter();
  React.useEffect(() => { setNeoRouter(router); }, [router]);
  const isNeo = theme === "neo";
  const section = (DATA.sections as Record<string, typeof DATA.sections.academy>)[page];
  React.useEffect(() => { window.scrollTo(0, 0); }, [theme, page]);
  const validPage = section || STATIC_PAGES.includes(page);
  const className = isNeo ? "site neo" : "site trust";
  return (
    <div className={className}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav theme={theme} page={page} detail={detail} />
      <BreadcrumbBar page={page} detail={detail} />
      <div id="main">
        {page === "home" && <Home theme={theme} />}
        {section && <SectionPage theme={theme} section={section} detail={detail} />}
        {page === "customers" && <Customers theme={theme} detail={detail} />}
        {page === "company" && <Company theme={theme} />}
        {page === "contact" && <Contact theme={theme} detail={detail} />}
        {!validPage && <NotFound theme={theme} page={page} />}
      </div>
      {isNeo && HAS_SCROLL_ANIMATION && <NeoGuide key={`${page}-${detail || "root"}`} />}
      <Footer theme={theme} />
    </div>
  );
}

export { Site };
