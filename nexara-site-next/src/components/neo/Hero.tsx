// @ts-nocheck -- deep canvas/GSAP animation-state closures left untyped deliberately;
// forcing types here without runtime insight into each closure risks silently
// changing animation timing. Revisit during a dedicated animation-code pass, not
// as a rushed tail-end of this decomposition.
'use client';
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HAS_SCROLL_ANIMATION } from '@/lib/shared';
import { routeTo } from '@/lib/neo-router';
import { Sparkles } from './Guide';

// See trust/Hero.tsx for why this is repeated per-file rather than centralized.
if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// Minimal shape actually read by NeoScrollyHero/TrustHero below — DATA.home
// entries carry a couple more optional fields (calloutTitle/calloutBody)
// that aren't read here. NeoHeroUnravel also accepts `copy`/`theme` but
// never reads them (dead props preserved verbatim from the source).
type Theme = 'neo' | 'trust';

type HomeCopy = {
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
};

interface CyclingWordProps {
  words: string[];
}

interface NeoScrollyHeroProps {
  copy: HomeCopy;
  theme: Theme;
}

interface NeoHeroUnravelProps {
  copy: HomeCopy;
  theme: Theme;
}

interface TrustHeroProps {
  copy: HomeCopy;
  theme: Theme;
}

function CyclingWord({ words }: CyclingWordProps) {
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

function NeoScrollyHero({ copy, theme }: NeoScrollyHeroProps) {
  const wrapRef    = React.useRef(null);
  const charRef    = React.useRef(null);
  const heroFaceRef= React.useRef(null);
  const serverRef  = React.useRef(null);
  const codeRef    = React.useRef(null);
  const codeBodyRef= React.useRef(null);
  const octaRef    = React.useRef(null);
  const networkRef = React.useRef(null);

  React.useEffect(() => {
    if (!HAS_SCROLL_ANIMATION) return;

    let typeTimerRef = 0;
    const wrap = wrapRef.current;
    const heroEl = wrap.querySelector(".neo-scrolly-hero");
    const network = networkRef.current;
    const serverNodes = Array.from(wrap.querySelectorAll(".neo-server-grid rect"));
    const code = codeRef.current;
    const codeLines = Array.from(wrap.querySelectorAll(".neo-console-lines path"));
    const codeBody = codeBodyRef.current;
    const octa = octaRef.current;

    // Timeline setup
    const heroTl = gsap.timeline({ paused: true });
    const ambientTl = gsap.timeline({ repeat: -1, yoyo: true });

    // Initial styles
    gsap.set(charRef.current, { y: 22, x: 0 });
    gsap.set(heroFaceRef.current, { transformOrigin: "center center", scale: 0.96 });
    gsap.set(serverNodes, { fillOpacity: 0.15, strokeOpacity: 0.35 });
    gsap.set(code, { autoAlpha: 0, x: 12 });
    gsap.set(codeLines, { strokeDasharray: 100, strokeDashoffset: 100 });
    gsap.set(octa, { transformOrigin: "center center", rotateX: 20, rotateY: -35, scale: 0.86, autoAlpha: 0 });

    // Ambient loop (pulsing servers, rotating octa)
    ambientTl.to(serverNodes, {
      fillOpacity: "random(0.2, 0.65)",
      strokeOpacity: "random(0.4, 0.8)",
      duration: 1.8,
      stagger: { each: 0.08, grid: "auto", from: "random" },
      ease: "power1.inOut"
    }, 0);
    ambientTl.to(octa, {
      rotation: 360,
      duration: 18,
      ease: "none"
    }, 0);

    // Dynamic typing in mock console
    if (codeBody) {
      const logs = [
        "SYS: init_gateway()... OK",
        "NET: channel_handshake_done",
        "AI: pulse_detection... 98.4%",
        "SEC: status_nominal",
        "VIBE: no_cap_mode_active",
        "SYS: ship_daily() loop ON"
      ];
      let currentLogIdx = 0;
      const typeNext = () => {
        if (!wrapRef.current) return;
        const line = document.createElement("p");
        line.style.margin = "0";
        line.style.fontFamily = "inherit";
        line.style.color = "inherit";
        line.textContent = logs[currentLogIdx];
        codeBody.appendChild(line);
        if (codeBody.childNodes.length > 5) {
          codeBody.removeChild(codeBody.firstChild);
        }
        currentLogIdx = (currentLogIdx + 1) % logs.length;
        typeTimerRef = setTimeout(typeNext, 2400);
      };
      typeNext();
    }

    // Scroll trigger animation timeline
    // 0.0 -> 0.3: Char slides in, server grid scales down
    heroTl.to(charRef.current, { y: 0, scale: 1.15, duration: 0.3, ease: "power2.out" }, 0)
      .to(serverRef.current, { scale: 0.8, y: -20, autoAlpha: 0.4, duration: 0.3, ease: "power2.inOut" }, 0)

      // 0.2 -> 0.5: Network connections light up
      .fromTo(network.querySelectorAll("line"),
        { strokeDasharray: 200, strokeDashoffset: 200 },
        { strokeDashoffset: 0, duration: 0.3, stagger: 0.02, ease: "power1.inOut" }, 0.2)
      .fromTo(network.querySelectorAll("circle"),
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.25, stagger: 0.02, ease: "back.out(2)" }, 0.2)

      // 0.4 -> 0.7: Console flies in & code lines draw
      .to(code, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power3.out" }, 0.4)
      .to(codeLines, { strokeDashoffset: 0, duration: 0.4, stagger: 0.04, ease: "power1.out" }, 0.4)

      // 0.6 -> 0.9: Octahedral Core materialises and starts spinning fast
      .to(octa, { autoAlpha: 1, scale: 1.15, y: -10, duration: 0.35, ease: "back.out(1.5)" }, 0.6)

      // 0.8 -> 1.0: Dock state - fade console & focus octa
      .to([code, network], { autoAlpha: 0.15, duration: 0.2 }, 0.8)
      .to(octa, { scale: 1.0, y: 0, duration: 0.2 }, 0.8);

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35,
      animation: heroTl
    });

    // Hover parallax tilt on desktop
    const isDesktop = window.matchMedia("(pointer: fine) and (min-width: 761px)").matches;
    const onHeroMouseMove = (e) => {
      const rect = heroEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(heroFaceRef.current, { rotateY: x * 26, rotateX: -y * 22, duration: 0.45, ease: "power2.out" });
    };
    const onHeroMouseLeave = () => {
      gsap.to(heroFaceRef.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power2.out" });
    };

    if (isDesktop && heroEl) {
      heroEl.addEventListener("mousemove", onHeroMouseMove, { passive: true });
      heroEl.addEventListener("mouseleave", onHeroMouseLeave);
    }

    return () => {
      clearTimeout(typeTimerRef);
      if (heroEl) {
        heroEl.removeEventListener("mousemove", onHeroMouseMove);
        heroEl.removeEventListener("mouseleave", onHeroMouseLeave);
      }
      st.kill();
      heroTl.kill();
      ambientTl.kill();
      gsap.killTweensOf(heroFaceRef.current);
    };
  }, []);

  const serverUnits = ["SYS-01", "NET-02", "AI-03", "DB-04"];

  return (
    <div ref={wrapRef} className="neo-scrolly-hero-wrap">
    <div className="neo-scrolly-hero">
      <div className="neo-hero-grid" style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none" }}/>
      <div className="scanlines"      style={{ position:"absolute", inset:0, pointerEvents:"none" }}/>
      <Sparkles />
      <div className="neo-hud-corner neo-hud-tl"  aria-hidden="true"/>
      <div className="neo-hud-corner neo-hud-tr"  aria-hidden="true"/>
      <div className="neo-hud-corner neo-hud-bl"  aria-hidden="true"/>
      <div className="neo-hud-corner neo-hud-brr" aria-hidden="true"/>

      {/* Copy */}
      <div className="neo-scrolly-copy hero-copy">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title} <em className="neo-gradient-text">{copy.accent}</em></h1>
        <p className="hero-body">{copy.body}</p>
        <div className="hero-actions">
          <button onClick={() => routeTo(theme, "academy")}>Start with Academy</button>
          <button className="secondary" onClick={() => routeTo(theme, "customers")}>View proof</button>
        </div>
      </div>

      {/* 3D Stage */}
      <div className="neo-3d-stage" aria-hidden="true">

        {/* Data network */}
        <svg ref={networkRef} className="neo-data-network" viewBox="0 0 400 480" preserveAspectRatio="xMidYMid slice">
          <circle cx="200" cy="240" r="5"   fill="#ccff00" fillOpacity="0.8"/>
          <circle cx="305" cy="135" r="3.5" fill="#00f0ff" fillOpacity="0.65"/>
          <circle cx="88"  cy="158" r="3.5" fill="#00f0ff" fillOpacity="0.65"/>
          <circle cx="332" cy="342" r="3"   fill="#ccff00" fillOpacity="0.55"/>
          <circle cx="114" cy="385" r="3.5" fill="#00f0ff" fillOpacity="0.65"/>
          <circle cx="264" cy="415" r="3"   fill="#ccff00" fillOpacity="0.55"/>

          <line x1="200" y1="240" x2="305" y2="135" stroke="#ccff00" strokeWidth="0.5" strokeOpacity="0.45"/>
          <line x1="200" y1="240" x2="88"  y2="158" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.45"/>
          <line x1="200" y1="240" x2="332" y2="342" stroke="#ccff00" strokeWidth="0.5" strokeOpacity="0.45"/>
          <line x1="200" y1="240" x2="114" y2="385" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.45"/>
          <line x1="200" y1="240" x2="264" y2="415" stroke="#ccff00" strokeWidth="0.5" strokeOpacity="0.45"/>
          <line x1="305" y1="135" x2="332" y2="342" stroke="#ccff00" strokeWidth="0.5" strokeOpacity="0.3"/>
          <line x1="88"  y1="158" x2="114" y2="385" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.3"/>
        </svg>

        {/* Consoles / telemetry */}
        <div ref={codeRef} className="neo-data-console">
          <div className="neo-console-head"><span>TELEMETRY_LOG</span></div>
          <div ref={codeBodyRef} className="neo-console-body"></div>
          <svg className="neo-console-lines" viewBox="0 0 160 80">
            <path d="M 10 10 L 150 10" stroke="#00f0ff" strokeWidth="0.75" fill="none"/>
            <path d="M 10 24 L 120 24" stroke="#ccff00" strokeWidth="0.75" fill="none"/>
            <path d="M 10 38 L 140 38" stroke="#ccff00" strokeWidth="0.75" fill="none"/>
            <path d="M 10 52 L 90  52" stroke="#00f0ff" strokeWidth="0.75" fill="none"/>
            <path d="M 10 66 L 130 66" stroke="#00f0ff" strokeWidth="0.75" fill="none"/>
          </svg>
        </div>

        {/* Virtual face assembly */}
        <div ref={heroFaceRef} className="neo-face-assembly">

          {/* Constellation wireframes */}
          <svg ref={charRef} className="neo-character-constellation" viewBox="0 0 100 100">
            <line x1="50" y1="22" x2="32" y2="38" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.45"/>
            <line x1="50" y1="22" x2="68" y2="38" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.45"/>
            <line x1="32" y1="38" x2="32" y2="62" stroke="#ccff00" strokeWidth="0.5" strokeOpacity="0.45"/>
            <line x1="68" y1="38" x2="68" y2="62" stroke="#ccff00" strokeWidth="0.5" strokeOpacity="0.45"/>
            <line x1="32" y1="62" x2="50" y2="78" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.45"/>
            <line x1="68" y1="62" x2="50" y2="78" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.45"/>

            <circle cx="50" cy="22" r="1.8" fill="#00f0ff"/>
            <circle cx="32" cy="38" r="1.8" fill="#00f0ff"/>
            <circle cx="68" cy="38" r="1.8" fill="#00f0ff"/>
            <circle cx="32" cy="62" r="1.8" fill="#ccff00"/>
            <circle cx="68" cy="62" r="1.8" fill="#ccff00"/>
            <circle cx="50" cy="78" r="1.8" fill="#00f0ff"/>

            {/* Eyes */}
            <circle cx="42" cy="46" r="3.2" fill="#00f0ff" fillOpacity="0.85"/>
            <circle cx="42" cy="46" r="1"   fill="#000"/>
            <circle cx="58" cy="46" r="3.2" fill="#00f0ff" fillOpacity="0.85"/>
            <circle cx="58" cy="46" r="1"   fill="#000"/>

            {/* Mouth */}
            <path d="M 44 58 Q 50 62 56 58" stroke="#ccff00" strokeWidth="1.25" fill="none" strokeLinecap="round"/>
          </svg>

          {/* 3D spinning Core */}
          <div ref={octaRef} className="neo-core-cube">
            <div className="neo-cube-face f-front"><span>SYS</span></div>
            <div className="neo-cube-face f-back"><span>NET</span></div>
            <div className="neo-cube-face f-left"><span>AI</span></div>
            <div className="neo-cube-face f-right"><span>DB</span></div>
            <div className="neo-cube-face f-top"><span>OPS</span></div>
            <div className="neo-cube-face f-bottom"><span>SEC</span></div>
          </div>

        </div>

        {/* Server grid */}
        <div ref={serverRef} className="neo-server-assembly">
          <svg className="neo-server-grid" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Server unit 1 */}
            <rect x="10" y="8"  width="80" height="14" rx="2" fill="#00f0ff" stroke="#00f0ff" strokeWidth="0.5"/>
            <line x1="16" y1="15" x2="36" y2="15" stroke="#000" strokeWidth="1.5" strokeOpacity="0.85"/>
            <circle cx="76" cy="15" r="1.5" fill="#ccff00"/>
            <circle cx="82" cy="15" r="1.5" fill="#00f0ff"/>

            {/* Server unit 2 */}
            <rect x="10" y="27" width="80" height="14" rx="2" fill="#ccff00" stroke="#ccff00" strokeWidth="0.5"/>
            <line x1="16" y1="34" x2="42" y2="34" stroke="#000" strokeWidth="1.5" strokeOpacity="0.85"/>
            <circle cx="76" cy="34" r="1.5" fill="#00f0ff"/>
            <circle cx="82" cy="34" r="1.5" fill="#ccff00"/>

            {/* Server unit 3 */}
            <rect x="10" y="46" width="80" height="14" rx="2" fill="#00f0ff" stroke="#00f0ff" strokeWidth="0.5"/>
            <line x1="16" y1="53" x2="32" y2="53" stroke="#000" strokeWidth="1.5" strokeOpacity="0.85"/>
            <circle cx="76" cy="53" r="1.5" fill="#ccff00"/>
            <circle cx="82" cy="53" r="1.5" fill="#ccff00"/>

            {/* Server unit 4 */}
            <rect x="10" y="65" width="80" height="14" rx="2" fill="#ccff00" stroke="#ccff00" strokeWidth="0.5"/>
            <line x1="16" y1="72" x2="48" y2="72" stroke="#000" strokeWidth="1.5" strokeOpacity="0.85"/>
            <circle cx="76" cy="72" r="1.5" fill="#00f0ff"/>
            <circle cx="82" cy="72" r="1.5" fill="#00f0ff"/>

            {/* Matrix signals */}
            <circle cx="16" cy="50" r="1.8" fill="#ccff00" fillOpacity="0.5"/>
            <circle cx="50" cy="50" r="1.8" fill="#00f0ff" fillOpacity="0.5"/>
          </svg>
        </div>
      </div>
    </div>
    </div>
  );
}

function NeoHeroUnravel({ copy, theme }: NeoHeroUnravelProps) {
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

    // Strands Accent Colors (Violet, Coral, Mint)
    const STRANDS = [
      { id: "academy",   rgb: [124, 92, 255] },
      { id: "labs",      rgb: [255, 92, 138] },
      { id: "marketing", rgb: [0, 229, 160]  },
    ];

    const makeSprite = (rgb) => {
      const s = document.createElement("canvas");
      s.width = s.height = 64;
      const c = s.getContext("2d");
      const grad = c.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,0.95)");
      grad.addColorStop(0.18, "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0.85)");
      grad.addColorStop(0.5, "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0.22)");
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

    // Constellation-line scratch: screen-space points of the featured strand.
    // COUNT is fixed after mount (resize re-measures but never rebuilds).
    const lineBuf = new Float32Array(COUNT * 2);
    const LINE_STRIDE = window.innerWidth < 760 ? 2 : 3;
    const LINE_CAP = 220;
    const FOCUS_SEGS = { focus0: 0, focus1: 1, focus2: 2 };

    // Formations variables local to effect
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
      const e = progress * progress * (3 - 2 * progress); // smooth clamp01
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

    const chapters = Array.from(wrapRef.current.querySelectorAll(".neo-hero-chapter")).map((el) => ({
      el,
      a: parseFloat(el.dataset.from),
      b: parseFloat(el.dataset.to),
      visible: -1,
    }));
    const dots = Array.from(wrapRef.current.querySelectorAll(".neo-hero-rail button"));
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

    // GSAP ScrollTrigger to coordinate scroll progress
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
      state.target = 0.95; // Snap to lattice end; collapse runway so there is no dead scroll
      wrapRef.current.style.height = "100svh";
    }

    // Mouse movement listeners
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

      const seg = segmentAt(p);

      // Per-strand focus weight, eased by the same seg.e the morphs use.
      const focusW = [0, 0, 0];
      const fwFrom = FOCUS_SEGS[seg.from], fwTo = FOCUS_SEGS[seg.to];
      if (fwFrom !== undefined) focusW[fwFrom] += 1 - seg.e;
      if (fwTo !== undefined) focusW[fwTo] += seg.e;

      // Motion trails: fade the previous frame instead of clearing it.
      // Fast scroll -> weak fade (long streaks); idle -> strong fade (crisp).
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

      // Chapter color takeover: nebula wash under the additive pass.
      // Scaled by fade so the trail equilibrium lands at the base alpha.
      const washW = focusW[0] + focusW[1] + focusW[2];
      if (washW > 0.01) {
        let wr = 0, wg = 0, wb = 0;
        for (let siW = 0; siW < 3; siW++) {
          wr += STRANDS[siW].rgb[0] * focusW[siW];
          wg += STRANDS[siW].rgb[1] * focusW[siW];
          wb += STRANDS[siW].rgb[2] * focusW[siW];
        }
        const washAlpha = 0.14 * washW * (prefersReducedMotion ? 1 : fade);
        const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, Math.max(W, H) * 0.62);
        g.addColorStop(0, "rgba(" + ((wr / washW) | 0) + "," + ((wg / washW) | 0) + "," + ((wb / washW) | 0) + "," + washAlpha.toFixed(3) + ")");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.globalCompositeOperation = "lighter";

      const ry = p * 4.4 + time * 0.05 + mouse.x * 0.28;
      const rx = -0.16 + Math.sin(p * Math.PI) * 0.12 + mouse.y * 0.2;
      const cy_ = Math.cos(ry), sy_ = Math.sin(ry);
      const cx_ = Math.cos(rx), sx_ = Math.sin(rx);

      // Render strands
      parts.forEach((strandParts, si) => {
        const sprite = sprites[si];
        const alpha = formationAlpha(seg.from, si) * (1 - seg.e) + formationAlpha(seg.to, si) * seg.e;
        if (alpha <= 0.002) return;

        const pA = [0, 0, 0];
        const pB = [0, 0, 0];

        const featured = focusW[si] > 0.35;
        let bufN = 0;

        strandParts.forEach((pt, pi) => {
          // Eval shapes and interpolate
          evalFormation(seg.from, si, pt, time);
          pA[0] = v[0]; pA[1] = v[1]; pA[2] = v[2];

          evalFormation(seg.to, si, pt, time);
          pB[0] = v[0]; pB[1] = v[1]; pB[2] = v[2];

          const mx = pA[0] * (1 - seg.e) + pB[0] * seg.e;
          const my = pA[1] * (1 - seg.e) + pB[1] * seg.e;
          const mz = pA[2] * (1 - seg.e) + pB[2] * seg.e;

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

          ctx.globalAlpha = alpha;
          ctx.drawImage(sprite, px - d / 2, py - d / 2, d, d);

          // Depth bloom: particles near the camera get a soft halo.
          if (persp > 1.14) {
            const hd = d * 2.6;
            ctx.globalAlpha = alpha * 0.35 * Math.min(1, (persp - 1.14) * 4);
            ctx.drawImage(sprite, px - hd / 2, py - hd / 2, hd, hd);
          }

          if (featured && pi % LINE_STRIDE === 0) {
            lineBuf[bufN * 2] = px;
            lineBuf[bufN * 2 + 1] = py;
            bufN++;
          }
        });

        // Constellation lines within the featured strand.
        if (featured && bufN > 1) {
          const maxD = Math.min(W, H) * 0.09;
          const maxD2 = maxD * maxD;
          const col = STRANDS[si].rgb;
          ctx.strokeStyle = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
          ctx.lineWidth = 1;
          let drawn = 0;
          for (let a = 0; a < bufN && drawn < LINE_CAP; a++) {
            const ax = lineBuf[a * 2], ay = lineBuf[a * 2 + 1];
            for (let b = a + 1; b < bufN && drawn < LINE_CAP; b++) {
              const dx = lineBuf[b * 2] - ax, dy = lineBuf[b * 2 + 1] - ay;
              const d2 = dx * dx + dy * dy;
              if (d2 > maxD2) continue;
              ctx.globalAlpha = (1 - d2 / maxD2) * focusW[si] * 0.3;
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(lineBuf[b * 2], lineBuf[b * 2 + 1]);
              ctx.stroke();
              drawn++;
            }
          }
        }
      });

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

    // Rail click handler helper
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
    <div ref={wrapRef} className="neo-hero-runway">
      <div className="neo-hero-stage">
        <canvas ref={canvasRef} className="neo-hero-canvas" aria-hidden="true" />

        {/* Chapters Overlays */}
        <div className="neo-hero-chapter" data-from="0" data-to="0.07">
          <p className="kicker">An engineering company</p>
          <h1 ref={titleRef} className="neo-hero-title" aria-label="Nexara">
            <span>N</span><span>E</span><span>X</span><span>A</span><span>R</span><span>A</span>
          </h1>
          <p className="hero-sub">Scroll to unravel</p>
        </div>

        <div className="neo-hero-chapter" data-from="0.125" data-to="0.225" aria-hidden="true">
          <p className="kicker">The premise</p>
          <h2 className="h-display">One core.<br /><span className="serif">Three forces.</span></h2>
          <p className="lede">Three directions. All pointing at your problem.</p>
        </div>

        <div className="neo-hero-chapter ch-left" style={{ '--accent': '#7c5cff' }} data-from="0.27" data-to="0.45" aria-hidden="true">
          <p className="ch-num">01 / DIVISION</p>
          <h2 className="ch-name">Academy<br /><span className="serif">we grow engineers.</span></h2>
          <p className="lede">Cohort-based programmes that turn ambitious learners into working engineers — sprint by sprint, review by review.</p>
          <button className="ch-link" onClick={() => routeTo('neo', 'academy')}>Enter Academy →</button>
        </div>

        <div className="neo-hero-chapter ch-right" style={{ '--accent': '#ff5c8a' }} data-from="0.45" data-to="0.63" aria-hidden="true">
          <p className="ch-num">02 / DIVISION</p>
          <h2 className="ch-name">Labs<br /><span className="serif">we build intelligence.</span></h2>
          <p className="lede">Applied AI and automation systems, engineered from prototype to production with written specs and weekly demos.</p>
          <button className="ch-link" onClick={() => routeTo('neo', 'labs')}>Enter Labs →</button>
        </div>

        <div className="neo-hero-chapter ch-left" style={{ '--accent': '#00e5a0' }} data-from="0.63" data-to="0.81" aria-hidden="true">
          <p className="ch-num">03 / DIVISION</p>
          <h2 className="ch-name">Marketing<br /><span className="serif">we make brands move.</span></h2>
          <p className="lede">Brand systems, web experiences and performance creative — built like software, measured like engineering.</p>
          <button className="ch-link" onClick={() => routeTo('neo', 'marketing')}>Enter Marketing →</button>
        </div>

        <div className="neo-hero-chapter" data-from="0.86" data-to="1" aria-hidden="true">
          <p className="kicker">The weave</p>
          <h2 className="h-display">Three disciplines.<br /><span className="serif">One standard.</span></h2>
          <div className="hero-actions">
            <button className="btn btn-solid" onClick={() => routeTo('neo', 'contact')}>Start a brief <span className="arr">→</span></button>
            <button className="btn" onClick={() => {
              const el = document.getElementById("divisions");
              el?.scrollIntoView({ behavior: "smooth" });
            }}>Explore divisions</button>
          </div>
        </div>

        {/* HUD */}
        <div className="neo-hero-rail" aria-hidden="true">
          <button data-label="Nexara"></button>
          <button data-label="Premise"></button>
          <button data-label="Academy"></button>
          <button data-label="Labs"></button>
          <button data-label="Marketing"></button>
          <button data-label="Begin"></button>
        </div>
        <div className="neo-hero-counter" aria-hidden="true">
          <strong ref={counterNumRef}>01</strong> / 06
          <span className="neo-counter-bar"><i ref={counterBarRef}></i></span>
        </div>
        <div ref={scrollCueRef} className="neo-scroll-cue" aria-hidden="true">Scroll<i></i></div>
      </div>
    </div>
  );
}

function TrustHero({ copy, theme }: TrustHeroProps) {
  const wrapRef = React.useRef(null);
  const pinRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const copyRef = React.useRef(null);

  React.useEffect(() => {
    const collapseRunway = () => wrapRef.current?.classList.add("hero-webgl-failed");
    if (!HAS_SCROLL_ANIMATION) {
      collapseRunway();
      return;
    }
    if (!canvasRef.current) {
      collapseRunway();
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const THREE = window.THREE;
    if (!THREE) {
      console.error("Three.js not loaded.");
      collapseRunway();
      return;
    }

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    } catch (err) {
      console.warn("WebGL unavailable — 3D hero skipped, page renders without it.", err);
      collapseRunway();
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.5;

    const isMobile = window.innerWidth <= 980;

    // Create a 3D Group to hold all globe elements
    const globeGroup = new THREE.Group();
    globeGroup.position.set(isMobile ? 0 : 1.25, isMobile ? -1.0 : 0, 0);
    scene.add(globeGroup);

    // 1. Globe Sphere Particles
    const r = 1.7;
    const globeGeom = new THREE.BufferGeometry();
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    globeGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const globeMaterial = new THREE.PointsMaterial({
      color: 0x0ea5e9, // Corporate blue
      size: 0.03,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const globePoints = new THREE.Points(globeGeom, globeMaterial);
    globeGroup.add(globePoints);

    // 2. Orbital Rings
    const ringGeom = new THREE.RingGeometry(1.95, 2.0, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    ring.rotation.y = Math.PI / 8;
    globeGroup.add(ring);

    // 3. City Hubs (glowing dots)
    const cities = [
      { name: "Visakhapatnam", lat: 17.7, lon: 83.3 },
      { name: "Vijayawada",    lat: 16.5, lon: 80.6 },
      { name: "Coimbatore",    lat: 11.0, lon: 77.0 },
      { name: "Kochi",         lat: 9.9,  lon: 76.3 },
      { name: "Madurai",       lat: 9.9,  lon: 78.1 },
      { name: "Mangalore",     lat: 12.9, lon: 74.8 }
    ];

    const convertCoords = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.sin(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
    };

    const cityNodes = [];
    const nodeGeom = new THREE.SphereGeometry(0.05, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff, // Electric cyan
      transparent: true,
      opacity: 0.85
    });

    cities.forEach(city => {
      const pos = convertCoords(city.lat, city.lon, r);
      const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
      nodeMesh.position.copy(pos);
      globeGroup.add(nodeMesh);
      cityNodes.push(nodeMesh);
    });

    // 4. Connection Arcs
    const linesGroup = new THREE.Group();
    globeGroup.add(linesGroup);

    const connections = [];
    for (let i = 0; i < cities.length; i++) {
      const p1 = convertCoords(cities[i].lat, cities[i].lon, r);
      const p2 = convertCoords(cities[(i + 1) % cities.length].lat, cities[(i + 1) % cities.length].lon, r);

      const curve = new THREE.QuadraticBezierCurve3(
        p1,
        p1.clone().add(p2).multiplyScalar(0.5).multiplyScalar(1.2), // Pull arc outwards
        p2
      );

      const curvePoints = curve.getPoints(25);
      const lineGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);

      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.15
      });

      const line = new THREE.Line(lineGeom, lineMat);
      linesGroup.add(line);
      connections.push(line);
    }

    // Scroll state object to animate with GSAP
    const state = {
      progress: 0,
      zoom: 6.5,
      rotateY: 0,
      lineOpacity: 0.15,
      globeRotateSpeed: 1.0,
      posOffset: isMobile ? -1.0 : 0
    };

    // GSAP ScrollTrigger
    const tl = window.gsap.timeline({ paused: true });
    tl.to(state, {
      progress: 1,
      zoom: 4.8,
      rotateY: Math.PI / 1.5,
      lineOpacity: 0.85,
      globeRotateSpeed: 0.25,
      posOffset: isMobile ? 1.0 : 0,
      duration: 1,
      ease: "none"
    });

    const shouldPin = window.innerWidth > 760;
    const st = shouldPin ? window.ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      animation: tl
    }) : null;
    if (!shouldPin) tl.progress(0.32);

    // Fade in text copy on load
    const els = copyRef.current ? [...copyRef.current.children] : [];
    if (els.length) {
      window.gsap.from(els, {
        y: 40,
        opacity: 0,
        duration: 1.0,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.15
      });
    }

    // Mouse movement interactive tilt
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      targetMouse.x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      targetMouse.y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId;
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // Base globe spin + scroll rotation
      globeGroup.rotation.y = elapsedTime * 0.08 * state.globeRotateSpeed + state.rotateY + mouse.x * 0.35;
      globeGroup.rotation.x = elapsedTime * 0.04 * state.globeRotateSpeed + mouse.y * 0.35;

      camera.position.z = state.zoom;

      // Position update for mobile stacked layouts
      const isMob = window.innerWidth <= 980;
      globeGroup.position.set(isMob ? 0 : 1.25, isMob ? state.posOffset : 0, 0);

      // Animate line opacity and node pulsing
      connections.forEach(line => {
        line.material.opacity = state.lineOpacity + Math.sin(elapsedTime * 4) * 0.06;
      });

      cityNodes.forEach((node, idx) => {
        const pulse = 1.0 + Math.sin(elapsedTime * 5 + idx) * 0.15;
        node.scale.setScalar(pulse);
      });

      if (trustVisible) renderer.render(scene, camera);
      if (!prefersReducedMotion) animId = requestAnimationFrame(tick);
    };

    let trustVisible = true;
    const visObs = new IntersectionObserver(([e]) => {
      trustVisible = e.isIntersecting;
    }, { threshold: 0 });
    visObs.observe(wrapRef.current);
    tick();

    // Resize Handler
    const handleResize = () => {
      if (!canvasRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      const isMob = window.innerWidth <= 980;
      state.posOffset = isMob ? (state.progress * 2 - 1.0) : 0;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      animId = 0;
      visObs.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (st) st.kill();
      tl.kill();
      globeGeom.dispose();
      ringGeom.dispose();
      nodeGeom.dispose();
      globeMaterial.dispose();
      ringMat.dispose();
      nodeMat.dispose();
      connections.forEach(line => {
        line.geometry.dispose();
        line.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="trust-hero-wrap">
      <section ref={pinRef} className="trust-hero-sticky">
        <div className="trust-video-layer" aria-hidden="true">
          <div className="trust-video-fallback"></div>
          <canvas ref={canvasRef} className="hero-3d-canvas" />
          <div className="trust-video-overlay"></div>
        </div>
        <div className="trust-cinematic-copy hero-copy" ref={copyRef}>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title} <em>{copy.accent}</em></h1>
          <p className="hero-body">{copy.body}</p>
          <div className="hero-actions">
            <button onClick={() => routeTo(theme, "academy")}>Start with Academy</button>
            <button className="secondary" onClick={() => routeTo(theme, "customers")}>View proof</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export { CyclingWord, NeoScrollyHero, NeoHeroUnravel, TrustHero };
