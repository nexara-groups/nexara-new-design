import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
// Structure tests: Neo and Trust must stay one site with two voices.
const moduleOf = source => import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const read = file => fs.readFileSync(new URL('../src/' + file, import.meta.url), 'utf8');
const { DATA } = await moduleOf(read('lib/data.ts'));
const site = await moduleOf(read('lib/site.ts').replace("import { DATA } from './data';", 'const DATA = ' + JSON.stringify(DATA) + ';'));
const copy = await moduleOf(read('lib/copy.ts'));
const seo = await moduleOf(read('lib/seo.ts').replace("import { DATA } from './data';", 'const DATA = ' + JSON.stringify(DATA) + ';').replace(/import \{ BLOG_POSTS[^\n]*\n/, "const BLOG_POSTS = [], BLOG_DESCRIPTION = '';\n"));

test('nav is one list: every entry is voiced for both themes and Blog, About and Contact are always present', () => {
  const pages = site.NAV.map(e => e.page);
  for (const page of ['academy', 'marketing', 'labs', 'customers', 'blog', 'company']) assert.ok(pages.includes(page), page);
  for (const e of [...site.NAV, site.CONTACT_ENTRY]) for (const theme of ['neo', 'trust']) { assert.ok(e.label[theme], e.page + ' label ' + theme); assert.ok(e.blurb[theme], e.page + ' blurb ' + theme); }
  assert.equal(site.CONTACT_ENTRY.page, 'contact');
  assert.equal(site.CONTACT_ENTRY.label.neo, site.CONTACT_ENTRY.label.trust);
});

test('page flows are fixed lists shared by both themes', () => {
  assert.deepEqual([...site.HOME_FLOW], ['hero', 'divisions', 'manifesto', 'work', 'capabilities', 'standards', 'insights', 'faqs', 'cta']);
  assert.ok(site.ABOUT_FLOW.includes('people') && site.ABOUT_FLOW.includes('facts') && site.ABOUT_FLOW.includes('faqs'));
  assert.deepEqual([...site.PROOF_FLOW], ['hero', 'builds', 'cta']);
});

test('footer links resolve to real pages in both themes', () => {
  // CSS footer grid is brand + FOOTER_COLUMNS + Legal. More than 2 columns breaks the row.
  assert.equal(site.FOOTER_COLUMNS.length, 2, 'footer stays a 4-slot grid: brand, 2 link cols, legal');
  for (const col of site.FOOTER_COLUMNS) for (const link of col.links) for (const theme of ['neo', 'trust']) {
    assert.ok(link.label[theme], link.page);
    if (link.page === 'blog') continue;
    assert.equal(seo.getSeo({ theme, page: link.page, detail: link.detail ?? null }).valid, true, theme + '/' + link.page);
  }
});

test('blog is shared content: /blog for Neo, /trust/blog for Trust', () => {
  assert.equal(seo.routePath('neo', 'blog'), '/blog');
  assert.equal(seo.routePath('trust', 'blog'), '/trust/blog');
  assert.equal(seo.routePath('trust', 'blog', 'a-post'), '/trust/blog/a-post');
  assert.equal(seo.routePath('neo', 'blog', 'a-post'), '/blog/a-post');
});

test('every voiced copy entry has both voices and neither contains an em dash', () => {
  const seen = [];
  (function walk(o, path) {
    if (!o || typeof o !== 'object') return;
    if (typeof o.neo === 'string' && typeof o.trust === 'string') { seen.push([path, o.neo, o.trust]); return; }
    for (const [k, v] of Object.entries(o)) walk(v, path + '.' + k);
  })({ copy: copy.COPY, std: copy.OPERATING_STANDARD, about: DATA.company.about, nav: site.NAV }, 'root');
  assert.ok(seen.length > 40);
  for (const [path, neo, trust] of seen) { assert.ok(neo.trim() && trust.trim(), path); assert.ok(!/—/.test(neo + trust), 'em dash in ' + path); }
});

test('About facts are shared: both themes use the same legal and milestone data', () => {
  assert.ok(DATA.company.about.milestones.length >= 4);
  for (const theme of ['neo', 'trust']) {
    assert.ok(DATA.company[theme].facts.length >= 4, theme + ' facts');
    assert.ok(DATA.company[theme].standards.length >= 4, theme + ' standards');
    assert.ok(DATA.company[theme].principles.length >= 4, theme + ' principles');
    for (const key of ['hero', 'story', 'steps', 'example']) assert.ok(DATA.company.about[key][theme], key + ' ' + theme);
  }
});

test('home renders one shared component per block; only the hero differs by theme', () => {
  const home = read('components/shared/Home.tsx');
  for (const block of site.HOME_FLOW) assert.ok(new RegExp('\\b' + block + ':').test(home), 'block ' + block);
  assert.ok(!/neo\/(Cards|Home)|trust\/(Cards|Home)/.test(home));
  assert.equal(site.HOME_FLOW[1], 'divisions', 'what-we-do rail sits straight after the hero');
  assert.equal(site.HOME_FLOW[3], 'work', 'spotlight proof follows the manifesto');
  assert.equal(site.HOME_FLOW[4], 'capabilities', 'capabilities strip follows the spotlight');
  assert.ok(site.PROOF_FLOW.includes('builds'), 'full builds write-ups live on Proof');
});

test('client cards: every client has a logo on disk, a live link and a division; no invented results', () => {
  const live = DATA.work.live;
  assert.ok(live.length >= 5);
  for (const c of live) {
    assert.ok(fs.existsSync(new URL('../public' + c.logo, import.meta.url)), 'logo ' + c.logo);
    assert.match(c.url, /^https:\/\//);
    assert.ok(c.line && c.scope.length && c.built.length, c.name);
    assert.ok(c.story?.neo && c.story?.trust, 'story ' + c.name);
    assert.ok(Array.isArray(c.teams) && c.teams.length, 'teams ' + c.name);
    for (const team of c.teams) assert.ok(['marketing', 'labs'].includes(team), c.name + ' team ' + team);
  }
  assert.ok(live.filter((c) => c.featured).length >= 1 && live.filter((c) => c.featured).length <= 2);
  for (const key of ['stripLabel', 'live', 'divisions', 'bench']) for (const theme of ['neo', 'trust']) assert.ok(copy.COPY.clients[key][theme], key + theme);
});

test('theme switch keeps the visitor on the equivalent page', () => {
  for (const [page, detail] of [['home', null], ['labs', null], ['academy', 'internships'], ['customers', 'labs'], ['company', null], ['blog', 'a-post']]) {
    const neo = seo.routePath('neo', page, detail), trust = seo.routePath('trust', page, detail);
    if (page === 'blog') assert.equal(trust, '/trust' + neo); else if (page === 'home') { assert.equal(neo, '/'); assert.equal(trust, '/trust'); } else assert.equal(trust, neo.replace('/neo/', '/trust/'));
  }
});

test('both themes mount the same nav and footer components', () => {
  for (const file of ['components/NeoSiteClient.tsx', 'components/TrustSiteClient.tsx', 'components/BlogShell.tsx']) {
    const src = read(file);
    assert.ok(src.includes('SiteNav') && src.includes('SiteFooter'), file);
  }
});

test('labs overview is one mapped flow: modules, stack, subpages, layers, packages and proof all resolve', () => {
  const labs = DATA.sections.labs;
  assert.ok(site.LABS_FLOW.length > 0);
  const layerIds = labs.layers.map(l => l.id);
  const stackTitles = labs.stackDetails.map(d => d.title);
  for (const d of labs.stackDetails) assert.ok(layerIds.includes(d.layer), d.title + ' layer ' + d.layer);
  for (const m of labs.modules) {
    assert.ok(stackTitles.includes(m.stack), m.id + ' stack ' + m.stack);
    assert.ok(labs.subpages.some(p => p.slug === m.subpage), m.id + ' subpage ' + m.subpage);
    for (const l of m.layers) assert.ok(layerIds.includes(l), m.id + ' layer ' + l);
    assert.ok(m.problem.neo && m.problem.trust, m.id + ' problem voiced');
  }
  for (const p of labs.process) for (const o of p.outputs) assert.ok(stackTitles.includes(o), p.step + ' output ' + o);
  for (const a of labs.audiences) assert.ok(labs.packages.some(k => k.name === a.package), a.id + ' package ' + a.package);
  for (const p of labs.proofMap) {
    const client = DATA.work.live.find(c => c.name === p.client);
    assert.ok(client && client.teams.includes('labs'), p.client + ' is a live labs client');
    assert.ok(labs.modules.some(m => m.id === p.module), p.client + ' module ' + p.module);
    for (const l of p.layers) assert.ok(layerIds.includes(l), p.client + ' layer ' + l);
  }
  assert.ok(site.LABS_FLOW.includes('specialisms') && site.LABS_FLOW.includes('products'));
  assert.ok(!labs.proofMap.some(p => p.client === 'Nexara Voice'));
  const productIds = labs.products.map(p => p.id);
  for (const s of labs.specialisms) for (const link of s.links) {
    if (link.kind === 'proof') assert.ok(labs.proofMap.some(p => p.client === link.id), s.id + ' proof ' + link.id);
    else assert.ok(productIds.includes(link.id), s.id + ' product ' + link.id);
  }
  for (const p of labs.products) {
    assert.ok(/^https?:\/\//.test(p.url), p.id);
    assert.ok(p.status === 'live' || p.status === 'demo', p.id);
    assert.ok(labs.modules.some(m => m.id === p.module), p.id + ' module');
    for (const l of p.layers) assert.ok(layerIds.includes(l), p.id + ' layer ' + l);
  }
  assert.equal(labs.products.find(p => p.id === 'grow').status, 'demo');
  const banned = /—|₹|crore|\bCr\b/;
  for (const s of labs.specialisms) for (const theme of ['neo', 'trust']) assert.ok(!banned.test(s.title[theme] + s.line[theme]), s.id);
  for (const p of labs.products) for (const theme of ['neo', 'trust']) assert.ok(!banned.test(p.line[theme]), p.id);
  for (const block of site.LABS_FLOW) if (copy.COPY.labs[block]) for (const theme of ['neo', 'trust']) for (const v of Object.values(copy.COPY.labs[block])) assert.ok(!String(v[theme]).includes('—'), block + ' em dash');
});

test('marketing page: one shared renderer, every block and line voiced for both themes, no AI guarantees', () => {
  const page = DATA.sections.marketing.page, m = DATA.sections.marketing;
  const src = read('components/shared/MarketingPage.tsx');
  for (const block of site.MARKETING_FLOW) assert.ok(new RegExp('\\b' + block + ':').test(src), 'block ' + block);
  assert.ok(!/theme === ['"](neo|trust)['"]/.test(src), 'no theme checks in the renderer');
  for (const file of ['components/NeoSiteClient.tsx', 'components/TrustSiteClient.tsx']) assert.ok(read(file).includes('<MarketingPage'), file);
  assert.deepEqual(m.subpages.map(p => p.slug), [...site.MARKETING_TRACKS]);
  assert.equal(page.phases.length, page.record.length);
  for (const p of page.phases) assert.ok(site.MARKETING_TRACKS.includes(p.track), p.track);
  assert.equal(page.starts.length, site.MARKETING_TRACKS.length);
  assert.equal(page.faqsNeo.length, m.faqs.length);
  const seen = [];
  (function walk(o, path) {
    if (!o || typeof o !== 'object') return;
    if (typeof o.neo === 'string' && typeof o.trust === 'string') { seen.push([path, o.neo, o.trust]); return; }
    if (Array.isArray(o.neo) && Array.isArray(o.trust)) { seen.push([path, o.neo.join(' '), o.trust.join(' ')]); return; }
    for (const [k, v] of Object.entries(o)) walk(v, path + '.' + k);
  })({ page, subpages: m.subpages, copy: copy.COPY.marketing }, 'marketing');
  assert.ok(seen.length > 40);
  const all = [...seen.flatMap(([, n, t]) => [n, t]), ...page.faqsNeo.flat(), ...m.faqs.flat()];
  for (const [path, neo, trust] of seen) assert.ok(neo.trim() && trust.trim(), path);
  for (const text of all) {
    assert.ok(!/—/.test(text), 'em dash: ' + text);
    if (/ChatGPT|Gemini/.test(text) && !text.trim().endsWith('?')) assert.ok(/not|n't|never|no |nobody|cannot/i.test(text), 'AI mention needs its disclaimer: ' + text);
  }
});
