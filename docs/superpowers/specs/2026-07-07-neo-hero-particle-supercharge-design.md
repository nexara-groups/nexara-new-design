# Neo hero particle supercharge — design

**Date:** 2026-07-07 · **Approved:** user picked approach A ("go with A")
**Scope:** the scroll-runway hero canvas in `nexara-site/src/neo.jsx` (render loop ~L1342–1700). No new dependencies, no engine rewrite. Full experience on all devices (user choice), with frame-time guardrails.

## Goal
The existing 3-strand particle scroll story (cloud → monolith → bloom → focus0/1/2 → lattice) is under-driven. Four additive upgrades inside the current 2D engine:

## 1. Motion trails
Replace the hard `clearRect` with a fade pass (`destination-out` fill) so moving particles leave comet streaks.
- Trail length modulated by scroll velocity: fast morphs → long trails (fade alpha ~0.22), idle → crisp (fade ~0.5).
- Full `clearRect` fallback when idle for many frames (kills 8-bit alpha residue).
- Skipped under `prefers-reduced-motion` (static snapshot renders as today).

## 2. Constellation lines
During each division's `focus` chapter, draw nearest-neighbor lines within the featured strand only.
- Screen-space distance test on a strided subset (every 3rd particle desktop / 2nd mobile), distance cutoff relative to viewport, hard cap on lines per frame (~220).
- Line alpha = closeness × focus-weight × ~0.35, strand color, additive blend.
- Focus-weight = interpolated formation weight (same `seg.e` easing the engine already computes).

## 3. Chapter color takeover
A radial nebula wash drawn under the particles (source-over, before the additive pass), tinted by the active division's accent (violet / coral / mint), alpha ≤ ~0.14, weighted by the same focus-weights. Neutral chapters (cloud/monolith/bloom/lattice) get no wash — the takeover is what makes focus chapters land.

## 4. Depth bloom
Particles with perspective factor > ~1.15 (near camera) get a second, larger low-alpha halo draw and a small size boost. Pure conditional in the existing draw loop.

## Perf guardrails
- DPR stays capped at 2; IntersectionObserver pause stays.
- Line pass strided + capped (see §2). Trails cost one full-canvas fill.
- Acceptance: average frame time < 16.7 ms measured in-browser at hero mid-scroll (desktop viewport); no console errors; reduced-motion path unchanged.

## Out of scope
Kinetic typography, WebGL rewrite, non-home pages, Trust theme.
