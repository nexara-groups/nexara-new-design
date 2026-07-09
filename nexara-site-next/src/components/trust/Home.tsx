'use client';
import React from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DATA } from '@/lib/data';
import { HAS_SCROLL_ANIMATION } from '@/lib/shared';
import { routeTo } from '@/lib/trust-router';
import { getTrustSectionLabel, TRUST_ACCENT, TRUST_OPERATING_STANDARD } from './shared';
import { TrustHeroFlat, TrustHeroUnravel } from './Hero';
import { TrustSolutionsGrid, TrustEnterpriseStacks, TrustProofStrip, TrustMarketContext } from './Misc';
import { TrustLedgerRows } from './Cards';

export function TrustManifesto() {
  const wrapRef = React.useRef<HTMLElement | null>(null);
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

export function TrustDivisionsRail() {
  const wrapRef = React.useRef<HTMLElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const progressRef = React.useRef<HTMLElement | null>(null);
  const tickRef = React.useRef<HTMLSpanElement | null>(null);

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
  const TAGLINE: Record<string, string> = { academy: 'the talent engine.', marketing: 'the growth signal.', labs: 'the build studio.' };

  return (
    <section className="tsx-rail-wrap" id="divisions" ref={wrapRef}>
      <div className="tsx-rail-stage">
        <div className="rail-head">
          <div>
            <p className="tsx-section-eyebrow">Service lines</p>
            <h2 className="tsx-section-heading">Three practice areas.<br /><span className="serif">One operating standard.</span></h2>
          </div>
          <p className="rail-progress"><b ref={progressRef}>01</b> / 03</p>
        </div>
        <div className="tsx-rail-baseline" aria-hidden="true"><span className="tsx-rail-tick" ref={tickRef} /></div>
        <div className="tsx-rail-track" ref={trackRef}>
          {sections.map((sec, i) => {
            const accent = ACCENT[sec.id] || '#1D4ED8';
            const modules = (sec.modules || []).slice(0, 4);
            return (
              <article key={sec.id} className="tsx-rail-panel" style={{ '--accent': accent } as React.CSSProperties}>
                <span className="tsx-panel-watermark" aria-hidden="true">0{i + 1}</span>
                <span className="tsx-panel-ring" aria-hidden="true" />
                <div className="tsx-panel-head">
                  <span className="tsx-panel-idx">0{i + 1} / {getTrustSectionLabel(sec).toUpperCase()}</span>
                  <h3>{getTrustSectionLabel(sec)}<br /><span className="serif">{(sec as { headline?: string }).headline || TAGLINE[sec.id]}</span></h3>
                  <p>{sec.short.trust || (sec as { desc?: string }).desc}</p>
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

export function TrustFinalCTA() {
  return (
    <section className="tsx-final-cta">
      <p className="tsx-section-eyebrow">Enterprise intake</p>
      <a href="#contact" onClick={(e) => { e.preventDefault(); routeTo('trust', 'contact'); }}>Start <em>the request.</em></a>
      <p>Scoped response within two working days.</p>
      <button className="tsx-btn-cta tsx-final-cta-btn" onClick={() => routeTo('trust', 'contact')}>Start a Project <span className="arr">→</span></button>
    </section>
  );
}

export function TrustHome() {
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
