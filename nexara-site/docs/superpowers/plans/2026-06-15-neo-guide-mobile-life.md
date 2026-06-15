# Neo Guide Mobile Liveliness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Neo guide feel alive on mobile — idle blink/breathe/sass, scroll-reactive lines, tap-nearby quips, and tap-him-to-talk — by sharing the desktop personality engine instead of duplicating it.

**Architecture:** Lift the "brain" (text reader, classifier, dialogue, face engine, idle loops) out of the desktop-only `if (isDesktopFollower)` block in `NeoGuide` so both the desktop cursor driver and new mobile touch/scroll drivers call the same code. Mobile stays docked at section anchors.

**Tech Stack:** React + GSAP (ScrollTrigger) in `src/neo.jsx`; guide CSS in `src/legacy/neo.css`. No test runner — verification is `npm run build` + dev server (5173) + mobile-emulation visual check.

**Spec:** `docs/superpowers/specs/2026-06-15-neo-guide-mobile-life-design.md`

---

## File Structure

- Modify: `src/neo.jsx` — `NeoGuide` component, the `useEffect` starting ~line 505.
- Modify (if needed): `src/legacy/neo.css` — `.neo-guide-overlay` / `.neo-guide-char-wrap` pointer-events.

No new files; this is a contained refactor + additive drivers in one component.

---

## Task 1: Hoist the brain to shared scope (verifiable desktop no-op)

**Files:** Modify `src/neo.jsx` (`NeoGuide` effect, ~505–1143).

- [ ] **Step 1: Lift shared mutable vars above the `if (isDesktopFollower)`**

Immediately after `guide.classList.toggle("is-scroll-guide", !isDesktopFollower);` and the initial `gsap.set` calls (~528), and BEFORE `if (isDesktopFollower) {`, declare the vars the idle loops and dialogue need at effect scope:

```js
let blinkT, idleT;
let guideLive = false;        // replaces desktop-only `followerLive`
let lastKey = "";
let activeInfo = null;
const lineCounts = {};
```

- [ ] **Step 2: Move the brain declarations out of the desktop block**

Cut the declaration region inside the desktop block — from `const clean = (text) =>` down through the `scheduleIdleSass` definition (everything that is a `const`/function declaration: `clean, shorten, pick, textFrom, rotateLine, keyOf, GENERIC_SEL, genericRead, classifyTarget, setInfo, boomAt`, the face refs + `hasFace`, `MOUTH, setMouth, look, blink, brows, ledFlash, eyeRoll, moodFor, express, scheduleBlink, idleChatter, idleIdx, scheduleIdleSass`) — and paste it above `if (isDesktopFollower) {`, after the vars from Step 1. Remove the now-duplicate `let lastKey/activeInfo/lineCounts` declarations that were inside the block (they're hoisted now).

Leave inside the desktop block ONLY the imperative/driver code: the `if (hasFace) { scheduleBlink(); scheduleIdleSass(); setMouth(...) }` call, `onMove/onLeave/onClick`, `showFollower/hideFollower`, the homeHero follower ScrollTrigger, the `window.addEventListener` calls, and the desktop `return () => {...}` cleanup.

- [ ] **Step 3: Replace `followerLive` with `guideLive` everywhere**

In `scheduleBlink`, `scheduleIdleSass`, `showFollower`, `hideFollower`, `onMove`, `onClick` — change every `followerLive` reference to `guideLive`. (showFollower sets `guideLive = true`, hideFollower sets `false`.)

- [ ] **Step 4: Build to verify the hoist didn't break scope**

Run: `npm run build`
Expected: build succeeds, no "X is not defined" / "Cannot access before initialization" errors.

- [ ] **Step 5: Verify desktop behavior unchanged**

Run dev server (`npm run dev`), open `http://localhost:5173/#/neo` on a desktop-width window. Confirm: guide follows cursor, classifies hovered elements with quips, blinks, idle-sasses, click-winks — identical to before.

- [ ] **Step 6: Commit**

```bash
git add src/neo.jsx
git commit -m "refactor(neo-guide): hoist personality brain to shared scope (desktop no-op)"
```

---

## Task 2: Mobile idle life — make the face breathe

**Files:** Modify `src/neo.jsx` (the `else`/scroll-guide branch, ~1145+, and show/hide/dock helpers).

- [ ] **Step 1: Set `guideLive` true/false in the mobile show/hide + dock**

In `showScrollGuide` add `guideLive = true;`. In `hideScrollGuide` add `guideLive = false;`. In `dock(sec)` ensure `guideLive = true;` (he's on-screen and parked). This is required or the hoisted idle loops (guarded on `guideLive`) never tick.

- [ ] **Step 2: Start the idle loops in the mobile branch**

Near the top of the scroll-guide branch (after `showScrollGuide`/triggers are wired, before the final `return`), add:

```js
// Mobile: always-on micro-life (idle blink + breathing sass)
if (hasFace) { scheduleBlink(); scheduleIdleSass(); setMouth(MOUTH.smirk, 0); }
else { scheduleIdleSass(); }
```

- [ ] **Step 3: Extend the mobile cleanup to clear the timers**

Change the mobile branch's final `return () => { undock(); triggers.forEach(t => t.kill()); };` to:

```js
return () => {
  undock();
  triggers.forEach(t => t.kill());
  clearTimeout(blinkT);
  clearTimeout(idleT);
  gsap.killTweensOf([charWrap, bubble, tag, spotlight, burst]);
};
```

- [ ] **Step 4: Build + mobile check**

Run: `npm run build` (expect success). Then dev server, open `http://localhost:5173/#/neo` in a mobile-emulated viewport (~390×844). Scroll past the hero so the guide shows. Confirm he blinks and drops an idle quip with no further input (criterion 1).

- [ ] **Step 5: Commit**

```bash
git add src/neo.jsx
git commit -m "feat(neo-guide): always-on idle life on mobile"
```

---

## Task 3: Scroll-reactive — he comments on the section you're parked in

**Files:** Modify `src/neo.jsx` (`dock(sec)` in the mobile branch).

- [ ] **Step 1: In `dock(sec)`, classify the section element instead of canned text**

Inside `dock(sec)`, after `guideLive = true;`, replace the canned announcement `setInfo(...)` with a real read of the docked section:

```js
const secEl = document.querySelector(sec.sel);
const info = classifyTarget(secEl?.querySelector("h1,h2,h3,.eyebrow,a,button") || secEl);
if (info && info.key !== lastKey) {
  lastKey = info.key;
  activeInfo = info;
  setInfo(info);
  try { express(moodFor(info.key)); } catch (_) {}
}
```

(Keep the existing dock motion/arm animation. Only the dialogue source changes.)

- [ ] **Step 2: Build + mobile check**

`npm run build` (expect success). Dev server, mobile viewport, slowly scroll through Academy/Labs/Marketing sections. Confirm his line AND expression change per section (criterion 2).

- [ ] **Step 3: Commit**

```bash
git add src/neo.jsx
git commit -m "feat(neo-guide): scroll-reactive section commentary on mobile"
```

---

## Task 4: Tap-nearby — react to tapped page elements

**Files:** Modify `src/neo.jsx` (mobile branch, add listener + cleanup).

- [ ] **Step 1: Add a throttled, passive `pointerdown` classifier**

In the mobile branch (before the final `return`), add:

```js
// Mobile: tap a page element → classify + react (touch analog of hover)
let lastTapT = 0;
const onTapClassify = (e) => {
  if (guide.contains(e.target)) return;        // tapping HIM handled separately
  const now = performance.now();
  if (now - lastTapT < 250) return;            // throttle
  lastTapT = now;
  const info = classifyTarget(e.target);
  if (info && info.key !== lastKey) {
    lastKey = info.key; activeInfo = info; setInfo(info);
  }
  try { express(moodFor(info.key)); } catch (_) {}
  boomAt(e.clientX || 0, e.clientY || 0);
  if (hasFace) { blink("r"); ledFlash(); }
  gsap.fromTo([bubble, tag], { autoAlpha: 0.55, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.18, overwrite: "auto" });
};
window.addEventListener("pointerdown", onTapClassify, { passive: true });
```

- [ ] **Step 2: Remove the listener in cleanup**

Add `window.removeEventListener("pointerdown", onTapClassify);` to the mobile cleanup return.

- [ ] **Step 3: Build + mobile check**

`npm run build` (expect success). Mobile viewport: tap CTAs/cards. Confirm he reacts with a matching line + wink ~immediately, and that taps still navigate/work normally (passive, criterion 3).

- [ ] **Step 4: Commit**

```bash
git add src/neo.jsx
git commit -m "feat(neo-guide): tap-nearby element reactions on mobile"
```

---

## Task 5: Tap-him-to-talk — direct gesture

**Files:** Modify `src/neo.jsx` (mobile branch + cleanup); `src/legacy/neo.css` (pointer-events).

- [ ] **Step 1: Ensure he can receive taps without blocking content**

In `src/legacy/neo.css`, confirm `.neo-guide-overlay` is `pointer-events: none;` and set `.neo-guide-char-wrap { pointer-events: auto; }` (keep it sized to the avatar, not full-screen). Add the rule if missing.

- [ ] **Step 2: Add the self-quip handler**

In the mobile branch, add a self-aware line bucket + handler on `charWrap`:

```js
// Mobile: tap HIM → self-aware quip
const selfLines = [
  "ayo you tapped me. bold. iconic.",
  "yes hi it's me. your guide. obsessed already?",
  "careful, tap me again and i'll get ideas.",
  "main character energy. i respect it.",
  "stop poking, start scrolling bestie.",
  "you rang? scroll down, i'll keep up.",
];
let selfIdx = 0;
const onTapSelf = (e) => {
  e.stopPropagation();
  selfIdx++;
  setInfo({ label: "neo", line: selfLines[selfIdx % selfLines.length] });
  if (hasFace) {
    blink("r"); ledFlash(); setMouth(MOUTH.grin); express("hype");
    gsap.delayedCall(0.5, () => setMouth(MOUTH.smirk));
  }
  gsap.fromTo([bubble, tag], { autoAlpha: 0.5, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.2, overwrite: "auto" });
};
charWrap.addEventListener("pointerdown", onTapSelf);
```

- [ ] **Step 3: Remove the handler in cleanup**

Add `charWrap.removeEventListener("pointerdown", onTapSelf);` to the mobile cleanup return.

- [ ] **Step 4: Build + mobile check**

`npm run build` (expect success). Mobile viewport: tap the guide himself. Confirm a fresh self-line each tap (no immediate repeat) + grin/wink (criterion 4), and that `stopPropagation` keeps the tap-nearby handler from also firing.

- [ ] **Step 5: Commit**

```bash
git add src/neo.jsx src/legacy/neo.css
git commit -m "feat(neo-guide): tap-him-to-talk on mobile"
```

---

## Task 6: Battery guardrail — pause idle when off-screen/hidden

**Files:** Modify `src/neo.jsx` (mobile branch).

- [ ] **Step 1: Stop the idle timers when the tab is hidden, resume when visible**

In the mobile branch add:

```js
const onVisibility = () => {
  if (document.hidden) { clearTimeout(blinkT); clearTimeout(idleT); }
  else if (guideLive && hasFace) { scheduleBlink(); scheduleIdleSass(); }
};
document.addEventListener("visibilitychange", onVisibility);
```

And in cleanup: `document.removeEventListener("visibilitychange", onVisibility);`

(`guideLive` already gates the loops when he's scrolled off-screen, so this only adds tab-hidden pausing.)

- [ ] **Step 2: Build + commit**

`npm run build` (expect success).

```bash
git add src/neo.jsx
git commit -m "perf(neo-guide): pause mobile idle loops when tab hidden"
```

---

## Task 7: Final acceptance pass (the bar)

- [ ] **Step 1: Walk all 6 success criteria on mobile emulation (~390×844) at `#/neo`:**
  1. No input → he blinks/breathes + idle quip. ✅/❌
  2. Scroll into each section → line + expression change. ✅/❌
  3. Tap a CTA/card → matching quip + wink < ~150ms, tap still works. ✅/❌
  4. Tap him → fresh self-line + grin, no immediate repeat. ✅/❌
  5. Lines rotate, never same twice in a row; expressions vary. ✅/❌
  6. Calm when idle, responsive when touched; no jank. ✅/❌

- [ ] **Step 2: Desktop regression check** — cursor-follow guide still identical.

- [ ] **Step 3:** If any criterion fails, it's not done — fix before declaring complete.

---

## Self-Review notes

- Spec coverage: criteria 1–6 → Tasks 2,3,4,5 + guardrails Task 6; "alive bar" → Task 7. ✅
- Reconciliations called out: `followerLive`→`guideLive` (Task 1.3), shared `blinkT/idleT/lastKey/activeInfo/lineCounts` (Task 1.1). ✅
- Mood keys used (`hype`, `smirk`, `bored`, `money`) match `express`/`moodFor`. ✅
- Passive `pointerdown` + `stopPropagation` on self → no double-fire, no nav blocking. ✅
