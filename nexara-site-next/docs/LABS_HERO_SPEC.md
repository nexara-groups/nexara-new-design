# Labs hero: "Screen stage" spec

Scope: the hero of `/neo/labs` and `/trust/labs` only (`LabsHero` in `src/components/shared/LabsPage.tsx`).
Everything below the hero stays as is.

## Why

The page below already shows, in order: proof (client cards), products (screenshots plus copy),
the layer map, modules, a Frame/Design/Build/Launch stages rail, packages and FAQs. The current hero card
repeats products and stages in miniature, so it adds nothing and looks cramped.

**Rule:** the hero shows one outcome (real software, shipped and live) and names nothing.
No picker, list, stepper, rail, caption or label that matches a heading further down the page.

## Concept

The headline promises "the system that solves the problem". The art answers with the product itself,
at a size that fills the screen. Three real product screens float in perspective, the front one
large enough to bleed off the right and bottom edges. A faint receding floor grid sits beneath them as the
"system" they stand on. On load they rise into place once and a light sweep crosses the front screen
("launch"). Then they drift slowly and follow the pointer with depth parallax.

## Layout

- `header.nx-lab-hero` becomes a stage. `min-height: min(calc(100svh - var(--nx-chrome-top, 72px)), 880px)`.
  `display: grid; align-items: center; overflow: clip; position: relative; isolation: isolate`.
- The copy column sits on top (`position: relative; z-index: 2`), `max-width: min(560px, 46%)` on desktop.
  - Keep the kicker, h1, lede and both CTAs, with the same elements and strings. Tests pin the h1 text.
  - Headline: `font-size: clamp(2.6rem, 6vw, 5.4rem); line-height: .98; max-width: 11ch`.
  - Lede: `font-size: clamp(1.05rem, 1.3vw, 1.2rem)`.
- The art (`.nx-lab-scene`, new) is `position: absolute; inset: 0; z-index: 1; pointer-events: none`.
  The stack inside it is anchored right: `left: 44%; right: -12%; top: 8%; bottom: -14%`.
- Legibility scrim: on the copy side only, a `::before` on the scene,
  `linear-gradient(90deg, var(--nx-lp-bg) 0 34%, transparent 62%)`.
- Remove the old 2-column `.nx-lab-hero-grid` usage for the hero. The wrap stays for horizontal padding.

## The scene (new file `src/components/shared/LabsHeroScene.tsx`)

`'use client'`. Decorative: the root has `aria-hidden="true"` and every `<img>` has `alt=""`.
The products block below carries the real alt text.

```
.nx-lab-scene
  .nx-lab-floor                  (perspective grid floor)
  .nx-lab-stack                  (perspective: 1800px; transform-style: preserve-3d; tilted container)
    .nx-lab-screen[data-depth=3] back-left   -> voice
    .nx-lab-screen[data-depth=2] back-right  -> grow
    .nx-lab-screen[data-depth=1] front       -> agency   (largest, gets the sweep and the live dot)
      .nx-lab-chrome  (3 dots + product name + status dot, from data; no new copy)
      .nx-lab-glass   (img + sweep pseudo-element)
  .nx-lab-bloom                  (accent light pool under the front screen)
```

- Products: take `DATA.sections.labs.products` by id `['agency', 'voice', 'grow']`, keeping only those that
  exist and have `shot`. With fewer than 3, render what exists.
- Images: front `fetchPriority="high"`, back two `fetchPriority="low"`, all `decoding="async"`, and width/height
  from `imgSize()`. The real files are landscape: 1400×790, already fixed in `image-size.ts`.
- Each screen is a browser window: `border-radius: 14px`, 1px `--nx-lp-line` border, chrome bar 28px,
  `--nx-lp-paper` background, image `object-fit: cover; object-position: top left`, `aspect-ratio: 1400/790`.
- Stack container transform: `rotateY(-16deg) rotateX(7deg) rotateZ(1.5deg)`.
- Screen placement inside the stack (percentages of the stack box):
  - Front (agency): `width: 78%; left: 8%; top: 22%; transform: translateZ(80px)`.
  - Back-left (voice): `width: 56%; left: 0; top: 0; transform: translateZ(-120px); opacity .78`.
  - Back-right (grow): `width: 58%; left: 44%; top: 4%; transform: translateZ(-220px); opacity .62`.
  - Back screens also get `filter: saturate(.8)`. Do not blur them; blur is expensive and muddy.
- Depth shadows: front `0 60px 120px -40px rgba(0,0,0,.65), 0 0 0 1px color-mix(in srgb, var(--nx-lp-cta) 30%, transparent)`.
  Trust uses softer `rgba(15,34,25,.18)`.
- Floor: `.nx-lab-floor` absolute, bottom 45% of the scene, `transform: perspective(700px) rotateX(62deg)`,
  `transform-origin: bottom`.
  - Grid: two `repeating-linear-gradient`s (0deg and 90deg), 1px lines every 48px,
    color `color-mix(in srgb, var(--nx-lp-cta) 18%, transparent)`.
  - Mask: `radial-gradient(ellipse at 60% 100%, #000 20%, transparent 70%)`.
- Bloom: radial accent pool, `color-mix(in srgb, var(--nx-lp-cta) 35%, transparent)` → transparent,
  under the front screen, `filter: blur(40px)` (one static element, fine).
- Live dot in the front chrome bar: 8px circle in `--nx-lp-cta` with a ring pulse.
  Status text from the existing `statusLabel()` (move it or import it). No new strings.

## Motion (CSS first; no scroll listeners, no rAF loop, no state reset after hydration)

The server HTML is already the final composition. Every animation goes from an offset to that state,
using `animation-fill-mode: both`, so hydration never snaps anything.

1. **Entrance, once.** Plays inside `@media (prefers-reduced-motion: no-preference)`.
   - Each screen: `@keyframes nx-lab-rise { from { opacity: 0; translate: 0 70px; } }` (use `translate`,
     not `transform`, so the per-screen `translateZ` stays intact).
     `900ms cubic-bezier(.2,.7,.2,1)`. Delays: back-right 0ms, back-left 120ms, front 260ms.
   - Floor: fade plus `scale` from .9, 1200ms.
   - Copy: the existing `nx-hero-rise` on the title is fine. Add the lede at 120ms and the actions at 200ms.
2. **Launch sweep, once.** `.nx-lab-glass::after` is a diagonal light band
   (`linear-gradient(105deg, transparent 40%, rgba(255,255,255,.22) 50%, transparent 60%)`) moving
   `translate: -120% 0 → 120% 0` over 1100ms, delay 1000ms. Trust uses `.5` white over light shots.
3. **Ambient drift, infinite.** Each screen floats `translate: 0 0 → 0 -8px → 0 0`, durations 8s / 9.5s / 11s,
   negative delays so they are out of phase. It starts after the entrance: put both in one `animation:` list.
4. **Live dot pulse, infinite.** Ring `scale(1)→scale(2.4)`, opacity `.6→0`, 2.4s.
5. **Pointer parallax.** Fine pointer, hover-capable, motion allowed.
   - One small hook in the scene file, reusing `bindPointerField` from `useHeroMotion.ts` (export it).
     It listens on the whole `header` and writes `--mx/--my` (-1..1) on `.nx-lab-scene`.
   - CSS: `.nx-lab-stack { rotate: y calc(var(--mx,0) * 4deg); }` plus, per screen,
     `.nx-lab-screen { margin-left: calc(var(--mx,0) * var(--px)); margin-top: calc(var(--my,0) * var(--px)); }`
     with `--px` 6px / 14px / 22px for depth 3 / 2 / 1. Front moves most. Instead of margins, a wrapper
     element with `translate` is fine and preferred: margins cause layout, translate does not.
     Transition 300ms ease-out.
6. **Reduced motion:** no entrance, sweep, drift or parallax. The static final composition stays.
7. **Offscreen:** pause the infinite animations when the hero is out of view.
   Use `useHeroInView` (already exists) to toggle `data-paused` on the scene, and
   `[data-paused] * { animation-play-state: paused; }`.

## Responsive

- **≤ 900px:** the copy becomes full width, the scrim goes, and the scene moves into normal flow below the
  copy as a block: `position: relative; height: clamp(240px, 62vw, 420px); margin-inline: calc(-1 * var(--gutter, 20px))`.
  - The stack stays anchored right, so the front screen still bleeds off the right edge.
  - The stack transform softens to `rotateY(-12deg) rotateX(6deg)`.
  - Header `min-height` is unset.
- **≤ 560px:** hide the back-right screen. The headline uses `clamp(2.3rem, 10vw, 3rem)`.
- **Fold:** both CTAs must be above the fold at the pane width (~445px wide) and at 375×812, with the
  cookie banner up.

## Skins

- One structure, no theme checks in TSX. Only `--nx-lp-*` tokens plus a few `.trust` overrides for shadow
  and sweep strength.
- Neo uses the orange division colour (already in tokens). Trust uses its blue/green tokens as it does today.

## Remove

- `LabsRig`, `heroProducts`, and their imports in `LabsPage.tsx`. These are no longer used: `usePointerTilt`
  (if unused), `advance/beginPass/finalStages/interact/stageDelay`, `useHeroInView` (the scene uses it now).
- `src/lib/labs-stages.ts`, plus the three `labs stages:` tests and the `stages` import in
  `tests/hero-live.test.mjs`. Nothing else uses them.
- CSS for `.nx-lab-rig`, `.nx-lab-device`, `.nx-lab-bar`, `.nx-lab-shot`, `.nx-lab-live-chip`, `.nx-lab-pick`,
  `.nx-lab-line`, `.nx-lab-open`, `.nx-lab-rail*`, `.nx-lab-cap*`, `.nx-lab-rig-label`, and the
  `max-width: 560px` pick override. Also remove `.nx-lab-rig` from the `nx-hero-rise` selector list.
  `.nx-labs-stages` (with an s) belongs to the section below. Keep it.
- `COPY.labs.heroProducts`: delete it if nothing else uses it (grep first).

## CSS hygiene

- Put all new Labs hero CSS in **one** delimited block in `shared.css`, placed where the old Labs hero
  visual rules were: `/* ═══ Labs hero stage ═══ */ … /* ═══ end Labs hero stage ═══ */`.
- Do not append overrides at the end of the file.
- Edit with exact, unique find-and-replace. Verify each replacement happened; chained Python
  `.replace()` silently no-ops.

## Done means

- `npx tsc --noEmit` is clean, and `npm test` passes (the count drops by 3 labs-stages tests).
- `/neo/labs` and `/trust/labs` render the stage at 1280×800, at the pane's own width (~445px), and at 375×812:
  - no horizontal overflow;
  - CTAs above the fold;
  - the front screen is visibly the largest thing on the page;
  - nothing repeats a heading below.
- The `/neo/labs` products section further down still renders its screenshots correctly.
  It also uses `imgSize()`, which changed.
- Reduced motion shows the static composition.
- No console errors.
