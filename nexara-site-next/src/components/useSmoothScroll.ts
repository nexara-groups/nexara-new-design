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

// Route changes reset scroll to the top. A hash (the estimate form is #brief) should win.
export function scrollToHashOrTop() {
  const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  const target = id ? document.getElementById(id) : null;
  if (!target) {
    window.scrollTo(0, 0);
    active?.scrollTo(0, { immediate: true });
    return;
  }
  const chrome = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nx-chrome-top')) || 72;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - chrome - 16);
  window.scrollTo(0, top);
  active?.scrollTo(top, { immediate: true });
}

export function useSmoothScroll() {
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Touch scrolling stays native, so on phones Lenis only added work: it toggled a class on
    // <html> at the start and end of every swipe, restyling the whole page mid-gesture.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
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
