'use client';
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HAS_SCROLL_ANIMATION, SECTION_HERO_WORDS } from '@/lib/shared';
import { routeTo } from '@/lib/neo-router';
import { CyclingWord } from './Hero';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof window !== 'undefined') Object.assign(window, { gsap, ScrollTrigger });

declare global {
  interface Window {
    gsap?: typeof gsap;
    ScrollTrigger?: typeof ScrollTrigger;
  }
}

type Theme = 'neo' | 'trust';

type HeroCopy = {
  eyebrow: string;
  title: string;
  body: string;
  primary: string;
  secondary: string;
};

type AcademySection = {
  hero: Record<Theme, HeroCopy>;
};

interface AcademyHeroProps {
  theme: Theme;
  section: AcademySection;
}

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

type AcademyPillar = {
  id: string;
  label: string;
  title: string;
  desc: string;
  color: string;
  sub: string;
  details: string[];
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function AcademyHero({ theme, section }: AcademyHeroProps) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const pinRef = React.useRef<HTMLElement | null>(null);
  const cubeRef = React.useRef<HTMLDivElement | null>(null);
  const faceRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const contentRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const cardRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const stageBaseRef = React.useRef<HTMLDivElement | null>(null);
  const captionTitleRef = React.useRef<HTMLElement | null>(null);
  const captionDescRef = React.useRef<HTMLParagraphElement | null>(null);
  const deckRef = React.useRef<HTMLDivElement | null>(null);
  const applyFrameRef = React.useRef<((p: number) => void) | null>(null);

  const copy = section.hero[theme];

  const pillars: [AcademyPillar, AcademyPillar, AcademyPillar, AcademyPillar] = [
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

  const handleCardClick = (index: number) => {
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

    const applyFrame = (p: number) => {
      const activeIndex = Math.min(3, Math.floor(p * 4)) as 0 | 1 | 2 | 3;
      const openProgress = clamp01(p / 0.12);

      const activePillar = pillars[activeIndex];

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
          el.style.opacity = String(1 - openProgress * 0.4);
        } else if (i === 2) { // left
          const tx = -40 - openProgress * 40;
          const tz = -40 * (1 - openProgress);
          const ry = -90 + openProgress * 90;
          el.style.transform = `translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg)`;
          el.style.opacity = String(1 - openProgress * 0.4);
        } else if (i === 3) { // right
          const tx = 40 + openProgress * 40;
          const tz = -40 * (1 - openProgress);
          const ry = 90 - openProgress * 90;
          el.style.transform = `translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg)`;
          el.style.opacity = String(1 - openProgress * 0.4);
        } else if (i === 4) { // front
          const ty = 40 + openProgress * 40;
          const tz = -40 * (1 - openProgress);
          const rx = -90 + openProgress * 90;
          el.style.transform = `translate3d(0, ${ty}px, ${tz}px) rotateX(${rx}deg)`;
          el.style.opacity = String(1 - openProgress * 0.4);
        } else if (i === 5) { // top
          const ty = -40 - openProgress * 40;
          const tz = 40;
          const rx = 0 - openProgress * 125;
          el.style.transform = `translate3d(0, ${ty}px, ${tz}px) rotateX(${rx}deg)`;
          el.style.opacity = String(1 - openProgress * 0.5);
        }
      });

      // Update emerging visual content
      contentRefs.current.forEach((el, i) => {
        if (!el) return;
        const isActive = i === activeIndex;
        el.style.opacity = String(isActive ? 1 : 0);
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
        el.style.zIndex = String(isActive ? 50 : 20 - i);
      });

      // Update deck container custom property for styling support
      if (deckRef.current) {
        deckRef.current.style.setProperty("--active-pillar", String(activeIndex));
      }

      // Update caption texts
      if (captionTitleRef.current) captionTitleRef.current.textContent = activePillar.title;
      if (captionDescRef.current) captionDescRef.current.textContent = activePillar.desc;

      // Update grid base color theme
      if (stageBaseRef.current) {
        stageBaseRef.current.style.background = `radial-gradient(circle, ${activePillar.color} 0%, transparent 70%)`;
      }
    };

    applyFrameRef.current = applyFrame;

    const scrollTrigger = window.ScrollTrigger;
    const shouldPin = HAS_SCROLL_ANIMATION && scrollTrigger && window.innerWidth > 980;
    if (shouldPin && pinRef.current) {
      const runway = Math.round(Math.min(760, Math.max(420, window.innerHeight * 0.7)));
      wrap.dataset.scrollRunway = String(runway);
      applyFrame(0);
      const st = scrollTrigger.create({
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
                    style={{ "--face-color": pillars[0].color } as CSSVars}
                  ></div>
                ))}
                
                {/* Emerging 3D visuals representing the current pillar */}
                <div className="stage-content-container">
                  
                  {/* Visual 1: Books (Structured Skilling) */}
                  <div ref={el => { contentRefs.current[0] = el; }} className="stage-graphics books-graphics is-active" style={{ "--face-color": pillars[0].color } as CSSVars}>
                    <div className="floating-book book-1"><span>RE</span></div>
                    <div className="floating-book book-2"><span>AI</span></div>
                    <div className="floating-book book-3"><span>UX</span></div>
                  </div>

                  {/* Visual 2: Trainings (Cohorts & Mentoring) */}
                  <div ref={el => { contentRefs.current[1] = el; }} className="stage-graphics trainings-graphics" style={{ "--face-color": pillars[1].color } as CSSVars}>
                    <div className="orbital-ring ring-1"></div>
                    <div className="orbital-ring ring-2"></div>
                    <div className="cohort-node node-1"></div>
                    <div className="cohort-node node-2"></div>
                    <div className="cohort-node node-3"></div>
                    <div className="central-glow"></div>
                  </div>

                  {/* Visual 3: Internships (Briefs & Internships) */}
                  <div ref={el => { contentRefs.current[2] = el; }} className="stage-graphics internships-graphics" style={{ "--face-color": pillars[2].color } as CSSVars}>
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
                  <div ref={el => { contentRefs.current[3] = el; }} className="stage-graphics placements-graphics" style={{ "--face-color": pillars[3].color } as CSSVars}>
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
                    } as CSSVars}
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
export function AcademyTerminalSection() {
  const wrapRef = React.useRef<HTMLElement | null>(null);
  const bodyRef = React.useRef<HTMLDivElement | null>(null);

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

    const charSpans: HTMLSpanElement[] = [];
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

export function AcademyBootSequence() {
  const progressRef = React.useRef<HTMLSpanElement | null>(null);

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
    return () => { tween.kill(); };
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
