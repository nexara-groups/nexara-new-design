import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { getRoutes, getSeo, getStructuredData, SITE_URL } from '../src/seo.js';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const routes = getRoutes();
const legal = ['privacy-policy', 'terms-of-service', 'cookie-policy', 'data-deletion'];
const knownPaths = new Set(['/', ...routes.filter(route => route.path).map(route => '/' + route.path), ...legal.map(slug => '/' + slug)]);
const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const linksByPage = new Map();
for (const route of routes) {
  const html = fs.readFileSync(path.join(dist, route.path ? `${route.path}.html` : 'index.html'), 'utf8');
  const seo = getSeo(route);
  const body = html.split('<body>')[1];
  assert.ok(body && !body.includes('<noscript>'), `${route.path}: missing prerendered body`);
  assert.match(body, /<h1(?:\s|>)/);
  if (route.page === 'academy' && route.detail === 'internships') {
    assert.match(decode(body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]), /Software internships in Vizag & Visakhapatnam/);
    assert.ok(body.includes('internship-overview') && body.includes('Completion reports'));
  }
  if (route.page === 'gateway' || route.page === 'home') {
    assert.ok(!body.includes('class="local-context"'), `${route.path}: unexpected homepage SEO section`);
  } else {
    assert.ok(body.includes(decode(seo.heading).replace(/&/g, '&amp;')), `${route.path}: missing visible local heading`);
  }
  assert.equal(decode(html.match(/<title>(.*?)<\/title>/)[1]), seo.title);
  assert.equal(decode(html.match(/<meta name="description" content="([^"]*)"/)[1]), seo.description);
  assert.equal(html.match(/rel="canonical"/g)?.length, 1);
  assert.equal(html.match(/<link rel="canonical" href="([^"]*)"/)[1], seo.canonical);
  assert.equal(html.match(/application\/ld\+json/g)?.length, 1);
  const schema = JSON.parse(html.match(/<script id="nexara-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(schema, getStructuredData(route));
  assert.equal(decode(html.match(/<meta property="og:url" content="([^"]*)"/)[1]), seo.canonical);
  assert.ok(!body.includes('[object Object]') && !body.includes('undefined'), `${route.path}: invalid content`);
  const links = [...body.matchAll(/href="(\/[^"#?]*)"/g)].map(match => match[1]);
  linksByPage.set('/' + route.path, links.filter(link => knownPaths.has(link)));
  for (const link of links) {
    if (link.startsWith('/brand/') || link.startsWith('/assets/')) assert.ok(fs.existsSync(path.join(dist, link)), `missing asset ${link}`);
    else assert.ok(knownPaths.has(link) || ['/neo/home', '/trust/home'].includes(link), `${route.path}: broken internal link ${link}`);
  }
  assert.match(html, /<link rel="stylesheet" href="\/assets\/(?:trust|neo|gateway)-/);
}
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decode(match[1]));
const expected = [...new Set(routes.map(route => getSeo(route).canonical)), ...legal.map(slug => SITE_URL + '/' + slug)];
assert.deepEqual(urls, expected);
// All canonical app pages must be reachable by ordinary anchors from the gateway.
const reachable = new Set();
const pending = ['/'];
while (pending.length) {
  const current = pending.pop();
  if (reachable.has(current)) continue;
  reachable.add(current);
  pending.push(...(linksByPage.get(current) || []).filter(link => !reachable.has(link)));
}
for (const url of urls) {
  assert.ok(reachable.has(url.slice(SITE_URL.length)), `not reachable from gateway: ${url}`);
  const file = path.join(dist, url === SITE_URL + '/' ? 'index.html' : url.slice(SITE_URL.length + 1) + '.html');
  assert.ok(fs.existsSync(file), `sitemap destination missing: ${url}`);
}
for (const slug of legal) {
  const html = fs.readFileSync(path.join(dist, `${slug}.html`), 'utf8');
  assert.equal(html.match(/rel="canonical"/g)?.length, 1);
  assert.ok(html.includes(`href="${SITE_URL}/${slug}"`));
  assert.ok(html.includes('name="robots" content="index, follow'));
  JSON.parse(html.match(/<script id="nexara-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
}
const redirects = fs.readFileSync(path.join(dist, '_redirects'), 'utf8');
assert.ok(!redirects.includes('200'));
for (const route of routes.filter(route => route.path)) assert.ok(redirects.includes(`/${route.path}/ /${route.path} 301`), `missing legacy slash redirect: ${route.path}`);
assert.match(fs.readFileSync(path.join(dist, '404.html'), 'utf8'), /content="noindex,follow"/);
console.log(`SEO verification passed: ${routes.length} prerendered routes, ${legal.length} legal pages, ${urls.length} reachable canonical URLs, metadata, schema, assets and links.`);
