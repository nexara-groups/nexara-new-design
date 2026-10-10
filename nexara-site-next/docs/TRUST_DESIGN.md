# Trust design handbook

The single source of truth for how Trust looks, moves and reads, and how to convert a Trust page to it.
Written so an agent who has never seen this repo can convert a page using only this file.

The reference implementation is the marketing page: `/trust/marketing` (and its Neo twin `/neo/marketing`),
rendered by `src/components/shared/MarketingPage.tsx` and styled by the `Marketing page` section of
`src/styles/shared.css`. When this document and the code disagree, the code wins: fix this document.

## Contents

1. [Purpose, scope and non-negotiables](#1-purpose-scope-and-non-negotiables)
2. [Design sheet (tokens)](#2-design-sheet-tokens)
3. [Component recipes](#3-component-recipes)
4. [Motion system](#4-motion-system)
5. [How the marketing page was built (the thought process)](#5-how-the-marketing-page-was-built-the-thought-process)
6. [Converting a page: method, checklist, definition of done](#6-converting-a-page-method-checklist-definition-of-done)
7. [File map, adding things the shared way, tests, pitfalls](#7-file-map-adding-things-the-shared-way-tests-pitfalls)
8. [Page conversion queue](#8-page-conversion-queue)

---

## 1. Purpose, scope and non-negotiables

**Purpose.** Trust is the corporate presentation of Nexara (Neo is the Gen Z one). Both are the *same site*:
same pages, same sections, same facts. Only the **voice** (copy) and the **skin** (tokens) differ.
This handbook defines the Trust skin (the "Field" palette and the marketing-page design language) and the
method for bringing every remaining Trust page up to it.

**Scope.** Everything under `/trust/*`, `/trust/blog/*`, the shared chrome (nav, footer, cookie banner,
"Talk to us" pill) and any shared component rendered inside `.trust`. Neo must keep working: every change
goes through tokens, so Neo keeps its own values.

### Non-negotiables

| # | Rule | How to check |
|---|------|--------------|
| 1 | **Light / white dominant.** Content bands are `--tr-white`, `--tr-paper` or a track wash. Dark grounds are allowed only for an existing hero or one deliberate band per page, never as the page default. | Scroll the page: most of it should read white/paper. |
| 2 | **No blue. Anywhere in Trust** (Field pages). No navy, steel, sky, cyan, teal-blue, blue links, blue focus rings, blue gradients or blue-cast greys (roughly hue 185-265 in HSL). **Exceptions:** Academy (`.nx-ac`) and Home (`.trust-home` on the site root, `/trust`) use the logo brand kit blues/navy by design; see §8. Home re-points the `--tr-green-*` tokens to action `#215F94` / deep `#184A75` / wash `#EDF3F9` / light `#9FC4E6` and cools the neutrals (block at the end of `trust.css`); the hero canvas in `trust/Hero.tsx` uses the same blues. Labs (`.trust-labs` on the site root, `/trust/labs/*`) re-points the same `--tr-green-*` tokens to the Product Studio amber ramp (`#8A4B12` / deep `#6E3B0D` / wash `#FBF5EE` / light `#F0B47A`), so no green shows on Labs; the one blue there is the Academy segment of the footer stripe. | `python3` grep in §6.4; browser audit in §6.4; ignore `.nx-ac`, `.trust-home` and `trust/Hero.tsx` brand-kit colours. |
| 3 | **Shared structure.** Never add a page, block or section to one theme only. Structure lives in `src/lib/site.ts` flows; both themes render the same blocks through one shared component. | `npm test` (site.test.mjs). |
| 4 | **Tokens, not theme checks.** A component never asks `theme === 'trust'` to change looks. Skin differences go through `--nx-*` / `--tr-*` tokens set on `.trust` / `.neo`. | `grep -n "theme === '" src/components/shared/` should only show wording selection via `voiced()`. |
| 5 | **Copy is voiced.** Every visible string is a `{ neo, trust }` pair (`Voiced`) in `src/lib/copy.ts` (chrome) or `src/lib/data.ts` (content). Facts identical in both voices. | Tests walk the pairs. |
| 6 | **Trust voice.** Corporate: formal, precise, no slang. **British spelling** (optimise, behaviour, programme, enquiry). | Read it aloud. |
| 7 | **Humanize-writing rules, both voices.** Plain "is/has"; no stock AI vocabulary (leverage, seamless, robust, unlock, elevate, empower, delve, journey, landscape, game-changer, cutting-edge, tapestry); **no em dashes** (the `—` character) in copy; no invented specifics (numbers, clients, results, timelines that are not in `DATA`). | `npm test` fails on em dashes in voiced copy. |
| 8 | **No guarantees about AI products.** Any mention of ChatGPT / Gemini / AI answers must carry the "cannot be guaranteed" meaning. Paid placement inside AI products is "a separate service". | site.test.mjs checks the marketing copy. |
| 9 | **Accessibility floor.** WCAG AA contrast (4.5:1 text, 3:1 large text and UI), 44px tap targets, visible `:focus-visible`, `prefers-reduced-motion` honoured, no horizontal scroll at 375px. | §6.4 checks. |
| 10 | **No `!important` in new CSS.** Win on specificity (`main.nx-xx .nx-xx-thing`) instead. trust.css has legacy `!important` rules; do not add more. | Review your diff. |

---

## 2. Design sheet (tokens)

All tokens are CSS custom properties set on `.trust` (and `.neo`) in `src/styles/shared.css`.
`src/styles/trust.css` still has four legacy token layers (`--ink`, `--paper-*`, `--accent`, `--tsx-*`);
their colour values now point at the `--tr-*` palette, so legacy Trust components follow it automatically.

### 2.1 Colour: the Field palette (`--tr-*`)

Defined once in the `.trust { … }` block at the top of `src/styles/shared.css`.

| Token | Hex | Role / usage |
|-------|-----|--------------|
| `--tr-white` | `#ffffff` | Default page surface, cards, record, rows. |
| `--tr-paper` | `#f7f6f2` | Alternate band (story band, footer), warm off-white. |
| `--tr-mist` | `#f3f1ec` | Soft band / legacy `--paper-0`, `--soft`. |
| `--tr-line` | `#e3e0d8` | Hairlines, card borders, dividers, outline buttons. |
| `--tr-line-2` | `#eeece6` | Quieter internal rules (inside cards, progress tracks). |
| `--tr-ink` | `#15201a` | Headings, primary text, dark grounds (hero, strip). |
| `--tr-ink-2` | `#3a4038` | Body copy, lead paragraphs. |
| `--tr-muted` | `#5f6359` | Secondary text, captions, inactive tabs. |
| `--tr-faint` | `#6a6e64` | Decorative counters/indices that must still pass AA. Never lighter. |
| `--tr-green` | `#1e7a4d` | **Primary.** CTAs, active pill, focus ring, presence track, links on hover. |
| `--tr-green-deep` | `#155c39` | CTA hover, link text, footer labels, text on green wash. |
| `--tr-green-wash` | `#eef6f0` | Green tint surfaces: hover rows, ask card, nav hot state, badges. |
| `--tr-green-light` | `#8fd0aa` | Green accent **on dark grounds only** (hero, dark bands). |
| `--tr-amber` | `#8a4b12` | **Secondary.** Performance track. |
| `--tr-amber-wash` | `#fbf5ee` | Performance band ground. |
| `--tr-plum` | `#7d3a6b` | **Third track: Visibility.** Chosen over terracotta (too close to `--tr-lost`) and olive (too close to green). |
| `--tr-plum-wash` | `#f8f0f5` | Visibility band ground. |
| `--tr-lost` | `#b0362c` | The "problem" colour: "Not there" states, the hero's leave line. Never used for anything positive. |
| `--tr-lost-wash` | `#fbeceb` | Background of the "Not there" chip. |
| `--tr-shadow-rgb` | `21, 32, 26` | Shadow colour (use as `rgba(var(--tr-shadow-rgb), .3)`). |

**Contrast pairs (measured, WCAG 2.x):**

| Foreground on background | Ratio | Use |
|---|---|---|
| `--tr-ink` on `--tr-white` | 16.75 | Headings, body. |
| `--tr-ink-2` on `--tr-white` | 10.66 | Body copy. |
| `--tr-muted` on `--tr-white` / `--tr-paper` / `--tr-mist` | 6.15 / 5.69 / 5.35 | Secondary text. |
| `--tr-faint` on `--tr-white` / `--tr-paper` / `--tr-mist` | 5.21 / 4.82 / 4.62 | Counters only. |
| `--tr-green` on `--tr-white` / `--tr-paper` | 5.32 / 4.92 | Green text, kicker. |
| white on `--tr-green` | 5.32 | Primary button text. |
| `--tr-green-deep` on `--tr-green-wash` | 7.28 | Text on wash. |
| `--tr-amber` on white / on `--tr-amber-wash` | 6.78 / 6.27 | Performance text. |
| `--tr-plum` on white / on `--tr-plum-wash` | 7.81 / 6.98 | Visibility text. |
| white on `--tr-plum` / `--tr-amber` | 7.81 / 6.78 | Active pill text. |
| `--tr-lost` on `--tr-lost-wash` / on white | 5.37 / 6.16 | "Not there". |
| `#f6f8f4` on `--tr-ink` | 15.68 | Text on dark grounds. |
| `--tr-green-light` on `--tr-ink` | 9.39 | Accent on dark grounds. |

**Never:** `--tr-green` as text on `--tr-ink` (2.8:1, fails); use `--tr-green-light` there.

### 2.2 Colour: semantic roles (`--nx-*`, shared by both themes)

Shared components only reference these roles. Trust values (from the `.trust` block):

| Role token | Trust value | Neo value | Used by |
|---|---|---|---|
| `--nx-ink` | `--tr-ink` | `#fff` | Headings in shared blocks. |
| `--nx-copy` | `--tr-ink-2` | `#cfd6cc` | Body copy in shared blocks. |
| `--nx-link` | `--tr-green-deep` | `var(--accent)` | Links, kickers. |
| `--nx-on-accent` | `#fff` | `#000` | Text on `--accent` fills. |
| `--nx-wash` / `--nx-wash-line` / `--nx-wash-ink` | green wash / `rgba(30,122,77,.3)` / green-deep | lime tints | Badges, chips. |
| `--nx-focus` | `--tr-green` | `--accent` | Focus outline colour in nav/footer. |
| `--nx-nav-bg` | `rgba(255,255,255,.86)` | `rgba(8,9,6,.72)` | SiteNav pill (light glass in Trust). |
| `--nx-nav-ink` / `--nx-nav-muted` / `--nx-nav-line` / `--nx-nav-hot` | ink / muted / line / green-wash | white set | SiteNav. |
| `--nx-nav-active-ink` | `#fff` | `#000` | Text of the active theme-switch chip. |
| `--nx-footer-bg` | `--tr-paper` | `#050505` | SiteFooter ground. |
| `--nx-footer-ink` / `-copy` / `-muted` / `-line` / `-label` | ink / ink-2 / muted / line / green-deep | white set | SiteFooter. |
| `--nx-float-clear` | `84px` | `12px` | Bottom offset for fixed bars so they clear Trust's "Talk to us" pill. |
| `--nx-strip-bg` / `--nx-strip-ink-rgb` | `--tr-ink` / `243, 241, 236` | near-black / `233, 238, 245` | Dark proof/capability strips. |
| `--nx-lab-*` / `--nx-lab-ink-rgb` | dark green set (warm amber `#17130E` / `#F0B47A` / `#F3DCC3` under `.trust-labs`) | dark blue/cyan set | Labs architecture visual. |
| `--accent` (legacy) | `--tr-green` | `#ccff00` | Older components; prefer the roles above. |

Legacy Trust layer (trust.css) maps: `--ink`/`--text`/`--dark` → `--tr-ink`, `--muted`/`--ink-2` → `--tr-muted`,
`--bg`/`--paper-2` → `--tr-paper`, `--soft`/`--paper-0`/`--paper-1` → `--tr-mist`,
`--accent`/`--blueprint`/`--vermilion`/`--tsx-accent` → `--tr-green`, `--accent-fg` → `#E8F3EC` (wash).
Inside dark Trust grounds (`.tsx-hero-stage`, `.tsx-parent-dark-band`) `--sec-accent` switches to `--tr-green-light`.

### 2.3 Colour: track roles (the marketing-page system)

Three tracks carry meaning across a page. A track is applied with `data-track="presence|visibility|performance"`;
CSS maps it to two local vars: `--c` (the colour) and `--wash` (the band ground).

| Track | Meaning | `--c` (Trust) | `--wash` (Trust) | Neo `--c` |
|---|---|---|---|---|
| `presence` | Be findable and contactable (phases 1-2) | `--tr-green` | `--tr-green-wash` | `#ccff00` |
| `visibility` | Be discoverable in search and AI answers (phase 3) | `--tr-plum` | `--tr-plum-wash` | `#00f0ff` |
| `performance` | Paid growth and measurement (phases 4-6) | `--tr-amber` | `--tr-amber-wash` | `#ff9f43` |

On other pages, reuse the three-track idea for any three-part offer (e.g. Academy: learn / build / place;
Labs: data / services / interface). Map each part to one track; never invent a fourth colour.

Marketing tokens (`--nx-mk-*`, Trust block in shared.css) are the page-level aliases:
`--nx-mk-bg` white, `--nx-mk-paper` paper, `--nx-mk-ink`, `--nx-mk-ink-2`, `--nx-mk-muted`, `--nx-mk-line`,
`--nx-mk-line-2`, `--nx-mk-lost`, `--nx-mk-lost-wash`, `--nx-mk-cta` (green), `--nx-mk-cta-deep`, `--nx-mk-on-cta`,
`--nx-mk-on-c` (text on a track fill), `--nx-mk-presence|visibility|performance`, `--nx-mk-wash-*`,
`--nx-mk-ask` (green wash), `--nx-mk-ask-line`, `--nx-mk-glass`, `--nx-mk-shadow`, `--nx-mk-dots`.
A new page should create its own `--nx-<page>-*` aliases **only if** it needs page-specific roles; otherwise use `--tr-*` / `--nx-*` directly.

### 2.4 Typography

| Token | Trust | Neo |
|---|---|---|
| `--font-display` | `"Inter", system-ui, sans-serif` | `"Syne", sans-serif` |
| `--font-body` | `"Inter", system-ui, sans-serif` | `"Space Grotesk", system-ui, sans-serif` |
| `--font-mono` | `"JetBrains Mono"` (avoid in new Trust work; use small caps of Inter instead) | same |

Fonts are self-hosted via `@fontsource` imports in `src/app/layout.tsx` (Inter 400/500/600/700/800). Do not add Google Fonts links. Inter has no 650 file: `650` renders as 600/700; it is used deliberately for "between" weights.

**Type scale (from the marketing page; reuse these exact values):**

| Element | Size | Weight | Line-height | Letter-spacing | Class |
|---|---|---|---|---|---|
| Hero H1 | `min(6.6rem, var(--nx-mk-h1-fit))` ≥801px; `clamp(2.7rem, 12.5vw, 4rem)` ≤800px | 700 (`--nx-mk-display-weight`) | .94 | `-0.045em` (`--nx-mk-h1-track`) | `.nx-mk-h1` |
| Track / section H2 (big) | `clamp(2.3rem, 4.4vw, 3.9rem)` | 700 | 1 | `-0.04em` | `.nx-mk-track-head h2` |
| Block heading | `clamp(2rem, 4vw, 3.2rem)` | 700 | 1 | `-0.04em` | `.nx-mk-sec-h` |
| CTA card H2 | `clamp(2.4rem, 6vw, 5rem)` | 700 | .95 | `-0.05em` | `.nx-mk-ask-card h2` |
| Phase H2 | `clamp(1.8rem, 3vw, 2.55rem)` | 700 | 1.05 | `-0.035em` | `.nx-mk-phase h2` |
| Story statement | `clamp(1.8rem, 3.8vw, 3.2rem)` | 500 | 1.12 | `-0.03em` | `.nx-mk-story p` |
| Row / card H3 | `1.45rem` | 650 | 1.15 | `-0.025em` | `.nx-mk-row h3` |
| Start-row H3 | `clamp(1.9rem, 3.4vw, 2.8rem)` | 700 | 1 | `-0.04em` | `.nx-mk-start h3` |
| Accordion question | `1.35rem` (1.2rem ≤800px) | 600 | 1.2 | `-0.02em` | `.nx-mk-faqs button` |
| Body | `18px` (17px ≤800px) | 400 | 1.55 | 0 | `.nx-mk` |
| Lead | `1.08rem`–`1.12rem` | 400 | 1.55 | 0 | `.nx-mk-lead`, `.nx-mk-callout` |
| Small / meta | `15px` | 400–600 | 1.55 | 0 | `.nx-mk-incl`, tabs, CTA |
| Label caps | `12px` | 700 | — | `.1em`, uppercase | `.nx-footer-label` |

Rules: headings use `text-wrap: balance` or designed lines; never centre body copy; measure 40–60ch for
paragraphs (`max-width: 58ch` / `52ch` / `40ch` as in the recipes); headline line breaks are designed
(one `.nx-mk-ln` per line) and never re-wrap on desktop.

Legacy trust.css has heading rules with high specificity (`.trust.tsx-site h2 { letter-spacing: -0.015em }`
loaded after shared.css). New heading rules must be at least `main.nx-xx .nx-xx-thing` (specificity 0,2,2) to win.

### 2.5 Spacing, layout, breakpoints

| Token / value | Value | Use |
|---|---|---|
| `--space-1..8` | 4, 8, 12, 16, 24, 32, 48, 80px | General spacing in shared blocks. |
| Container | `.nx-mk-wrap`: `width: min(1180px, calc(100% - 64px))`; ≤800px `calc(100% - 32px)` | Every band's inner width. Footer grid also `max-width: 1180px`. |
| Band padding | hero `56px 0 88px`; story `120px 0 112px`; stage `72px 0 96px`; track `112px 0 104px`; block `padding-top: 112px`; ask `136px 0 96px` | ≤800px: 80px / 48px / 80px roughly (see the 800px media block). |
| Column gaps | 64–72px desktop, 40px ≤1000px | `hero-grid`, `stage`, `track-grid`, `faq-grid`. |
| Grid ratios | hero `1.15fr .85fr`; stage `1fr 340px` (290px ≤1000px); track `5fr 6fr`; FAQ `4fr 7fr`; starts row `4fr 6fr 52px` | |

Breakpoints (max-width unless noted): `1100px` (hero to one column, site nav to burger), `1000px` (two-column
grids collapse, sticky headings go static), `800px` (mobile layout: smaller type, record above phases,
mobile dock, stacked rows, search dock goes full width and drops its CTA), `min-width: 801px` (designed hero lines never wrap).

### 2.6 Radii, shadows, borders, rules

| Token | Trust value | Use |
|---|---|---|
| `--radius-sm` | 8px | Small chips. |
| `--radius-md` | 14px | Default card (`--nx-radius`). Goal box uses 14px. |
| `--radius-lg` | 22px | Large card; record uses 22px. |
| Pill | `999px` | Buttons, tabs, kicker chips, nav, search dock. |
| Big card | 18px rows, 20px proof, 24px engine, 32px ask card (24px ≤800px) | |
| `--shadow-1` | `0 1px 2px rgba(var(--tr-shadow-rgb), .06)` | Hairline lift. |
| `--shadow-2` | `0 18px 36px -24px rgba(var(--tr-shadow-rgb), .35)` | Hover lift. |
| `--shadow-3` | `0 30px 60px -36px rgba(var(--tr-shadow-rgb), .3)` | Floating objects (record, engine). |

Shadow discipline: **at most two floating objects per viewport** carry `--shadow-3` (in marketing: the search
"engine" and the sticky record). Everything else is flat with a 1px `--tr-line` border. This is the main
difference from the rejected v4 (identical shadows on every card).

Rules and borders: 1px `--tr-line` between rows (`.nx-mk-starts li`, `.nx-mk-faqs > div`); 1px `--tr-line-2`
inside cards; 2px track-coloured top border for columns (`.nx-mk-who p`); 4px track rule across the top of a
track band (`.nx-mk-track::before`, scaled in by motion); 3px three-track rule on top of the footer.
Dashed 1px for "missing" things only (search results, unfilled record ticks).

### 2.7 Z-index, tap targets, focus

| Layer | z-index |
|---|---|
| Site nav (`.nx-nav`) | 100 |
| "Talk to us" pill (`.tsx-concierge`) | 90 |
| Search dock (`.nx-mk-finder`) | 88 |
| Mobile progress dock (`.nx-mk-dock`) | 85 |
| Cookie banner (`.cc-banner`) | 1800 |

- Tap targets: every link/button `min-height: 44px` (tabs, CTA, footer links, accordion buttons, start rows). Icon circles 44px on mobile (`.nx-mk-go`).
- Focus: `.nx-mk :focus-visible { outline: 2.5px solid var(--nx-mk-cta); outline-offset: 3px; border-radius: 6px; }`; chrome uses `--nx-focus`. Never remove outlines without a replacement.
- Sticky offsets: `--nx-chrome-top` (72px, set on `.site`) is the SiteNav height; nothing else sticks to the top, so `--nx-mk-stick = chrome-top`. Anything sticky inside a page uses `top: calc(var(--nx-mk-stick) + 20px…40px)`, and every `[id]` has `scroll-margin-top: calc(var(--nx-mk-stick) + 8px)`.

---

## 3. Component recipes

Every recipe: markup (class names), tokens, states, and where the reference code is.
`MP` = `src/components/shared/MarketingPage.tsx`, `CSS` = `src/styles/shared.css` (Marketing page section),
`FT` = `src/components/shared/SiteFooter.tsx`, `NAV` = `src/components/shared/SiteNav.tsx`.

### 3.1 Site nav (shared chrome)

Reference: `NAV` + CSS `═══ Nav (SiteNav) ═══`. Do not duplicate it on a page.
- Floating pill: `.nx-nav > .nx-nav-inner` (`background: var(--nx-nav-bg)`, blur 18px, `border: 1px solid var(--nx-nav-line)`, `--radius-pill`).
- Links `.nx-nav-links a` (muted → ink on hover, `--nx-nav-hot` background); active `a.active` has an inset 2px `--accent` underline.
- Primary action `.nx-nav-cta` (`--accent` fill, `--nx-on-accent` text, 44px).
- Theme switch `.nx-switch a.active` (ink fill, `--nx-nav-active-ink` text).
- ≤1100px links collapse into the burger sheet `.nx-nav-sheet`.

### 3.2 In-page section nav

No page puts a second bar under the SiteNav: it covered content. Each page gets a section nav shaped by
its own story, so pages don't look alike.

**Marketing: search dock.** Reference: `MP` (end of the returned JSX) + CSS `/* Search dock */`.
The page's hero is a search box with empty results, so the nav is a search bar floating at the bottom:
the query is the section you're in, the three service lines are results that fill as you read them.

```html
<nav class="nx-mk-finder is-shown" aria-label="Sections" data-track="visibility">   <!-- fixed, bottom-centre -->
  <a class="nx-mk-finder-q" href="#overview">🔍 <strong>Visibility</strong><i class="nx-mk-caret"></i></a>
  <span class="nx-mk-finder-segs">
    <a href="#presence" data-track="presence" class="is-done"><span class="nx-mk-finder-n">01</span><span class="nx-mk-finder-l">Presence</span><i></i></a>
    <a href="#visibility" data-track="visibility" class="is-current" aria-current="location" style="--p: .4">…</a> …
  </span>
  <a class="nx-mk-cta nx-mk-finder-cta" href="#ask">Scope a project</a>
</nav>
```
- Shows once the hero has scrolled away (the hero has its own search box) and hides when the ask card is on screen.
- Query retypes (`clip-path` steps) when the section changes; caret takes the current track colour.
- Segment bar fill = `--p`, the share of that section read; passed sections are full; numbers take the track colour.
- ≤1100px segment labels hide (numbers + bars stay). ≤800px the dock goes full width above the "Talk to us" pill
  (`--nx-float-clear`), drops its CTA, and yields to the phase dock (`.is-yield`) while the phases are on screen.
- Links are real `href="#id"` anchors; JS scrolls with Lenis to just under the SiteNav and updates `history.replaceState`.

**Academy: left rail.** Reference: `AcademyPage.tsx` + CSS `.nx-ac-spine`. Numbered steps with labels in a
168px left lane (content starts after it), vertically centred under the SiteNav; the line fills dot to dot.

- Max 4–5 entries. Entries name *places on the page*, not pages.

### 3.3 Hero ("enact the problem")

Reference: `MP` block `hero` + CSS `/* hero */`.

```html
<section class="nx-mk-hero" id="overview">
  <div class="nx-mk-wrap nx-mk-hero-grid">
    <div>                                         <!-- container-type: inline-size -->
      <h1 class="nx-mk-h1"><span class="nx-mk-ln"><span>A customer searches</span></span>
                           <span class="nx-mk-ln"><span>the business.</span></span></h1>
      <p class="nx-mk-leave">They leave before they ever make contact.</p>
    </div>
    <div class="nx-mk-engine"> … a concrete artefact of the problem … </div>
  </div>
</section>
```
- Left: a two-line statement of the situation (designed lines, one `.nx-mk-ln` per line). Under it, the consequence in `--tr-lost`.
- Right: a *product-like artefact* that shows the problem (here: a search box and four "Not there" results). Other pages use their own artefact (a cohort roster with empty seats, a broken workflow, an enquiry form with no reply).
- Ground: white with a masked dot grid (`.nx-mk-hero::before`, `--nx-mk-dots`).
- Sizing: `min-height: calc(100svh - var(--nx-mk-stick))`; ≥801px the H1 is fitted to its column with `--nx-mk-h1-fit` (Trust `9.4cqi`, Neo `6.4cqi`) and `.nx-mk-ln { white-space: nowrap }`, so lines never re-wrap. ≤1100px the grid is one column.
- No-flash rule: `html:not(.no-js) .nx-mk:not(.is-ready) :is(.nx-mk-ln > span, .nx-mk-leave, .nx-mk-engine) { visibility: hidden }`; the component adds `.is-ready` after GSAP sets start states (or immediately under reduced motion; 2.5s safety timeout).

### 3.4 Story statement

Reference: `MP` block `story`; CSS `/* story */`.
`<section class="nx-mk-story"><div class="nx-mk-wrap"><p><span class="nx-mk-w">We</span> <span class="nx-mk-w">do</span> …</p></div></section>`
- One sentence or two, max `24ch`, on `--nx-mk-paper` between 1px `--nx-mk-line-2` borders.
- Words are split into `.nx-mk-w` spans at render (SSR) so motion can ink them in (§4).
- Purpose: the thesis of the page. If you cannot write it in under 25 words, the page has no concept yet.

### 3.5 Timeline / phases with sticky record

Reference: `MP` block `phases`; CSS `/* phases + record */`.

```html
<div class="nx-mk-wrap nx-mk-stage">            <!-- grid: 1fr 340px -->
  <div class="nx-mk-phases">
    <div class="nx-mk-rail" data-track="…"><i></i></div>   <!-- 2px rail, <i> scales Y with scroll -->
    <article class="nx-mk-phase is-on" data-track="presence">
      <div class="nx-mk-n">1</div>                            <!-- 56px circle, fills with --c when .is-on -->
      <h2>Establish your digital footprint</h2>
      <p class="nx-mk-lead">…</p>
      <p class="nx-mk-incl">…deliverables line…</p>
      <p class="nx-mk-goal">…outcome…</p>                      <!-- tinted box, check icon -->
    </article> …
  </div>
  <div class="nx-mk-record-col">                              <!-- sticky -->
    <aside class="nx-mk-record" aria-label="What a search returns">
      <div class="nx-mk-rec-head"><p>What a search returns</p><span class="nx-mk-count"><b>2</b><small>/6</small></span></div>
      <div class="nx-mk-segs"><i class="is-on" data-track="presence"></i>…</div>
      <ol><li class="is-found" data-track="presence"><span class="nx-mk-tick">✓svg</span>
          <span class="nx-mk-label">Website</span><span class="nx-mk-state">Site, brand, listing, enquiry</span></li>…</ol>
    </aside>
  </div>
</div>
<div class="nx-mk-dock is-shown"> … mobile mirror of the segments + count … </div>
```
- The record is the page's scoreboard: one row per phase, starts in the "problem" state (`miss`, `--tr-lost`, dashed tick) and flips to the "solved" state (`found`, track colour, drawn tick) when the phase is reached. Scrolling back un-fills it.
- State lives in React (`reached` count); CSS animates: `.nx-mk-state` remounts via `key` and plays `nx-mk-swap`; `li.is-found` plays `nx-mk-flash`; the tick path draws via `stroke-dashoffset`.
- ≤800px: the record sits above the phases (`order: -1`, static) and the fixed `.nx-mk-dock` shows progress while phases are on screen (`bottom: var(--nx-float-clear)`).
- Data shape: `DATA.sections.<page>.page.phases[]` `{ track, title, body, includes, goal }` (each Voiced) and `record[]` `{ label, miss, found }`.

### 3.6 Section header with sticky heading + row cards (track band)

Reference: `MP` block `tracks`; CSS `/* service lines */`.

```html
<section class="nx-mk-track" id="presence" data-track="presence" aria-labelledby="nx-mk-presence-h">
  <div class="nx-mk-wrap nx-mk-track-grid">               <!-- 5fr 6fr -->
    <div class="nx-mk-track-head">                        <!-- sticky -->
      <p class="nx-mk-kicker">Presence</p>                <!-- chip with track square -->
      <h2 id="nx-mk-presence-h">The digital identity a customer meets on search.</h2>
      <p class="nx-mk-callout">…scope and pricing basis…</p>
    </div>
    <ul class="nx-mk-rows">
      <li class="nx-mk-row"><h3>Website</h3><p>…</p></li> …   <!-- 4 rows -->
    </ul>
  </div>
</section>
```
- Ground: `--wash` of the track; 4px `--c` rule across the top (`::before`, `transform: scaleX(var(--rule))`).
- Row: white, 18px radius, 1px border tinted 14% of `--c`, 40px icon square (`::before`) with a dot (`::after`).
- Hover: `translate: 6px 0`, border 40%, soft coloured shadow, icon square becomes a filled circle. ≤800px: icon hidden, a 10px dot precedes the H3, no hover translate.
- Use it for any "one offer, four deliverables" block.

### 3.7 "Where you are now" rows (self-selection)

Reference: `MP` block `starts`; CSS `.nx-mk-starts`, `.nx-mk-start`, `.nx-mk-go`.
`<ul class="nx-mk-starts"><li data-track="…"><a class="nx-mk-start" href="#presence"><h3>Presence</h3><p>…symptom + what's included…</p><span class="nx-mk-go">→</span></a></li>…</ul>`
- Full-width rows separated by 1px lines; H3 in the track colour with a small square; a 52px arrow circle.
- Hover/focus: a track-wash panel wipes in from the left (`::before scaleX`), H3 nudges 8px, arrow circle fills and rotates −45°.
- Copy pattern: *symptom first* ("A site exists, and search still misses it."), then the included items.
- Links point at in-page anchors (or at the detail page on other sections).

### 3.8 Columns with track rules ("Who this is for")

`<div class="nx-mk-who"><p data-track="presence">…</p><p data-track="visibility">…</p><p data-track="performance">…</p></div>`
Three columns, 2px `--c` top rule, display font 1.4rem/500. One sentence each, starting with the audience noun.

### 3.9 Staggered proof cards

`<div class="nx-mk-proof"><p><strong>Founder-led service brand.</strong> Website, listing and enquiry flow defined before media was introduced.</p>…</div>`
- Three paper cards (`--nx-mk-paper`, 20px radius, 1px `--nx-mk-line-2`), the 2nd and 3rd offset 28px / 56px down (a staircase that reads as progression). Offsets removed ≤800px.
- Only real, approved proof from `DATA` (`section.proof`). Anonymous descriptors are fine; invented results are not.

### 3.10 Accordion (FAQ)

Reference: `MP` block `faqs`; CSS `.nx-mk-faq-grid`, `.nx-mk-faqs`, `.nx-mk-plus`.
```html
<div class="nx-mk-wrap nx-mk-block nx-mk-faq-grid">     <!-- 4fr 7fr, heading sticky -->
  <h2 class="nx-mk-sec-h">Questions</h2>
  <dl class="nx-mk-faqs"><div>
    <dt><button aria-expanded="true" aria-controls="nx-mk-faq-0">Do you start with ads?<span class="nx-mk-plus"></span></button></dt>
    <dd id="nx-mk-faq-0"><span><span>No. …</span></span></dd>
  </div>…</dl>
</div>
```
- Open/close animates `grid-template-rows: 1fr ↔ 0fr` (0.5s); closed answers get `visibility: hidden` after the transition so screen readers skip them. Without JS (`html.no-js`) everything is open.
- First item open by default. Plus icon rotates 180° and fills green when open.
- The FAQ list must be the *same list* the JSON-LD uses (`src/lib/seo.ts`, `pageFaqs` / `marketingFaqs`).

### 3.11 CTA card ("Scope a …")

`<section class="nx-mk-ask" id="ask"><div class="nx-mk-wrap"><div class="nx-mk-ask-card"><h2>Scope a digital project</h2><p>…what to send, what you get back…</p><a class="nx-mk-cta nx-mk-cta--lg" href="/trust/contact/marketing">Scope a digital project →</a></div></div></section>`
- Green wash card, 32px radius, two decorative rings (`::before` presence, `::after` visibility).
- The CTA always links to the real contact flow: `routePath(theme, 'contact', <section id>)` (`CONTACT_ENTRY` in site.ts). Body copy says what to send and what comes back.

### 3.12 Buttons and links

| Class | Look | States |
|---|---|---|
| `.nx-mk-cta` | green pill, white 15px/600, 44px, 20px padding | hover: `--nx-mk-cta-deep`, lift 1px, green shadow, arrow nudges 3px; focus: global outline |
| `.nx-mk-cta--lg` | 56px, 28px padding, 17px | full width ≤800px |
| `.trust .nx-btn` (shared blocks) | same green pill | same |
| `.trust .tsx-btn-primary` (legacy) | green pill | hover deep green |
| `.tsx-btn-ghost` (legacy) | 1.5px `--tr-line` outline, ink text on light grounds; light outline on dark grounds | hover: green border + wash |
| Text links | `--nx-link` (green-deep), underline offset 3–5px | hover: ink with green underline |

One primary button per view. Secondary actions are ghost buttons or text links, never a second green pill next to the first.

### 3.13 Footer (shared chrome)

Reference: `FT` + CSS `═══ Footer (SiteFooter) ═══`; contact block `src/components/FooterContact.tsx` + `.footer-contact-block` in `src/styles/base.css`.
- Structure (fixed by tests): brand column (logo, `FOOTER_BLURB`, FooterContact) + `FOOTER_COLUMNS` (exactly 2) + Legal; bottom bar with © and "Back to top".
- Trust skin: `--nx-footer-bg` paper, ink text, green-deep caps labels (12px/700/.1em), 15px links at 44px rows, 1px line, a 3px three-track rule on top (`.trust .nx-footer::before`).
- Links may carry an anchor: `FooterLink.anchor` → `href = routePath(...) + '#anchor'` (e.g. "Website design" → `/trust/marketing#presence`).

### 3.14 Floating "Talk to us" pill and cookie banner

- `.tsx-concierge` (`TrustConcierge` in `src/components/trust/StaticPages.tsx`): green pill, white dot, appears after 640px scroll, hidden on contact. Fixed bars on a page must sit above it via `bottom: var(--nx-float-clear)`.
- Cookie banner `.cc-banner.cc-theme-trust` (`src/styles/consent.css`): paper glass, ink text, green solid button, outline ghost buttons, 9px radius.

### 3.15 Focus

Global for the page: `.nx-mk :focus-visible { outline: 2.5px solid var(--nx-mk-cta); outline-offset: 3px; border-radius: 6px }`. Chrome: `outline: 2.5px solid var(--nx-focus)`. On dark grounds use `--tr-green-light`.

---

## 4. Motion system

### 4.1 Principles

1. **Motion explains the story.** Every animation shows a state change the copy talks about (missing → found, phase reached, section entered). If it does not, remove it.
2. **One idea per moment.** One entrance per element, fired once; no loops except the caret blink.
3. **Fast in, never in the way.** Content is readable within ~1s of reaching it; nothing blocks scrolling (no pinning, no scroll-jacking).
4. **Refined, not bouncy.** Ease-out curves; overshoot only on small badges (`back.out(2.4)`).
5. **Reduced motion gets the same information** without movement (§4.4).

### 4.2 Durations and easings

| Name | Value | Where |
|---|---|---|
| `--nx-mk-ease` | `cubic-bezier(.22, 1, .36, 1)` | All CSS transitions (pill, rows, hover, accordion). |
| GSAP `power4.out` | — | Headline mask rise. |
| GSAP `power3.out` | — | Reveals (fade-lift), engine, record. |
| GSAP `power3.inOut` | — | Track rule draw. |
| GSAP `back.out(2.4)` | — | "Not there" chips pop. |
| GSAP `steps(17)` | — | Typed query. |
| GSAP `none` (scrubbed) | — | Story words, rail fill. |
| Micro (hover colour) | .25–.3s | Buttons, links, tabs. |
| UI state (pill, fills, ticks, accordion) | .45–.6s | Pill slide .45s, segment fill .6s, accordion .5s. |
| Reveals | .8–.9s, stagger .07–.12s | Section content. |
| Hero entrance | 1.1s lines (stagger .12), total ≈3s choreography | Once on load. |

### 4.3 Patterns (all in `MP`'s motion `useEffect`)

| Pattern | Implementation |
|---|---|
| Mask-rise headline | `.nx-mk-ln { overflow: hidden }`; `tl.from('.nx-mk-ln > span', { yPercent: 105, duration: 1.1, stagger: .12 })`. |
| Typed query | `fromTo(strong, { maxWidth: 0 }, { maxWidth: scrollWidth + 2, ease: 'steps(17)', clearProps: 'maxWidth' })` + CSS caret blink. |
| Problem chips | results fade-lift (stagger .1) then `.nx-mk-miss` scale from .6 with `back.out`. Consequence line fades in last. |
| Scroll-inked statement | `.nx-mk-w` opacity .16 → 1, `stagger: .05`, `scrollTrigger: { start: 'top 70%', end: 'bottom 55%', scrub: .6 }`. |
| Scroll-scrubbed line fill | `.nx-mk-rail i` `scaleY 0 → 1`, `scrub: .4` over the phases. Rail colour = last reached phase's track. |
| Record fill / empty | `ScrollTrigger.create({ trigger: phase, start: 'top 55%', onEnter: reach(i+1), onLeaveBack: setReached(i) })`; CSS handles flash, tick draw and text swap. |
| Section nav state | Scroll listener computes the current section (`top <= chromeTop + 68`) and each section's read share (`--p`); a `ResizeObserver` re-runs it after hash jumps and pin refreshes. No GSAP needed. |
| Section rule draw | `fromTo(track, { '--rule': 0 }, { '--rule': 1, duration: 1.2 })` at `top 85%`. |
| Fade-lift reveal | `gsap.from(els, { opacity: 0, y: 22–40, duration: .8–.9, stagger, ease: 'power3.out', scrollTrigger: { start: 'top 80%' } })`. Rows slide from `x: 40` (track band has `overflow-x: clip`). |

### 4.4 Loading GSAP and the reduced-motion contract

- `gsap` is already a dependency. Load it **inside the effect** with `Promise.all([import('gsap'), import('gsap/ScrollTrigger')])`, register the plugin, and build everything in `gsap.context(() => {…}, rootEl)`; cleanup calls `ctx.revert()`.
- Smooth scrolling is Lenis (`src/components/useSmoothScroll.ts`), already ticked by GSAP and wired to `ScrollTrigger.update`. Programmatic scrolls use `getLenis()?.scrollTo(y, { immediate })`, falling back to `window.scrollTo`.
- Call `ScrollTrigger.refresh()` after `document.fonts.ready` and `load`.
- Initial hash: after setup, `setTimeout(() => go(hash, true), 60)` (the site client's `scrollTo(0,0)` runs first).
- **Reduced motion** (`matchMedia('(prefers-reduced-motion: reduce)')`): do not load GSAP; add `.is-ready` immediately; fill the record with an `IntersectionObserver` per phase (`rootMargin: '0px 0px -45% 0px'`, fill only, never empty); CSS kills transitions/animations under `.nx-mk.nx-mk.nx-mk *`. If the dynamic import fails, take the same static path.
- Visibility observers that do not need GSAP (dock) always use `IntersectionObserver`.

---

## 5. How the marketing page was built (the thought process)

### 5.1 The concept: "what a search returns"

The old marketing page explained a service catalogue. The approved page **enacts the customer's problem, then
fixes it in front of the reader**:

1. *Problem, shown not told:* "A customer searches the business." A search box types the business name and
   returns four "Not there" results. The consequence line in the "lost" colour: they leave before contact.
2. *Thesis:* the story band states the position in one sentence (we do not start with advertising).
3. *Fix, step by step:* six phases. Beside them, a sticky **record of what a search returns** starts with
   every row missing and fills as each phase is read. The reader watches the business become findable.
4. *Detail:* the three service lines (presence, visibility, performance) as bands, each with its scope and four deliverables.
5. *Self-selection:* "Where you are now" lets the reader pick their line by symptom.
6. *Fit, proof, objections, ask:* who it is for, work already done this way, questions, then a scoped CTA.

The record is the device that makes the page memorable: the same six labels appear in the hero (as missing),
in the record (as filling), in the phases (as goals) and in the tracks (as deliverables). One idea, four views.

### 5.2 Narrative sequence and why each section exists

| Order | Section | Job | Recipe |
|---|---|---|---|
| 1 | Hero | Make the reader recognise the problem in 3 seconds | 3.3 |
| 2 | Story | State the position (the "why us") | 3.4 |
| 3 | Phases + record | Show the method and its outcome at the same time | 3.5 |
| 4–6 | Track bands | Give scope, pricing basis and deliverables per line | 3.6 |
| 7 | Where you are now | Let the reader self-select; route to the right band | 3.7 |
| 8 | Who this is for | Confirm fit (audience in their own words) | 3.8 |
| 9 | Work already done | Evidence, anonymised, real | 3.9 |
| 10 | Questions | Remove the top objections (ads first? AI guarantees? monthly? what to send?) | 3.10 |
| 11 | Ask | A specific, scoped next step to the real contact flow | 3.11 |

Order is declared in `MARKETING_FLOW` (site.ts) and rendered by a `Record<MarketingBlock, () => ReactNode>`,
so a block cannot be added without implementing it, and both themes get the same order.

### 5.3 Mapping content to layout

- **Sequences** (steps, phases, stages) → timeline with numbered circles and a rail (3.5).
- **A set of four deliverables under one heading** → track band with sticky heading and row cards (3.6).
- **Three parallel options** → self-selection rows (3.7), not three equal cards.
- **Three audiences** → ruled columns (3.8).
- **Three proof items** → staggered cards (3.9).
- **Objections** → accordion (3.10).
- **The one thing to do** → CTA card (3.11).
- Equal-weight card grids are the last resort; they flatten hierarchy (see 5.4).

### 5.4 Decisions and rejected options

- **Rejected v4 (dark-to-light).** `prototypes/marketing-page-v4.html` opened on a near-black hero (`#0c1914`)
  and "lit up" into a pale page as you scrolled. It failed because: the dark-to-light switch was a gimmick
  that did not mean anything in the story; every block became a generic bordered card with a 4px top rule;
  the same `box-shadow` sat on every card, so nothing was more important than anything else; content was
  centred everywhere, which killed the reading line; and the nav used per-track underline colours that read as noise.
- **What made v5 (approved) work:** white ground throughout; the *problem* colour (red) and the three track
  colours are the only colour, and each means something; one device (the record) ties the page together;
  left-aligned type with designed line breaks and big confident headings; only two floating objects carry
  shadows; different layouts for different content shapes (5.3); motion that only shows state changes.
- **No second header.** The prototype had its own logo bar. In the site, the real SiteNav stays alone at the
  top; section navigation lives in the bottom search dock (3.2).
- **Old URLs kept.** `/trust/marketing/presence|visibility|performance` (and older `brand|web|growth`)
  301 to the in-page anchors (`next.config.mjs`); the routes left the sitemap (`IN_PAGE_SECTIONS` in seo.ts).
- **Fonts.** The prototype used Bricolage Grotesque + Instrument Sans; the site maps them to `--font-display`
  / `--font-body` (Inter for Trust) to stay on self-hosted fonts. Inter is wider, so the hero is fitted with
  container units instead of wrapping (`--nx-mk-h1-fit`).

### 5.5 Hierarchy rules

1. One H1 per page (the hero). Section headings are H2; rows/cards H3.
2. Size steps are big: hero ≈ 2× track heading ≈ 2× row heading. If two levels look similar, the lower one is too big.
3. Colour order: ink for reading, muted for meta, track colour only for things that belong to a track, green for the action, red only for the problem.
4. One primary action per viewport.
5. Left-aligned. Centre only short labels inside chips/buttons.

### 5.6 Rhythm of bands

white hero → paper story (bordered) → white stage → three washed track bands (green, plum, amber) → white
closing blocks (starts, who, proof, FAQ, each `padding-top: 112px`) → green-wash CTA card → paper footer with
the three-track rule. Never put two washed bands of the same colour next to each other; never put a dark band
between light ones without a story reason.

### 5.7 Writing the voice pairs

- **Trust first, verbatim when a source exists.** The prototype was already corporate British English, so Trust
  copy was copied character for character (including curly apostrophes) into `data.ts` / `copy.ts`.
- **Neo second, same facts.** Shorter sentences, second person, contractions, a little loud. Keep every fact,
  list item and limitation; change only the wording. Example pair:
  - Trust: "Businesses people cannot find or contact yet. Website, brand identity, Google Business, enquiry path."
  - Neo: "People can't find you or reach you yet. Website, brand identity, Google Business, a way to enquire."
- Disclaimers survive translation: Trust "Placement in ChatGPT, Gemini or any other AI product cannot be guaranteed." → Neo "Nobody can promise a spot in ChatGPT, Gemini or any other AI app."
- Labels that are names (Presence, Visibility, Performance, Website, Social…) stay identical in both voices.
- Questions in FAQs may be reworded; answers must give the same answer.

---

## 6. Converting a page: method, checklist, definition of done

### 6.1 Step-by-step method

1. **Inventory.** Open the live Trust and Neo versions of the page and list every block, every fact, every link,
   every CTA. Find where each string lives (`grep` the text in `src/lib/data.ts`, `src/lib/copy.ts`, components).
   Note which facts exist only in one voice (they must exist in both).
2. **Pick the concept.** Write in one sentence what the page *enacts* (marketing: "a search that returns nothing,
   then everything"). Find the page's "record": the one artefact that changes as the reader scrolls (see §8 hints).
3. **Sequence the narrative.** Problem → thesis → method (with the record) → detail → self-selection → fit → proof →
   objections → ask. Drop or merge blocks that do not serve a step. Do not invent facts to fill a step.
4. **Map content to recipes** (§3, §5.3). Write the block list as a flow: `export const <PAGE>_FLOW = [...] as const`
   in `src/lib/site.ts` (or update the existing `HOME_FLOW` / `ABOUT_FLOW` / `PROOF_FLOW` / `LABS_FLOW`).
5. **Wire the data.** Content (facts, lists) → `src/lib/data.ts` as Voiced pairs; headings, kickers, CTAs →
   `COPY.<page>` in `src/lib/copy.ts`. Trust verbatim where the approved copy exists; write Neo to the same facts.
6. **One shared component.** Build/extend a renderer in `src/components/shared/<Page>.tsx` with a
   `Record<Block, () => ReactNode>` over the flow. Mount it from **both** `NeoSiteClient.tsx` and
   `TrustSiteClient.tsx`. No theme checks; wording via `voiced(value, theme)`.
7. **Style with tokens only.** Namespace classes (`nx-<page>-*`) in `src/styles/shared.css`. Reuse `.nx-mk-*`
   recipes where the shape is identical (you may lift them into neutral `nx-` names if a second page needs them;
   keep both working). Colours only from `--tr-*` / `--nx-*` / track `--c`. If Neo needs different values, add a
   token with both values; never a selector fork.
8. **Motion.** Add the GSAP effect (dynamic import, `gsap.context`, reduced-motion static path, IO fallback) using
   §4 patterns. Hide-until-ready only for the hero, behind `html:not(.no-js) …:not(.is-ready)`.
9. **Accessibility.** Landmarks (`main`, `section` with `aria-labelledby`), one H1, real anchors/buttons, `aria-expanded`
   on toggles, focus-visible, 44px targets, contrast pairs from §2.1.
10. **SEO.** Update `src/lib/seo.ts` (title/description/heading/body), keep visible FAQs and JSON-LD FAQ identical, keep
    canonicals (Trust → Neo URL), redirect any removed URL in `next.config.mjs`.
11. **Tests.** Update tests that encode the old structure (and say so); add a test for the new flow (every block rendered,
    both voices present, no em dashes).
12. **Verify** (§6.4) and write a short report: files, URL mapping, Neo copy, results, things to eyeball.

### 6.2 Page-conversion checklist

- [ ] Concept sentence written; record/artefact chosen.
- [ ] Flow declared in `site.ts`; renderer is a `Record<Block, …>`; mounted in both site clients.
- [ ] Every visible string is Voiced; Trust verbatim/British; Neo same facts; no em dashes; no stock vocabulary; no AI guarantees.
- [ ] No `theme ===` checks for looks; no per-theme-only blocks.
- [ ] Only `--tr-*` / `--nx-*` / track tokens; no hex colours in new CSS except inside token definitions.
- [ ] No blue (grep and audit below).
- [ ] No `!important` added.
- [ ] Motion: dynamic GSAP import, `gsap.context` cleanup, reduced-motion path, IO fallback, hero hide-until-ready only.
- [ ] Links: CTA → `routePath(theme, 'contact', <id>)`; old URLs redirected; footer/nav links still valid.
- [ ] SEO entry updated; FAQ JSON-LD = visible FAQ; sitemap/route counts updated in tests if routes changed.
- [ ] Tests updated/added.

### 6.3 Definition of done

| Check | Command / method | Pass |
|---|---|---|
| Typecheck | `npm run typecheck` (from `nexara-site-next/`) | 0 errors |
| Tests | `npm test` | all pass |
| Mobile overflow | at 375px: `document.documentElement.scrollWidth === 375` | true |
| Tap targets | every visible `a, button` in the page ≥44px tall | none smaller |
| Contrast | audit script below, every scroll position | no text < 4.5:1 (3:1 large) except decorative counters already on `--tr-faint` |
| No blue | grep below + audit script | 0 hits |
| Reduced motion | emulate `prefers-reduced-motion: reduce`, reload | everything visible, record still fills |
| Console | browser console on load + full scroll | no errors |
| Structure | SITE_STRUCTURE.md rules (shared flow, footer 2 columns, blog routes) | tests green |
| Preview | dev server `npm run dev` on :3000 (`.claude/launch.json` → `nexara-site-next-dev`); view `/trust/<page>` and `/neo/<page>` at 1024px and 375px | looks right in both |

### 6.4 Verification snippets

**Blue grep (static).** From `nexara-site-next/`:
```bash
python3 - <<'EOF'
import re, colorsys, glob
files = ['src/styles/trust.css', 'src/styles/shared.css', 'src/styles/consent.css'] + glob.glob('src/components/trust/*.tsx') + glob.glob('src/components/shared/*.tsx')
pat = re.compile(r'#([0-9a-fA-F]{6})(?![0-9a-fA-F])|rgba?\((\d+),\s*(\d+),\s*(\d+)')
for f in files:
    for i, line in enumerate(open(f), 1):
        for m in pat.finditer(line):
            r, g, b = (int(m.group(1)[k:k+2], 16) for k in (0, 2, 4)) if m.group(1) else map(int, m.group(2, 3, 4))
            h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255)
            if 185 <= h*360 <= 265 and s > .06 and .03 < l < .985: print(f, i, line.strip()[:100])
EOF
```
Expected hits are Neo-only rules (selectors starting `.neo`) and Neo token values; anything inside a `.trust` rule or a Trust component is a bug.

**Runtime audit (browser console, run at several scroll positions).** It reports low-contrast text and any computed blue colour/background/border/outline:
```js
(() => { const P=c=>{const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);return{r:p[0],g:p[1],b:p[2],a:p[3]??1}};
const Lm=({r,g,b})=>{const f=x=>{x/=255;return x<=.03928?x/12.92:((x+.055)/1.055)**2.4};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
const H=({r,g,b})=>{r/=255;g/=255;b/=255;const M=Math.max(r,g,b),n=Math.min(r,g,b),d=M-n,l=(M+n)/2;if(!d)return[0,0,l];const s=d/(1-Math.abs(2*l-1));let h=M===r?((g-b)/d)%6:M===g?(b-r)/d+2:(r-g)/d+4;h*=60;if(h<0)h+=360;return[h,s,l]};
const blue=c=>{if(!c||c.a<.05)return false;const[h,s,l]=H(c);return h>=185&&h<=265&&s>.12&&l>.04&&l<.97};
const bg=el=>{for(let e=el;e;e=e.parentElement){const c=P(getComputedStyle(e).backgroundColor);if(c&&c.a>.5)return c;if(getComputedStyle(e).backgroundImage!=='none')return null}return{r:255,g:255,b:255,a:1}};
const low=[],bl=new Set();document.querySelectorAll('body *').forEach(el=>{const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden'||!el.getBoundingClientRect().width)return;
for(const p of['color','backgroundColor','borderTopColor'])if(blue(P(cs[p]))&&!(p==='borderTopColor'&&cs.borderTopWidth==='0px'))bl.add(p+' '+cs[p]+' '+el.className);
if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())||el.closest('[aria-hidden=true]'))return;const f=P(cs.color),b=bg(el);if(!f||!b)return;
const m={r:f.r*f.a+b.r*(1-f.a),g:f.g*f.a+b.g*(1-f.a),b:f.b*f.a+b.b*(1-f.a)};const A=Lm(m),B=Lm(b),cr=(Math.max(A,B)+.05)/(Math.min(A,B)+.05);
const big=parseFloat(cs.fontSize)>=24||(parseFloat(cs.fontSize)>=18.6&&+cs.fontWeight>=700);if(cr<(big?3:4.5))low.push(cr.toFixed(2)+' '+el.className+' "'+el.textContent.trim().slice(0,30)+'"')});
return{low,blue:[...bl]};})()
```
Known false positive: text over the glass search dock (its background is translucent).

---

## 7. File map, adding things the shared way, tests, pitfalls

### 7.1 File map

| What | Where |
|---|---|
| Structure registry (NAV, CONTACT_ENTRY, flows, footer columns, MARKETING_FLOW/TRACKS) | `src/lib/site.ts` |
| Chrome copy (Voiced) | `src/lib/copy.ts` (`COPY.marketing`, `COPY.labs`, `COPY.home`, …) |
| Content and facts (Voiced) | `src/lib/data.ts` (`DATA.sections.{academy,marketing,labs}`, `DATA.work`, `DATA.company`, `DATA.contact`) |
| Routes, SEO, JSON-LD, FAQs | `src/lib/seo.ts` (`pages`, `LOCAL_FAQS`, `getRoutes`, `getSeo`, `getStructuredData`, `marketingFaqs`, `IN_PAGE_SECTIONS`) ; `src/lib/routes.ts` |
| Redirects | `next.config.mjs` (`redirects()`) |
| Site clients (mount pages) | `src/components/NeoSiteClient.tsx`, `src/components/TrustSiteClient.tsx` |
| Shared renderers | `src/components/shared/*` (`MarketingPage.tsx`, `AcademyPage.tsx`, `Home.tsx` + `HomeBlocks.tsx`, `About.tsx`, `Proof.tsx`, `Blog.tsx`, `SiteNav.tsx`, `SiteFooter.tsx`, `ThemeSwitch.tsx`, `ClientCard.tsx`, `LabsMap.tsx`, `LabsShowcase.tsx`, `FaqBand.tsx`, `PageHeader.tsx`) |
| Legacy Trust-only renderers (to be converted) | `src/components/trust/*` (`SectionShell.tsx`, `Academy.tsx`, `Cards.tsx`, `Subpage.tsx`, `StaticPages.tsx`, `Hero.tsx`, `Canvas.tsx`) |
| Legacy Neo-only renderers | `src/components/neo/*` |
| Tokens + shared CSS | `src/styles/shared.css` (`.trust` palette block at top; Marketing page section at the end) |
| Legacy Trust CSS | `src/styles/trust.css` (loaded by `src/app/trust/layout.tsx` after shared.css) |
| Mixed legacy CSS | `src/styles/base.css` (contact details, footer contact block, depth cards) |
| Cookie banner skin | `src/styles/consent.css` |
| Smooth scroll | `src/components/useSmoothScroll.ts` (Lenis + `getLenis()`) |
| Prototype (design + copy source) | `prototypes/marketing-page.html` (= v5); rejected `marketing-page-v4.html` |
| Structure doc | `docs/SITE_STRUCTURE.md` |
| Tests | `tests/site.test.mjs`, `tests/seo.test.mjs` (+ `animation`, `brief`, `hero-chapters`) |

### 7.2 Adding a page or block the shared way

- **New block on an existing page:** add the id to the flow in `site.ts` → TypeScript fails until the block exists in the page's `Record<Block, …>` → implement once in the shared component → wording in `copy.ts` / `data.ts` as `{ neo, trust }` → CSS with tokens.
- **New page:** add to `NAV` (both labels/blurbs Voiced) → add its SEO entry in `seo.ts` `pages` → render it from both site clients → test that both routes resolve (`getSeo(...).valid`).
- **Make a shared page look different per theme:** add/adjust a token in the `.trust` / `.neo` blocks of `shared.css`.
- **Remove a URL:** delete its route source, add a 301 in `next.config.mjs`, update route-count tests.

### 7.3 Tests that guard this

- `site.test.mjs`: nav parity, flows, footer links resolve (`FOOTER_COLUMNS.length === 2`), blog routes, theme switch equivalence, Voiced copy has both voices and no em dash, client cards, Labs map integrity, **marketing page** (every `MARKETING_FLOW` block implemented, no theme checks in the renderer, both clients mount it, tracks = subpages, voiced copy, AI disclaimer present).
- `seo.test.mjs`: route count (37) and canonical count (15), valid metadata, canonicals to Neo, FAQ JSON-LD, marketing and academy anchors not routed, redirects present, FAQ schema matches the visible voice.

### 7.4 Common pitfalls

- **Do not run `next build` while `npm run dev` is running**: both write `.next` and clobber each other. Use `npm run typecheck` + `npm test`; build only with the dev server stopped.
- **Specificity traps.** trust.css loads after shared.css and has `.trust.tsx-site h1/h2/h3` and some `!important` rules. Bump new selectors to `main.nx-xx .nx-xx-thing`; do not add `!important`.
- **Four Trust token layers** in trust.css (line 1, ~374, ~600, ~1013). They now reference `--tr-*`; if you change a palette value, change it in the `.trust` block of shared.css only.
- **Theme checks in components** (`theme === 'trust' ? …`) for looks: forbidden; tests check the marketing renderer.
- **Per-theme-only sections**: forbidden; both clients must mount the same renderer.
- **Hydration flashes**: never hide content with CSS that depends on JS without the `html:not(.no-js)` guard and a timeout fallback.
- **Lenis + anchors**: use `getLenis()?.scrollTo`; native `scrollIntoView` fights Lenis. Set `scroll-margin-top` for no-JS hash jumps.
- **Site client scroll reset**: `NeoSiteClient`/`TrustSiteClient` call `window.scrollTo(0,0)` on page change; jump to a hash *after* it (timeout).
- **Green on dark** fails contrast: use `--tr-green-light` on `--tr-ink` grounds.
- **Fixed bottom UI** must use `bottom: var(--nx-float-clear)` to clear the Trust "Talk to us" pill.
- **Browser preview caching**: reload after CSS/JS edits; verify with `getComputedStyle`, not only screenshots.
- **Static legal pages** (`public/*.html`) are plain HTML outside the token system.

---

## 8. Page conversion queue

Real Trust routes (from `getRoutes()` in `src/lib/seo.ts` and `src/app/trust/*`). Done: **Marketing**, **Academy**, **Labs**, **About**, **Proof**, **Blog**, **Contact**. Home keeps theme-specific animated heroes (no brief-routing card).
Each item lists the concept hint, the record/artefact, and the recipes to use. Convert Neo at the same time (same shared renderer).

| # | Page (routes) | Current renderer | Concept hint ("the page enacts…") | Record / artefact | Recipes |
|---|---|---|---|---|---|
| 1 | **Home** `/trust` (Neo `/`) | `shared/Home.tsx` + `HomeBlocks.tsx` — Neo/Trust animated heroes retained; Trust division track colours | "One firm, three teams, one standard." | Theme-specific hero animations (SITE_STRUCTURE exception). No brief-routing card. | Keep animated heroes. `HOME_FLOW` order locked. Trust rail tracks: Academy brand blue / Marketing plum / Labs amber. **Trust colour exception:** brand-kit blues via `.trust-home` (see §1 rule 2). |
| 2 | **About** `/trust/company` | **Done:** `shared/About.tsx` (`ABOUT_FLOW`, `nx-ab-*`) | "A company you can verify": legal facts and people shown as a dossier. | A dossier/register: CIN, GSTIN, address, directors, incorporated, ticking "verified" as facts are read. | Hero 3.3 (dossier artefact), story 3.4, how/steps as timeline 3.5, milestones timeline, people as ruled columns, facts table, principles/standards columns 3.8, FAQ 3.10, CTA 3.11. Light hero (no dark page head). |
| 3 | **Academy** `/trust/academy` | **Done:** `shared/AcademyPage.tsx` Proof Portfolio (`ACADEMY_FLOW`: hero → thesis → runway → lanes → fit → proof → faqs → ask) | "A learner goes from course to placement-ready, with proof at every step." | Portfolio dossier (hero) + sticky stamp sheet (6 stamps) filling as Map → Cohort → Proof → Place runway nodes are reached. | Distinct `nx-ac-*` recipes (not Marketing). Hero portfolio cover opens to empty slots; horizontal runway + dossier; asymmetric lane panels; fit chips + rows; receipt strip; FAQ; ask. Anchors `#tracks|#internships|#placements`. **Trust colour exception:** logo brand kit on `.nx-ac` (action `#215F94`, accent `#66A0CC`, navy `#2C3F5E`). |
| 3a | Academy anchors `#tracks`, `#internships`, `#placements` | In-page on Academy (old detail URLs 301) | Same as parent. | Same record, filled as stages are read. | Anchors like marketing. Internship FAQs from `LOCAL_FAQS` are merged into the visible Academy FAQ list. |
| 4 | **Labs** `/trust/labs` | **Done:** `shared/LabsPage.tsx` (`LABS_FLOW` + grouped SubNav), `LabsMap.tsx`, `LabsShowcase.tsx` | "A business problem becomes a running system, layer by layer." | The layer map (data / services / interface / live) as the record band. | `LABS_FLOW`: proof (Websites banner + four software cards), products (4-up, live/demo then in build), map as dark record (deliverables only), five capabilities, four stage gates in one row (pipeline lives in the hero only), packages, FAQ, CTA. Each client or product is listed once; no specialisms or audience table on the overview. Finder: Proof / Products / Capabilities / Engagement. Skin `--nx-lp-*` / `--nx-lab-*`, amber via `.trust-labs`. |
| 4a | Labs details `/trust/labs/products|ai-automation|ecommerce|delivery` + product routes (`/voice`, `/agency`, …) | **Done:** `LabsPage` capability + product panels | One capability or product in depth. | Capability cards + stages, or product covers + status. | Light detail bands, FAQ (ecommerce merges `LOCAL_FAQS`), CTA. Product routes are SEO pages. |
| 5 | **Proof / Delivery Proof** `/trust/customers` (+ `/customers/academy|marketing|labs`) | **Done:** `shared/Proof.tsx` (`PROOF_FLOW`, `nx-pf-*`), `ClientCard.tsx` | "Live work you can click." | A client index that ticks scope items as each case is read. | Hero 3.3 (artefact: list of live URLs), builds + Link filters as sub-nav 3.2, CTA 3.11. Only real outcomes (`result` only when approved). |
| 6 | **Blog** `/trust/blog`, `/trust/blog/[slug]` | **Done:** `shared/Blog.tsx` (`nx-bl-*`), `BlogShell.tsx`, `BlogContent.tsx` | "Notes from the team that builds." | None (reading page). | Index: hero 3.3 without artefact, post list as start rows 3.7. Post: reading column 60–68ch, CTA 3.11. Trust canonicalises to Neo `/blog`. |
| 7 | **Contact** `/trust/contact` (+ `/contact/home|academy|marketing|labs`) | **Done:** `shared/ContactPage.tsx` (`nx-ct-*`), `ContactDetails.tsx` | "Send a scoped brief and see exactly what you will get back." | The brief preview (`useBriefForm` `briefText`) filling as fields are completed. | Hero 3.3 (artefact = brief preview), form in white card, light contact details, FAQ, no concierge. |
| 8 | **Legal** `/privacy-policy.html`, `/terms-of-service.html`, `/cookie-policy.html`, `/data-deletion.html` | static files in `public/` | Plain reading pages. | None. | Out of the token system; if converted, use the blog post reading recipe and the Field palette by value. |
| 9 | **Gateway** `/gateway` (noindex chooser) | `GatewayClient.tsx`, `Gateway3D.tsx`, `gateway-cinematic.css` | Not a Trust page (it presents both themes). Its Trust side may still show blue light in the 3D scene. | — | Only touch if the user asks; if so, Trust side uses Field palette by value. |
| 10 | **Not found** (any unknown `/trust/*`) | `NotFound.tsx` | — | — | Light, hero-style message + links to NAV pages. |

Track assignment across the site (keep it consistent once chosen). Within a page: **green = first part** (presence, learn, data),
**plum = second part** (visibility, build, services), **amber = third part** (performance, place, interface).
For the three divisions on Home: **Academy = green, Digital Solutions (marketing) = plum, Product Studio (labs) = amber**.
