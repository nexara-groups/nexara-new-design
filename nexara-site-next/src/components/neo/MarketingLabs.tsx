'use client';
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof window !== 'undefined') Object.assign(window, { gsap, ScrollTrigger });

declare global {
  interface Window {
    gsap?: typeof gsap;
    ScrollTrigger?: typeof ScrollTrigger;
  }
}

import { NeoSectionHero } from './SectionShell';
import { DATA } from '@/lib/data';

type Theme = 'neo' | 'trust';

// Real structural type from DATA, matching the convention in SectionShell.tsx —
// a hand-rolled version here previously didn't match the real shape.
type MarketingLabsSection = (typeof DATA.sections)[keyof typeof DATA.sections];

interface MarketingLabsHeroProps {
  theme: Theme;
  section: MarketingLabsSection;
}

interface NeoSectionHeroProps extends MarketingLabsHeroProps {
  variant: 'mkt' | 'labs';
  children: React.ReactNode;
}

export function BroadcastVisual() {
  const channels = ["Social", "Search", "Ads", "Content"];
  return (
    <div className="neo-bcast" aria-hidden="true">
      <span className="neo-bcast-ring"></span>
      <span className="neo-bcast-ring"></span>
      <span className="neo-bcast-ring"></span>
      <div className="neo-bcast-core"><span>SIGNAL</span></div>
      {channels.map((c, i) => (
        <span key={c} className={`neo-bcast-chip chip-${i + 1}`}>{c}</span>
      ))}
    </div>
  );
}

export function PipelineVisual() {
  const nodes = [["01", "Ingest"], ["02", "Reason"], ["03", "Evaluate"], ["04", "Ship"]];
  return (
    <div className="neo-pipe" aria-hidden="true">
      <span className="neo-pipe-pulse"></span>
      {nodes.map(([n, label]) => (
        <div className="neo-pipe-node" key={n}>
          <span className="neo-pipe-dot"></span>
          <span className="neo-pipe-num">{n}</span>
          <span className="neo-pipe-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function MarketingHero({ theme, section }: MarketingLabsHeroProps) {
  return (
    <NeoSectionHero theme={theme} section={section} variant="mkt">
      <BroadcastVisual />
    </NeoSectionHero>
  );
}

export function LabsHero({ theme, section }: MarketingLabsHeroProps) {
  return (
    <NeoSectionHero theme={theme} section={section} variant="labs">
      <PipelineVisual />
    </NeoSectionHero>
  );
}

export function MarketingSignalSection() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPower = window.matchMedia('(max-width: 760px)').matches
      || Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
      || (navigator.hardwareConcurrency || 8) <= 4;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let ww = 0, wh = 0, dpr = 1, rafId = 0;
    let visible = true, lastFrame = 0;
    let resizeTimer: number | undefined;
    const frameInterval = 1000 / 30;
    const fit = () => {
      dpr = lowPower ? 1 : Math.min(window.devicePixelRatio || 1, 1.35);
      ww = canvas.clientWidth; wh = canvas.clientHeight;
      canvas.width = ww * dpr; canvas.height = wh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const draw = (ts: number) => {
      rafId = 0;
      if (!visible || document.hidden) return;
      if (ts - lastFrame < frameInterval) {
        rafId = window.requestAnimationFrame(draw);
        return;
      }
      lastFrame = ts;
      const t0 = ts / 1000;
      ctx.clearRect(0, 0, ww, wh);
      for (let r = 0; r < 3; r++) {
        const baseY = wh * (0.35 + r * 0.18);
        const amp = wh * 0.06 * (1 + r * 0.4);
        ctx.beginPath();
        for (let x = 0; x <= ww; x += 4) {
          const v = Math.sin(x * 0.008 + t0 * (0.7 + r * 0.3)) * amp * Math.sin(x * 0.0013 + t0 * 0.2);
          const y = baseY + v;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = r === 1 ? 'rgba(0,229,160,0.5)' : 'rgba(233,238,242,0.12)';
        ctx.lineWidth = r === 1 ? 1.5 : 1;
        ctx.stroke();
      }
      if (!reduced && !lowPower) rafId = window.requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible && !rafId) rafId = window.requestAnimationFrame(draw);
      else if (!visible && rafId) { window.cancelAnimationFrame(rafId); rafId = 0; }
    }, { threshold: 0 });
    observer.observe(canvas);
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => { fit(); if (!rafId) rafId = window.requestAnimationFrame(draw); }, 120);
    };
    window.addEventListener('resize', onResize, { passive: true });
    rafId = window.requestAnimationFrame(draw);
    return () => {
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="nx-mkt-signal">
      <canvas ref={canvasRef} className="nx-mkt-wave" aria-hidden="true"></canvas>
      <div className="nx-mkt-signal-copy">
        <p className="nx-mono nx-mono-mkt">// Growth engineering</p>
        <h2>Attention is a <em>signal.</em> We tune it.</h2>
        <p className="nx-mkt-sub">No vibes-based marketing. Every campaign is instrumented, every claim has a dashboard behind it, every dollar reports to a metric.</p>
      </div>
    </section>
  );
}

export function MarketingFunnelSection() {
  const wrapRef = React.useRef<HTMLElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // useLayoutEffect: see LabsBlueprintSection — pin must revert before unmount
  React.useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || !window.gsap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPower = window.matchMedia('(max-width: 760px)').matches
      || Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
      || (navigator.hardwareConcurrency || 8) <= 4;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let fw = 0, fh = 0, dpr = 1, rafId = 0;
    let resizeTimer: number | undefined;
    const fit = () => {
      dpr = lowPower ? 1 : Math.min(window.devicePixelRatio || 1, 1.35);
      fw = canvas.clientWidth; fh = canvas.clientHeight;
      canvas.width = fw * dpr; canvas.height = fh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => { fit(); drawFunnel(fstate.t); }, 120);
    };
    window.addEventListener('resize', onResize, { passive: true });

    const sub = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));
    const eo = (t: number) => 1 - Math.pow(1 - t, 3);
    const rngP = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
    const parts = Array.from({ length: 90 }, () => ({ x: rngP(), speed: 0.5 + rngP(), keep: rngP() }));
    const names = ['REACH', 'ENGAGE', 'CONVERT', 'RETAIN'] as const;
    const pct = ['100%', '62%', '36%', '18%'] as const;
    const widths = [0.86, 0.6, 0.38, 0.2] as const;
    const keepRates = [1, 0.62, 0.36, 0.18] as const;

    const drawFunnel = (t: number) => {
      ctx.clearRect(0, 0, fw, fh);
      const cx = fw / 2;
      const top = fh * 0.08, bot = fh * 0.9;
      const stages = 4;
      for (let s = 0; s < stages; s++) {
        const st = eo(sub(t, s * 0.18, s * 0.18 + 0.25));
        if (st <= 0) continue;
        const y0 = top + ((bot - top) / stages) * s;
        const y1 = top + ((bot - top) / stages) * (s + 1) - 14;
        const width = widths[s]!;
        const nextWidth = widths[s + 1];
        const w0 = fw * width * 0.5 * st;
        const w1 = fw * (nextWidth !== undefined ? (width + (nextWidth - width) * 0.8) : width * 0.8) * 0.5 * st;
        ctx.strokeStyle = 'rgba(233,238,242,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - w0, y0); ctx.lineTo(cx + w0, y0);
        ctx.moveTo(cx - w0, y0); ctx.lineTo(cx - w1, y1);
        ctx.moveTo(cx + w0, y0); ctx.lineTo(cx + w1, y1);
        ctx.stroke();
        ctx.fillStyle = 'rgba(0,229,160,' + 0.85 * st + ')';
        ctx.font = "500 10px 'JetBrains Mono', monospace";
        ctx.textAlign = 'left';
        ctx.fillText(names[s]!, cx + w0 + 14, y0 + 14);
        ctx.fillStyle = 'rgba(233,238,242,' + 0.4 * st + ')';
        ctx.fillText(pct[s]!, cx + w0 + 14, y0 + 30);
      }
      const flow = sub(t, 0.25, 1);
      if (flow > 0) {
        const time = performance.now() / 1000;
        parts.forEach((p) => {
          const prog = (time * 0.12 * p.speed + p.x) % 1;
          if (prog > flow) return;
          const y = top + (bot - top) * prog;
          const s = Math.min(stages - 1, Math.floor(prog * stages));
          const width = widths[s]!;
          if (p.keep > keepRates[s]!) return;
          const wHere = fw * (width - (width - (widths[s + 1] ?? width * 0.8)) * ((prog * stages) % 1)) * 0.5;
          const px = cx + (p.x - 0.5) * 2 * wHere * 0.9;
          ctx.fillStyle = p.keep < keepRates[stages - 1]! ? '#00e5a0' : 'rgba(233,238,242,0.45)';
          ctx.fillRect(px - 1.5, y - 1.5, 3, 3);
        });
      }
    };

    const blocks = Array.from(wrap.querySelectorAll<HTMLElement>('.nx-step-block'));
    const fstate = { t: 0 };
    let gctx: gsap.Context | null = null;
    if (reduced) {
      drawFunnel(1);
      if (blocks[0]) blocks[0].style.opacity = '1';
    } else {
      gctx = gsap.context(() => {
        gsap.to(fstate, {
          t: 1,
          ease: 'none',
          onUpdate: () => drawFunnel(fstate.t),
          scrollTrigger: { trigger: wrap, start: 'top top', end: '+=260%', scrub: 0.5, pin: true },
        });
        if (blocks.length) {
          gsap.set(blocks[0]!, { opacity: 1 });
          const ctl = gsap.timeline({
            scrollTrigger: { trigger: wrap, start: 'top top', end: '+=260%', scrub: 0.5 },
          });
          blocks.forEach((b, i) => {
            if (i === 0) return;
            ctl.to(blocks[i - 1]!, { opacity: 0, y: -24, duration: 1 }, i * 2.5)
               .fromTo(b, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1 }, i * 2.5 + 0.7);
          });
        }
      }, wrap);
      drawFunnel(0);
    }
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      if (rafId) window.cancelAnimationFrame(rafId);
      if (gctx) gctx.revert();
    };
  }, []);

  const steps = [
    { label: 'Stage 01 / Reach', title: 'Find the people who already have the problem.', body: 'Paid, organic, and technical SEO working one keyword graph. We buy intent, not impressions.' },
    { label: 'Stage 02 / Engage', title: 'Earn the second visit.', body: 'Content engineered like product: versioned, tested, retired when it stops converting. 62% make it past hello.' },
    { label: 'Stage 03 / Convert', title: 'Remove every reason to say no.', body: 'CRO experiments shipped weekly. Forms shortened, friction logged, objections answered before they’re asked.' },
    { label: 'Stage 04 / Retain', title: 'The funnel ends in a flywheel.', body: 'Lifecycle email, product telemetry, win-back loops. The 18% who stay are worth more than the 100% who arrived.' },
  ];

  return (
    <section ref={wrapRef} className="nx-funnel-pin">
      <div className="nx-funnel-stage">
        <div className="nx-funnel-copy">
          {steps.map((s) => (
            <div key={s.label} className="nx-step-block">
              <span className="nx-mono nx-mono-mkt">{s.label}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <canvas ref={canvasRef} className="nx-funnel-canvas" aria-hidden="true"></canvas>
      </div>
    </section>
  );
}

export function LabsStatsStrip() {
  const stats = [
    ["Cohort-based", "talent pipeline"],
    ["Project-led", "live projects"],
    ["Open-source", "by default"],
    ["Shipping", "daily cadence"]
  ];
  return (
    <section className="labs-high-impact-section">
      <div className="labs-high-impact-strip">
        <h3>Three engines. One operating model. No filler.</h3>
        <div className="labs-high-impact-grid">
          {stats.map(([val, label]) => (
            <div key={label}>
              <strong>{val}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LabsBlueprintSection() {
  const wrapRef = React.useRef<HTMLElement | null>(null);

  // useLayoutEffect: pin cleanup must revert the pin-spacer BEFORE React
  // removes the node, or unmount throws removeChild NotFoundError
  React.useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !window.gsap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const svg = wrap.querySelector<SVGSVGElement>('.nx-labs-visual svg');
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll<SVGGeometryElement>('[data-draw]'));
    const fills = Array.from(svg.querySelectorAll<SVGElement>('[data-fill]'));
    const caps = Array.from(wrap.querySelectorAll<HTMLElement>('.nx-build-cap'));

    if (reduced) {
      fills.forEach((f) => { f.style.opacity = '1'; });
      caps.forEach((c, i) => { if (i < caps.length - 1) c.style.visibility = 'hidden'; });
      return;
    }

    paths.forEach((p) => {
      const len = p.getTotalLength ? p.getTotalLength() : 600;
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    });
    const ctx = gsap.context(() => {
      gsap.to(paths, {
        strokeDashoffset: 0,
        ease: 'none',
        stagger: 0.18,
        scrollTrigger: { trigger: wrap, start: 'top top', end: '+=250%', scrub: 0.5, pin: true },
      });
      gsap.to(fills, {
        opacity: 1,
        stagger: 0.1,
        scrollTrigger: { trigger: wrap, start: 'top top', end: '+=250%', scrub: 0.5 },
      });
      caps.forEach((c, i) => { if (i > 0) gsap.set(c, { autoAlpha: 0 }); });
      const ctl = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top top', end: '+=250%', scrub: 0.5 },
      });
      caps.forEach((c, i) => {
        if (i === 0) return;
        ctl.to(caps[i - 1]!, { autoAlpha: 0, y: -20, duration: 1 }, i * 2.4)
           .to(c, { autoAlpha: 1, y: 0, duration: 1 }, i * 2.4 + 0.6);
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapRef} className="nx-labs-build">
      <div className="nx-labs-split">
        <div className="nx-labs-copy">
          <p className="nx-mono nx-mono-labs">// Scroll to assemble</p>
          <div className="nx-build-cap">
            <h3>Every build starts as a wireframe.</h3>
            <p>Architecture first. We draw the system before we write the system.</p>
          </div>
          <div className="nx-build-cap">
            <h3>Then the layers stack.</h3>
            <p>Data, services, interface — each layer tested before the next lands on top of it.</p>
          </div>
          <div className="nx-build-cap">
            <h3>Then it ships. <em>Live.</em></h3>
            <p>Instrumented, observable, on-call rotation assigned. Production is the only finish line we recognise.</p>
          </div>
        </div>
        <div className="nx-labs-visual">
          <svg viewBox="0 0 480 408" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="rgba(233,238,242,0.06)" strokeWidth="1">
              <path d="M0 51h480M0 102h480M0 153h480M0 204h480M0 255h480M0 306h480M0 357h480" />
              <path d="M60 0v408M120 0v408M180 0v408M240 0v408M300 0v408M360 0v408M420 0v408" />
            </g>
            <path data-draw="" d="M120 300 L240 240 L360 300 L240 360 Z" stroke="#f97316" strokeWidth="1.5" />
            <path data-draw="" d="M120 300 V322 L240 382 L360 322 V300" stroke="#f97316" strokeWidth="1.5" />
            <path data-draw="" d="M240 360 V382" stroke="#f97316" strokeWidth="1.5" />
            <text data-fill="" x="378" y="318" fill="#f97316" fontFamily="JetBrains Mono" fontSize="10" opacity="0">DATA</text>
            <path data-draw="" d="M140 230 L240 180 L340 230 L240 280 Z" stroke="rgba(233,238,242,0.7)" strokeWidth="1.5" />
            <path data-draw="" d="M140 230 V248 L240 298 L340 248 V230" stroke="rgba(233,238,242,0.7)" strokeWidth="1.5" />
            <path data-draw="" d="M240 280 V298" stroke="rgba(233,238,242,0.7)" strokeWidth="1.5" />
            <text data-fill="" x="358" y="244" fill="rgba(233,238,242,0.7)" fontFamily="JetBrains Mono" fontSize="10" opacity="0">SERVICES</text>
            <path data-draw="" d="M160 160 L240 120 L320 160 L240 200 Z" stroke="#00f0ff" strokeWidth="1.5" />
            <path data-draw="" d="M160 160 V176 L240 216 L320 176 V160" stroke="#00f0ff" strokeWidth="1.5" />
            <path data-draw="" d="M240 200 V216" stroke="#00f0ff" strokeWidth="1.5" />
            <text data-fill="" x="338" y="172" fill="#00f0ff" fontFamily="JetBrains Mono" fontSize="10" opacity="0">INTERFACE</text>
            <path data-draw="" d="M240 36 V112" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="4 6" />
            <circle data-fill="" cx="240" cy="36" r="5" stroke="#00f0ff" strokeWidth="1.5" opacity="0" />
            <text data-fill="" x="252" y="44" fill="rgba(233,238,242,0.5)" fontFamily="JetBrains Mono" fontSize="10" opacity="0">LIVE TRAFFIC</text>
            <path data-draw="" d="M96 240 V382 M88 240 h16 M88 382 h16" stroke="rgba(233,238,242,0.3)" strokeWidth="1" />
            <text data-fill="" x="52" y="316" fill="rgba(233,238,242,0.4)" fontFamily="JetBrains Mono" fontSize="9" opacity="0">3 LAYERS</text>
          </svg>
        </div>
      </div>
    </section>
  );
}
