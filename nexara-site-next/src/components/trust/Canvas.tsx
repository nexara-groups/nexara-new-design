'use client';
import React from 'react';
import { runVisibleAnimation } from '@/lib/animation';

export function TrustParticleCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;
    const ctx: CanvasRenderingContext2D = ctx2d;
    const BG = '#0f1712', LINE = 'rgba(169, 219, 189,', DOT = 'rgba(169, 219, 189,1)';
    const MAX_DIST = 150;
    let W: number, H: number, particles: any[], raf: number;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse proximity tracking state
    const mouse: { x: number | null; y: number | null } = { x: null, y: null };

    // Constructor-function + prototype pattern preserved verbatim from the
    // original ported JS; `this: any` below is a TS-only "this" parameter
    // (erased at compile time, not a real argument) added purely to satisfy
    // strict mode without touching the math.
    function Particle(this: any) {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.28; this.vy = (Math.random() - 0.5) * 0.28;
      this.r = Math.random() * 1.4 + 0.4;
    }
    Particle.prototype.update = function(this: any) {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -4) this.x = W + 4; if (this.x > W + 4) this.x = -4;
      if (this.y < -4) this.y = H + 4; if (this.y > H + 4) this.y = -4;
    };
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    }
    function init() {
      resize();
      const count = window.innerWidth < 760 ? 48 : 96;
      particles = Array.from({ length: count }, () => new (Particle as any)());
    }
    function draw(now = performance.now()) {
      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx*dx + dy*dy;
          if (d2 > MAX_DIST * MAX_DIST) continue;
          const alpha = (1 - Math.sqrt(d2) / MAX_DIST) * 0.28;
          ctx.strokeStyle = LINE + alpha + ')'; ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }

      // Interactive cursor constellation lines
      if (mouse.x !== null && mouse.y !== null) {
        ctx.fillStyle = 'rgba(158, 224, 191, 0.04)';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx*dx + dy*dy;
          if (d2 < 120 * 120) {
            const alpha = (1 - Math.sqrt(d2) / 120) * 0.38;
            ctx.strokeStyle = `rgba(158, 224, 191, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      }

      ctx.fillStyle = DOT;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]; if(!reduced) p.update();
        ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

    }

    // Mouse event handlers
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    init();
    const stop = runVisibleAnimation(canvas,draw,{reducedMotion:reduced});

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { init(); draw(); }, 120); };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      clearTimeout(rt);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);
  return <canvas ref={canvasRef} className="tsx-hero-canvas" aria-hidden="true" />;
}
