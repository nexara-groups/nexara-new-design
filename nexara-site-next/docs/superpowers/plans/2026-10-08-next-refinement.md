# Nexara Next.js refinement implementation plan

**Goal:** Apply the approved premium Trust/Neo design, contact details, local SEO and animation improvements to the existing Next.js website.
**Architecture:** Preserve the migrated App Router and current Cloudflare Worker. Share a typed route/SEO registry and lightweight visual primitives; retain the Neo WebGL hero with bounded rendering work.
**Constraints:** Exact phone 9257535757 and supplied MVP Colony address. No visible SEO block on gateway or homepages. Preserve both visual identities and all existing content. No framework migration or production workflow replacement.

- [x] Expand `src/lib/routes.ts` from actual service data; add `src/lib/seo.ts`, native metadata/JSON-LD, canonical sitemap, robots and real unknown-route 404s. Verify internship pages and canonical consolidation.
- [x] Add shared `ContactDetails`, `FooterContact`, `HeroIntro`, `InternshipOverview`, and typed 21st.dev Motion Primitives Tilt/Spotlight components with license attribution.
- [x] Apply approved elevation and responsive styles; integrate cards, heroes, internship content and crawlable Next links in existing components.
- [x] Defer gateway WebGL until capable pointer/idle; bound geometry and DPR; pause hidden/offscreen work; fix Trust resume/cleanup and Neo reduced-motion/fallback chapter behavior.
- [x] Run typecheck, unit tests, Next production build and OpenNext build. Check representative desktop/mobile/touch/reduced-motion/no-JavaScript routes and all-page HTTP metadata/contact/link/404 coverage.
- [x] Commit only Next.js changes on `codex/nexara-next-refinement`, deploy using the existing Next.js workflow after checks, and verify the live domain still serves Next.js and the new metadata/contact details.
