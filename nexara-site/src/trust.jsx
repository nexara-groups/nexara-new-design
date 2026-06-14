import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Users, Package, Handshake, Zap, Link as LinkIcon, ArrowRight, GraduationCap, TrendingUp, Cpu, Shield, Mail } from 'lucide-react';
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
      raf = requestAnimationFrame(draw);
    }
    
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
          <div className="tsx-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M4 13V3L12 13V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          Nexara
        </button>
        <nav aria-label="Primary">
          <ul className="tsx-nav-links tsx-tubelight">
            {DATA.nav.map(item => {
              const active = page === item.page;
              return (
                <li key={item.page}>
                  <button className={`tsx-tubelight-btn${active ? ' active' : ''}`} onClick={() => routeTo('trust', item.page)}>
                    {active && (
                      <span className="tsx-tubelight-glow" aria-hidden="true">
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
          <div className="tsx-mode-dots" role="group" aria-label="Theme mode">
            <button className="tsx-dot-neo" title="Neo" aria-label="Switch to Neo mode" onClick={() => routeTo('neo', page, detail)}></button>
            <button className="tsx-dot-trust active" title="Trust" aria-label="Trust mode" onClick={() => routeTo('trust', page, detail)}></button>
          </div>
          <span className="tsx-mode-sep" aria-hidden="true"></span>
          <button className="tsx-nav-cta" onClick={() => routeTo('trust', 'contact')}>Start a Project</button>
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
    let done = false;
    const run = () => {
      const t0 = performance.now(), dur = 1100;
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting && !done) { done = true; run(); obs.disconnect(); } });
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
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
        <div className="tsx-matrix">
          {DATA.superSkills.map((item, index) => (
            <div className={`tsx-matrix-row tsx-fade tsx-fade-d${Math.min(index + 1, 4)}`} key={item.title}>
              <div className="tsx-matrix-main">
                <span className="tsx-matrix-num">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className="tsx-matrix-title">{item.title}</p>
                  <p className="tsx-matrix-desc">{item.trust}</p>
                </div>
                <div className="tsx-matrix-tags">
                  {item.sections.map(s => (
                    <span className="tsx-matrix-tag" key={s}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="tsx-matrix-detail">
                {item.stack.map(module => (
                  <span className="tsx-matrix-chip" key={module}>{module}</span>
                ))}
              </div>
            </div>
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
            <div className="tsx-logo-mark" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M4 13V3L12 13V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
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

    // Steel: enterprise blue accent + slate ink on cool ground
    const STRANDS = [
      { id: "academy",   rgb: [26, 109, 255] },  // accent blue
      { id: "labs",      rgb: [11, 31, 51] },    // slate ink
      { id: "marketing", rgb: [26, 109, 255] },  // accent blue
    ];

    const makeSprite = (rgb) => {
      const s = document.createElement("canvas");
      s.width = s.height = 64;
      const c = s.getContext("2d");
      const grad = c.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0.9)");
      grad.addColorStop(0.3, "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0.5)");
      grad.addColorStop(0.6, "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0.14)");
      grad.addColorStop(1, "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0)");
      c.fillStyle = grad;
      c.fillRect(0, 0, 64, 64);
      return s;
    };

    const sprites = STRANDS.map(s => makeSprite(s.rgb));

    let parts = [];
    let COUNT = window.innerWidth < 760 ? 340 : 720;

    function buildParticles() {
      COUNT = window.innerWidth < 760 ? 340 : 720;
      parts = STRANDS.map(() => {
        const arr = new Array(COUNT);
        for (let i = 0; i < COUNT; i++) {
          let x = Math.random() * 2 - 1;
          let y = Math.random() * 2 - 1;
          let z = Math.random() * 2 - 1;
          const l = Math.hypot(x, y, z) || 1;
          const rad = 1.6 + Math.random() * 1.5;
          arr[i] = {
            t: i / COUNT,
            cx: (x / l) * rad, cy: (y / l) * rad, cz: (z / l) * rad,
            j: Math.random() * TAU,
            sz: 0.55 + Math.random() * 1.05,
          };
        }
        return arr;
      });
    }

    buildParticles();

    const v = [0, 0, 0];
    function fCloud(si, pt) {
      v[0] = pt.cx; v[1] = pt.cy; v[2] = pt.cz;
    }
    function fMonolith(si, pt, time) {
      const a = pt.t * TAU * 3 + si * (TAU / 3) + time * 0.3;
      const r = 0.17 + Math.sin(pt.j + time * 1.4) * 0.022;
      v[0] = Math.cos(a) * r;
      v[1] = (pt.t - 0.5) * 2.7;
      v[2] = Math.sin(a) * r;
    }
    function fBloom(si, pt, time) {
      const A = si * (TAU / 3) + time * 0.12;
      const ox = Math.cos(A) * 0.9, oz = Math.sin(A) * 0.9;
      const a = pt.t * TAU * 2.4 + time * 0.5;
      v[0] = ox + Math.cos(a) * 0.3;
      v[1] = (pt.t - 0.5) * 2.1;
      v[2] = oz + Math.sin(a) * 0.3;
    }
    function fSignature(si, pt, time) {
      if (si === 0) {
        const a = pt.t * TAU * 1.7 + time * 0.32;
        const r = 0.5 + pt.t * 0.72;
        v[0] = Math.cos(a) * r;
        v[1] = (pt.t - 0.5) * 2.35;
        v[2] = Math.sin(a) * r;
      } else if (si === 1) {
        const ga = pt.t * COUNT * 2.39996323;
        const y = 1 - pt.t * 2;
        const rr = Math.sqrt(Math.max(0, 1 - y * y));
        const R = 1.18 + Math.sin(time * 1.3 + pt.j) * 0.05;
        v[0] = Math.cos(ga) * rr * R;
        v[1] = y * R;
        v[2] = Math.sin(ga) * rr * R;
      } else {
        const a = pt.t * TAU * 3.4 + time * 0.55;
        const r = 0.14 + pt.t * 1.55;
        v[0] = Math.cos(a) * r;
        v[1] = Math.sin(pt.t * TAU * 2 + time * 1.1) * 0.13;
        v[2] = Math.sin(a) * r * 0.62;
      }
    }
    function fOrbit(si, pt, time) {
      const a = pt.t * TAU + si * 2.1 + time * 0.14;
      v[0] = Math.cos(a) * 2.0;
      v[1] = Math.sin(a * 2 + pt.j) * 0.16 + (si - 1) * -0.42;
      v[2] = Math.sin(a) * 2.0;
    }
    function fLattice(si, pt, time) {
      const u = pt.t * TAU * 3 + si * (TAU / 3) + time * 0.18;
      const w = pt.t * TAU * 7 + pt.j;
      const k = 1.05 + 0.42 * Math.cos(w);
      v[0] = k * Math.cos(u);
      v[1] = 0.42 * Math.sin(w);
      v[2] = k * Math.sin(u);
    }

    function evalFormation(name, si, pt, time) {
      switch (name) {
        case "cloud":    fCloud(si, pt); break;
        case "monolith": fMonolith(si, pt, time); break;
        case "bloom":    fBloom(si, pt, time); break;
        case "focus0":   si === 0 ? fSignature(si, pt, time) : fOrbit(si, pt, time); break;
        case "focus1":   si === 1 ? fSignature(si, pt, time) : fOrbit(si, pt, time); break;
        case "focus2":   si === 2 ? fSignature(si, pt, time) : fOrbit(si, pt, time); break;
        case "lattice":  fLattice(si, pt, time); break;
      }
    }

    function formationAlpha(name, si) {
      switch (name) {
        case "cloud":    return 0.45;
        case "monolith": return 0.95;
        case "bloom":    return 0.95;
        case "focus0":   return si === 0 ? 1 : 0.13;
        case "focus1":   return si === 1 ? 1 : 0.13;
        case "focus2":   return si === 2 ? 1 : 0.13;
        case "lattice":  return 0.9;
      }
      return 1;
    }

    const KEYS = [
      { p: 0.00, f: "cloud"    },
      { p: 0.07, f: "monolith" },
      { p: 0.13, f: "monolith" },
      { p: 0.20, f: "bloom"    },
      { p: 0.255, f: "bloom"   },
      { p: 0.31, f: "focus0"   },
      { p: 0.42, f: "focus0"   },
      { p: 0.49, f: "focus1"   },
      { p: 0.60, f: "focus1"   },
      { p: 0.67, f: "focus2"   },
      { p: 0.78, f: "focus2"   },
      { p: 0.88, f: "lattice"  },
      { p: 1.00, f: "lattice"  },
    ];

    function segmentAt(p) {
      let i = 0;
      while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
      const a = KEYS[i], b = KEYS[i + 1];
      const diff = b.p - a.p || 1;
      const progress = (p - a.p) / diff;
      const e = progress * progress * (3 - 2 * progress);
      return { from: a.f, to: b.f, e };
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
      updateChapters(p);

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      const seg = segmentAt(p);
      const ry = p * 4.4 + time * 0.05 + mouse.x * 0.28;
      const rx = -0.16 + Math.sin(p * Math.PI) * 0.12 + mouse.y * 0.2;
      const cy_ = Math.cos(ry), sy_ = Math.sin(ry);
      const cx_ = Math.cos(rx), sx_ = Math.sin(rx);

      parts.forEach((strandParts, si) => {
        const sprite = sprites[si];
        const alpha = formationAlpha(seg.from, si) * (1 - seg.e) + formationAlpha(seg.to, si) * seg.e;
        if (alpha <= 0.002) return;

        const pA = [0, 0, 0];
        const pB = [0, 0, 0];

        strandParts.forEach((pt) => {
          evalFormation(seg.from, si, pt, time);
          pA[0] = v[0]; pA[1] = v[1]; pA[2] = v[2];

          evalFormation(seg.to, si, pt, time);
          pB[0] = v[0]; pB[1] = v[1]; pB[2] = v[2];

          const mx = pA[0] * (1 - seg.e) + pB[0] * seg.e;
          const my = pA[1] * (1 - seg.e) + pB[1] * seg.e;
          const mz = pA[2] * (1 - seg.e) + pB[2] * seg.e;

          const x1 = mx * cy_ - mz * sy_;
          const z1 = mx * sy_ + mz * cy_;
          const y2 = my * cx_ - z1 * sx_;
          const z2 = my * sx_ + z1 * cx_;

          const persp = 3.6 / (3.6 + z2);
          const px = CX + x1 * persp * SCALE;
          const py = CY + y2 * persp * SCALE;
          const d = pt.sz * persp * 2.8 * (W < 760 ? 1.4 : 2.0);

          if (px < -d || px > W + d || py < -d || py > H + d) return;

          ctx.globalAlpha = alpha;
          ctx.drawImage(sprite, px - d / 2, py - d / 2, d, d);
        });
      });

      rafId = requestAnimationFrame(renderLoop);
    }

    let heroVisible = true;
    const io = new IntersectionObserver(([e]) => {
      heroVisible = e.isIntersecting;
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
    <div ref={wrapRef} className="tsx-hero-runway">
      <div className="tsx-hero-stage">
        <canvas ref={canvasRef} className="tsx-hero-canvas" aria-hidden="true" />
        
        <div className="tsx-hero-chapter" data-from="0" data-to="0.07">
          <p className="tsx-section-eyebrow">Enterprise IT systems</p>
          <h1 ref={titleRef} className="tsx-hero-title" aria-label="Nexara">
            <span>N</span><span>E</span><span>X</span><span>A</span><span>R</span><span>A</span>
          </h1>
          <div className="tsx-hero-dimline" aria-hidden="true">
            <span className="tsx-hero-dimline-label">3 DIVISIONS · 1 STANDARD</span>
          </div>
          <p className="tsx-hero-sub">Scroll to unravel</p>
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
            <button className="tsx-btn-cta" onClick={() => routeTo('trust', 'contact')}>Start a brief <span className="arr">→</span></button>
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
          tickRef.current.style.left = (self.progress * 100) + "%";
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
      <a href="#contact" onClick={(e) => { e.preventDefault(); routeTo('trust', 'contact'); }}>Start <em>the brief.</em></a>
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
        <div className={`tsx-proof-case-card tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} key={p.name}>
          <span className="tsx-proof-case-idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <div className="tsx-proof-case-top">
            <span className="tsx-proof-case-org">{p.org}</span>
          </div>
          <p className="tsx-proof-case-headline">{p.name}</p>
          <p className="tsx-proof-case-body"><span className="tsx-proof-tick" aria-hidden="true" />{p.result.trust}</p>
        </div>
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
        top: isActive ? pos.top - 14 : pos.top,
        width: 260,
        zIndex: isActive ? 40 : CARD_Z_BASE[index],
        opacity: isActive ? 1 : 0.68,
        filter: isActive ? 'none' : 'grayscale(35%) brightness(0.98)',
        boxShadow: isActive
          ? (featured
              ? '0 16px 44px rgba(26,109,255,0.18), 0 2px 8px rgba(0,0,0,0.07)'
              : '0 10px 32px rgba(0,0,0,0.13)')
          : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'top 0.32s cubic-bezier(.22,1,.36,1), opacity 0.22s ease, filter 0.22s ease, box-shadow 0.22s ease',
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
            ? 'bg-[#1A6DFF] text-white hover:bg-[#1559d8]'
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
        <article className={`tsx-deliver-card tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} key={row.title}>
          <span className="tsx-deliver-glow" aria-hidden="true" />
          <div className="tsx-deliver-head">
            <span className="tsx-deliver-icon" aria-hidden="true">{deliverIcon(row.title)}</span>
            <h3 className="tsx-deliver-title">{row.title}</h3>
            <span className="tsx-deliver-badge">{row.outcome}</span>
          </div>
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

/* Capability / stack modules as elevated icon cards (reuses the deliverable card kit). */
function TrustModuleCards({ rows }) {
  return (
    <div className="tsx-deliver-grid">
      {rows.map((row, i) => (
        <article className={`tsx-deliver-card tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} key={row.title}>
          <span className="tsx-deliver-glow" aria-hidden="true" />
          <div className="tsx-deliver-head">
            <span className="tsx-deliver-icon" aria-hidden="true">{deliverIcon(row.title)}</span>
            <h3 className="tsx-deliver-title">{row.title}</h3>
          </div>
          <p className="tsx-deliver-body">{row.trust || row.body}</p>
        </article>
      ))}
    </div>
  );
}

const TRUST_SECTION_CTA = {
  academy:   'Plan a Talent Programme',
  marketing: 'Scope a Digital Project',
  labs:      'Scope an AI System',
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
      <div className="tsx-overview tsx-story">
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
    <div className="tsx-overview tsx-story">
      <div className="tsx-section-inner">
        <TrustChapter
          eyebrow="What we deliver"
          title="What you get"
          sub="The concrete artifacts you walk away with.">
          <TrustDeliverableCards rows={section.stackDetails} />
        </TrustChapter>

        {section.proof?.length > 0 && (
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
        )}

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
  );
}

/* ─── Academy depth story: light → dark rail → light ────────────── */
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
    <div className="tsx-overview tsx-story">
      <div className="tsx-section-inner">
        <TrustChapter
          eyebrow="What we deliver"
          title="What you get"
          sub="The concrete artifacts you walk away with.">
          <TrustDeliverableCards rows={section.stackDetails} />
        </TrustChapter>

        {section.proof?.length > 0 && (
          <TrustChapter
            eyebrow="Delivery proof"
            title="Proof it holds"
            sub="Evidence from work already shipped - not promises.">
            <TrustProofCards items={section.proof} />
          </TrustChapter>
        )}
      </div>

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
    </div>
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
        </div>
        <div className="tsx-subpage-icon-grid">
          {page.cards.map((card, i) => (
            <div className={`tsx-subpage-icon-card tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} key={card.title}>
              <div className="tsx-subpage-icon-wrap" aria-hidden="true">
                {SUBPAGE_CARD_ICONS[card.title] || DEFAULT_CARD_ICON}
              </div>
              <h3 className="tsx-subpage-card-title">{card.title}</h3>
              <p className="tsx-subpage-card-body">{card.trust}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrustSectionHeroUnravel({ theme, section }) {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  
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

    const state = { p: 0, target: 0 };
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
      state.target = 1;
      wrapRef.current.style.height = "100svh";
    }

    let rafId = 0;
    let t0 = performance.now();

    function render(now) {
      const time = (now - t0) / 1000;
      state.p += (state.target - state.p) * 0.09;
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

      rafId = requestAnimationFrame(render);
    }

    let sectionVisible = true;
    const io = new IntersectionObserver(([e]) => {
      sectionVisible = e.isIntersecting;
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
    <div ref={wrapRef} className="tsx-hero-runway" style={{ height: '260vh' }}>
      <div className="tsx-hero-stage">
        <canvas ref={canvasRef} className="tsx-hero-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <div className="tsx-hero-chapter" style={{ opacity: 1, pointerEvents: 'auto' }}>
          <p className="tsx-section-eyebrow">{section.id === "academy" ? "01" : section.id === "labs" ? "02" : "03"} / {getTrustSectionLabel(section).toUpperCase()}</p>
          <h1 className="tsx-section-heading" style={{ color: '#F4F8FF', fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 700 }}>
            {copy.title}<br />
            <span className="serif" style={{ color: '#5B9DFF' }}>
              <CyclingWord words={SECTION_HERO_WORDS.trust[section.id] || [copy.accent]} />
            </span>
          </h1>
          <p className="tsx-sec-body" style={{ marginTop: '14px', maxWidth: '34em', color: 'rgba(220,232,248,.66)', marginInline: 'auto' }}>{copy.body}</p>
          <div className="tsx-sec-actions" style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="tsx-btn-cta" onClick={() => {
              const band = document.querySelector(".tsx-subpage-band");
              band?.scrollIntoView({ behavior: "smooth" });
            }}>{copy.primary}</button>
            <button className="tsx-sec-btn-ghost" onClick={() => routeTo('trust', 'customers', section.id)}>{copy.secondary}</button>
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

/* ─── Academy Orbital Timeline (21st.dev Radial Orbital Timeline adapted for JSX) ─── */
const ACADEMY_ORBITAL_NODES = [
  { id: 1, title: "Map the learner", date: "Week 1", content: "Assess current skill level, target roles and portfolio gaps. Every learner enters with a written brief.", category: "Discovery", icon: MapPin, relatedIds: [2], status: "completed", energy: 100 },
  { id: 2, title: "Run the cohort", date: "Weeks 2–8", content: "Live sessions, project sprints, mentor reviews and weekly delivery checkpoints — progress on the record.", category: "Delivery", icon: Users, relatedIds: [1, 3], status: "in-progress", energy: 80 },
  { id: 3, title: "Build proof", date: "Weeks 7–10", content: "Turn projects into case studies, demos and interview-ready narratives. Portfolio speaks before the résumé.", category: "Output", icon: Package, relatedIds: [2, 4], status: "pending", energy: 55 },
  { id: 4, title: "Place or partner", date: "Week 10+", content: "Match candidates to interviews or report cohort outcomes to institutions and hiring partners.", category: "Outcome", icon: Handshake, relatedIds: [3], status: "pending", energy: 30 },
];

function AcademyOrbitalTimeline() {
  const [expandedItems, setExpandedItems] = React.useState({});
  const [rotationAngle, setRotationAngle] = React.useState(0);
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [pulseEffect, setPulseEffect] = React.useState({});
  const [activeNodeId, setActiveNodeId] = React.useState(null);
  const [centerOffset] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef(null);
  const orbitRef = React.useRef(null);
  const nodeRefs = React.useRef({});
  const timelineData = ACADEMY_ORBITAL_NODES;

  const handleContainerClick = (e) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const getRelatedItems = (itemId) => {
    const current = timelineData.find(i => i.id === itemId);
    return current ? current.relatedIds : [];
  };

  const centerViewOnNode = (nodeId) => {
    const nodeIndex = timelineData.findIndex(i => i.id === nodeId);
    const total = timelineData.length;
    const targetAngle = (nodeIndex / total) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const toggleItem = (id) => {
    setExpandedItems(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => { if (parseInt(key) !== id) newState[parseInt(key)] = false; });
      newState[id] = !prev[id];
      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const related = getRelatedItems(id);
        const pulse = {};
        related.forEach(rid => { pulse[rid] = true; });
        setPulseEffect(pulse);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  React.useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setRotationAngle(prev => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(timer);
  }, [autoRotate]);

  const calculateNodePosition = (index, total) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 180;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, zIndex, opacity };
  };

  const isRelatedToActive = (itemId) => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const statusColor = (status) => {
    if (status === 'completed') return 'bg-[#1A6DFF] text-white border-[#1A6DFF]';
    if (status === 'in-progress') return 'bg-white text-[#0b1f33] border-[#0b1f33]';
    return 'bg-slate-100 text-slate-500 border-slate-300';
  };

  return (
    <section className="tsx-signature" aria-label="The cohort path">
      <div className="tsx-section-inner">
        <div className="tsx-signature-head tsx-fade">
          <span className="tsx-section-eyebrow">The cohort path</span>
          <h2 className="tsx-section-heading">From intake<br /><span className="serif">to hiring outcome.</span></h2>
          <p className="tsx-signature-sub">Click any node to explore each phase of the programme journey.</p>
        </div>
        <div
          className="relative w-full flex items-center justify-center overflow-hidden"
          style={{ height: '520px' }}
          ref={containerRef}
          onClick={handleContainerClick}
        >
          {/* orbit ring */}
          <div className="absolute rounded-full border border-slate-200" style={{ width: 400, height: 400 }} />
          {/* center pulse */}
          <div className="absolute flex items-center justify-center" style={{ width: 56, height: 56 }}>
            <div className="absolute rounded-full bg-[#1A6DFF] opacity-10 animate-ping" style={{ width: 64, height: 64 }} />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A6DFF] to-[#5B9DFF] flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4"><path d="M10 2l2 5h5l-4 3 1.5 5L10 13l-4.5 2L7 10 3 7h5z"/></svg>
            </div>
          </div>
          {/* orbit container */}
          <div
            ref={orbitRef}
            className="absolute w-full h-full flex items-center justify-center"
            style={{ perspective: '1000px', transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)` }}
          >
            {timelineData.map((item, index) => {
              const pos = calculateNodePosition(index, timelineData.length);
              const isExpanded = expandedItems[item.id];
              const isRelated = isRelatedToActive(item.id);
              const isPulsing = pulseEffect[item.id];
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  ref={el => { nodeRefs.current[item.id] = el; }}
                  className="absolute transition-all duration-700 cursor-pointer"
                  style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, zIndex: isExpanded ? 200 : pos.zIndex, opacity: isExpanded ? 1 : pos.opacity }}
                  onClick={e => { e.stopPropagation(); toggleItem(item.id); }}
                >
                  {/* energy aura */}
                  <div
                    className={`absolute rounded-full ${isPulsing ? 'animate-pulse' : ''}`}
                    style={{
                      background: 'radial-gradient(circle, rgba(26,109,255,0.15) 0%, transparent 70%)',
                      width: `${item.energy * 0.4 + 40}px`, height: `${item.energy * 0.4 + 40}px`,
                      left: `-${(item.energy * 0.4 + 40 - 40) / 2}px`, top: `-${(item.energy * 0.4 + 40 - 40) / 2}px`,
                    }}
                  />
                  {/* node icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isExpanded ? 'bg-[#1A6DFF] text-white border-[#1A6DFF] scale-150 shadow-lg shadow-blue-200' :
                    isRelated ? 'bg-blue-50 text-[#1A6DFF] border-[#1A6DFF] animate-pulse' :
                    'bg-white text-slate-500 border-slate-200 hover:border-[#1A6DFF] hover:text-[#1A6DFF]'
                  }`}>
                    <Icon size={16} />
                  </div>
                  {/* label */}
                  <div className={`absolute whitespace-nowrap text-xs font-semibold tracking-wide transition-all duration-300 text-center ${isExpanded ? 'text-[#1A6DFF] scale-110' : 'text-slate-500'}`} style={{ top: '48px', left: '50%', transform: `translateX(-50%) ${isExpanded ? 'scale(1.1)' : ''}` }}>
                    {item.title}
                  </div>
                  {/* expanded card */}
                  {isExpanded && (
                    <div className="absolute bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-left" style={{ top: '72px', left: '50%', transform: 'translateX(-50%)', width: '220px', zIndex: 300 }}>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-px h-2 bg-slate-300" />
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${statusColor(item.status)}`}>
                          {item.status === 'completed' ? 'COMPLETE' : item.status === 'in-progress' ? 'ACTIVE' : 'UPCOMING'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{item.date}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mb-1">{item.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.content}</p>
                      <div className="mt-3 pt-2 border-t border-slate-100">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="flex items-center gap-1 text-slate-400"><Zap size={10} />Progress</span>
                          <span className="font-mono text-slate-600">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#1A6DFF] to-[#5B9DFF] rounded-full" style={{ width: `${item.energy}%` }} />
                        </div>
                      </div>
                      {item.relatedIds.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-100">
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><LinkIcon size={9} />Connected</p>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map(rid => {
                              const related = timelineData.find(i => i.id === rid);
                              return (
                                <button key={rid} className="text-xs px-2 py-0.5 border border-slate-200 rounded text-slate-600 hover:border-[#1A6DFF] hover:text-[#1A6DFF] transition-colors flex items-center gap-0.5"
                                  onClick={e => { e.stopPropagation(); toggleItem(rid); }}>
                                  {related?.title}<ArrowRight size={8} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* static labels below for context */}
        <div className="flex justify-center gap-6 flex-wrap mt-2 pb-8">
          {timelineData.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-center gap-2 text-xs text-slate-400">
                <Icon size={12} className="text-[#1A6DFF]" />
                <span>{item.title}</span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-slate-300">{item.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrustSignatureModule({ section }) {
  if (section.id === 'academy') return <AcademyOrbitalTimeline />;
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

function TrustSectionPage({ section }) {
  return (
    <main className="tsx-section-page" style={{ '--sec-accent': TRUST_ACCENT[section.id] || 'var(--accent)' }}>
      {/* Hook */}
      {HAS_SCROLL_ANIMATION ? (
        <TrustSectionHeroUnravel theme="trust" section={section} />
      ) : (
        <TrustSectionHeader section={section} />
      )}
      {/* Who this is for -> Why it matters -> What we do */}
      <TrustSectionStory section={section} phase="intro" />
      {/* How it works - the one mechanism, full-width centerpiece */}
      <TrustSignatureModule section={section} />
      {/* What you get -> Proof -> Packages -> Questions */}
      <TrustSectionStory section={section} phase="depth" />
      {/* Go deeper */}
      {section.subpages.map(sp => (
        <TrustSubpageBand key={sp.slug} section={section} page={sp} />
      ))}
      {/* Invitation - one clear close */}
      <section className="tsx-section-inner">
        <TrustIntakeBand spaced heading={section.intake.primary} sub={section.intake.secondary} cta={TRUST_SECTION_CTA[section.id] || 'Start a Project'} />
      </section>
    </main>
  );
}
function TrustCustomers({ detail }) {
  const activeSection = detail ? DATA.sections[detail] : null;
  if (detail && !activeSection) return <NotFound theme="trust" page={`customers/${detail}`} />;
  const proofItems = activeSection ? DATA.customers.filter(customer => customer.id === detail) : DATA.customers;
  return (
    <main className="tsx-customers-page">
      <div className="tsx-sec-header">
        <div className="tsx-sec-header-inner">
          <div>
            <span className="tsx-sec-eyebrow">{activeSection ? `${activeSection.name} — Proof` : "Operating Proof"}</span>
            <h1 className="tsx-sec-h1">Delivery proof across every Nexara capability.</h1>
            <p className="tsx-sec-body">Each engagement is framed as a delivery model — scope evidence, the work produced, and the operating readiness handed over. No invented logos, no vanity metrics.</p>
          </div>
          <div className="tsx-spec-panel">
            <span className="tsx-spec-panel-label">Coverage</span>
            {[
              ["3", "solution lines"],
              ["3", "proof records"],
              ["100%", "scoped & owned"],
            ].map(([value, label]) => (
              <div className="tsx-spec-row" key={label}>
                <span className="tsx-spec-label">{label}</span>
                <span className="tsx-spec-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
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
      <section className="tsx-contact-hero">
        <div className="tsx-section-inner">
          <p className="tsx-cta-eyebrow">{copy.eyebrow}</p>
          <h1 className="tsx-contact-h1">{copy.title}</h1>
          <p className="tsx-contact-body">{copy.body}</p>
          <a className="tsx-email-pill" href={`mailto:${copy.accent}`}>{copy.accent}</a>
        </div>
      </section>

      <section className="tsx-section-inner tsx-channel-section">
        <header className="tsx-chapter-head tsx-page-chapter tsx-fade">
          <span className="tsx-chapter-eyebrow">Where to start</span>
          <h2 className="tsx-chapter-title">Select a section</h2>
          <p className="tsx-chapter-sub">Pick the line closest to what you need — it routes your brief to the right team.</p>
        </header>
        <div className="tsx-channel-grid">
          {DATA.contact.channels.map(channel => (
            <button
              key={channel.title}
              type="button"
              className={formData.section === channel.section ? "tsx-channel-card active" : "tsx-channel-card"}
              onClick={() => handleLaneSelect(channel.section)}
            >
              <h3>{channel.title}</h3>
              <p>{channel.body}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="tsx-section-inner tsx-brief-section">
        <header className="tsx-chapter-head tsx-page-chapter tsx-fade">
          <span className="tsx-chapter-eyebrow">Your brief</span>
          <h2 className="tsx-chapter-title">{DATA.contact.enquiry.title}</h2>
        </header>
        <p className="tsx-brief-intro">{DATA.contact.enquiry.body}</p>
        {showSuccess ? (
          <TrustIntakeBand heading="Enquiry prepared. Your mail client will open shortly." sub="If it does not open, use the email link on this page and include the project details manually." cta={null} />
        ) : (
          <div className="tsx-brief-grid">
            <form className="tsx-brief-form" onSubmit={handleSubmit}>
              <div className="tsx-field">
                <label className="tsx-field-label" htmlFor="trust-city">City</label>
                <input id="trust-city" className="tsx-field-input" type="text" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
              </div>
              <div className="tsx-field">
                <label className="tsx-field-label" htmlFor="trust-audience">Audience / user group</label>
                <input id="trust-audience" className="tsx-field-input" type="text" placeholder="e.g. engineering students, local shoppers" value={formData.audience} onChange={(e) => handleChange("audience", e.target.value)} />
              </div>
              <div className="tsx-field">
                <label className="tsx-field-label" htmlFor="trust-timeline">Timeline</label>
                <select id="trust-timeline" className="tsx-field-input" value={formData.timeline} onChange={(e) => handleChange("timeline", e.target.value)}>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
              </div>
              <div className="tsx-field">
                <label className="tsx-field-label" htmlFor="trust-context">Context / current state</label>
                <textarea id="trust-context" className="tsx-field-input" placeholder="Existing website, tools, platforms, repositories, or current workflow" value={formData.context} onChange={(e) => handleChange("context", e.target.value)} />
              </div>
              <div className="tsx-field">
                <label className="tsx-field-label" htmlFor="trust-success">Success metric</label>
                <input id="trust-success" className="tsx-field-input" type="text" placeholder="e.g. improve enquiry conversion, launch a cohort dashboard" value={formData.successMetric} onChange={(e) => handleChange("successMetric", e.target.value)} />
              </div>
              <div className="tsx-field">
                <label className="tsx-field-label" htmlFor="trust-name">Your name</label>
                <input id="trust-name" className="tsx-field-input" type="text" placeholder="Decision-maker name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>
              <div className="tsx-field">
                <label className="tsx-field-label" htmlFor="trust-email">Email</label>
                <input id="trust-email" className="tsx-field-input" type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
              </div>
              <button className="tsx-btn-cta tsx-brief-submit" type="submit">{DATA.contact.enquiry.label}</button>
            </form>
            <aside className="tsx-checklist-panel">
              <span>Your enquiry should cover</span>
              <ul>
                {DATA.contact.checklist.map(item => <li key={item}>{item}</li>)}
              </ul>
              <a href={DATA.contact.enquiry.href}>{copy.accent}</a>
            </aside>
          </div>
        )}
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
      aria-label="Talk to Nexara — start a brief"
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
    const move = (e) => {
      const c = e.target.closest && e.target.closest(sel);
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);
  const validPage = section || STATIC_PAGES.includes(page);
  return (
    <div className="site trust tsx-site">
      <a className="skip-link" href="#main">Skip to content</a>
      <TrustNav page={page} detail={detail} />
      <div id="main" className={page !== 'home' ? 'tsx-main-offset' : ''}>
        {page === 'home'      && <TrustHome />}
        {section              && <TrustSectionPage section={section} />}
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
