'use client';
import React from 'react';
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
      <a className="logo" href="/" onClick={(e) => { e.preventDefault(); routeTo(null as unknown as string, 'gateway'); }} aria-label="Nexara home"
        style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src="/brand/nexara-mark.svg" alt="" style={{ height: 28, display: 'block', filter: 'drop-shadow(0 0 7px rgba(160,200,255,.5))' }} />
        Nexara
      </a>
      <nav onMouseLeave={() => setHoveredPage(null)}>
        {DATA.nav.map((item) => {
          const active = page === item.page;
          const lit = hoveredPage ? hoveredPage === item.page : active;
          return (
            <a
              key={item.page}
              className={`${active ? 'active' : ''}${!active && hoveredPage === item.page ? ' hover-lit' : ''}`}
              href={theme ? `/${theme}/${item.page}` : `/trust/${item.page}`}
              onClick={(e) => { e.preventDefault(); routeTo(theme, item.page); }}
              onMouseEnter={() => setHoveredPage(item.page)}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
      <div className="theme-pill">
        <a className={theme === "neo" ? "active" : ""} href={detail ? `/neo/${page}/${detail}` : `/neo/${page}`} onClick={(e) => { e.preventDefault(); routeTo("neo", page, detail); }}>Neo</a>
        <a className={theme === "trust" ? "active" : ""} href={detail ? `/trust/${page}/${detail}` : `/trust/${page}`} onClick={(e) => { e.preventDefault(); routeTo("trust", page, detail); }}>Trust</a>
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
      <button className={!active ? "active" : ""} onClick={() => routeTo(theme, section.id)}>Overview</button>
      {section.subpages.map((item) => (
        <button key={item.slug} className={active?.slug === item.slug ? "active" : ""} onClick={() => routeTo(theme, section.id, item.slug)}>
          {item.title}
        </button>
      ))}
    </nav>
  );
}

export { Nav, BreadcrumbBar, SubNav };
