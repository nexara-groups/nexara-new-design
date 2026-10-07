// Decorative loops sleep outside the viewport and in background tabs.
// Keep a single pending frame; reduced motion draws one still frame.
export function runVisibleAnimation(element, draw, { reducedMotion = false } = {}) {
  let frame = 0;
  let visible = false;
  let lastDraw = -Infinity;
  let stopped = false;
  const interval = window.matchMedia('(pointer: coarse)').matches ? 1000 / 30 : 1000 / 60;

  const tick = (now) => {
    frame = 0;
    if (stopped || !visible || document.hidden) return;
    if (now - lastDraw >= interval - 1) {
      lastDraw = now;
      draw(now);
    }
    if (!reducedMotion) frame = requestAnimationFrame(tick);
  };
  const update = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (visible && !document.hidden && !stopped) frame = requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  });
  observer.observe(element);
  document.addEventListener('visibilitychange', update);
  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    document.removeEventListener('visibilitychange', update);
  };
}
