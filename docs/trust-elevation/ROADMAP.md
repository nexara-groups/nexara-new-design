# Trust Elevation — Execution Roadmap
_Branch `neo-visual-refresh`. Trust theme only. Source specs: medhavi (message arch) + designer (design/motion), 2026-06-13._

## Locked decisions
1. **Positioning: "Three forces, one standard."** Academy · Digital · Labs = elite specialists under ONE governance bar (named owner + written scope + reporting cadence + evidence/data-boundary discipline).
2. **Keep showpiece modules**, each re-cast as a story scene.
3. **Type:** Geist (display) + Inter (body) + Geist Mono (data/eyebrows/indices).
4. **Motion:** bold cinematic but production-polished. Lenses: Jakub primary, Jhey secondary, Emil for nav/forms only. `prefers-reduced-motion` + GPU (transform/opacity) mandatory.

## Six-beat arc (every page): Problem → Premise → Three forces → Mechanism/Proof → Outcome → Invitation
Per-page beats + primary CTA (one scoped CTA per page; never "learn more"):
- **Home** — disconnected/ungoverned efforts → one model holds all 3 w/o flattening depth → 3 forces equal weight → shared scoping/reporting/controls + combined plays → governed capability → *Enter the firm*.
- **Academy** — certificates ≠ proof → talent is built cohort by cohort → talent front door (Digital makes visible, Labs adds placement systems) → Map→Cohort→Proof→Place, weekly reviews/scoring → hiring-ready + reportable → *Plan an Academy programme*.
- **Digital** — strong offers stay invisible → attention earned in 10s → Digital engine (Academy staffs, Labs automates) → Position→Build→Launch→Optimize, documented → measured acquisition → *Map a marketing system*.
- **Labs** — pilots collapse under real traffic → AI earns its place, scope-first → systems layer (Digital surfaces use cases, Academy supplies operators) → Find→Design→Build/test→Deploy/observe + RBAC/audit/human-review/evals → governed AI in prod → *Scope a Labs build*.
- **Customers** — buyers distrust claims w/o evidence → proof = operating system made visible → one proof per line → real customer trust entries → confidence any division ships to same standard → *Start an enquiry*.
- **Company** — "capability firm" is empty w/o discipline → incorporated firm, 3 lines/one standard → distinct section ownership → 4 standards + 5 principles, India-first → equal weight, no theater → *Start a structured engagement*.
- **Contact** — vague intros waste time → structured engagement starts w/ one conversation → route by line/combined → 6-item intake checklist = scoped-delivery standard → mapped next step → *Scope your project*.

## Voice (myauthor): lead with mechanism not adjectives; tie every claim to scoped artifact/metric; governance as a feature; each line written with specialist depth; confident declarative enterprise tone. NO startup slang (that's Neo), NO empty corporate abstraction, NO unverifiable numbers/guarantees.

## Design system essentials
- **Type scale** (keep existing clamps, family swapped): hero `.tsx-hero-title` 700; H1 `.tsx-h1` 600; section H2 `.tsx-section-heading` 600; card H3 500; eyebrow/index/counter/ledger-header/runlog = **Geist Mono** + tabular-nums; body = Inter.
- **`.serif` emphasis** = Geist 600 + `--accent` color, NORMAL style (not italic). Faux-italic on a grotesk = bug.
- **Easings:** `--ease` (expo-out, default reveal), `--ease-scrub` (pinned), `--ease-emil` (controls), `--ease-snap` (≤1/scene).
- **Durations:** micro 120–200ms (controls); reveal 600ms (house default); scene 700–1000ms; cinematic = scrubbed (hero 440vh + rail 320vh ONLY).
- **Scroll-reveal floor** `.tsx-fade` translateY16+opacity 600ms stagger d1–d4. Each showpiece adds ONE signature verb on top (hero=words assemble; rail=lateral track; unbox=spine draws then faces drop; signal=waveform self-draw; runlog=typewriter; countup=ramp ease-out; manifesto=word color reveal).
- **Swiss plate:** radius 2px, white bg, 1px `--line` border, **2px `--accent` top-rule**, no shadow, no hover-lift (hover=`--accent-fg` bg). Grid bands fuse w/ gap:1px on `--line`.
- **Accent discipline:** `#1A6DFF` = entire highlight budget (top-rule, mono eyebrows/indices, icon chips, primary CTA, active nav, hero tick, 1 emphasis word). Forbidden in body / >1 filled blue per card. On slate covers brighten to `#5B9DFF`.
- **Cover rhythm:** slate (`#0B1F33→#081726`+glow) = hero + final-CTA bookends ONLY; light spine between. No mid-page slate bands.

## Execution checklist
- [x] **Token reconcile (BLOCKER)** — all 3 `.trust.tsx-site` token layers (line1, ~1490, ~2178) + line-902 mini-layer now steel. Was rendering warm-paper.
- [x] **Geist loaded** (index.html) + 68 display rules routed to `var(--font-display)`; body stays Inter.
- [x] **Mono routing** — appended block: eyebrows/indices/counters/ledger-headers/runlog/dimline/stat-num → `var(--font-mono)` + tabular-nums.
- [x] **Hero canvas palette** — `TrustParticleCanvas` BG `#081726`, lines/dots `rgba(91,157,255)`.
- [x] **Trio colors purged** — unbox teal/violet/amber → blue ramp; all `#2F4A6B` literals → `var(--accent)`; `#8b5cf6` → accent. 0 trio/warm hexes left.
- [x] **Architect** — module-as-scene staging done in trust.jsx: Home reordered (manifesto up = premise, stats down = outcome, UnboxAssembly CUT as count-diluting), section pages now CLOSE on intake CTA (was buried mid-overview).
- [x] **myauthor** — all data.js trust copy rewritten to governance voice ("three forces, one standard"); honest (no guarantees).
- [x] **Hero scrim fix** — `.tsx-hero-chapter::before` was light `--paper-0` (washed light text on dark hero) → now dark `#081726`. Headlines pop.
- [x] **Visual QA** — home/academy/contact: 0 console errors, steel+Geist+mono+slate heroes confirmed, arcs flow, no invisible text. (Note: browse caches CSS — `cdp Network.setCacheDisabled true` before re-shooting after edits.)
- [ ] **Optional polish (last 5%):** final-CTA → slate bookend (designer cover-rhythm); 1 mid-page dark package card on Academy; reduced-motion collapse of 440vh runway + 320vh rail (a11y); strip persistent `will-change` (perf); delete dead warm-hero CSS + now-unused `TrustUnboxAssembly`; count-up ease-out.
- [ ] **Commit** the elevation batch.
