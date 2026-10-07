'use client';
import React from 'react';
import Link from 'next/link';
import { routePath } from '@/lib/seo';
import { DATA } from '@/lib/data';
import { routeTo } from '@/lib/neo-router';
const { useState } = React;

// Minimal shape actually read by SubNav/BreadcrumbBar below — DATA.sections
// entries carry many more fields (hero, cards, faqs, etc.) that aren't typed
// here since this group never touches them.
type Subpage = {
  slug: string;
  title: string;
};

type Section = {
  id: string;
  name?: string;
  subpages: Subpage[];
};

interface NavProps {
  theme: string;
  page: string;
  detail?: string | null;
}

interface BreadcrumbBarProps {
  page: string;
  detail?: string | null;
}

interface SubNavProps {
  theme: string;
  section: Section;
  active?: Subpage | null;
}

function Nav({ theme, page, detail }: NavProps) {
  const [hoveredPage, setHoveredPage] = useState<string | null>(null);
  return (
    <header className="nav">
      <Link prefetch={false} className="logo" href="/"  aria-label="Nexara home"
        style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src="/brand/nexara-mark.svg" alt="" style={{ height: 28, display: 'block', filter: 'drop-shadow(0 0 7px rgba(160,200,255,.5))' }} />
        Nexara
      </Link>
      <nav onMouseLeave={() => setHoveredPage(null)}>
        {DATA.nav.map((item) => {
          const active = page === item.page;
          const lit = hoveredPage ? hoveredPage === item.page : active;
          return (
            <Link prefetch={false}
              key={item.page}
              className={`${active ? 'active' : ''}${!active && hoveredPage === item.page ? ' hover-lit' : ''}`}
              href={theme ? `/${theme}/${item.page}` : `/trust/${item.page}`}

              onMouseEnter={() => setHoveredPage(item.page)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="theme-pill">
        <Link prefetch={false} className={theme === "neo" ? "active" : ""} href={routePath("neo",page,detail)} >Neo</Link>
        <Link prefetch={false} className={theme === "trust" ? "active" : ""} href={routePath("trust",page,detail)} >Trust</Link>
      </div>
    </header>
  );
}


function BreadcrumbBar({ page, detail }: BreadcrumbBarProps) {
  const section = (DATA.sections as Record<string, Section>)[page];
  const labels: Record<string, string> = { customers: "Proof", company: "Company", contact: "Contact" };
  const current = section ? section.name : labels[page];
  const subpage = detail ? section?.subpages.find((item) => item.slug === detail)?.title : null;
  return (
    <div className="breadcrumb-bar" aria-label="Current location">
      <span>Nexara</span>
      {current && <><span className="breadcrumb-sep">/</span><span>{current}</span></>}
      {subpage && <><span className="breadcrumb-sep">/</span><span>{subpage}</span></>}
    </div>
  );
}


function SubNav({ theme, section, active }: SubNavProps) {
  return (
    <nav className="subnav" aria-label="Section navigation">
      <Link prefetch={false} className={!active ? "active" : ""} href={`/${theme}/${section.id}`}>Overview</Link>
      {section.subpages.map((item) => (
        <Link prefetch={false} key={item.slug} className={active?.slug === item.slug ? "active" : ""} href={`/${theme}/${section.id}/${item.slug}`}>
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export { Nav, BreadcrumbBar, SubNav };
