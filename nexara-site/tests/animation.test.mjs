import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runVisibleAnimation } from '../src/animation.js';

function harness(t, options = {}) {
  const originals = new Map();
  const frames = new Map();
  let id = 0, observer, visibilityChange, draws = 0;
  const document = {
    hidden: false,
    addEventListener: (_, callback) => { visibilityChange = callback; },
    removeEventListener: (_, callback) => { if (visibilityChange === callback) visibilityChange = null; },
  };
  const globals = {
    document,
    window: { matchMedia: () => ({ matches: !!options.touch }) },
    requestAnimationFrame: callback => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: key => frames.delete(key),
    IntersectionObserver: class {
      constructor(callback) { observer = this; this.callback = callback; }
      observe() {}
      disconnect() { this.disconnected = true; }
    },
  };
  for (const [key, value] of Object.entries(globals)) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { value, configurable: true });
  }
  t.after(() => {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  const stop = runVisibleAnimation({}, () => draws++, options);
  return {
    stop, frames, document,
    get draws() { return draws; },
    get disconnected() { return observer.disconnected; },
    get listener() { return visibilityChange; },
    visible(value) { observer.callback([{ isIntersecting: value }]); },
    hide(value) { document.hidden = value; visibilityChange(); },
    frame(time) { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(time)); },
  };
}

test('decorations sleep offscreen and keep a single frame when resumed', t => {
  const h = harness(t);
  assert.equal(h.frames.size, 0);
  h.visible(true); h.visible(true);
  assert.equal(h.frames.size, 1);
  h.frame(0); assert.equal(h.draws, 1);
  h.visible(false); assert.equal(h.frames.size, 0);
  h.visible(true); assert.equal(h.frames.size, 1);
  h.stop(); assert.equal(h.frames.size, 0);
  assert.equal(h.disconnected, true); assert.equal(h.listener, null);
});

test('background tabs pause and resume without duplicating frames', t => {
  const h = harness(t);
  h.visible(true); h.hide(true);
  assert.equal(h.frames.size, 0);
  h.visible(true); assert.equal(h.frames.size, 0);
  h.hide(false); h.frame(0);
  assert.equal(h.draws, 1); assert.equal(h.frames.size, 1);
  h.stop();
});

test('reduced motion draws a still frame without a running loop', t => {
  const h = harness(t, { reducedMotion: true });
  h.visible(true); h.frame(0);
  assert.equal(h.draws, 1); assert.equal(h.frames.size, 0);
  h.stop();
});

test('touch devices limit decorative drawing to 30 frames per second', t => {
  const h = harness(t, { touch: true });
  h.visible(true);
  [0, 16.7, 33.4, 50.1, 66.8].forEach(time => h.frame(time));
  assert.equal(h.draws, 3);
  h.stop();
});
