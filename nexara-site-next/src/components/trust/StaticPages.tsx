'use client';

import React from 'react';
import { DATA } from '@/lib/data';
import { useBriefForm, SECTION_HERO_WORDS } from '@/lib/shared';
import { routeTo } from '@/lib/trust-router';
import { NotFound } from '../NotFound';
import { TrustPageHero } from './SectionShell';
import { TrustLedgerTable, TrustProofCards, TrustIntakeBand, TrustLedgerRows } from './Cards';
import { getTrustSectionLabel } from './shared';

type DetailSlug = string | null;

type TrustCustomersProps = {
  detail: DetailSlug;
};

type TrustContactProps = {
  detail: DetailSlug;
};

type TrustConciergeProps = {
  page: string;
};

type TrustSection = (typeof DATA.sections)[keyof typeof DATA.sections];

export function TrustCustomers({ detail }: TrustCustomersProps) {
  const activeSection = detail ? DATA.sections[detail as keyof typeof DATA.sections] : null;
  if (detail && !activeSection) return <NotFound theme="trust" page={`customers/${detail}`} />;
  const proofItems = activeSection ? DATA.customers.filter(customer => customer.id === detail) : DATA.customers;
  return (
    <main className="tsx-customers-page">
      <TrustPageHero
        eyebrow={activeSection ? `${activeSection.name} — Proof` : "Operating Proof"}
        title="Delivery proof"
        accentWords={SECTION_HERO_WORDS.trust.customers}
        body="Each engagement is framed as a delivery model — scope evidence, the work produced, and the operating readiness handed over. No invented logos, no vanity metrics."
        primaryLabel="Start an engagement"
        onPrimary={() => routeTo('trust', 'contact')}
      >
        <div className="tsx-page-hero-stats">
          {[["3","solution lines"],["3","proof records"],["100%","scoped & owned"]].map(([v, l]) => (
            <div key={l} className="tsx-page-hero-stat">
              <span className="tsx-page-hero-stat-value">{v}</span>
              <span className="tsx-page-hero-stat-label">{l}</span>
            </div>
          ))}
        </div>
      </TrustPageHero>
      <section className="tsx-section-inner tsx-proof-table-section">
        <header className="tsx-chapter-head tsx-page-chapter tsx-fade">
          <span className="tsx-chapter-eyebrow">Operating proof</span>
          <h2 className="tsx-chapter-title">Delivery model proof</h2>
          <p className="tsx-chapter-sub">Every engagement framed as scope evidence, the work produced, and the readiness handed over.</p>
        </header>
        <TrustLedgerTable
          label="Delivery model proof"
          columns={["Section", "Engagement type", "What was produced"]}
          rows={proofItems.map(c => [c.section, c.company, c.trust])}
        />
      </section>
      {!activeSection && (
        <section className="tsx-section-inner tsx-proof-bysection">
          <div className="tsx-dimline" data-label="By solution line" aria-hidden="true" />
          {Object.values(DATA.sections).map((sec) => (
            <div className="tsx-proof-group" key={sec.id}>
              <div className="tsx-proof-group-head">
                <span className="tsx-section-eyebrow">{getTrustSectionLabel(sec)}</span>
                <h3 className="tsx-section-heading">{sec.short.trust}</h3>
              </div>
              <TrustProofCards items={sec.proof} />
            </div>
          ))}
        </section>
      )}
      <section className="tsx-section-inner">
        <TrustIntakeBand spaced heading="Start a scoped engagement" sub="Tell us what you need. Nexara maps the right next step." />
      </section>
    </main>
  );
}

export function TrustCompany() {
  const company = DATA.company.trust;
  return (
    <main className="tsx-company-page">
      <div className="tsx-sec-header">
        <div className="tsx-sec-header-inner">
          <div>
            <span className="tsx-sec-eyebrow">About Nexara</span>
            <h1 className="tsx-sec-h1">The operating idea is simple.</h1>
            <p className="tsx-sec-body">{company.manifesto}</p>
          </div>
          <div className="tsx-spec-panel">
            <span className="tsx-spec-panel-label">Company facts</span>
            {DATA.company.facts.map(([label, value]) => (
              <div className="tsx-spec-row" key={label}>
                <span className="tsx-spec-label">{label}</span>
                <span className="tsx-spec-value-text">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <section className="tsx-section-inner tsx-principles-section">
        <header className="tsx-chapter-head tsx-page-chapter tsx-fade">
          <span className="tsx-chapter-eyebrow">How we operate</span>
          <h2 className="tsx-chapter-title">Operating principles</h2>
          <p className="tsx-chapter-sub">The commitments that hold steady across every engagement.</p>
        </header>
        <TrustLedgerRows items={company.principles} titleKey="title" bodyKey="body" />
      </section>
      <section className="tsx-section-inner tsx-standards-section">
        <header className="tsx-chapter-head tsx-page-chapter tsx-fade">
          <span className="tsx-chapter-eyebrow">Governance</span>
          <h2 className="tsx-chapter-title">Delivery governance</h2>
          <p className="tsx-chapter-sub">The standards each engagement is measured against.</p>
        </header>
        <TrustLedgerTable
          label="Delivery governance"
          columns={["Standard", "Commitment"]}
          rows={DATA.company.standards.map(item => [item.title, item.body])}
        />
        <TrustIntakeBand spaced heading="Work with Nexara" sub="Pick a solution line and open an engagement." />
      </section>
    </main>
  );
}

/* Icon map for channel selection cards */
const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  academy:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  marketing: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  labs:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>,
  home:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>,
};

export function TrustContact({ detail }: TrustContactProps) {
  const copy = DATA.contact.trust;
  const {
    formData,
    handleChange,
    handleLaneSelect,
    handleSubmit,
    showSuccess,
  } = useBriefForm(detail, { scrollSelector: ".tsx-brief-section" });

  return (
    <main className="tsx-contact-page">
      <TrustPageHero
        eyebrow={copy.eyebrow}
        title="A structured engagement"
        accentWords={SECTION_HERO_WORDS.trust.contact}
        body={copy.body}
      >
        <a className="tsx-email-pill" href={`mailto:${copy.accent}`} style={{ marginTop: '20px', display: 'inline-block' }}>{copy.accent}</a>
      </TrustPageHero>

      <section className="tsx-section-inner tsx-channel-section">
        <header className="tsx-chapter-head tsx-page-chapter tsx-fade">
          <span className="tsx-chapter-eyebrow">Where to start</span>
          <h2 className="tsx-chapter-title">Select a section</h2>
          <p className="tsx-chapter-sub">Pick the line closest to what you need — it routes your request to the right team.</p>
        </header>
        <div className="tsx-channel-grid">
          {DATA.contact.channels.map(channel => {
            const isActive = formData.section === channel.section;
            return (
              <button
                key={channel.title}
                type="button"
                className={isActive ? "tsx-channel-card active" : "tsx-channel-card"}
                onClick={() => handleLaneSelect(channel.section)}
                aria-pressed={isActive}
              >
                <div className="tsx-channel-card-header">
                  <span className="tsx-channel-icon" aria-hidden="true">
                    {CHANNEL_ICONS[channel.section] || CHANNEL_ICONS.home}
                  </span>
                  <h3>{channel.title}</h3>
                  {isActive && (
                    <span className="tsx-channel-check" aria-label="Selected">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  )}
                </div>
                <p>{channel.body}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="tsx-brief-band">
      <div className="tsx-section-inner tsx-brief-section">
        <header className="tsx-chapter-head tsx-page-chapter tsx-fade">
          <span className="tsx-chapter-eyebrow">Your request</span>
          <h2 className="tsx-chapter-title">{DATA.contact.enquiry.title}</h2>
        </header>
        <p className="tsx-brief-intro">{DATA.contact.enquiry.body}</p>
        {showSuccess ? (
          <TrustIntakeBand heading="Enquiry prepared. Your mail client will open shortly." sub="If it does not open, use the email link on this page and include the project details manually." cta={null} />
        ) : (
          <div className="tsx-brief-grid">
            <form className="tsx-brief-form" onSubmit={handleSubmit}>

              {/* Group 1: Contact info */}
              <fieldset className="tsx-field-group">
                <legend className="tsx-field-group-label">Contact info</legend>
                <div className="tsx-field-row">
                  <div className="tsx-field">
                    <label className="tsx-field-label" htmlFor="trust-name">Your name</label>
                    <input id="trust-name" className="tsx-field-input" type="text" placeholder="Decision-maker name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                  </div>
                  <div className="tsx-field">
                    <label className="tsx-field-label" htmlFor="trust-email">Email</label>
                    <input id="trust-email" className="tsx-field-input" type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                  </div>
                </div>
              </fieldset>

              {/* Group 2: Project context */}
              <fieldset className="tsx-field-group">
                <legend className="tsx-field-group-label">Project context</legend>
                <div className="tsx-field-row">
                  <div className="tsx-field">
                    <label className="tsx-field-label" htmlFor="trust-audience">Audience / user group</label>
                    <input id="trust-audience" className="tsx-field-input" type="text" placeholder="e.g. engineering students, local shoppers" value={formData.audience} onChange={(e) => handleChange("audience", e.target.value)} />
                  </div>
                  <div className="tsx-field">
                    <label className="tsx-field-label" htmlFor="trust-city">City</label>
                    <input id="trust-city" className="tsx-field-input" type="text" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
                  </div>
                </div>
                <div className="tsx-field">
                  <label className="tsx-field-label" htmlFor="trust-timeline">Timeline</label>
                  <select id="trust-timeline" className="tsx-field-input tsx-field-select" value={formData.timeline} onChange={(e) => handleChange("timeline", e.target.value)}>
                    <option value="1-3 months">1–3 months</option>
                    <option value="3-6 months">3–6 months</option>
                    <option value="6-12 months">6–12 months</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>
              </fieldset>

              {/* Group 3: Brief */}
              <fieldset className="tsx-field-group">
                <legend className="tsx-field-group-label">Requirements</legend>
                <div className="tsx-field">
                  <label className="tsx-field-label" htmlFor="trust-context">Context / current state</label>
                  <textarea id="trust-context" className="tsx-field-input" placeholder="Existing website, tools, platforms, repositories, or current workflow" value={formData.context} onChange={(e) => handleChange("context", e.target.value)} />
                </div>
                <div className="tsx-field">
                  <label className="tsx-field-label" htmlFor="trust-success">Success metric</label>
                  <input id="trust-success" className="tsx-field-input" type="text" placeholder="e.g. improve enquiry conversion, launch a cohort dashboard" value={formData.successMetric} onChange={(e) => handleChange("successMetric", e.target.value)} />
                </div>
              </fieldset>

              <button className="tsx-btn-cta tsx-brief-submit" type="submit">{DATA.contact.enquiry.label}</button>
            </form>

            <aside className="tsx-checklist-panel">
              <span className="tsx-checklist-eyebrow">What makes a good request</span>
              <p className="tsx-checklist-sub">Cover these points and we scope your engagement same day.</p>
              <ul>
                {DATA.contact.checklist.map(item => (
                  <li key={item}>
                    <span className="tsx-checklist-check" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M4.5 7l1.8 1.8 3.2-3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <a className="tsx-checklist-email" href={DATA.contact.enquiry.href}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
                {copy.accent}
              </a>
            </aside>
          </div>
        )}
      </div>
      </section>
    </main>
  );
}

export function TrustConcierge({ page }: TrustConciergeProps) {
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 640);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [page]);
  if (page === 'contact') return null;
  return (
    <button
      className={`tsx-concierge${shown ? ' is-shown' : ''}`}
      onClick={() => routeTo('trust', 'contact')}
      aria-label="Talk to Nexara — start a request"
    >
      <span className="tsx-concierge-dot" aria-hidden="true" />
      <span className="tsx-concierge-label">Talk to us</span>
      <span className="tsx-concierge-arr" aria-hidden="true">→</span>
    </button>
  );
}
