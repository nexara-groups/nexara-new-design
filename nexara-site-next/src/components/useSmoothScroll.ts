'use client';
import React from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Weighted wheel scrolling, driven from GSAP's ticker so ScrollTrigger scenes
// update on the same frame as the scroll position. Touch stays native
// (syncTouch off) and reduced-motion users keep the browser's own scrolling.
let active: Lenis | null = null;
// Lets overlays (e.g. the mobile menu) pause wheel scrolling underneath them.
export const getLenis = () => active;

export function useSmoothScroll() {
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // lerp (continuous follow) rather than duration+easing: a duration curve
    // restarts on every wheel event, so trackpad streams produced uneven
    // per-frame speed — read as jitter.
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    active = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (active === lenis) active = null;
    };
  }, []);
}
