'use client';
import React from 'react';
import { PackageGrid } from '../ui/package-card';
import { DATA } from '@/lib/data';
import { ACADEMY_LANES, ACADEMY_STEP_LINKS } from '@/lib/academy-story';
import { routeTo } from '@/lib/trust-router';
import { TRUST_RUNLOG, TrustRunLog, TrustProofCards, TrustFaqAccordion } from './Cards';
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

function AcademyPackageGrid({ packages }: { packages: AcademyPackage[] }) {
  return <PackageGrid packages={packages} ctaLabel="Request a proposal" onSelect={() => routeTo('trust', 'contact', 'academy')} />;
}

/** Students first; colleges and employers as secondary lanes with explicit package → subpage maps. */
export function AcademyWhoLane({ section }: { section: AcademySection }) {
  const primary = ACADEMY_LANES.find((l) => l.role === 'primary')!;
  const secondary = ACADEMY_LANES.filter((l) => l.role === 'secondary');
  const primaryAudience = section.audiences.find((a) => a.title === primary.audience) || section.audiences[0];

  return (
    <TrustChapter
      eyebrow="Who this serves"
      title="Built for students first"
      sub="Colleges and employers join the same path through their own package."
    >
      <div className="tsx-acad-who">
        <article className="tsx-acad-who-primary">
          <span className="tsx-acad-who-badge">Primary</span>
          <h3 className="tsx-acad-who-title">{primary.audience}</h3>
          <p className="tsx-acad-who-body">{primaryAudience?.trust || primary.trust.body}</p>
          <p className="tsx-acad-who-map">{primary.trust.map}</p>
          <button
            type="button"
            className="tsx-btn-primary"
            onClick={() => routeTo('trust', 'academy', primary.subpage, { scroll: false })}
          >
            Open {primary.subpageLabel} →
          </button>
        </article>
        <div className="tsx-acad-who-secondary">
          {secondary.map((lane) => {
            const audience = section.audiences.find((a) => a.title === lane.audience);
            return (
              <article className="tsx-acad-who-card" key={lane.audience}>
                <span className="tsx-acad-who-badge tsx-acad-who-badge--muted">Secondary</span>
                <h3 className="tsx-acad-who-title">{lane.audience}</h3>
                <p className="tsx-acad-who-body">{audience?.trust || lane.trust.body}</p>
                <p className="tsx-acad-who-map">{lane.trust.map}</p>
                <button
                  type="button"
                  className="tsx-btn-ghost"
                  onClick={() => routeTo('trust', 'academy', lane.subpage, { scroll: false })}
                >
                  Open {lane.subpageLabel} →
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </TrustChapter>
  );
}

/** Compact path links instead of three essay subpage bands. */
export function AcademyPathLinks({
  section,
  onOpen,
}: {
  section: AcademySection;
  onOpen: (slug: string) => void;
}) {
  return (
    <div className="tsx-acad-pathlinks">
      <div className="tsx-section-inner">
        <header className="tsx-chapter-head">
          <span className="tsx-chapter-eyebrow">Explore the path</span>
          <h2 className="tsx-chapter-title">Tracks, internships, placements</h2>
          <p className="tsx-chapter-sub">Same spine as Map → Cohort → Proof → Place. Open the stage you need.</p>
        </header>
        <div className="tsx-acad-pathlinks-grid">
          {section.subpages.map((page, i) => {
            const lane = ACADEMY_LANES.find((l) => l.subpage === page.slug);
            return (
              <button
                type="button"
                key={page.slug}
                className="tsx-acad-pathlink"
                onClick={() => onOpen(page.slug)}
              >
                <span className="tsx-acad-pathlink-step">{String(i + 1).padStart(2, '0')}</span>
                <span className="tsx-acad-pathlink-title">{page.title}</span>
                <span className="tsx-acad-pathlink-map">{lane?.trust.map || page.callout.trust}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AcademyDepthStory({ section }: { section: AcademySection }) {
  return (
    <>
      <div className="tsx-darkrail">
        <div className="tsx-section-inner">
          <header className="tsx-chapter-head">
            <span className="tsx-chapter-eyebrow tsx-darkrail-eyebrow">Match your lane</span>
            <h2 className="tsx-chapter-title tsx-darkrail-title">Audience → package → stage</h2>
            <p className="tsx-chapter-sub tsx-darkrail-sub">
              Students take Career Cohort. Colleges and employers enter beside them.
            </p>
          </header>
          <div className="tsx-acad-lane-legend" aria-hidden="true">
            {ACADEMY_LANES.map((lane) => (
              <span key={lane.audience} className={lane.role === 'primary' ? 'is-primary' : undefined}>
                {lane.trust.map}
              </span>
            ))}
          </div>
          <AcademyPackageGrid packages={section.packages} />
        </div>
      </div>

      {section.proof?.length > 0 && (
        <section className="tsx-parent-dark-band tsx-parent-proof-band" data-story-step="03 / Proof">
          <div className="tsx-section-inner">
            <span className="tsx-story-step-pill">Delivery proof</span>
            <TrustChapter
              eyebrow="Delivery proof"
              title="What held up"
              sub="Learner outcomes first. College and employer proof beside them."
            >
              <TrustProofCards items={section.proof} />
            </TrustChapter>
          </div>
        </section>
      )}

      <div className="tsx-section-inner tsx-story-tail">
        <TrustChapter
          eyebrow="Common questions"
          title="Before you commit"
          sub="The questions teams ask most, answered up front."
        >
          <TrustFaqAccordion faqs={section.faqs as [string, string][]} />
        </TrustChapter>
      </div>
    </>
  );
}

export function TrustCohortLadder({ section, eyebrow = 'The cohort path', title, sub = 'One path every cohort runs: assess, build, then prove.', ariaLabel = 'The cohort path' }: {
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
          <span className="tsx-section-eyebrow">The path</span>
          <h2 className="tsx-section-heading">Map → Cohort → Proof → Place</h2>
          <p className="tsx-signature-sub">One spine every programme runs. Students walk it first.</p>
        </div>

        <div className="tsx-apt-layout">
          <ol className="tsx-apt-rail" ref={railRef}>
            {steps.map((s, i) => {
              const meta = ACADEMY_STEP_LINKS[i];
              return (
                <li className="tsx-apt-step tsx-fade" style={{ transitionDelay: (i * 100) + 'ms' }} key={s.step}>
                  <div className="tsx-apt-spine-col">
                    <span className="tsx-apt-node">{s.step}</span>
                    {i < steps.length - 1 && <span className="tsx-apt-connector" aria-hidden="true" />}
                  </div>
                  <div className="tsx-apt-body">
                    <span className="tsx-apt-timing">{meta?.timing}</span>
                    <h3 className="tsx-apt-title">{s.title}</h3>
                    <p className="tsx-apt-desc">{s.body}</p>
                    <span className="tsx-apt-outcome">
                      <span className="tsx-apt-outcome-mark" aria-hidden="true" />
                      {meta?.outcome}
                      {meta?.opensLabel ? ` · opens ${meta.opensLabel}` : ''}
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
          <button className="tsx-btn-ghost" onClick={() => routeTo('trust', 'contact', 'academy')}>
            Plan a student cohort
          </button>
        </div>
      </div>
    </section>
  );
}
