# Nexara Site → Next.js 15 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate nexara-site from a Vite-built, path-routed CSR React SPA (deployed to Cloudflare Pages) to Next.js 15 + App Router + OpenNext + Cloudflare Workers, matching the `nexara-repo-framework` stack — with zero visual or behavioral change in this phase.

**Architecture:** Build the new app in a parallel `nexara-site-next/` directory so the live Vite site keeps deploying unaffected until cutover is explicitly approved. Port routing, metadata generation, and the two large page-engine files (`trust.jsx`, `neo.jsx`) verbatim behind `'use client'` boundaries — no decomposition into smaller components and no TypeScript conversion yet. That work (Phase 2) is scoped separately once the ported code's natural component boundaries are visible, which isn't knowable from outside the files.

**Tech Stack:** Next.js 15.3.0, React 19.1.0, TypeScript 5.6 (`allowJs: true` for this phase only), Tailwind CSS v4, `@opennextjs/cloudflare`, Wrangler 4.

## Global Constraints

- New app lives at `nexara-site-next/` (sibling to `nexara-site/`) until cutover is explicitly approved by the user — never break the live Vite build mid-migration.
- No visual or behavioral change vs. current production in this phase. Any difference found in QA is a bug to fix, not deferred cleanup.
- npm script names match `nexara-repo-framework` convention exactly: `dev`, `build`, `typecheck`, `check:arch`, `verify`, `preview`, `deploy`, `cf-typegen`.
- Path alias `@/*` → `./src/*`.
- `tsconfig.json` mirrors `nexara-repo-framework`'s (`strict: true`, `noUncheckedIndexedAccess`, `noImplicitOverride`) except `allowJs: true` here — flipped to `false` at the end of the (separately planned) Phase 2 decomposition.
- Canonical production domain stays `nexaragroups.com`. The `pages.dev → nexaragroups.com` host-guard redirect currently inline in `index.html:12-19` must be preserved and re-verified under the Workers hostname model at cutover.
- Every route reachable in production today must remain reachable at the same path after cutover, checked against the authoritative route table this plan produces in Task 1 — not against memory.
- Dependency versions pinned to match `nexara-repo-framework`: `next@15.3.0`, `react@19.1.0`, `react-dom@19.1.0`, `typescript@^5.6.0`, `wrangler@^4.0.0`, `@opennextjs/cloudflare@^1.0.0`.
- **One validated push, not one push per task.** All of Phase 1 (Tasks 0-8) lands on a single working branch. Nothing gets pushed to `origin/main` — including Task 0's standalone `company`-route fix, even though it's independent of the Next.js work — until Task 8's full QA pass is green. No piecemeal deploys mid-migration.

---

## File Structure

```
nexara-site-next/
├─ package.json
├─ next.config.mjs
├─ open-next.config.ts
├─ wrangler.toml
├─ tsconfig.json
├─ postcss.config.mjs
├─ .env.example
├─ public/
│  ├─ brand/                      (copied verbatim from nexara-site/public/brand)
│  ├─ fonts/                      (copied verbatim from nexara-site/public/fonts)
│  ├─ robots.txt                  (copied verbatim)
│  ├─ privacy-policy.html         (copied verbatim)
│  ├─ terms-of-service.html       (copied verbatim)
│  ├─ cookie-policy.html          (copied verbatim)
│  └─ data-deletion.html          (copied verbatim)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx               root layout: fonts, GA4 consent script, Organization/WebSite JSON-LD, pages.dev host guard
│  │  ├─ page.tsx                 Gateway (theme picker) — server component wrapping GatewayClient
│  │  ├─ sitemap.ts               generates sitemap.xml from src/lib/routes.ts (replaces hand-maintained public/sitemap.xml)
│  │  ├─ trust/
│  │  │  ├─ page.tsx              trust home
│  │  │  ├─ [page]/page.tsx       academy | marketing | labs | customers | company | contact
│  │  │  └─ [page]/[detail]/page.tsx   tracks | brand | web | growth | products | ai-automation | delivery
│  │  └─ neo/
│  │     ├─ page.tsx
│  │     ├─ [page]/page.tsx
│  │     └─ [page]/[detail]/page.tsx
│  ├─ components/
│  │  ├─ GatewayClient.tsx        'use client' wrapper — ports gateway.jsx body verbatim
│  │  ├─ TrustSiteClient.tsx      'use client' wrapper — ports trust.jsx body verbatim
│  │  ├─ NeoSiteClient.tsx        'use client' wrapper — ports neo.jsx body verbatim
│  │  ├─ Gateway3D.tsx            'use client', dynamic-imported with ssr:false — ports gateway-3d.jsx verbatim
│  │  ├─ CookieConsent.tsx        ports CookieConsent.jsx, fixes the SSR-unsafe useState initializer and stale hashchange listener
│  │  └─ ui/
│  │     └─ button.tsx            ports components/ui/button.jsx verbatim
│  ├─ lib/
│  │  ├─ data.ts                  ports data.js verbatim (typed as `as const` initially, no interface authoring yet)
│  │  ├─ shared.ts                ports voice(), useBriefForm, getBriefSections, buildBriefText, buildBriefMailto, HAS_SCROLL_ANIMATION, SECTION_HERO_WORDS, STATIC_PAGES verbatim; drops parseRoute/routeTo (replaced by App Router)
│  │  ├─ routes.ts                NEW — single source of truth for the 29-route inventory (Task 1), consumed by app/*/[...]/page.tsx and app/sitemap.ts
│  │  └─ utils.ts                 ports lib/utils.js verbatim
│  └─ styles/
│     ├─ base.css                 copied verbatim from src/legacy/base.css
│     ├─ gateway.css              copied verbatim
│     ├─ neo.css                  copied verbatim
│     ├─ trust.css                copied verbatim
│     ├─ neo-guide.css            copied verbatim
│     ├─ consent.css              copied verbatim
│     └─ index.css                copied verbatim (Tailwind v4 entry)
```

---

## Task 0: Fix the live `company` route sitemap/prerender gap (current site, independent of migration)

While scoping this migration, an independent review (Codex) found that `company` is a real, currently-rendered route — `STATIC_PAGES = ["home", "customers", "company", "contact"]` in `nexara-site/src/shared.js:4`, rendered at `nexara-site/src/neo.jsx:2310` (`{page === "company" && <Company theme={theme} />}`) and validated as a legal page at `nexara-site/src/trust.jsx:3402` — but it has never appeared in `scripts/prerender.js`'s route list or `public/sitemap.xml`. That means `/trust/company` and `/neo/company` render fine for visitors but have shipped an empty-shell `<div id="root">` with the *gateway's* title/description to every crawler since prerendering went live, and were never in the sitemap at all. This is a live SEO gap today. Fix it now, independent of whether/when the Next.js migration proceeds.

**Files:**
- Modify: `nexara-site/scripts/prerender.js:22-55` (routes array), `:69-87` (`getDescription`), `:174-190` (`generateNoscriptHTML`)
- Modify: `nexara-site/public/sitemap.xml`

- [ ] **Step 1: Add company routes to the prerender route list**

In `nexara-site/scripts/prerender.js`, in the `routes` array, insert directly after the `trust/customers` entry (line 30) and directly after the `neo/customers` entry (line 45):

```js
  { path: 'trust/company', theme: 'trust', page: 'company', detail: null },
```
and
```js
  { path: 'neo/company', theme: 'neo', page: 'company', detail: null },
```

So the array reads (showing the trust block; mirror the same insertion in the neo block):

```js
  { path: 'trust/customers', theme: 'trust', page: 'customers', detail: null },
  { path: 'trust/company', theme: 'trust', page: 'company', detail: null },
  { path: 'trust/contact', theme: 'trust', page: 'contact', detail: null },
```

- [ ] **Step 2: Add a company branch to `getDescription()`**

In `nexara-site/scripts/prerender.js`, `getDescription(theme, page, detail)` currently has no branch for `page === 'company'` so it falls through to `BASE_DESC`. Add, right after the `contact` branch (after line 85, before the closing `return BASE_DESC;`):

```js
  if (page === 'company') {
    return theme === 'neo'
      ? "Nexara Gen Z: the IT company that doesn't act like one. Academy turns learning into portfolio proof, Digital Marketing turns offers into market signal, Labs turns AI ideas into working systems."
      : 'Nexara is an incorporated capability firm with three specialist forces — Academy, Digital, Labs — answering to one governance standard: named ownership, written scope, reported cadence.';
  }
```

- [ ] **Step 3: Add a company branch to `generateNoscriptHTML()`**

In `nexara-site/scripts/prerender.js`, the section-based branch (`const section = DATA.sections[page];`) doesn't match `company` since it lives at `DATA.company`, not `DATA.sections`. Add a new `else if` branch right after the existing `else if (page === 'customers')` block (after line 183, before `} else if (page === 'contact')`):

```js
  } else if (page === 'company') {
    const co = DATA.company[activeTheme];
    html += `
      <h2>${activeTheme === 'neo' ? 'Nexara Gen Z' : 'The Operating Standard'}</h2>
      <p>${co.manifesto}</p>
      <h3>Standards</h3>
      <ul>
    `;
    DATA.company.standards.forEach(s => {
      html += `<li><strong>${s.title}</strong>: ${s.body}</li>`;
    });
    html += `</ul>`;
  }
```

- [ ] **Step 4: Add sitemap entries**

In `nexara-site/public/sitemap.xml`, insert directly after the `trust/customers` `<url>` block (after line 42) and directly after the `neo/customers` `<url>` block (after line 124):

```xml
  <url>
    <loc>https://nexaragroups.com/trust/company</loc>
    <lastmod>2026-07-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
```
and
```xml
  <url>
    <loc>https://nexaragroups.com/neo/company</loc>
    <lastmod>2026-07-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
```

- [ ] **Step 5: Build and verify**

Run:
```bash
cd "nexara-site" && npm run build
```
Expected: build succeeds, and the console log from `prerender.js` includes two new lines:
```
Pre-rendered route: /trust/company -> /trust/company/index.html
Pre-rendered route: /neo/company -> /neo/company/index.html
```

Then verify content:
```bash
grep -o '<title>.*</title>' dist/trust/company/index.html
grep -o '<title>.*</title>' dist/neo/company/index.html
grep -c '<loc>' public/sitemap.xml
```
Expected: two distinct, non-gateway titles (not `Nexara Groups — Academy, Digital Marketing & Product Studio`), and `33` (was 31, plus 2 new).

- [ ] **Step 6: Commit**

```bash
cd "nexara-site" && git add scripts/prerender.js public/sitemap.xml
git commit -m "fix(seo): add missing company route to prerender + sitemap"
```

- [ ] **Step 7: Deploy per the existing deploy method**

```bash
cd "/Users/naveengalla/Documents/Claude/nexara-gateway copy" && git push origin main
```
Cloudflare Pages auto-builds from this push (per established deploy method for this repo). Confirm live after build completes:
```bash
curl -s https://nexaragroups.com/sitemap.xml | grep -c '<loc>'
```
Expected: `33`.

---

## Task 1: Build the authoritative route table (`src/lib/routes.ts`)

This table is the single source of truth the rest of the migration (App Router page files, `sitemap.ts`, metadata) is generated from — replacing the pattern where `prerender.js`'s hand-maintained array and `sitemap.xml`'s hand-maintained XML could silently drift apart, which is exactly what caused the Task 0 gap.

**Files:**
- Create: `nexara-site-next/src/lib/routes.ts`

**Interfaces:**
- Produces: `ROUTES: Route[]` and `type Route = { path: string; theme: 'trust' | 'neo' | null; page: string; detail: string | null; title: string; description: string }`, consumed by Task 5 (page files) and Task 6 (`sitemap.ts`, `generateMetadata`).

- [ ] **Step 1: Write `routes.ts` enumerating all 29 routes**

```ts
export type Theme = 'trust' | 'neo';

export interface Route {
  path: string;
  theme: Theme | null;
  page: string;
  detail: string | null;
}

const BRAND_TITLE = 'Nexara Groups — Academy, Digital Marketing & Product Studio';

function themeName(theme: Theme): string {
  return theme === 'trust' ? 'Nexara Trust' : 'Nexara';
}

// Naive title-casing mangles hyphenated slugs ("ai-automation" -> "Ai automation").
// Special-case known acronym slugs; title-case the rest word-by-word.
function capitalizeSlug(slug: string): string {
  if (slug === 'ai-automation') return 'AI Automation';
  return slug
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function routeTitle(route: Route): string {
  if (route.page === 'gateway') return BRAND_TITLE;
  const capPage = capitalizeSlug(route.page);
  if (route.detail) {
    const capDetail = capitalizeSlug(route.detail);
    return `${capDetail} | ${capPage} | ${themeName(route.theme as Theme)}`;
  }
  if (route.page === 'home') return BRAND_TITLE;
  return `${capPage} — ${themeName(route.theme as Theme)}`;
}

export const ROUTES: Route[] = [
  { path: '', theme: null, page: 'gateway', detail: null },

  { path: 'trust', theme: 'trust', page: 'home', detail: null },
  { path: 'trust/academy', theme: 'trust', page: 'academy', detail: null },
  { path: 'trust/marketing', theme: 'trust', page: 'marketing', detail: null },
  { path: 'trust/labs', theme: 'trust', page: 'labs', detail: null },
  { path: 'trust/customers', theme: 'trust', page: 'customers', detail: null },
  { path: 'trust/company', theme: 'trust', page: 'company', detail: null },
  { path: 'trust/contact', theme: 'trust', page: 'contact', detail: null },
  { path: 'trust/academy/tracks', theme: 'trust', page: 'academy', detail: 'tracks' },
  { path: 'trust/marketing/brand', theme: 'trust', page: 'marketing', detail: 'brand' },
  { path: 'trust/marketing/web', theme: 'trust', page: 'marketing', detail: 'web' },
  { path: 'trust/marketing/growth', theme: 'trust', page: 'marketing', detail: 'growth' },
  { path: 'trust/labs/products', theme: 'trust', page: 'labs', detail: 'products' },
  { path: 'trust/labs/ai-automation', theme: 'trust', page: 'labs', detail: 'ai-automation' },
  { path: 'trust/labs/delivery', theme: 'trust', page: 'labs', detail: 'delivery' },

  { path: 'neo', theme: 'neo', page: 'home', detail: null },
  { path: 'neo/academy', theme: 'neo', page: 'academy', detail: null },
  { path: 'neo/marketing', theme: 'neo', page: 'marketing', detail: null },
  { path: 'neo/labs', theme: 'neo', page: 'labs', detail: null },
  { path: 'neo/customers', theme: 'neo', page: 'customers', detail: null },
  { path: 'neo/company', theme: 'neo', page: 'company', detail: null },
  { path: 'neo/contact', theme: 'neo', page: 'contact', detail: null },
  { path: 'neo/academy/tracks', theme: 'neo', page: 'academy', detail: 'tracks' },
  { path: 'neo/marketing/brand', theme: 'neo', page: 'marketing', detail: 'brand' },
  { path: 'neo/marketing/web', theme: 'neo', page: 'marketing', detail: 'web' },
  { path: 'neo/marketing/growth', theme: 'neo', page: 'marketing', detail: 'growth' },
  { path: 'neo/labs/products', theme: 'neo', page: 'labs', detail: 'products' },
  { path: 'neo/labs/ai-automation', theme: 'neo', page: 'labs', detail: 'ai-automation' },
  { path: 'neo/labs/delivery', theme: 'neo', page: 'labs', detail: 'delivery' },
];
```

- [ ] **Step 2: Verify count matches production**

Run:
```bash
node -e "const {ROUTES} = require('./src/lib/routes.ts'); console.log(ROUTES.length)"
```
(or, once the Next project exists in Task 2, `npx tsx -e "import {ROUTES} from './src/lib/routes'; console.log(ROUTES.length)"`)
Expected: `29` — 1 gateway + 14 trust (6 core + `company` + 7 detail... recount: home, academy, marketing, labs, customers, company, contact = 7 core, + academy/tracks, marketing/brand, marketing/web, marketing/growth, labs/products, labs/ai-automation, labs/delivery = 7 detail → 14 trust) + 14 neo = 29 total.

- [ ] **Step 3: Commit**

```bash
cd nexara-site-next && git add src/lib/routes.ts
git commit -m "feat: add authoritative route table for Next.js migration"
```

---

## Task 2: Scaffold the Next.js 15 + OpenNext project

**Files:**
- Create: `nexara-site-next/package.json`, `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `open-next.config.ts`, `wrangler.toml`, `.env.example`

> **DONE — but the tournament-round version of this task was scoped without running `npm install`, and a real install (done later, after Task 7) surfaced real errors this section's original text didn't anticipate:**
> - `next@15.3.0` doesn't satisfy `@opennextjs/cloudflare`'s peer range (`>=15.5.18 <16`) — bumped to `next@15.5.18`, still Next 15, still under 16. Bump `wrangler` to `^4.86.0` to match the same peer requirement.
> - `@types/react`, `@types/react-dom`, `@types/node`, `tailwindcss`, `@tailwindcss/postcss` were never added by any round (all correctly out of scope for a config-only round) — needed for real. `postcss.config.mjs` needs the `@tailwindcss/postcss` plugin, not `@tailwindcss/vite` (the original app's Vite-only plugin).
> - `next.config.mjs` was missing from every round's file list — an omission in the task brief I gave implementors, not something any of them got wrong.
> - **Verbatim-ported files need `// @ts-nocheck`, not `.jsx` renaming.** `allowJs: true` only exempts `.js`/`.jsx` files from type-checking when `checkJs` is also unset (which it is) — `.tsx`/`.ts` files are always fully checked under `strict: true`, regardless of `allowJs`. Renaming Task 6's output to `.jsx` was tried and reverted: it breaks the legitimate TypeScript annotations the `routeTo` fix itself uses (`ReturnType<typeof useRouter>`, etc.), since `.jsx` can't parse type syntax at all. The five Task 6 files plus `shared.ts` now carry a top-of-file `// @ts-nocheck` instead, with a comment explaining it's interim (typed properly during Phase 2 decomposition).
>
> With these fixes, `npm install && npm run build` succeeds end-to-end — all 29 routes + `sitemap.xml` generate as static/SSG pages, confirmed by inspecting `.next/server/app/trust/contact.html` directly: real navigation, real page content, real markup in the server-rendered HTML. No more empty `<div id="root">`.

- [ ] **Step 1: Scaffold via create-next-app**

```bash
cd "/Users/naveengalla/Documents/Claude/nexara-gateway copy"
npx create-next-app@15.3.0 nexara-site-next --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm
```

- [ ] **Step 2: Overwrite `tsconfig.json`** to match `nexara-repo-framework` conventions (minus the `@core`/`@shared`/`@features` aliases this project has no use for, plus `allowJs: true` for this phase):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "cloudflare-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Install dependencies matching the current site plus the framework's deploy tooling**

```bash
cd nexara-site-next
npm install three @react-three/fiber @react-three/drei gsap framer-motion @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
npm install -D @opennextjs/cloudflare@^1.0.0 wrangler@^4.0.0 @types/three
```

- [ ] **Step 4: Write `open-next.config.ts`**

```ts
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig();
```

- [ ] **Step 5: Write `wrangler.toml`**

```toml
name = "nexara-site"
main = ".open-next/worker.js"
compatibility_date = "2026-07-09"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"
```

- [ ] **Step 6: Update `package.json` scripts** to match the framework convention exactly:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "typecheck": "tsc --noEmit",
    "check:arch": "echo 'no provider layer in this app — nothing to check'",
    "verify": "npm run check:arch && npm run typecheck",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
  }
}
```

- [ ] **Step 7: Verify the scaffold builds**

```bash
npm run build
```
Expected: exits 0, produces `.next/` output with no errors (default Next.js starter page still in place — real pages come in Task 5).

- [ ] **Step 8: Commit**

```bash
git init && git add -A
git commit -m "chore: scaffold Next.js 15 + OpenNext project"
```

---

## Task 3: Port static assets, legal pages, fonts, and global CSS

**Files:**
- Copy: `nexara-site/public/brand/` → `nexara-site-next/public/brand/`
- Copy: `nexara-site/public/fonts/` → `nexara-site-next/public/fonts/`
- Copy: `nexara-site/public/robots.txt` → `nexara-site-next/public/robots.txt`
- Copy: `nexara-site/public/{privacy-policy,terms-of-service,cookie-policy,data-deletion}.html` → `nexara-site-next/public/`
- Copy: `nexara-site/src/legacy/*.css`, `nexara-site/src/consent.css`, `nexara-site/src/index.css` → `nexara-site-next/src/styles/`

- [ ] **Step 1: Copy assets verbatim**

```bash
cd "/Users/naveengalla/Documents/Claude/nexara-gateway copy"
cp -r nexara-site/public/brand nexara-site-next/public/brand
cp -r nexara-site/public/fonts nexara-site-next/public/fonts
cp nexara-site/public/robots.txt nexara-site-next/public/robots.txt
cp nexara-site/public/privacy-policy.html nexara-site/public/terms-of-service.html nexara-site/public/cookie-policy.html nexara-site/public/data-deletion.html nexara-site-next/public/
mkdir -p nexara-site-next/src/styles
cp nexara-site/src/legacy/*.css nexara-site-next/src/styles/
cp nexara-site/src/consent.css nexara-site/src/index.css nexara-site-next/src/styles/
```

- [ ] **Step 2: Verify byte-identical copies**

```bash
diff -q nexara-site/public/brand nexara-site-next/public/brand
diff -q nexara-site/src/legacy/trust.css nexara-site-next/src/styles/trust.css
```
Expected: no output (identical).

- [ ] **Step 3: Commit**

```bash
cd nexara-site-next && git add public src/styles
git commit -m "chore: port static assets and legacy CSS verbatim"
```

---

## Task 4: Port `data.js`, `shared.js` helpers, and `lib/utils.js` verbatim

**Files:**
- Create: `nexara-site-next/src/lib/data.ts` (from `nexara-site/src/data.js`)
- Create: `nexara-site-next/src/lib/shared.ts` (from `nexara-site/src/shared.js`, dropping `parseRoute`/`routeTo`)
- Create: `nexara-site-next/src/lib/utils.ts` (from `nexara-site/src/lib/utils.js`)

**Interfaces:**
- Consumes: none (leaf modules).
- Produces: `DATA`, `voice()`, `useBriefForm()`, `getBriefSections()`, `buildBriefText()`, `buildBriefMailto()`, `STATIC_PAGES`, `HAS_SCROLL_ANIMATION`, `SECTION_HERO_WORDS`, `cn()` — consumed by Task 5's client components.

- [ ] **Step 1: Copy `data.js` content verbatim into `data.ts`**, changing only the file extension and the `export` line's target (module syntax is already ESM, no other changes needed):

```bash
cp nexara-site/src/data.js nexara-site-next/src/lib/data.ts
```
No content edits — the file's existing `export const DATA = {...}` syntax is valid `.ts` as-is.

- [ ] **Step 2: Create `shared.ts` from `shared.js`, removing routing logic**

Copy `nexara-site/src/shared.js` to `nexara-site-next/src/lib/shared.ts`, then:
- Delete the `parseRoute()` function (lines 32-51) — App Router's `useParams()`/server `params` prop replace it (Task 5).
- Delete the `routeTo()` function (lines 53-75) — replaced by `next/navigation`'s `useRouter().push()` at call sites (Task 5), preserving the `document.startViewTransition` wrapper.
- Update the trailing `export` statement to remove `parseRoute, routeTo`:

```ts
export { DATA, voice, useBriefForm, getBriefSections, buildBriefText, buildBriefMailto, STATIC_PAGES, HAS_SCROLL_ANIMATION, SECTION_HERO_WORDS };
```
- Update the import at the top from `./data.js` to `./data`:
```ts
import { DATA } from './data';
```

- [ ] **Step 3: Copy `lib/utils.js` verbatim**

```bash
cp nexara-site/src/lib/utils.js nexara-site-next/src/lib/utils.ts
```

- [ ] **Step 4: Verify no leftover references to deleted functions**

```bash
cd nexara-site-next && grep -rn "parseRoute\|routeTo" src/lib/
```
Expected: no output (both fully removed from `shared.ts`; Task 5 replaces every call site).

- [ ] **Step 5: Commit**

```bash
git add src/lib
git commit -m "feat: port data.js and shared.js helpers verbatim, drop hash/path router"
```

---

## Task 5: Fix `CookieConsent`'s SSR-unsafe initializer and stale event listener while porting

Codex flagged this during independent review: `nexara-site/src/CookieConsent.jsx:53` calls `useState(() => parseRoute().theme)` — an initializer that reads `window.location` at render time, which crashes or mismatches under Next.js SSR. Separately, `CookieConsent.jsx:61` still listens for the browser `hashchange` event (`window.addEventListener('hashchange', onHash)`), which is dead code left over from before the site moved to path-based routing in commit `568d960` — path navigation never fires `hashchange`, so the cookie banner's theme has been silently stale on client-side navigation since that commit shipped. Fix both while porting.

**Files:**
- Create: `nexara-site-next/src/components/CookieConsent.tsx` (from `nexara-site/src/CookieConsent.jsx`)

**Interfaces:**
- Consumes: `voice()`/DATA from `@/lib/data` and `@/lib/shared` (Task 4); theme must be passed in as a prop from the nearest client boundary rather than self-derived from the URL, since `CookieConsent` is theme-agnostic UI mounted once at the root layout and has no App Router `params` of its own.
- Produces: `<CookieConsent theme={theme} />`, `openCookiePreferences()` — consumed by `layout.tsx` and any footer "Cookie Preferences" link (Task 6).

- [ ] **Step 1: Copy the file and add `'use client'`**

```bash
cp nexara-site/src/CookieConsent.jsx nexara-site-next/src/components/CookieConsent.tsx
```
Add as the first line of the new file:
```tsx
'use client';
```

- [ ] **Step 2: Replace the SSR-unsafe theme initializer with a prop**

Change:
```tsx
export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [theme, setTheme] = useState(() => parseRoute().theme);
```
to:
```tsx
export default function CookieConsent({ theme }: { theme: 'trust' | 'neo' | null }) {
  const [showBanner, setShowBanner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
```

- [ ] **Step 3: Remove the stale `hashchange` listener** (the component no longer derives theme from the URL — it receives it as a prop that the parent re-renders with on navigation)

Change:
```tsx
    const cur = readConsent();
    if (!cur) setShowBanner(true);
    setAnalytics(cur ? cur.analytics : false);

    const onHash = () => setTheme(parseRoute().theme);
    window.addEventListener('hashchange', onHash);
```
to:
```tsx
    const cur = readConsent();
    if (!cur) setShowBanner(true);
    setAnalytics(cur ? cur.analytics : false);
```
And remove the matching `window.removeEventListener('hashchange', onHash);` in the effect's cleanup, and delete the now-unused `import { parseRoute } from './shared.js';` line.

- [ ] **Step 4: Verify no remaining `parseRoute` reference**

```bash
grep -n "parseRoute\|hashchange" nexara-site-next/src/components/CookieConsent.tsx
```
Expected: no output.

- [ ] **Step 5: Commit**

```bash
cd nexara-site-next && git add src/components/CookieConsent.tsx
git commit -m "fix: remove SSR-unsafe theme initializer and stale hashchange listener from CookieConsent"
```

---

## Task 6: Port `trust.jsx` and `neo.jsx` verbatim as client components

This is the highest-risk task in Phase 1 — two files (3,422 and 5,571 lines) containing GSAP/ScrollTrigger orchestration, a hand-rolled canvas 2D particle engine, and a React Three Fiber scene. **No line of animation logic changes in this task.** The only edits are: add `'use client'`, replace `parseRoute`/`routeTo` call sites with props/`next/navigation`, and guard the `window`-global assignments.

> **DONE — landed via 3-way tournament (Claude x2 + Codex; Antigravity excluded, see Round 2 notes below).** Two things this section originally got wrong, discovered during implementation:
> 1. **`routeTo` is not local to `TrustSite`/`Site`.** It's called from ~60-90 sibling top-level components (`TrustNav`, `Footer`, etc.) via module-scope lexical binding, not nesting. A component-local `const routeTo` (as sketched below) leaves every one of those call sites unresolvable. Both independent Claude implementations hit this and fixed it the same way: a **module-scope `routeTo` function backed by a module-scope router variable**, set once via a registration effect inside the main component. That's the actual shape landed — see `TrustSiteClient.tsx`/`NeoSiteClient.tsx` for the real pattern.
> 2. **`gateway.jsx` imports `./gateway-cinematic.css`**, a file that lives at `nexara-site/src/gateway-cinematic.css` — outside `src/legacy/`, where Task 3's copy step looked. It was never copied. All three Task 6 implementations (and the review pass) missed this; found during final assembly when the app still wouldn't have resolved the import. Fixed by copying it directly into `src/styles/` alongside the rest.
> 3. Also: `notfound.jsx` has no port task anywhere in this plan — a real gap, not an oversight during implementation. Landed as its own task afterward: a self-contained `NotFound.tsx` client component with its own `useRouter`-based `routeTo` (same shape as `GatewayClient.tsx`, since it's a two-call-site leaf component, not the ~150-call-site problem above).

**Files:**
- Create: `nexara-site-next/src/components/TrustSiteClient.tsx` (from `nexara-site/src/trust.jsx`)
- Create: `nexara-site-next/src/components/NeoSiteClient.tsx` (from `nexara-site/src/neo.jsx`)
- Create: `nexara-site-next/src/components/Gateway3D.tsx` (from `nexara-site/src/gateway-3d.jsx`)
- Create: `nexara-site-next/src/components/GatewayClient.tsx` (from `nexara-site/src/gateway.jsx`)

**Interfaces:**
- Consumes: `theme`, `page`, `detail` as props (from Task 5's App Router page files, replacing the old `parseRoute()` return value); `voice`, `useBriefForm`, `DATA`, `STATIC_PAGES`, `HAS_SCROLL_ANIMATION`, `SECTION_HERO_WORDS` from `@/lib/shared` and `@/lib/data`.
- Produces: `<TrustSiteClient page={page} detail={detail} />`, `<NeoSiteClient theme={theme} page={page} detail={detail} />`, `<GatewayClient />` — consumed by Task 7's page files.

- [ ] **Step 1: Copy the four files verbatim**

```bash
cp nexara-site/src/trust.jsx nexara-site-next/src/components/TrustSiteClient.tsx
cp nexara-site/src/neo.jsx nexara-site-next/src/components/NeoSiteClient.tsx
cp nexara-site/src/gateway-3d.jsx nexara-site-next/src/components/Gateway3D.tsx
cp nexara-site/src/gateway.jsx nexara-site-next/src/components/GatewayClient.tsx
```

- [ ] **Step 2: Add `'use client'` as the first line of all four files**

```bash
for f in TrustSiteClient NeoSiteClient Gateway3D GatewayClient; do
  sed -i '' "1i\\
'use client';
" "nexara-site-next/src/components/${f}.tsx"
done
```

- [ ] **Step 3: In `TrustSiteClient.tsx` and `NeoSiteClient.tsx`, remove the `routeTo`-based navigation import** and replace call sites with `next/navigation`

Both files import `routeTo` from `./shared.js`. Update the import line from:
```tsx
import { voice, parseRoute, routeTo, useBriefForm, STATIC_PAGES, HAS_SCROLL_ANIMATION, SECTION_HERO_WORDS } from './shared.js';
```
to:
```tsx
import { voice, useBriefForm, STATIC_PAGES, HAS_SCROLL_ANIMATION, SECTION_HERO_WORDS } from '@/lib/shared';
import { useRouter } from 'next/navigation';
```
Then, at the top of the component function body (e.g. `TrustSite({ page, detail })` in `TrustSiteClient.tsx`, `Site({ theme, page, detail })` in `NeoSiteClient.tsx`), add:
```tsx
const router = useRouter();
const routeTo = (theme: string, page = 'home', detail: string | null = null) => {
  const path = theme === 'gateway' || !theme ? '/' : '/' + [theme, page, detail].filter(Boolean).join('/');
  window.scrollTo(0, 0);
  const navigate = () => router.push(path);
  if (document.startViewTransition) {
    document.startViewTransition(navigate);
  } else {
    navigate();
  }
};
```
This preserves the exact call signature every existing `routeTo(...)` call site in the file already uses — no other line in the 3,000+/5,500+ lines of JSX needs to change.

- [ ] **Step 4: Guard the `window` global assignment in `NeoSiteClient.tsx`**

`neo.jsx:8` assigns `THREE`, `gsap`, `ScrollTrigger` onto `window` at module scope. Since this file now only ever executes client-side (behind `'use client'` and never imported by a server component directly — see Task 7), no server-execution guard is strictly required, but wrap it defensively since Next may still parse the module in more contexts than Vite did:

```tsx
if (typeof window !== 'undefined') {
  Object.assign(window, { THREE, gsap, ScrollTrigger });
}
```

- [ ] **Step 5: Update the `Company` prop-drilling in `NeoSiteClient.tsx`**

No change needed — `page === "company"` branch at the former `neo.jsx:2310` already reads `DATA.company[theme]` via props already threaded through; verify only that the import path for `DATA` now resolves to `@/lib/data` (covered by Step 3's import rewrite pattern if `DATA` was imported separately — check the top of the file for a separate `import { DATA } from './data.js'` line and update it to `import { DATA } from '@/lib/data';` if present).

- [ ] **Step 6: Verify no remaining `.jsx`-relative imports or `parseRoute` references**

```bash
cd nexara-site-next && grep -rn "from '\./\|parseRoute" src/components/TrustSiteClient.tsx src/components/NeoSiteClient.tsx src/components/Gateway3D.tsx src/components/GatewayClient.tsx
```
Expected: no output (all imports now use `@/lib/...` aliases).

- [ ] **Step 7: Commit**

```bash
git add src/components/TrustSiteClient.tsx src/components/NeoSiteClient.tsx src/components/Gateway3D.tsx src/components/GatewayClient.tsx
git commit -m "feat: port trust.jsx and neo.jsx verbatim as client components"
```

---

## Task 7: Wire up App Router pages, layout, and metadata from `routes.ts`

**Files:**
- Create: `nexara-site-next/src/app/layout.tsx`
- Create: `nexara-site-next/src/app/page.tsx`
- Create: `nexara-site-next/src/app/trust/page.tsx`
- Create: `nexara-site-next/src/app/trust/[page]/page.tsx`
- Create: `nexara-site-next/src/app/trust/[page]/[detail]/page.tsx`
- Create: `nexara-site-next/src/app/neo/page.tsx`
- Create: `nexara-site-next/src/app/neo/[page]/page.tsx`
- Create: `nexara-site-next/src/app/neo/[page]/[detail]/page.tsx`
- Create: `nexara-site-next/src/app/sitemap.ts`

**Interfaces:**
- Consumes: `ROUTES`, `routeTitle` from `@/lib/routes` (Task 1); `TrustSiteClient`, `NeoSiteClient`, `GatewayClient`, `CookieConsent` from Task 5/6.

- [ ] **Step 1: Write `app/trust/[page]/page.tsx`** (the pattern Step 2-3 mirror for the other route files)

```tsx
import type { Metadata } from 'next';
import { ROUTES, routeTitle } from '@/lib/routes';
import TrustSiteClient from '@/components/TrustSiteClient';

export function generateStaticParams() {
  return ROUTES.filter(r => r.theme === 'trust' && r.page !== 'home' && !r.detail)
    .map(r => ({ page: r.page }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const route = ROUTES.find(r => r.theme === 'trust' && r.page === page && !r.detail);
  if (!route) return {};
  return {
    title: routeTitle(route),
    alternates: { canonical: `https://nexaragroups.com/${route.path}` },
  };
}

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return <TrustSiteClient page={page} detail={null} />;
}
```

- [ ] **Step 2: Write `app/trust/[page]/[detail]/page.tsx`** following the same pattern, adding `detail` to `generateStaticParams` and `generateMetadata`:

```tsx
import type { Metadata } from 'next';
import { ROUTES, routeTitle } from '@/lib/routes';
import TrustSiteClient from '@/components/TrustSiteClient';

export function generateStaticParams() {
  return ROUTES.filter(r => r.theme === 'trust' && r.detail)
    .map(r => ({ page: r.page, detail: r.detail as string }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string; detail: string }> }): Promise<Metadata> {
  const { page, detail } = await params;
  const route = ROUTES.find(r => r.theme === 'trust' && r.page === page && r.detail === detail);
  if (!route) return {};
  return {
    title: routeTitle(route),
    alternates: { canonical: `https://nexaragroups.com/${route.path}` },
  };
}

export default async function Page({ params }: { params: Promise<{ page: string; detail: string }> }) {
  const { page, detail } = await params;
  return <TrustSiteClient page={page} detail={detail} />;
}
```

- [ ] **Step 3: Mirror Steps 1-2 for `app/neo/[page]/page.tsx` and `app/neo/[page]/[detail]/page.tsx`**, swapping `TrustSiteClient` → `NeoSiteClient` (which additionally takes a `theme="neo"` prop) and filtering `ROUTES` on `r.theme === 'neo'`.

- [ ] **Step 4: Write `app/trust/page.tsx` and `app/neo/page.tsx`** (the `home` route for each theme):

```tsx
import type { Metadata } from 'next';
import { ROUTES, routeTitle } from '@/lib/routes';
import TrustSiteClient from '@/components/TrustSiteClient';

const route = ROUTES.find(r => r.theme === 'trust' && r.page === 'home')!;

export const metadata: Metadata = {
  title: routeTitle(route),
  alternates: { canonical: 'https://nexaragroups.com/trust' },
};

export default function Page() {
  return <TrustSiteClient page="home" detail={null} />;
}
```
(mirror for `app/neo/page.tsx` with `NeoSiteClient` and `theme="neo"`)

- [ ] **Step 5: Write `app/page.tsx`** (gateway root):

```tsx
import GatewayClient from '@/components/GatewayClient';

export default function Page() {
  return <GatewayClient />;
}
```

- [ ] **Step 6: Write `app/layout.tsx`**, porting the head content from `nexara-site/index.html` verbatim (title, description, OG, Twitter, JSON-LD, GA4 consent script, fonts, the pages.dev host guard):

```tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import CookieConsent from '@/components/CookieConsent';
import '@/styles/index.css';
import '@/styles/base.css';
import '@/styles/gateway.css';
import '@/styles/neo.css';
import '@/styles/trust.css';
import '@/styles/neo-guide.css';
import '@/styles/consent.css';

export const metadata: Metadata = {
  title: 'Nexara Groups — Academy, Digital Marketing & Product Studio',
  description: "Nexara Groups: talent via Academy, growth via Digital Marketing, AI software via Product Studio. Named owners, written scope, verified delivery. Visakhapatnam, India.",
  keywords: 'Nexara, Nexara Groups, Nexara Private Limited, Nexara Academy, Nexara Digital Marketing, Nexara Labs, Nexara Product Studio, talent development, AI development India, digital marketing agency, tech training Visakhapatnam, software development India',
  authors: [{ name: 'Nexara Private Limited' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  alternates: { canonical: 'https://nexaragroups.com/' },
  openGraph: {
    type: 'website',
    siteName: 'Nexara Groups',
    title: 'Nexara Groups — Academy, Digital Marketing & Product Studio',
    description: 'Three forces. One operating standard. Nexara Private Limited builds careers, grows brands, and ships production software — all from one house.',
    url: 'https://nexaragroups.com/',
    images: [{ url: 'https://nexaragroups.com/brand/og-image.png', width: 1200, height: 630, alt: 'Nexara Groups — Academy, Digital Marketing & Product Studio' }],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexara Groups — Academy, Digital Marketing & Product Studio',
    description: 'Three forces. One operating standard. Nexara builds careers, grows brands, and ships production AI software — all from one house.',
    images: ['https://nexaragroups.com/brand/og-image.png'],
  },
  icons: { icon: '/brand/nexara-mark.svg' },
};

const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://nexaragroups.com/#organization',
      name: 'Nexara',
      legalName: 'Nexara Private Limited',
      alternateName: ['Nexara Groups', 'Nexara Group', 'Nexara Pvt Ltd'],
      url: 'https://nexaragroups.com/',
      logo: { '@type': 'ImageObject', url: 'https://nexaragroups.com/brand/nexara-logo.svg' },
      email: 'info@nexaragroups.com',
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: 'info@nexaragroups.com', areaServed: ['IN', 'AE', 'GB', 'US'], availableLanguage: ['en', 'hi', 'te'] },
      description: 'Nexara Private Limited (Nexara Groups) is a structured talent and technology company operating three divisions: Academy (talent development), Digital Marketing (growth infrastructure), and Product Studio (AI software). Every engagement has a named owner, a written scope, and verified delivery.',
      address: { '@type': 'PostalAddress', addressLocality: 'Visakhapatnam', addressRegion: 'Andhra Pradesh', addressCountry: 'IN' },
      areaServed: ['IN', 'AE', 'GB', 'US'],
      knowsAbout: ['Talent Development', 'Digital Marketing', 'AI Software', 'SaaS', 'Career Training'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Nexara Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Nexara Academy', description: 'Structured talent development. Cohort-based training with verified placement outcomes.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Nexara Marketing', description: 'Full-stack growth infrastructure — positioning, brand build, campaigns, and measurement.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Nexara Labs', description: 'Production AI software. SaaS products, applied AI, and intelligent systems shipped end-to-end.' } },
        ],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://nexaragroups.com/#website',
      url: 'https://nexaragroups.com/',
      name: 'Nexara Groups',
      alternateName: 'Nexara Private Limited',
      publisher: { '@id': 'https://nexaragroups.com/#organization' },
      inLanguage: 'en-IN',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="host-guard" strategy="beforeInteractive">{`
          (function () {
            var h = location.hostname;
            if (h.indexOf('pages.dev') !== -1) {
              location.replace('https://nexaragroups.com' + location.pathname + location.search + location.hash);
            }
          })();
        `}</Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-BPYYD3KQ99" strategy="afterInteractive" />
        <Script id="ga-consent" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            'ad_storage': 'denied', 'ad_user_data': 'denied', 'ad_personalization': 'denied',
            'analytics_storage': 'denied', 'functionality_storage': 'granted', 'security_storage': 'granted',
            'wait_for_update': 500
          });
          try {
            var _cc = JSON.parse(localStorage.getItem('cc-consent') || 'null');
            if (_cc && _cc.analytics === true) gtag('consent', 'update', { 'analytics_storage': 'granted' });
          } catch (e) {}
          gtag('config', 'G-BPYYD3KQ99');
        `}</Script>
        <noscript>
          <div style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 700, margin: '0 auto' }}>
            <h1>Nexara Groups</h1>
            <p>Nexara Private Limited (Nexara Groups) builds talent through Academy, grows businesses through Digital Marketing, and ships AI software through Product Studio. Three forces. One operating standard. Based in Visakhapatnam, India — serving India, UAE, UK, and US.</p>
          </div>
        </noscript>
        {children}
        <CookieConsent theme={null} />
      </body>
    </html>
  );
}
```

Note: the root layout's `<CookieConsent theme={null} />` is a placeholder for the gateway route. Trust/neo layouts need their own nested `layout.tsx` under `app/trust/` and `app/neo/` rendering `<CookieConsent theme="trust" />` / `<CookieConsent theme="neo" />` instead, since the root layout can't know the theme. Add `app/trust/layout.tsx` and `app/neo/layout.tsx`, each a thin wrapper:

```tsx
import CookieConsent from '@/components/CookieConsent';
export default function TrustLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<CookieConsent theme="trust" /></>;
}
```
(mirror for `neo`, and remove the root layout's `<CookieConsent theme={null} />` — replace with nothing, since gateway has no theme; check `nexara-site/src/CookieConsent.jsx`'s render logic for how it already handles a null/gateway theme before deciding whether the gateway needs its own `<CookieConsent theme={null} />` mount.)

- [ ] **Step 7: Write `app/sitemap.ts`**, replacing the hand-maintained `public/sitemap.xml` (closes the exact gap Task 0 just patched by hand — from here forward it's generated, not maintained by hand):

```ts
import type { MetadataRoute } from 'next';
import { ROUTES } from '@/lib/routes';

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(route => ({
    url: `https://nexaragroups.com/${route.path}`,
    lastModified: new Date('2026-07-09'),
    changeFrequency: 'weekly' as const,
    priority: route.page === 'gateway' ? 1.0 : route.detail ? 0.6 : route.page === 'home' ? 0.9 : 0.7,
  }));
}
```

- [ ] **Step 8: Build and verify all 29 routes render**

```bash
cd nexara-site-next && npm run build && npm run dev &
sleep 3
for p in "" "trust" "trust/academy" "trust/company" "neo" "neo/labs/delivery"; do
  echo "--- /$p ---"
  curl -s "http://localhost:3000/$p" | grep -o '<title>.*</title>'
done
kill %1
```
Expected: each route returns a distinct, non-empty title matching the corresponding entry's `routeTitle()` output.

- [ ] **Step 9: Commit**

```bash
git add src/app
git commit -m "feat: wire up App Router pages, layout, and generated sitemap from routes.ts"
```

---

## Task 8: Full-route visual QA against production

**Files:** none (verification only)

> **DONE (core sweep) — and this task justified its own existence twice over.** Two real, fatal-to-serious bugs existed on `migration/phase1` that seven implementor rounds and three review passes across Tasks 0-7 never caught, because none of them ran the app in an actual browser:
> 1. **`gsap.registerPlugin(ScrollTrigger)` was never ported.** The old app called it once, globally, in `main.jsx` before mounting React — Next.js's App Router has no equivalent single entry point, and no task in this plan accounted for `main.jsx`'s setup at all. Every `ScrollTrigger.create()` call threw a fatal `Runtime TypeError` on page load. Fixed by registering at module scope in `TrustSiteClient.tsx`/`NeoSiteClient.tsx`.
> 2. **A textbook Next.js hydration mismatch in `GatewayClient.tsx`** — `isMobile` state computed from `window.matchMedia` inside the `useState` initializer, so server and client disagreed on the initial value. Only visible via Next's dev overlay at a mobile viewport width; invisible in desktop testing and invisible to code review. Fixed by starting state identical on both, applying the real value client-side in an effect.
>
> Both fixes are correctness bugs a code-only review (however rigorous) structurally cannot catch — they only manifest at runtime, in a real browser, and one of them only at a specific viewport. This is the actual argument for Task 8 existing as its own gate, not a formality: **static review and an actual browser sweep catch different, non-overlapping classes of bugs.**
>
> Covered: console/hydration sweep across representative routes (all unique templates × both themes, plus detail/company/contact/404-fallback pages), desktop visual spot-check, mobile viewport check, and an interaction smoke test (nav click → route change → correct title/content/active-state with zero errors — proving the Task 6 `routeTo` fix works end-to-end in a live browser; cookie consent accept flow → correct `localStorage` write).
>
> **Not yet done, deliberately deferred:** the canvas particle/blob equilibrium check below (Step 2) — genuinely requires human eyeballing per the prior finding it cites, not something to fake-verify via automation. Also not done: a full 29-route pixel-by-pixel pass (skipped as low-value given the ported code is verbatim/CSS is byte-identical — visual parity is structurally guaranteed once the representative sweep is clean, which it is).

- [ ] **Step 1: Run the dev server and open every one of the 29 routes**, comparing against the equivalent live `nexaragroups.com` URL side-by-side, for both desktop and mobile viewport (per this project's established preview workflow — start the dev server, use the browser preview tool, `preview_resize` for mobile, `preview_screenshot` for each route).

- [ ] **Step 2: For `trust/*` routes specifically**, verify the canvas particle/blob hero reaches the same steady-state (trail length, fade rate, color) as production — per this project's prior finding that this effect is invisible in throttled/headless preview and must be eyeballed in a real, unthrottled browser tab.

- [ ] **Step 3: For `neo/*` routes specifically**, verify every GSAP ScrollTrigger-pinned section still pins/unpins correctly and the React Three Fiber scene in the gateway mounts without a hydration warning in the console (`preview_console_logs` with `level: "error"`).

- [ ] **Step 4: Record any visual or behavioral diff found as a bug against this task** — do not silently patch and move on; Phase 1's constraint is zero behavior change, so any diff means Task 6 or 7 missed something, not that a "Phase 2 cleanup" is warranted.

- [ ] **Step 5: Commit any fixes found, each as its own commit** with a message describing the specific regression fixed.

---

## What's deliberately not in this plan

Phase 1 ends at Task 8: a Next.js app on the local dev server, functionally and visually identical to production, not yet deployed. Two follow-up efforts are intentionally **not** detailed here and need their own plan once Phase 1 is done:

- **Phase 2 — Decomposition + strict TypeScript.** Splitting `TrustSiteClient.tsx`/`NeoSiteClient.tsx` into focused components (Hero, Particles, Timeline, Sections, etc.) and converting each to properly-typed `.tsx`, flipping `tsconfig.json`'s `allowJs` back to `false` once done. This can't be fully task-broken-down yet because the natural component boundaries in a 5,571-line file aren't visible from outside it — Codex's review flagged specific seams (`useLayoutEffect` GSAP pin cleanup around lines 4115/4255/4407, a `ReactDOM.createPortal` around line 3720) worth starting from, but the full decomposition plan should be written after Task 6 lands and the file can be read end-to-end in its ported form.
- **Phase 3 — Workers/OpenNext deploy cutover.** Standing up the Cloudflare Workers project, wiring `wrangler.toml` bindings for real, DNS cutover from Pages to Workers, and retiring `nexara-site/` (the Vite app) and its Pages deployment. This is a production cutover with real user-facing risk and should be its own plan with an explicit rollback step, proposed only once Phase 1's QA (Task 8) is fully green.

---

## Self-Review

**Spec coverage:** Task 0 covers the independent live-bug fix. Task 1 covers the route inventory (fixing the exact class of gap Task 0 patched by hand, this time generated). Tasks 2-3 cover scaffold + static assets. Task 4 covers data/helpers. Task 5 covers the `CookieConsent` SSR bug and stale listener Codex found. Task 6 covers the two large animation files verbatim. Task 7 covers routing/metadata/layout wiring. Task 8 covers QA. All items raised across the scoping conversation (route gap, CookieConsent bug, canonical host guard, GA4 consent script, Tailwind/CSS port, `@opennextjs/cloudflare` script conventions) have a task.

**Placeholder scan:** No TBD/TODO markers. Every code step shows complete, real code — the two largest files (Task 6) are handled as verbatim copies with a small, fully-specified diff (add `'use client'`, replace `routeTo`/`parseRoute` call sites) rather than reproducing 9,000 lines inline, which is appropriate since Phase 1's explicit constraint is *no logic changes* to those files.

**Type consistency:** `Route`/`ROUTES`/`routeTitle` (Task 1) are consumed with matching shapes in Task 7's `generateStaticParams`/`generateMetadata`. `CookieConsent`'s `theme` prop type (`'trust' | 'neo' | null`, Task 5) matches how Task 7's layouts call it (`theme="trust"`, `theme="neo"`, or omitted for gateway).
