// @ts-nocheck -- deep canvas/GSAP animation-state closures left untyped deliberately;
// forcing types here without runtime insight into each closure risks silently
// changing animation timing. Revisit during a dedicated animation-code pass, not
// as a rushed tail-end of this decomposition.
'use client';
import React from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'framer-motion';
import { DATA } from '@/lib/data';
import { routeTo } from '@/lib/trust-router';
import { TrustParticleCanvas } from './Canvas';
import { getTrustSectionLabel } from './shared';

const TRUST_HERO_PARTICLES = [
  { x: 8, y: 20, s: 8, d: 0.0, dur: 9.5 },
  { x: 16, y: 64, s: 4, d: 0.6, dur: 8.8 },
  { x: 25, y: 36, s: 6, d: 1.4, dur: 10.5 },
  { x: 34, y: 78, s: 5, d: 0.9, dur: 9.2 },
  { x: 43, y: 18, s: 3, d: 1.8, dur: 7.8 },
  { x: 53, y: 58, s: 7, d: 0.3, dur: 10.8 },
  { x: 61, y: 30, s: 4, d: 1.1, dur: 8.4 },
  { x: 69, y: 72, s: 9, d: 1.6, dur: 11.2 },
  { x: 77, y: 42, s: 5, d: 0.5, dur: 9.7 },
  { x: 86, y: 22, s: 7, d: 1.9, dur: 10.2 },
  { x: 91, y: 66, s: 4, d: 1.2, dur: 8.6 },
  { x: 48, y: 86, s: 3, d: 2.2, dur: 7.6 },
];

export function CyclingWord({ words }: { words: string[] }) {
  const [idx, setIdx] = React.useState(0);
  const [animKey, setAnimKey] = React.useState(0);
  React.useEffect(() => {
    const id = setTimeout(() => {
      setIdx(i => (i + 1) % words.length);
      setAnimKey(k => k + 1);
    }, 2200);
    return () => clearTimeout(id);
  }, [animKey, words.length]);
  return (
    <span className="ahero-wrap">
      <span key={animKey} className="ahero-word">{words[idx]}</span>
    </span>
  );
}

export function TrustHeroParticles({ variant = 'parent' }: { variant?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className={`tsx-hero-particles tsx-hero-particles-${variant}`} aria-hidden="true">
      {TRUST_HERO_PARTICLES.map((p, i) => (
        <motion.span
          key={`${variant}-${i}`}
          className="tsx-hero-particle"
          style={{ '--x': `${p.x}%`, '--y': `${p.y}%`, '--s': `${p.s}px` } as React.CSSProperties}
          initial={{ opacity: reduceMotion ? 0.5 : 0.2, y: 0, scale: 1 }}
          animate={reduceMotion ? { opacity: 0.58 } : {
            opacity: [0.22, 0.92, 0.36],
            y: [-10, 18, -10],
            x: [-6, 10, -6],
            scale: [0.9, 1.22, 0.9],
          }}
          transition={reduceMotion ? { duration: 0 } : {
            duration: p.dur,
            delay: p.d,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function TrustHeroEnergyLoop({ sectionId = 'academy', targetRef }: {
  sectionId?: string;
  targetRef?: React.RefObject<HTMLElement | null>;
}) {
  const reduceMotion = useReducedMotion();
  const sectionNumber = sectionId === 'academy' ? '01' : sectionId === 'marketing' ? '02' : '03';
  const loopRef = React.useRef<HTMLDivElement | null>(null);
  const threadRef = React.useRef<HTMLSpanElement | null>(null);
  const cometRef = React.useRef<HTMLSpanElement | null>(null);
  const digitRef = React.useRef<HTMLSpanElement | null>(null);
  const reflectionRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    const loop = loopRef.current;
    const thread = threadRef.current;
    const comet = cometRef.current;
    const digit = digitRef.current;
    const reflection = reflectionRef.current;
    if (!loop || !thread || !comet || !digit || !reflection) return;

    let rafId = 0;
    let t0 = performance.now();

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const ease = (t) => t * t * (3 - 2 * t);
    const setSegment = (el, x1, y1, x2, y2, opacity) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.max(1, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx);
      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `translate(${x1}px,${y1}px) rotate(${angle}rad) scaleX(${len})`;
    };

    function frame(now) {
      const box = loop.getBoundingClientRect();
      const target = targetRef?.current?.getBoundingClientRect();
      const w = box.width || window.innerWidth;
      const h = box.height || window.innerHeight;
      const sourceX = clamp(w * 0.09, 64, 180);
      const fallbackY = clamp(h * 0.36, 142, 250);
      const targetBox = target
        ? {
            left: target.left - box.left,
            right: target.right - box.left,
            top: target.top - box.top,
            bottom: target.bottom - box.top,
          }
        : null;
      const beamY = targetBox
        ? clamp(targetBox.top + (targetBox.bottom - targetBox.top) * 0.58, 96, h - 72)
        : fallbackY;
      const duration = reduceMotion ? 100000 : 3200;
      const phase = reduceMotion ? 0.38 : ((now - t0) % duration) / duration;
      const outbound = phase < 0.72;
      const pass = outbound ? ease(phase / 0.72) : 1 - ease((phase - 0.72) / 0.28);
      const rawX = sourceX + pass * (w * 0.68);
      const rawY = beamY + Math.sin(phase * Math.PI * 2) * 16;

      const hasHit = Boolean(
        targetBox &&
        outbound &&
        rawX >= targetBox.left &&
        rawX <= targetBox.right + 24 &&
        beamY >= targetBox.top - 12 &&
        beamY <= targetBox.bottom + 12
      );
      const hitX = targetBox ? clamp(rawX, targetBox.left, targetBox.right) : rawX;
      const hitY = beamY;
      const cometX = hasHit ? hitX - Math.max(18, (rawX - targetBox.left) * 0.72) : rawX;
      const cometY = hasHit ? hitY + Math.max(10, (rawX - targetBox.left) * 0.14) : rawY;
      const threadEndX = hasHit ? hitX : cometX;
      const threadEndY = hasHit ? hitY : cometY;
      const live = 0.54 + Math.sin(phase * Math.PI) * 0.28;

      setSegment(thread, sourceX, beamY, threadEndX, threadEndY, hasHit ? 0.96 : live);
      setSegment(reflection, hitX, hitY, cometX, cometY, hasHit ? 0.88 : 0.14);

      comet.style.opacity = hasHit ? '1' : '0.82';
      comet.style.transform = `translate(${cometX}px,${cometY}px) translate(-50%,-50%) scale(${hasHit ? 1.34 : 1.02 + Math.sin(phase * Math.PI) * 0.16})`;

      digit.style.opacity = hasHit ? '1' : '0.78';
      digit.style.transform = `translate(${hitX}px,${hitY}px) translate(-50%,-50%) scale(${hasHit ? 1.16 : 1})`;
      digit.style.boxShadow = hasHit ? '0 0 42px rgba(26,109,255,.92)' : '0 0 0 rgba(26,109,255,0)';

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [reduceMotion, targetRef]);

  return (
    <div ref={loopRef} className="tsx-hero-energy-loop" aria-hidden="true">
      <span
        ref={threadRef}
        className="tsx-hero-energy-thread"
      />
      <span
        ref={cometRef}
        className="tsx-hero-energy-comet"
      />
      <span
        ref={digitRef}
        className="tsx-hero-energy-digit"
      >
        {sectionNumber}
      </span>
      <span
        ref={reflectionRef}
        className="tsx-hero-energy-reflection"
      />
    </div>
  );
}

export function TrustHeroFlat() {
  const copy = DATA.home.trust;
  return (
    <section className="tsx-hero" aria-label="Hero">
      <TrustParticleCanvas />
      <div className="tsx-hero-rule" aria-hidden="true" />
      <div className="tsx-hero-copy">
        <p className="tsx-eyebrow">{copy.eyebrow}</p>
        <h1 className="tsx-h1">{copy.title}<br /><span>{copy.accent}</span></h1>
        <p className="tsx-hero-sub">{copy.body}</p>
        <div className="tsx-hero-actions">
          <button className="tsx-btn-primary" onClick={() => routeTo('trust', 'contact')}>Plan an Engagement</button>
          <button className="tsx-btn-ghost" onClick={() => routeTo('trust', 'academy')}>Explore Solutions</button>
        </div>
      </div>
      <div className="tsx-hero-card" role="complementary" aria-label="Nexara at a glance">
        <div className="tsx-hero-card-header">
          <p>Nexara / Enterprise</p>
          <p>Capability index</p>
        </div>
        <div>
          {Object.values(DATA.sections).map((section) => (
            <div className="tsx-stat tsx-stat-link" key={section.id} role="link" tabIndex={0}
              onClick={() => routeTo('trust', section.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') routeTo('trust', section.id); }}>
              <div className="tsx-stat-label">{getTrustSectionLabel(section)}</div>
              <div className="tsx-stat-value">{section.index}<span>{section.stackDetails.length} modules</span></div>
              <div className="tsx-stat-dot" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustHeroUnravel() {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const titleRef = React.useRef<HTMLHeadingElement | null>(null);
  const counterNumRef = React.useRef<HTMLElement | null>(null);
  const counterBarRef = React.useRef<HTMLElement | null>(null);
  const scrollCueRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const TAU = Math.PI * 2;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Three divisions: blob + particle stream system ────────────────────────
    //
    //  Scroll path:
    //   p 0.00→0.07   scatter    blobs at wide triangle, particles drift
    //   p 0.07→0.23   converge   all three stream INTO core
    //   p 0.23→0.27   unified    core fully formed, blobs dissolved
    //   p 0.27→0.45   academy    academy breaks LEFT, core → academy stream
    //   p 0.45→0.63   labs       labs breaks RIGHT, core → labs stream
    //   p 0.63→0.81   digital    digital breaks DOWN, core → digital stream
    //   p 0.81→0.86   re-emerge  blobs fade back in at spread
    //   p 0.86→1.00   re-conv    all three stream back into core
    //
    const DIVS = [
      { label: 'Academy', r: 26,  g: 109, b: 255 },
      { label: 'Labs',    r: 109, g: 74,  b: 255 },
      { label: 'Digital', r: 0,   g: 170, b: 204 },
    ];

    const makeSprite = (r, g, b) => {
      const s = document.createElement('canvas');
      s.width = s.height = 64;
      const sc = s.getContext('2d');
      const grd = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0,    `rgba(${r},${g},${b},1.0)`);
      grd.addColorStop(0.20, `rgba(${r},${g},${b},0.9)`);
      grd.addColorStop(0.48, `rgba(${r},${g},${b},0.5)`);
      grd.addColorStop(0.78, `rgba(${r},${g},${b},0.14)`);
      grd.addColorStop(1,    `rgba(${r},${g},${b},0)`);
      sc.fillStyle = grd;
      sc.fillRect(0, 0, 64, 64);
      return s;
    };
    const sprites = DIVS.map(d => makeSprite(d.r, d.g, d.b));

    const COUNT = window.innerWidth < 760 ? 90 : 140;
    const particles = DIVS.map(() =>
      Array.from({ length: COUNT }, (_, i) => ({
        t:  i / COUNT,
        jx: Math.random() - .5,
        jy: Math.random() - .5,
        arc: (Math.random() - .5) * 2,
        sz: 1.0 + Math.random() * 1.4,
      }))
    );

    // Helpers
    function ss(t)         { return t * t * (3 - 2 * t); }
    function cl(v)         { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function pr(p, a, b)   { return ss(cl((p - a) / (b - a))); }
    function lrp(a, b, t)  { return a + (b - a) * t; }
    function lrpP(a, b, t) { return { x: lrp(a.x, b.x, t), y: lrp(a.y, b.y, t) }; }

    // Per-strand state at scroll progress p
    function getState(p, si, time) {
      const spread = [
        { x: W * .16, y: H * .15 },
        { x: W * .84, y: H * .15 },
        { x: CX,      y: H * (W < 760 ? .76 : .86) }, // higher on mobile: label must clear the scroll cue
      ];
      const core  = { x: CX, y: CY };
      const spots = [
        { x: W * .20, y: CY },
        { x: W * .80, y: CY },
        { x: CX,      y: H * .76 },
      ];

      let bPos = { ...spread[si] };
      let bAlpha = 1, isFocused = false;
      let ptSrc = { ...spread[si] }, ptDst = { ...core }, ptAlpha = 0;

      if (p < 0.07) {
        const d = pr(p, 0.02, 0.07);
        bPos = lrpP(spread[si], lrpP(spread[si], core, .1), d);
        bAlpha = lrp(0.6, 1, d);
        ptSrc = { ...bPos }; ptDst = { ...core };
        ptAlpha = lrp(0.18, 0.42, d);

      } else if (p < 0.27) {
        const t = pr(p, 0.07, 0.23);
        bPos = lrpP(spread[si], core, t);
        bAlpha = lrp(1, 0, t * t * t);
        ptSrc = lrpP(spread[si], lrpP(spread[si], core, .12), t);
        ptDst = { ...core };
        ptAlpha = lrp(0.38, 0.72, pr(p, 0.07, 0.18));

      } else if (p < 0.45) {
        if (si === 0) {
          isFocused = true;
          const tIn  = pr(p, 0.27, 0.32);
          const tOut = pr(p, 0.43, 0.45);
          bPos = tOut > 0 ? lrpP(spots[0], core, tOut) : lrpP(core, spots[0], tIn);
          bAlpha = tOut > 0 ? lrp(1, 0, tOut * tOut) : tIn;
          ptSrc = { ...core }; ptDst = { ...bPos };
          ptAlpha = bAlpha * 0.65;
        } else {
          bPos = { ...core }; bAlpha = 0;
          ptSrc = { ...core }; ptDst = { ...core };
          ptAlpha = 0.06;
        }

      } else if (p < 0.63) {
        if (si === 1) {
          isFocused = true;
          const tIn  = pr(p, 0.45, 0.50);
          const tOut = pr(p, 0.61, 0.63);
          bPos = tOut > 0 ? lrpP(spots[1], core, tOut) : lrpP(core, spots[1], tIn);
          bAlpha = tOut > 0 ? lrp(1, 0, tOut * tOut) : tIn;
          ptSrc = { ...core }; ptDst = { ...bPos };
          ptAlpha = bAlpha * 0.65;
        } else {
          bPos = { ...core }; bAlpha = 0;
          ptSrc = { ...core }; ptDst = { ...core };
          ptAlpha = 0.06;
        }

      } else if (p < 0.81) {
        if (si === 2) {
          isFocused = true;
          const tIn  = pr(p, 0.63, 0.68);
          const tOut = pr(p, 0.79, 0.81);
          bPos = tOut > 0 ? lrpP(spots[2], core, tOut) : lrpP(core, spots[2], tIn);
          bAlpha = tOut > 0 ? lrp(1, 0, tOut * tOut) : tIn;
          ptSrc = { ...core }; ptDst = { ...bPos };
          ptAlpha = bAlpha * 0.65;
        } else {
          bPos = { ...core }; bAlpha = 0;
          ptSrc = { ...core }; ptDst = { ...core };
          ptAlpha = 0.07;
        }

      } else if (p < 0.86) {
        const t = pr(p, 0.81, 0.86);
        const stagger = si * 0.12;
        bPos = lrpP(core, spread[si], t);
        bAlpha = pr(t, stagger, Math.min(stagger + 0.55, 1));
        ptSrc = { ...core }; ptDst = { ...bPos };
        ptAlpha = bAlpha * 0.45;

      } else {
        const t = pr(p, 0.86, 0.99);
        bPos = lrpP(spread[si], core, t);
        bAlpha = Math.max(0.30, lrp(1, 0, t * t * t));
        ptSrc = lrpP(spread[si], lrpP(spread[si], core, .12), t);
        ptDst = { ...core };
        ptAlpha = lrp(0.45, 0.92, pr(p, 0.86, 0.96));
      }

      return { bPos, bAlpha, isFocused, ptSrc, ptDst, ptAlpha };
    }

    function coreIntensity(p) {
      if (p < 0.07)  return pr(p, 0.03, 0.07) * 0.28;
      if (p < 0.23)  return lrp(0.28, 1, pr(p, 0.07, 0.23));
      return 1;
    }

    function drawBlob(si, bx, by, alpha, time, isFocused) {
      if (alpha < 0.02) return;
      const d = DIVS[si];
      const ph = si * 2.09 + time * 1.35;
      const ringR = (isFocused ? W * .054 : W * .034) + Math.sin(ph) * W * .003;

      // Outer atmosphere
      const atm = ctx.createRadialGradient(bx, by, ringR * .5, bx, by, ringR * 2.6);
      atm.addColorStop(0,  `rgba(${d.r},${d.g},${d.b},${.22 * alpha})`);
      atm.addColorStop(1,  `rgba(${d.r},${d.g},${d.b},0)`);
      ctx.globalAlpha = 1;
      ctx.fillStyle = atm;
      ctx.beginPath(); ctx.arc(bx, by, ringR * 2.6, 0, TAU); ctx.fill();

      // Ring stroke
      ctx.globalAlpha = alpha * (isFocused ? 0.88 : 0.55);
      ctx.strokeStyle = `rgb(${d.r},${d.g},${d.b})`;
      ctx.lineWidth   = isFocused ? 1.5 : 1.0;
      ctx.beginPath(); ctx.arc(bx, by, ringR, 0, TAU); ctx.stroke();

      // Subtle inner fill
      const fill = ctx.createRadialGradient(bx, by, 0, bx, by, ringR);
      fill.addColorStop(0, `rgba(${d.r},${d.g},${d.b},${.14 * alpha})`);
      fill.addColorStop(1, `rgba(${d.r},${d.g},${d.b},0)`);
      ctx.globalAlpha = 1;
      ctx.fillStyle = fill;
      ctx.beginPath(); ctx.arc(bx, by, ringR, 0, TAU); ctx.fill();

      // Rotating arc highlight when focused
      if (isFocused) {
        const arcA = time * 2.1;
        ctx.globalAlpha = alpha * 0.75;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(bx, by, ringR, arcA, arcA + Math.PI * .3);
        ctx.stroke();

        // Precision dial: dashed outer ring, slow rotation via dash offset.
        ctx.globalAlpha = alpha * 0.4;
        ctx.setLineDash([2, 6]);
        ctx.lineDashOffset = -time * 14;
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgb(${d.r},${d.g},${d.b})`;
        ctx.beginPath(); ctx.arc(bx, by, ringR * 1.45, 0, TAU); ctx.stroke();
        ctx.setLineDash([]);
      }

      // Center dot
      const dotR = isFocused ? W * .013 : W * .009;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${d.r},${d.g},${d.b})`;
      ctx.beginPath(); ctx.arc(bx, by, dotR, 0, TAU); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(bx, by, dotR * .48, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;

      // Label
      if (alpha > 0.20) {
        const labelA = cl((alpha - 0.20) / 0.32);
        ctx.globalAlpha = labelA;
        ctx.fillStyle = `rgb(${d.r},${d.g},${d.b})`;
        ctx.font = `600 ${Math.round(W * (isFocused ? .022 : .018))}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(d.label.toUpperCase(), bx, by + ringR * 2.6 + W * .02);
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
      }
    }

    function drawCore(intensity, time) {
      if (intensity < 0.01) return;
      const pulse = W * .05 + Math.sin(time * 2.2) * W * .012;

      const atm = ctx.createRadialGradient(CX, CY, 0, CX, CY, pulse * 2.8);
      atm.addColorStop(0,  `rgba(200,220,255,${.06 * intensity})`);
      atm.addColorStop(.4, `rgba(26,109,255,${.1 * intensity})`);
      atm.addColorStop(1,  'rgba(26,109,255,0)');
      ctx.fillStyle = atm;
      ctx.beginPath(); ctx.arc(CX, CY, pulse * 2.8, 0, TAU); ctx.fill();

      const grd = ctx.createRadialGradient(CX, CY, 0, CX, CY, pulse);
      grd.addColorStop(0,  `rgba(255,255,255,${.95 * intensity})`);
      grd.addColorStop(.3, `rgba(140,180,255,${.72 * intensity})`);
      grd.addColorStop(1,  'rgba(26,109,255,0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(CX, CY, pulse, 0, TAU); ctx.fill();

      ctx.globalAlpha = intensity;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(CX, CY, W * .014, 0, TAU); ctx.fill();

      // Instrument ring: slowly rotating ticks, every 4th one long.
      const tickR = pulse * 1.6;
      const rot = time * 0.15;
      ctx.strokeStyle = 'rgba(140,180,255,1)';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.30 * intensity;
      for (let i = 0; i < 48; i++) {
        const a = rot + (i / 48) * TAU;
        const c = Math.cos(a), s = Math.sin(a);
        const len = i % 4 === 0 ? W * .008 : W * .004;
        ctx.beginPath();
        ctx.moveTo(CX + c * tickR, CY + s * tickR);
        ctx.lineTo(CX + c * (tickR + len), CY + s * (tickR + len));
        ctx.stroke();
      }

      // Breathing orbit ellipse.
      ctx.globalAlpha = 0.22 * intensity;
      ctx.beginPath();
      ctx.ellipse(CX, CY, tickR * 1.35, tickR * (0.42 + 0.16 * Math.sin(time * 0.5)), -0.35, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    let W = 0, H = 0, CX = 0, CY = 0, SCALE = 1;

    // Offscreen trail layer: particles + silk trails accumulate here so the
    // labels, rings, and core on the main canvas stay crisp every frame.
    const trailCanvas = document.createElement('canvas');
    const tctx = trailCanvas.getContext('2d');

    function measure() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      trailCanvas.width = canvas.width;
      trailCanvas.height = canvas.height;
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      CX = W / 2;
      CY = H * 0.48;
      SCALE = Math.min(W, H) * 0.305;
    }

    measure();

    const state = { p: 0, target: 0 };
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const chapters = Array.from(wrapRef.current.querySelectorAll(".tsx-hero-chapter")).map((el) => ({
      el,
      a: parseFloat(el.dataset.from),
      b: parseFloat(el.dataset.to),
      visible: -1,
    }));
    const dots = Array.from(wrapRef.current.querySelectorAll(".tsx-hero-rail button"));
    const titleSpans = Array.from(titleRef.current?.querySelectorAll("span") || []);

    // ── Beam-on-scroll: a blade of light scrubs across NEXARA as you scroll,
    //    igniting each letter (it latches lit). The first STRIKE of the runway
    //    is dedicated to this; the convergence is remapped to start after it. ──
    const STRIKE = 0.16;
    const beamEl = titleRef.current ? titleRef.current.querySelector('.tsx-wordmark-beam') : null;
    const litArr = titleSpans.map(() => 0);
    function applyLit(el, lit, prox) {
      const r = Math.round(120 + 124 * lit), g = Math.round(152 + 96 * lit), b = Math.round(198 + 57 * lit);
      el.style.color = `rgba(${r},${g},${b},${(0.24 + 0.76 * lit).toFixed(2)})`;
      const glow = lit * 0.32 + prox * 0.9;
      el.style.textShadow = `0 0 ${(20 + prox * 22).toFixed(0)}px rgba(150,196,255,${glow.toFixed(2)})`
        + (prox > 0.02 ? `,0 0 ${(74 * prox).toFixed(0)}px rgba(26,109,255,${(prox * 0.6).toFixed(2)})` : '');
    }
    function strikeUpdate(bp) {
      if (!beamEl || !titleRef.current) return;
      const leftPct = -14 + 118 * bp;
      beamEl.style.left = leftPct + '%';
      beamEl.style.opacity = (bp > 0.002 && bp < 0.998) ? '0.95' : '0';
      const wmRect = titleRef.current.getBoundingClientRect();
      if (!wmRect.width) return;
      const halfPct = (beamEl.offsetWidth / 2) / wmRect.width * 100;
      const beamCx = wmRect.left + wmRect.width * (leftPct + halfPct) / 100;
      titleSpans.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const reach = cl((beamCx - (r.left - 12)) / (r.width + 24));
        if (reach > litArr[i]) litArr[i] = reach;
        const prox = Math.max(0, 1 - Math.abs(beamCx - (r.left + r.width / 2)) / (r.width * 0.9));
        applyLit(el, ss(litArr[i]), ss(prox));
      });
    }

    function chapterOpacity(p, a, b) {
      const fade = Math.min(0.045, (b - a) * 0.4);
      const fin = Math.max(0, Math.min(1, (p - a) / fade));
      const finS = fin * fin * (3 - 2 * fin);
      const fout = b >= 0.999 ? 1 : 1 - Math.max(0, Math.min(1, (p - (b - fade)) / fade));
      const foutS = fout * fout * (3 - 2 * fout);
      return Math.min(finS, foutS);
    }

    function updateChapters(p) {
      let active = 0;
      chapters.forEach((ch, i) => {
        const o = ch.a === 0 && p < ch.b
          ? 1 - (p / ch.b) * (p / ch.b) * (3 - 2 * (p / ch.b))
          : chapterOpacity(p, ch.a, ch.b);
        const vis = o > 0.01;
        if (p >= ch.a) active = i;
        ch.el.style.opacity = o.toFixed(3);
        ch.el.style.transform = "translateY(" + ((1 - o) * 26).toFixed(1) + "px)";
        if (vis !== (ch.visible === 1)) {
          ch.visible = vis ? 1 : 0;
          ch.el.style.pointerEvents = vis ? "auto" : "none";
          ch.el.setAttribute("aria-hidden", vis ? "false" : "true");
        }
      });

      dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
      if (counterNumRef.current) counterNumRef.current.textContent = "0" + (active + 1);
      if (counterBarRef.current) counterBarRef.current.style.transform = "scaleX(" + p.toFixed(4) + ")";
      if (scrollCueRef.current) scrollCueRef.current.style.opacity = p > 0.02 ? "0" : "1";

      const spread = Math.max(0, Math.min(1, p / 0.07));
      const spreadS = spread * spread * (3 - 2 * spread);
      titleSpans.forEach((s, i) => {
        const dir = i - (titleSpans.length - 1) / 2;
        s.style.transform = "translateX(" + (dir * spreadS * 34).toFixed(1) + "px)";
        s.style.opacity = (1 - spreadS).toFixed(3);
      });
    }

    const isDesktop = window.innerWidth > 760;
    let st;

    if (!prefersReducedMotion) {
      st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          state.target = self.progress;
        }
      });
    } else {
      state.target = 0.95;
      wrapRef.current.style.height = "100svh";
    }

    const onMouseMove = (e) => {
      mouse.tx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouse.ty = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };
    if (isDesktop) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    let rafId = 0;
    let t0 = performance.now();

    function renderLoop(now) {
      const time = (now - t0) / 1000;
      state.p += (state.target - state.p) * 0.09;
      if (Math.abs(state.target - state.p) < 0.0004) state.p = state.target;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      const p = state.p;
      // Beam strike owns p ∈ [0, STRIKE]; the convergence is remapped to run
      // over the remaining scroll so nothing fires until the wordmark is lit.
      const pc = p <= STRIKE ? 0 : (p - STRIKE) / (1 - STRIKE);
      strikeUpdate(p >= STRIKE ? 1 : p / STRIKE);
      updateChapters(pc);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';

      // Compute all strand states once per frame
      const states = DIVS.map((_, si) => getState(pc, si, time));
      const ci = coreIntensity(pc);

      // Silk trails: fade the offscreen layer instead of clearing it.
      const scrolling = Math.abs(state.target - state.p) > 0.0008;
      if (prefersReducedMotion) {
        tctx.clearRect(0, 0, W, H);
      } else {
        tctx.globalCompositeOperation = 'destination-out';
        tctx.globalAlpha = 1;
        tctx.fillStyle = scrolling ? 'rgba(0,0,0,0.62)' : 'rgba(0,0,0,0.80)';
        tctx.fillRect(0, 0, W, H);
      }

      // Particles (drawn into the trail layer, beneath blobs and core).
      // Paths bow perpendicular to the travel line — braided silk streams.
      tctx.globalCompositeOperation = 'lighter';
      DIVS.forEach((_, si) => {
        const st = states[si];
        if (st.ptAlpha < 0.01) return;
        const sprite = sprites[si];
        const ddx = st.ptDst.x - st.ptSrc.x, ddy = st.ptDst.y - st.ptSrc.y;
        const dlen = Math.hypot(ddx, ddy) || 1;
        const nX = -ddy / dlen, nY = ddx / dlen;
        particles[si].forEach(pt => {
          pt.t = (pt.t + .0058) % 1;
          const e  = ss(pt.t);
          const mx = mouse.x * W * .032 * (1 - e);
          const my = mouse.y * H * .032 * (1 - e);
          const bow = pt.arc * Math.min(dlen * .16, W * .05) * Math.sin(pt.t * Math.PI);
          const px = st.ptSrc.x + ddx * e + pt.jx * W * .03 * (1 - e) + nX * bow + mx;
          const py = st.ptSrc.y + ddy * e + pt.jy * H * .03 * (1 - e) + nY * bow + my;
          const a  = Math.sin(pt.t * Math.PI) * st.ptAlpha * 0.6;
          const d  = pt.sz * (4.2 + (1 - e) * 1.8) * (W < 760 ? 1.4 : 2.1);
          if (a < 0.005 || px < -d || px > W + d || py < -d || py > H + d) return;
          tctx.globalAlpha = a;
          tctx.drawImage(sprite, px - d / 2, py - d / 2, d, d);
        });
      });
      tctx.globalCompositeOperation = 'source-over';

      // Composite the trail layer, then draw crisp geometry on top.
      ctx.globalAlpha = 1;
      ctx.drawImage(trailCanvas, 0, 0, W, H);

      // Filaments: lit fibers connecting travelling blobs to the core.
      states.forEach((st, si) => {
        const fdx = st.bPos.x - CX, fdy = st.bPos.y - CY;
        const fdist = Math.hypot(fdx, fdy);
        const fa = Math.min(st.ptAlpha * 1.4, st.bAlpha) * cl(fdist / (W * .12)) * 0.22;
        if (fa < 0.02) return;
        const d = DIVS[si];
        const grad = ctx.createLinearGradient(CX, CY, st.bPos.x, st.bPos.y);
        grad.addColorStop(0,  `rgba(${d.r},${d.g},${d.b},0)`);
        grad.addColorStop(.5, `rgba(${d.r},${d.g},${d.b},${fa.toFixed(3)})`);
        grad.addColorStop(1,  `rgba(${d.r},${d.g},${d.b},0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(CX, CY);
        ctx.lineTo(st.bPos.x, st.bPos.y);
        ctx.stroke();
      });

      // Blobs (drawn over particles)
      states.forEach((st, si) => {
        drawBlob(si, st.bPos.x, st.bPos.y, st.bAlpha, time, st.isFocused);
      });

      // Core (always topmost)
      drawCore(ci, time);

      rafId = heroVisible ? requestAnimationFrame(renderLoop) : 0;
    }

    let heroVisible = true;
    const io = new IntersectionObserver(([e]) => {
      heroVisible = e.isIntersecting;
      if (heroVisible && !rafId) rafId = requestAnimationFrame(renderLoop);
    }, { threshold: 0 });
    io.observe(wrapRef.current);

    rafId = requestAnimationFrame(renderLoop);

    const onResize = () => {
      measure();
    };
    window.addEventListener("resize", onResize, { passive: true });

    const handleDotClick = (index) => {
      const ch = chapters[index];
      const mid = ch.a === 0 ? 0 : (ch.a + ch.b) / 2;
      const rect = wrapRef.current.getBoundingClientRect();
      const top = rect.top + window.scrollY + mid * (rect.height - window.innerHeight);
      window.scrollTo({ top, behavior: "smooth" });
    };
    dots.forEach((d, i) => {
      d.addEventListener("click", () => handleDotClick(i));
    });

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      if (st) st.kill();
    };
  }, []);

  return (
    <div ref={wrapRef} className="tsx-hero-runway" style={{ height: '600vh' }}>
      <div className="tsx-hero-stage">
        <canvas ref={canvasRef} className="tsx-hero-canvas" aria-hidden="true" />

        <div className="tsx-hero-chapter" data-from="0" data-to="0.07">
          <p className="tsx-section-eyebrow">Enterprise IT systems</p>
          <h1 ref={titleRef} className="tsx-hero-title tsx-hero-title--strike" aria-label="Nexara">
            <span>N</span><span>E</span><span>X</span><span>A</span><span>R</span><span>A</span>
            <i className="tsx-wordmark-beam" aria-hidden="true"></i>
          </h1>
        </div>

        <div className="tsx-hero-chapter" data-from="0.125" data-to="0.225" aria-hidden="true">
          <p className="tsx-section-eyebrow">The premise</p>
          <h2 className="tsx-section-heading">One core.<br /><span className="serif" style={{ color: '#1D4ED8' }}>Three forces.</span></h2>
          <p className="tsx-sec-body" style={{ maxWidth: '34em', marginInline: 'auto' }}>Every engagement runs through a single operating core — then unravels into three disciplined divisions.</p>
        </div>

        <div className="tsx-hero-chapter ch-left" style={{ '--accent': '#1D4ED8' } as React.CSSProperties} data-from="0.27" data-to="0.45" aria-hidden="true">
          <p className="tsx-panel-idx">01 / DIVISION</p>
          <h2 className="tsx-section-heading" style={{ textAlign: 'left' }}>Academy<br /><span className="serif" style={{ color: '#1D4ED8' }}>the talent engine.</span></h2>
          <p className="tsx-sec-body" style={{ textAlign: 'left' }}>Structured, cohort-based programmes that turn ambitious learners into capable engineers — sprint by sprint, review by review.</p>
          <button className="tsx-btn-cta" onClick={() => routeTo('trust', 'academy')} style={{ marginTop: '20px' }}>Enter Academy →</button>
        </div>

        <div className="tsx-hero-chapter ch-right" style={{ '--accent': '#1E40AF' } as React.CSSProperties} data-from="0.45" data-to="0.63" aria-hidden="true">
          <p className="tsx-panel-idx" style={{ right: 'max(9vw, 150px)', left: 'auto' }}>02 / DIVISION</p>
          <h2 className="tsx-section-heading" style={{ textAlign: 'right' }}>Labs<br /><span className="serif" style={{ color: '#1E40AF' }}>the systems forge.</span></h2>
          <p className="tsx-sec-body" style={{ textAlign: 'right' }}>Applied AI and automation systems, engineered from prototype to production with written specs and weekly demos.</p>
          <button className="tsx-btn-cta" onClick={() => routeTo('trust', 'labs')} style={{ marginTop: '20px' }}>Enter Labs →</button>
        </div>

        <div className="tsx-hero-chapter ch-left" style={{ '--accent': '#5B6472' } as React.CSSProperties} data-from="0.63" data-to="0.81" aria-hidden="true">
          <p className="tsx-panel-idx">03 / DIVISION</p>
          <h2 className="tsx-section-heading" style={{ textAlign: 'left' }}>Digital<br /><span className="serif" style={{ color: '#5B6472' }}>the growth signal.</span></h2>
          <p className="tsx-sec-body" style={{ textAlign: 'left' }}>Brand systems, web experiences and performance creative — built like software, measured like engineering.</p>
          <button className="tsx-btn-cta" onClick={() => routeTo('trust', 'marketing')} style={{ marginTop: '20px' }}>Enter Marketing →</button>
        </div>

        <div className="tsx-hero-chapter" data-from="0.86" data-to="1" aria-hidden="true">
          <p className="tsx-section-eyebrow">The weave</p>
          <h2 className="tsx-section-heading">Three disciplines.<br /><span className="serif" style={{ color: '#1D4ED8' }}>One standard.</span></h2>
          <div className="tsx-sec-actions" style={{ display: 'flex', gap: '16px', marginTop: '24px', justifyContent: 'center' }}>
            <button className="tsx-btn-cta" onClick={() => routeTo('trust', 'contact')}>Start a request <span className="arr">→</span></button>
            <button className="tsx-sec-btn-ghost" onClick={() => {
              const el = document.getElementById("divisions");
              el?.scrollIntoView({ behavior: "smooth" });
            }}>Explore divisions</button>
          </div>
        </div>

        {/* HUD */}
        <div className="tsx-hero-rail" aria-hidden="true">
          <button data-label="Nexara"></button>
          <button data-label="Premise"></button>
          <button data-label="Academy"></button>
          <button data-label="Labs"></button>
          <button data-label="Marketing"></button>
          <button data-label="Begin"></button>
        </div>
        <div className="tsx-hero-counter" aria-hidden="true">
          <strong ref={counterNumRef}>01</strong> / 06
          <span className="tsx-counter-bar"><i ref={counterBarRef}></i></span>
        </div>
        <div ref={scrollCueRef} className="tsx-scroll-cue" aria-hidden="true">Scroll<i></i></div>
      </div>
    </div>
  );
}
