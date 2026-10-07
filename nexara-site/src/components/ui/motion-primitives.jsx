// Adapted from Motion Primitives by Julien Thibeaut (MIT), published on 21st.dev.
// Sources and license: THIRD_PARTY_NOTICES.md.
import '../elevation.css';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

// Pointer effects settle when idle and stay still on touch/reduced-motion devices.
function useFineMotion() {
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return fine && !reduced;
}

export function Tilt({ as = 'div', children, className = '', style, rotationFactor = 5, onMouseMove, onMouseLeave, ...props }) {
  const ref = useRef(null);
  const enabled = useFineMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 180, damping: 24 });
  const ySpring = useSpring(y, { stiffness: 180, damping: 24 });
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [rotationFactor, -rotationFactor]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-rotationFactor, rotationFactor]);
  const Element = motion[as];
  useEffect(() => { if (!enabled) { x.set(0); y.set(0); } }, [enabled, x, y]);
  return <Element ref={ref} className={`depth-card ${className}`} {...props}
    style={{ ...style, transformPerspective: 1000, ...(enabled ? { rotateX, rotateY } : {}) }}
    onMouseMove={event => {
      if (enabled && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - .5);
        y.set((event.clientY - rect.top) / rect.height - .5);
        ref.current.style.setProperty('--light-x', `${event.clientX - rect.left}px`);
        ref.current.style.setProperty('--light-y', `${event.clientY - rect.top}px`);
      }
      onMouseMove?.(event);
    }}
    onMouseLeave={event => { x.set(0); y.set(0); onMouseLeave?.(event); }}>
    {children}
  </Element>;
}

export function Spotlight({ size = 600, className = '' }) {
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const enabled = useFineMotion();
  const mouseX = useSpring(0, { stiffness: 100, damping: 25 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 25 });
  const left = useTransform(mouseX, x => x - size / 2);
  const top = useTransform(mouseY, y => y - size / 2);
  const move = useCallback(event => {
    const parent = containerRef.current?.closest('[data-hero-surface]');
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left); mouseY.set(event.clientY - rect.top);
  }, [mouseX, mouseY]);
  useEffect(() => {
    const parent = containerRef.current?.closest('[data-hero-surface]');
    if (!enabled || !parent) { setHovered(false); return; }
    const controller = new AbortController();
    parent.addEventListener('pointermove', move, { signal: controller.signal, passive: true });
    parent.addEventListener('pointerenter', () => setHovered(true), { signal: controller.signal });
    parent.addEventListener('pointerleave', () => setHovered(false), { signal: controller.signal });
    return () => controller.abort();
  }, [enabled, move]);
  return <motion.div ref={containerRef} aria-hidden="true" className={`hero-spotlight ${className}`}
    style={{ width: size, height: size, left, top, opacity: enabled && hovered ? 1 : 0 }} />;
}

export function HeroLighting() {
  return <div className="hero-lighting" aria-hidden="true">
    <div className="hero-lighting__wash" /><div className="hero-lighting__lens" />
    <Spotlight />
  </div>;
}
