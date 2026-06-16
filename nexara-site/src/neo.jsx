import React from 'react';
import ReactDOM from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { NotFound } from './notfound.jsx';
if (typeof window !== 'undefined') Object.assign(window, { THREE, gsap, ScrollTrigger });
import { DATA } from './data.js';
import { voice, parseRoute, routeTo, useBriefForm, STATIC_PAGES, HAS_SCROLL_ANIMATION, SECTION_HERO_WORDS } from './shared.js';
const { useState, useMemo, useEffect, useRef, useCallback, useLayoutEffect, useReducer } = React;

function CyclingWord({ words }) {
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
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

const CARD_MOTION = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
  }
};
/* ==========================================================================
   ADVANCED HYBRID PARALLAX & COSMETIC MODULES - BACKPORT FROM DUO-THEME
   ========================================================================== */

function useScrollY() {
  const [y, setY] = useState(0);
  React.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setY(window.scrollY);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return y;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

/* Deleted — replaced by RAF loop inside NexaraUnbox (no React state on scroll) */

const SPARKLE_DATA = [
  { left: "8%",  top: "18%", delay: "0s",   duration: "10s", char: "✦" },
  { left: "84%", top: "12%", delay: "1.5s", duration: "12s", char: "✸" },
  { left: "70%", top: "65%", delay: "3s",   duration: "11s", char: "✦" },
  { left: "15%", top: "72%", delay: "0.8s", duration: "13s", char: "✸" },
  { left: "48%", top: "28%", delay: "2s",   duration: "8s",  char: "✦" },
  { left: "92%", top: "50%", delay: "4s",   duration: "14s", char: "✸" },
];
function Sparkles() {
  const layerRef = React.useRef(null);
  React.useEffect(() => {
    let raf = 0;
    let visible = true;
    const tick = () => {
      if (visible && layerRef.current)
        layerRef.current.style.transform = `translateY(${window.scrollY * 0.45}px)`;
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    if (layerRef.current) io.observe(layerRef.current.closest(".neo-hero-sticky") || layerRef.current);
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);
  return (
    <div className="sparkles-layer" ref={layerRef}>
      {SPARKLE_DATA.map((p, i) => (
        <span key={i} className="sparkle-star" style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration }}>{p.char}</span>
      ))}
    </div>
  );
}

function InfiniteMarquee() {
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

function LabsStatsStrip() {
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


/* ── Neo avatar SVG — shared by hero and guide ──────────────────── */
function NeoAvatarSVG({ id = "neo-avatar", className = "" }) {
  return (
    <svg id={id} className={`neo-avatar-svg ${className}`} viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Signal rings */}
      <circle className="neo-sig-ring-3" cx="50" cy="38" r="46" stroke="#ccff00" strokeWidth="0.4"/>
      <circle className="neo-sig-ring-2" cx="50" cy="38" r="37" stroke="#00f0ff" strokeWidth="0.4"/>
      <circle className="neo-sig-ring-1" cx="50" cy="38" r="28" stroke="#ccff00" strokeWidth="0.5"/>
      {/* Core glow */}
      <polygon className="neo-core-glow" points="50,8 76,23 76,53 50,68 24,53 24,23" fill="rgba(0,240,255,0.04)"/>
      {/* Face plate */}
      <polygon id={`${id}-hex`} points="50,8 76,23 76,53 50,68 24,53 24,23" fill="rgba(0,4,2,0.97)" stroke="#ccff00" strokeWidth="1.4"/>
      {/* Inner ring */}
      <polygon points="50,16 69,27 69,49 50,60 31,49 31,27" fill="none" stroke="#00f0ff" strokeWidth="0.4" strokeOpacity="0.32"/>
      {/* Circuit traces */}
      <path d="M 24 38 L 33 38 L 33 29" stroke="#ccff00" strokeWidth="0.4" strokeOpacity="0.48" fill="none"/>
      <path d="M 76 38 L 67 38 L 67 29" stroke="#ccff00" strokeWidth="0.4" strokeOpacity="0.48" fill="none"/>
      <line x1="38" y1="21" x2="62" y2="21" stroke="#ccff00" strokeWidth="0.3" strokeOpacity="0.22"/>
      {/* Left eye */}
      <g id={`${id}-eye-l`} className="neo-eye-l">
        <circle cx="38" cy="36" r="5.5" fill="#001616"/>
        <g id={`${id}-pupil-l`} className="neo-pupil">
          <circle cx="38" cy="36" r="4"   fill="#00f0ff"/>
          <circle cx="38" cy="36" r="6.5" fill="#00f0ff" fillOpacity="0.1"/>
          <circle cx="39.2" cy="34.8" r="1.4" fill="rgba(255,255,255,0.88)"/>
          <circle cx="37"   cy="37.5" r="0.7" fill="rgba(255,255,255,0.4)"/>
        </g>
        {/* Sass brow — hidden until expression engine raises it */}
        <line id={`${id}-brow-l`} x1="33" y1="29" x2="43" y2="29" stroke="#ccff00" strokeWidth="1.2" strokeLinecap="round" opacity="0"/>
      </g>
      {/* Right eye */}
      <g id={`${id}-eye-r`} className="neo-eye-r">
        <circle cx="62" cy="36" r="5.5" fill="#001616"/>
        <g id={`${id}-pupil-r`} className="neo-pupil">
          <circle cx="62" cy="36" r="4"   fill="#00f0ff"/>
          <circle cx="62" cy="36" r="6.5" fill="#00f0ff" fillOpacity="0.1"/>
          <circle cx="63.2" cy="34.8" r="1.4" fill="rgba(255,255,255,0.88)"/>
          <circle cx="61"   cy="37.5" r="0.7" fill="rgba(255,255,255,0.4)"/>
        </g>
        <line id={`${id}-brow-r`} x1="57" y1="29" x2="67" y2="29" stroke="#ccff00" strokeWidth="1.2" strokeLinecap="round" opacity="0"/>
      </g>
      {/* Mouth */}
      <path id={`${id}-mouth`} d="M 37 54 Q 50 60 63 54" stroke="#ccff00" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      {/* Antenna */}
      <line x1="50" y1="8" x2="50" y2="1" stroke="#ccff00" strokeWidth="1"/>
      <circle cx="50" cy="0" r="2.2" fill="#ccff00" className="neo-led-inner"/>
      <circle cx="50" cy="0" r="4.5" fill="#ccff00" fillOpacity="0.18" className="neo-led-outer"/>
      {/* Body stem */}
      <line x1="50" y1="68" x2="50" y2="81" stroke="#ccff00" strokeWidth="0.9" strokeOpacity="0.7"/>
      <circle cx="50" cy="84" r="3.8" fill="#ccff00" fillOpacity="0.88"/>
      <circle cx="50" cy="84" r="6.5" fill="#ccff00" fillOpacity="0.12"/>
      {/* Left arm */}
      <g id={`${id}-arm-l`}>
        <line id={`${id}-arm-l-line`} x1="24" y1="38" x2="13" y2="31" stroke="#00f0ff" strokeWidth="0.7" strokeOpacity="0.6"/>
        <circle id={`${id}-arm-l-node`} cx="11" cy="30" r="2.8" fill="#00f0ff" fillOpacity="0.72"/>
        <circle cx="11" cy="30" r="5" fill="#00f0ff" fillOpacity="0.11"/>
      </g>
      {/* Right arm */}
      <g id={`${id}-arm-r`}>
        <line id={`${id}-arm-r-line`} x1="76" y1="38" x2="87" y2="31" stroke="#00f0ff" strokeWidth="0.7" strokeOpacity="0.6"/>
        <circle id={`${id}-arm-r-node`} cx="89" cy="30" r="2.8" fill="#00f0ff" fillOpacity="0.72"/>
        <circle cx="89" cy="30" r="5" fill="#00f0ff" fillOpacity="0.11"/>
      </g>
      {/* Bottom float nodes */}
      <line x1="50" y1="84" x2="35" y2="97" stroke="#ccff00" strokeWidth="0.5" strokeOpacity="0.4"/>
      <circle cx="33" cy="99" r="2.2" fill="#ccff00" fillOpacity="0.55"/>
      <line x1="50" y1="84" x2="65" y2="97" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.4"/>
      <circle cx="67" cy="99" r="2.2" fill="#00f0ff" fillOpacity="0.55"/>
    </svg>
  );
}


function NeoScrollyHero({ copy, theme }) {
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

/* ── Scrollytelling guide (phases 2 & 3) ───────────────────────── */
function NeoGuide() {
  const guideRef    = React.useRef(null);
  const charWrapRef = React.useRef(null);
  const bubbleRef   = React.useRef(null);
  const tagRef      = React.useRef(null);
  const beaconRef   = React.useRef(null);
  const spotlightRef= React.useRef(null);
  const burstRef    = React.useRef(null);

  React.useEffect(() => {
    if (!HAS_SCROLL_ANIMATION) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const guide     = guideRef.current;
    const charWrap  = charWrapRef.current;
    const bubble    = bubbleRef.current;
    const tag       = tagRef.current;
    const beacon    = beaconRef.current;
    const spotlight = spotlightRef.current;
    const burst     = burstRef.current;
    const triggers  = [];
    const guideHomeHero = document.querySelector(".neo-scrolly-hero-wrap");
    const isDesktopFollower = window.matchMedia("(pointer: fine) and (min-width: 761px)").matches;

    guide.classList.toggle("is-cursor-guide", isDesktopFollower);
    guide.classList.toggle("is-scroll-guide", !isDesktopFollower);
    gsap.set(guide,     { autoAlpha: 0 });
    gsap.set(charWrap,  { y: "58vh", x: 0 });
    gsap.set(bubble,    { autoAlpha: 0, y: 10 });
    gsap.set(tag,       { autoAlpha: 0, x: 14 });
    gsap.set(beacon,    { width: 0 });
    gsap.set(spotlight, { autoAlpha: 0, top: "58vh" });
    if (burst) gsap.set(burst, { autoAlpha: 0, scale: 0.2 });

    // --- shared brain: defined once, driven by desktop (cursor) AND mobile (touch/scroll) ---
      const clean = (text) => (text || "").replace(/\s+/g, " ").trim();
      const shorten = (text, max = 46) => {
        const t = clean(text);
        return t.length > max ? `${t.slice(0, max).trim()}…` : t;
      };
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      const textFrom = (node, selector) => clean(node?.querySelector(selector)?.textContent);
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      let guideLive = false;
      let lastKey = "";
      let activeInfo = null;
      const lineCounts = {};
      const rotateLine = (bucket, lines, targetKey = bucket) => {
        if (targetKey === lastKey && activeInfo?.line) return activeInfo.line;
        const index = lineCounts[bucket] || 0;
        lineCounts[bucket] = index + 1;
        return lines[index % lines.length];
      };
      // generic brain — reads ANY meaningful element so Neo always has something
      // real to say instead of falling back to "hover something".
      const GENERIC_SEL = [
        "a[href]", "button", "[role='button']", "summary", "[role='link']",
        "h1", "h2", "h3", "h4", "h5",
        ".eyebrow", ".pill", ".badge", ".tag", ".chip",
        "label", "input", "textarea", "select",
        "li", "figcaption", "blockquote", "th", "td",
        "img", "svg", "video", "p", "strong", "em", "code"
      ].join(",");
      const keyOf = (s) => clean(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
      const genericRead = (node) => {
        const el = node?.closest?.(GENERIC_SEL);
        if (!el) return null;
        const tag = el.tagName.toLowerCase();
        const raw = clean(el.getAttribute?.("aria-label") || el.textContent || el.getAttribute?.("alt") || el.getAttribute?.("placeholder"));
        const txt = shorten(raw, 44);
        const lc = raw.toLowerCase();

        // interactive — links + buttons
        const isCta = tag === "button" || el.matches("[role='button'],[role='link']") || (tag === "a" && el.getAttribute("href"));
        if (isCta && raw) {
          const looksLikeNav = /^(home|about|work|academy|marketing|labs|contact|pricing|services|blog|menu)\b/i.test(raw) || el.closest("nav");
          const lines = looksLikeNav
            ? [`“${txt}”? whole vibe lives back there. go touch it.`, `${lc} is one click away bestie, don't be delulu.`, `tap “${txt}”. i'll wait. impatiently. always.`, `this door leads to ${lc}. main character behavior is clicking it.`]
            : [`“${txt}” — push the button bestie, make something happen fr.`, `this does ${lc}. lowkey the whole point. click it.`, `“${txt}” is THE move rn, no cap.`, `stop hovering, start clicking. “${txt}” said so.`, `not you sitting on “${txt}” like it bites. it doesn't. go.`];
          return { key: `cta-${keyOf(raw)}`, label: looksLikeNav ? "nav route" : "action", line: pick(lines) };
        }

        // headings — quote the actual copy back
        if (/^h[1-5]$/.test(tag) && raw) {
          return { key: `head-${keyOf(raw)}`, label: "headline", line: pick([
            `“${txt}” — ok they understood the assignment.`,
            `they really opened with “${txt}”. respectfully, slay.`,
            `“${txt}”. read it twice, it's giving thesis statement.`,
            `“${txt}” living rent free now. that's the whole energy.`,
            `not “${txt}” being the realest line on the page fr.`
          ]) };
        }

        // labels / eyebrows / pills / badges
        if (el.matches(".eyebrow,.pill,.badge,.tag,.chip") && raw) {
          return { key: `tag-${keyOf(raw)}`, label: "label", line: pick([
            `“${txt}” — tiny label, big aura.`, `the ${lc} flag just dropped. vibe check passed.`, `“${txt}”. iykyk. moving on.`, `lil ${lc} tag setting the whole mood. iconic.`
          ]) };
        }

        // form fields
        if (/^(input|textarea|select)$/.test(tag) || tag === "label") {
          const name = shorten(el.getAttribute?.("name") || el.getAttribute?.("placeholder") || raw || "this field", 28).toLowerCase();
          return { key: `field-${keyOf(name)}`, label: "field", line: pick([
            `drop ${name} here. don't fumble the bag.`, `${name} goes in this one. easy W.`, `type ${name}, casually, like it's nothing. you got this.`, `${name}? say less. fill it and we move.`, `c'mon bestie, ${name} isn't gonna type itself.`
          ]) };
        }

        // media
        if (/^(img|svg|video)$/.test(tag)) {
          return { key: `media-${keyOf(el.getAttribute?.("alt") || el.className || tag)}`, label: "visual", line: pick([
            "this visual? it's giving art gallery fr.", "pixels ate and left no crumbs.", "lil graphic doing the MOST. respect.", "ok the visuals are not mid. we love to see it.", "this pic has aura ngl."
          ]) };
        }

        // body copy / list items
        if (raw && raw.length > 4) {
          return { key: `read-${keyOf(raw)}`, label: "reading", line: pick([
            `“${txt}” — yeah i'm reading over your shoulder, deal w it.`,
            `this part says ${lc}. lowkey worth the read fr.`,
            `“${txt}”. don't skim this one, it's not mid.`,
            `caught “${txt}” — sneaky important, you're welcome.`,
            `“${txt}”. the way this is actually kinda based.`
          ]) };
        }
        return null;
      };

      const classifyTarget = (node) => {
        const target = node?.closest?.([
          ".currency-btn",
          ".roi-slider-group",
          ".roi-metric-big",
          ".timeline-node",
          ".slider-handle",
          ".before-after-band",
          ".faq-band details",
          ".intake-cta button",
          ".form-group",
          ".unbox-word-play button",
          ".unbox-route-card",
          ".unbox-quick-actions button",
          ".unbox-system-panel",
          ".unbox-wrap",
          ".market-cities span",
          ".super-play-feature",
          ".play-sequence",
          ".super-skill-card",
          ".section-card",
          ".module-card",
          ".stack-detail-card",
          ".package-card",
          ".process-grid article",
          ".detail-hero",
          ".market-context",
          ".super-skills",
          ".section-grid-wrap",
          ".callout"
        ].join(","));

        if (!target) {
          const generic = genericRead(node);
          if (generic) return generic;
          return {
            key: "idle",
            label: "your guide",
            line: rotateLine("idle", [
              "take your time — i'm your guide, just vibing up here.",
              "hover anything and i'll break it down. no rush tho.",
              "read it properly, i'll wait. that's literally my job.",
              "chillin right here whenever you want the tour.",
              "explore at your pace fr, i'm not going anywhere."
            ], "idle")
          };
        }

        if (target.matches(".currency-btn")) {
          const mode = clean(target.textContent).toLowerCase();
          const key = `currency-${mode}`;
          return {
            key,
            label: "currency toggle",
            line: rotateLine("currency", [
              `swapping coins to ${mode}. respect.`,
              `maths is mathing in any currency.`,
              `${mode} mode engaged.`,
              `counting in ${mode}. let's go.`
            ], key)
          };
        }

        if (target.matches(".roi-slider-group")) {
          const label = clean(target.querySelector("span")?.textContent || "slider").toLowerCase();
          const key = `roi-slider-${label}`;
          return {
            key,
            label: `roi target: ${label}`,
            line: rotateLine("roi-slider", [
              `tweak the ${label}. watch the money build.`,
              `cranking the ${label}. high IQ adjustments.`,
              `moving ${label} up. numbers go brrr.`,
              `modulating ${label}. details count.`
            ], key)
          };
        }

        if (target.matches(".roi-metric-big")) {
          return {
            key: "roi-payout",
            label: "scenario value",
            line: rotateLine("roi-payout", [
              "your inputs, your number.",
              "that's the what-if total.",
              "sandbox math. play with it.",
              "move a slider. watch it shift."
            ], "roi-payout")
          };
        }

        if (target.matches(".timeline-node")) {
          const stepNum = clean(target.querySelector(".node-circle")?.textContent || "01");
          const key = `timeline-${stepNum}`;
          return {
            key,
            label: `process stage ${stepNum}`,
            line: rotateLine("timeline", [
              `stage ${stepNum} unlocked. we follow rules.`,
              `on step ${stepNum}. details compounding.`,
              `that's stage ${stepNum}. check it.`,
              `moving step by step. no shortcuts.`
            ], key)
          };
        }

        if (target.matches(".slider-handle")) {
          return {
            key: "slider-handle",
            label: "design slider",
            line: rotateLine("slider-handle", [
              "drag it. slide it. reveal it.",
              "legacy vs nexara standard. slide it.",
              "interactive revealing. no brainer.",
              "reveal the premium standard."
            ], "slider-handle")
          };
        }

        if (target.matches(".before-after-band")) {
          return {
            key: "before-after",
            label: "design comparison",
            line: rotateLine("before-after", [
              "slide the handle to reveal standard styling.",
              "boring legacy vs nexara standard.",
              "spot the difference. it's night and day.",
              "visual systems check."
            ], "before-after")
          };
        }

        if (target.matches(".faq-band details")) {
          const summary = clean(target.querySelector("summary")?.textContent || "faq").toLowerCase();
          const key = `faq-${summary}`;
          return {
            key,
            label: "faq details",
            line: rotateLine("faq", [
              "got questions? click to reveal response.",
              "accordion drop. check the details.",
              "the fine print is all nominal.",
              "deep lore drop."
            ], key)
          };
        }

        if (target.matches(".intake-cta button")) {
          return {
            key: "intake-btn",
            label: "intake action",
            line: rotateLine("intake-btn", [
              "click it. launch sequence.",
              "project incoming. start building.",
              "stop talking. let's build.",
              "push the button. deploy."
            ], "intake-btn")
          };
        }

        if (target.matches(".unbox-word-play button, .unbox-route-card")) {
          const label = clean(target.querySelector("strong")?.textContent || target.textContent).toLowerCase();
          const key = `unbox-${label}`;
          return {
            key,
            label: "unbox route",
            line: rotateLine("unbox-card", [
              `${label}. click it.`,
              `${label} is a door bestie.`,
              `that's ${label}. tap.`,
              `${label} goes somewhere. go find out.`
            ], key)
          };
        }

        if (target.matches(".unbox-quick-actions button")) {
          const action = clean(target.textContent).toLowerCase();
          const key = `unbox-action-${action}`;
          return {
            key,
            label: "quick move",
            line: rotateLine("unbox-action", [
              `${action}. fast.`,
              `${action}. no detours.`,
              `${action}. why are you still reading this.`,
              `${action}. we go now.`
            ], key)
          };
        }

        if (target.matches(".unbox-system-panel, .unbox-wrap")) {
          return {
            key: "unbox-system",
            label: "core reveal",
            line: rotateLine("unbox-system", [
              "the whole company in a cube. relax.",
              "scroll. it opens.",
              "three sections. one weird little box.",
              "lore dropping."
            ], "unbox-system")
          };
        }

        if (target.matches(".market-cities span")) {
          const city = clean(target.textContent);
          const key = `city-${city}`;
          return { key, label: "city tea", line: rotateLine("city", [
            `${city.toLowerCase()}. that's the market.`,
            `${city.toLowerCase()} said hi.`,
            `we know ${city.toLowerCase()}.`,
            `${city.toLowerCase()} is in the recipe.`
          ], key) };
        }

        if (target.matches(".form-group")) {
          const key = `field-${textFrom(target, "label")}`;
          return {
            key,
            label: (textFrom(target, "label") || "input").toLowerCase(),
            line: rotateLine("field", [
              "move this. stuff happens.",
              "small tweak. big consequences.",
              "go on.",
              "that's a setting btw."
            ], key)
          };
        }

        if (target.matches(".super-play-feature")) {
          return {
            key: "lead-play",
            label: (textFrom(target, "h3") || "lead play").toLowerCase(),
            line: rotateLine("lead-play", [
              "all three. at once.",
              "the full squad.",
              "combo move unlocked.",
              "academy + marketing + labs. bold."
            ], "lead-play")
          };
        }

        if (target.matches(".play-sequence")) {
          return {
            key: "sequence",
            label: "combo logic",
            line: rotateLine("sequence", [
              "order matters. who knew.",
              "step by step. groundbreaking.",
              "this is the order. trust.",
              "choreographed chaos."
            ], "sequence")
          };
        }

        if (target.matches(".super-skill-card, .section-card, .module-card, .stack-detail-card, .package-card, .process-grid article")) {
          const key = `card-${textFrom(target, "h3")}`;
          return {
            key,
            label: (textFrom(target, "h3") || "card").toLowerCase(),
            line: rotateLine("card", [
              "click it.",
              "there's more inside.",
              "door.",
              "a whole thing in here."
            ], key)
          };
        }

        if (target.matches(".detail-hero")) {
          return {
            key: "detail-hero",
            label: (textFrom(target, ".eyebrow") || "inside page").toLowerCase(),
            line: rotateLine("detail-hero", [
              "deeper now.",
              "lore unlocked.",
              "inside the engine.",
              "more detail, same energy."
            ], "detail-hero")
          };
        }

        if (target.matches(".market-context")) {
          return {
            key: "market",
            label: (textFrom(target, "h2") || "operating context").toLowerCase(),
            line: rotateLine("market", [
              "city check.",
              "the where matters.",
              "local context loaded.",
              "geography entered the chat."
            ], "market")
          };
        }

        if (target.matches(".super-skills")) {
          return {
            key: "super-skills",
            label: (textFrom(target, "h2") || "super skills").toLowerCase(),
            line: rotateLine("super", [
              "all three sections at once.",
              "the combo play.",
              "squad move.",
              "three engines. one team."
            ], "super-skills")
          };
        }

        if (target.matches(".section-grid-wrap")) {
          return { key: "sections", label: "engines", line: rotateLine("sections", [
            "three doors.",
            "pick one.",
            "academy. marketing. labs. go.",
            "choose."
          ], "sections") };
        }

        if (target.matches(".callout")) {
          return { key: "callout", label: (textFrom(target, "h2") || "callout").toLowerCase(), line: rotateLine("callout", [
            "act.",
            "the page is nudging you.",
            "read. then click.",
            "this one matters."
          ], "callout") };
        }

        const generic = genericRead(node);
        if (generic) return generic;
        return { key: "spot", label: "spotted", line: rotateLine("spot", [
          "noted. unbothered. moving on.",
          "seen it. it's giving... fine i guess.",
          "tracking this, lowkey.",
          "logged it bestie. you're welcome.",
          "mid, but i respect the hover."
        ], "spot") };
      };

      const setInfo = (info) => {
        if (!bubble || !tag) return;
        tag.textContent = info.label;
        bubble.textContent = info.line;
      };
      const boomAt = (x, y) => {
        if (!burst) return;
        gsap.killTweensOf(burst);
        gsap.fromTo(burst,
          { x, y, scale: 0.18, autoAlpha: 0.95, rotate: 0 },
          { scale: 2.7, autoAlpha: 0, rotate: 24, duration: 0.42, ease: "power3.out" }
        );
      };
      /* ── Expression engine — gives Neo his face energy ──────────── */
      const A = "#neo-guide-avatar";
      const faceSvg = guide.querySelector(A);
      const pupL = guide.querySelector(`${A}-pupil-l`);
      const pupR = guide.querySelector(`${A}-pupil-r`);
      const eyeL = guide.querySelector(`${A}-eye-l`);
      const eyeR = guide.querySelector(`${A}-eye-r`);
      const browL= guide.querySelector(`${A}-brow-l`);
      const browR= guide.querySelector(`${A}-brow-r`);
      const mouth= guide.querySelector(`${A}-mouth`);
      const led  = guide.querySelector('.neo-led-inner');
      const hasFace = !!(pupL && pupR && eyeL && eyeR && mouth);
      let blinkT, idleT;
      if (hasFace) {
        gsap.set(eyeL, { transformOrigin: "38px 36px" });
        gsap.set(eyeR, { transformOrigin: "62px 36px" });
      }
      const MOUTH = {
        smirk: "M 37 56 Q 50 57 64 50",   // lopsided "sure, whatever"
        smile: "M 37 54 Q 50 60 63 54",
        grin:  "M 36 53 Q 50 64 64 53",
        flat:  "M 39 55 L 61 55",          // unimpressed
        oh:    "M 44 53 Q 50 62 56 53",
      };
      const setMouth = (d, dur = 0.28) =>
        hasFace && gsap.to(mouth, { attr: { d }, duration: dur, ease: "power2.out", overwrite: "auto" });
      const look = (nx, ny) => {
        if (!hasFace) return;
        gsap.to([pupL, pupR], { x: nx * 2.6, y: ny * 2.4, duration: 0.32, ease: "power2.out", overwrite: "auto" });
      };
      const blink = (which = "both") => {
        if (!hasFace) return;
        const eyes = which === "r" ? [eyeR] : which === "l" ? [eyeL] : [eyeL, eyeR];
        gsap.timeline()
          .to(eyes, { scaleY: 0.08, duration: 0.06, ease: "power2.in" })
          .to(eyes, { scaleY: 1,    duration: 0.13, ease: "power2.out" });
      };
      const ledFlash = () => led && gsap.fromTo(led,
        { scale: 1 }, { scale: 2.1, duration: 0.16, yoyo: true, repeat: 1, transformOrigin: "50px 0px", ease: "power2.out" });
      const brows = (up) => hasFace && gsap.to([browL, browR],
        { opacity: up ? 0.9 : 0, y: up ? -1.5 : 0, duration: 0.2, overwrite: "auto" });
      const eyeRoll = () => {
        if (!hasFace) return;
        gsap.timeline({ onComplete: () => look(0, 0) })
          .to([pupL, pupR], { y: -2.6, x: 0, duration: 0.16, ease: "power1.in" })
          .to([pupL, pupR], { x: 2.6,  duration: 0.15 })
          .to([pupL, pupR], { y: 2,    x: 0, duration: 0.15 });
      };
      const moodFor = (key) => {
        if (key === "idle") return "smirk";   // chill guide, not annoyed-at-you
        if (/^(currency|roi)/.test(key)) return "money";
        if (/(intake|callout|sections|cta|btn|unbox|head|tag|media)/.test(key)) return "hype";
        return "smirk";
      };
      const express = (mood) => {
        if (!hasFace) return;
        if (mood === "bored") { setMouth(MOUTH.flat); if (Math.random() < 0.45) eyeRoll(); brows(false); }
        else if (mood === "money") { setMouth(MOUTH.grin); brows(true); ledFlash(); }
        else if (mood === "hype")  { setMouth(MOUTH.grin); blink("r"); ledFlash(); brows(true); }
        else { setMouth(MOUTH.smirk); brows(true); if (Math.random() < 0.3) blink("r"); }
      };
      // random idle blinks = "alive"
      const scheduleBlink = () => {
        blinkT = setTimeout(() => { if (guideLive) blink(); scheduleBlink(); }, 2400 + Math.random() * 3600);
      };
      // long-idle nudge — only after the user's been still a good while, and
      // strictly no pressure (no "do something / move / your turn" energy).
      const idleChatter = [
        "whenever you're ready — there's good stuff below.",
        "no pressure, scroll on when you wanna.",
        "still here. take all the time you need.",
        "ready when you are, bestie.",
        "keep going whenever — i'll keep up.",
      ];
      let idleIdx = 0;
      const scheduleIdleSass = () => {
        idleT = setTimeout(() => {
          if (guideLive && lastKey === "idle") {
            idleIdx++;
            setInfo({ label: "no rush", line: idleChatter[idleIdx % idleChatter.length] });
            gsap.fromTo([bubble, tag], { autoAlpha: 0.5, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.22, overwrite: "auto" });
            blink();                     // gentle blink, no eyeroll
          }
          scheduleIdleSass();
        }, 22000 + Math.random() * 10000);   // 22–32s: only nudge after a long pause
      };
      // --- shared scroll narration: Vibe explains each beat of the home scroll
      //     (Nexara → premise → Academy / Labs / Marketing → close). Authored,
      //     no-pressure lines. On desktop a later hover takes over; on mobile the
      //     bubble auto-collapses so it never sits on the copy. ---
      let narrateT;
      const narrate = (key, label, line, mood) => {
        if (key === lastKey) return;               // only on a real beat change
        lastKey = key;
        activeInfo = { label, line };
        setInfo(activeInfo);
        if (bubble) bubble.textContent = line;
        if (tag)    tag.textContent    = label;
        try { express(mood); } catch (_) {}
        if (hasFace) blink("r");
        clearTimeout(narrateT);
        gsap.fromTo([bubble, tag], { autoAlpha: 0.5, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.25, overwrite: "auto" });
        if (!isDesktopFollower) {
          narrateT = setTimeout(() => gsap.to([bubble, tag], { autoAlpha: 0, y: 8, duration: 0.3, overwrite: "auto" }), 4600);
        }
      };

      // Premise + closing beats (single-enter sections).
      [
        { sel: ".neo-manifesto", key: "narr-premise", label: "the premise", mood: "smirk",
          line: "the premise: we build people, systems and brands — shipped from one house. this part's the thesis." },
        { sel: ".neo-final-cta", key: "narr-close", label: "your move", mood: "hype",
          line: "that's the tour. your move whenever — no rush." },
      ].forEach((n) => {
        const el = document.querySelector(n.sel);
        if (!el) return;
        triggers.push(ScrollTrigger.create({
          trigger: el, start: "top 70%", end: "bottom 30%",
          onEnter:     () => narrate(n.key, n.label, n.line, n.mood),
          onEnterBack: () => narrate(n.key, n.label, n.line, n.mood),
        }));
      });

      // Divisions: three panels inside one pinned rail — fire per active panel
      // (same 0/1/2 index the rail itself uses).
      const railNarrEl = document.querySelector(".neo-rail-wrap");
      if (railNarrEl) {
        const divisions = [
          { key: "narr-academy",   label: "academy",   mood: "money", line: "Academy — we grow engineers who actually ship. talent, forged in public." },
          { key: "narr-labs",      label: "labs",      mood: "hype",  line: "Labs — we build the intelligence. real AI systems, not slideware." },
          { key: "narr-marketing", label: "marketing", mood: "hype",  line: "Marketing — we make brands move. every campaign wired to a metric." },
        ];
        triggers.push(ScrollTrigger.create({
          trigger: railNarrEl, start: "top top", end: "bottom bottom", scrub: true,
          onUpdate: (self) => {
            const d = divisions[Math.min(2, Math.floor(self.progress * 2.99))];
            if (d) narrate(d.key, d.label, d.line, d.mood);
          },
        }));
      }

      // --- desktop driver: cursor-follow + hover-classify (mobile drives the same brain via its own branch) ---
      if (isDesktopFollower) {
      if (hasFace) { scheduleBlink(); scheduleIdleSass(); setMouth(MOUTH.smirk, 0); }
      else { scheduleIdleSass(); }

      const onMove = (event) => {
        if (!guideLive) return;
        const offsetRight = event.clientX > window.innerWidth - 180;
        const x = clamp(event.clientX + (offsetRight ? -340 : 24), 12, window.innerWidth - 340);
        const y = clamp(event.clientY + 18, 84, window.innerHeight - 108);
        gsap.to(charWrap, { x, y, duration: 0.2, ease: "power3.out", overwrite: "auto" });
        gsap.to(spotlight, { autoAlpha: 1, top: y + 38, duration: 0.18, overwrite: "auto" });

        // pupils watch the actual cursor → side-eye sass (never let face code break the voice)
        try {
          if (hasFace && faceSvg) {
            const r = faceSvg.getBoundingClientRect();
            look(clamp((event.clientX - (r.left + r.width / 2)) / 130, -1, 1),
                 clamp((event.clientY - (r.top + r.height * 0.34)) / 130, -1, 1));
          }
        } catch (_) {}

        const info = classifyTarget(document.elementFromPoint(event.clientX, event.clientY));
        if (info.key !== lastKey) {
          lastKey = info.key;
          activeInfo = info;
          setInfo(info);
          try { express(moodFor(info.key)); } catch (_) {}
          boomAt(event.clientX, event.clientY);
          gsap.fromTo([bubble, tag], { autoAlpha: 0.55, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.18, overwrite: "auto" });
        }
      };
      const onLeave = () => {
        setInfo({ label: "your guide", line: "no worries — i'll be right here when you're back." });
        setMouth(MOUTH.flat); brows(false); look(0, 0);
      };
      // click = smug little wink + antenna flash
      const onClick = () => {
        if (!guideLive || !hasFace) return;
        blink("r"); ledFlash(); setMouth(MOUTH.grin);
        gsap.delayedCall(0.5, () => setMouth(lastKey === "idle" ? MOUTH.flat : MOUTH.smirk));
      };
      const showFollower = () => {
        guideLive = true;
        guide.classList.remove("is-offscreen");
        gsap.to(guide, { autoAlpha: 1, duration: 0.28, ease: "power2.out", overwrite: true });
        gsap.to(spotlight, { autoAlpha: 1, duration: 0.28, overwrite: true });
      };
      const hideFollower = () => {
        guideLive = false;
        guide.classList.add("is-offscreen");
        gsap.to(guide, { autoAlpha: 0, duration: 0.22, ease: "power2.in", overwrite: true });
        gsap.to(spotlight, { autoAlpha: 0, duration: 0.22, overwrite: true });
      };

      const homeHero = guideHomeHero;
      if (homeHero) {
        triggers.push(ScrollTrigger.create({
          trigger: homeHero,
          start: "bottom top+=80",
          onEnter: showFollower,
          onEnterBack: showFollower,
          onLeaveBack: hideFollower,
        }));
      }
      if (!homeHero || window.scrollY > homeHero.offsetHeight - window.innerHeight + 80) {
        showFollower();
      }
      gsap.set(charWrap, { x: window.innerWidth - 360, y: 150 });
      gsap.set([bubble, tag], { autoAlpha: 1, x: 0, y: 0 });
      gsap.set(beacon, { width: 0 });
      gsap.set(spotlight, { autoAlpha: 0, top: 188 });
      setInfo({ label: "your guide", line: "ok so — Nexara. three engines, one roof. lemme walk you through." });
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
      window.addEventListener("click", onClick);

      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("click", onClick);
        clearTimeout(blinkT);
        clearTimeout(idleT);
        clearTimeout(narrateT);
        gsap.killTweensOf([charWrap, bubble, tag, spotlight, burst, pupL, pupR, eyeL, eyeR, mouth]);
        triggers.forEach(t => t.kill());
        guide.classList.remove("is-cursor-guide", "is-scroll-guide");
      };
    }

    /* ── Option A: collapse-to-launcher (mobile) ──
       Bubble stays hidden; tapping the avatar (or a page element) expands it,
       then it auto-collapses so the guide never sits over the copy. */
    let collapseT;
    const expandBubble = () => {
      clearTimeout(collapseT);
      gsap.fromTo([bubble, tag], { autoAlpha: 0.5, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.2, overwrite: "auto" });
      collapseT = setTimeout(() => gsap.to([bubble, tag], { autoAlpha: 0, y: 8, duration: 0.3, overwrite: "auto" }), 3600);
    };

    /* Phase 2: breakout — guide fades in as hero-wrap scrolls out.
       Parks low in the corner (82vh) instead of mid-screen, so it stays
       out of the reading column. */
    const homeHero = guideHomeHero;
    const showScrollGuide = () => {
      guideLive = true;
      gsap.timeline()
        .to(guide,     { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0)
        .to(charWrap,  { y: "82vh", duration: 1.2, ease: "power3.out" }, 0)
        .to(spotlight, { autoAlpha: 1, top: "82vh", duration: 1 }, 0.3);
    };
    const hideScrollGuide = () => {
      guideLive = false;
      gsap.killTweensOf([charWrap, bubble, tag, beacon, spotlight]);
      gsap.to(guide, { autoAlpha: 0, duration: 0.35 });
      gsap.to(spotlight, { autoAlpha: 0, duration: 0.35 });
      gsap.set(beacon, { width: 0 });
      gsap.set(charWrap, { x: 0 });
      const armLine = guide.querySelector('#neo-guide-avatar-arm-l-line');
      const armNode = guide.querySelector('#neo-guide-avatar-arm-l-node');
      if (armLine) gsap.set(armLine, { attr: { x1: 24, y1: 38, x2: 13, y2: 31 } });
      if (armNode) gsap.set(armNode, { attr: { cx: 11, cy: 30 } });
    };
    if (homeHero) {
      triggers.push(ScrollTrigger.create({
        trigger: homeHero,
        start: "bottom top+=80",
        onEnter: showScrollGuide,
        onLeaveBack: hideScrollGuide,
      }));
    } else {
      showScrollGuide();
    }

    // Mobile: keep the face alive (blink) but DON'T auto-pop the bubble on idle —
    // launcher mode means he only speaks when tapped, so reading stays clear.
    if (hasFace) { scheduleBlink(); setMouth(MOUTH.smirk, 0); }
    // Seed a launcher hint as the first-tap line, but keep the bubble collapsed.
    lastKey = "idle";
    setInfo({ label: "your guide", line: "ok so — Nexara. three engines, one roof. scroll, i'll walk you through." });
    if (bubble) bubble.textContent = "ok so — Nexara. three engines, one roof. scroll, i'll walk you through.";
    gsap.set([bubble, tag], { autoAlpha: 0, y: 8 });

    // Section narration (premise / divisions / close) is handled by the shared
    // `narrate` system defined above — it drives both desktop and mobile, so the
    // old mobile-only "dock + travel" system was removed. The avatar simply parks
    // low (82vh) via showScrollGuide and speaks its authored line per beat.

    // Mobile: tap a page element → classify + react (touch analog of desktop hover)
    let lastTapT = 0;
    const onTapClassify = (e) => {
      if (guide.contains(e.target)) return;        // tapping HIM is handled below
      const now = performance.now();
      if (now - lastTapT < 250) return;            // throttle
      lastTapT = now;
      const info = classifyTarget(e.target);
      if (info && info.key !== lastKey) { lastKey = info.key; activeInfo = info; setInfo(info); }
      try { express(moodFor(info && info.key)); } catch (_) {}
      boomAt(e.clientX || 0, e.clientY || 0);
      if (hasFace) { blink("r"); ledFlash(); }
      expandBubble();
    };
    window.addEventListener("pointerdown", onTapClassify, { passive: true });

    // Mobile: tap HIM → self-aware quip (rotating, no immediate repeat)
    const selfLines = [
      "ayo you tapped me. bold. iconic.",
      "yes hi it's me, your guide. obsessed already?",
      "careful, tap me again and i get ideas.",
      "main character energy. i respect it.",
      "stop poking, start scrolling bestie.",
      "you rang? scroll down, i'll keep up.",
    ];
    let selfIdx = 0;
    const onTapSelf = (e) => {
      e.stopPropagation();                          // don't also fire onTapClassify
      selfIdx++;
      setInfo({ label: "neo", line: selfLines[selfIdx % selfLines.length] });
      if (hasFace) {
        blink("r"); ledFlash(); setMouth(MOUTH.grin); express("hype");
        gsap.delayedCall(0.5, () => setMouth(MOUTH.smirk));
      }
      expandBubble();
    };
    charWrap.addEventListener("pointerdown", onTapSelf);

    // Mobile: pause the blink loop when the tab is hidden (battery). No idle
    // nag loop on mobile — launcher mode only speaks on tap or section beats.
    const onVisibility = () => {
      if (document.hidden) { clearTimeout(blinkT); }
      else if (guideLive && hasFace) { scheduleBlink(); }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      triggers.forEach(t => t.kill());
      clearTimeout(blinkT);
      clearTimeout(idleT);
      clearTimeout(collapseT);
      clearTimeout(narrateT);
      window.removeEventListener("pointerdown", onTapClassify);
      charWrap.removeEventListener("pointerdown", onTapSelf);
      document.removeEventListener("visibilitychange", onVisibility);
      gsap.killTweensOf([charWrap, bubble, tag, spotlight, burst]);
    };
  }, []);

  return (
    <>
      <div ref={spotlightRef} className="neo-guide-spotlight" aria-hidden="true"/>
      <div ref={guideRef} className="neo-guide-overlay" aria-hidden="true">
        <div ref={burstRef} className="neo-guide-burst"/>
        <div ref={charWrapRef} className="neo-guide-char-wrap">
          <div ref={bubbleRef} className="neo-guide-bubble"/>
          <div style={{ position: "relative" }}>
            <div ref={beaconRef} className="neo-guide-beacon"/>
            <NeoAvatarSVG id="neo-guide-avatar" className="neo-guide-char-svg"/>
            <div ref={tagRef} className="neo-guide-tag"/>
          </div>
        </div>
      </div>
    </>
  );
}

function NeoHeroUnravel({ copy, theme }) {
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

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      const seg = segmentAt(p);
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

        strandParts.forEach((pt) => {
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
        });
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

function NeoManifesto() {
  const wrapRef = React.useRef(null);
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const textEl = el.querySelector(".neo-manifesto-text");
    if (!textEl) return;
    const text = textEl.textContent.trim();
    const words = text.split(/\s+/);
    textEl.innerHTML = words.map(w => {
      let isAccent = false;
      let cClass = "";
      const lower = w.toLowerCase();
      if (lower.includes("grows") || lower.includes("people")) { isAccent = true; cClass = "c-academy"; }
      else if (lower.includes("intelligent") || lower.includes("systems")) { isAccent = true; cClass = "c-labs"; }
      else if (lower.includes("brands") || lower.includes("move")) { isAccent = true; cClass = "c-marketing"; }
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
    <section className="neo-manifesto" ref={wrapRef}>
      <div className="section-inner">
        <p className="kicker">Why Nexara</p>
        <p className="neo-manifesto-text">
          Three engines. One standard. No shortcuts, no gap years, no vibes without receipts. We build people, systems and brands — and we ship it all from one house.
        </p>
      </div>
    </section>
  );
}

function NeoDivisionsRail() {
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

  return (
    <section className="neo-rail-wrap" id="divisions" ref={wrapRef}>
      <div className="neo-rail-stage">
        <div className="rail-head">
          <div>
            <p className="kicker">The divisions</p>
            <h2 className="h-section">Choose your force.</h2>
          </div>
          <p className="rail-progress"><b ref={progressRef}>01</b> / 03</p>
        </div>
        <div className="neo-rail-track" ref={trackRef}>
          {sections.map((sec, i) => (
            <button key={sec.id} className="neo-rail-panel" style={{ '--accent': i === 0 ? '#7c5cff' : i === 1 ? '#ff5c8a' : '#00e5a0' }} onClick={() => routeTo('neo', sec.id)}>
              <span className="neo-panel-idx">0{i + 1} / {sec.name.toUpperCase()}</span>
              <span className="neo-panel-orb" />
              <span className="neo-panel-ring" />
              <h3>{sec.name}<br /><span className="serif">{sec.headline || (i === 0 ? "we grow engineers" : i === 1 ? "we build intelligence" : "we make brands move")}</span></h3>
              <p>{sec.short.neo || sec.desc}</p>
              <span className="panel-tags">
                {sec.stack.slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}
              </span>
              <span className="btn">Enter {sec.name} <span className="arr">→</span></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function NeoFinalCTA() {
  return (
    <section className="neo-final-cta">
      <p className="kicker">Ready when you are</p>
      <button onClick={() => routeTo('neo', 'contact')} aria-label="Begin — start a brief" style={{ border: 0, background: 'none', padding: 0 }}>
        <span className="neo-final-cta">
          <a href="#contact" onClick={(e) => { e.preventDefault(); routeTo('neo', 'contact'); }}>Begin.</a>
        </span>
      </button>
      <p className="lede">Tell us which force you need — or let the brief decide.</p>
    </section>
  );
}

function TrustHero({ copy, theme }) {
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


function Site({ theme, page, detail }) {
  const isNeo = theme === "neo";
  const section = DATA.sections[page];
  React.useEffect(() => { window.scrollTo(0, 0); }, [theme, page]);
  const validPage = section || STATIC_PAGES.includes(page);
  const className = isNeo ? "site neo" : "site trust";
  return (
    <div className={className}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav theme={theme} page={page} detail={detail} />
      <BreadcrumbBar page={page} detail={detail} />
      <div id="main">
        {page === "home" && <Home theme={theme} />}
        {section && <SectionPage theme={theme} section={section} detail={detail} />}
        {page === "customers" && <Customers theme={theme} detail={detail} />}
        {page === "company" && <Company theme={theme} />}
        {page === "contact" && <Contact theme={theme} detail={detail} />}
        {!validPage && <NotFound theme={theme} page={page} />}
      </div>
      {isNeo && HAS_SCROLL_ANIMATION && <NeoGuide key={`${page}-${detail || "root"}`} />}
      <Footer theme={theme} />
    </div>
  );
}

function Nav({ theme, page, detail }) {
  const [hoveredPage, setHoveredPage] = useState(null);
  return (
    <header className="nav">
      <button className="logo" onClick={() => { window.location.hash = ""; }}>Nexara</button>
      <nav onMouseLeave={() => setHoveredPage(null)}>
        {DATA.nav.map((item) => {
          const active = page === item.page;
          const lit = hoveredPage ? hoveredPage === item.page : active;
          return (
            <button
              key={item.page}
              className={`${active ? 'active' : ''}${!active && hoveredPage === item.page ? ' hover-lit' : ''}`}
              onClick={() => routeTo(theme, item.page)}
              onMouseEnter={() => setHoveredPage(item.page)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="theme-pill">
        <button className={theme === "neo" ? "active" : ""} onClick={() => routeTo("neo", page, detail)}>Neo</button>
        <button className={theme === "trust" ? "active" : ""} onClick={() => routeTo("trust", page, detail)}>Trust</button>
      </div>
    </header>
  );
}


function BreadcrumbBar({ page, detail }) {
  const section = DATA.sections[page];
  const labels = { customers: "Proof", company: "Company", contact: "Contact" };
  const current = section ? section.name : labels[page];
  const subpage = detail ? section?.subpages.find((item) => item.slug === detail)?.title : null;
  return (
    <div className="breadcrumb-bar" aria-label="Current location">
      <span>Nexara</span>
      {current && <><span className="breadcrumb-sep">/</span><span>{current}</span></>}
      {subpage && <><span className="breadcrumb-sep">/</span><span>{subpage}</span></>}
    </div>
  );
}


function Home({ theme }) {
  const sections = Object.values(DATA.sections);
  const copy = DATA.home[theme];
  const isNeo = theme === "neo";
  return (
    <main>
      {!HAS_SCROLL_ANIMATION
        ? <HeroBanner theme={theme} eyebrow={copy.eyebrow} title={copy.title} accent={copy.accent} body={copy.body} />
        : isNeo
        ? (
          <>
            <NeoHeroUnravel copy={copy} theme={theme} />
            <NeoManifesto />
            <NeoDivisionsRail />
            <section className="section standards">
              <div className="section-inner">
                <div className="section-head">
                  <div>
                    <p className="kicker">The operating standard</p>
                    <h2 className="h-section">Every division runs<br />on the same spine.</h2>
                  </div>
                </div>
                <div className="neo-standards-grid">
                  <div className="neo-standard-card">
                    <span className="neo-std-idx">/01</span>
                    <h3>Written before built</h3>
                    <p>Every engagement starts with a written brief and scope. If it isn't written down, it isn't agreed.</p>
                  </div>
                  <div className="neo-standard-card">
                    <span className="neo-std-idx">/02</span>
                    <h3>Demo every week</h3>
                    <p>Working software, live cohorts, running campaigns — shown weekly, not described in decks.</p>
                  </div>
                  <div className="neo-standard-card">
                    <span className="neo-std-idx">/03</span>
                    <h3>One accountable lead</h3>
                    <p>Every cohort, system and campaign has a single named owner from kickoff to handover.</p>
                  </div>
                  <div className="neo-standard-card">
                    <span className="neo-std-idx">/04</span>
                    <h3>Handover by design</h3>
                    <p>Documentation, access and training are part of the deliverable — never an afterthought.</p>
                  </div>
                </div>
              </div>
            </section>
            <NeoFinalCTA />
          </>
        )
        : <TrustHero copy={copy} theme={theme} />}
    </main>
  );
}

function AcademyHero({ theme, section }) {
  const wrapRef = React.useRef(null);
  const pinRef = React.useRef(null);
  const cubeRef = React.useRef(null);
  const faceRefs = React.useRef([]);
  const contentRefs = React.useRef([]);
  const cardRefs = React.useRef([]);
  const stageBaseRef = React.useRef(null);
  const captionTitleRef = React.useRef(null);
  const captionDescRef = React.useRef(null);
  const deckRef = React.useRef(null);
  const applyFrameRef = React.useRef(null);

  const copy = section.hero[theme];

  const pillars = [
    {
      id: "books",
      label: theme === "neo" ? "01 / Skilling" : "1. Structured skilling",
      title: "Books & Tracks",
      desc: theme === "neo" ? "Full-stack, AI, UX sprint-based builds." : "Role-aligned skilling across modern engineering & design.",
      color: "var(--unbox-academy)",
      sub: "6 options",
      details: ["React & Node", "Applied AI", "UI/UX Systems", "DevOps basics"]
    },
    {
      id: "trainings",
      label: theme === "neo" ? "02 / Cohorts" : "2. Cohort training",
      title: "Cohorts & Mentoring",
      desc: theme === "neo" ? "Live checkpoints, review boards, visible rhythm." : "Structured training schedules with weekly review checkpoints.",
      color: "var(--unbox-standards)",
      sub: "3 groups",
      details: ["Weekly sprints", "Industry mentors", "Live reviews", "Progress logs"]
    },
    {
      id: "internships",
      label: theme === "neo" ? "03 / Projects" : "3. Managed internships",
      title: "Internships & Projects",
      desc: theme === "neo" ? "Real projects, mentor pressure, actual ship cycles." : "Project scoping, task delivery, and portfolio creation.",
      color: "var(--unbox-marketing)",
      sub: "4 stages",
      details: ["Real client projects", "Sprint delivery", "Junior workflows", "Deliverables code"]
    },
    {
      id: "placements",
      label: theme === "neo" ? "04 / Outcomes" : "4. Placements desk",
      title: "Placements Desk",
      desc: theme === "neo" ? "No placement theater. Real portfolio matching." : "Employer-aligned hiring Desk & screening paths.",
      color: "var(--unbox-labs)",
      sub: "1 outcome",
      details: ["Portfolio matching", "Mock interviews", "Employer desks", "Offer tracking"]
    }
  ];

  const handleExplore = () => {
    const target = document.querySelector(".subnav");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCardClick = (index) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const runway = Number(wrap.dataset.scrollRunway || 0);
    const isStickyMode = runway > 0;

    if (isStickyMode) {
      const top = rect.top + window.scrollY;
      const targetP = 0.125 + index * 0.25;
      window.scrollTo({
        top: top + targetP * runway,
        behavior: "smooth"
      });
    } else {
      if (applyFrameRef.current) {
        applyFrameRef.current(0.125 + index * 0.25);
      }
    }
  };

  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const layout = { top: 0, height: 0, innerHeight: 0 };
    const measureLayout = () => {
      const rect = wrap.getBoundingClientRect();
      layout.top = rect.top + window.scrollY;
      layout.height = rect.height;
      layout.innerHeight = window.innerHeight;
    };

    measureLayout();
    const measureTimer = setTimeout(measureLayout, 200);

    const applyFrame = (p) => {
      const activeIndex = Math.min(3, Math.floor(p * 4));
      const openProgress = clamp01(p / 0.12);

      // Rotate box based on scroll
      if (cubeRef.current) {
        const rotY = -45 + p * 360;
        const scale = 0.8 + p * 0.15;
        const rotX = 58 - Math.sin(p * Math.PI * 3) * 5;
        cubeRef.current.style.transform = `rotateX(${rotX}deg) rotateY(0deg) rotateZ(${rotY}deg) scale(${scale})`;
      }

      // Unbox cube faces
      faceRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i === 0) { // bottom
          el.style.transform = "translate3d(0, 0, -40px)";
        } else if (i === 1) { // back
          const ty = -40 - openProgress * 40;
          const tz = -40 * (1 - openProgress);
          const rx = 90 - openProgress * 90;
          el.style.transform = `translate3d(0, ${ty}px, ${tz}px) rotateX(${rx}deg)`;
          el.style.opacity = 1 - openProgress * 0.4;
        } else if (i === 2) { // left
          const tx = -40 - openProgress * 40;
          const tz = -40 * (1 - openProgress);
          const ry = -90 + openProgress * 90;
          el.style.transform = `translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg)`;
          el.style.opacity = 1 - openProgress * 0.4;
        } else if (i === 3) { // right
          const tx = 40 + openProgress * 40;
          const tz = -40 * (1 - openProgress);
          const ry = 90 - openProgress * 90;
          el.style.transform = `translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg)`;
          el.style.opacity = 1 - openProgress * 0.4;
        } else if (i === 4) { // front
          const ty = 40 + openProgress * 40;
          const tz = -40 * (1 - openProgress);
          const rx = -90 + openProgress * 90;
          el.style.transform = `translate3d(0, ${ty}px, ${tz}px) rotateX(${rx}deg)`;
          el.style.opacity = 1 - openProgress * 0.4;
        } else if (i === 5) { // top
          const ty = -40 - openProgress * 40;
          const tz = 40;
          const rx = 0 - openProgress * 125;
          el.style.transform = `translate3d(0, ${ty}px, ${tz}px) rotateX(${rx}deg)`;
          el.style.opacity = 1 - openProgress * 0.5;
        }
      });

      // Update emerging visual content
      contentRefs.current.forEach((el, i) => {
        if (!el) return;
        const isActive = i === activeIndex;
        el.style.opacity = isActive ? 1 : 0;
        el.style.visibility = isActive ? "visible" : "hidden";
        el.style.transform = isActive ? "translate3d(0, 0, 0)" : "translate3d(0, 0, -20px)";
      });

      // Update card positioning (fan-out layout driven by scroll)
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const isActive = i === activeIndex;
        el.classList.toggle("is-active", isActive);

        // Calculate positioning: fanned relative to the activeIndex
        const yOffset = (i - activeIndex) * 62;
        const zOffset = isActive ? 30 : 0;
        const rotZ = (i - 1.5) * 4;

        el.style.transform = `translate3d(0px, ${yOffset}px, ${zOffset}px) rotateZ(${rotZ}deg)`;
        el.style.zIndex = isActive ? 50 : 20 - i;
      });

      // Update deck container custom property for styling support
      if (deckRef.current) {
        deckRef.current.style.setProperty("--active-pillar", activeIndex);
      }

      // Update caption texts
      if (captionTitleRef.current) captionTitleRef.current.textContent = pillars[activeIndex].title;
      if (captionDescRef.current) captionDescRef.current.textContent = pillars[activeIndex].desc;

      // Update grid base color theme
      if (stageBaseRef.current) {
        stageBaseRef.current.style.background = `radial-gradient(circle, ${pillars[activeIndex].color} 0%, transparent 70%)`;
      }
    };

    applyFrameRef.current = applyFrame;

    const shouldPin = HAS_SCROLL_ANIMATION && window.ScrollTrigger && window.innerWidth > 980;
    if (shouldPin && pinRef.current) {
      const runway = Math.round(Math.min(760, Math.max(420, window.innerHeight * 0.7)));
      wrap.dataset.scrollRunway = String(runway);
      applyFrame(0);
      const st = window.ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top 68px",
        end: `+=${runway}`,
        scrub: 0.35,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => applyFrame(self.progress)
      });
      return () => {
        clearTimeout(measureTimer);
        delete wrap.dataset.scrollRunway;
        st.kill();
      };
    }

    let lastP = -1;
    let scrollY = window.scrollY;
    let ticked = false;

    const update = () => {
      ticked = false;
      const isStickyMode = layout.height > layout.innerHeight * 1.1;
      if (!isStickyMode) return;
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

    const handleResize = () => {
      measureLayout();
      const isStickyMode = layout.height > layout.innerHeight * 1.1;
      if (!isStickyMode) {
        applyFrame(0.125);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Initial paint
    measureLayout();
    const isStickyMode = layout.height > layout.innerHeight * 1.1;
    if (isStickyMode) {
      handleScroll();
    } else {
      applyFrame(0.125);
    }

    return () => {
      clearTimeout(measureTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <div ref={wrapRef} className="academy-hero-scroll-wrap">
      <section ref={pinRef} className="academy-hero hero-banner compact">
        <div className="hero-bg">
          <div className="orb one"></div>
          <div className="orb two"></div>
          <div className="scanlines"></div>
        </div>
        
        <div className="hero-copy">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>
            {copy.title}{" "}
            <em><CyclingWord words={SECTION_HERO_WORDS.neo.academy} /></em>
          </h1>
          <p className="hero-body">{copy.body}</p>
          <div className="hero-actions">
            <button onClick={handleExplore}>{copy.primary}</button>
            <button className="secondary" onClick={() => routeTo(theme, "customers", "academy")}>{copy.secondary}</button>
          </div>
        </div>

        <div className="academy-reactor-panel">
          <span className="reactor-eyebrow">{theme === "neo" ? "// ACADEMY REACTOR" : "Academy Capability Deck"}</span>
          <div className="academy-reactor">
            
            {/* Holographic 3D Unboxing Stage */}
            <div className="reactor-unbox-stage">
              <div ref={stageBaseRef} className="stage-grid-base"></div>
              <div ref={cubeRef} className="unbox-box-3d">
                {/* 3D Cube faces that fold open */}
                {["bottom", "back", "left", "right", "front", "top"].map((faceName, i) => (
                  <div
                    key={faceName}
                    ref={el => { faceRefs.current[i] = el; }}
                    className={`box-3d-face ${faceName}`}
                    style={{ "--face-color": pillars[0].color }}
                  ></div>
                ))}
                
                {/* Emerging 3D visuals representing the current pillar */}
                <div className="stage-content-container">
                  
                  {/* Visual 1: Books (Structured Skilling) */}
                  <div ref={el => { contentRefs.current[0] = el; }} className="stage-graphics books-graphics is-active" style={{ "--face-color": pillars[0].color }}>
                    <div className="floating-book book-1"><span>RE</span></div>
                    <div className="floating-book book-2"><span>AI</span></div>
                    <div className="floating-book book-3"><span>UX</span></div>
                  </div>

                  {/* Visual 2: Trainings (Cohorts & Mentoring) */}
                  <div ref={el => { contentRefs.current[1] = el; }} className="stage-graphics trainings-graphics" style={{ "--face-color": pillars[1].color }}>
                    <div className="orbital-ring ring-1"></div>
                    <div className="orbital-ring ring-2"></div>
                    <div className="cohort-node node-1"></div>
                    <div className="cohort-node node-2"></div>
                    <div className="cohort-node node-3"></div>
                    <div className="central-glow"></div>
                  </div>

                  {/* Visual 3: Internships (Briefs & Internships) */}
                  <div ref={el => { contentRefs.current[2] = el; }} className="stage-graphics internships-graphics" style={{ "--face-color": pillars[2].color }}>
                    <div className="brief-card sheet-1">
                      <span>PROJECT #29</span>
                      <small>STATUS: ACTIVE</small>
                    </div>
                    <div className="brief-sheet sheet-2">
                      <span>PROJECT #34</span>
                      <small>STATUS: SHIPPED</small>
                    </div>
                  </div>

                  {/* Visual 4: Placements (Outcomes) */}
                  <div ref={el => { contentRefs.current[3] = el; }} className="stage-graphics placements-graphics" style={{ "--face-color": pillars[3].color }}>
                    <div className="scanner-line"></div>
                    <div className="hud-brackets">
                      <span className="b-tl"></span>
                      <span className="b-tr"></span>
                      <span className="b-bl"></span>
                      <span className="b-br"></span>
                    </div>
                    <div className="target-lock">
                      <span>MATCHED</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div ref={deckRef} className="reactor-deck">
              {pillars.map((pillar, index) => {
                return (
                  <div
                    key={pillar.id}
                    ref={el => { cardRefs.current[index] = el; }}
                    className={`reactor-card ${pillar.id} ${index === 0 ? "is-active" : ""}`}
                    style={{
                      "--pillar-color": pillar.color,
                      "--card-index": index,
                    }}
                    onClick={() => handleCardClick(index)}
                  >
                    <div className="card-top">
                      <span>{pillar.label}</span>
                      <small>{pillar.sub}</small>
                    </div>
                    <h3>{pillar.title}</h3>
                    <div className="card-details">
                      {pillar.details.map(d => <span key={d}>{d}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="reactor-caption">
            <strong ref={captionTitleRef}>{pillars[0].title}</strong>
            <p ref={captionDescRef}>{pillars[0].desc}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroBanner({ theme, eyebrow, title, accent, body, section, compact = false }) {
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

function NeoSectionHero({ theme, section, variant, children }) {
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
          <em><CyclingWord words={(SECTION_HERO_WORDS[theme]?.[section.id]) || [copy.accent]} /></em>
        </h1>
        <p className="hero-body">{copy.body}</p>
        <div className="hero-actions">
          <button onClick={() => routeTo(theme, section.id, section.subpages[0].slug)}>{copy.primary}</button>
          <button className="secondary" onClick={() => routeTo(theme, "customers", section.id)}>{copy.secondary}</button>
        </div>
      </div>
      <div className="neo-sig-visual">{children}</div>
    </section>
  );
}

function BroadcastVisual() {
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

function PipelineVisual() {
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

function MarketingHero({ theme, section }) {
  return (
    <NeoSectionHero theme={theme} section={section} variant="mkt">
      <BroadcastVisual />
    </NeoSectionHero>
  );
}

function LabsHero({ theme, section }) {
  return (
    <NeoSectionHero theme={theme} section={section} variant="labs">
      <PipelineVisual />
    </NeoSectionHero>
  );
}

const FACE_BASE_TRANSFORMS = [
  "translateZ(150px)", "rotateY(90deg) translateZ(150px)",
  "rotateY(180deg) translateZ(150px)", "rotateY(-90deg) translateZ(150px)",
  "rotateX(90deg) translateZ(150px)", "rotateX(-90deg) translateZ(150px)",
];
const FACE_MOTIONS = [
  { x: 0, y: 0, z: 1 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: -1 },
  { x: -1, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }, { x: 0, y: 1, z: 0 },
];

function NexaraUnbox({ theme }) {
  const wrapRef      = React.useRef(null);
  const pinRef       = React.useRef(null);
  const cubeRef      = React.useRef(null);
  const faceRefs     = React.useRef([]);
  const coreRef      = React.useRef(null);
  const signalRingRef = React.useRef(null);
  const signalCardRefs = React.useRef([]);
  const wordRefs     = React.useRef([]);
  const wordPlayRefs = React.useRef([]);
  const routeCardRefs = React.useRef([]);
  const routeCardSmallRefs = React.useRef([]);
  const stageLabelRef = React.useRef(null);
  const activeLabelRef = React.useRef(null);
  const progressBarRef = React.useRef(null);
  const progressPctRef = React.useRef(null);

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

    const applyFrame = (p) => {
      const explode      = clamp01((p - 0.42) / 0.42);
      const coreOpacity  = clamp01((p - 0.56) / 0.22);
      const signalOpacity= clamp01((p - 0.68) / 0.22);
      const activeIndex  = Math.min(faces.length - 1, Math.floor(clamp01(p) * faces.length));

      if (cubeRef.current)
        cubeRef.current.style.transform = `translateY(${110 - p * 175}px) rotateX(${58 - p * 92}deg) rotateY(${-170 + p * 520}deg) scale(${0.55 + p * 0.42})`;

      faceRefs.current.forEach((el, i) => {
        if (!el) return;
        const m = FACE_MOTIONS[i];
        const drift = explode * 230;
        const lift  = i === 5 ? clamp01((p - 0.36) / 0.24) * 72 : 0;
        el.style.transform = `translate3d(${m.x * drift}px,${m.y * drift - lift}px,${m.z * drift}px)`;
        el.style.opacity   = 1 - explode * 0.32;
      });

      if (coreRef.current) {
        coreRef.current.style.opacity   = coreOpacity;
        coreRef.current.style.transform = `translate(-50%,-50%) scale(${0.5 + coreOpacity * 0.58}) rotateY(${p * 360}deg)`;
      }

      if (signalRingRef.current) signalRingRef.current.style.opacity = signalOpacity;
      signalCardRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `rotateY(${i * 90}deg) translateZ(${280 + signalOpacity * 80}px)`;
      });

      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const wp = clamp01((p * 1.9) - i * 0.12);
        el.style.opacity   = 0.42 + wp * 0.58;
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

      if (stageLabelRef.current)  stageLabelRef.current.textContent  = `${stageLabels[activeIndex]} stage`;
      if (activeLabelRef.current) activeLabelRef.current.textContent = faces[activeIndex].label;
      if (progressPctRef.current) progressPctRef.current.textContent = `${Math.round(p * 100).toString().padStart(3, "0")}%`;
      if (progressBarRef.current) progressBarRef.current.style.width = `${p * 100}%`;
    };

    if (reducedMotion) { applyFrame(0.62); return; }

    const shouldPin = HAS_SCROLL_ANIMATION && window.ScrollTrigger && window.innerWidth > 760;
    if (shouldPin) {
      const runway = Math.round(Math.min(1120, Math.max(680, window.innerHeight * 0.95)));
      applyFrame(0);
      const st = window.ScrollTrigger.create({
        trigger: pinRef.current || wrap,
        start: "top top",
        end: `+=${runway}`,
        scrub: 0.45,
        pin: pinRef.current || true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => applyFrame(self.progress)
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
  }, [theme, reducedMotion]);

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
                style={{ "--face-color": face.color, "--word-fill": "0%" }}
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
                  style={{ "--face-color": face.color }}>
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
            <strong ref={activeLabelRef}>{faces[0].label}</strong>
          </div>
          <div className="unbox-card-rail">
            {faces.map((face, i) => (
              <button key={face.label} ref={el => { 
                routeCardRefs.current[i] = el;
                if (el) {
                  routeCardSmallRefs.current[i] = el.querySelector("small");
                }
              }}
                className="unbox-route-card"
                style={{ "--face-color": face.color, "--card-fill": "0%", transform: "translateX(22px)" }}
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

function SuperSkills({ theme }) {
  const calloutBody = DATA.home[theme].calloutBody;
  const [featured, ...supporting] = DATA.superSkills;
  const reduceMotion = useReducedMotion();

  const handleMouseMove = (e) => {
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

function CardVisual({ title, theme }) {
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

function ModuleCard({ theme, eyebrow, title, children, visualTitle = null, className = "module-card", onClick = null }) {
  const reduceMotion = useReducedMotion();
  const handleMouseMove = (e) => {
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
      onClick={onClick}
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

const MODULE_DETAILS = {
  // Digital Marketing
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

function ModuleModal({ theme, module, eyebrow, onClose }) {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
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

function SectionCards({ theme, sections }) {
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

function NeoSectionHeroUnravel({ theme, section }) {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const TAU = Math.PI * 2;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const shape = section.id === "academy" ? "spiral" : section.id === "labs" ? "sphere" : "signal";
    const rgb = section.id === "academy" ? [124, 92, 255] : section.id === "labs" ? [255, 92, 138] : [0, 229, 160];

    const makeSprite = (cRgb) => {
      const s = document.createElement("canvas");
      s.width = s.height = 64;
      const c = s.getContext("2d");
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
      ctx.globalCompositeOperation = "lighter";

      const ry = p * 1.8 + time * 0.08;
      const rx = -0.15 + p * 0.3;
      const cy_ = Math.cos(ry), sy_ = Math.sin(ry);
      const cx_ = Math.cos(rx), sx_ = Math.sin(rx);

      parts.forEach((pt) => {
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
    <div ref={wrapRef} className="neo-hero-runway" style={{ height: '260vh' }}>
      <div className="neo-hero-stage">
        <canvas ref={canvasRef} className="neo-hero-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <div className="neo-hero-chapter" style={{ opacity: 1, pointerEvents: 'auto' }}>
          <p className="kicker">{section.id === "academy" ? "01" : section.id === "labs" ? "02" : "03"} / {section.name.toUpperCase()}</p>
          <h1 className="ch-name" style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 800, textTransform: section.id === "academy" ? 'none' : 'uppercase' }}>
            {section.id === "academy" ? (
              <>We don't hire engineers.<br />We <em style={{ fontStyle: 'normal', color: '#7c5cff' }}>compile</em> them.</>
            ) : (
              <>{copy.title}<br /><span className="serif" style={{ color: section.id === "labs" ? '#ff5c8a' : '#00e5a0' }}><CyclingWord words={SECTION_HERO_WORDS.neo[section.id] || [copy.accent]} /></span></>
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



function AcademyTerminalSection() {
  const wrapRef = React.useRef(null);
  const bodyRef = React.useRef(null);

  // useLayoutEffect + ctx.revert: pin-spacer must unwrap before React unmount
  React.useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const body = bodyRef.current;
    if (!wrap || !body || !window.gsap) return;

    const lines = [
      ['p', 'nexara@academy:~$ ', 'k', 'init career --track=engineering'],
      ['c', '  resolving curriculum graph...'],
      ['c', '  [1/4] foundations        ', 's', '✓ systems · networks · git'],
      ['c', '  [2/4] core engineering   ', 's', '✓ apis · databases · cloud'],
      ['c', '  [3/4] specialisation     ', 's', '✓ ai/ml · security · devops'],
      ['c', '  [4/4] industry residency ', 's', '✓ 12-week placement sprint'],
      ['p', 'nexara@academy:~$ ', 'k', 'run graduate --mode=hired'],
      ['s', '  → offer received. compensation: above market.'],
      ['p', 'nexara@academy:~$ '],
    ];

    const charSpans = [];
    lines.forEach((parts) => {
      const ln = document.createElement('span');
      ln.className = 'acad-tl-ln';
      for (let i = 0; i < parts.length; i += 2) {
        const cls = parts[i];
        const text = parts[i + 1];
        if (!text) continue;
        for (const ch of text) {
          const sp = document.createElement('span');
          sp.className = 'acad-tc-' + cls;
          sp.textContent = ch;
          sp.style.visibility = 'hidden';
          ln.appendChild(sp);
          charSpans.push(sp);
        }
      }
      body.appendChild(ln);
    });

    const cursor = document.createElement('span');
    cursor.className = 'acad-term-cursor';
    body.appendChild(cursor);

    const st = { n: 0 };
    const apply = () => {
      const upto = Math.floor(st.n);
      charSpans.forEach((sp, i) => (sp.style.visibility = i < upto ? 'visible' : 'hidden'));
      const last = charSpans[Math.max(0, Math.min(upto, charSpans.length) - 1)];
      if (last) last.after(cursor);
    };

    const ctx = gsap.context(() => {
      gsap.to(st, {
        n: charSpans.length,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=220%',
          scrub: 0.4,
          pin: true,
          pinSpacing: true,
        },
        onUpdate: apply,
      });
    }, wrap);

    return () => { ctx.revert(); body.innerHTML = ''; };
  }, []);

  return (
    <section ref={wrapRef} className="acad-terminal-section">
      <div className="acad-terminal-inner">
        <p className="acad-mono" style={{ marginBottom: '20px' }}>// Scroll to execute the curriculum</p>
        <div className="acad-terminal">
          <div className="acad-term-bar">
            <span className="acad-dot acad-dot-r"></span>
            <span className="acad-dot acad-dot-y"></span>
            <span className="acad-dot acad-dot-g"></span>
            <span className="acad-term-title">nexara-academy — zsh — career.sh</span>
          </div>
          <div ref={bodyRef} className="acad-term-body"></div>
        </div>
      </div>
    </section>
  );
}

function AcademyBootSequence() {
  const progressRef = React.useRef(null);

  React.useEffect(() => {
    const line = progressRef.current;
    if (!line || !window.gsap) return;
    const tween = gsap.to(line, {
      height: 'calc(100% - 12px)',
      ease: 'none',
      scrollTrigger: {
        trigger: line.closest('.acad-boot-timeline'),
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: true,
      },
    });
    return () => tween.kill();
  }, []);

  const phases = [
    { when: 'Months 01–03', title: 'Foundations', desc: 'Unix, networking, version control, one language deep. No frameworks until you can explain what they abstract.' },
    { when: 'Months 04–07', title: 'Core engineering', desc: 'APIs, data modelling, testing culture, cloud primitives. Weekly ship cadence with code review from Labs engineers.' },
    { when: 'Months 08–09', title: 'Specialisation', desc: 'Branch into AI/ML, security, or platform engineering. Capstone scoped like a client engagement — because it is one.' },
    { when: 'Months 10–12', title: 'Industry residency', desc: 'Embedded in a Nexara Labs squad or partner company. Real standups, real deadlines, real production access.' },
  ];

  return (
    <section className="acad-boot-section">
      <div className="acad-boot-inner">
        <div className="acad-boot-head">
          <p className="acad-mono">// The twelve months</p>
          <h2 className="acad-boot-title">Boot sequence<br /><em>for a career.</em></h2>
        </div>
        <div className="acad-boot-timeline">
          <span className="acad-boot-track"></span>
          <span ref={progressRef} className="acad-boot-progress"></span>
          {phases.map((p) => (
            <div key={p.when} className="acad-boot-item">
              <span className="acad-boot-when">{p.when}</span>
              <h4 className="acad-boot-phase">{p.title}</h4>
              <p className="acad-boot-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LabsBlueprintSection() {
  const wrapRef = React.useRef(null);

  // useLayoutEffect: pin cleanup must revert the pin-spacer BEFORE React
  // removes the node, or unmount throws removeChild NotFoundError
  React.useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !window.gsap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const svg = wrap.querySelector('.nx-labs-visual svg');
    const paths = svg.querySelectorAll('[data-draw]');
    const fills = svg.querySelectorAll('[data-fill]');
    const caps = Array.from(wrap.querySelectorAll('.nx-build-cap'));

    if (reduced) {
      fills.forEach((f) => { f.style.opacity = 1; });
      caps.forEach((c, i) => { if (i < caps.length - 1) c.style.visibility = 'hidden'; });
      return;
    }

    paths.forEach((p) => {
      const len = p.getTotalLength ? p.getTotalLength() : 600;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
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
        ctl.to(caps[i - 1], { autoAlpha: 0, y: -20, duration: 1 }, i * 2.4)
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

function MarketingSignalSection() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    let ww, wh, dpr, rafId = 0;
    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ww = canvas.clientWidth; wh = canvas.clientHeight;
      canvas.width = ww * dpr; canvas.height = wh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener('resize', fit);
    const draw = (ts) => {
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
      if (!reduced) rafId = window.requestAnimationFrame(draw);
    };
    rafId = window.requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', fit);
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

function MarketingFunnelSection() {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  // useLayoutEffect: see LabsBlueprintSection — pin must revert before unmount
  React.useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || !window.gsap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    let fw, fh, dpr, rafId = 0;
    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      fw = canvas.clientWidth; fh = canvas.clientHeight;
      canvas.width = fw * dpr; canvas.height = fh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener('resize', fit);

    const sub = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
    const eo = (t) => 1 - Math.pow(1 - t, 3);
    const rngP = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
    const parts = Array.from({ length: 90 }, () => ({ x: rngP(), speed: 0.5 + rngP(), keep: rngP() }));
    const names = ['REACH', 'ENGAGE', 'CONVERT', 'RETAIN'];
    const pct = ['100%', '62%', '36%', '18%'];
    const widths = [0.86, 0.6, 0.38, 0.2];
    const keepRates = [1, 0.62, 0.36, 0.18];

    const drawFunnel = (t) => {
      ctx.clearRect(0, 0, fw, fh);
      const cx = fw / 2;
      const top = fh * 0.08, bot = fh * 0.9;
      const stages = 4;
      for (let s = 0; s < stages; s++) {
        const st = eo(sub(t, s * 0.18, s * 0.18 + 0.25));
        if (st <= 0) continue;
        const y0 = top + ((bot - top) / stages) * s;
        const y1 = top + ((bot - top) / stages) * (s + 1) - 14;
        const w0 = fw * widths[s] * 0.5 * st;
        const w1 = fw * (widths[s + 1] !== undefined ? (widths[s] + (widths[s + 1] - widths[s]) * 0.8) : widths[s] * 0.8) * 0.5 * st;
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
        ctx.fillText(names[s], cx + w0 + 14, y0 + 14);
        ctx.fillStyle = 'rgba(233,238,242,' + 0.4 * st + ')';
        ctx.fillText(pct[s], cx + w0 + 14, y0 + 30);
      }
      const flow = sub(t, 0.25, 1);
      if (flow > 0) {
        const time = performance.now() / 1000;
        parts.forEach((p) => {
          const prog = (time * 0.12 * p.speed + p.x) % 1;
          if (prog > flow) return;
          const y = top + (bot - top) * prog;
          const s = Math.min(stages - 1, Math.floor(prog * stages));
          if (p.keep > keepRates[s]) return;
          const wHere = fw * (widths[s] - (widths[s] - (widths[s + 1] ?? widths[s] * 0.8)) * ((prog * stages) % 1)) * 0.5;
          const px = cx + (p.x - 0.5) * 2 * wHere * 0.9;
          ctx.fillStyle = p.keep < keepRates[stages - 1] ? '#00e5a0' : 'rgba(233,238,242,0.45)';
          ctx.fillRect(px - 1.5, y - 1.5, 3, 3);
        });
      }
    };

    const blocks = Array.from(wrap.querySelectorAll('.nx-step-block'));
    const fstate = { t: 0 };
    let gctx = null;
    if (reduced) {
      drawFunnel(1);
      if (blocks[0]) blocks[0].style.opacity = 1;
    } else {
      gctx = gsap.context(() => {
        gsap.to(fstate, {
          t: 1,
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top top', end: '+=260%', scrub: 0.5, pin: true },
        });
        if (blocks.length) {
          gsap.set(blocks[0], { opacity: 1 });
          const ctl = gsap.timeline({
            scrollTrigger: { trigger: wrap, start: 'top top', end: '+=260%', scrub: 0.5 },
          });
          blocks.forEach((b, i) => {
            if (i === 0) return;
            ctl.to(blocks[i - 1], { opacity: 0, y: -24, duration: 1 }, i * 2.5)
               .fromTo(b, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1 }, i * 2.5 + 0.7);
          });
        }
      }, wrap);
      const tick = () => { drawFunnel(fstate.t); rafId = window.requestAnimationFrame(tick); };
      rafId = window.requestAnimationFrame(tick);
    }
    return () => {
      window.removeEventListener('resize', fit);
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

function SectionPage({ theme, section, detail }) {
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

function MarketContext({ theme, compact = false }) {
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

function SubNav({ theme, section, active }) {
  return (
    <nav className="subnav" aria-label="Section navigation">
      <button className={!active ? "active" : ""} onClick={() => routeTo(theme, section.id)}>Overview</button>
      {section.subpages.map((item) => (
        <button key={item.slug} className={active?.slug === item.slug ? "active" : ""} onClick={() => routeTo(theme, section.id, item.slug)}>
          {item.title}
        </button>
      ))}
    </nav>
  );
}

function BeforeAfterSlider({ theme }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = React.useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  };

  const handleMouseMove = (e) => {
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

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('slider-handle') || e.target.closest('.slider-handle')) return;
    e.preventDefault(); // Prevents selection
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
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
            const onMouseMove = (moveEvent) => {
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
            const onTouchMove = (moveEvent) => {
              if (moveEvent.touches.length > 0) {
                handleMove(moveEvent.touches[0].clientX);
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

function InteractiveTimeline({ theme, section }) {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);
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

  const handleStepClick = (idx) => {
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
            <div className="node-label">{timelineCopy[idx].title}</div>
          </div>
        ))}
      </div>

      <div className="timeline-active-content-pane">
        <div className="timeline-step-eyebrow">
          {timelineCopy[activeStep].tag}
        </div>
        <div className="timeline-step-title">{timelineCopy[activeStep].title}</div>
        <p className="timeline-step-desc">
          {timelineCopy[activeStep].desc}
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

function RoiEstimator({ theme }) {
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

function SectionOverview({ theme, section }) {
  const isMarketing = section.id === "marketing";
  const [activeModule, setActiveModule] = useState(null);

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

function TerminalZone({ theme, section }) {
  return (
    <div className="terminal-zone">
      <ProofCards theme={theme} section={section} />
      <FAQ section={section} />
      <IntakeCTA theme={theme} section={section} />
    </div>
  );
}

function HomeProof({ theme, category }) {
  const filtered = DATA.customers.filter(customer => {
    if (!category) return true;
    if (category === "learner") return customer.id === "academy";
    if (category === "business") return customer.id === "marketing" || customer.id === "labs";
    return true;
  });

  return (
    <section className="home-proof">
      <div className="section-head">
        <div>
          <p className="eyebrow">{theme === "neo" ? "Proof" : "Delivery proof"}</p>
          <h2>{theme === "neo" ? "Receipts from each engine." : "Delivery-model proof."}</h2>
        </div>
      </div>
      <div className="proof-receipts">
        {filtered.map((customer, i) => (
          <article className="proof-receipt" key={customer.company}>
            <div className="receipt-head">
              <span className="receipt-tag">{theme === "neo" ? "Receipt" : "Record"}</span>
              <span className="receipt-index">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="receipt-engine">{customer.section}</h3>
            <p className="receipt-context">{customer.company}</p>
            <p className="receipt-result">{customer[theme]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HomeIntakeCTA({ theme, type }) {
  const isLearner = type === "learner";
  const title = isLearner 
    ? (theme === "neo" ? "Ready to start? Let's go." : "Begin your learning path.")
    : (theme === "neo" ? "Ready to ship? Let's build." : "Schedule a business consultation.");
  const body = isLearner
    ? (theme === "neo" ? "Our tracks accept direct intakes. Start your journey today." : "Register for an upcoming cohort or placement screening.")
    : (theme === "neo" ? "Labs and Marketing sections are live. Come build with us." : "Connect with a partner to scope your web platform or AI system.");
  const buttonText = theme === "neo" ? "Get in" : "Begin enquiry";

  return (
    <section className="intake-cta">
      <div>
        <p className="eyebrow">{theme === "neo" ? "Next move" : "Recommended next step"}</p>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <button onClick={() => routeTo(theme, "contact")}>{buttonText}</button>
    </section>
  );
}

function SubpageDetail({ theme, section, page }) {
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

function AudienceFit({ theme, section }) {
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

function StackDetails({ theme, section }) {
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

function FAQ({ section }) {
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

function IntakeCTA({ theme, section }) {
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

function ProofCards({ theme, section }) {
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


function Customers({ theme, detail }) {
  const activeSection = detail ? DATA.sections[detail] : null;
  if (detail && !activeSection) return <NotFound theme={theme} page={`customers/${detail}`} />;
  const proofItems = activeSection ? DATA.customers.filter((customer) => customer.id === detail) : DATA.customers;
  const copy = theme === "neo"
    ? { title: "Proof without fake trophies.", accent: "Readiness stays visible.", body: "Until public client stories are approved, Nexara shows the operating proof each section is built to produce." }
    : { title: "Readiness proof across all three sections.", accent: "Clear outcomes by section.", body: "Each proof card is framed as a delivery model, not an invented customer claim." };
  return (
    <main>
      <HeroBanner compact theme={theme} eyebrow={activeSection ? `${activeSection.name} proof` : "Proof"} title={copy.title} accent={copy.accent} body={copy.body} />
      <section className="module-grid">
        {proofItems.map((customer) => (
          <article className="module-card" key={customer.company}>
            <span>{customer.section}</span>
            <h3>{customer.company}</h3>
            <p>{customer[theme]}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function Company({ theme }) {
  const company = DATA.company[theme];
  return (
    <main>
      <HeroBanner compact theme={theme} eyebrow="Company" title={theme === "neo" ? "Incorporated, then built to move." : "The operating idea is simple."} accent="Capability compounds." body={company.manifesto} />
      <section className="fact-strip">
        {DATA.company.facts.map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>
      <section className="module-grid compact">
        {company.principles.map((principle) => (
          <article className="module-card" key={principle.title}>
            <span>Principle</span>
            <h3>{principle.title}</h3>
            <p>{principle.body}</p>
          </article>
        ))}
      </section>
      <section className="content-band">
        <div className="section-head">
          <div>
            <p className="eyebrow">{theme === "neo" ? "Operating standards" : "Delivery governance"}</p>
            <h2>{theme === "neo" ? "The standards that keep the site honest." : "Public claims and delivery promises stay evidence-led."}</h2>
          </div>
        </div>
        <div className="module-grid compact">
          {DATA.company.standards.map((item) => (
            <article className="module-card" key={item.title}>
              <span>Standard</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function ContactHero({ theme, onStartBrief }) {
  const copy = DATA.contact[theme];
  const isNeo = theme === "neo";
  return (
    <section className={`contact-hero contact-hero--${theme}`}>
      <div className="contact-hero__bg" aria-hidden="true">
        <div className="orb one"/>
        <div className="orb two"/>
        <div className="scanlines"/>
      </div>
      <div className="contact-hero__body">
        <p className="contact-hero__eyebrow eyebrow">{copy.eyebrow}</p>
        <h1 className="contact-hero__heading">{copy.title}</h1>
        <p className="contact-hero__subtext">{copy.body}</p>
        <a className="contact-hero__email-pill" href={`mailto:${copy.accent}`}>{copy.accent}</a>
        <button className="contact-hero__cta" onClick={onStartBrief}>{copy.primary}</button>
      </div>
    </section>
  );
}

function Contact({ theme, detail }) {
  const copy = DATA.contact[theme];
  const {
    sections,
    formData,
    handleChange,
    handleLaneSelect,
    briefText,
    mailtoUrl,
  } = useBriefForm(detail, { scrollSelector: ".brief-planner-grid" });

  return (
    <main>
      <ContactHero theme={theme} onStartBrief={() => {
        document.querySelector(".brief-planner-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }} />

      <section className="contact-layout brief-planner-grid">
        {/* Left Column: The Form */}
        <div className="brief-form-panel">
          <p className="eyebrow">{theme === "neo" ? "01 / YOUR PROJECT" : "Step 1: Project Parameters"}</p>
          <h2 className="planner-title">{theme === "neo" ? "Tell us what you're building." : "Define the engagement scope."}</h2>
          <p className="planner-subtitle">
            {theme === "neo"
              ? "Six fields. One email. We read every one."
              : "Complete each field below. Your responses generate a formatted message sent directly to our intake team."}
          </p>

          <div className="brief-form-group">
            <label>
              <span>Engagement Area</span>
              <small>{theme === "neo" ? "// which section owns this" : "Select the Nexara section that best fits your need"}</small>
            </label>
            <div className="brief-selector-grid">
              {sections.map(s => (
                <button
                  key={s.id}
                  type="button"
                  className={formData.section === s.id ? "brief-select-btn is-active" : "brief-select-btn"}
                  onClick={() => handleChange("section", s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="brief-form-row">
            <div className="brief-form-group">
              <label>
                <span>Target City</span>
                <small>{theme === "neo" ? "// where this runs" : "Primary city of operation or delivery"}</small>
              </label>
              <select
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              >
                {DATA.market.cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="brief-form-group">
              <label>
                <span>Timeline</span>
                <small>{theme === "neo" ? "// how fast" : "Expected start-to-completion window"}</small>
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => handleChange("timeline", e.target.value)}
              >
                <option value="Under 1 month">Under 1 month</option>
                <option value="1-3 months">1–3 months</option>
                <option value="3-6 months">3–6 months</option>
                <option value="Ongoing">Ongoing support</option>
              </select>
            </div>
          </div>

          <div className="brief-form-group">
            <label>
              <span>Target Audience</span>
              <small>{theme === "neo" ? "// who you're building for" : "End users, learners, or customer segment"}</small>
            </label>
            <input
              type="text"
              placeholder="e.g. engineering students, local shoppers"
              value={formData.audience}
              onChange={(e) => handleChange("audience", e.target.value)}
            />
          </div>

          <div className="brief-form-group">
            <label>
              <span>Current Assets & Stack</span>
              <small>{theme === "neo" ? "// what you're starting with" : "Existing website, tools, platforms, or repositories"}</small>
            </label>
            <input
              type="text"
              placeholder="e.g. React website, legacy CRM, none"
              value={formData.context}
              onChange={(e) => handleChange("context", e.target.value)}
            />
          </div>

          <div className="brief-form-group">
            <label>
              <span>Primary Success Metric</span>
              <small>{theme === "neo" ? "// what winning looks like" : "The measurable outcome this engagement should move"}</small>
            </label>
            <input
              type="text"
              placeholder="e.g. 90% placement rate, 2x sales conversion"
              value={formData.successMetric}
              onChange={(e) => handleChange("successMetric", e.target.value)}
            />
          </div>

          <div className="brief-form-row">
            <div className="brief-form-group">
              <label>
                <span>Contact Name</span>
                <small>Decision-maker name</small>
              </label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="brief-form-group">
              <label>
                <span>Contact Email</span>
                <small>Intake routing path</small>
              </label>
              <input
                type="email"
                placeholder="e.g. jane@company.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Brief Preview */}
        <div className="brief-preview-panel glass-panel">
          <p className="eyebrow">{theme === "neo" ? "02 / YOUR SCOPE" : "Step 2: Project Summary"}</p>
          <div className="brief-preview-container">
            <pre className="brief-preview-text">{briefText}</pre>
          </div>
          <div className="brief-preview-actions">
            <a href={mailtoUrl} className="brief-submit-btn">
              {theme === "neo" ? "Send it →" : "Submit via email"}
            </a>
            <p className="brief-disclaimer">
              {theme === "neo"
                ? "Opens your email client with your project details sent to info@nexaragroups.com."
                : "Selecting this opens your email application with your project scope addressed to info@nexaragroups.com."}
            </p>
          </div>
        </div>
      </section>

      {/* The bottom lane selector */}
      <section className="contact-action-explained">
        <p className="eyebrow">{theme === "neo" ? "PICK YOUR LANE" : "Engagement Lanes"}</p>
        <h2>{theme === "neo" ? "Not sure where to start?" : "Select the section that matches your project."}</h2>
        <p>{theme === "neo"
          ? "Each card pre-fills the form for that section. Pick the one that fits."
          : "Choosing a lane pre-populates the form fields for the relevant section scope."}</p>
      </section>

      <section className="module-grid compact">
        {DATA.contact.channels.map((channel) => (
          <article className={"module-card " + (formData.section === channel.section ? "is-active" : "")} key={channel.title}>
            <span>{channel.section === "home" ? "Combined" : DATA.sections[channel.section]?.name}</span>
            <h3>{channel.title}</h3>
            <p>{channel.body}</p>
            <button onClick={() => handleLaneSelect(channel.section)}>{theme === "neo" ? "Set this lane" : "Select lane"}</button>
          </article>
        ))}
      </section>
    </main>
  );
}


function Footer({ theme }) {
  return (
    <footer className="footer">
      <div>
        <strong>Nexara</strong>
        <p>Academy, Digital Marketing and Labs. One company, two presentations.</p>
      </div>
      <div>
        {Object.values(DATA.sections).map((s) => <button key={s.id} onClick={() => routeTo(theme, s.id)}>{s.name}</button>)}
        <button onClick={() => routeTo(theme, "company")}>Company</button>
        <button onClick={() => routeTo(theme, "contact")}>Contact</button>
      </div>
    </footer>
  );
}


export { Site };
