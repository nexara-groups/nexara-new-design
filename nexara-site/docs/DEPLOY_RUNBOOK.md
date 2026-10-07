# Nexara approved-preview release

This runbook publishes the approved React/Vite preview with full prerendered HTML as a one-time release through the existing Cloudflare Worker. The existing main-branch Next.js automation remains unchanged.

- URL: https://nexaragroups.com
- Worker: `nexara-site`
- Route: `nexaragroups.com/*`
- Cloudflare account: `admin@nexaragroups.com`, `ca93de7853e49bb397e5a95ca6c01a03`
- Configuration: `nexara-site/wrangler.json`
- Release branch: `codex/nexara-release-*`

The manual release workflow on the release branch uses the existing `CLOUDFLARE_API_TOKEN` repository secret. It records the preceding Worker deployment before publishing and verifies the live release afterward. A future deploy of the main-branch Next.js workflow can supersede this one-time release.

## Local release with the Admin API token already configured

```sh
npm ci
npm test
npm run build
npm run check:seo
npx --yes wrangler@4.90.0 deploy --config wrangler.json
node scripts/verify-live.mjs
```

Use `CLOUDFLARE_API_TOKEN` for the Admin account. Do not use interactive `wrangler login` or mix tokens with the Happyfarms account.

## Rollback

Use the preceding version ID recorded by the release workflow with `npx --yes wrangler@4.90.0 rollback <version-id> --config wrangler.json`, or select the earlier deployment in the Cloudflare dashboard for `nexara-site`. Verify https://nexaragroups.com after rollback. The previous Next.js/OpenNext source and its main-branch automation remain available.

This release retains the existing Worker route and DNS. Cloudflare Pages is not the production target.
