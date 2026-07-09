# Nexara Site — Workers Deploy Runbook (Phase 3)

This is the runbook for the one-time cutover from the current live site
(`nexara-site/`, a Vite SPA on Cloudflare Pages) to this Next.js app
(`nexara-site-next/`, deployed to Cloudflare Workers via OpenNext).

**Status as of this writing:** local build verified only. `npm run build` and
`npx opennextjs-cloudflare build` both succeed, producing `.open-next/worker.js`.
Nothing below has been executed against the real Cloudflare account — every
step here is a plan, not a completed action. This is intentionally the one
part of the whole migration that requires your explicit go-ahead per step,
since it's the part that touches the live, production-serving site.

## Prerequisites (do once, before the first deploy)

1. Confirm you're logged into the correct Cloudflare account: `npx wrangler whoami`.
2. Confirm `nexaragroups.com` is the zone `wrangler` will act against — it must
   already be a Cloudflare-managed zone (it is, per the existing Pages setup).
3. Set the required secrets via `wrangler secret put <NAME>` if any are
   introduced later (none are required today — this app has no server-side
   API keys; GA4 uses a public measurement ID already inlined in `layout.tsx`).

## Deploy steps (first deploy — creates the Worker, does NOT yet route traffic)

```bash
cd nexara-site-next
npm run deploy   # = opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

This creates/updates the Worker named `nexara-site` (per `wrangler.toml`) and
gives it a `*.workers.dev` preview URL. **At this point nothing on
`nexaragroups.com` has changed** — the Pages deployment is still serving live
traffic. Verify the Worker on its `workers.dev` URL first:

- [ ] Visit the `workers.dev` URL, confirm the gateway page loads with real
      content (not a blank shell).
- [ ] Spot-check `/trust/labs/ai-automation`, `/neo/contact`, `/trust/company`
      — confirm titles, content, and the cookie consent banner all work.
- [ ] Check `view-source:` on at least one page — confirm real HTML ships
      (this was the entire point of the migration; don't skip this check).
- [ ] Test navigation by clicking through nav links — confirm no console
      errors, confirm the URL updates via client-side routing.
- [ ] Resize to mobile, confirm no hydration-mismatch overlay appears.

## DNS/routing cutover (the actual production-affecting step)

Only after every item above is checked:

1. In the Cloudflare dashboard, add a Worker Route for `nexaragroups.com/*`
   (and `www.nexaragroups.com/*` if that's separately routed today) pointing
   at the `nexara-site` Worker.
2. Cloudflare Workers Routes take priority over Pages for a matching zone —
   confirm this is actually true for your account's routing precedence before
   relying on it; if unsure, test on a non-production hostname first (e.g. a
   temporary subdomain) rather than assuming.
3. Watch real traffic for 15-30 minutes: Cloudflare dashboard analytics for
   the zone, plus a manual reload of the live site from a few different
   devices/networks (cache can make a broken cutover look fine from one
   browser that's still serving a cached Pages response).

## Rollback (if the cutover breaks something)

Rollback is fast and low-risk **because the Pages deployment is not being
deleted** — it keeps serving whatever the Worker Route isn't intercepting.

1. Remove (or disable) the Worker Route for `nexaragroups.com/*` in the
   Cloudflare dashboard. Traffic falls back to Pages immediately — this is a
   DNS/routing-layer change, not a deploy, so it takes effect in seconds, not
   minutes.
2. Confirm the live site is back to the pre-cutover Vite behavior.
3. Diagnose the failure against the Worker's `workers.dev` URL (still live,
   still serving the broken build) without any further production risk.
4. Do not delete the `nexara-site` Worker or its DNS route configuration —
   keep it around for the next attempt once the issue is fixed.

## Retiring the old Pages deployment (only after the cutover has been stable for a while)

Not part of this initial cutover. Once the Workers deployment has been the
sole production path for a comfortable period (your call on how long —
suggest at least a few days of normal traffic with no incidents), the
`nexara-site/` Vite app and its Cloudflare Pages project can be retired. This
is a separate, later decision — don't bundle it with the cutover itself.
