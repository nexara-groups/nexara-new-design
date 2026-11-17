import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
// Blog links are typed by hand, so check every internal link resolves to a real route.
const moduleOf = source => import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const read = file => fs.readFileSync(new URL('../src/' + file, import.meta.url), 'utf8');
const { DATA, GOOGLE_ENTITY_URL, GOOGLE_KGMID, OFFICE_ADDRESS } = await moduleOf(read('lib/data.ts'));
const seo = await moduleOf(read('lib/seo.ts').replace("import { DATA, GOOGLE_ENTITY_URL, GOOGLE_KGMID } from './data';", 'const DATA = ' + JSON.stringify(DATA) + '; const GOOGLE_ENTITY_URL = ' + JSON.stringify(GOOGLE_ENTITY_URL) + '; const GOOGLE_KGMID = ' + JSON.stringify(GOOGLE_KGMID) + ';').replace(/import \{ BLOG_POSTS[^\n]*\n/, "const BLOG_POSTS = [], BLOG_DESCRIPTION = '';\n"));
const { BLOG_POSTS, RELATED_POSTS } = await moduleOf(read('lib/blog.ts').replace("import { OFFICE_ADDRESS } from './data';", 'const OFFICE_ADDRESS = ' + JSON.stringify(OFFICE_ADDRESS) + ';'));

test('every internal link in every blog post resolves to a real route', () => {
  const valid = new Set(['/', '/blog', ...seo.getRoutes().map(r => '/' + r.path), ...BLOG_POSTS.map(p => '/blog/' + p.slug)]);
  const broken = [];
  let checked = 0;
  for (const post of BLOG_POSTS) {
    const texts = post.body.flatMap(b => b.type === 'ul' ? b.items : [b.text]);
    for (const text of texts) for (const m of text.matchAll(/\]\((\/[^)\s]*)\)/g)) {
      checked++;
      const path = m[1].split(/[?#]/)[0].replace(/(.)\/$/, '$1');
      if (!valid.has(path)) broken.push(`${post.slug}: ${m[1]}`);
    }
  }
  assert.ok(checked > 20, 'links were found');
  assert.deepEqual(broken, []);
});

test('every slug in the service-page article mapping is a real post', () => {
  const slugs = new Set(BLOG_POSTS.map(p => p.slug));
  assert.deepEqual(Object.keys(RELATED_POSTS).sort(), ['academy', 'company', 'labs', 'marketing']);
  for (const [page, list] of Object.entries(RELATED_POSTS)) {
    assert.ok(list.length > 0, page);
    for (const slug of list) assert.ok(slugs.has(slug), `${page}: ${slug}`);
  }
});

test('every new article is linked from a service page', () => {
  const mapped = new Set(Object.values(RELATED_POSTS).flat());
  for (const slug of ['what-is-nexara', 'how-to-choose-a-software-company-in-vizag', 'digital-marketing-in-vizag-where-to-start', 'website-development-cost-in-visakhapatnam', 'software-training-in-visakhapatnam-how-to-judge', 'local-seo-in-vizag-google-maps']) assert.ok(mapped.has(slug), slug);
});

test('related-article label is voiced for both themes', () => {
  assert.ok(/related:\s*\{\s*title:\s*v\('[^']+', '[^']+'\)/.test(read('lib/copy.ts')));
});
