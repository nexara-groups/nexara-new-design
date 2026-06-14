import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, TrendingUp, Cpu, Shield, Mail } from 'lucide-react';
import { DATA } from './data.js';
import { voice, parseRoute, routeTo, useBriefForm, STATIC_PAGES, HAS_SCROLL_ANIMATION, SECTION_HERO_WORDS } from './shared.js';
import { NotFound } from './notfound.jsx';

function CyclingWord({ words }) {
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

const TRUST_NAV_ICONS = {
  academy:   <GraduationCap size={13} strokeWidth={2} />,
  marketing: <TrendingUp    size={13} strokeWidth={2} />,
  labs:      <Cpu           size={13} strokeWidth={2} />,
  customers: <Shield        size={13} strokeWidth={2} />,
  contact:   <Mail          size={13} strokeWidth={2} />,
};
const { useState, useMemo, useEffect, useRef, useCallback, useLayoutEffect, useReducer } = React;
/* ═══════════════════════════════════════════════════════════════════
   TRUSTSITE — DEDICATED CORPORATE COMPONENT TREE
   ═══════════════════════════════════════════════════════════════════ */

function setupTsxFade() {
  document.documentElement.classList.add('js-reveal-ready');
  const els = document.querySelectorAll('.tsx-fade:not(.visible), .tsx-dimline:not(.visible)');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return () => document.documentElement.classList.remove('js-reveal-ready');
  }
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.15 }
  );
  els.forEach(el => obs.observe(el));
  const revealFallback = window.setTimeout(() => {
    els.forEach(el => el.classList.add('visible'));
  }, 900);
  return () => {
    window.clearTimeout(revealFallback);
    obs.disconnect();
    document.documentElement.classList.remove('js-reveal-ready');
  };
}

/* Blueprint Ledger — divisions share one structural blueprint accent; they
   differ by plate numeral + serif tagline, not hue. Vermilion is the rare highlight. */
const TRUST_ACCENT = { academy: '#1A6DFF', marketing: '#1A6DFF', labs: '#1A6DFF' };
const TRUST_VERMILION = '#1A6DFF';

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

function TrustHeroParticles({ variant = 'parent' }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className={`tsx-hero-particles tsx-hero-particles-${variant}`} aria-hidden="true">
      {TRUST_HERO_PARTICLES.map((p, i) => (
        <motion.span
          key={`${variant}-${i}`}
          className="tsx-hero-particle"
          style={{ '--x': `${p.x}%`, '--y': `${p.y}%`, '--s': `${p.s}px` }}
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

function TrustHeroEnergyLoop({ sectionId = 'academy', targetRef }) {
  const reduceMotion = useReducedMotion();
  const sectionNumber = sectionId === 'academy' ? '01' : sectionId === 'marketing' ? '02' : '03';
  const loopRef = React.useRef(null);
  const threadRef = React.useRef(null);
  const cometRef = React.useRef(null);
  const digitRef = React.useRef(null);
  const reflectionRef = React.useRef(null);

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

const TRUST_OPERATING_STANDARD = [
  { title: 'Written before built', body: "Every engagement starts with a written brief and scope. If it isn't written down, it isn't agreed." },
  { title: 'Demo every week', body: 'Working software, live cohorts, running campaigns — shown weekly, not described in decks.' },
  { title: 'One accountable lead', body: 'Every cohort, system and campaign has a single named owner from kickoff to handover.' },
  { title: 'Handover by design', body: 'Documentation, access and training are part of the deliverable — never an afterthought.' },
];

/* Run-log content (Neo terminal → light command ledger). [class,text] pairs per line:
   p=prompt(blueprint) k=command(ink) c=output(muted) s=success(vermilion) */
const TRUST_RUNLOG = {
  academy: {
    label: 'RUN LOG · career.sh',
    lines: [
      ['p', 'nexara@academy:~$ ', 'k', 'init career --track=engineering'],
      ['c', '  resolving curriculum graph...'],
      ['c', '  [1/4] foundations        ', 's', '✓ systems · networks · git'],
      ['c', '  [2/4] core engineering   ', 's', '✓ apis · databases · cloud'],
      ['c', '  [3/4] specialisation     ', 's', '✓ ai/ml · security · devops'],
      ['c', '  [4/4] industry residency ', 's', '✓ 12-week placement sprint'],
      ['p', 'nexara@academy:~$ ', 'k', 'run graduate --mode=hired'],
      ['s', '  → portfolio shipped before the résumé. offer received.'],
      ['p', 'nexara@academy:~$ '],
    ],
  },
  labs: {
    label: 'RUN LOG · deploy.sh',
    lines: [
      ['p', 'nexara@labs:~$ ', 'k', 'deploy system --env=production'],
      ['c', '  building pipeline...'],
      ['c', '  [1/4] discovery          ', 's', '✓ workflow mapped · specs written'],
      ['c', '  [2/4] prototype          ', 's', '✓ evals green · guardrails set'],
      ['c', '  [3/4] hardening          ', 's', '✓ observability · access controls'],
      ['c', '  [4/4] handover           ', 's', '✓ docs · training · ownership'],
      ['p', 'nexara@labs:~$ ', 'k', 'status --uptime'],
      ['s', '  → live. measured, governed, owned.'],
      ['p', 'nexara@labs:~$ '],
    ],
  },
};

function TrustRunLog({ config }) {
  const ref = React.useRef(null);
  const { lines, label } = config;
  const total = React.useMemo(
    () => lines.reduce((n, parts) => { let s = 0; for (let i = 1; i < parts.length; i += 2) s += (parts[i] || '').length; return n + s; }, 0),
    [lines]
  );
  const [typed, setTyped] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { setTyped(total); return; }
    let timer = 0, started = false;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          obs.disconnect();
          timer = window.setInterval(() => {
            setTyped((t) => { if (t >= total) { window.clearInterval(timer); return t; } return t + 2; });
          }, 16);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => { obs.disconnect(); if (timer) window.clearInterval(timer); };
  }, [total]);

  // Pre-compute visible char count per line + find the active (caret) line.
  let consumed = 0;
  const perLine = lines.map((parts) => {
    const segs = [];
    let lineShown = 0;
    for (let i = 0; i < parts.length; i += 2) {
      const cls = parts[i]; const text = parts[i + 1] || '';
      const start = consumed; consumed += text.length;
      const shown = Math.max(0, Math.min(text.length, typed - start));
      lineShown += shown;
      if (shown > 0) segs.push(<span className={'tsx-rl-' + cls} key={i}>{text.slice(0, shown)}</span>);
    }
    return { segs, lineShown };
  });
  let caretLine = -1;
  for (let i = perLine.length - 1; i >= 0; i--) { if (perLine[i].lineShown > 0) { caretLine = i; break; } }
  return (
    <div className="tsx-runlog tsx-fade" ref={ref} role="img" aria-label="Programme run log">
      <div className="tsx-runlog-bar"><span className="tsx-runlog-label">{label}</span></div>
      <div className="tsx-runlog-body">
        {perLine.map(({ segs }, li) => (
          <div className="tsx-rl-line" key={li}>{segs}{li === caretLine ? <span className="tsx-runlog-caret" /> : null}</div>
        ))}
      </div>
    </div>
  );
}

/* ─── Shared Blueprint-Ledger primitives (kill repeated text boxes) ─── */

function TrustIntakeBand({ heading, sub, cta = 'Start a Project', onClick, spaced }) {
  return (
    <div className={"tsx-intake-band tsx-intake-band--plate tsx-fade" + (spaced ? " tsx-intake-spaced" : "")}>
      <div className="tsx-intake-copy">
        <span className="tsx-intake-tick" aria-hidden="true" />
        <p className="tsx-intake-heading">{heading}</p>
        {sub && <p className="tsx-intake-sub">{sub}</p>}
      </div>
      {cta && <button className="tsx-btn-cta" onClick={onClick || (() => routeTo('trust', 'contact'))}>{cta}</button>}
    </div>
  );
}

function TrustLedgerTable({ columns, rows, label }) {
  const tpl = '46px ' + columns.map((_, i) => (i === 0 ? '1.1fr' : '1.6fr')).join(' ');
  return (
    <div className="tsx-ledger" role="table" aria-label={label || 'Ledger'}>
      <div className="tsx-ledger-head" role="row" style={{ gridTemplateColumns: tpl }}>
        <span className="tsx-ledger-rownum" aria-hidden="true" />
        {columns.map((c) => <span className="tsx-ledger-h" role="columnheader" key={c}>{c}</span>)}
      </div>
      {rows.map((cells, i) => (
        <div className={`tsx-ledger-row tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} role="row" key={i} style={{ gridTemplateColumns: tpl }}>
          <span className="tsx-ledger-rownum" aria-hidden="true">/{String(i + 1).padStart(2, '0')}</span>
          {cells.map((cell, j) => (
            <span className={"tsx-ledger-cell" + (j === 0 ? " tsx-ledger-lead" : "")} role="cell" key={j}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function TrustLedgerRows({ items, titleKey = 'title', bodyKey = 'body', framed, numerals = true, label }) {
  const body = (
    <div className="tsx-ledger-rows" role="list">
      {items.map((it, i) => (
        <div className={`tsx-ledger-rowitem tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} role="listitem" key={(it[titleKey] || i) + ''}>
          {numerals && <span className="tsx-ledger-rownum" aria-hidden="true">/{String(i + 1).padStart(2, '0')}</span>}
          <span className="tsx-ledger-rowtitle">{it[titleKey]}</span>
          <span className="tsx-ledger-rowdesc">{it[bodyKey]}</span>
        </div>
      ))}
    </div>
  );
  if (framed) return (
    <div className="tsx-ledger-plate">
      {label && <span className="tsx-ledger-plate-label">{label}</span>}
      {body}
    </div>
  );
  return body;
}

function useTrustReveal(threshold = 0.3) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { setShown(true); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } });
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
}

function TrustSignalLine() {
  const [ref, drawn] = useTrustReveal(0.3);
  return (
    <div className={"tsx-signal" + (drawn ? " is-drawn" : "")} ref={ref}>
      <div className="tsx-dimline" data-label="Signal" aria-hidden="true" />
      <svg className="tsx-signal-svg" viewBox="0 0 1200 200" aria-hidden="true">
        <path className="tsx-signal-guide" d="M0,100 H1200" vectorEffect="non-scaling-stroke" />
        <path className="tsx-signal-guide tsx-signal-guide2" d="M0,150 H1200" vectorEffect="non-scaling-stroke" />
        <path className="tsx-signal-wave" vectorEffect="non-scaling-stroke"
          d="M0,100 C110,100 150,38 230,40 C320,42 360,168 470,150 C590,131 650,24 770,58 C880,89 960,156 1060,120 C1130,96 1170,92 1200,96" />
      </svg>
      <p className="tsx-signal-caption">Attention is a signal. <em>We tune it.</em></p>
    </div>
  );
}

function TrustUnboxAssembly() {
  const copy = DATA.unbox.trust;
  const faces = DATA.unbox.faces;
  const [ref, drawn] = useTrustReveal(0.25);
  return (
    <section className="tsx-unbox tsx-section-inner" ref={ref} aria-label={copy.eyebrow}>
      <div className="tsx-signature-head tsx-fade">
        <p className="tsx-section-eyebrow">{copy.eyebrow}</p>
        <h2 className="tsx-section-heading">One operating core.<br /><span className="serif">Six capabilities.</span></h2>
      </div>
      <div className={"tsx-unbox-assembly" + (drawn ? " is-drawn" : "")}>
        <div className="tsx-unbox-core" aria-hidden="true">{copy.sequence}</div>
        <div className="tsx-unbox-stem" aria-hidden="true" />
        <div className="tsx-unbox-grid">
          {faces.map((f, i) => (
            <button className="tsx-unbox-face tsx-fade" style={{ transitionDelay: (i * 70) + 'ms' }} onClick={() => routeTo('trust', f.section)} key={f.label}>
              <span className="tsx-unbox-num" aria-hidden="true">/{String(i + 1).padStart(2, '0')}</span>
              <span className="tsx-unbox-label">{f.label}</span>
              <span className="tsx-unbox-sub">{f.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustParticleCanvas() {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const BG = '#081726', LINE = 'rgba(91,157,255,', DOT = 'rgba(91,157,255,1)';
    const MAX_DIST = 160, N = 320;
    let W, H, particles, raf;
    
    // Mouse proximity tracking state
    const mouse = { x: null, y: null };

    function Particle() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.28; this.vy = (Math.random() - 0.5) * 0.28;
      this.r = Math.random() * 1.4 + 0.4;
    }
    Particle.prototype.update = function() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -4) this.x = W + 4; if (this.x > W + 4) this.x = -4;
      if (this.y < -4) this.y = H + 4; if (this.y > H + 4) this.y = -4;
    };
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    }
    function init() { resize(); particles = Array.from({ length: N }, () => new Particle()); }
    function draw() {
      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx*dx + dy*dy;
          if (d2 > MAX_DIST * MAX_DIST) continue;
          const alpha = (1 - Math.sqrt(d2) / MAX_DIST) * 0.28;
          ctx.strokeStyle = LINE + alpha + ')'; ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      
      // Interactive cursor constellation lines
      if (mouse.x !== null && mouse.y !== null) {
        ctx.fillStyle = 'rgba(147, 197, 253, 0.04)';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx*dx + dy*dy;
          if (d2 < 120 * 120) {
            const alpha = (1 - Math.sqrt(d2) / 120) * 0.38;
            ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      }

      ctx.fillStyle = DOT;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]; p.update();
        ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = canvasVisible ? requestAnimationFrame(draw) : 0;
    }

    let canvasVisible = true;
    const visObs = new IntersectionObserver(([e]) => {
      canvasVisible = e.isIntersecting;
      if (canvasVisible && !raf) { raf = requestAnimationFrame(draw); }
    }, { threshold: 0 });
    visObs.observe(canvas);
    const onVisChange = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (canvasVisible) { raf = requestAnimationFrame(draw); }
    };
    document.addEventListener('visibilitychange', onVisChange);

    // Mouse event handlers
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    init(); draw();
    
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    let rt;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { cancelAnimationFrame(raf); init(); draw(); }, 120); };
    window.addEventListener('resize', onResize);
    
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      visObs.disconnect();
      document.removeEventListener('visibilitychange', onVisChange);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);
  return <canvas ref={canvasRef} className="tsx-hero-canvas" aria-hidden="true" />;
}

function getTrustNavLabel(item) {
  return item.trustLabel || item.label;
}

function getTrustSectionLabel(section) {
  const navItem = DATA.nav.find(item => item.page === section.id);
  return navItem ? getTrustNavLabel(navItem) : section.name;
}

function getTrustSubpageLabel(section, page) {
  const labels = {
    academy: {
      tracks: "Role Tracks",
      internships: "Internship Operations",
      placements: "Placement Operations",
    },
    marketing: {
      brand: "Brand Systems",
      web: "Web Platforms",
      growth: "Growth Operations",
    },
    labs: {
      products: "System Patterns",
      "ai-builds": "Custom AI Builds",
      security: "Governance & Security",
    },
  };
  return labels[section.id]?.[page.slug] || page.title;
}

function TrustNav({ page, detail }) {
  const navRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [hoveredPage, setHoveredPage] = React.useState(null);
  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  React.useEffect(() => { setMenuOpen(false); }, [page, detail]);
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);
  return (
    <header className="tsx-nav" ref={navRef} role="banner">
      <div className="tsx-nav-inner">
        <button className="tsx-logo" onClick={() => routeTo('trust', 'home')} aria-label="Nexara home">
          Nexara
        </button>
        <nav aria-label="Primary">
          <ul className="tsx-nav-links tsx-tubelight" onMouseLeave={() => setHoveredPage(null)}>
            {DATA.nav.map(item => {
              const active = page === item.page;
              const glowing = hoveredPage ? hoveredPage === item.page : active;
              return (
                <li key={item.page}>
                  <button
                    className={`tsx-tubelight-btn${active ? ' active' : ''}${!active && hoveredPage === item.page ? ' hovered' : ''}`}
                    onClick={() => routeTo('trust', item.page)}
                    onMouseEnter={() => setHoveredPage(item.page)}
                  >
                    {glowing && (
                      <span className={`tsx-tubelight-glow${!active && hoveredPage === item.page ? ' tsx-tubelight-glow--hover' : ''}`} aria-hidden="true">
                        <span className="tsx-tubelight-bar" />
                        <span className="tsx-tubelight-blur1" />
                        <span className="tsx-tubelight-blur2" />
                        <span className="tsx-tubelight-blur3" />
                      </span>
                    )}
                    <span className="tsx-tubelight-icon">{TRUST_NAV_ICONS[item.page]}</span>
                    {getTrustNavLabel(item)}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="tsx-nav-right">
          <div className="theme-pill tsx-theme-pill" role="group" aria-label="Theme mode">
            <button type="button" onClick={() => routeTo('neo', page, detail)}>Neo</button>
            <button type="button" className="active" onClick={() => routeTo('trust', page, detail)}>Trust</button>
          </div>
          <button className="tsx-nav-cta" onClick={() => routeTo('trust', 'contact')}>Talk to us <span aria-hidden="true">→</span></button>
          <button className="tsx-nav-burger" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(o => !o)}>
            <span className={"tsx-burger-icon" + (menuOpen ? ' is-open' : '')}><i /><i /></span>
          </button>
        </div>
      </div>
      <div className={"tsx-nav-sheet" + (menuOpen ? ' is-open' : '')} role="dialog" aria-label="Menu" aria-hidden={!menuOpen}>
        <nav className="tsx-nav-sheet-links" aria-label="Primary mobile">
          {DATA.nav.map((item, i) => (
            <button key={item.page} className={page === item.page ? 'active' : ''} style={{ transitionDelay: (i * 35) + 'ms' }} onClick={() => routeTo('trust', item.page)}>
              <span className="tsx-nav-sheet-num">/{String(i + 1).padStart(2, '0')}</span>
              {getTrustNavLabel(item)}
            </button>
          ))}
        </nav>
        <button className="tsx-btn-cta tsx-nav-sheet-cta" onClick={() => routeTo('trust', 'contact')}>Start a Project <span className="arr">→</span></button>
      </div>
    </header>
  );
}

function TrustHeroFlat() {
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

function TrustCountUp({ value, className }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = parseInt(String(value).replace(/\D/g, ''), 10);
    const suffix = String(value).replace(/[0-9]/g, '');
    if (!target || !('IntersectionObserver' in window)) { el.textContent = value; return; }
    let done = false, tickId = 0;
    const run = () => {
      const t0 = performance.now(), dur = 1100;
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) tickId = requestAnimationFrame(tick);
      };
      tickId = requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting && !done) { done = true; run(); obs.disconnect(); } });
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(tickId); };
  }, [value]);
  return <span ref={ref} className={className}>{value}</span>;
}

function TrustProofStrip() {
  const stats = [
    { num: '3', label: 'Solution Lines',       accent: false },
    { num: '9', label: 'Capability Modules',   accent: false },
    { num: '4', label: 'Delivery Standards',   accent: true  },
    { num: '3', label: 'Engagement Packages', accent: false },
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

const TSX_FEATURES = [
  {
    title: 'Scope-driven delivery',
    desc: 'Every engagement starts with a scoped project plan. No open-ended retainers without defined deliverables and success criteria.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  },
  {
    title: 'Cohort-based execution',
    desc: 'Academy programmes run in structured cohorts — visible cadence, weekly checkpoints, and measurable completion at every stage.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  },
  {
    title: 'Stack-specific builds',
    desc: 'Labs systems are scoped to your actual workflow, data sources, and operational constraints — not generic AI templates.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    title: 'Integrated across services',
    desc: 'Academy, Marketing, and Labs share one operating model — one accountable partner for talent, presence, and systems.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
];

function TrustSolutionsGrid() {
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

function TrustFeatureStrip() {
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

function TrustEnterpriseStacks() {
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

function TrustMarketContext() {
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

function TrustFooter() {
  const solutionLinks = DATA.nav.slice(0, 3).map(item => ({ text: getTrustNavLabel(item), page: item.page }));
  const moduleLinks = Object.values(DATA.sections).map(section => ({
    text: getTrustSectionLabel(section), page: section.id,
  }));
  const cols = [
    { label: 'Solutions', links: solutionLinks },
    { label: 'Modules', links: moduleLinks },
    { label: 'Company', links: [{ text: 'Delivery Proof', page: 'customers' }, { text: 'About Nexara', page: 'company' }, { text: 'Enterprise Enquiry', page: 'contact' }] },
  ];
  return (
    <footer className="tsx-footer" role="contentinfo">
      <div className="tsx-footer-top">
        <div>
          <button className="tsx-logo" onClick={() => routeTo('trust', 'home')} aria-label="Nexara home">
            Nexara
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
        <p className="tsx-footer-copyright">© 2026 Nexara. All rights reserved.</p>
      </div>
    </footer>
  );
}

function TrustHeroUnravel() {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const counterNumRef = React.useRef(null);
  const counterBarRef = React.useRef(null);
  const scrollCueRef = React.useRef(null);
  
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
        { x: CX,      y: H * .86 },
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
      ctx.globalAlpha = 1;
    }

    let W = 0, H = 0, CX = 0, CY = 0, SCALE = 1;

    function measure() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

      // Particles (drawn first — beneath blobs and core)
      ctx.globalCompositeOperation = 'lighter';
      DIVS.forEach((_, si) => {
        const st = states[si];
        if (st.ptAlpha < 0.01) return;
        const sprite = sprites[si];
        particles[si].forEach(pt => {
          pt.t = (pt.t + .0058) % 1;
          const e  = ss(pt.t);
          const mx = mouse.x * W * .032 * (1 - e);
          const my = mouse.y * H * .032 * (1 - e);
          const px = st.ptSrc.x + (st.ptDst.x - st.ptSrc.x) * e + pt.jx * W * .03 * (1 - e) + mx;
          const py = st.ptSrc.y + (st.ptDst.y - st.ptSrc.y) * e + pt.jy * H * .03 * (1 - e) + my;
          const a  = Math.sin(pt.t * Math.PI) * st.ptAlpha;
          const d  = pt.sz * (5.5 + (1 - e) * 2.5) * (W < 760 ? 1.8 : 2.8);
          if (a < 0.005 || px < -d || px > W + d || py < -d || py > H + d) return;
          ctx.globalAlpha = a;
          ctx.drawImage(sprite, px - d / 2, py - d / 2, d, d);
        });
      });
      ctx.globalCompositeOperation = 'source-over';

      ctx.globalAlpha = 1;

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

        <div className="tsx-hero-chapter ch-left" style={{ '--accent': '#1D4ED8' }} data-from="0.27" data-to="0.45" aria-hidden="true">
          <p className="tsx-panel-idx">01 / DIVISION</p>
          <h2 className="tsx-section-heading" style={{ textAlign: 'left' }}>Academy<br /><span className="serif" style={{ color: '#1D4ED8' }}>the talent engine.</span></h2>
          <p className="tsx-sec-body" style={{ textAlign: 'left' }}>Structured, cohort-based programmes that turn ambitious learners into capable engineers — sprint by sprint, review by review.</p>
          <button className="tsx-btn-cta" onClick={() => routeTo('trust', 'academy')} style={{ marginTop: '20px' }}>Enter Academy →</button>
        </div>

        <div className="tsx-hero-chapter ch-right" style={{ '--accent': '#1E40AF' }} data-from="0.45" data-to="0.63" aria-hidden="true">
          <p className="tsx-panel-idx" style={{ right: 'clamp(24px, 9vw, 140px)', left: 'auto' }}>02 / DIVISION</p>
          <h2 className="tsx-section-heading" style={{ textAlign: 'right' }}>Labs<br /><span className="serif" style={{ color: '#1E40AF' }}>the systems forge.</span></h2>
          <p className="tsx-sec-body" style={{ textAlign: 'right' }}>Applied AI and automation systems, engineered from prototype to production with written specs and weekly demos.</p>
          <button className="tsx-btn-cta" onClick={() => routeTo('trust', 'labs')} style={{ marginTop: '20px' }}>Enter Labs →</button>
        </div>

        <div className="tsx-hero-chapter ch-left" style={{ '--accent': '#5B6472' }} data-from="0.63" data-to="0.81" aria-hidden="true">
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

function TrustManifesto() {
  const wrapRef = React.useRef(null);
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const textEl = el.querySelector(".tsx-manifesto-text");
    if (!textEl) return;
    const text = textEl.textContent.trim();
    const words = text.split(/\s+/);
    textEl.innerHTML = words.map(w => {
      let isAccent = false;
      let cClass = "";
      const lower = w.toLowerCase();
      if (lower.includes("talent") || lower.includes("people") || lower.includes("academy")) { isAccent = true; cClass = "accent"; }
      else if (lower.includes("intelligent") || lower.includes("systems") || lower.includes("labs") || lower.includes("automation")) { isAccent = true; cClass = "accent"; }
      else if (lower.includes("brands") || lower.includes("move") || lower.includes("marketing") || lower.includes("growth")) { isAccent = true; cClass = "accent"; }
      return "<span class=\"w " + (isAccent ? "accent " + cClass : "") + "\">" + w + "</span>";
    }).join(" ");

    const spanElements = textEl.querySelectorAll(".w");
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 72%",
      end: "bottom 34%",
      scrub: true,
      onUpdate: (self) => {
        const lit = Math.floor(self.progress * (spanElements.length + 2));
        spanElements.forEach((span, i) => {
          span.classList.toggle("on", i < lit);
        });
      }
    });
    return () => st.kill();
  }, []);

  return (
    <section className="tsx-manifesto" ref={wrapRef}>
      <div className="tsx-section-inner">
        <p className="tsx-section-eyebrow">Why Nexara</p>
        <p className="tsx-manifesto-text">
          We are one engineering company that grows talent, builds intelligent systems, and secures market growth — one standard, three disciplines, zero shortcuts.
        </p>
      </div>
    </section>
  );
}

function TrustDivisionsRail() {
  const wrapRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const progressRef = React.useRef(null);
  const tickRef = React.useRef(null);

  React.useEffect(() => {
    if (!wrapRef.current || !trackRef.current) return;
    const track = trackRef.current;
    const wrap = wrapRef.current;

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const max = Math.max(0, track.scrollWidth - window.innerWidth);
        track.style.transform = "translateX(" + (-max * self.progress) + "px)";
        if (progressRef.current) {
          const n = Math.min(3, 1 + Math.floor(self.progress * 2.99));
          progressRef.current.textContent = "0" + n;
        }
        if (tickRef.current) {
          tickRef.current.style.transform = `translate(calc(${(self.progress * 100)}% - 50%), -50%)`;
        }
      }
    });

    return () => st.kill();
  }, []);

  const sections = Object.values(DATA.sections);
  const ACCENT = TRUST_ACCENT;
  const TAGLINE = { academy: 'the talent engine.', marketing: 'the growth signal.', labs: 'the build studio.' };

  return (
    <section className="tsx-rail-wrap" id="divisions" ref={wrapRef}>
      <div className="tsx-rail-stage">
        <div className="rail-head">
          <div>
            <p className="tsx-section-eyebrow">The divisions</p>
            <h2 className="tsx-section-heading">Choose your force.</h2>
          </div>
          <p className="rail-progress"><b ref={progressRef}>01</b> / 03</p>
        </div>
        <div className="tsx-rail-baseline" aria-hidden="true"><span className="tsx-rail-tick" ref={tickRef} /></div>
        <div className="tsx-rail-track" ref={trackRef}>
          {sections.map((sec, i) => {
            const accent = ACCENT[sec.id] || '#1D4ED8';
            const modules = (sec.modules || []).slice(0, 4);
            return (
              <article key={sec.id} className="tsx-rail-panel" style={{ '--accent': accent }}>
                <span className="tsx-panel-watermark" aria-hidden="true">0{i + 1}</span>
                <span className="tsx-panel-ring" aria-hidden="true" />
                <div className="tsx-panel-head">
                  <span className="tsx-panel-idx">0{i + 1} / {getTrustSectionLabel(sec).toUpperCase()}</span>
                  <h3>{getTrustSectionLabel(sec)}<br /><span className="serif">{sec.headline || TAGLINE[sec.id]}</span></h3>
                  <p>{sec.short.trust || sec.desc}</p>
                </div>
                <div className="tsx-panel-modules" role="list" aria-label={getTrustSectionLabel(sec) + ' modules'}>
                  {modules.map((m, mi) => (
                    <div className="tsx-panel-module" role="listitem" key={m.title}>
                      <span className="tsx-panel-module-num">0{mi + 1}</span>
                      <span className="tsx-panel-module-title">{m.title}</span>
                      <span className="tsx-panel-module-desc">{m.trust}</span>
                    </div>
                  ))}
                </div>
                <div className="tsx-panel-foot">
                  <span className="panel-tags">
                    {sec.stack.slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}
                  </span>
                  <button className="tsx-panel-cta" onClick={() => routeTo('trust', sec.id)}>
                    Enter {getTrustSectionLabel(sec)} <span className="arr">→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrustFinalCTA() {
  return (
    <section className="tsx-final-cta">
      <p className="tsx-section-eyebrow">Enterprise intake</p>
      <a href="#contact" onClick={(e) => { e.preventDefault(); routeTo('trust', 'contact'); }}>Start <em>the request.</em></a>
      <p>Scoped response within two working days.</p>
      <button className="tsx-btn-cta tsx-final-cta-btn" onClick={() => routeTo('trust', 'contact')}>Start a Project <span className="arr">→</span></button>
    </section>
  );
}

function TrustHome() {
  return (
    <main>
      {!HAS_SCROLL_ANIMATION ? (
        <>
          {/* Problem / Premise */}
          <TrustHeroFlat />
          {/* Three forces, equal weight */}
          <TrustSolutionsGrid />
          {/* Proof — combined plays interlock */}
          <TrustEnterpriseStacks />
          {/* Outcome — governed capability in figures */}
          <TrustProofStrip />
          <TrustMarketContext />
          {/* Invitation */}
          <TrustFinalCTA />
        </>
      ) : (
        <>
          {/* Problem → Premise → Three forces → weave (one continuous scroll) */}
          <TrustHeroUnravel />
          {/* Premise — the standard, before any numbers */}
          <TrustManifesto />
          {/* Three forces, equal weight */}
          <TrustDivisionsRail />
          {/* Mechanism — the shared spine every division runs on */}
          <section className="tsx-section-inner" style={{ paddingBlock: 'clamp(60px, 10vh, 120px)' }}>
            <div className="tsx-dimline" data-label="Sheet 04 · Standard" aria-hidden="true" />
            <div className="tsx-standard-head" style={{ marginBottom: '40px', marginTop: 'clamp(40px,6vw,72px)' }}>
              <p className="tsx-section-eyebrow">The operating standard</p>
              <h2 className="tsx-section-heading">Every division runs<br />on the same <span className="serif">spine.</span></h2>
            </div>
            <TrustLedgerRows framed label="§ Operating standard" items={TRUST_OPERATING_STANDARD} titleKey="title" bodyKey="body" />
          </section>
          {/* Proof — the three forces interlock into combined plays */}
          <TrustEnterpriseStacks />
          {/* Outcome — governed capability in figures */}
          <TrustProofStrip />
          <TrustMarketContext />
          {/* Invitation */}
          <TrustFinalCTA />
        </>
      )}
    </main>
  );
}

/* ─── TrustSectionPage — enterprise IT layout ──────────────────── */

function TrustSectionHeader({ section }) {
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
            <button className="tsx-sec-btn-ghost" onClick={() => routeTo('trust', section.id, section.subpages[0].slug)}>{copy.secondary}</button>
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

function TrustFaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = React.useState(null);
  return (
    <div className="tsx-faq-acc">
      {faqs.map(([q, a], i) => {
        const isOpen = openIndex === i;
        return (
          <div className={`tsx-faq-item${isOpen ? ' open' : ''}`} key={i}>
            <button
              className="tsx-faq-trigger"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="tsx-faq-counter">{String(i + 1).padStart(2, '0')}</span>
              <span className="tsx-faq-q">{q}</span>
              <span className="tsx-faq-indicator" aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="tsx-faq-panel">
                <p className="tsx-faq-a">{a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TrustProofCards({ items }) {
  return (
    <div className="tsx-proof-cards-grid">
      {items.map((p, i) => (
        <article className={`tsx-proof-case-card tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} key={p.name}>
          <span className="tsx-proof-case-idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <div className="tsx-proof-case-content">
            <div className="tsx-proof-case-top">
              <span className="tsx-proof-case-org">{p.org}</span>
            </div>
            <p className="tsx-proof-case-headline">{p.name}</p>
            <div className="tsx-proof-case-divider" aria-hidden="true" />
            <div className="tsx-proof-case-outcome">
              <span className="tsx-proof-case-label">What held up</span>
              <p className="tsx-proof-case-body"><span className="tsx-proof-tick" aria-hidden="true" />{p.result.trust}</p>
            </div>
          </div>
          <div className="tsx-proof-case-foot">
            <span className="tsx-proof-case-verified" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8.2l3 3L14 3"/></svg>
              Verified delivery
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

/* Legacy alias so any future callers still work */
function TrustProofStrips({ items }) { return <TrustProofCards items={items} />; }

/* ─── Academy Display Cards (21st.dev Display Cards adapted for JSX) ─── */
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

function AcademyDisplayCard({ pkg, index, isActive, onEnter }) {
  const icon = ACADEMY_PKG_ICONS[index] || ACADEMY_PKG_ICONS[0];
  const featured = index === 1;
  const pos = CARD_POSITIONS[index] || CARD_POSITIONS[0];

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
              ? '0 16px 44px rgba(26,109,255,0.18), 0 2px 8px rgba(0,0,0,0.07)'
              : '0 10px 32px rgba(0,0,0,0.13)')
          : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'transform 0.32s cubic-bezier(.22,1,.36,1), opacity 0.22s ease, filter 0.22s ease, box-shadow 0.22s ease',
        cursor: 'default',
      }}
      className={[
        'flex select-none flex-col rounded-2xl border-2 bg-white px-5 py-4',
        isActive
          ? (featured ? 'border-[#1A6DFF]' : 'border-slate-300')
          : (featured ? 'border-[#1A6DFF]/40' : 'border-slate-200'),
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
            <svg viewBox="0 0 16 16" className="w-3 h-3 text-[#1A6DFF] shrink-0 mt-px" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8.5l3 3 7-7"/>
            </svg>
            {item}
          </li>
        ))}
      </ul>
      <button
        className={`mt-4 w-full py-2 rounded-lg text-xs font-semibold transition-colors ${
          featured
            ? 'bg-[#1A6DFF] text-white hover:bg-[#1551C9]'
            : 'border border-slate-200 text-slate-600 hover:border-[#1A6DFF] hover:text-[#1A6DFF]'
        }`}
        onClick={() => routeTo('trust', 'contact')}
      >
        {featured ? 'Start here →' : 'Get in touch'}
      </button>
    </div>
  );
}

function AcademyDisplayCards({ packages }) {
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

const PKG_THEMES = [
  { head: 'tsx-pkg-head-dark',  badge: null },
  { head: 'tsx-pkg-head-navy',  badge: 'Most Common' },
  { head: 'tsx-pkg-head-dark',  badge: null },
];

function TrustPackageCards({ packages }) {
  return (
    <div className="tsx-pkg-grid">
      {packages.map((pkg, i) => {
        const theme = PKG_THEMES[i] || PKG_THEMES[0];
        const featured = i === 1;
        return (
          <div className={`tsx-pkg-card${featured ? ' featured' : ''}`} key={pkg.name}>
            <div className={`tsx-pkg-head ${theme.head}`}>
              {theme.badge && <span className="tsx-pkg-badge">{theme.badge}</span>}
              <span className="tsx-pkg-fit">{pkg.fit}</span>
              <p className="tsx-pkg-name">{pkg.name}</p>
              <span className="tsx-pkg-duration">{pkg.duration}</span>
            </div>
            <div className="tsx-pkg-body">
              <ul className="tsx-pkg-list">
                {pkg.includes.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="tsx-pkg-foot">
              <button className={featured ? 'tsx-pkg-cta-primary' : 'tsx-pkg-cta-ghost'}
                onClick={() => routeTo('trust', 'contact')}>
                {featured ? 'Start here' : 'Get in touch'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrustProcessTrack({ steps }) {
  return (
    <div className="tsx-process-track">
      {steps.map((step, i) => (
        <div className="tsx-process-track-step" key={step.step}>
          <span className="tsx-process-track-num">{step.step}</span>
          <p className="tsx-process-track-title">{step.title}</p>
          <p className="tsx-process-track-body">{step.body}</p>
          {i < steps.length - 1 && <div className="tsx-process-track-arrow" aria-hidden="true">→</div>}
        </div>
      ))}
    </div>
  );
}

/* Legacy alias */
function TrustProcessTimeline({ steps }) { return <TrustProcessTrack steps={steps} />; }

const DELIVER_ICONS = {
  code:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 6l-4 4 4 4M13 6l4 4-4 4"/></svg>,
  data:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2.6l1.7 4.1 4.1 1.7-4.1 1.7L10 14l-1.7-3.9L4.2 8.4l4.1-1.7z"/><path d="M15.5 13.5l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z"/></svg>,
  design:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l1-3.4 7.6-7.6a1.8 1.8 0 012.5 2.5L7.4 15 4 16z"/><path d="M11.5 5.5l3 3"/></svg>,
  cloud:   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6.6 15.5a3.6 3.6 0 01-.4-7.18A4.6 4.6 0 0115.2 8.6a3.35 3.35 0 01-.2 6.9z"/></svg>,
  growth:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14l4-4 3 2 5.5-6.5"/><path d="M12.5 5.5H16V9"/></svg>,
  proof:   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2.4l5.6 2.2v4.3c0 3.5-2.4 5.8-5.6 6.7-3.2-.9-5.6-3.2-5.6-6.7V4.6z"/><path d="M7.4 9.7l1.8 1.8 3.5-3.9"/></svg>,
  web:     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="14" height="12" rx="1.6"/><path d="M3 8h14M6 6.1h.01M8 6.1h.01"/></svg>,
  doc:     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2.6h5L14.6 6.2V16.4a1 1 0 01-1 1H6a1 1 0 01-1-1V3.6a1 1 0 011-1z"/><path d="M11 2.6V6.4h3.6M7.5 11h5M7.5 13.6h3.5"/></svg>,
  layers:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2.8l7 3.5-7 3.5-7-3.5z"/><path d="M3.2 10.3L10 13.7l6.8-3.4M3.2 13.5L10 16.9l6.8-3.4"/></svg>,
  link:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 11a3 3 0 004.5.4l2.5-2.5a3 3 0 00-4.2-4.2l-1.3 1.3"/><path d="M12 9a3 3 0 00-4.5-.4L5 11.1a3 3 0 004.2 4.2l1.3-1.3"/></svg>,
};
function deliverIcon(title = '') {
  const t = title.toLowerCase();
  if (/engineer|full|stack|develop|\bbuild|software|architect/.test(t)) return DELIVER_ICONS.code;
  if (/data|\bai\b|model|rag|agent|machine|analy/.test(t))        return DELIVER_ICONS.data;
  if (/design|ux|ui|brand|visual|identity/.test(t))              return DELIVER_ICONS.design;
  if (/cloud|devops|deploy|host|observ|infra|\bops\b/.test(t))    return DELIVER_ICONS.cloud;
  if (/integration|systems|pipeline|connect|\bapi\b/.test(t))    return DELIVER_ICONS.link;
  if (/market|growth|\bads?\b|seo|social|content|performance|campaign/.test(t)) return DELIVER_ICONS.growth;
  if (/portfolio|review|eval|quality|interview|proof/.test(t))    return DELIVER_ICONS.proof;
  if (/web|site|b2b|platform|portal|dashboard|product/.test(t))   return DELIVER_ICONS.web;
  if (/document|\bdoc\b/.test(t))                                 return DELIVER_ICONS.doc;
  return DELIVER_ICONS.layers;
}

function TrustDeliverableCards({ rows }) {
  return (
    <div className="tsx-deliver-grid">
      {rows.map((row, i) => (
        <article className={`tsx-deliver-card tsx-deliver-card--indexed tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} key={row.title}>
          <div className="tsx-deliver-meta">
            <span className="tsx-deliver-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            {row.outcome && <span className="tsx-deliver-badge">{row.outcome}</span>}
          </div>
          <div className="tsx-deliver-head">
            <span className="tsx-deliver-icon" aria-hidden="true">{deliverIcon(row.title)}</span>
            <h3 className="tsx-deliver-title">{row.title}</h3>
          </div>
          <hr className="tsx-deliver-rule" aria-hidden="true" />
          <div className="tsx-deliver-chips">
            {row.deliverables.map((d) => (
              <span className="tsx-deliver-chip" key={d}>
                <svg className="tsx-deliver-chk" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {d}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function TrustDeliverableRows({ rows }) { return <TrustDeliverableCards rows={rows} />; }

/* Capability / stack modules — shadcn feature card pattern. */
function TrustModuleCards({ rows }) {
  return (
    <div className="tsx-module-grid">
      {rows.map((row, i) => (
        <div className={`tsx-module-card tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} key={row.title}>
          <div className="tsx-module-card-head">
            <span className="tsx-module-icon" aria-hidden="true">{deliverIcon(row.title)}</span>
            <h3 className="tsx-module-title">{row.title}</h3>
          </div>
          <p className="tsx-module-body">{row.trust || row.body}</p>
        </div>
      ))}
    </div>
  );
}

const TRUST_SECTION_CTA = {
  academy:   'Plan a Talent Programme',
  marketing: 'Scope a Digital Project',
  labs:      'Scope a Product Build',
};

function TrustSectionBlock({ eyebrow, children }) {
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

function TrustStatement({ section }) {
  if (!section.statement) return null;
  return (
    <figure className="tsx-statement tsx-fade">
      <span className="tsx-statement-mark" aria-hidden="true">&ldquo;</span>
      <p className="tsx-statement-text">{section.statement}</p>
    </figure>
  );
}

/* Storytelling chapter — clean title, subtitle, then the module(s) for that beat. */
function TrustChapter({ eyebrow, title, sub, children }) {
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
function TrustSectionStory({ section, phase }) {
  if (phase === 'intro') {
    return (
      <div className="tsx-overview tsx-story tsx-story-light-band">
        <div className="tsx-section-inner">
          <TrustChapter
            eyebrow="Who this serves"
            title="Who this is for"
            sub="The people and teams an engagement is built around - and the outcome each one is after.">
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
            title="What we do"
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

      {section.proof?.length > 0 && (
        <section className="tsx-parent-dark-band tsx-parent-proof-band" data-story-step="03 / Proof">
          <div className="tsx-section-inner">
            <span className="tsx-story-step-pill">Delivery proof</span>
            <TrustChapter
              eyebrow="Delivery proof"
              title="Proof it holds"
              sub="Evidence from work already shipped - not promises.">
              <TrustProofCards items={section.proof} />
              {TRUST_RUNLOG[section.id] && (
                <div className="tsx-runlog-wrap">
                  <div className="tsx-dimline" data-label="Run log" aria-hidden="true" />
                  <TrustRunLog config={TRUST_RUNLOG[section.id]} />
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
            <TrustFaqAccordion faqs={section.faqs} />
          </TrustChapter>
        </div>
      </div>
    </>
  );
}

/* ─── Academy depth story: light → dark proof → dark packages → light ────────────── */
function AcademyPackageGrid({ packages }) {
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

function AcademyDepthStory({ section }) {
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

      {section.proof?.length > 0 && (
        <section className="tsx-parent-dark-band tsx-parent-proof-band" data-story-step="03 / Proof">
          <div className="tsx-section-inner">
            <span className="tsx-story-step-pill">Delivery proof</span>
            <TrustChapter
              eyebrow="Delivery proof"
              title="Proof it holds"
              sub="Evidence from work already shipped - not promises.">
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
          <TrustFaqAccordion faqs={section.faqs} />
        </TrustChapter>
      </div>
    </>
  );
}

const SUBPAGE_CARD_ICONS = {
  'Full-stack sprint':    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="16" height="11" rx="2"/><path d="M7 17h6M10 14v3"/><path d="M6 8l2 2-2 2"/><path d="M10 12h4"/></svg>,
  'AI/data sprint':       <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="3"/><path d="M10 1v3M10 16v3M1 10h3M16 10h3M3.5 3.5l2.1 2.1M14.4 14.4l2.1 2.1M3.5 16.5l2.1-2.1M14.4 5.6l2.1-2.1"/></svg>,
  'Design studio':        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15l5-5 3 3 4-6 3 3"/><path d="M2 2h16v16H2z" strokeWidth="1"/></svg>,
  'Cloud operations':     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M16 13a4 4 0 00-4-6.32A5 5 0 104 13"/><path d="M8 17v-4M12 17v-4"/></svg>,
  'Mentor pods':          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="3"/><circle cx="14" cy="7" r="2"/><path d="M1 17c0-3.31 2.69-6 6-6s6 2.69 6 6"/><path d="M14 12c1.66 0 4 .84 4 2.5V17h-3"/></svg>,
  'Weekly reviews':       <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="14" height="13" rx="2"/><path d="M3 8h14M7 2v4M13 2v4"/><path d="M7 12l2 2 4-4"/></svg>,
  'Client-style projects':<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h12v9H4z"/><path d="M8 13v4M12 13v4M5 17h10"/></svg>,
  'Completion reports':   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2h8l4 4v12H3V2z"/><path d="M13 2v4h4"/><path d="M7 10h6M7 13h4"/></svg>,
  'Interview prep':       <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="6" r="3"/><path d="M4 18c0-3.31 2.69-6 6-6s6 2.69 6 6"/><path d="M13 10l2 2-2 2"/></svg>,
  'Partner matching':     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="8" r="3"/><circle cx="14" cy="8" r="3"/><path d="M1 16c0-2.76 2.24-5 5-5h2M10 11h2c2.76 0 5 2.24 5 5"/></svg>,
  'Offer tracking':       <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h14v3H3zM3 10h14v3H3zM3 16h8v3H3z"/></svg>,
  'Alumni proof':         <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2l2.4 5 5.6.8-4 3.9.9 5.5L10 14.7l-4.9 2.5.9-5.5-4-3.9 5.6-.8z"/></svg>,
  'Positioning':          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="8"/><path d="M10 2v4M10 14v4M2 10h4M14 10h4"/><circle cx="10" cy="10" r="3"/></svg>,
  'Visual identity':      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="6"/><path d="M10 4v12M4 10h12"/></svg>,
  'Messaging':            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6H2v9a2 2 0 002 2h12a2 2 0 002-2V6z"/><path d="M2 6l8 6 8-6"/></svg>,
  'Launch kits':          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2C6 2 3 7 3 12l3 4h8l3-4c0-5-3-10-7-10z"/><path d="M10 2v8"/><circle cx="10" cy="12" r="2"/></svg>,
  'Landing pages':        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="16" height="14" rx="2"/><path d="M2 7h16M7 3v4"/><path d="M6 11h8M6 14h5"/></svg>,
  'Corporate sites':      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="16" height="13" rx="2"/><path d="M2 8h16"/><path d="M6 4V2M14 4V2"/></svg>,
  'Product pages':        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3h12l2 5H2z"/><path d="M2 8v9h16V8"/><path d="M7 13h6"/></svg>,
  'SEO foundations':      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="6"/><path d="M13.5 13.5L18 18"/><path d="M6 9h6M9 6v6"/></svg>,
  'Paid acquisition':     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15l4-4 3 3 4-5 4 4"/><circle cx="17" cy="3" r="2"/></svg>,
  'Reporting':            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M7 13V9M10 13V7M13 13v-2"/></svg>,
  'Retargeting':          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10a6 6 0 016-6 6 6 0 016 6"/><path d="M10 4V1M4 10H1M16 10h3"/><circle cx="10" cy="10" r="2"/></svg>,
  'Creative testing':     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3z"/><path d="M14 14m-3 0a3 3 0 106 0 3 3 0 00-6 0"/></svg>,
  'Atlas':                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2C6 6 6 10 10 18c4-8 4-12 0-16z"/><path d="M2 10c8-4 12 0 16 0"/></svg>,
  'Pulse':                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10h4l2-6 4 12 2-6h4"/></svg>,
  'Forge':                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17l5-15 5 15"/><path d="M8 11h4"/></svg>,
  'Vault':                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="14" height="12" rx="2"/><circle cx="10" cy="10" r="3"/><path d="M13 4V2M7 4V2"/></svg>,
  'Discovery':            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="6"/><path d="M13.5 13.5L18 18"/></svg>,
  'Architecture':         <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="12" y="2" width="6" height="6" rx="1"/><rect x="7" y="12" width="6" height="6" rx="1"/><path d="M5 8v2h10V8M10 10v2"/></svg>,
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

function TrustSubpageBand({ section, page }) {
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

function TrustSubpageHero({ section, page }) {
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

function TrustSubpageCards({ page }) {
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

function TrustSubpageDetailPage({ section, page, index }) {
  const proofItems = section.proof || [];
  return (
    <main className="tsx-subpage-modern" style={{ '--sec-accent': TRUST_ACCENT[section.id] || 'var(--accent)' }}>
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
          <TrustFaqAccordion faqs={section.faqs} />
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

function TrustSectionHeroUnravel({ theme, section }) {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const heroTitleRef = React.useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const TAU = Math.PI * 2;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const shape = section.id === "academy" ? "spiral" : section.id === "labs" ? "sphere" : "signal";
    // Ink-on-paper strands matching the section
    const rgb = section.id === "labs" ? [11, 31, 51] : [26, 109, 255];

    const makeSprite = (cRgb) => {
      const s = document.createElement("canvas");
      s.width = s.height = 64;
      const c = s.getContext("2d");
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
    let parts = [];

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
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
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
    let st;
    const BREATHE = !prefersReducedMotion;

    let rafId = 0;
    let t0 = performance.now();

    function render(now) {
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
      sectionVisible = e.isIntersecting;
      if (sectionVisible && !rafId) rafId = requestAnimationFrame(render);
    }, { threshold: 0 });
    io.observe(wrapRef.current);

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
            <span className="serif" style={{ color: '#5B9DFF' }}>
              <CyclingWord words={SECTION_HERO_WORDS.trust[section.id] || [copy.accent]} />
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

/* ─── Per-division signature modules (Trust-native, light, no canvas/pin) ─── */

function TrustCohortLadder({ section, eyebrow = 'The cohort path', title, sub = 'One path every cohort runs - assess, build, then prove.', ariaLabel = 'The cohort path' }) {
  const steps = section.process || [];
  const railRef = React.useRef(null);
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
              <TrustRunLog config={TRUST_RUNLOG[section.id]} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TrustBlueprint({ section }) {
  const mods = (section.modules || []).slice(0, 4);
  const [ref, drawn] = useTrustReveal(0.3);
  if (!mods.length) return null;
  return (
    <section className="tsx-signature tsx-blueprint-section" aria-label="System architecture">
      <div className="tsx-section-inner">
        <div className="tsx-signature-head tsx-fade">
          <span className="tsx-section-eyebrow">System architecture</span>
          <h2 className="tsx-section-heading">How a Product Studio build<br /><span className="serif">fits together.</span></h2>
          <p className="tsx-signature-sub">How discovery, build and controls connect into one system.</p>
        </div>
        <div className={"tsx-blueprint-grid" + (drawn ? " is-drawn" : "")} ref={ref}>
          <span className="tsx-blueprint-bus" aria-hidden="true" />
          {mods.map((m, i) => (
            <div className="tsx-blueprint-node tsx-fade" style={{ transitionDelay: (i * 80) + 'ms' }} key={m.title}>
              <span className="tsx-blueprint-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{m.title}</h3>
              <p>{m.trust}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustFunnel({ section }) {
  const mods = (section.modules || []).slice(0, 4);
  if (!mods.length) return null;
  return (
    <section className="tsx-signature tsx-funnel-section" aria-label="The growth funnel">
      <div className="tsx-section-inner">
        <div className="tsx-signature-head tsx-fade">
          <span className="tsx-section-eyebrow">The growth funnel</span>
          <h2 className="tsx-section-heading">Attention<br /><span className="serif">to outcome.</span></h2>
          <p className="tsx-signature-sub">How attention becomes a decision, stage by stage.</p>
        </div>
        <div className="tsx-funnel">
          {mods.map((m, i) => (
            <div className="tsx-funnel-stage tsx-fade" style={{ transitionDelay: (i * 90) + 'ms', '--w': (100 - i * 15) + '%' }} key={m.title}>
              <div className="tsx-funnel-bar">
                <span className="tsx-funnel-step">{String(i + 1).padStart(2, '0')}</span>
                <span className="tsx-funnel-name">{m.title}</span>
              </div>
              <p className="tsx-funnel-desc">{m.trust}</p>
            </div>
          ))}
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

function AcademyProcessTimeline({ section }) {
  const steps = section.process || [];
  const railRef = React.useRef(null);

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
              const meta = ACADEMY_STEP_META[i] || {};
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
              <TrustRunLog config={TRUST_RUNLOG[section.id]} />
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

function TrustSignatureModule({ section }) {
  if (section.id === 'academy') return <AcademyProcessTimeline section={section} />;
  if (section.id === 'labs') return (
    <TrustCohortLadder
      section={section}
      ariaLabel="How we build"
      eyebrow="How we build"
      title={<>From problem<br /><span className="serif">to shipped product.</span></>}
      sub="One path: frame the problem, design the system, build, then launch."
    />
  );
  if (section.id === 'marketing') return <TrustFunnel section={section} />;
  return null;
}

function TrustSectionPage({ section, detail }) {
  const activeSubpageIndex = detail ? section.subpages.findIndex((page) => page.slug === detail) : -1;
  if (detail && activeSubpageIndex === -1) return <NotFound theme="trust" page={`${section.id}/${detail}`} />;
  if (activeSubpageIndex >= 0) {
    return <TrustSubpageDetailPage section={section} page={section.subpages[activeSubpageIndex]} index={activeSubpageIndex} />;
  }

  return (
    <main className={`tsx-section-page tsx-section-page--${section.id}`} style={{ '--sec-accent': TRUST_ACCENT[section.id] || 'var(--accent)' }}>
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
function TrustPageHero({ eyebrow, title, accentWords, body, children, primaryLabel, onPrimary }) {
  const titleRef = React.useRef(null);
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
            <span className="serif" style={{ color: '#5B9DFF' }}>
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

function TrustCustomers({ detail }) {
  const activeSection = detail ? DATA.sections[detail] : null;
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

function TrustCompany() {
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
const CHANNEL_ICONS = {
  academy:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  marketing: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  labs:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>,
  home:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>,
};

function TrustContact({ detail }) {
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
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
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

function TrustConcierge({ page }) {
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

function TrustSite({ page, detail }) {
  const section = DATA.sections[page];
  React.useEffect(() => { window.scrollTo(0, 0); }, [page]);
  React.useEffect(() => setupTsxFade(), [page, detail]);
  React.useEffect(() => {
    const sel = '.tsx-sol-card,.tsx-gov-card,.tsx-proof-case-card,.tsx-pkg-card,.tsx-subpage-icon-card,.tsx-matrix-row,.tsx-channel-card,.tsx-deliver-card';
    let lastMove = null, moveRaf = 0;
    const move = (e) => {
      lastMove = e;
      if (moveRaf) return;
      moveRaf = requestAnimationFrame(() => {
        moveRaf = 0;
        const ev = lastMove;
        const c = ev.target.closest && ev.target.closest(sel);
        if (!c) return;
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100) + '%');
        c.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100) + '%');
      });
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(moveRaf); };
  }, []);
  const validPage = section || STATIC_PAGES.includes(page);
  return (
    <div className="site trust tsx-site">
      <a className="skip-link" href="#main">Skip to content</a>
      <TrustNav page={page} detail={detail} />
      <div id="main" className={page !== 'home' ? 'tsx-main-offset' : ''}>
        {page === 'home'      && <TrustHome />}
        {section              && <TrustSectionPage section={section} detail={detail} />}
        {page === 'customers' && <TrustCustomers detail={detail} />}
        {page === 'company'   && <TrustCompany />}
        {page === 'contact'   && <TrustContact detail={detail} />}
        {!validPage           && <NotFound theme="trust" page={page} />}
      </div>
      <TrustConcierge page={page} />
      <TrustFooter />
    </div>
  );
}


export { TrustSite };
