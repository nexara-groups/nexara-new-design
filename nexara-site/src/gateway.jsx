import React from 'react';
import { DATA } from './data.js';
import { routeTo } from './shared.js';
const { useState } = React;

export function Gateway() {
  const [hover, setHover] = useState(null);
  const [leaving, setLeaving] = useState(null);
  const [mobileIntent, setMobileIntent] = useState(null);
  const rootRef = React.useRef(null);
  const mobileSplitRef = React.useRef(50);
  const tiltPermissionRef = React.useRef(false);
  const dragMovedRef = React.useRef(false);
  const neo = DATA.gateway.neo;
  const trust = DATA.gateway.trust;
  const sections = DATA.nav.filter(item => item.page !== "contact");
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    const onMove = (e) => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const mx = (e.clientX / window.innerWidth) * 2 - 1;
        const my = (e.clientY / window.innerHeight) * 2 - 1;
        el.style.setProperty("--mx", mx.toFixed(3));
        el.style.setProperty("--my", my.toFixed(3));
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const coarse = window.matchMedia("(pointer: coarse)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!coarse.matches || reduce.matches) return;

    let dragging = false;
    let startY = 0;
    let raf = 0;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const setSplit = (split, source) => {
      const next = clamp(split, 34, 66);
      mobileSplitRef.current = next;
      el.style.setProperty("--gate-split", next.toFixed(2) + "%");
      const intent = next > 53 ? "neo" : next < 47 ? "trust" : null;
      setMobileIntent(intent);
      if (source) el.dataset.mobileInput = source;
    };
    const updateFromY = (clientY) => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const y = clamp(clientY / Math.max(window.innerHeight, 1), 0, 1);
        setSplit(66 - y * 32, "touch");
      });
    };
    const requestTilt = () => {
      if (tiltPermissionRef.current) return;
      tiltPermissionRef.current = true;
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission().catch(() => {});
      }
    };
    const onPointerDown = (event) => {
      dragging = true;
      startY = event.clientY;
      dragMovedRef.current = false;
      requestTilt();
      el.setPointerCapture?.(event.pointerId);
      updateFromY(event.clientY);
    };
    const onPointerMove = (event) => {
      if (!dragging) return;
      if (Math.abs(event.clientY - startY) > 10) dragMovedRef.current = true;
      updateFromY(event.clientY);
    };
    const onPointerUp = (event) => {
      dragging = false;
      el.releasePointerCapture?.(event.pointerId);
    };
    const onOrientation = (event) => {
      if (dragging || event.gamma == null) return;
      const tilt = clamp(event.gamma, -18, 18) / 18;
      setSplit(50 + tilt * 10, "tilt");
    };

    setSplit(50);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("deviceorientation", onOrientation);
      if (raf) window.cancelAnimationFrame(raf);
      delete el.dataset.mobileInput;
    };
  }, []);
  const enter = (theme) => {
    if (leaving) return;
    if (dragMovedRef.current) { dragMovedRef.current = false; return; }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { routeTo(theme); return; }
    setLeaving(theme);
    window.setTimeout(() => routeTo(theme), 640);
  };
  const cls = "gateway" +
    (hover && !leaving ? " is-" + hover : "") +
    (mobileIntent && !leaving ? " mobile-" + mobileIntent : "") +
    (leaving ? " is-leaving leave-" + leaving : "");
  return (
    <main className={cls} ref={rootRef}>
      <section
        className="gate-panel gate-neo"
        onMouseEnter={() => setHover("neo")}
        onMouseLeave={() => setHover(null)}
        onClick={() => enter("neo")}
      >
        <div className="gate-aurora" aria-hidden="true">
          <span className="aurora-blob b1"></span>
          <span className="aurora-blob b2"></span>
          <span className="aurora-blob b3"></span>
        </div>
        <div className="gate-motion-grid"></div>
        <div className="grain-layer" aria-hidden="true"></div>
        <div className="gate-content">
          <p className="gate-kicker">{neo.kicker}</p>
          <h1>{neo.title}</h1>
          <p>{neo.body}</p>
          <ul className="gate-preview" aria-hidden="true">
            {sections.map(item => <li key={item.page}>&gt; {item.label}</li>)}
          </ul>
          <div className="gate-mini-stats">
            {neo.chips.map(chip => <span key={chip}>{chip}</span>)}
          </div>
          <button onClick={(e) => { e.stopPropagation(); enter("neo"); }}>
            {neo.cta}
          </button>
        </div>
      </section>
      <section
        className="gate-panel gate-trust"
        onMouseEnter={() => setHover("trust")}
        onMouseLeave={() => setHover(null)}
        onClick={() => enter("trust")}
      >
        <div className="gate-aurora" aria-hidden="true">
          <span className="aurora-blob b1"></span>
          <span className="aurora-blob b2"></span>
          <span className="aurora-blob b3"></span>
        </div>
        <div className="grain-layer" aria-hidden="true"></div>
        <div className="gate-content">
          <p className="gate-kicker">{trust.kicker}</p>
          <h1>{trust.title}</h1>
          <p>{trust.body}</p>
          <ul className="gate-preview" aria-hidden="true">
            {sections.map(item => <li key={item.page}>{item.trustLabel}</li>)}
          </ul>
          <div className="gate-mini-stats">
            {trust.chips.map(chip => <span key={chip}>{chip}</span>)}
          </div>
          <button onClick={(e) => { e.stopPropagation(); enter("trust"); }}>
            {trust.cta}
          </button>
        </div>
      </section>
      <div className="gate-brand">
        <strong>NEXARA</strong>
        <span>one company / two presentations</span>
      </div>
    </main>
  );
}
