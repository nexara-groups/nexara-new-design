import fs from 'node:fs';
import assert from 'node:assert/strict';
import { getRoutes, getSeo, SITE_URL } from '../src/seo.js';
import { DATA } from '../src/data.js';

const origin = process.argv[2] || SITE_URL;
let stamp = Date.now();
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const routes = getRoutes();
const responseFor = (pathname, redirect = 'follow') => fetch(`${origin}${pathname}${pathname.includes('?') ? '&' : '?'}release-check=${stamp}`, {
  redirect, signal: AbortSignal.timeout(20000), headers: { 'Cache-Control': 'no-cache' },
});

async function verifyRelease() {
  for (let i = 0; i < routes.length; i += 6) {
    await Promise.all(routes.slice(i, i + 6).map(async route => {
      const pathname = '/' + route.path;
      const response = await responseFor(pathname);
      assert.equal(response.status, 200, pathname);
      assert.equal(new URL(response.url).pathname, pathname, `${pathname}: unexpected redirect`);
      const html = await response.text();
      const seo = getSeo(route);
      assert.equal(decode(html.match(/<title>(.*?)<\/title>/)?.[1] || ''), seo.title, pathname);
      assert.equal(html.match(/<link rel="canonical" href="([^"]*)"/)?.[1], seo.canonical, pathname);
      const local = fs.readFileSync(new URL(`../dist/${route.path ? route.path + '.html' : 'index.html'}`, import.meta.url), 'utf8');
      const bundle = local.match(/<script type="module"[^>]*src="([^"]*)"/)?.[1];
      assert.ok(bundle && html.includes(bundle), `${pathname}: stale release bundle`);
      if (route.page === 'gateway' || route.page === 'home') assert.ok(!html.includes('class="local-context"'), pathname);
      if (route.page === 'contact') {
        assert.ok(html.includes(DATA.contact.phone.display), pathname);
        assert.ok(html.includes(DATA.contact.address.street), pathname);
      }
    }));
  }

  for (const slug of ['privacy-policy', 'terms-of-service', 'cookie-policy', 'data-deletion', 'robots.txt', 'sitemap.xml']) {
    assert.equal((await responseFor('/' + slug)).status, 200, slug);
  }
  for (const [alias, target] of [['/trust/', '/trust'], ['/neo/', '/neo'], ['/academy/internships', '/trust/academy/internships']]) {
    const response = await responseFor(alias, 'manual');
    assert.equal(response.status, 301, alias);
    assert.equal(new URL(response.headers.get('location'), origin).pathname, target, alias);
  }
  const missing = await responseFor('/release-check-page-does-not-exist');
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /content="noindex,follow"/);
  console.log(`Live release verified at ${origin}: ${routes.length} routes, current bundles, contact details, legal pages, sitemap, redirects and real 404s.`);

}
// A new Worker version can reach different locations a few seconds apart.
for (let attempt = 1; attempt <= 6; attempt++) {
  stamp = Date.now();
  try { await verifyRelease(); break; }
  catch (error) {
    if (attempt === 6) throw error;
    console.log(`Live release check ${attempt} has not passed yet: ${error.message}. Retrying in 5 seconds.`);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}
