'use client';
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DATA } from '@/lib/data';
import { HAS_SCROLL_ANIMATION } from '@/lib/shared';
import { routeTo } from '@/lib/neo-router';
import { HeroBanner } from './SectionShell';
import { NeoHeroUnravel, TrustHero } from './Hero';

// See trust/Hero.tsx for why this is repeated per-file rather than centralized.
if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// Minimal shapes actually read by this group — DATA.sections/DATA.customers
// entries carry many more fields (hero, modules, stackDetails, etc.) that
// aren't typed here since this group never touches them.
type Theme = 'neo' | 'trust';

type HomeCopy = {
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  calloutTitle?: string;
  calloutBody?: string;
};

type Section = {
  id: string;
  name: string;
  headline?: string;
  short: { neo?: string; trust?: string };
  desc?: string;
  stack: string[];
};

type Customer = {
  id: string;
  section: string;
  company: string;
  neo: string;
  trust: string;
};

interface HomeProps {
  theme: Theme;
}

interface HomeProofProps {
  theme: Theme;
  category?: 'learner' | 'business' | null;
}

interface HomeIntakeCTAProps {
  theme: Theme;
  type?: 'learner' | 'business';
}

function NeoManifesto() {
  const wrapRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const textEl = el.querySelector<HTMLElement>(".neo-manifesto-text");
    if (!textEl) return;
    const text = (textEl.textContent || '').trim();
    const words = text.split(/\s+/);
    textEl.innerHTML = words.map((w: string) => {
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
        spanElements.forEach((span: Element, i: number) => {
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
  const wrapRef = React.useRef<HTMLElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLElement>(null);

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

  const sections: Section[] = Object.values(DATA.sections);

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
            <button key={sec.id} className="neo-rail-panel" style={{ '--accent': i === 0 ? '#7c5cff' : i === 1 ? '#ff5c8a' : '#00e5a0' } as React.CSSProperties} onClick={() => routeTo('neo', sec.id)}>
              <span className="neo-panel-idx">0{i + 1} / {sec.name.toUpperCase()}</span>
              <span className="neo-panel-orb" />
              <span className="neo-panel-ring" />
              <h3>{sec.name}<br /><span className="serif">{sec.headline || (i === 0 ? "we grow engineers" : i === 1 ? "we make brands move" : "we build intelligence")}</span></h3>
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

function Home({ theme }: HomeProps) {
  const sections: Section[] = Object.values(DATA.sections);
  const copy: HomeCopy = DATA.home[theme];
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

function HomeProof({ theme, category }: HomeProofProps) {
  const filtered: Customer[] = DATA.customers.filter((customer: Customer) => {
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

function HomeIntakeCTA({ theme, type }: HomeIntakeCTAProps) {
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

export { NeoManifesto, NeoDivisionsRail, NeoFinalCTA, Home, HomeProof, HomeIntakeCTA };
