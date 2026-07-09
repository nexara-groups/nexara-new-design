'use client';
import React from 'react';
import ReactDOM from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { DATA } from '@/lib/data';
import { HAS_SCROLL_ANIMATION, voice } from '@/lib/shared';
import { routeTo } from '@/lib/neo-router';

const { useState, useRef } = React;

type Theme = 'neo' | 'trust';
type VoiceValue = string | Partial<Record<Theme, string>>;
type CssVars = React.CSSProperties & Record<`--${string}`, string>;

type ModuleItem = {
  title: string;
  neo?: string;
  trust?: string;
};

type ProcessStep = {
  step: string;
  title: string;
  body: string;
};

type PackageItem = {
  name: string;
  fit: string;
  price: string;
  duration: string;
  includes: string[];
};

type Section = {
  id: 'academy' | 'marketing' | 'labs' | string;
  index: string;
  name: string;
  short: VoiceValue;
  stack: string[];
  process: ProcessStep[];
  packages: PackageItem[];
};

type ModuleDetail = Record<Theme, { offer: string; better: string }>;

interface ThemeProps {
  theme: Theme;
}

interface CardVisualProps extends ThemeProps {
  title: string;
}

interface ModuleCardProps extends ThemeProps {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  visualTitle?: string | null;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement> | null;
}

interface ModuleModalProps extends ThemeProps {
  module: ModuleItem;
  eyebrow: string;
  onClose: () => void;
}

interface SectionCardsProps extends ThemeProps {
  sections: Section[];
}

interface InteractiveTimelineProps extends ThemeProps {
  section: Section;
}

export const CARD_MOTION = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
  }
};

const FACE_BASE_TRANSFORMS = [
  "translateZ(150px)", "rotateY(90deg) translateZ(150px)",
  "rotateY(180deg) translateZ(150px)", "rotateY(-90deg) translateZ(150px)",
  "rotateX(90deg) translateZ(150px)", "rotateX(-90deg) translateZ(150px)",
];
const FACE_MOTIONS = [
  { x: 0, y: 0, z: 1 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: -1 },
  { x: -1, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }, { x: 0, y: 1, z: 0 },
];

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function InfiniteMarquee() {
  return (
    <div className="marquee-ribbon" aria-hidden="true">
      <div className="marquee-content">
        {Array(3).fill(0).map((_, idx) => (
          <React.Fragment key={idx}>
            <span>✦ ai labs</span>
            <span className="accent-color">✦ academic</span>
            <span>✦ software</span>
            <span className="cyan-color">✦ marketing</span>
            <span>✦ proof live</span>
            <span className="accent-color">✦ shipping daily</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function NexaraUnbox({ theme }: ThemeProps) {
  const wrapRef      = React.useRef<HTMLElement | null>(null);
  const pinRef       = React.useRef<HTMLDivElement | null>(null);
  const cubeRef      = React.useRef<HTMLDivElement | null>(null);
  const faceRefs     = React.useRef<(HTMLDivElement | null)[]>([]);
  const coreRef      = React.useRef<HTMLDivElement | null>(null);
  const signalRingRef = React.useRef<HTMLDivElement | null>(null);
  const signalCardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs     = React.useRef<(HTMLSpanElement | null)[]>([]);
  const wordPlayRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const routeCardRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const routeCardSmallRefs = React.useRef<(HTMLElement | null)[]>([]);
  const stageLabelRef = React.useRef<HTMLSpanElement | null>(null);
  const activeLabelRef = React.useRef<HTMLElement | null>(null);
  const progressBarRef = React.useRef<HTMLElement | null>(null);
  const progressPctRef = React.useRef<HTMLSpanElement | null>(null);

  const reducedMotion = React.useMemo(() =>
    typeof window !== "undefined" && window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const copy  = DATA.unbox[theme];
  const faces = DATA.unbox.faces;
  const stageLabels = theme === "neo"
    ? ["Prime", "Spin", "Split", "Wire", "Stack", "Ship"]
    : ["Frame", "Map", "Open", "Connect", "Govern", "Launch"];

  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Cache layout dimensions to avoid getBoundingClientRect layout thrashing during scroll ticks
    const layout = {
      top: 0,
      height: 0,
      innerHeight: 0
    };

    const measureLayout = () => {
      const rect = wrap.getBoundingClientRect();
      layout.top = rect.top + window.scrollY;
      layout.height = rect.height;
      layout.innerHeight = window.innerHeight;
    };

    measureLayout();
    
    // Fallback measurement in case resources/content shift layout size on load
    const initialMeasureTimeout = setTimeout(measureLayout, 150);

    const applyFrame = (p: number) => {
      const explode      = clamp01((p - 0.42) / 0.42);
      const coreOpacity  = clamp01((p - 0.56) / 0.22);
      const signalOpacity= clamp01((p - 0.68) / 0.22);
      const activeIndex  = Math.min(faces.length - 1, Math.floor(clamp01(p) * faces.length));

      if (cubeRef.current)
        cubeRef.current.style.transform = `translateY(${110 - p * 175}px) rotateX(${58 - p * 92}deg) rotateY(${-170 + p * 520}deg) scale(${0.55 + p * 0.42})`;

      faceRefs.current.forEach((el, i) => {
        if (!el) return;
        const m = FACE_MOTIONS[i] ?? FACE_MOTIONS[0]!;
        const drift = explode * 230;
        const lift  = i === 5 ? clamp01((p - 0.36) / 0.24) * 72 : 0;
        el.style.transform = `translate3d(${m.x * drift}px,${m.y * drift - lift}px,${m.z * drift}px)`;
        el.style.opacity   = String(1 - explode * 0.32);
      });

      if (coreRef.current) {
        coreRef.current.style.opacity   = String(coreOpacity);
        coreRef.current.style.transform = `translate(-50%,-50%) scale(${0.5 + coreOpacity * 0.58}) rotateY(${p * 360}deg)`;
      }

      if (signalRingRef.current) signalRingRef.current.style.opacity = String(signalOpacity);
      signalCardRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `rotateY(${i * 90}deg) translateZ(${280 + signalOpacity * 80}px)`;
      });

      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const wp = clamp01((p * 1.9) - i * 0.12);
        el.style.opacity   = String(0.42 + wp * 0.58);
        el.style.transform = `translateY(${(1 - wp) * 26}px)`;
      });

      wordPlayRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.setProperty("--word-fill", `${clamp01((p * faces.length) - i) * 100}%`);
        el.classList.toggle("is-active", i === activeIndex);
      });

      routeCardRefs.current.forEach((el, i) => {
        if (!el) return;
        const cp = clamp01((p * faces.length) - i);
        el.style.setProperty("--card-fill", `${cp * 100}%`);
        el.style.transform = `translateX(${(1 - Math.min(cp + 0.1, 1)) * 22}px)`;
        el.classList.toggle("is-active", i === activeIndex);
        el.classList.toggle("is-complete", i < activeIndex);
        
        const sm = routeCardSmallRefs.current[i];
        if (sm) sm.textContent = i < activeIndex ? "connected" : i === activeIndex ? "active now" : "queued";
      });

      if (stageLabelRef.current)  stageLabelRef.current.textContent  = `${stageLabels[activeIndex] || stageLabels[0]} stage`;
      if (activeLabelRef.current) activeLabelRef.current.textContent = faces[activeIndex]?.label || faces[0]?.label || "";
      if (progressPctRef.current) progressPctRef.current.textContent = `${Math.round(p * 100).toString().padStart(3, "0")}%`;
      if (progressBarRef.current) progressBarRef.current.style.width = `${p * 100}%`;
    };

    if (reducedMotion) { applyFrame(0.62); return; }

    const shouldPin = HAS_SCROLL_ANIMATION && window.ScrollTrigger && window.innerWidth > 760;
    if (shouldPin) {
      const runway = Math.round(Math.min(1120, Math.max(680, window.innerHeight * 0.95)));
      applyFrame(0);
      const st = (window.ScrollTrigger as { create: (options: Record<string, unknown>) => { kill: () => void } }).create({
        trigger: pinRef.current || wrap,
        start: "top top",
        end: `+=${runway}`,
        scrub: 0.45,
        pin: pinRef.current || true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self: { progress: number }) => applyFrame(self.progress)
      });
      return () => {
        clearTimeout(initialMeasureTimeout);
        st.kill();
      };
    }

    let lastP = -1;
    let scrollY = window.scrollY;
    let ticked = false;

    const update = () => {
      ticked = false;
      const total = Math.max(1, layout.height - layout.innerHeight);
      const p = clamp01((scrollY - layout.top) / total);
      if (Math.abs(p - lastP) > 0.0003) {
        lastP = p;
        applyFrame(p);
      }
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
      if (!ticked) {
        requestAnimationFrame(update);
        ticked = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", measureLayout, { passive: true });

    // Initial positioning
    handleScroll();

    return () => {
      clearTimeout(initialMeasureTimeout);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", measureLayout);
    };
  }, [theme, reducedMotion, faces, stageLabels]);

  return (
    <section ref={wrapRef} className="unbox-wrap" aria-label="Nexara operating model unboxing">
      <div ref={pinRef} className="unbox-sticky">
        <div className="unbox-bg" aria-hidden="true" />
        <div className="unbox-copy">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="unbox-title" aria-label={copy.title}>
            {copy.title.split(" ").map((word, i) => (
              <span key={`${word}-${i}`} ref={el => { wordRefs.current[i] = el; }}
                style={{ opacity: 0.42, transform: "translateY(26px)" }}>{word}</span>
            ))}
          </h2>
          <div className="unbox-word-play" aria-label="Current unboxing stage">
            {faces.map((face, i) => (
              <button key={face.label} ref={el => { wordPlayRefs.current[i] = el; }}
                style={{ "--face-color": face.color, "--word-fill": "0%" } as CssVars}
                onClick={() => routeTo(theme, face.section)}>
                <span>{face.label}</span>
              </button>
            ))}
          </div>
          <p>{copy.body}</p>
          <div className="unbox-quick-actions">
            <button onClick={() => routeTo(theme, "academy")}>{theme === "neo" ? "Open academy" : "View Academy"}</button>
            <button onClick={() => routeTo(theme, "contact")}>{theme === "neo" ? "Build a play" : "Scope a play"}</button>
          </div>
        </div>
        <div className="unbox-stage" aria-hidden="true">
          <div className="unbox-axis" />
          <div className="unbox-cube" ref={cubeRef}
            style={{ transform: "translateY(110px) rotateX(58deg) rotateY(-170deg) scale(0.55)" }}>
            {faces.map((face, i) => (
              <div className="unbox-face-shell" key={face.label} style={{ transform: FACE_BASE_TRANSFORMS[i] }}>
                <div className="unbox-face" ref={el => { faceRefs.current[i] = el; }}
                  style={{ "--face-color": face.color } as CssVars}>
                  <span>{face.sub}</span>
                  <strong>{face.label}</strong>
                </div>
              </div>
            ))}
            <div className="unbox-core" ref={coreRef}
              style={{ opacity: 0, transform: "translate(-50%,-50%) scale(0.5) rotateY(0deg)" }}>
              <span>{copy.sequence}</span>
            </div>
            <div className="unbox-signal-ring" ref={signalRingRef} style={{ opacity: 0 }}>
              {DATA.unbox.signals.map(([label, value], i) => (
                <div key={label} ref={el => { signalCardRefs.current[i] = el; }}
                  className="unbox-signal-card"
                  style={{ transform: `rotateY(${i * 90}deg) translateZ(280px)` }}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="unbox-system-panel" aria-label="Unboxed Nexara system routes">
          <div className="unbox-panel-head">
            <span ref={stageLabelRef}>{stageLabels[0]} stage</span>
            <strong ref={activeLabelRef}>{faces[0]?.label}</strong>
          </div>
          <div className="unbox-card-rail">
            {faces.map((face, i) => (
              <button key={face.label} ref={el => { 
                routeCardRefs.current[i] = el;
                if (el) {
                  routeCardSmallRefs.current[i] = el.querySelector<HTMLElement>("small");
                }
              }}
                className="unbox-route-card"
                style={{ "--face-color": face.color, "--card-fill": "0%", transform: "translateX(22px)" } as CssVars}
                onClick={() => routeTo(theme, face.section)}>
                <span>{face.sub}</span>
                <strong>{face.label}</strong>
                <small>queued</small>
              </button>
            ))}
          </div>
        </aside>
        <div className="unbox-progress" aria-hidden="true">
          <span ref={progressPctRef}>000%</span>
          <div><i ref={progressBarRef} style={{ width: "0%" }} /></div>
        </div>
      </div>
    </section>
  );
}

export function SuperSkills({ theme }: ThemeProps) {
  const calloutBody = DATA.home[theme].calloutBody;
  const featured = DATA.superSkills[0];
  const supporting = DATA.superSkills.slice(1);
  const reduceMotion = useReducedMotion();

  if (!featured) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section className="super-skills">
      <div className="super-skills-shell">
        <div className="super-skills-intro">
          <div>
            <p className="eyebrow">{theme === "neo" ? "Super skills" : "Integrated capability plays"}</p>
            <h2>{theme === "neo" ? "Stack the engines into plays that ship." : "Integrated growth plays across talent, digital and AI."}</h2>
          </div>
          <p>{calloutBody}</p>
        </div>

        <div className="super-playbook">
          <motion.article 
            className="super-play-feature spotlight-card" 
            onMouseMove={handleMouseMove}
            variants={CARD_MOTION}
            initial={reduceMotion ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.28 }}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
          >
            <div className="spotlight-glow" />
            <div className="card-content-wrapper">
              <div className="super-skill-topline">
                {featured.sections.map((section) => <span key={section}>{section}</span>)}
              </div>
              <span className="play-label">{theme === "neo" ? "Lead combo" : "Primary integrated play"}</span>
              <h3>{featured.title}</h3>
              <p>{voice(theme, featured)}</p>
              <div className="play-stack">
                {featured.stack.map((chip, index) => (
                  <div key={chip} className="play-stack-item">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{chip}</strong>
                  </div>
                ))}
              </div>
              <button onClick={() => routeTo(theme, "contact")}>
                <span>{theme === "neo" ? "Build this play" : "Scope this play"}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </motion.article>

          <aside className="play-sequence" aria-label="How Nexara combines sections">
            <span>{theme === "neo" ? "Combo logic" : "Delivery sequence"}</span>
            <div className="timeline-flow">
              <div className="timeline-line"></div>
              <div className="timeline-step">
                <div className="timeline-dot">1</div>
                <div className="timeline-text">
                  <strong>Academy</strong>
                  <small>{theme === "neo" ? "creates the crew" : "builds capability"}</small>
                </div>
              </div>
              <div className="timeline-step">
                <div className="timeline-dot">2</div>
                <div className="timeline-text">
                  <strong>Marketing</strong>
                  <small>{theme === "neo" ? "launches the signal" : "creates market presence"}</small>
                </div>
              </div>
              <div className="timeline-step">
                <div className="timeline-dot">3</div>
                <div className="timeline-text">
                  <strong>Labs</strong>
                  <small>{theme === "neo" ? "wires the system" : "adds automation readiness"}</small>
                </div>
              </div>
            </div>
          </aside>

          <div className="super-play-list">
            {supporting.map((item) => (
              <motion.article 
                className="super-skill-card spotlight-card" 
                key={item.title}
                onMouseMove={handleMouseMove}
                variants={CARD_MOTION}
                initial={reduceMotion ? false : "hidden"}
                whileInView="show"
                viewport={{ once: true, amount: 0.32 }}
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              >
                <div className="spotlight-glow" />
                <div className="card-content-wrapper">
                  <div className="super-skill-topline">
                    {item.sections.map((section) => <span key={section}>{section}</span>)}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{voice(theme, item)}</p>
                  <div className="chip-stack">
                    {item.stack.map((chip) => <span key={chip}>{chip}</span>)}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CardVisual({ title, theme }: CardVisualProps) {
  const normTitle = title.toLowerCase();

  if (normTitle.includes("brand") || normTitle.includes("visual identity") || normTitle.includes("positioning") || normTitle.includes("branding")) {
    return (
      <div className="card-visual visual-brand">
        <div className="brand-specimen">Aa</div>
        <div className="brand-circle-grid">
          <div className="brand-circle circle-1"></div>
          <div className="brand-circle circle-2"></div>
        </div>
        <div className="brand-swatches">
          <div className="swatch swatch-1"></div>
          <div className="swatch swatch-2"></div>
          <div className="swatch swatch-3"></div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("web") || normTitle.includes("landing") || normTitle.includes("corporate") || normTitle.includes("product page")) {
    return (
      <div className="card-visual visual-web">
        <div className="browser-header">
          <div className="browser-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="browser-address"></div>
        </div>
        <div className="browser-content">
          <div className="browser-hero"></div>
          <div className="browser-cols">
            <div className="browser-col"></div>
            <div className="browser-col"></div>
            <div className="browser-col"></div>
          </div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("social") || normTitle.includes("content studio")) {
    return (
      <div className="card-visual visual-social">
        <div className="social-header">
          <div className="social-avatar"></div>
          <div className="social-meta">
            <div className="social-line short"></div>
            <div className="social-line tiny"></div>
          </div>
        </div>
        <div className="social-body">
          <div className="social-line"></div>
          <div className="social-line"></div>
          <div className="social-image-mock"></div>
        </div>
        <div className="social-footer">
          <div className="social-icon"></div>
          <div className="social-icon"></div>
          <div className="social-icon"></div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("performance") || normTitle.includes("growth") || normTitle.includes("ads") || normTitle.includes("paid acquisition") || normTitle.includes("reporting")) {
    return (
      <div className="card-visual visual-performance">
        <div className="chart-grid">
          <div className="chart-grid-line"></div>
          <div className="chart-grid-line"></div>
          <div className="chart-grid-line"></div>
        </div>
        <svg className="chart-svg" viewBox="0 0 100 40">
          <path className="chart-path" d="M0,35 C20,32 40,25 60,18 C70,14 85,5 95,2" fill="none" strokeWidth="2.5" />
          <circle className="chart-node" cx="95" cy="2" r="3" />
        </svg>
        <div className="chart-label">+240%</div>
      </div>
    );
  }

  if (normTitle.includes("tracks") || normTitle.includes("full-stack") || normTitle.includes("ai/data") || normTitle.includes("cloud") || normTitle.includes("design studio")) {
    return (
      <div className="card-visual visual-code">
        <div className="code-header">
          <div className="code-dots">
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="code-title">index.js</div>
        </div>
        <div className="code-body">
          <div className="code-line"><span className="code-keyword">const</span> nexara = <span className="code-string">"growth"</span>;</div>
          <div className="code-line indent"><span className="code-keyword">function</span> ship() {"{"}</div>
          <div className="code-line indent-2">runSystem(); <span className="cursor-blink">|</span></div>
          <div className="code-line indent">{"}"}</div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("internship") || normTitle.includes("mentor") || normTitle.includes("review") || normTitle.includes("kanban") || normTitle.includes("briefs") || normTitle.includes("projects")) {
    return (
      <div className="card-visual visual-kanban">
        <div className="kanban-col">
          <div className="kanban-header">TODO</div>
          <div className="kanban-card"></div>
          <div className="kanban-card"></div>
        </div>
        <div className="kanban-col">
          <div className="kanban-header">DOING</div>
          <div className="kanban-card active"></div>
        </div>
        <div className="kanban-col">
          <div className="kanban-header">DONE</div>
          <div className="kanban-card done"></div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("placement") || normTitle.includes("matching") || normTitle.includes("partner") || normTitle.includes("nodes") || normTitle.includes("alumni")) {
    return (
      <div className="card-visual visual-nodes">
        <div className="node-center"></div>
        <div className="node-satellite sat-1"></div>
        <div className="node-satellite sat-2"></div>
        <div className="node-satellite sat-3"></div>
        <div className="node-satellite sat-4"></div>
        <svg className="node-lines" viewBox="0 0 100 60">
          <line x1="50" y1="30" x2="20" y2="15" stroke="var(--line)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="50" y1="30" x2="80" y2="15" stroke="var(--line)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="50" y1="30" x2="30" y2="45" stroke="var(--line)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="50" y1="30" x2="70" y2="45" stroke="var(--line)" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
      </div>
    );
  }

  if (normTitle.includes("atlas") || normTitle.includes("search") || normTitle.includes("knowledge")) {
    return (
      <div className="card-visual visual-search">
        <div className="search-bar">
          <div className="search-icon"></div>
          <div className="search-text">Query knowledgeBase...</div>
        </div>
        <div className="search-results">
          <div className="search-result-row">
            <span className="search-result-bullet"></span>
            <div className="search-result-line"></div>
          </div>
          <div className="search-result-row">
            <span className="search-result-bullet"></span>
            <div className="search-result-line short"></div>
          </div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("pulse") || normTitle.includes("analytics") || normTitle.includes("metrics")) {
    return (
      <div className="card-visual visual-pulse">
        <div className="pulse-gauge">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="circle" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <text x="18" y="20.35" className="percentage">85%</text>
          </svg>
        </div>
        <div className="pulse-bars">
          <div className="pulse-bar-row"><div className="pulse-bar-fill" style={{ width: "70%" }}></div></div>
          <div className="pulse-bar-row"><div className="pulse-bar-fill" style={{ width: "90%" }}></div></div>
          <div className="pulse-bar-row"><div className="pulse-bar-fill" style={{ width: "40%" }}></div></div>
        </div>
      </div>
    );
  }

  if (normTitle.includes("forge") || normTitle.includes("agent") || normTitle.includes("pipeline")) {
    return (
      <div className="card-visual visual-forge">
        <div className="forge-step step-in">IN</div>
        <div className="forge-arrow arrow-1">&rarr;</div>
        <div className="forge-step step-proc">MODEL</div>
        <div className="forge-arrow arrow-2">&rarr;</div>
        <div className="forge-step step-out">OUT</div>
        <div className="forge-pulse-dot"></div>
      </div>
    );
  }

  if (normTitle.includes("vault") || normTitle.includes("extraction") || normTitle.includes("document") || normTitle.includes("ocr")) {
    return (
      <div className="card-visual visual-vault">
        <div className="vault-page">
          <div className="vault-scan-bar"></div>
          <div className="vault-text-block block-1"></div>
          <div className="vault-text-block block-2"></div>
          <div className="vault-text-block block-3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-visual visual-fallback">
      <div className="fallback-grid">
        <span></span><span></span><span></span>
        <span></span><span></span><span></span>
      </div>
    </div>
  );
}

export function ModuleCard({ theme, eyebrow, title, children, visualTitle = null, className = "module-card", onClick = null }: ModuleCardProps) {
  const reduceMotion = useReducedMotion();
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const isClickable = onClick !== null;

  return (
    <motion.article 
      className={`${className} spotlight-card ${isClickable ? 'clickable-card' : ''}`} 
      onMouseMove={handleMouseMove}
      onClick={onClick || undefined}
      style={isClickable ? { cursor: "pointer" } : undefined}
      variants={CARD_MOTION}
      initial={reduceMotion ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.24 }}
      whileTap={reduceMotion || !isClickable ? undefined : { scale: 0.985 }}
    >
      <div className="spotlight-glow" />
      <div className="card-content-wrapper">
        <span>{eyebrow}</span>
        {visualTitle && <CardVisual title={visualTitle} theme={theme} />}
        <h3>{title}</h3>
        <p>{children}</p>
        {isClickable && (
          <div className="card-click-prompt" style={{ marginTop: "16px", fontSize: "0.75rem", fontFamily: "var(--font-mono)", opacity: 0.7, textTransform: "uppercase" }}>
            {theme === "neo" ? "full drop →" : "View specifications →"}
          </div>
        )}
      </div>
    </motion.article>
  );
}

const MODULE_DETAILS: Record<string, ModuleDetail> = {
  "Brand Identity": {
    neo: {
      offer: "Dynamic visual assets, custom typography systems, naming campaigns, and visual guidelines built for code and screen.",
      better: "We do not use Canva templates or pre-made layouts. Every asset is built from scratch with custom styling to give your brand a unique attitude."
    },
    trust: {
      offer: "Naming systems, corporate design manuals, vector branding kits, messaging frameworks, launch kits, and brand governance.",
      better: "We provide tokenized style guidelines that support consistent implementation across divisions and frontend codebases."
    }
  },
  "Web Experience": {
    neo: {
      offer: "WebGL layouts, interactive scroll animations, cursor spotlights, reactive grid containers, and custom typography.",
      better: "Our sites are built to explain the offer quickly and keep users oriented with responsive micro-actions."
    },
    trust: {
      offer: "Enterprise websites, landing page systems, product sheets, SEO-friendly markup, and responsive structural layouts.",
      better: "We deliver frontend components with performance, accessibility and responsive behavior reviewed as part of the build scope."
    }
  },
  "Social Studio": {
    neo: {
      offer: "Viral shorts production, custom graphics, punchy writing, and automated scheduling systems to keep up with daily feed speed.",
      better: "No generic AI spam or standard agency templates. We maintain high aesthetic quality and publishing rhythm customized to your brand's voice."
    },
    trust: {
      offer: "Thought leadership programs, corporate LinkedIn setups, research paper summaries, and scheduling compliance pipelines.",
      better: "A disciplined, research-led publication schedule managed under strict brand guidelines to build executive credibility and protect reputation."
    }
  },
  "Performance Growth": {
    neo: {
      offer: "Programmatic ad campaigns, custom analytics setups, programmatic landing pages, and rapid creative testing loops.",
      better: "No vanity metrics. We focus on attribution, channel discipline and acquisition models that can be reviewed against the agreed business objective."
    },
    trust: {
      offer: "Audited paid media campaigns, SEO site hierarchy structures, live dashboards, and weekly performance reviews.",
      better: "An evidence-led growth funnel built around high-intent search query indexing, landing page audits, and transparent attribution reporting."
    }
  },

  // Academy
  "Career Tracks": {
    neo: {
      offer: "Intense, portfolio-driven tracks in Full-Stack development, Applied AI engineering, UX design, and Growth operations.",
      better: "No boring PDF slides or passive video tutorials. Students build deployable codebases and interactive portfolios that prove capability."
    },
    trust: {
      offer: "Role-aligned skilling tracks mapped directly to regional hiring criteria across software engineering, DevOps, design, and analytics.",
      better: "Role-aligned curricula and structured project reviews help document readiness signals for employer review."
    }
  },
  "Internship Engine": {
    neo: {
      offer: "Live development projects, mentor-driven code reviews, and fast-paced delivery schedules that simulate startup engineering.",
      better: "Real tickets and production codebases. Candidates learn how to ship features, read telemetry, and operate under pressure from week one."
    },
    trust: {
      offer: "Structured internship workflows featuring mentor reviews, progress checkpoints, and portfolio review documentation.",
      better: "An audited, compliance-friendly internship program providing clear metrics, candidate logs, and verified project outcomes."
    }
  },
  "Placement Desk": {
    neo: {
      offer: "Resume re-writes, Github portfolio polish, intensive technical mock interviews, and role-fit matching support for growing tech squads.",
      better: "We prepare candidate proof for technical review and align profiles with the hiring workflows included in scope."
    },
    trust: {
      offer: "Employer partnership requirements, pre-screened talent shortlists, interview readiness prep, and comprehensive hiring support.",
      better: "An evidence-based screening process that reduces candidate evaluation time by presenting audited project histories."
    }
  },
  "Campus Programmes": {
    neo: {
      offer: "Classroom-to-production frameworks, university-wide hackathons, and real-time student cohort progress trackers.",
      better: "Tools students actually enjoy using. We align university classrooms with current industry dev toolchains."
    },
    trust: {
      offer: "Institution-aligned skilling programs, administration dashboards, progress analytics, and curriculum alignment support.",
      better: "Governance-first academic integration providing robust telemetry, student performance tracking, and direct outcomes accountability."
    }
  },

  // Labs
  "Atlas": {
    neo: {
      offer: "Smart vector indexing, semantic search interfaces, and RAG systems with transparent citation trails.",
      better: "Answers are designed around source trails, review paths and citation visibility instead of unsupported model output."
    },
    trust: {
      offer: "Document intelligence retrieval patterns for policies, contracts, documentation, and internal wikis.",
      better: "Access control, data handling and retrieval validation are scoped against the documents and risk level in the engagement."
    }
  },
  "Pulse": {
    neo: {
      offer: "Natural language query interface for product events, SQL database connections, and reviewed chart outputs.",
      better: "Ask plain-language questions against approved data paths and review the generated chart or query before decisions move."
    },
    trust: {
      offer: "Structured analytics patterns translating business query intent to auditable data models.",
      better: "Auditable SQL translation queries with safety limits and compliance locks on customer data schemas."
    }
  },
  "Forge": {
    neo: {
      offer: "Multi-agent workflows, state-machine orchestrations, and visual step-by-step telemetry logs.",
      better: "Dynamic execution with safety bounds, traces and review points for multi-step workflows."
    },
    trust: {
      offer: "Agentic workflow patterns with governance frameworks, detailed traces, and performance evaluations.",
      better: "Isolated agent sandboxes with auditable trace logs and compliance boundaries for transactional tasks."
    }
  },
  "Vault": {
    neo: {
      offer: "Unstructured document parsers, layout-aware OCR engines, and automated validation rules.",
      better: "Convert dense PDFs, invoices and forms into structured outputs with validation rules and review checkpoints."
    },
    trust: {
      offer: "Document processing patterns for high-volume invoices, compliance forms, and operational files.",
      better: "Layout-aware parsers with human-in-the-loop audit paths, extraction review metrics and controlled exports."
    }
  }
};

export function ModuleModal({ theme, module, eyebrow, onClose }: ModuleModalProps) {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const detail = MODULE_DETAILS[module.title] || {
    neo: { offer: "Scope notes for this module get prepared per enquiry.", better: "Module detail is mapped during scoping, not guessed upfront." },
    trust: { offer: "Module details are documented during engagement scoping.", better: "Capability detail is confirmed against your workflow before delivery." }
  };

  const isNeo = theme === "neo";
  const content = isNeo ? detail.neo : detail.trust;

  return ReactDOM.createPortal(
    <div className={theme === "neo" ? "site neo" : "site trust"} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "transparent", minHeight: "0", width: "auto", pointerEvents: "none" }}>
      <div className="module-modal-backdrop" onClick={onClose} style={{ pointerEvents: "auto" }}>
        <div className="module-modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="module-modal-header">
            <div>
              <span className="module-modal-subtitle">{eyebrow}</span>
              <h3 className="module-modal-title">{module.title}</h3>
            </div>
            <button className="module-modal-close" onClick={onClose} aria-label="Close modal">&times;</button>
          </div>
          <div className="module-modal-body">
            <div className="module-modal-section">
              <h4>{isNeo ? "// what we offer" : "Services & Deliverables"}</h4>
              <p>{content.offer}</p>
            </div>
            <div className="module-modal-section">
              <h4>{isNeo ? "// how we do it better" : "Operational Advantage"}</h4>
              <p>{content.better}</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function SectionCards({ theme, sections }: SectionCardsProps) {
  const reduceMotion = useReducedMotion();

  if (theme === "trust") {
    return (
      <section className="section-grid-wrap">
        <div className="section-head">
          <p className="eyebrow">Core sections</p>
          <h2>Structured practices across three sections.</h2>
        </div>
        <div className="tabular-border-grid">
          {sections.map((section) => (
            <div
              className="tabular-border-cell"
              key={section.id}
              style={{ cursor: "pointer" }}
              onClick={() => routeTo(theme, section.id)}
            >
              <div className="card-header">
                <span className="card-description">{section.index} — Practice</span>
                <h3>{section.name}</h3>
              </div>
              <div className="card-content">
                <p>{voice(theme, section.short)}</p>
                <ul>
                  {section.stack.slice(0, 4).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="card-footer">
                <button
                  className="secondary"
                  onClick={(e) => { e.stopPropagation(); routeTo(theme, section.id); }}
                  style={{
                    background: "transparent",
                    color: "var(--accent)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "800",
                    fontFamily: "'JetBrains Mono', monospace",
                    textTransform: "uppercase",
                    padding: 0,
                    minHeight: "auto"
                  }}
                >
                  Explore {section.name} &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="section-grid-wrap">
      <div className="section-head">
        <p className="eyebrow">Core sections</p>
        <h2>Three engines. All loaded.</h2>
      </div>
      <div className="section-cards">
        {sections.map((section) => (
          <motion.article
            className="section-card"
            key={section.id}
            id={`neo-guide-${section.id}`}
            onClick={() => routeTo(theme, section.id)}
            variants={CARD_MOTION}
            initial={reduceMotion ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.28 }}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
          >
            <span>{section.index}</span>
            <h3>{section.name}</h3>
            <p>{voice(theme, section.short)}</p>
            <div>{section.stack.slice(0, 4).map((x) => <small key={x}>{x}</small>)}</div>
            <button onClick={() => routeTo(theme, section.id)}>Enter {section.name}</button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function BeforeAfterSlider({ theme }: ThemeProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Set CSS variables directly on the element to avoid React state re-renders (no flashing!)
      containerRef.current.style.setProperty('--mouse-x', `${x}px`);
      containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    }
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof Element && (e.target.classList.contains('slider-handle') || e.target.closest('.slider-handle'))) return;
    e.preventDefault(); // Prevents selection
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0]!.clientX);
    }
  };

  const isNeo = theme === "neo";

  const copy = {
    before: {
      title: isNeo ? "The Legacy Template." : "Conventional Web Presentation.",
      desc: isNeo 
        ? "Rigid grids, static blocks, and zero-retention layouts. Flat content sheets that fail to hook user interest."
        : "Manual asset guides and static layout grids. Core business value propositions get buried under heavy text formatting.",
      label1: isNeo ? "Visual Polish" : "Logo & Guidelines",
      val1: isNeo ? "Generic style assets, flat fonts, and standard layouts." : "Static branding documents and unlinked PDF style guidelines.",
      label2: isNeo ? "User Experience" : "Web Presence",
      val2: isNeo ? "Heavy scroll structures that get immediately ignored." : "Fixed responsive grid layouts with standard text flow constraints."
    },
    after: {
      title: isNeo ? "The Nexara Interface." : "Nexara Enterprise Standard.",
      desc: isNeo
        ? "High-octane viewports, dynamic spotlights, and live vectors. Visual systems built to engage before users scroll."
        : "Lightweight structured guidelines, tokenized parameters, and verified UX blueprints built for modular conversion.",
      label1: isNeo ? "Cyber Specimen" : "Corporate Specimen",
      val1: isNeo ? "Interactive blueprint guide with dynamic variables and token styling." : "Exportable layout parameters, verified CSS variables, and structured style tokens.",
      label2: isNeo ? "UX Interactive Blueprint" : "Performance Engine",
      val2: isNeo ? "Spotlight cards responding to cursor coordinates in real-time." : "Audited components optimized for sub-second load times and high lighthouse scores."
    }
  };

  return (
    <section className="before-after-band">
      <div className="section-head">
        <div>
          <p className="eyebrow">{isNeo ? "Design standard" : "Visual quality"}</p>
          <h2>{isNeo ? "Slide to reveal the Nexara standard." : "Interactive standard vs. generic layouts."}</h2>
        </div>
      </div>
      <div className="comparison-wrapper" style={{ position: "relative" }}>
        <div 
          className="comparison-container" 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onTouchMove={handleTouchMove}
        >
          <div 
            className="comp-panel comp-before"
          >
            {/* Generic baseline layer */}
            <div className="before-content-wrapper" style={{ minWidth: "320px" }}>
              <div className="before-headline">{copy.before.title}</div>
              <p style={{ marginBottom: "16px" }}>{copy.before.desc}</p>
              <div className="before-stack-box">
                <strong>{copy.before.label1}:</strong> {copy.before.val1}
              </div>
              <div className="before-stack-box">
                <strong>{copy.before.label2}:</strong> {copy.before.val2}
              </div>
            </div>
          </div>

          <div 
            className="comp-panel comp-after" 
            style={{ 
              clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
              WebkitClipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
            }}
          >
            {/* Our content (Nexara standard) - Swapped to the top layer so it is revealed on the left */}
            <div className="after-content-wrapper" style={{ minWidth: "320px" }}>
              <div className="before-headline">{copy.after.title}</div>
              <p style={{ marginBottom: "16px" }}>{copy.after.desc}</p>
              <div className="after-grid">
                <div className="after-glass-card">
                  <div className="glow-dot-mock"></div>
                  <h4>{copy.after.label1}</h4>
                  <p>{copy.after.val1}</p>
                </div>
                <div className="after-glass-card">
                  <div className="glow-dot-mock"></div>
                  <h4>{copy.after.label2}</h4>
                  <p>{copy.after.val2}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="slider-handle" 
          style={{ left: `${sliderPos}%` }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault(); // Prevents selection
            const onMouseMove = (moveEvent: MouseEvent) => {
              moveEvent.preventDefault(); // Prevents selection
              handleMove(moveEvent.clientX);
            };
            const onMouseUp = () => {
              window.removeEventListener("mousemove", onMouseMove);
              window.removeEventListener("mouseup", onMouseUp);
            };
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            const onTouchMove = (moveEvent: TouchEvent) => {
              if (moveEvent.touches.length > 0) {
                handleMove(moveEvent.touches[0]!.clientX);
              }
            };
            const onTouchEnd = () => {
              window.removeEventListener("touchmove", onTouchMove);
              window.removeEventListener("touchend", onTouchEnd);
            };
            window.addEventListener("touchmove", onTouchMove);
            window.addEventListener("touchend", onTouchEnd);
          }}
        />
      </div>
      <div className="slider-indicator-labels">
        <span>{isNeo ? "→ DRAG RIGHT FOR NEXARA STYLE" : "→ DRAG RIGHT FOR NEXARA FORMAT"}</span>
        <span>{isNeo ? "← DRAG LEFT FOR DEFAULT" : "← DRAG LEFT FOR GENERIC LAYOUT"}</span>
      </div>
    </section>
  );
}

export function InteractiveTimeline({ theme, section }: InteractiveTimelineProps) {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const steps = section.process;
  const isNeo = theme === "neo";

  // Scoped copy to match brand tone and auto populate based on section
  const timelineCopy = React.useMemo(() => {
    if (section.id === "marketing") {
      return isNeo ? [
        { title: "Position", tag: "STAGE 01 // AUDIENCE FIT", desc: "Nailing down who you are talking to, how you win, and making the offer make sense before touch-up begins." },
        { title: "Build Assets", tag: "STAGE 02 // CODE & DESIGN", desc: "Custom visual guidings, websites that act as closeers, and content formats that get shared." },
        { title: "Launch", tag: "STAGE 03 // DEPLOY SYSTEM", desc: "Flipping the switch, pushing clean code to production, and setting active campaign layers live." },
        { title: "Optimize", tag: "STAGE 04 // compounding WINNERS", desc: "Auditing data logs, testing ad variant creatives, and compounding what works." }
      ] : [
        { title: "Audience & Category", tag: "Phase 01: Positioning & Discovery", desc: "Establishing market category context, analysing audience constraints, and structuring primary brand pillars." },
        { title: "Brand & Asset Build", tag: "Phase 02: Creative & Web Build", desc: "Creating the visual system, high-conversion web presence and initial campaign assets." },
        { title: "Launch & Activate", tag: "Phase 03: Live Activation", desc: "Publishing the site, starting the content calendar and activating paid acquisition channels." },
        { title: "Measure & Optimise", tag: "Phase 04: Analytics & Optimisation", desc: "Conducting regular funnel reviews, testing ad variants and compounding what the data confirms." }
      ];
    } else if (section.id === "academy") {
      return isNeo ? [
        { title: "Map the learner", tag: "STAGE 01 // AUDIENCE FIT", desc: "Target roles, portfolio gaps, no generic tracks." },
        { title: "Run the cohort", tag: "STAGE 02 // CODE & DESIGN", desc: "Sprints, peer code reviews, shipping production lines." },
        { title: "Build proof", tag: "STAGE 03 // DEPLOY SYSTEM", desc: "Case study refinement, interactive portfolio sites." },
        { title: "Place or partner", tag: "STAGE 04 // compounding WINNERS", desc: "Fast-tracked interview loops, direct hiring pipes." }
      ] : [
        { title: "Skill Mapping", tag: "Phase 01: Learner Assessment", desc: "Identifying career targets, benchmarking technical baselines and mapping skills to hiring criteria." },
        { title: "Cohort Delivery", tag: "Phase 02: Live Programme", desc: "Structured sessions, sprint-based project delivery and mentor-led code reviews." },
        { title: "Portfolio Proof", tag: "Phase 03: Case Study Build", desc: "Projects converted into review-ready portfolios, scored against hiring standards." },
        { title: "Placement", tag: "Phase 04: Hiring Coordination", desc: "Partner matching, cohort outcome reports and coordinated interview workflows." }
      ];
    } else { // labs
      return isNeo ? [
        { title: "Find the workflow", tag: "STAGE 01 // AUDIENCE FIT", desc: "Spotting the knowledge bottlenecks where AI destroys friction." },
        { title: "Design the system", tag: "STAGE 02 // CODE & DESIGN", desc: "Data models, vector pipelines, prompt specs mapped out." },
        { title: "Build and test", tag: "STAGE 03 // DEPLOY SYSTEM", desc: "Iterative evals, guardrail hardening, private sandboxing." },
        { title: "Deploy and observe", tag: "STAGE 04 // compounding WINNERS", desc: "Real-time telemetry, trace logs, compounding AI efficiency." }
      ] : [
        { title: "Problem Frame", tag: "Phase 01: Discovery & Scoping", desc: "Defining the business problem, success criteria and the outcome the software must deliver." },
        { title: "Architecture", tag: "Phase 02: System Design", desc: "System architecture, data model, integration map and technology selection — agreed before any build begins." },
        { title: "Build & Evaluate", tag: "Phase 03: Incremental Delivery", desc: "Iterative build against the written scope, with evaluation checkpoints and QA at each stage." },
        { title: "Launch & Support", tag: "Phase 04: Production & Handover", desc: "Monitored production deployment, clean handover documentation and agreed ongoing support scope." }
      ];
    }
  }, [section.id, isNeo]);

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (rect.height + vh * 0.4)));
      setActiveStep(Math.min(steps.length - 1, Math.floor(progress * steps.length)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [steps.length]);

  const handleStepClick = (idx: number) => {
    setActiveStep(idx);
  };

  const percentage = (activeStep / (steps.length - 1)) * 100;

  return (
    <section className="interactive-timeline-band" ref={sectionRef}>
      <div className="section-head" style={{ marginBottom: "32px" }}>
        <div>
          <p className="eyebrow">{isNeo ? "How it works" : "Delivery model"}</p>
          <h2>{isNeo ? "The process and the packages." : "Process and engagement options."}</h2>
        </div>
      </div>

      <div className="timeline-steps-container">
        <div className="timeline-bulb" />
        <div className="timeline-track-filled" style={{ width: `calc(${percentage}% + 12px)` }} />
        {steps.map((item, idx) => (
          <div 
            key={item.step} 
            className={`timeline-node ${activeStep === idx ? "active" : ""}`}
            onClick={() => handleStepClick(idx)}
          >
            <div className="node-circle">{item.step}</div>
            <div className="node-label">{timelineCopy[idx]?.title}</div>
          </div>
        ))}
      </div>

      <div className="timeline-active-content-pane">
        <div className="timeline-step-eyebrow">
          {timelineCopy[activeStep]?.tag}
        </div>
        <div className="timeline-step-title">{timelineCopy[activeStep]?.title}</div>
        <p className="timeline-step-desc">
          {timelineCopy[activeStep]?.desc}
        </p>
      </div>

      <div className="package-grid" style={{ marginTop: "48px" }}>
        {section.packages.map((pkg) => (
          <article 
            className="package-card" 
            key={pkg.name}
            style={{ cursor: "pointer" }}
            onClick={() => routeTo(theme, "contact", section.id)}
          >
            <span>{pkg.fit}</span>
            <h3>{pkg.name}</h3>
            <div className="package-meta">
              <strong>{pkg.price}</strong>
              <small>{pkg.duration}</small>
            </div>
            <ul>{pkg.includes.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RoiEstimator({ theme }: ThemeProps) {
  const [visitors, setVisitors] = useState(15000);
  const [val, setVal] = useState(150);
  const [conversion, setConversion] = useState(2.4);
  const [currency, setCurrency] = useState("INR");

  const rate = 83;
  const isINR = currency === "INR";
  const leads = Math.round(visitors * (conversion / 100));
  const valueGained = leads * val;
  const isNeo = theme === "neo";

  let recommendation = "";
  if (valueGained < 5000) {
    recommendation = isNeo
      ? "CLOSEST PACKAGE: Brand Launch. At this scenario size, identity and core messaging come first."
      : "Closest package: Brand Launch. A scenario at this scale usually starts with positioning and identity.";
  } else if (valueGained < 30000) {
    recommendation = isNeo
      ? "CLOSEST PACKAGE: Website Growth. This scenario shape points at conversion mechanics."
      : "Closest package: Website Growth. A scenario at this scale usually centres on UX structure, copy and SEO foundations.";
  } else {
    recommendation = isNeo
      ? "CLOSEST PACKAGE: Demand System. A scenario this size needs content, paid and reporting running as one loop."
      : "Closest package: Demand System. A scenario at this scale usually combines campaigns, content cadence and reporting.";
  }

  return (
    <section className="roi-estimator-band">
      <div className="section-head">
        <div>
          <p className="eyebrow">{isNeo ? "Scenario Sandbox" : "Scenario calculator"}</p>
          <h2>{isNeo ? "Play with the math behind your funnel." : "Model a hypothetical funnel scenario."}</h2>
          <p className="roi-disclaimer">{isNeo
            ? "Your inputs, your math. This is a what-if sandbox — not a Nexara projection or promise."
            : "Figures are derived entirely from the inputs you set below. This is an illustrative scenario, not a performance projection or commitment."}</p>
        </div>
      </div>

      <div className="roi-container">
        <div className="roi-controls">
          <div className="currency-selector-group">
            <span className="currency-label">{isNeo ? "SELECT CURRENCY" : "Currency selector"}</span>
            <div className="currency-options">
              <button 
                type="button" 
                className={`currency-btn ${currency === "USD" ? "active" : ""}`}
                onClick={() => setCurrency("USD")}
              >
                USD ($)
              </button>
              <button 
                type="button" 
                className={`currency-btn ${currency === "INR" ? "active" : ""}`}
                onClick={() => setCurrency("INR")}
              >
                INR (₹)
              </button>
            </div>
          </div>

          <div className="roi-slider-group">
            <div className="roi-slider-label">
              <span>{isNeo ? "Monthly Traffic Stream" : "Monthly Visitors Base"}</span>
              <span className="roi-slider-val">{visitors.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="100000" 
              step="1000" 
              value={visitors} 
              onChange={(e) => setVisitors(parseInt(e.target.value))} 
            />
          </div>

          <div className="roi-slider-group">
            <div className="roi-slider-label">
              <span>{isNeo ? "Conversion Target" : "Target Funnel Conversion"}</span>
              <span className="roi-slider-val">{conversion.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="8.0" 
              step="0.1" 
              value={conversion} 
              onChange={(e) => setConversion(parseFloat(e.target.value))} 
            />
          </div>

          <div className="roi-slider-group">
            <div className="roi-slider-label">
              <span>{isNeo ? "Average Deal Size" : "Average Contract Value"}</span>
              <span className="roi-slider-val">
                {isINR ? `₹${(val * rate).toLocaleString()}` : `$${val}`}
              </span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="1000" 
              step="10" 
              value={val} 
              onChange={(e) => setVal(parseInt(e.target.value))} 
            />
          </div>
        </div>

        <div className="roi-results-pane">
          <span className="eyebrow">{isNeo ? "SCENARIO VALUE (MONTHLY)" : "Scenario value (monthly)"}</span>
          <div className="roi-metric-big">
            {isINR ? `₹${(valueGained * rate).toLocaleString()}` : `$${valueGained.toLocaleString()}`}
          </div>
          <p style={{ fontSize: "0.85rem", opacity: 0.75, marginBottom: "16px" }}>
            {isNeo
              ? `Based on ${leads.toLocaleString()} hypothetical monthly conversions from your inputs`
              : `Derived from ${leads.toLocaleString()} hypothetical conversions per month at your chosen inputs`}
          </p>
          <div className="roi-recommendation-box">
            {recommendation}
          </div>
        </div>
      </div>
    </section>
  );
}
