'use client';
import React from 'react';
import { DATA } from '@/lib/data';
import { routeTo } from '@/lib/trust-router';
import { TRUST_RUNLOG, TrustRunLog, TrustDeliverableCards, TrustProofCards, TrustFaqAccordion } from './Cards';
import { TrustChapter } from './SectionShell';

type AcademySection = typeof DATA.sections.academy;
type AcademyPackage = AcademySection['packages'][number];

interface ProcessStep {
  step: string;
  title: string;
  body: string;
}

// TrustCohortLadder is reused for non-Academy sections too (see
// TrustSignatureModule in TrustSiteClient.tsx, which calls it for the "labs"
// section) — its prop type is intentionally structural, not tied to
// AcademySection, to reflect real call sites.
interface CohortLadderSection {
  id: string;
  process?: ProcessStep[];
}

const ACADEMY_PKG_ICONS = [
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M10 2l2.4 5 5.6.8-4 3.9.9 5.5L10 14.7l-4.9 2.5.9-5.5-4-3.9 5.6-.8z"/></svg>,
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="7" cy="7" r="3"/><circle cx="14" cy="7" r="2"/><path d="M1 17c0-3.31 2.69-6 6-6s6 2.69 6 6"/><path d="M14 12c1.66 0 4 .84 4 2.5V17h-3"/></svg>,
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 4h14v3H3zM3 10h14v3H3zM3 16h8v3H3z"/></svg>,
];

const CARD_POSITIONS = [
  { left: 0,   top: 44 },
  { left: 124, top: 0  },
  { left: 248, top: 44 },
];
const CARD_Z_BASE = [10, 30, 20];

export function AcademyDisplayCard({ pkg, index, isActive, onEnter }: {
  pkg: AcademyPackage;
  index: number;
  isActive: boolean;
  onEnter: () => void;
}) {
  const icon = ACADEMY_PKG_ICONS[index] || ACADEMY_PKG_ICONS[0];
  const featured = index === 1;
  const pos = CARD_POSITIONS[index] || CARD_POSITIONS[0]!;

  return (
    <div
      onMouseEnter={onEnter}
      style={{
        position: 'absolute',
        left: pos.left,
        top: pos.top,
        width: 260,
        zIndex: isActive ? 40 : CARD_Z_BASE[index],
        opacity: isActive ? 1 : 0.68,
        filter: isActive ? 'none' : 'grayscale(35%) brightness(0.98)',
        transform: isActive ? 'translateY(-14px)' : 'translateY(0)',
        boxShadow: isActive
          ? (featured
              ? '0 16px 44px rgba(102, 160, 204,0.18), 0 2px 8px rgba(0,0,0,0.07)'
              : '0 10px 32px rgba(0,0,0,0.13)')
          : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'transform 0.32s cubic-bezier(.22,1,.36,1), opacity 0.22s ease, filter 0.22s ease, box-shadow 0.22s ease',
        cursor: 'default',
      }}
      className={[
        'flex select-none flex-col rounded-2xl border-2 bg-white px-5 py-4',
        isActive
          ? (featured ? 'border-[#66A0CC]' : 'border-slate-300')
          : (featured ? 'border-[#66A0CC]/40' : 'border-slate-200'),
      ].join(' ')}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex rounded-full p-1.5 ${featured ? 'bg-blue-100' : 'bg-slate-100'}`}>
          <span className={featured ? 'text-blue-500' : 'text-slate-400'}>{icon}</span>
        </span>
        <p className={`text-sm font-semibold leading-tight ${featured ? 'text-blue-600' : 'text-slate-700'}`}>{pkg.name}</p>
      </div>
      <p className="text-xs font-medium text-slate-500 mb-1">{pkg.fit}</p>
      <div className="text-xs text-slate-400 mb-3">{pkg.duration}</div>
      <ul className="space-y-1.5 flex-1">
        {pkg.includes.map(item => (
          <li key={item} className="text-xs text-slate-500 flex items-start gap-1.5">
            <svg viewBox="0 0 16 16" className="w-3 h-3 text-[#66A0CC] shrink-0 mt-px" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8.5l3 3 7-7"/>
            </svg>
            {item}
          </li>
        ))}
      </ul>
      <button
        className={`mt-4 w-full py-2 rounded-lg text-xs font-semibold transition-colors ${
          featured
            ? 'bg-[#66A0CC] text-white hover:bg-[#44719C]'
            : 'border border-slate-200 text-slate-600 hover:border-[#66A0CC] hover:text-[#66A0CC]'
        }`}
        onClick={() => routeTo('trust', 'contact')}
      >
        {featured ? 'Start here →' : 'Get in touch'}
      </button>
    </div>
  );
}

export function AcademyDisplayCards({ packages }: { packages: AcademyPackage[] }) {
  const [active, setActive] = React.useState(1);

  return (
    <div className="flex flex-col gap-8">
      <div style={{ overflowX: 'auto', overflowY: 'visible', paddingBottom: 20 }}>
        <div
          className="relative"
          style={{ width: 508, height: 318, minWidth: 508 }}
          onMouseLeave={() => setActive(1)}
        >
          {packages.slice(0, 3).map((pkg, i) => (
            <AcademyDisplayCard
              key={pkg.name}
              pkg={pkg}
              index={i}
              isActive={active === i}
              onEnter={() => setActive(i)}
            />
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-400">Hover each card to preview. All programmes carry a named engagement owner.</p>
    </div>
  );
}

export function AcademyPackageGrid({ packages }: { packages: AcademyPackage[] }) {
  return (
    <div className="tsx-engage-grid">
      {packages.map((pkg, i) => {
        const featured = i === 1;
        return (
          <div key={pkg.name} className={`tsx-engage-card${featured ? ' featured' : ''}`}>
            <div className="tsx-engage-card-header">
              {featured && <span className="tsx-engage-badge">Most common</span>}
              <div className="tsx-engage-card-title-row">
                <p className="tsx-engage-name">{pkg.name}</p>
                <span className="tsx-engage-fit">{pkg.fit}</span>
              </div>
            </div>
            <div className="tsx-engage-meta">
              <span className="tsx-engage-price">{pkg.price}</span>
              <span className="tsx-engage-dur">{pkg.duration}</span>
            </div>
            <ul className="tsx-engage-list">
              {pkg.includes.map(item => (
                <li key={item}>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8.5l3 3 7-7"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="tsx-engage-foot">
              <button
                className={featured ? 'tsx-engage-cta-primary' : 'tsx-engage-cta-ghost'}
                onClick={() => routeTo('trust', 'contact')}
              >
                {featured ? 'Start here →' : 'Get in touch'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AcademyDepthStory({ section }: { section: AcademySection }) {
  return (
    <>
      <div className="tsx-overview tsx-story tsx-story-light-band">
        <div className="tsx-section-inner">
          {/* TrustChapter — cross-group dependency (TrustSiteClient.tsx) */}
          <TrustChapter
            eyebrow="What we deliver"
            title="What you get"
            sub="The concrete artifacts you walk away with.">
            {/* TrustDeliverableCards — cross-group dependency (TrustSiteClient.tsx) */}
            <TrustDeliverableCards rows={section.stackDetails} />
          </TrustChapter>
        </div>
      </div>

      {section.proof?.length > 0 && (
        <section className="tsx-parent-dark-band tsx-parent-proof-band" data-story-step="03 / Proof">
          <div className="tsx-section-inner">
            <span className="tsx-story-step-pill">Delivery proof</span>
            <TrustChapter
              eyebrow="Delivery proof"
              title="Cohort outcomes"
              sub="Evidence from work already shipped — not promises.">
              {/* TrustProofCards — cross-group dependency (TrustSiteClient.tsx) */}
              <TrustProofCards items={section.proof} />
            </TrustChapter>
          </div>
        </section>
      )}

      <div className="tsx-darkrail">
        <div className="tsx-section-inner">
          <header className="tsx-chapter-head">
            <span className="tsx-chapter-eyebrow tsx-darkrail-eyebrow">Engagement packages</span>
            <h2 className="tsx-chapter-title tsx-darkrail-title">Ways to engage</h2>
            <p className="tsx-chapter-sub tsx-darkrail-sub">Scoped entry points, matched to where you are.</p>
          </header>
          <AcademyPackageGrid packages={section.packages} />
        </div>
      </div>

      <div className="tsx-section-inner tsx-story-tail">
        <TrustChapter
          eyebrow="Common questions"
          title="Before you commit"
          sub="The questions teams ask most, answered up front.">
          {/* TrustFaqAccordion — cross-group dependency (TrustSiteClient.tsx) */}
          <TrustFaqAccordion faqs={section.faqs as [string, string][]} />
        </TrustChapter>
      </div>
    </>
  );
}

export function TrustCohortLadder({ section, eyebrow = 'The cohort path', title, sub = 'One path every cohort runs — assess, build, then prove.', ariaLabel = 'The cohort path' }: {
  section: CohortLadderSection;
  eyebrow?: string;
  title?: React.ReactNode;
  sub?: string;
  ariaLabel?: string;
}) {
  const steps = section.process || [];
  const railRef = React.useRef<HTMLOListElement>(null);
  React.useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.style.setProperty('--draw', '1'); return; }
    let raf = 0;
    const compute = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.82, end = vh * 0.32;
      const p = (start - r.top) / (start - end + r.height);
      el.style.setProperty('--draw', String(Math.max(0, Math.min(1, p))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    compute();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [steps.length]);
  if (!steps.length) return null;
  return (
    <section className="tsx-signature tsx-ladder-section" aria-label={ariaLabel}>
      <div className="tsx-section-inner">
        <div className="tsx-signature-head tsx-fade">
          <span className="tsx-section-eyebrow">{eyebrow}</span>
          <h2 className="tsx-section-heading">{title || <>From intake<br /><span className="serif">to hiring outcome.</span></>}</h2>
          <p className="tsx-signature-sub">{sub}</p>
        </div>
        <div className="tsx-ladder-layout">
          <ol className="tsx-ladder" ref={railRef}>
            {steps.map((s, i) => (
              <li className="tsx-ladder-step tsx-fade" style={{ transitionDelay: (i * 90) + 'ms' }} key={s.step}>
                <span className="tsx-ladder-node">{s.step}</span>
                <div className="tsx-ladder-body">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          {TRUST_RUNLOG[section.id] && (
            <div className="tsx-ladder-runlog tsx-fade">
              <div className="tsx-dimline" data-label="Run log" aria-hidden="true" />
              <TrustRunLog config={TRUST_RUNLOG[section.id]!} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Academy Process Timeline ─── */
const ACADEMY_STEP_META = [
  { timing: 'Week 1',      outcome: 'Written learner brief' },
  { timing: 'Weeks 2–8',  outcome: 'Progress on the record' },
  { timing: 'Weeks 7–10', outcome: 'Interview-ready portfolio' },
  { timing: 'Week 10+',   outcome: 'Placement or outcome report' },
];

export function AcademyProcessTimeline({ section }: { section: AcademySection }) {
  const steps = section.process || [];
  const railRef = React.useRef<HTMLOListElement>(null);

  React.useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--draw', '1');
      return;
    }
    let raf = 0;
    const compute = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85, end = vh * 0.28;
      const p = (start - r.top) / (start - end + r.height);
      el.style.setProperty('--draw', String(Math.max(0, Math.min(1, p))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [steps.length]);

  if (!steps.length) return null;

  return (
    <section className="tsx-signature tsx-apt-section" aria-label="The cohort path">
      <div className="tsx-section-inner">
        <div className="tsx-signature-head tsx-fade">
          <span className="tsx-section-eyebrow">The cohort path</span>
          <h2 className="tsx-section-heading">From intake<br /><span className="serif">to hiring outcome.</span></h2>
          <p className="tsx-signature-sub">One path every cohort runs — assess, build, then prove.</p>
        </div>

        <div className="tsx-apt-layout">
          <ol className="tsx-apt-rail" ref={railRef}>
            {steps.map((s, i) => {
              const meta: { timing?: string; outcome?: string } = ACADEMY_STEP_META[i] || {};
              return (
                <li className="tsx-apt-step tsx-fade" style={{ transitionDelay: (i * 100) + 'ms' }} key={s.step}>
                  <div className="tsx-apt-spine-col">
                    <span className="tsx-apt-node">{s.step}</span>
                    {i < steps.length - 1 && <span className="tsx-apt-connector" aria-hidden="true" />}
                  </div>
                  <div className="tsx-apt-body">
                    <span className="tsx-apt-timing">{meta.timing}</span>
                    <h3 className="tsx-apt-title">{s.title}</h3>
                    <p className="tsx-apt-desc">{s.body}</p>
                    <span className="tsx-apt-outcome">
                      <span className="tsx-apt-outcome-mark" aria-hidden="true" />
                      {meta.outcome}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>

          {TRUST_RUNLOG[section.id] && (
            <div className="tsx-apt-runlog tsx-fade">
              <div className="tsx-dimline" data-label="Run log" aria-hidden="true" />
              <TrustRunLog config={TRUST_RUNLOG[section.id]!} />
            </div>
          )}
        </div>

        <div className="tsx-apt-cta-row tsx-fade" style={{ transitionDelay: '420ms' }}>
          <button className="tsx-btn-primary" onClick={() => routeTo('trust', 'academy', 'tracks')}>
            See the tracks →
          </button>
          <button className="tsx-btn-ghost" onClick={() => routeTo('trust', 'contact')}>
            Plan an Academy programme
          </button>
        </div>
      </div>
    </section>
  );
}
