/* ═══════════════════════════════════════════════════════════════════
   TRUSTSITE — DEDICATED CORPORATE COMPONENT TREE
   ═══════════════════════════════════════════════════════════════════ */

function setupTsxFade() {
  document.documentElement.classList.add('js-reveal-ready');
  const els = document.querySelectorAll('.tsx-fade:not(.visible)');
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

/* Per-division accent trio — shared by rail + section pages. AA-safe on warm paper. */
const TRUST_ACCENT = { academy: '#1D4ED8', marketing: '#0D9488', labs: '#6D28D9' };

function TrustParticleCanvas() {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const BG = '#0A0F1E', LINE = 'rgba(15,76,129,', DOT = 'rgba(15,76,129,1)';
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
  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
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
          <ul className="tsx-nav-links">
            {DATA.nav.map(item => (
              <li key={item.page}>
                <button className={page === item.page ? 'active' : ''} onClick={() => routeTo('trust', item.page)}>
                  {getTrustNavLabel(item)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="tsx-nav-right">
          <div className="tsx-mode-dots" role="group" aria-label="Theme mode">
            <button className="tsx-dot-neo" title="Neo" aria-label="Switch to Neo mode" onClick={() => routeTo('neo', page, detail)}></button>
            <button className="tsx-dot-trust active" title="Trust" aria-label="Trust mode" onClick={() => routeTo('trust', page, detail)}></button>
          </div>
          <span className="tsx-mode-sep" aria-hidden="true"></span>
          <button className="tsx-nav-cta" onClick={() => routeTo('trust', 'contact')}>Start a Project</button>
        </div>
      </div>
      <nav className="tsx-mobile-nav-scroll" aria-label="Primary mobile">
        {DATA.nav.map(item => (
          <button key={item.page} className={page === item.page ? 'active' : ''} onClick={() => routeTo('trust', item.page)}>
            {getTrustNavLabel(item)}
          </button>
        ))}
      </nav>
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
    index: '01 — Labs', name: 'Labs', page: 'labs', linkLabel: 'Explore Labs',
    desc: 'Operational systems and AI infrastructure — from workflow discovery to governed rollout. Built for teams that need measurable automation, not demos.',
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
  const moduleGroups = Object.values(DATA.sections).map(section => ({
    label: getTrustSectionLabel(section),
    links: section.subpages.map(sp => ({ text: getTrustSubpageLabel(section, sp), page: section.id, detail: sp.slug })),
  }));
  const cols = [
    { label: 'Solutions', links: solutionLinks },
    { label: 'Modules', groups: moduleGroups },
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

    // Drafting-table ink on paper: cobalt, deep blue, ink
    const STRANDS = [
      { id: "academy",   rgb: [29, 78, 216] },  // var(--accent) cobalt
      { id: "labs",      rgb: [30, 64, 175] },  // deep blue
      { id: "marketing", rgb: [22, 24, 29] },   // ink
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
          <h2 className="tsx-section-heading" style={{ textAlign: 'left' }}>Marketing<br /><span className="serif" style={{ color: '#5B6472' }}>the growth signal.</span></h2>
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
      }
    });

    return () => st.kill();
  }, []);

  const sections = Object.values(DATA.sections);
  const ACCENT = TRUST_ACCENT;
  const TAGLINE = { academy: 'the talent engine.', marketing: 'the growth signal.', labs: 'the systems forge.' };

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
    </section>
  );
}

function TrustHome() {
  return (
    <main>
      {!HAS_SCROLL_ANIMATION ? (
        <>
          <TrustHeroFlat />
          <TrustProofStrip />
          <TrustSolutionsGrid />
          <TrustEnterpriseStacks />
          <TrustMarketContext />
          <TrustFinalCTA />
        </>
      ) : (
        <>
          <TrustHeroUnravel />
          <TrustProofStrip />
          <TrustManifesto />
          <TrustDivisionsRail />
          <section className="tsx-section-inner" style={{ paddingBlock: 'clamp(60px, 10vh, 120px)' }}>
            <div className="tsx-standard-head" style={{ marginBottom: '40px' }}>
              <p className="tsx-section-eyebrow">The operating standard</p>
              <h2 className="tsx-section-heading">Every division runs<br />on the same spine.</h2>
            </div>
            <div className="tsx-standards-grid">
              <div className="tsx-standard-card">
                <span className="tsx-std-idx">/01</span>
                <h3>Written before built</h3>
                <p>Every engagement starts with a written brief and scope. If it isn't written down, it isn't agreed.</p>
              </div>
              <div className="tsx-standard-card">
                <span className="tsx-std-idx">/02</span>
                <h3>Demo every week</h3>
                <p>Working software, live cohorts, running campaigns — shown weekly, not described in decks.</p>
              </div>
              <div className="tsx-standard-card">
                <span className="tsx-std-idx">/03</span>
                <h3>One accountable lead</h3>
                <p>Every cohort, system and campaign has a single named owner from kickoff to handover.</p>
              </div>
              <div className="tsx-standard-card">
                <span className="tsx-std-idx">/04</span>
                <h3>Handover by design</h3>
                <p>Documentation, access and training are part of the deliverable — never an afterthought.</p>
              </div>
            </div>
          </section>
          <TrustEnterpriseStacks />
          <TrustMarketContext />
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

function TrustSubNav({ section, activeSlug }) {
  return (
    <nav className="tsx-subnav" aria-label="Section navigation">
      <button className={!activeSlug ? 'tsx-tab active' : 'tsx-tab'} onClick={() => routeTo('trust', section.id)}>Overview</button>
          {section.subpages.map(sp => (
        <button key={sp.slug} className={activeSlug === sp.slug ? 'tsx-tab active' : 'tsx-tab'} onClick={() => routeTo('trust', section.id, sp.slug)}>{getTrustSubpageLabel(section, sp)}</button>
      ))}
    </nav>
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
      {items.map(p => (
        <div className="tsx-proof-case-card" key={p.name}>
          <div className="tsx-proof-case-top">
            <span className="tsx-proof-case-org">{p.org}</span>
          </div>
          <p className="tsx-proof-case-headline">{p.name}</p>
          <p className="tsx-proof-case-body">{p.result.trust}</p>
        </div>
      ))}
    </div>
  );
}

/* Legacy alias so any future callers still work */
function TrustProofStrips({ items }) { return <TrustProofCards items={items} />; }

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

function TrustDeliverableCards({ rows }) {
  return (
    <div className="tsx-del-card-grid">
      {rows.map(row => (
        <div className="tsx-del-service-card" key={row.title}>
          <div className="tsx-del-service-top">
            <span className="tsx-del-service-name">{row.title}</span>
            <span className="tsx-del-service-outcome">{row.outcome}</span>
          </div>
          <div className="tsx-del-service-chips">
            {row.deliverables.map(d => (
              <span className="tsx-del-service-chip" key={d}>{d}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Legacy alias */
function TrustDeliverableRows({ rows }) { return <TrustDeliverableCards rows={rows} />; }

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

function TrustSectionOverview({ section }) {
  return (
    <div className="tsx-overview">
      <div className="tsx-section-inner">

        {/* ─── Capabilities + Audience ─────────────────────────── */}
        <div className="tsx-overview-top">
          <div className="tsx-cap-col">
            <span className="tsx-overview-label">Capabilities</span>
            <div className="tsx-cap-card-grid">
              {section.modules.map((m, i) => (
                <div className={`tsx-cap-card tsx-fade tsx-fade-d${Math.min(i + 1, 4)}`} key={m.title}>
                  <span className="tsx-cap-card-index">{String(i + 1).padStart(2, '0')}</span>
                  <p className="tsx-cap-card-title">{m.title}</p>
                  <p className="tsx-cap-card-body">{m.trust}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="tsx-audience-col">
            <div className="tsx-audience-panel tsx-fade tsx-fade-d2">
              <span className="tsx-panel-title">Who this serves</span>
              {section.audiences.map(a => (
                <div className="tsx-audience-row" key={a.title}>
                  <strong>{a.title}</strong>
                  <p>{a.trust}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <TrustStatement section={section} />

        {/* ─── What We Deliver ─────────────────────────────────── */}
        <TrustSectionBlock eyebrow="What we deliver">
          <TrustDeliverableCards rows={section.stackDetails} />
        </TrustSectionBlock>

        {/* ─── How It Works ────────────────────────────────────── */}
        <TrustSectionBlock eyebrow="How it works">
          <TrustProcessTrack steps={section.process} />
        </TrustSectionBlock>

        {/* ─── Engagement Packages ─────────────────────────────── */}
        <TrustSectionBlock eyebrow="Engagement packages">
          <TrustPackageCards packages={section.packages} />
        </TrustSectionBlock>

        {/* ─── Delivery Proof ──────────────────────────────────── */}
        <TrustSectionBlock eyebrow="Delivery proof">
          <TrustProofCards items={section.proof} />
        </TrustSectionBlock>

        {/* ─── Common Questions ────────────────────────────────── */}
        <TrustSectionBlock eyebrow="Common questions">
          <TrustFaqAccordion faqs={section.faqs} />
        </TrustSectionBlock>

        <div className="tsx-intake-band">
          <div>
            <p className="tsx-intake-heading">{section.intake.primary}</p>
            <p className="tsx-intake-sub">{section.intake.secondary}</p>
          </div>
          <button className="tsx-btn-cta" onClick={() => routeTo('trust', 'contact')}>{TRUST_SECTION_CTA[section.id] || 'Start a Project'}</button>
        </div>
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

function TrustSubpageDetail({ section, page }) {
  return (
    <div className="tsx-subpage">
      <div className="tsx-section-inner">
        <div className="tsx-subpage-callout tsx-fade">
          <h2 className="tsx-subpage-h2">{page.callout.trust}</h2>
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
        <div className="tsx-intake-band">
          <div>
            <p className="tsx-intake-heading">{section.intake.primary}</p>
            <p className="tsx-intake-sub">{section.intake.secondary}</p>
          </div>
          <button className="tsx-btn-cta" onClick={() => routeTo('trust', 'contact')}>{TRUST_SECTION_CTA[section.id] || 'Start a Project'}</button>
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
    const rgb = section.id === "academy" ? [29, 78, 216] : section.id === "labs" ? [109, 40, 217] : section.id === "marketing" ? [13, 148, 136] : [22, 24, 29];

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
          <h1 className="tsx-section-heading" style={{ color: 'var(--text)', fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 600 }}>
            {copy.title}<br />
            <span className="serif" style={{ color: TRUST_ACCENT[section.id] || '#1D4ED8' }}>{copy.accent}</span>
          </h1>
          <p className="tsx-sec-body" style={{ marginTop: '14px', maxWidth: '34em', color: 'var(--muted)', marginInline: 'auto' }}>{copy.body}</p>
          <div className="tsx-sec-actions" style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="tsx-btn-cta" onClick={() => {
              const subnav = document.querySelector(".tsx-subnav");
              subnav?.scrollIntoView({ behavior: "smooth" });
            }}>{copy.primary}</button>
            <button className="tsx-sec-btn-ghost" onClick={() => routeTo('trust', 'customers', section.id)}>{copy.secondary}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Per-division signature modules (Trust-native, light, no canvas/pin) ─── */

function TrustCohortLadder({ section }) {
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
    <section className="tsx-signature tsx-ladder-section" aria-label="The cohort path">
      <div className="tsx-section-inner">
        <div className="tsx-signature-head tsx-fade">
          <span className="tsx-section-eyebrow">The cohort path</span>
          <h2 className="tsx-section-heading">From intake<br /><span className="serif">to hiring outcome.</span></h2>
        </div>
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
      </div>
    </section>
  );
}

function TrustBlueprint({ section }) {
  const mods = (section.modules || []).slice(0, 4);
  if (!mods.length) return null;
  return (
    <section className="tsx-signature tsx-blueprint-section" aria-label="System architecture">
      <div className="tsx-section-inner">
        <div className="tsx-signature-head tsx-fade">
          <span className="tsx-section-eyebrow">System architecture</span>
          <h2 className="tsx-section-heading">How a Labs build<br /><span className="serif">fits together.</span></h2>
        </div>
        <div className="tsx-blueprint-grid">
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

function TrustSignatureModule({ section }) {
  if (section.id === 'academy') return <TrustCohortLadder section={section} />;
  if (section.id === 'labs') return <TrustBlueprint section={section} />;
  if (section.id === 'marketing') return <TrustFunnel section={section} />;
  return null;
}

function TrustSectionPage({ section, detail }) {
  const active = useMemo(() => detail ? section.subpages.find(p => p.slug === detail) : null, [section, detail]);
  if (detail && !active) return <NotFound theme="trust" page={`${section.id}/${detail}`} />;
  return (
    <main className="tsx-section-page" style={{ '--sec-accent': TRUST_ACCENT[section.id] || 'var(--accent)' }}>
      {HAS_SCROLL_ANIMATION ? (
        <TrustSectionHeroUnravel theme="trust" section={section} />
      ) : (
        <TrustSectionHeader section={section} />
      )}
      {!active && <TrustSignatureModule section={section} />}
      <TrustSubNav section={section} activeSlug={detail} />
      <div key={detail || 'overview'}>
        {active
          ? <TrustSubpageDetail section={section} page={active} />
          : <TrustSectionOverview section={section} />}
      </div>
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
            <h1 className="tsx-sec-h1">Delivery proof across the same Nexara capability map.</h1>
            <p className="tsx-sec-body">Trust presents the same work areas as Neo, but frames proof as delivery models, scope evidence and operating readiness.</p>
          </div>
          <div className="tsx-spec-panel">
            <span className="tsx-spec-panel-label">Coverage</span>
            {[
              ["3", "sections covered"],
              ["3", "proof records"],
              ["0", "invented claims"],
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
        <h2 className="tsx-section-heading tsx-overview-h">Delivery model proof</h2>
        <table className="tsx-del-table">
          <thead>
            <tr><th>Section</th><th>Engagement type</th><th>What was produced</th></tr>
          </thead>
          <tbody>
            {proofItems.map(customer => (
              <tr key={customer.id}>
                <td><strong>{customer.section}</strong></td>
                <td>{customer.company}</td>
                <td>{customer.trust}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="tsx-intake-band tsx-intake-spaced">
          <div>
            <p className="tsx-intake-heading">Start a scoped engagement</p>
            <p className="tsx-intake-sub">Tell us what you need. Nexara maps the right next step.</p>
          </div>
          <button className="tsx-btn-cta" onClick={() => routeTo("trust", "contact")}>Start a Project</button>
        </div>
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
        <h2 className="tsx-section-heading tsx-overview-h">Operating principles</h2>
        <ul className="tsx-capability-list">
          {company.principles.map((principle, index) => (
            <li className="tsx-capability-item" key={principle.title}>
              <span className="tsx-cap-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="tsx-cap-body">
                <strong>{principle.title}</strong>
                <p>{principle.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="tsx-section-inner tsx-standards-section">
        <h2 className="tsx-section-heading tsx-overview-h">Delivery governance</h2>
        <table className="tsx-del-table">
          <thead>
            <tr><th>Standard</th><th>Commitment</th></tr>
          </thead>
          <tbody>
            {DATA.company.standards.map(item => (
              <tr key={item.title}>
                <td><strong>{item.title}</strong></td>
                <td>{item.body}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="tsx-intake-band tsx-intake-spaced">
          <div>
            <p className="tsx-intake-heading">Work with Nexara</p>
            <p className="tsx-intake-sub">Pick a solution line and open an engagement.</p>
          </div>
          <button className="tsx-btn-cta" onClick={() => routeTo("trust", "contact")}>Start a Project</button>
        </div>
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
        <h2 className="tsx-section-heading tsx-heading-flush">Select a section</h2>
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
        <h2 className="tsx-section-heading tsx-heading-flush">{DATA.contact.enquiry.title}</h2>
        <p className="tsx-brief-intro">{DATA.contact.enquiry.body}</p>
        {showSuccess ? (
          <div className="tsx-intake-band">
            <div>
              <p className="tsx-intake-heading">Enquiry prepared. Your mail client will open shortly.</p>
              <p className="tsx-intake-sub">If it does not open, use the email link on this page and include the project details manually.</p>
            </div>
          </div>
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
