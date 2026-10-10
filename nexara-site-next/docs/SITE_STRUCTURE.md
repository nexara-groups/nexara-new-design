# One site, two voices

Neo and Trust are the same site. Structure is shared; only the **voice** (copy) and the **skin** (CSS) differ.

| Layer | Where | Rule |
|-------|-------|------|
| Structure: nav, page flows, footer | `src/lib/site.ts` | Declared once. Never add a page or section to one theme only. |
| Page chrome copy (headings, CTAs) | `src/lib/copy.ts` | Every string is `{ neo, trust }`. |
| Page content (facts, services, clients) | `src/lib/data.ts` | Facts are shared. Wording is `neo` / `trust`. |
| Shared pages and chrome (Home blocks, About, Proof, Blog, nav, footer, client cards) | `src/components/shared/` | One renderer for both themes. Only the two hero background animations are theme-specific. |
| Skin | `src/styles/shared.css` (Trust palette and design language: [`docs/TRUST_DESIGN.md`](TRUST_DESIGN.md)) | Token contract (`--font-*`, `--text-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--nx-*`) set per theme on `.neo` / `.trust`. Don't fork selectors. |

## Voice

- **Neo** is Gen Z: short, casual, a little loud.
- **Trust** is corporate: formal, precise, no slang.
- Both follow the humanize-writing rules: plain "is/has", no stock vocabulary, no em dashes, no invented specifics. Facts never change between voices.
- Trust uses British spelling (optimise, behaviour).

## How the structure stays identical

- `NAV` (Academy, Marketing, Labs, Proof, Blog, About) plus the always-visible `CONTACT_ENTRY` feed both navs, both mobile menus and both footers.
- `HOME_FLOW`, `ABOUT_FLOW` and `PROOF_FLOW` are ordered lists. Each page renders them through one `Record<Block, ...>` shared by both themes, so adding a block fails to compile until it is implemented, and Neo and Trust cannot drift.
- `SiteNav`, `SiteFooter` and `ThemeSwitch` are single components. The switch keeps the visitor on the equivalent page (`/neo/labs` <-> `/trust/labs`).
- Marketing is one scrolling page (`shared/MarketingPage.tsx`), ordered by `MARKETING_FLOW`. Its service lines (`MARKETING_TRACKS`) are in-page anchors (`#presence`, `#visibility`, `#performance`); old `/marketing/<line>` URLs 301 to the anchor in `next.config.mjs`. Content is `DATA.sections.marketing.page` + `subpages`, chrome copy `COPY.marketing`, skin the `--nx-mk-*` tokens.
- Blog posts live in `src/lib/blog.ts`. Neo serves `/blog`, Trust serves `/trust/blog`; Trust canonicalises to the Neo URL.
- **SEO** lives in `src/lib/seo.ts` + `PageSchema` (title, description, canonical, Open Graph, JSON-LD including BreadcrumbList, Service, FAQPage). Do not add a forced “SEO content” band above the footer. Footer stays brand + 2 link columns (`FOOTER_COLUMNS.length === 2`) + Legal.

## Recipes

- **New nav item:** add to `NAV` (and a page). Both themes pick it up.
- **New home section:** add to `HOME_FLOW`, then implement the block once in `shared/Home.tsx` (`BLOCKS` is a `Record<HomeBlock, ...>`, so it will not compile until you do). Wording goes in `COPY` as `{ neo, trust }`.
- **Client shown anywhere:** use `ClientCard` / `ClientGrid` / `ClientStrip` / `ClientBench` in `shared/ClientCard.tsx`, or the Proof `Builds` list in `shared/HomeBlocks.tsx`. Data lives in `DATA.work.live` (typed by `lib/clients.ts`); add `featured: true` for the larger card and `result` only when there is a real, approved outcome.
- **Change wording for one theme only:** edit that theme's side of the `{ neo, trust }` pair.
- **Make a shared page look different per theme:** change the `--nx-*` tokens in `shared.css`. Don't add a theme check to the component.
- **New blog post:** add to `BLOG_POSTS`. Internal links: `@customers`, `/neo/contact` or `/blog/slug`, resolved per theme.

Tests: `tests/site.test.mjs` guards nav parity, flows, footer links, blog routes and voice rules.
