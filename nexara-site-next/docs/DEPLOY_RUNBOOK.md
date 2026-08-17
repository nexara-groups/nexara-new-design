# Nexara Site — Deploy Runbook

**Status:** Live on production. Workers deployment active at `nexaragroups.com`.

## Architecture

- **Framework:** Next.js 15 (App Router) + OpenNext + Cloudflare Workers
- **Adapter:** `@opennextjs/cloudflare`
- **Worker name:** `nexara-site`
- **Route:** `nexaragroups.com/*` (zone: nexaragroups.com)
- **Account:** Admin@nexaragroups.com — ID `ca93de7853e49bb397e5a95ca6c01a03`
- **Repo:** `nexara-groups/nexara-new-design` (main branch)

## Cloudflare accounts

| Account | Email | Account ID | Used for |
|---------|-------|------------|----------|
| Admin | admin@nexaragroups.com | ca93de7853e49bb397e5a95ca6c01a03 | nexaragroups.com Workers deploy |
| Happyfarms | happyfarms@nexaragroups.com | bc315822fef663a34f49c755aea6303f | separate project (happy-farms Worker) |

**Never mix tokens across accounts.**

## Deploy — CI (automatic)

Push to `main` with changes under `nexara-site-next/**` triggers
`.github/workflows/deploy-nexara-site-next.yml` automatically.

Required GitHub secret: `CLOUDFLARE_API_TOKEN` (scoped to Admin account, set on this repo only).

## Deploy — local

```bash
export CLOUDFLARE_API_TOKEN=<admin-account-token>
cd nexara-site-next
npm run deploy
```

Do NOT use `wrangler login` / `wrangler logout` — interactive OAuth login is
unstable when multiple CF accounts exist on the same machine. Always use
`CLOUDFLARE_API_TOKEN` env var instead.

## Creating/rotating the API token

1. Log into https://dash.cloudflare.com as `admin@nexaragroups.com`
2. Profile → API Tokens → Create Token
3. Template: **Edit Cloudflare Workers**
4. Account: Admin@nexaragroups.com's Account
5. Copy token — shown once
6. Update GitHub secret: `gh secret set CLOUDFLARE_API_TOKEN --repo nexara-groups/nexara-new-design`
7. Update local env as needed

## Rollback

Remove the Worker Route `nexaragroups.com/*` in the Cloudflare dashboard.
Traffic falls back to the Pages project (old Vite site) immediately.
The Worker itself stays intact for re-routing once fixed.
