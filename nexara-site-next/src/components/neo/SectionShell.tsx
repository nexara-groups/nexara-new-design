'use client';
import React from 'react';
import type { Variants } from 'framer-motion';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DATA } from '@/lib/data';
import { voice, SECTION_HERO_WORDS } from '@/lib/shared';
import { routeTo } from '@/lib/neo-router';
import { NotFound } from '../NotFound';
import { SubNav } from './Nav';
import { CyclingWord } from './Hero';
import { AcademyHero, AcademyTerminalSection, AcademyBootSequence } from './Academy';
import { MarketingHero, LabsHero, LabsBlueprintSection, MarketingSignalSection, MarketingFunnelSection } from './MarketingLabs';
import { ModuleCard, ModuleModal, BeforeAfterSlider, RoiEstimator, InteractiveTimeline, CARD_MOTION } from './Cards';
const { useState, useMemo } = React;

// See trust/Hero.tsx for why this is repeated per-file rather than centralized.
if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// Minimal shapes actually read by this group — DATA.sections entries carry
// more fields (process, packages, stack, short, statement, etc.) that aren't
// typed here since this group never touches them.
type Theme = 'neo' | 'trust';

interface VoiceText {
  neo?: string;
  trust?: string;
}

interface HeroCopy {
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  primary: string;
  secondary: string;
}

interface ModuleItem extends VoiceText {
  title: string;
}

interface StackDetailItem {
  title: string;
  outcome: string;
  deliverables: string[];
}

interface ProofItem {
  name: string;
  org: string;
  result: string | VoiceText;
}

interface SubpageEntry {
  slug: string;
  title: string;
  callout: string | VoiceText;
  cards: ModuleItem[];
}

// Real structural type from DATA, not a hand-rolled interface — a hand-rolled
// version here previously didn't match the real shape, so every cross-group
// caller passing a real DATA.sections.* value needed `as any` to compile.
type SectionData = (typeof DATA.sections)[keyof typeof DATA.sections];

// SECTION_HERO_WORDS (from @/lib/shared) is keyed by theme, then by a fixed
// set of section ids per theme — cast to a permissive shape since `theme` and
// `section.id` are both dynamic here (matches original runtime behavior,
// which relied on plain JS indexing).
type SectionHeroWordsMap = Record<string, Record<string, string[]>>;

interface HeroBannerProps {
  theme: Theme;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  section?: SectionData | null;
  compact?: boolean;
}

function HeroBanner({ theme, eyebrow, title, accent, body, section, compact = false }: HeroBannerProps) {
  const stats = section ? section.stats : [["3", "equal sections"], ["2", "presentations"], ["1", "incorporated company"], ["4", "intake routes"]];
  return (
    <section className={"hero-banner" + (compact ? " compact" : "")}>
      <div className="hero-bg">
        <div className="orb one"></div>
        <div className="orb two"></div>
        <div className="scanlines"></div>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>
          {title}{" "}
          <em>
            {accent && accent.includes("@") ? (
              <a href={`mailto:${accent}`} style={{ color: "inherit", textDecoration: "underline" }}>
                {accent}
              </a>
            ) : (
              accent
            )}
          </em>
        </h1>
        <p className="hero-body">{body}</p>
        <div className="hero-actions">
          <button onClick={() => routeTo(theme, section ? section.id : "academy")}>{section ? section.hero[theme].primary : "Start with Academy"}</button>
          <button className="secondary" onClick={() => routeTo(theme, "customers", section ? section.id : null)}>{section ? section.hero[theme].secondary : "View proof"}</button>
        </div>
      </div>
      <div className="hero-dashboard">
        {stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </div>
    </section>
  );
}

interface NeoSectionHeroProps {
  theme: Theme;
  section: SectionData;
  variant: 'mkt' | 'labs';
  children?: React.ReactNode;
}

function NeoSectionHero({ theme, section, variant, children }: NeoSectionHeroProps) {
  const copy = section.hero[theme];
  return (
    <section className={`hero-banner compact neo-sig-hero neo-sig-${variant}`}>
      <div className="hero-bg">
        <div className="orb one"></div>
        <div className="orb two"></div>
        <div className="scanlines"></div>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>
          {copy.title}{' '}
          <em><CyclingWord words={(SECTION_HERO_WORDS as SectionHeroWordsMap)[theme]?.[section.id] || [copy.accent]} /></em>
        </h1>
        <p className="hero-body">{copy.body}</p>
        <div className="hero-actions">
          <button onClick={() => routeTo(theme, section.id, section.subpages[0]!.slug)}>{copy.primary}</button>
          <button className="secondary" onClick={() => routeTo(theme, "customers", section.id)}>{copy.secondary}</button>
        </div>
      </div>
      <div className="neo-sig-visual">{children}</div>
    </section>
  );
}

interface NeoSectionHeroUnravelProps {
  theme: Theme;
  section: SectionData;
}

function NeoSectionHeroUnravel({ theme, section }: NeoSectionHeroUnravelProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvasMaybe = canvasRef.current;
    if (!canvasMaybe) return;
    const wrapMaybe = wrapRef.current;
    if (!wrapMaybe) return;
    // Re-bind with an explicit non-nullable declared type (rather than relying
    // on narrowing) so the nested `measure`/`render` function declarations
    // below — which TS does not carry control-flow narrowing into — still see
    // a non-null type for every access.
    const canvas: HTMLCanvasElement = canvasMaybe;
    const wrap: HTMLDivElement = wrapMaybe;

    const ctxMaybe = canvas.getContext("2d");
    if (!ctxMaybe) return;
    const ctx: CanvasRenderingContext2D = ctxMaybe;
    const TAU = Math.PI * 2;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = window.matchMedia("(max-width: 760px)").matches
      || Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
      || (navigator.hardwareConcurrency || 8) <= 4;

    const shape = section.id === "academy" ? "spiral" : section.id === "labs" ? "sphere" : "signal";
    const rgb = section.id === "academy" ? [124, 92, 255] : section.id === "labs" ? [255, 92, 138] : [0, 229, 160];

    const makeSprite = (cRgb: number[]) => {
      const s = document.createElement("canvas");
      s.width = s.height = 64;
      const c = s.getContext("2d");
      if (!c) return s;
      const grad = c.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,0.95)");
      grad.addColorStop(0.18, "rgba(" + cRgb[0] + "," + cRgb[1] + "," + cRgb[2] + ",0.85)");
      grad.addColorStop(0.5, "rgba(" + cRgb[0] + "," + cRgb[1] + "," + cRgb[2] + ",0.22)");
      grad.addColorStop(1, "rgba(" + cRgb[0] + "," + cRgb[1] + "," + cRgb[2] + ",0)");
      c.fillStyle = grad;
      c.fillRect(0, 0, 64, 64);
      return s;
    };

    const sprite = makeSprite(rgb);
    let COUNT = lowPower ? 64 : 180;
    let parts: { t: number; j: number; sz: number }[] = [];

    // Constellation-line scratch (same treatment as the home hero).
    const lineBuf = new Float32Array(COUNT * 2);
    const LINE_STRIDE = lowPower ? 4 : 3;
    const LINE_CAP = lowPower ? 36 : 80;

    function build() {
      COUNT = lowPower ? 64 : 180;
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
      const dpr = lowPower ? 1 : Math.min(window.devicePixelRatio || 1, 1.35);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      CX = W / 2;
      CY = H * 0.48;
      SCALE = Math.min(W, H) * 0.32;
    }
    measure();

    const state = { p: 0, target: 0 };
    let sectionVisible = true;
    let rafId = 0;
    let lastFrame = 0;
    let idleFrames = 0;
    let resizeTimer: number | undefined;
    const frameInterval = 1000 / (lowPower ? 24 : 30);

    let st: ScrollTrigger | undefined;
    if (!prefersReducedMotion) {
      st = ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          state.target = self.progress;
          ensureRender();
        }
      });
    } else {
      state.target = 1;
      wrap.style.height = "100svh";
    }

    const t0 = performance.now();

    function ensureRender() {
      if (sectionVisible && !rafId && !document.hidden) rafId = requestAnimationFrame(render);
    }

    function render(now: number) {
      rafId = 0;
      if (!sectionVisible || document.hidden) return;
      if (now - lastFrame < frameInterval) {
        rafId = requestAnimationFrame(render);
        return;
      }
      lastFrame = now;
      const time = (now - t0) / 1000;
      state.p += (state.target - state.p) * (lowPower ? 0.32 : 0.22);
      if (Math.abs(state.target - state.p) < 0.0004) state.p = state.target;

      const p = state.p;

      // Motion trails: fade the previous frame instead of clearing it.
      const morphSpeed = Math.abs(state.target - state.p);
      let fade = 1;
      if (prefersReducedMotion) {
        ctx.clearRect(0, 0, W, H);
      } else {
        fade = 0.5 - Math.min(0.28, morphSpeed * 34);
        ctx.globalCompositeOperation = "destination-out";
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(0,0,0," + fade.toFixed(3) + ")";
        ctx.fillRect(0, 0, W, H);
      }

      // Accent takeover: nebula wash strengthens as the shape forms.
      const formW = p * p * (3 - 2 * p);
      if (formW > 0.02) {
        const washAlpha = 0.12 * formW * (prefersReducedMotion ? 1 : fade);
        const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, Math.max(W, H) * 0.62);
        g.addColorStop(0, "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + washAlpha.toFixed(3) + ")");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.globalCompositeOperation = "lighter";

      const ry = p * 1.8 + time * 0.08;
      const rx = -0.15 + p * 0.3;
      const cy_ = Math.cos(ry), sy_ = Math.sin(ry);
      const cx_ = Math.cos(rx), sx_ = Math.sin(rx);

      let bufN = 0;
      const linesOn = formW > 0.55 && !prefersReducedMotion;

      parts.forEach((pt, pi) => {
        // Line formation
        const lx = (pt.t - 0.5) * 3.3;
        const ly = 0;
        const lz = 0;

        // Shape formation
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

        // Interpolate
        const mx = lx * (1 - p) + sx * p;
        const my = ly * (1 - p) + sy * p;
        const mz = lz * (1 - p) + sz * p;

        // 3D rotations
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

        // Depth bloom: near-camera particles get a soft halo.
        if (!lowPower && persp > 1.14) {
          const hd = d * 2.6;
          ctx.globalAlpha = 0.33 * Math.min(1, (persp - 1.14) * 4);
          ctx.drawImage(sprite, px - hd / 2, py - hd / 2, hd, hd);
        }

        if (linesOn && pi % LINE_STRIDE === 0) {
          lineBuf[bufN * 2] = px;
          lineBuf[bufN * 2 + 1] = py;
          bufN++;
        }
      });

      // Constellation lines once the shape has formed.
      if (linesOn && bufN > 1) {
        const maxD = Math.min(W, H) * 0.09;
        const maxD2 = maxD * maxD;
        ctx.strokeStyle = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
        ctx.lineWidth = 1;
        const lineW = (formW - 0.55) / 0.45;
        let drawn = 0;
        for (let a = 0; a < bufN && drawn < LINE_CAP; a++) {
          const ax = lineBuf[a * 2]!, ay = lineBuf[a * 2 + 1]!;
          for (let b = a + 1; b < bufN && drawn < LINE_CAP; b++) {
            const dx = lineBuf[b * 2]! - ax, dy = lineBuf[b * 2 + 1]! - ay;
            const d2 = dx * dx + dy * dy;
            if (d2 > maxD2) continue;
            ctx.globalAlpha = (1 - d2 / maxD2) * lineW * 0.3;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(lineBuf[b * 2]!, lineBuf[b * 2 + 1]!);
            ctx.stroke();
            drawn++;
          }
        }
      }

      if (Math.abs(state.target - state.p) > 0.0008) {
        idleFrames = 0;
        ensureRender();
      } else if (idleFrames < 1) {
        idleFrames += 1;
        ensureRender();
      }
    }

    const io = new IntersectionObserver(([e]) => {
      sectionVisible = e ? e.isIntersecting : false;
      if (sectionVisible) ensureRender();
      else if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    }, { threshold: 0 });
    io.observe(wrap);

    ensureRender();

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => { measure(); ensureRender(); }, 120);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(resizeTimer);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      if (st) st.kill();
    };
  }, [section.id]);

  const copy = section.hero[theme];

  return (
    <div ref={wrapRef} className="neo-hero-runway" style={{ height: '260vh' }}>
      <div className="neo-hero-stage">
        <canvas ref={canvasRef} className="neo-hero-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <div className="neo-hero-chapter" style={{ opacity: 1, pointerEvents: 'auto' }}>
          <p className="kicker">{section.id === "academy" ? "01" : section.id === "labs" ? "02" : "03"} / {section.name.toUpperCase()}</p>
          <h1 className="ch-name" style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 800, textTransform: section.id === "academy" ? 'none' : 'uppercase' }}>
            {section.id === "academy" ? (
              <>We don't hire engineers.<br />We <em style={{ fontStyle: 'normal', color: '#7c5cff' }}>compile</em> them.</>
            ) : (
              <>{copy.title}<br /><span className="serif" style={{ color: section.id === "labs" ? '#ff5c8a' : '#00e5a0' }}><CyclingWord words={(SECTION_HERO_WORDS as SectionHeroWordsMap).neo?.[section.id] || [copy.accent]} /></span></>
            )}
          </h1>
          <p className="lede" style={{ marginTop: '14px', maxWidth: '34em', color: 'var(--muted)' }}>{copy.body}</p>
          <div className="hero-actions" style={{ marginTop: '24px' }}>
            <button className="btn btn-solid" onClick={() => {
              const subnav = document.querySelector(".subnav");
              subnav?.scrollIntoView({ behavior: "smooth" });
            }}>{copy.primary}</button>
            <button className="btn" onClick={() => routeTo('neo', 'customers', section.id)}>{copy.secondary}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SectionPageProps {
  theme: Theme;
  section: SectionData;
  detail?: string | null;
}

function SectionPage({ theme, section, detail }: SectionPageProps) {
  const active = useMemo(() => section.subpages.find((p) => p.slug === detail), [section, detail]);
  if (detail && !active) return <NotFound theme={theme} page={`${section.id}/${detail}`} />;
  const isNeo = theme === "neo";
  return (
    <main>
      {isNeo ? (
        <NeoSectionHeroUnravel theme={theme} section={section} />
      ) : section.id === "academy" ? (
        <AcademyHero theme={theme} section={section} />
      ) : section.id === "marketing" ? (
        <MarketingHero theme={theme} section={section} />
      ) : section.id === "labs" ? (
        <LabsHero theme={theme} section={section} />
      ) : (
        <HeroBanner compact theme={theme} section={section} eyebrow={section.hero[theme].eyebrow} title={section.hero[theme].title} accent={section.hero[theme].accent} body={section.hero[theme].body} />
      )}
      {section.id === 'academy' && !active && (
        <>
          <AcademyTerminalSection />
          <AcademyBootSequence />
        </>
      )}
      {section.id === 'labs' && !active && <LabsBlueprintSection />}
      {section.id === 'marketing' && !active && (
        <>
          <MarketingSignalSection />
          <MarketingFunnelSection />
        </>
      )}
      <SubNav theme={theme} section={section} active={active} />
      <div key={active?.slug || "overview"} className="section-content-enter">
        {active ? <SubpageDetail theme={theme} section={section} page={active} /> : <SectionOverview theme={theme} section={section} />}
      </div>
    </main>
  );
}

interface MarketContextProps {
  theme: Theme;
  compact?: boolean;
}

function MarketContext({ theme, compact = false }: MarketContextProps) {
  const market = DATA.market;
  return (
    <section className={"market-context" + (compact ? " compact" : "")}>
      <div>
        <p className="eyebrow">Operating context</p>
        <h2>{voice(theme, market.title)}</h2>
        <p>{voice(theme, market.body)}</p>
      </div>
      <div className="market-cities">
        {market.cities.map((city) => <span key={city}>{city}</span>)}
      </div>
      {!compact && (
        <div className="market-assumptions">
          {market.assumptions.map((item) => <p key={item}>{item}</p>)}
        </div>
      )}
    </section>
  );
}

interface SectionOverviewProps {
  theme: Theme;
  section: SectionData;
}

function SectionOverview({ theme, section }: SectionOverviewProps) {
  const isMarketing = section.id === "marketing";
  const [activeModule, setActiveModule] = useState<ModuleItem | null>(null);

  return (
    <>
      {/* 1 — What it does: the offer, framed */}
      <section className="modules-band">
        <div className="section-head">
          <div>
            <p className="eyebrow">{theme === "neo" ? "What we run" : "Capabilities"}</p>
            <h2>{theme === "neo" ? `Inside ${section.name}.` : `What ${section.name} delivers.`}</h2>
          </div>
          <p>{theme === "neo" ? "Four engines doing the actual work. Tap any one for the full breakdown." : "Core capability modules that make up this solution line."}</p>
        </div>
        <div className="module-grid">
          {section.modules.map((module, i) => (
            <ModuleCard
              key={module.title}
              theme={theme}
              eyebrow={theme === "neo" ? `Module 0${i + 1}` : section.name}
              title={module.title}
              visualTitle={module.title}
              onClick={() => setActiveModule(module)}
            >
              {voice(theme, module)}
            </ModuleCard>
          ))}
        </div>
      </section>

      {activeModule && (
        <ModuleModal
          theme={theme}
          module={activeModule}
          eyebrow={section.name}
          onClose={() => setActiveModule(null)}
        />
      )}

      {/* 2 — Who it's for */}
      <AudienceFit theme={theme} section={section} />

      {/* 3 — How it works */}
      <InteractiveTimeline theme={theme} section={section} />

      {/* 4 — What you get */}
      <StackDetails theme={theme} section={section} />

      {/* 5 — Quality proof (marketing-specific signature moments) */}
      {isMarketing && <BeforeAfterSlider theme={theme} />}
      {isMarketing && <RoiEstimator theme={theme} />}

      {/* 6-8 — Receipts, FAQ, CTA */}
      <TerminalZone theme={theme} section={section} />
    </>
  );
}

interface TerminalZoneProps {
  theme: Theme;
  section: SectionData;
}

function TerminalZone({ theme, section }: TerminalZoneProps) {
  return (
    <div className="terminal-zone">
      <ProofCards theme={theme} section={section} />
      <FAQ section={section} />
      <IntakeCTA theme={theme} section={section} />
    </div>
  );
}

interface SubpageDetailProps {
  theme: Theme;
  section: SectionData;
  page: SubpageEntry;
}

function SubpageDetail({ theme, section, page }: SubpageDetailProps) {
  return (
    <>
      <section className="detail-hero">
        <p className="eyebrow">{section.name} / {page.title}</p>
        <h2>{voice(theme, page.callout)}</h2>
      </section>
      <section className="module-grid compact">
        {page.cards.map((card) => (
          <ModuleCard key={card.title} theme={theme} eyebrow={page.title} title={card.title} visualTitle={card.title}>
            {voice(theme, card)}
          </ModuleCard>
        ))}
      </section>
      <StackDetails theme={theme} section={section} />
      <ProofCards theme={theme} section={section} />
      <FAQ section={section} />
      <IntakeCTA theme={theme} section={section} />
    </>
  );
}

interface AudienceFitProps {
  theme: Theme;
  section: SectionData;
}

function AudienceFit({ theme, section }: AudienceFitProps) {
  return (
    <section className="content-band">
      <div className="section-head">
        <div>
          <p className="eyebrow">{theme === "neo" ? "Who's this for" : "Audience fit"}</p>
          <h2>{theme === "neo" ? `${section.name} for the learner, the founder, and the team hiring both.` : `Who ${section.name} is designed to support.`}</h2>
        </div>
      </div>
      <div className="module-grid compact">
        {section.audiences.map((item) => (
          <ModuleCard key={item.title} theme={theme} eyebrow={section.name} title={item.title}>
            {voice(theme, item)}
          </ModuleCard>
        ))}
      </div>
    </section>
  );
}

interface StackDetailsProps {
  theme: Theme;
  section: SectionData;
}

function StackDetails({ theme, section }: StackDetailsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="content-band stack-detail">
      <div className="section-head">
        <div>
          <p className="eyebrow">{theme === "neo" ? "Stack receipts" : "Delivery stack"}</p>
          <h2>{theme === "neo" ? `${section.name} stack with the details turned on.` : `${section.name} capabilities, outcomes and deliverables.`}</h2>
        </div>
      </div>
      <div className="stack-detail-grid">
        {section.stackDetails.map((item, i) => (
          <motion.article
            className="stack-detail-card"
            key={item.title}
            variants={CARD_MOTION}
            initial={reduceMotion ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.28 }}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
          >
            <div className="stack-card-head">
              <span className="stack-outcome">{item.outcome}</span>
              <span className="stack-index">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3>{item.title}</h3>
            <ul>{item.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

interface FAQProps {
  section: SectionData;
}

function FAQ({ section }: FAQProps) {
  return (
    <section className="faq-band">
      <p className="eyebrow">FAQ</p>
      {section.faqs.map(([q, a]) => (
        <details key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </section>
  );
}

interface IntakeCTAProps {
  theme: Theme;
  section: SectionData;
}

function IntakeCTA({ theme, section }: IntakeCTAProps) {
  return (
    <section className="intake-cta">
      <div>
        <p className="eyebrow">{theme === "neo" ? "Next move" : "Recommended next step"}</p>
        <h2>{section.intake.primary}</h2>
        <p>{section.intake.secondary}</p>
      </div>
      <button onClick={() => routeTo(theme, "contact", section.id)}>{theme === "neo" ? "Let's build" : "Request a consultation"}</button>
    </section>
  );
}

interface ProofCardsProps {
  theme: Theme;
  section: SectionData;
}

function ProofCards({ theme, section }: ProofCardsProps) {
  return (
    <section className="proof-cards">
      {section.proof.map((item) => (
        <ModuleCard
          key={item.name}
          theme={theme}
          eyebrow={item.org}
          title={item.name}
          className="proof-card"
        >
          {voice(theme, item.result)}
        </ModuleCard>
      ))}
    </section>
  );
}

export {
  HeroBanner,
  NeoSectionHero,
  SectionPage,
  MarketContext,
  NeoSectionHeroUnravel,
  SectionOverview,
  TerminalZone,
  AudienceFit,
  StackDetails,
  SubpageDetail,
  FAQ,
  IntakeCTA,
  ProofCards,
};
