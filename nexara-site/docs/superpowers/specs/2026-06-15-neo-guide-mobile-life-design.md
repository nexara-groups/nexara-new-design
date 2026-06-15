# Neo Guide — Mobile Liveliness

**Date:** 2026-06-15
**File touched:** `src/neo.jsx` (component `NeoGuide`, the `useEffect` at ~line 505)
**Scope:** Neo theme only. Trust has no guide (`neo.jsx:2233` gates `NeoGuide` behind `isNeo`).

## Problem

The Neo guide ("he") is lively on desktop but **static on mobile** — he slides
into position per section and then freezes. No blink, no breathing, no idle
quips, no reaction to content.

Root cause: the personality engine ("the brain") is defined entirely **inside**
`if (isDesktopFollower)` (`neo.jsx:530–1143`), gated on
`(pointer: fine) and (min-width: 761px)`. The mobile/touch branch (the `else`,
~1145–1330) only does position docking + a canned section announcement. It
cannot see any of the brain's closures, so the face never animates.

The desktop interaction model is 100% cursor-driven (`mousemove` →
`elementFromPoint` → classify → react). Touch has no cursor, so a port is wrong —
mobile needs **different triggers** feeding the **same brain**.

## Primary Success Criteria (the bar — failing this = rework)

He must read as **alive** on mobile, never a frozen sprite. Concretely:

1. **Never a dead frame.** With zero user action he still blinks and breathes on
   a timer, and drops a rotating idle quip after a few seconds of stillness.
2. **Reacts to scroll.** Scrolling into a section changes his line AND his
   expression to match that section's content (real text read from the section,
   not a canned string).
3. **Reacts to taps.** Tapping a nearby CTA/card/element makes him classify it
   and fire the matching contextual quip + a wink/expression, within ~150ms.
4. **Tap him → he talks.** Tapping the guide himself (face/body) makes him cycle
   a fresh self-aware quip + a wink/expression — a deliberate, rewarding gesture
   distinct from tapping page elements.
5. **Variety.** Lines rotate (no immediate repeat); expressions vary by content
   mood. He does not say the same thing twice in a row.
6. **It feels intentional, not restless or broken.** Calm when idle, responsive
   when touched.

If he merely moves position but the face is frozen, this is **not done**.

## Approach: lift the brain, two thin drivers (Approach A)

### 1. Refactor — hoist the brain to shared effect scope (verifiable no-op for desktop)

Move these closures from inside the desktop `if` up to the shared effect body so
both desktop and mobile branches can call them:

- Text utils: `clean`, `shorten`, `pick`, `textFrom`, `rotateLine`, `keyOf`
- Reader: `GENERIC_SEL`, `genericRead`, `classifyTarget`
- Dialogue: `setInfo` + state (`lineCounts`, `lastKey`, `activeInfo`)
- FX: `boomAt`, `ledFlash`
- Face engine: face refs, `MOUTH`, `setMouth`, `look`, `blink`, `brows`,
  `eyeRoll`, `moodFor`, `express`, `scheduleBlink`
- Idle: `idleChatter`, `scheduleIdleSass`

**Constraint:** this is a pure move. Desktop behavior must be byte-for-byte
identical afterward. Ship/verify this step on its own before adding mobile
drivers, so any desktop regression is caught in isolation.

### 2. Desktop driver (unchanged behavior)

Same `mousemove → elementFromPoint → classifyTarget → express + setInfo`,
click-wink, `mouseleave`. Now calls the hoisted helpers. `look` (eye-tracking)
stays desktop-only — it needs a cursor.

### 3. Mobile drivers (new) — three inputs into the shared brain

- **Idle life (always-on):** start `scheduleBlink()` + `scheduleIdleSass()` in
  the mobile branch. Satisfies criterion 1.
- **Scroll-reactive (docked model):** in the existing `dock(sec)`, replace the
  canned announcement with `classifyTarget` run on that section's hero/visible
  element → `setInfo` + `express(moodFor(...))`. Satisfies criterion 2. Reuses
  the dock `ScrollTrigger`s that already exist — near-zero added cost.
- **Tap-nearby:** one passive `pointerdown` listener →
  `classifyTarget(e.target)` → `express` + `setInfo` + `boomAt(x, y)` + wink.
  Throttled. Passive, never `preventDefault` — real taps/navigation untouched.
  Satisfies criterion 3.
- **Tap-him-to-talk:** a `pointerdown`/click handler on the guide's own face/body
  node → cycle a fresh self-aware quip (rotating bucket, no immediate repeat) +
  wink/expression + `ledFlash`. Distinct bucket from contextual lines. The
  face/body node must be `pointer-events: auto` (kept small, not a full-screen
  hitbox) so it receives the tap without blocking page content. Satisfies
  criterion 4.

Mobile stays **docked** at section anchors (calmer, cheaper) — not continuous
follow.

### 4. Guardrails (hard requirements, not optional)

- Keep the existing `prefers-reduced-motion` early-return (`neo.jsx:507`).
- **Battery:** pause the idle loop when the guide is off-screen / tab hidden
  (`visibilitychange` + existing show/hide triggers). Throttle tap-classify.
- His container must be `pointer-events: none` (children opt into `auto` only
  where needed) so he never eats content taps.
- All listeners and GSAP tweens cleaned up in the effect's return (this file had
  a recent idle-timeout leak — cleanup is explicitly in scope).

## Costs (acknowledged)

- **Runtime on device:** small if idle is gated to on-screen and taps are
  throttled. These mitigations are part of the design.
- **Refactor risk:** moving ~600 lines could change desktop behavior — mitigated
  by shipping the lift as a verified no-op first.

## Out of scope

- Continuous scroll-follow on mobile (docked only).
- Any Trust-theme guide.
- New dialogue content / new element classifiers (reuse existing).

## Verification

- Desktop: after the lift, behavior unchanged (manual + visual).
- Mobile (real device / emulation at ~390×844): walk every primary-criterion
  item 1–6 above. Confirm blink/breathe with no input; confirm line+expression
  change on scroll into each section; confirm tap-nearby react < ~150ms; confirm
  tapping him directly cycles a fresh quip + wink; confirm line variety; confirm
  no jank and battery guardrails active.
