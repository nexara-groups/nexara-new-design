'use client';
import React from 'react';
import { DATA } from '@/lib/data';
import { SECTION_HERO_WORDS, HAS_SCROLL_ANIMATION } from '@/lib/shared';
import { routeTo } from '@/lib/trust-router';
import { NotFound } from '../NotFound';
import { AcademyDepthStory } from './Academy';
import { TrustSubpageBand, TrustSubpageDetailPage } from './Subpage';
import { CyclingWord, TrustHeroParticles, TrustHeroEnergyLoop } from './Hero';
import { getTrustSectionLabel, TRUST_SECTION_CTA, TRUST_ACCENT } from './shared';
import {
  TrustModuleCards,
  TrustDeliverableCards,
  TrustProofCards,
  TrustPackageCards,
  TrustFaqAccordion,
  TrustLedgerRows,
  TRUST_RUNLOG,
  TrustRunLog,
  TrustSignalLine,
  TrustIntakeBand,
  TrustSignatureModule,
} from './Cards';

// One member of DATA.sections (academy | marketing | labs) — same structural
// idiom already used for `TrustSection` in StaticPages.tsx. Not yet centralized
// into a shared types file.
type TrustSection = (typeof DATA.sections)[keyof typeof DATA.sections];

export function TrustSectionHeader({ section }: { section: TrustSection }) {
  const copy = section.hero.trust;
  return (
    <div className="tsx-sec-header">
      <div className="tsx-sec-header-inner">
        <div>
          <span className="tsx-sec-eyebrow">{copy.eyebrow}</span>
          <h1 className="tsx-sec-h1">{copy.title}</h1>
          <p className="tsx-sec-body">{copy.body}</p>
          <div className="tsx-sec-actions">
            <button className="tsx-sec-btn-primary" onClick={() => routeTo('trust', 'contact')}>{copy.primary}</button>
            <button className="tsx-sec-btn-ghost" onClick={() => routeTo('trust', section.id, section.subpages[0]?.slug)}>{copy.secondary}</button>
          </div>
        </div>
        <div className="tsx-spec-panel">
          <span className="tsx-spec-panel-label">At a glance</span>
          {section.stats.map(([value, label]) => (
            <div className="tsx-spec-row" key={label}>
              <span className="tsx-spec-label">{label}</span>
              <span className="tsx-spec-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// No call sites remain in TrustSiteClient.tsx (dead code as of the verbatim
// port), but it is named in this group's extraction list, so it is preserved
// and exported as-is.
export function TrustSectionBlock({ eyebrow, children }: { eyebrow: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="tsx-section-block">
      <div className="tsx-section-block-header">
        <span className="tsx-section-block-eyebrow">{eyebrow}</span>
        <div className="tsx-section-block-rule" aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}

export function TrustStatement({ section }: { section: TrustSection }) {
  if (!section.statement) return null;
  return (
    <figure className="tsx-statement tsx-fade">
      <span className="tsx-statement-mark" aria-hidden="true">&ldquo;</span>
      <p className="tsx-statement-text">{section.statement}</p>
    </figure>
  );
}

/* Storytelling chapter — clean title, subtitle, then the module(s) for that beat. */
export function TrustChapter({ eyebrow, title, sub, children }: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="tsx-chapter tsx-fade">
      <header className="tsx-chapter-head">
        {eyebrow && <span className="tsx-chapter-eyebrow">{eyebrow}</span>}
        <h2 className="tsx-chapter-title">{title}</h2>
        {sub && <p className="tsx-chapter-sub">{sub}</p>}
      </header>
      <div className="tsx-chapter-body">{children}</div>
    </section>
  );
}

/* The section page told as one story. phase="intro" runs before the mechanism,
   phase="depth" after it — so the page reads who -> why -> what -> how -> proof -> ask. */
export function TrustSectionStory({ section, phase }: { section: TrustSection; phase: 'intro' | 'depth' }) {
  const whatWeDoTitle = section.id === 'academy' ? 'How we build a cohort'
    : section.id === 'labs' ? 'How we scope a build'
    : 'How we build a market system';

  if (phase === 'intro') {
    return (
      <div className="tsx-overview tsx-story tsx-story-light-band">
        <div className="tsx-section-inner">
          <TrustChapter
            eyebrow="Who this serves"
            title="Who this is for"
            sub="The people and teams an engagement is built around — and the outcome each one is after.">
            <TrustLedgerRows framed items={section.audiences} titleKey="title" bodyKey="trust" />
          </TrustChapter>

          {section.statement && (
            <TrustChapter
              eyebrow="The premise"
              title="Why it matters"
              sub="The belief that shapes every decision before the work begins.">
              <TrustStatement section={section} />
            </TrustChapter>
          )}

          <TrustChapter
            eyebrow="Capabilities"
            title={whatWeDoTitle}
            sub="The building blocks we combine into your engagement.">
            <TrustModuleCards rows={section.modules} />
          </TrustChapter>
        </div>
      </div>
    );
  }

  if (section.id === 'academy') return <AcademyDepthStory section={section} />;

  return (
    <>
      <div className="tsx-overview tsx-story tsx-story-light-band">
        <div className="tsx-section-inner">
          <TrustChapter
            eyebrow="What we deliver"
            title="What you get"
            sub="The concrete artifacts you walk away with.">
            <TrustDeliverableCards rows={section.stackDetails} />
          </TrustChapter>
        </div>
      </div>

      {section.proof && section.proof.length > 0 && (
        <section className="tsx-parent-dark-band tsx-parent-proof-band" data-story-step="03 / Proof">
          <div className="tsx-section-inner">
            <span className="tsx-story-step-pill">Delivery proof</span>
            <TrustChapter
              eyebrow="Delivery proof"
              title={section.id === 'academy' ? 'Cohort outcomes' : section.id === 'labs' ? 'Systems shipped' : 'Campaigns delivered'}
              sub="Evidence from work already shipped — not promises.">
              <TrustProofCards items={section.proof} />
              {TRUST_RUNLOG[section.id] && (
                <div className="tsx-runlog-wrap">
                  <div className="tsx-dimline" data-label="Run log" aria-hidden="true" />
                  <TrustRunLog config={TRUST_RUNLOG[section.id]!} />
                </div>
              )}
              {section.id === 'marketing' && <TrustSignalLine />}
            </TrustChapter>
          </div>
        </section>
      )}

      <div className="tsx-overview tsx-story tsx-story-light-band">
        <div className="tsx-section-inner">
          <TrustChapter
            eyebrow="Engagement packages"
            title="Ways to engage"
            sub="Scoped entry points, matched to where you are.">
            <TrustPackageCards packages={section.packages} />
          </TrustChapter>

          <TrustChapter
            eyebrow="Common questions"
            title="Before you commit"
            sub="The questions teams ask most, answered up front.">
            <TrustFaqAccordion faqs={section.faqs as [string, string][]} />
          </TrustChapter>
        </div>
      </div>
    </>
  );
}

export function TrustSectionHeroUnravel({ theme, section }: { theme: keyof TrustSection['hero']; section: TrustSection }) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const heroTitleRef = React.useRef<HTMLHeadingElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const TAU = Math.PI * 2;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const shape = section.id === "academy" ? "spiral" : section.id === "labs" ? "sphere" : "signal";
    // Ink-on-paper strands matching the section
    const rgb = section.id === "labs" ? [11, 31, 51] : [102, 160, 204];

    const makeSprite = (cRgb: number[]) => {
      const s = document.createElement("canvas");
      s.width = s.height = 64;
      const c = s.getContext("2d")!;
      const grad = c.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(" + cRgb[0] + "," + cRgb[1] + "," + cRgb[2] + ",0.9)");
      grad.addColorStop(0.3, "rgba(" + cRgb[0] + "," + cRgb[1] + "," + cRgb[2] + ",0.5)");
      grad.addColorStop(0.6, "rgba(" + cRgb[0] + "," + cRgb[1] + "," + cRgb[2] + ",0.14)");
      grad.addColorStop(1, "rgba(" + cRgb[0] + "," + cRgb[1] + "," + cRgb[2] + ",0)");
      c.fillStyle = grad;
      c.fillRect(0, 0, 64, 64);
      return s;
    };

    const sprite = makeSprite(rgb);
    let COUNT = window.innerWidth < 760 ? 260 : 560;
    let parts: { t: number; j: number; sz: number }[] = [];

    function build() {
      COUNT = window.innerWidth < 760 ? 260 : 560;
      parts = new Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        parts[i] = {
          t: i / COUNT,
          j: Math.random() * TAU,
          sz: 0.55 + Math.random()
        };
      }
    }
    build();

    let W = 0, H = 0, CX = 0, CY = 0, SCALE = 1;
    function measure() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth; H = canvas!.clientHeight;
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      CX = W / 2;
      CY = H * 0.48;
      SCALE = Math.min(W, H) * 0.32;
    }
    measure();

    const state = { p: 0, target: 1 };
    const isDesktop = window.innerWidth > 760;

    // Hero no longer waits on three screens of scroll. The formation plays
    // autonomously as a living backdrop — it breathes between a loose and a
    // fully-formed shape on a slow time loop, so the section reads in one view.
    let st: { kill: () => void } | undefined;
    const BREATHE = !prefersReducedMotion;

    let rafId = 0;
    let t0 = performance.now();

    function render(now: number) {
      const time = (now - t0) / 1000;
      if (BREATHE) state.target = 0.9 + Math.sin(time * 0.22) * 0.1;
      state.p += (state.target - state.p) * 0.05;
      if (Math.abs(state.target - state.p) < 0.0004) state.p = state.target;

      const p = state.p;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      const ry = p * 1.8 + time * 0.08;
      const rx = -0.15 + p * 0.3;
      const cy_ = Math.cos(ry), sy_ = Math.sin(ry);
      const cx_ = Math.cos(rx), sx_ = Math.sin(rx);

      parts.forEach((pt) => {
        const lx = (pt.t - 0.5) * 3.3;
        const ly = 0;
        const lz = 0;

        let sx = 0, sy = 0, sz = 0;
        if (shape === "spiral") {
          const a = pt.t * TAU * 2.2;
          const r = 0.35 + pt.t * 0.7;
          sx = Math.cos(a) * r;
          sy = (pt.t - 0.5) * 2.1;
          sz = Math.sin(a) * r;
        } else if (shape === "sphere") {
          const ga = pt.t * COUNT * 2.39996323;
          const y = 1 - pt.t * 2;
          const rr = Math.sqrt(Math.max(0, 1 - y * y));
          const R = 1.15;
          sx = Math.cos(ga) * rr * R;
          sy = y * R;
          sz = Math.sin(ga) * rr * R;
        } else {
          const a = pt.t * TAU * 3.4;
          const r = 0.1 + pt.t * 1.3;
          sx = Math.cos(a) * r;
          sy = Math.sin(pt.t * TAU * 2) * 0.1;
          sz = Math.sin(a) * r * 0.6;
        }

        const mx = lx * (1 - p) + sx * p;
        const my = ly * (1 - p) + sy * p;
        const mz = lz * (1 - p) + sz * p;

        const x1 = mx * cy_ - mz * sy_;
        const z1 = mx * sy_ + mz * cy_;
        const y2 = my * cx_ - z1 * sx_;
        const z2 = my * sx_ + z1 * cx_;

        const persp = 3.6 / (3.6 + z2);
        const px = CX + x1 * persp * SCALE;
        const py = CY + y2 * persp * SCALE;
        const d = pt.sz * persp * 2.8 * (W < 760 ? 1.4 : 2.0);

        if (px < -d || px > W + d || py < -d || py > H + d) return;

        ctx.globalAlpha = 0.95;
        ctx.drawImage(sprite, px - d / 2, py - d / 2, d, d);
      });

      rafId = sectionVisible ? requestAnimationFrame(render) : 0;
    }

    let sectionVisible = true;
    const io = new IntersectionObserver(([e]) => {
      sectionVisible = e?.isIntersecting ?? true;
      if (sectionVisible && !rafId) rafId = requestAnimationFrame(render);
    }, { threshold: 0 });
    if (wrapRef.current) io.observe(wrapRef.current);

    rafId = requestAnimationFrame(render);

    const onResize = () => {
      measure();
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      if (st) st.kill();
    };
  }, [section.id]);

  const copy = section.hero[theme];

  return (
    <div ref={wrapRef} className="tsx-hero-runway tsx-hero-runway--static" style={{ height: '100svh' }}>
      <div className="tsx-hero-stage">
        <div className="tsx-hero-beams" aria-hidden="true">
          <span className="tsx-hero-beam tsx-hero-beam--1" />
          <span className="tsx-hero-beam tsx-hero-beam--2" />
          <span className="tsx-hero-beam tsx-hero-beam--3" />
          <span className="tsx-hero-arc tsx-hero-arc--1" />
          <span className="tsx-hero-arc tsx-hero-arc--2" />
        </div>
        <canvas ref={canvasRef} className="tsx-hero-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <TrustHeroParticles variant={section.id} />
        <TrustHeroEnergyLoop sectionId={section.id} targetRef={heroTitleRef} />
        <div className="tsx-hero-chapter" style={{ opacity: 1, pointerEvents: 'auto' }}>
          <p className="tsx-section-eyebrow">{section.id === "academy" ? "01" : section.id === "marketing" ? "02" : "03"} / {getTrustSectionLabel(section).toUpperCase()}</p>
          <h1 ref={heroTitleRef} className="tsx-section-heading" style={{ color: '#F4F8FF', fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 700 }}>
            {copy.title}<br />
            <span className="serif" style={{ color: '#8FBBDD' }}>
              <CyclingWord words={(SECTION_HERO_WORDS.trust as Record<string, string[]>)[section.id] || [copy.accent]} />
            </span>
          </h1>
          <p className="tsx-sec-body" style={{ marginTop: '14px', maxWidth: '34em', color: 'rgba(220,232,248,.66)', marginInline: 'auto' }}>{copy.body}</p>
          <div className="tsx-sec-actions" style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="tsx-btn-cta" onClick={() => routeTo('trust', 'contact', section.id)}>{copy.primary}</button>
            <button className="tsx-sec-btn-ghost" onClick={() => {
              const target = section.id === 'academy'
                ? section.subpages.find((item) => item.slug === 'placements')
                : section.subpages[0];
              routeTo('trust', section.id, target?.slug);
            }}>{copy.secondary}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrustSectionPage({ section, detail }: { section: TrustSection; detail?: string | null }) {
  const activeSubpageIndex = detail ? section.subpages.findIndex((page) => page.slug === detail) : -1;
  if (detail && activeSubpageIndex === -1) return <NotFound theme="trust" page={`${section.id}/${detail}`} />;
  if (activeSubpageIndex >= 0) {
    return <TrustSubpageDetailPage section={section} page={section.subpages[activeSubpageIndex]!} index={activeSubpageIndex} />;
  }

  return (
    <main className={`tsx-section-page tsx-section-page--${section.id}`} style={{ '--sec-accent': TRUST_ACCENT[section.id] || 'var(--accent)' } as React.CSSProperties}>
      {/* Hook */}
      {HAS_SCROLL_ANIMATION ? (
        <TrustSectionHeroUnravel theme="trust" section={section} />
      ) : (
        <TrustSectionHeader section={section} />
      )}
      {/* Who this is for -> Why it matters -> What we do */}
      <TrustSectionStory section={section} phase="intro" />
      {/* How it works - the one mechanism, full-width centerpiece */}
      <section className="tsx-parent-dark-band tsx-parent-mechanism-band" data-story-step="02 / Mechanism">
        <div className="tsx-section-inner tsx-parent-band-marker">
          <span className="tsx-story-step-pill">Mechanism</span>
        </div>
        <TrustSignatureModule section={section} />
      </section>
      {/* What you get -> Proof -> Packages -> Questions */}
      <TrustSectionStory section={section} phase="depth" />
      {/* Go deeper */}
      {section.subpages.map(sp => (
        <TrustSubpageBand key={sp.slug} section={section} page={sp} />
      ))}
      {/* Invitation - one clear close */}
      <section className="tsx-section-inner">
        <TrustIntakeBand
          spaced
          heading={section.intake.primary}
          sub={section.intake.secondary}
          cta={TRUST_SECTION_CTA[section.id] || 'Start a Project'}
          onClick={() => routeTo('trust', 'contact', section.id)}
        />
      </section>
    </main>
  );
}

export function TrustPageHero({ eyebrow, title, accentWords, body, children, primaryLabel, onPrimary }: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  accentWords: string[];
  body?: React.ReactNode;
  children?: React.ReactNode;
  primaryLabel?: React.ReactNode;
  onPrimary?: () => void;
}) {
  const titleRef = React.useRef<HTMLHeadingElement | null>(null);
  return (
    <div className="tsx-hero-runway tsx-hero-runway--static" style={{ height: '100svh' }}>
      <div className="tsx-hero-stage">
        <div className="tsx-hero-beams" aria-hidden="true">
          <span className="tsx-hero-beam tsx-hero-beam--1" />
          <span className="tsx-hero-beam tsx-hero-beam--2" />
          <span className="tsx-hero-beam tsx-hero-beam--3" />
          <span className="tsx-hero-arc tsx-hero-arc--1" />
          <span className="tsx-hero-arc tsx-hero-arc--2" />
        </div>
        <TrustHeroParticles variant="page" />
        <TrustHeroEnergyLoop sectionId="academy" targetRef={titleRef} />
        <div className="tsx-hero-chapter" style={{ opacity: 1, pointerEvents: 'auto' }}>
          {eyebrow && <p className="tsx-section-eyebrow">{eyebrow}</p>}
          <h1 ref={titleRef} className="tsx-section-heading" style={{ color: '#F4F8FF', fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 700 }}>
            {title}<br />
            <span className="serif" style={{ color: '#8FBBDD' }}>
              <CyclingWord words={accentWords} />
            </span>
          </h1>
          {body && <p className="tsx-sec-body" style={{ marginTop: '14px', maxWidth: '34em', color: 'rgba(220,232,248,.66)', marginInline: 'auto' }}>{body}</p>}
          {children}
          {primaryLabel && (
            <div className="tsx-sec-actions" style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="tsx-btn-cta" onClick={onPrimary}>{primaryLabel}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
