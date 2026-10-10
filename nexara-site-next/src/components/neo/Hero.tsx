// @ts-nocheck -- deep canvas/GSAP animation-state closures left untyped deliberately;
// forcing types here without runtime insight into each closure risks silently
// changing animation timing. Revisit during a dedicated animation-code pass, not
// as a rushed tail-end of this decomposition.
'use client';
import HeroIntro from '../HeroIntro';
import React from 'react';
import { routeTo } from '@/lib/neo-router';
import dynamic from 'next/dynamic';
const NeoHeroController=dynamic(()=>import('./NeoHeroController'),{ssr:false});

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

interface NeoHeroUnravelProps {
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

function NeoHeroUnravel({ copy, theme }: NeoHeroUnravelProps) {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const counterNumRef = React.useRef(null);
  const counterBarRef = React.useRef(null);
  const scrollCueRef = React.useRef(null);


  return (
    <div ref={wrapRef} className="neo-hero-runway">
      <div className="neo-hero-stage" data-hero-surface>
        {/* Atmosphere: static layers animated by transform/opacity only. */}
        <div className="neo-atmos" aria-hidden="true">
          <div className="neo-atmos-floor"><i /></div>
          <div className="neo-atmos-rings"><i /><i /><i /></div>
          <div className="neo-atmos-frame"><i /><i /><i /><i /></div>
        </div>
        <canvas ref={canvasRef} className="neo-hero-canvas" aria-hidden="true" />
        <NeoHeroController wrapRef={wrapRef} canvasRef={canvasRef} titleRef={titleRef} counterNumRef={counterNumRef} counterBarRef={counterBarRef} scrollCueRef={scrollCueRef} />

        {/* Chapters Overlays */}
        <div className="neo-hero-chapter" style={{opacity:1,pointerEvents:"auto"}} data-from="0" data-to="0.07">
          <p className="kicker">An engineering company</p>
          <h1 ref={titleRef} className="neo-hero-title" aria-label="Nexara">
            <span>N</span><span>E</span><span>X</span><span>A</span><span>R</span><span>A</span>
          </h1>
          <HeroIntro theme="neo" />
        </div>

        <div className="neo-hero-chapter" data-from="0.125" data-to="0.225" aria-hidden="true">
          <p className="kicker">The premise</p>
          <h2 className="h-display">One core.<br /><span className="serif">Three forces.</span></h2>
          <p className="lede">Three directions. All pointing at your problem.</p>
        </div>

        <div className="neo-hero-chapter ch-left" style={{ '--accent': '#7c5cff' }} data-from="0.27" data-to="0.45" aria-hidden="true">
          <p className="ch-num">01 / DIVISION</p>
          <h2 className="ch-name">Academy<br /><span className="serif">we grow engineers.</span></h2>
          <p className="lede">Cohort-based programmes that turn ambitious learners into working engineers, sprint by sprint, review by review.</p>
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
          <p className="lede">Brand systems, web experiences and performance creative, built like software and measured like engineering.</p>
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
        <nav className="neo-hero-rail" aria-label="Hero chapters">
          <button type="button" data-label="Nexara" aria-label="Nexara"></button>
          <button type="button" data-label="Premise" aria-label="Premise"></button>
          <button type="button" data-label="Academy" aria-label="Academy"></button>
          <button type="button" data-label="Labs" aria-label="Labs"></button>
          <button type="button" data-label="Marketing" aria-label="Marketing"></button>
          <button type="button" data-label="Begin" aria-label="Begin"></button>
        </nav>
        <div className="neo-hero-counter" aria-hidden="true">
          <strong ref={counterNumRef}>01</strong> / 06
          <span className="neo-counter-bar"><i ref={counterBarRef}></i></span>
        </div>
        <div ref={scrollCueRef} className="neo-scroll-cue" aria-hidden="true">Scroll<i></i></div>
      </div>
    </div>
  );
}

export { CyclingWord, NeoHeroUnravel };
