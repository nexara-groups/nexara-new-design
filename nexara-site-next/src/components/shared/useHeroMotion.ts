'use client';
import React from 'react';

// Shared motion helpers for the sub-page heroes. Pointer events and timers only: no scroll listeners, no rAF loop.
// Pointer effects exist only on hover-capable fine pointers with motion allowed; everything else keeps the static hero.

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const REDUCED = '(prefers-reduced-motion: reduce)';

/** Whether the visitor asked for reduced motion. Server render reports false; the client corrects it on hydration. */
export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia(REDUCED);
      query.addEventListener('change', notify);
      return () => query.removeEventListener('change', notify);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

/** True while the element is on screen and the tab is visible. Starts false, so nothing runs before it is seen. */
export function useHeroInView(ref: React.RefObject<Element | null>): boolean {
  const [active, setActive] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = false;
    const update = () => setActive(visible && !document.hidden);
    let io: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        visible = entries[entries.length - 1]?.isIntersecting ?? false;
        update();
      }, { threshold: 0.2 });
      io.observe(el);
    } else {
      visible = true;
      update();
    }
    document.addEventListener('visibilitychange', update);
    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, [ref]);
  return active;
}

type Field = (pointer: { x: number; y: number }, el: HTMLElement) => { mx: number; my: number };

/** One pointermove handler, throttled to one write per frame, writing --mx/--my (-1..1) on `el` only. */
export function bindPointerField(el: HTMLElement, zone: HTMLElement, field: Field): () => void {
  let frame = 0;
  let pointer: { x: number; y: number } | null = null;
  const write = (mx: number, my: number) => {
    el.style.setProperty('--mx', mx.toFixed(3));
    el.style.setProperty('--my', my.toFixed(3));
  };
  const flush = () => {
    frame = 0;
    if (!pointer) return;
    const { mx, my } = field(pointer, el);
    write(mx, my);
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(flush);
  };
  const onLeave = () => {
    pointer = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    write(0, 0);
  };
  zone.addEventListener('pointermove', onMove, { passive: true });
  zone.addEventListener('pointerleave', onLeave);
  return () => {
    zone.removeEventListener('pointermove', onMove);
    zone.removeEventListener('pointerleave', onLeave);
    if (frame) cancelAnimationFrame(frame);
  };
}

function motionAllowed() {
  return window.matchMedia(FINE_POINTER).matches && !window.matchMedia(REDUCED).matches;
}

/** Hover-capable fine pointer with motion allowed: the only case where pointer effects run. */
export const canTrackPointer = motionAllowed;

const clamp = (n: number) => Math.max(-1, Math.min(1, n));

/**
 * Tilt a card toward the pointer. The pointer is read over `area` (default: the enclosing section or header)
 * and --mx/--my are written on the card only. `max` is the tilt in degrees (read by .nx-tilt as --tilt).
 */
export function usePointerTilt(ref: React.RefObject<HTMLElement | null>, { max = 4, area }: { max?: number; area?: React.RefObject<HTMLElement | null> } = {}) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    const zone = area?.current ?? el.closest<HTMLElement>('section, header') ?? el;
    el.style.setProperty('--tilt', `${max}deg`);
    return bindPointerField(el, zone, ({ x, y }) => {
      const box = zone.getBoundingClientRect();
      return { mx: clamp(((x - box.left) / box.width) * 2 - 1), my: clamp(((y - box.top) / box.height) * 2 - 1) };
    });
  }, [ref, area, max]);
}

/** Magnetic button: leans up to a few pixels toward a nearby pointer (--mx/--my on the button, read by .nx-magnet). */
export function useMagnet(ref: React.RefObject<HTMLElement | null>, { reach = 140, max = 4 }: { reach?: number; max?: number } = {}) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    const zone = el.closest<HTMLElement>('section, header') ?? el;
    let last = { mx: 0, my: 0 };
    return bindPointerField(el, zone, ({ x, y }) => {
      // The button's own lean moves its box, so measure from where it sits without the lean.
      const box = el.getBoundingClientRect();
      const dx = x - (box.left + box.width / 2 - last.mx * max);
      const dy = y - (box.top + box.height / 2 - last.my * max);
      const dist = Math.hypot(dx, dy);
      last = dist > reach || dist === 0 ? { mx: 0, my: 0 } : { mx: clamp((dx / dist) * (1 - dist / reach)), my: clamp((dy / dist) * (1 - dist / reach)) };
      return last;
    });
  }, [ref, reach, max]);
}
