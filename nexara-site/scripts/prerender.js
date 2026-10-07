import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { getRoutes, getSeo, getStructuredData, SITE_URL, INDEX_ROBOTS } from '../src/seo.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = path.join(root, 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(dist, '.vite/manifest.json'), 'utf8'));
const serverDir = path.join(dist, '.prerender');
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');

function metadata(html, seo, schema) {
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(seo.title)}</title>`);
  for (const [attribute, key, value] of [
    ['name', 'description', seo.description], ['name', 'robots', seo.robots],
    ['name', 'twitter:title', seo.title], ['name', 'twitter:description', seo.description],
    ['property', 'og:title', seo.title], ['property', 'og:description', seo.description], ['property', 'og:url', seo.canonical],
  ]) {
    const tag = `<meta ${attribute}="${key}" content="${escape(value)}" />`;
    const pattern = new RegExp(`<meta ${attribute}="${key}"[^>]*>`);
    html = pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `${tag}\n</head>`);
  }
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${escape(seo.canonical)}" />`);
  const script = `<script id="nexara-schema" type="application/ld+json">${json(schema)}</script>`;
  const pattern = /<script id="nexara-schema" type="application\/ld\+json">[\s\S]*?<\/script>/;
  return pattern.test(html) ? html.replace(pattern, script) : html.replace('</head>', `${script}\n</head>`);
}

function presentationAssets(theme) {
  const key = `src/${theme || 'gateway'}.jsx`;
  const styles = new Set();
  const visited = new Set();
  function collect(entryKey) {
    if (visited.has(entryKey)) return;
    visited.add(entryKey);
    const entry = manifest[entryKey];
    if (!entry) throw new Error(`Missing client manifest entry: ${entryKey}`);
    entry.css?.forEach(css => styles.add(css));
    entry.imports?.forEach(collect);
  }
  collect(key);
  return [...styles].map(css => `<link rel="stylesheet" href="/${css}" />`).join('\n') +
    `\n<link rel="modulepreload" href="/${manifest[key].file}" />`;
}

// Bundle the same React components served to visitors, not a separate crawler page.
process.env.NODE_ENV = 'production';
try {
  await build({
    configFile: false, root, plugins: [react()], logLevel: 'warn',
    ssr: { noExternal: ['gsap'] },
    build: { ssr: 'src/entry-server.jsx', outDir: serverDir, emptyOutDir: true, minify: false,
      rollupOptions: { output: { entryFileNames: 'entry.mjs' } } },
  });
  const { render } = await import(pathToFileURL(path.join(serverDir, 'entry.mjs')));
  const routes = getRoutes();
  for (const route of routes) {
    const seo = getSeo(route);
    let html = metadata(template, seo, getStructuredData(route));
    html = html.replace('</head>', `${presentationAssets(route.theme)}\n</head>`);
    html = html.replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`);
    // Cloudflare serves /trust.html at /trust and redirects the .html alias.
    const file = route.path ? path.join(dist, `${route.path}.html`) : path.join(dist, 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
  }

  const legalPaths = ['privacy-policy', 'terms-of-service', 'cookie-policy', 'data-deletion'];
  for (const slug of legalPaths) {
    const file = path.join(dist, `${slug}.html`);
    let html = fs.readFileSync(file, 'utf8');
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    const description = html.match(/<meta name="description" content="([^"]*)"/)[1];
    const canonical = `${SITE_URL}/${slug}`;
    const schema = getStructuredData({ theme: null, page: 'gateway' });
    Object.assign(schema['@graph'][2], { '@id': `${canonical}#webpage`, url: canonical, name: title, description });
    html = metadata(html, { title, description, canonical, robots: INDEX_ROBOTS }, schema);
    html = html.replace('</head>', `<meta property="og:type" content="website" />\n<meta property="og:site_name" content="Nexara Groups" />\n<meta property="og:image" content="${SITE_URL}/brand/og-image.png" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:image" content="${SITE_URL}/brand/og-image.png" />\n</head>`);
    fs.writeFileSync(file, html);
  }
  const canonicalUrls = [...new Set(routes.map(route => getSeo(route).canonical)), ...legalPaths.map(slug => `${SITE_URL}/${slug}`)];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${canonicalUrls.map(url => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
  const aliases = ['/home /trust 301', '/trust/home /trust 301', '/neo/home /neo 301', '/home/ /trust 301', '/trust/home/ /trust 301', '/neo/home/ /neo 301'];
  for (const route of routes.filter(route => route.theme === 'trust' && route.page !== 'home')) {
    const alias = '/' + [route.page, route.detail].filter(Boolean).join('/');
    aliases.push(`${alias} /${route.path} 301`, `${alias}/ /${route.path} 301`);
  }
  // Keep URLs from the previous directory-index build working after migration.
  for (const route of routes.filter(route => route.path)) aliases.push(`/${route.path}/ /${route.path} 301`);
  fs.writeFileSync(path.join(dist, '_redirects'), aliases.join('\n') + '\n');
  fs.writeFileSync(path.join(dist, '404.html'), `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page not found | Nexara</title><style>body{margin:0;background:#0b1422;color:#eef4ff;font:18px/1.7 system-ui}main{max-width:760px;margin:auto;padding:12vh 24px}h1{font-size:clamp(36px,7vw,64px);line-height:1.1}nav{display:flex;flex-wrap:wrap;gap:24px}a{color:#9fc8ff}</style></head><body><main><p>Nexara · Visakhapatnam</p><h1>Page not found</h1><p>This address does not match a Nexara page. Explore our services or contact our team.</p><nav><a href="/">Home</a><a href="/trust/labs">Software development</a><a href="/trust/marketing/web">Website design</a><a href="/trust/contact">Contact</a></nav></main></body></html>`);
  console.log(`Prerendered ${routes.length} interactive routes and ${legalPaths.length} legal pages; sitemap contains ${canonicalUrls.length} canonical URLs.`);
} finally {
  fs.rmSync(serverDir, { recursive: true, force: true });
}
