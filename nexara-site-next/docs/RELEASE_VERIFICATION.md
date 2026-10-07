# Nexara Next.js refinement — 8 October 2026

Source: `nexara-groups/nexara-new-design`, `nexara-site-next`.
Implementation branch: `codex/nexara-next-refinement`.

The existing Next.js App Router, both Trust and Neo presentations, Cloudflare Worker `nexara-site`, domain route and deployment workflow are retained. The older Vite directory is outside this release.

## Changes

- Richer hero lighting and elevated cards using adapted MIT Motion Primitives from 21st.dev, with source and license notices.
- Exact supplied phone and MVP Colony address in contact pages, footers and structured data.
- Typed metadata for all 47 routes; server-rendered service and internship content, canonical consolidation, robots, a 24-URL canonical sitemap, crawlable links and genuine unknown-route 404s. No keyword section on the gateway or either homepage.
- Deferred WebGL/guide loading, bounded canvas resolution and geometry, cached layout measurements, offscreen/background animation suspension and reduced-motion support.
- Deterministic contact brief rendering fixes the Neo contact hydration error.
- Read-only OpenNext static page cache and immutable Next asset headers. Legal `.html` URLs remain literal to avoid Cloudflare extension-removal redirect loops.

## Validation

- `npm run typecheck`: passed.
- `npm test`: 10 passing tests covering animation lifecycle, contact brief generation, routes, canonicals and local business details.
- Next production build: passed, 52 static build entries.
- Full OpenNext build: passed. Cache configuration repackaged using the same successful Next build.
- `node scripts/verify-site.mjs http://127.0.0.1:4275`: passed for all 47 routes, 46 internal links, 24 sitemap URLs, metadata, one H1, contact details, unknown-route 404/noindex, redirects and legal documents on the compiled Worker.
- Chrome layout checks at 320, 390, 768 and 1440 pixels; desktop/mobile heroes, internship pages, forms, footers and menu interaction inspected. Reduced-motion and JavaScript-disabled content checked.
- Final focused browser confirmation: 8 cases, zero failures. Neo contact hydration passed at all four widths. Neo hero ambient rendering measured approximately 11.6 FPS while idle and paused when offscreen.
- Neo initial JavaScript reduced from 426 kB to 252 kB; its WebGL hero remains available through separate loading. These are build measurements, not a field Core Web Vitals claim.
- No package versions or GitHub workflows changed. No ranking guarantees or fabricated reviews/rankings were added.

## Deployment

Deployment completed through the existing `deploy-nexara-site-next.yml` workflow on `main`.

- Application commit: `b07177d6f11b7e53615e552712b9dabf06c31601`.
- Successful deployment: https://github.com/nexara-groups/nexara-new-design/actions/runs/37701669330
- Cloudflare Worker version: `adbb01b4-832f-4bba-8216-ceae268330ce`.
- Live verifier against `https://nexaragroups.com`: all 47 routes, 46 internal links, 24 sitemap URLs and 404/redirect/legal checks passed; pages serve `/_next/` assets.
- Live Chrome confirmation: 8 cases, zero failures, contact hydration correct at all four widths, reduced motion correct, Neo hero idle rendering approximately 11.3 FPS and paused offscreen.
- Local `main` and the existing preview URL on port 4273 now use the updated Next.js application.

Google indexing and rankings depend on subsequent crawling and external signals.
