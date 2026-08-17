# Nexara Gateway — Claude Code Context

## Repo structure

| Directory | What |
|-----------|------|
| `nexara-site-next/` | **Active production site** — Next.js 15, App Router, OpenNext, Cloudflare Workers |
| `nexara-site/` | Old Vite SPA — still on Cloudflare Pages but NOT serving nexaragroups.com |
| `.github/workflows/` | CI — `deploy-nexara-site-next.yml` auto-deploys on push to main |

## Production

- **URL:** https://nexaragroups.com
- **Deployed via:** Cloudflare Worker (`nexara-site`) — NOT Cloudflare Pages
- **Route:** `nexaragroups.com/*`
- **CF Account:** admin@nexaragroups.com — `ca93de7853e49bb397e5a95ca6c01a03`

## Deploy

CI auto-deploys when `nexara-site-next/**` changes on `main`.
For manual local deploy: `export CLOUDFLARE_API_TOKEN=<token> && npm run deploy` from `nexara-site-next/`.
See `nexara-site-next/docs/DEPLOY_RUNBOOK.md` for full details.

**Never use `wrangler login` for deploys** — multiple CF accounts on this machine cause login state to flip. Always use `CLOUDFLARE_API_TOKEN` env var.

## Multiple Cloudflare accounts

- `admin@nexaragroups.com` (ca93de78) — owns nexaragroups.com zone + nexara-site Worker
- `happyfarms@nexaragroups.com` (bc315822) — separate project, separate token

## Key files

- `nexara-site-next/wrangler.toml` — Worker config, has `account_id` set
- `nexara-site-next/src/app/layout.tsx` — root metadata (OG, SEO, Google verification)
- `.github/workflows/deploy-nexara-site-next.yml` — CI deploy workflow (Node 22, uses `CLOUDFLARE_API_TOKEN` secret)

## Dev server

```bash
cd nexara-site-next && npm run dev   # http://localhost:3000
```
