# Trust hero — silk streams + instrument core

**Date:** 2026-07-08 · **Approved:** user picked "Silk streams + instrument core"
**Scope:** Trust hero canvas in `nexara-site/src/trust.jsx` (blob+particle scroll story, ~L1013–1481). No new deps. Restrained, precision-instrument aesthetic — this is Trust, not Neo.

## 1. Curved particle paths
Particles currently lerp straight src→dst. Each particle gets a per-particle `arc` factor; path bows perpendicular to the travel line, peaking mid-flight (`sin(π·t)`). Streams read as braided silk instead of a straight jet.

## 2. Silk trails (offscreen layer)
Particles draw onto an offscreen trail canvas that fades with `destination-out` (~0.40 alpha, slightly weaker while scrolling) instead of clearing. The main canvas still hard-clears every frame and composites the trail layer FIRST, then draws filaments, blobs, core, and labels crisp on top — **no ghosting on text or rings**. Reduced motion: trail layer clears fully (no streaks).

## 3. Filament lines
While a division blob is apart from the core and its stream is active, a 1px gradient filament (transparent → division color → transparent) connects blob ↔ core. Alpha tied to stream alpha and distance, ~0.2 max. Reads as a lit fiber, "systems connected".

## 4. Instrument core
Around the pulsing core: a slowly rotating tick ring (48 radial ticks, alpha ~0.3 × core intensity) and one thin orbit ellipse whose vertical radius breathes over time. Measurement-instrument look.

## 5. Focused blob dial
Focused blobs gain an outer dashed ring (`lineDash [2,6]`, radius ×1.45) whose `lineDashOffset` animates — a slow precision dial. Alpha ~0.4.

## Guardrails
- One extra full-canvas composite per frame (trail layer) — trivial at 3×140 particles.
- Trail canvas resized in `measure()` alongside the main canvas.
- Acceptance: labels/rings stay crisp (no smear), streams curve visibly, console clean, frame cost well under 16.7 ms.

## Out of scope
Wordmark beam, chapter copy, rail/counter, Neo theme, background washes.
