'use client';
import React from "react";
import {
  motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion,
} from "framer-motion";
import { DATA } from "@/lib/data";
import { useRouter } from "next/navigation";
import "@/styles/gateway-cinematic.css";

const { useState, useEffect, useRef } = React;
const EASE = [0.16, 1, 0.3, 1];
const NeoScene = React.lazy(() => import("./Gateway3D").then((m) => ({ default: m.NeoScene })));
const TrustScene = React.lazy(() => import("./Gateway3D").then((m) => ({ default: m.TrustScene })));

function MagneticCTA({ children, onClick, className, href }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });
  const reduce = useReducedMotion();
  function move(e) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.45);
  }
  function leave() { x.set(0); y.set(0); }
  return (
    <motion.a ref={ref} className={className} href={href} onClick={onClick}
      onMouseMove={move} onMouseLeave={leave} style={{ x: sx, y: sy, display: 'inline-flex', alignItems: 'center' }}
      whileTap={{ scale: 0.95 }}>
      <span>{children}</span>
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </motion.a>
  );
}

function Side({ side, copy, phase, onEnter }) {
  const left = side === "neo";
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
  };
  const item = {
    hidden: { y: 26, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
  };
  return (
    <AnimatePresence>
      {phase === "live" && (
        <motion.div
          className={"gw2-content " + (left ? "gw2-content-left" : "gw2-content-right")}
          variants={container} initial="hidden" animate="show">
          <motion.p className={"gw2-kicker " + (left ? "gw2-kicker-neo" : "gw2-kicker-trust")} variants={item}>{copy.kicker}</motion.p>
          <motion.h2 className={"gw2-title " + (left ? "gw2-title-neo" : "gw2-title-trust")} variants={item}>{copy.title}</motion.h2>
          <motion.p className={"gw2-body " + (left ? "" : "gw2-body-trust")} variants={item}>{copy.body}</motion.p>
          <motion.div className="gw2-chips" variants={item}>
            {copy.chips.map((c) => (
              <span key={c} className={"gw2-chip " + (left ? "gw2-chip-neo" : "gw2-chip-trust")}>{c}</span>
            ))}
          </motion.div>
          <motion.div variants={item}>
            <MagneticCTA className={"gw2-cta " + (left ? "gw2-cta-neo" : "gw2-cta-trust")} href={left ? "/neo" : "/trust"} onClick={(e) => { e.preventDefault(); onEnter(); }}>{copy.cta}</MagneticCTA>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Gateway() {
  const router = useRouter();
  const routeTo = (theme: string | null, page = "home", detail: string | null = null) => {
    if (theme === "neo" || theme === "trust") {
      localStorage.setItem("nexara_theme", theme);
    }
    let path = "/";
    if (theme) {
      if (page === "gateway") {
        path = "/";
      } else {
        path = "/" + [theme, page, detail].filter(Boolean).join("/");
      }
    }
    window.scrollTo(0, 0);
    const navigate = () => router.push(path);
    if (document.startViewTransition) {
      document.startViewTransition(navigate);
    } else {
      navigate();
    }
  };
  const reduce = useReducedMotion();
  const g = DATA.gateway;
  const rootRef = useRef(null);
  const [phase, setPhase] = useState(reduce ? "live" : "intro");
  const [exitTo, setExitTo] = useState(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  // mobile gets a clean stacked layout — skip the mouse-seam + heavy 3D scenes
  const showScenes = !reduce && !isMobile;

  const mx = useMotionValue(0.5);
  const seam = useSpring(mx, { stiffness: 90, damping: 22, mass: 0.5 });

  useEffect(() => {
    const apply = (v) => {
      const el = rootRef.current; if (!el) return;
      el.style.setProperty("--seam", (50 + (0.5 - v) * 16) + "%");
    };
    apply(0.5);
    const unsub = seam.on("change", apply);
    return unsub;
  }, [seam]);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setPhase("live"), 500);
    return () => clearTimeout(t);
  }, [reduce]);

  function onMove(e) { if (!reduce) mx.set(e.clientX / window.innerWidth); }
  function onLeave() { mx.set(0.5); }
  function enter(world) { setExitTo(world); setTimeout(() => routeTo(world), 700); }

  return (
    <div className="gw2" ref={rootRef} onMouseMove={onMove} onMouseLeave={onLeave} style={{ "--seam": "50%" }}>
      <div className="gw2-panel gw2-neo">
        <div className="gw2-neo-fx" aria-hidden="true">
          <div className="gw2-grid" />
          {showScenes && (
            <React.Suspense fallback={null}><div className="gw2-stage"><NeoScene /></div></React.Suspense>
          )}
        </div>
      </div>
      <div className="gw2-panel gw2-trust">
        <div className="gw2-trust-fx" aria-hidden="true"><div className="gw2-lines" />
          {showScenes && (<React.Suspense fallback={null}><div className="gw2-stage"><TrustScene /></div></React.Suspense>)}
        </div>
      </div>

      <Side side="neo" copy={g.neo} phase={phase} onEnter={() => enter("neo")} />
      <Side side="trust" copy={g.trust} phase={phase} onEnter={() => enter("trust")} />

      <div className="gw2-brand">
        <motion.h1 className="gw2-wordmark"
          initial={{ opacity: 0, letterSpacing: "0.55em", filter: "blur(7px)" }}
          animate={{ opacity: 1, letterSpacing: "0.16em", filter: "blur(0px)" }}
          transition={{ duration: 1.15, ease: EASE }}>NEXARA</motion.h1>
        <motion.p className="gw2-sub"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8, ease: EASE }}>One company · Two worlds</motion.p>
      </div>

      {phase === "live" && (
        <motion.p className="gw2-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}>{isMobile ? "Tap a world to enter" : "Move across to feel both · click to enter"}</motion.p>
      )}

      <AnimatePresence>
        {phase === "intro" && !reduce && (
          <motion.div className="gw2-veil" exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {exitTo && (
          <motion.div className={"gw2-wipe gw2-wipe-" + exitTo}
            initial={{ clipPath: "circle(0% at 50% 55%)" }}
            animate={{ clipPath: "circle(150% at 50% 55%)" }}
            transition={{ duration: 0.7, ease: EASE }} />
        )}
      </AnimatePresence>
    </div>
  );
}

export { Gateway };
