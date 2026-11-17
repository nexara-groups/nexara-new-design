'use client';
import React from 'react';
import { DATA } from '@/lib/data';
import { COPY } from '@/lib/copy';
import { voiced, type Theme } from '@/lib/site';
import { imgSize } from '@/components/ui/image-size';
import { bindPointerField, canTrackPointer, useHeroInView } from './useHeroMotion';

const LABS = DATA.sections.labs;

export function statusLabel(status: string, theme: Theme) {
  const c = COPY.labs.products;
  if (status === 'demo') return voiced(c.demo, theme);
  if (status === 'building') return voiced(c.building, theme);
  return voiced(c.live, theme);
}

// The hero art: three real product screens floating in perspective over a receding floor grid. Decorative only
// (the products block further down carries the real alt text). Server HTML is the final composition; every animation
// is CSS that runs from an offset to that state. Script: pointer depth parallax, an in-view pause flag, and a slow
// rotation that brings each product to the front in turn (CSS transitions move the screens between slots).
type Shot = (typeof LABS.products)[number] & { shot: string };
const ORDER = ['agency', 'voice', 'grow'] as const;
const CYCLE_MS = 4800;

function heroShots(): Shot[] {
  return ORDER.map((id) => LABS.products.find((p) => p.id === id))
    .filter((p): p is Shot => !!p && 'shot' in p && typeof p.shot === 'string' && p.shot !== '');
}

export function LabsHeroScene({ theme }: { theme: Theme }) {
  const scene = React.useRef<HTMLDivElement>(null);
  const inView = useHeroInView(scene);
  React.useEffect(() => {
    const el = scene.current;
    const zone = el?.closest<HTMLElement>('header');
    if (!el || !zone || !canTrackPointer()) return;
    return bindPointerField(el, zone, ({ x, y }) => {
      const box = zone.getBoundingClientRect();
      const c = (n: number) => Math.max(-1, Math.min(1, n));
      return { mx: c(((x - box.left) / box.width) * 2 - 1), my: c(((y - box.top) / box.height) * 2 - 1) };
    });
  }, []);

  const shots = heroShots();
  const [front, setFront] = React.useState(0);
  React.useEffect(() => {
    if (!inView || shots.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setFront((f) => (f + 1) % shots.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [inView, shots.length]);
  if (!shots.length) return null;
  return (
    <div className="nx-lab-scene" ref={scene} aria-hidden="true" data-paused={inView ? undefined : ''}>
      <div className="nx-lab-bloom" />
      <div className="nx-lab-stack">
        {shots.map((p, i) => {
          const slot = (i - front + shots.length) % shots.length;
          return (
            <div key={p.id} className="nx-lab-screen" data-slot={slot} data-id={p.id} data-guide-label={p.name} data-guide-line={voiced(p.line, theme)}>
              <div className="nx-lab-rise">
                <div className="nx-lab-win">
                  <div className="nx-lab-chrome">
                    <i /><i /><i />
                    <span>{p.name}</span>
                    <b className="nx-lab-dot" />
                    <em>{statusLabel(p.status, theme)}</em>
                  </div>
                  <div className="nx-lab-glass">
                    <img src={p.shot} alt="" {...imgSize(p.shot)} decoding="async" fetchPriority={i === 0 ? 'high' : 'low'} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
