'use client';
import React from 'react';
import { DATA } from '@/lib/data';
import { routeTo } from '@/lib/trust-router';
import { TrustHeroParticles, TrustHeroEnergyLoop } from './Hero';
import { getTrustSectionLabel, TRUST_SECTION_CTA, TRUST_ACCENT } from './shared';
import { TrustProcessTrack, TrustProofCards, TrustFaqAccordion, TrustIntakeBand } from './Cards';

// Same real structural type as SectionShell.tsx's `TrustSection` — a hand-rolled
// interface here previously didn't match the real DATA shape and every call site
// needed `as any` casts to compile with the actual data flowing through.
type TrustSectionData = (typeof DATA.sections)[keyof typeof DATA.sections];
type TrustSubpageData = NonNullable<TrustSectionData['subpages']>[number];

// Card-title → icon lookup used by both TrustSubpageBand and TrustSubpageCards.
// Exclusive to this group (not referenced anywhere else in TrustSiteClient.tsx),
// so it moved here along with the two components that use it.
const SUBPAGE_CARD_ICONS: Record<string, React.ReactNode> = {
  'Full-stack sprint':    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="16" height="10" rx="1.5"/><path d="M6 17h8M10 14v3"/></svg>,
  'AI/data sprint':       <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="3"/><path d="M10 2v3M10 15v3M2 10h3M15 10h3"/></svg>,
  'Design studio':        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l1-4 9-9 3 3-9 9-4 1z"/></svg>,
  'Cloud operations':     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 15a4 4 0 010-8 5 5 0 019.9 1A3.5 3.5 0 0115.5 15H6z"/></svg>,
  'Mentor pods':          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="2.5"/><circle cx="13" cy="7" r="2.5"/><path d="M2.5 17c.5-3 2.3-5 4.5-5s4 2 4.5 5M10.5 17c.5-3 2.3-5 4.5-5"/></svg>,
  'Weekly reviews':       <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="14" height="13" rx="1.5"/><path d="M3 8h14M7 2v4M13 2v4"/></svg>,
  'Client-style projects':<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h14v10H3z"/><path d="M7 9h6M7 12h4"/></svg>,
  'Completion reports':   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2h8l4 4v12H3V2z"/><path d="M13 2v4h4"/><path d="M7 15l2 2 4-4"/></svg>,
  'Interview prep':       <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="6" r="3"/><path d="M4 18c0-3.31 2.69-6 6-6s6 2.69 6 6"/></svg>,
  'Partner matching':     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="10" r="3"/><circle cx="14" cy="10" r="3"/><path d="M9 10h2"/></svg>,
  'Offer tracking':       <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M4 10l4-4M4 10l4 4"/></svg>,
  'Alumni proof':         <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.7l-4.9 2.5.9-5.5-4-3.9 5.5-.8z"/></svg>,
  'Positioning':          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="1.5"/></svg>,
  'Visual identity':      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="4"/><circle cx="13" cy="13" r="4"/></svg>,
  'Messaging':            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h14v9H7l-4 4z"/></svg>,
  'Launch kits':          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2l3 7h5l-4 4 1.5 6L10 15l-5.5 4L6 13l-4-4h5z"/></svg>,
  'Landing pages':        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="14" height="14" rx="1.5"/><path d="M3 8h14"/></svg>,
  'Corporate sites':      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17V8l7-5 7 5v9"/><path d="M8 17v-5h4v5"/></svg>,
  'Product pages':        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="12" height="14" rx="1.5"/><path d="M7 7h6M7 10h6M7 13h3"/></svg>,
  'SEO foundations':      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="6"/><path d="M13.5 13.5L18 18"/></svg>,
  'Paid acquisition':     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l5-7 4 3 5-8"/></svg>,
  'Reporting':            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="14" height="14" rx="1.5"/><path d="M7 13V9M10 13V6M13 13v-3"/></svg>,
  'Retargeting':          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10a6 6 0 1011.3-2.8M16 3v4h-4"/></svg>,
  'Creative testing':     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3v14M3 10h14"/></svg>,
  'Build':                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2.5l3 3L8 15H5v-3z"/><path d="M12.5 4.5l3 3"/></svg>,
  'Operate':              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="3"/><path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.2 4.2l2.1 2.1M13.7 13.7l2.1 2.1M4.2 15.8l2.1-2.1M13.7 6.3l2.1-2.1"/></svg>,
  'Private hosting':      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="14" height="10" rx="2"/><path d="M7 8V6a3 3 0 016 0v2"/><circle cx="10" cy="13" r="1.5"/></svg>,
  'RBAC':                 <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="14" cy="14" r="3"/><path d="M9 6h7M4 14H3M9 6v8"/></svg>,
  'Audit logs':           <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2h8l4 4v12H3V2z"/><path d="M13 2v4h4"/><path d="M7 9h6M7 12h4M7 15h3"/></svg>,
  'Human review':         <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="6" r="3"/><path d="M4 18c0-3.31 2.69-6 6-6s6 2.69 6 6"/><path d="M7 12l2 2 4-4"/></svg>,
};

const DEFAULT_CARD_ICON = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="14" height="14" rx="2"/>
    <path d="M7 10h6M10 7v6"/>
  </svg>
);

export function TrustSubpageBand({ section, page }: { section: TrustSectionData; page: TrustSubpageData }) {
  return (
    <div className="tsx-subpage-band" id={`${section.id}-${page.slug}`}>
      <div className="tsx-section-inner">
        <div className="tsx-subpage-cards-head tsx-fade">
          <span className="tsx-section-eyebrow">{page.title}</span>
          <h2 className="tsx-section-heading">{page.callout.trust}</h2>
          <button className="tsx-subpage-band-link" onClick={() => routeTo('trust', section.id, page.slug)}>
            Open {page.title}
          </button>
        </div>
        <div className="tsx-subpage-icon-grid">
          {page.cards.map((card, i) => (
            <button
              type="button"
              className={`tsx-subpage-icon-card tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`}
              key={card.title}
              onClick={() => routeTo('trust', section.id, page.slug)}
            >
              <div className="tsx-subpage-icon-wrap" aria-hidden="true">
                {SUBPAGE_CARD_ICONS[card.title] || DEFAULT_CARD_ICON}
              </div>
              <h3 className="tsx-subpage-card-title">{card.title}</h3>
              <p className="tsx-subpage-card-body">{card.trust}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TrustSubpageHero({ section, page }: { section: TrustSectionData; page: TrustSubpageData }) {
  const siblingPages = section.subpages || [];
  const titleRef = React.useRef(null);
  return (
    <section className="tsx-subpage-modern-hero">
      <div className="tsx-hero-beams" aria-hidden="true">
        <span className="tsx-hero-beam tsx-hero-beam--1" />
        <span className="tsx-hero-beam tsx-hero-beam--2" />
        <span className="tsx-hero-beam tsx-hero-beam--3" />
        <span className="tsx-hero-arc tsx-hero-arc--1" />
        <span className="tsx-hero-arc tsx-hero-arc--2" />
      </div>
      <TrustHeroParticles variant="subpage" />
      <TrustHeroEnergyLoop sectionId={section.id} targetRef={titleRef} />
      <div className="tsx-section-inner tsx-subpage-modern-hero-inner">
        <div className="tsx-subpage-modern-copy">
          <span className="tsx-subpage-modern-eyebrow">
            {getTrustSectionLabel(section)}
          </span>
          <h1 ref={titleRef}>{page.title}</h1>
          <p>{page.callout.trust}</p>
          <div className="tsx-subpage-modern-actions">
            <button className="tsx-btn-cta" onClick={() => routeTo('trust', 'contact', section.id)}>
              {TRUST_SECTION_CTA[section.id] || section.hero.trust.primary}
            </button>
            <button className="tsx-sec-btn-ghost" onClick={() => routeTo('trust', section.id)}>
              Back to {getTrustSectionLabel(section)}
            </button>
          </div>
        </div>
        <aside className="tsx-subpage-modern-index" aria-label={`${getTrustSectionLabel(section)} pages`}>
          <span>Explore</span>
          {siblingPages.map((item, i) => (
            <button
              key={item.slug}
              className={item.slug === page.slug ? 'active' : ''}
              onClick={() => routeTo('trust', section.id, item.slug)}
            >
              {item.title}
            </button>
          ))}
        </aside>
      </div>
    </section>
  );
}

export function TrustSubpageCards({ page }: { page: TrustSubpageData }) {
  return (
    <div className="tsx-subpage-feature-grid">
      {page.cards.map((card, i) => (
        <article className={`tsx-subpage-feature-card tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} key={card.title}>
          <span className="tsx-subpage-feature-icon" aria-hidden="true">
            {SUBPAGE_CARD_ICONS[card.title] || DEFAULT_CARD_ICON}
          </span>
          <span className="tsx-subpage-feature-index">{String(i + 1).padStart(2, '0')}</span>
          <h3>{card.title}</h3>
          <p>{card.trust}</p>
        </article>
      ))}
    </div>
  );
}

export function TrustSubpageDetailPage({ section, page, index }: { section: TrustSectionData; page: TrustSubpageData; index: number }) {
  const proofItems = section.proof || [];
  return (
    <main className="tsx-subpage-modern" style={{ '--sec-accent': TRUST_ACCENT[section.id] || 'var(--accent)' } as React.CSSProperties}>
      <TrustSubpageHero section={section} page={page} />

      <section className="tsx-subpage-dark-section">
        <div className="tsx-section-inner tsx-subpage-context-grid">
          <div>
            <span className="tsx-story-step-pill">Context</span>
            <span className="tsx-subpage-modern-eyebrow">Context</span>
            <h2>Where this fits in the engagement.</h2>
          </div>
          <p>{section.statement}</p>
        </div>
      </section>

      <section className="tsx-subpage-light-section">
        <div className="tsx-section-inner">
          <span className="tsx-story-step-pill">Capability detail</span>
          <header className="tsx-chapter-head tsx-page-chapter tsx-fade">
            <span className="tsx-chapter-eyebrow">Capability detail</span>
            <h2 className="tsx-chapter-title">What {page.title} includes</h2>
            <p className="tsx-chapter-sub">A focused view of the work inside this part of {getTrustSectionLabel(section)}.</p>
          </header>
          <TrustSubpageCards page={page} />
        </div>
      </section>

      <section className="tsx-subpage-dark-section tsx-subpage-proof-section">
        <div className="tsx-section-inner">
          <span className="tsx-story-step-pill">Delivery and proof</span>
          <header className="tsx-chapter-head tsx-page-chapter tsx-fade">
            <span className="tsx-chapter-eyebrow">Delivery path</span>
            <h2 className="tsx-chapter-title">How the work moves</h2>
            <p className="tsx-chapter-sub">The same delivery path holds across every {getTrustSectionLabel(section)} scope, from first frame to handover.</p>
          </header>
          <TrustProcessTrack steps={section.process} />
          {proofItems.length > 0 && (
            <div className="tsx-subpage-proof-wrap">
              <header className="tsx-chapter-head tsx-page-chapter tsx-fade">
                <span className="tsx-chapter-eyebrow">Proof</span>
                <h2 className="tsx-chapter-title">Evidence before claims</h2>
              </header>
              <TrustProofCards items={proofItems} />
            </div>
          )}
        </div>
      </section>

      <section className="tsx-subpage-light-section">
        <div className="tsx-section-inner">
          <span className="tsx-story-step-pill">Questions and intake</span>
          <header className="tsx-chapter-head tsx-page-chapter tsx-fade">
            <span className="tsx-chapter-eyebrow">Before you commit</span>
            <h2 className="tsx-chapter-title">Questions teams ask first</h2>
          </header>
          <TrustFaqAccordion faqs={section.faqs as [string, string][]} />
          <TrustIntakeBand
            spaced
            heading={section.intake.primary}
            sub={section.intake.secondary}
            cta={TRUST_SECTION_CTA[section.id] || 'Start a Project'}
            onClick={() => routeTo('trust', 'contact', section.id)}
          />
        </div>
      </section>
    </main>
  );
}
