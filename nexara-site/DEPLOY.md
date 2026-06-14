# Nexara Web — Vite + Tailwind + shadcn/ui

Org-standard front-end stack (per `nexara-fullstack-skill`): **Vite + React + Tailwind v4 + shadcn/ui**.
This is the migrated app — the full Trust + Neo site running as ES modules through Vite (no more in-browser Babel).

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
npm run preview  # serve the production build
```

## Deploy to Cloudflare Pages
Connect the repo (Workers & Pages → Create → Pages → connect to Git), then:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION=20` |

`public/_redirects` (`/* /index.html 200`) handles the hash-router SPA fallback.

## What's migrated (stage 2 done)
- Whole app converted from shared-global-scope `<script type="text/babel">` files to **ES modules**:
  `shared.js`, `neo.jsx`, `trust.jsx`, `app.jsx` now use real `import`/`export`.
- React / GSAP / Three are npm deps (bundled), no CDN runtime, no in-browser Babel.
- Existing `styles/*.css` imported as `src/legacy/*.css` — pages render identically to the prototype.
- shadcn tokens wired to Nexara brand (`--primary: #1A6DFF`; dark = steel `#081726`); `Button` component in `src/components/ui/`.
- All routes verified rendering via SSR smoke test (home, academy, marketing, product studio, customers, company, contact, gateway, neo).
- Build is chunk-split (react / gsap / three separate for caching).

## Next (stage 3 — incremental, optional)
1. **DONE — Neo theme is lazy-loaded**; Trust pages no longer ship Three.js (~666 kB).
2. Replace hand-rolled card/badge/accordion CSS with real **shadcn components** + Tailwind tokens, section by section.
3. Re-enable the cinematic scroll hero (`HAS_SCROLL_ANIMATION` is currently `false` in `shared.js` for a stable first port).
4. Add `npx shadcn@latest add ...` / 21st.dev components as needed (now natively supported).
