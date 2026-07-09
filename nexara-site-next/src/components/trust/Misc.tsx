'use client';
import React from 'react';
import { DATA } from '@/lib/data';
import { routeTo } from '@/lib/trust-router';
import { openCookiePreferences } from '../CookieConsent';
import { TrustCountUp } from './Cards';
import { getTrustNavLabel, getTrustSectionLabel } from './shared';

type TrustSection = (typeof DATA.sections)[keyof typeof DATA.sections];
type TrustNavItem = (typeof DATA.nav)[number];

type FooterLink = {
  text: string;
  page: string;
  detail?: string | null;
};

type FooterColumn =
  | {
      label: string;
      links: FooterLink[];
      groups?: undefined;
    }
  | {
      label: string;
      links?: undefined;
      groups: {
        label: string;
        links: FooterLink[];
      }[];
    };


export function TrustProofStrip() {
  const stats = [
    { num: '12', label: 'Months — standard Academy cohort',          accent: false },
    { num: '1',  label: 'Named owner — every engagement, no exception', accent: true  },
    { num: '8',  label: 'Cities in current operating scope',          accent: false },
    { num: '0',  label: 'Open-ended scopes without a written brief',  accent: false },
  ];
  return (
    <div className="tsx-stat-band" aria-label="Key figures">
      <div className="tsx-stat-band-inner">
        {stats.map(({ num, label, accent }) => (
          <div className="tsx-stat-cell" key={label}>
            <TrustCountUp value={num} className={`tsx-stat-num${accent ? ' accent' : ''}`} />
            <span className="tsx-stat-sublabel">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TSX_SOLUTIONS = [
  {
    index: '01 — Product Studio', name: 'Product Studio', page: 'labs', linkLabel: 'Explore Product Studio',
    desc: 'We build the system that solves the problem — SaaS, B2B products, integrations and internal tools, with AI and automation applied where it earns its place.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>,
  },
  {
    index: '02 — Marketing', name: 'Digital Marketing', page: 'marketing', linkLabel: 'Explore Marketing',
    desc: 'Strategy and campaigns that compound — positioning, websites, content operations, and performance systems with clear deliverables at every stage.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    index: '03 — Academy', name: 'Academy', page: 'academy', linkLabel: 'Explore Academy',
    desc: 'Talent tracks for the next generation — cohort-based training, portfolio development, and placement readiness for students, colleges, and employers.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  },
];

const TSX_GOV_CATEGORIES = ['Integrity', 'Scoping', 'Governance', 'Reporting'];

export function TrustSolutionsGrid() {
  const sections = Object.values(DATA.sections);
  return (
    <section className="tsx-solutions" aria-labelledby="tsx-sol-h">
      <div className="tsx-section-inner">
        <p className="tsx-section-eyebrow tsx-fade">Enterprise solution lines</p>
        <h2 className="tsx-section-heading tsx-fade" id="tsx-sol-h">{DATA.home.trust.calloutTitle}</h2>
        <p className="tsx-section-lede tsx-fade">{DATA.home.trust.calloutBody}</p>
        <div className="tsx-solutions-grid">
          {sections.map((section, i) => (
            <article className={`tsx-sol-card tsx-fade tsx-fade-d${i + 1}`} key={section.id} onClick={() => routeTo('trust', section.id)}>
              <div className="tsx-sol-icon" aria-hidden="true">{TSX_SOLUTIONS.find(item => item.page === section.id)?.icon}</div>
              <p className="tsx-sol-index">{section.index} / {section.name}</p>
              <h3 className="tsx-sol-name">{getTrustSectionLabel(section)}</h3>
              <p className="tsx-sol-desc">{section.short.trust}</p>
              <ul className="tsx-module-list">
                {section.modules.map(module => <li key={module.title}>{module.title}</li>)}
              </ul>
              <span className="tsx-sol-link">
                Open {getTrustSectionLabel(section)}
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 7h12M8 2l5 5-5 5"/></svg>
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustFeatureStrip() {
  return (
    <section className="tsx-features" aria-labelledby="tsx-feat-h">
      <div className="tsx-section-inner">
        <p className="tsx-section-eyebrow tsx-fade">Governance model</p>
        <h2 className="tsx-section-heading tsx-fade" id="tsx-feat-h">Four delivery standards, no exceptions.</h2>
        <div className="tsx-gov-grid">
          {DATA.company.standards.map((standard, i) => (
            <div className={`tsx-gov-card tsx-fade tsx-fade-d${i + 1}`} key={standard.title}>
              <div className="tsx-gov-header navy">
                <span className="tsx-gov-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="tsx-gov-cat">{TSX_GOV_CATEGORIES[i]}</span>
              </div>
              <div className="tsx-gov-body">
                <h3 className="tsx-gov-title">{standard.title}</h3>
                <p className="tsx-gov-desc">{standard.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustEnterpriseStacks() {
  return (
    <section className="tsx-enterprise-stacks" aria-labelledby="tsx-stack-h">
      <div className="tsx-section-inner">
        <p className="tsx-section-eyebrow tsx-fade">Capability stacks</p>
        <h2 className="tsx-section-heading tsx-fade tsx-fade-d1" id="tsx-stack-h">Integrated stacks built from the same Nexara capabilities.</h2>
        <p className="tsx-section-lede tsx-fade tsx-fade-d2">How the three lines interlock into combined plays — one capability set, recomposed for the outcome.</p>
        <div className="tsx-stackcard-grid">
          {DATA.superSkills.map((item, index) => (
            <article
              className={`tsx-stackcard${index === 0 ? ' tsx-stackcard--lead' : ''} tsx-fade tsx-fade-d${Math.min(index + 1, 4)}`}
              key={item.title}
            >
              <div className="tsx-stackcard-body">
                <div className="tsx-stackcard-top">
                  <span className="tsx-stackcard-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <div className="tsx-stackcard-tags">
                    {item.sections.map(s => (
                      <span className="tsx-stackcard-tag" key={s}>{s}</span>
                    ))}
                  </div>
                </div>
                <h3 className="tsx-stackcard-title">{item.title}</h3>
                <p className="tsx-stackcard-desc">{item.trust}</p>
              </div>
              <div className="tsx-stackcard-stack">
                <span className="tsx-stackcard-stack-label">Capability stack</span>
                <div className="tsx-stackcard-chips">
                  {item.stack.map(module => (
                    <span className="tsx-stackcard-chip" key={module}>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"/></svg>
                      {module}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustMarketContext() {
  return (
    <section className="tsx-market-context" aria-labelledby="tsx-market-h">
      <div className="tsx-section-inner tsx-market-grid">
        <div className="tsx-market-left-rule">
          <p className="tsx-section-eyebrow tsx-fade">Operating region</p>
          <h2 className="tsx-section-heading tsx-fade tsx-fade-d1" id="tsx-market-h">{DATA.market.title.trust}</h2>
          <p className="tsx-section-lede tsx-fade tsx-fade-d2">{DATA.market.body.trust}</p>
          <div className="tsx-city-grid">
            {DATA.market.cities.map((city, i) => (
              <span key={city} className={`${i === 0 ? 'tsx-city-primary ' : ''}tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`}>{city}</span>
            ))}
          </div>
        </div>
        <div className="tsx-assumption-panel tsx-fade tsx-fade-d3">
          <span className="tsx-panel-title">Planning assumptions</span>
          {DATA.market.assumptions.map((assumption, index) => (
            <p key={assumption}><strong>{String(index + 1).padStart(2, '0')}</strong>{assumption}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustFooter() {
  const solutionLinks: FooterLink[] = DATA.nav.slice(0, 3).map(item => ({ text: getTrustNavLabel(item), page: item.page }));
  const moduleLinks: FooterLink[] = Object.values(DATA.sections).map(section => ({
    text: getTrustSectionLabel(section), page: section.id,
  }));
  const cols: FooterColumn[] = [
    { label: 'Solutions', links: solutionLinks },
    { label: 'Modules', links: moduleLinks },
    { label: 'Company', links: [{ text: 'Delivery Proof', page: 'customers' }, { text: 'About Nexara', page: 'company' }, { text: 'Enterprise Enquiry', page: 'contact' }] },
  ];
  return (
    <footer className="tsx-footer" role="contentinfo">
      <div className="tsx-footer-top">
        <div>
          <button className="tsx-logo" onClick={() => routeTo('trust', 'home')} aria-label="Nexara home">
            <img src="/brand/nexara-logo.svg" alt="Nexara" style={{ height: 40, display: 'block' }} />
          </button>
          <p className="tsx-footer-brand-desc">Enterprise IT capability programmes for talent, digital growth and applied automation.</p>
        </div>
        {cols.map(col => (
          <div key={col.label}>
            <span className="tsx-footer-col-label">{col.label}</span>
            {col.groups ? (
              col.groups.map(group => (
                <div className="tsx-footer-group" key={group.label}>
                  <span className="tsx-footer-group-label">{group.label}</span>
                  <ul className="tsx-footer-links">
                    {group.links.map(l => (
                      <li key={l.text}><button onClick={() => routeTo('trust', l.page, l.detail)}>{l.text}</button></li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <ul className="tsx-footer-links">
                {col.links.map(l => (
                  <li key={l.text}><button onClick={() => routeTo('trust', l.page, l.detail)}>{l.text}</button></li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div className="tsx-footer-bottom">
        <p className="tsx-footer-copyright">© 2026 Nexara Private Limited (Nexara Groups). All rights reserved.</p>
        <nav className="tsx-footer-legal" aria-label="Legal">
          <a href="/privacy-policy.html">Privacy Policy</a>
          <a href="/terms-of-service.html">Terms of Service</a>
          <a href="/cookie-policy.html">Cookie Policy</a>
          <a href="/data-deletion.html">Data Deletion</a>
          <button type="button" onClick={openCookiePreferences}>Cookie Preferences</button>
        </nav>
      </div>
    </footer>
  );
}
