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
  for (const page of ['home', 'academy', 'marketing', 'labs', 'customers', 'blog', 'company']) assert.ok(pages.includes(page), page);
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

test('footer: every nav page is linked once, with the nav label for that same page', () => {
  const links = site.FOOTER_COLUMNS.flatMap(col => col.links);
  for (const entry of [...site.NAV, site.CONTACT_ENTRY]) {
    const matches = links.filter(l => l.page === entry.page && !l.detail && !l.anchor);
    assert.equal(matches.length, 1, 'footer links ' + entry.page + ' exactly once');
    assert.deepEqual(matches[0].label, entry.label, 'footer label for ' + entry.page);
  }
});

test('page finder: every page mounts the one shared bottom bar', () => {
  for (const file of ['Home', 'AcademyPage', 'MarketingPage', 'LabsPage', 'Proof', 'About', 'ContactPage', 'Blog']) {
    const src = read('components/shared/' + file + '.tsx');
    assert.ok(src.includes('<PageFinder'), file + ' mounts PageFinder');
    assert.ok(!/className=\{?[`'"]nx-(mk|lab)-finder/.test(src), file + ' has no page-local finder');
  }
  assert.equal((read('components/shared/Blog.tsx').match(/<PageFinder/g) || []).length, 2, 'blog index and post');
});

test('page finder: every section id has a label in both voices', () => {
  for (const [page, ids] of Object.entries(site.PAGE_FINDER)) {
    const labels = copy.COPY.finder[page];
    assert.ok(labels && labels.label.neo && labels.label.trust, page + ' aria label');
    for (const id of ids) for (const theme of ['neo', 'trust']) assert.ok(labels[id]?.[theme], page + '.' + id + ' ' + theme);
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

test('home is one shared renderer: every HOME_FLOW block; hero animations stay theme-specific', () => {
  const home = read('components/shared/Home.tsx');
  for (const block of site.HOME_FLOW) assert.ok(new RegExp('\\b' + block + ':').test(home), 'block ' + block);
  assert.ok(home.includes('NeoHeroUnravel') && home.includes('TrustHeroUnravel'), 'animated heroes retained');
  assert.ok(!home.includes('RouteCard') && !copy.COPY.home.route, 'no brief-routing card on home');
  assert.equal(site.HOME_FLOW[1], 'divisions', 'what-we-do rail sits straight after the hero');
  assert.equal(site.HOME_FLOW[3], 'work', 'spotlight proof follows the manifesto');
  assert.equal(site.HOME_FLOW[4], 'capabilities', 'capabilities strip follows the spotlight');
  assert.ok(site.PROOF_FLOW.includes('builds'), 'full builds write-ups live on Proof');
});

test('blog Field views use start rows on the index and a reading column on the post', () => {
  const src = read('components/shared/Blog.tsx');
  assert.ok(src.includes('className="nx-bl"'));
  assert.ok(src.includes('nx-bl-start') && src.includes('nx-bl-article') && src.includes('nx-bl-ask-card'));
  assert.ok(!/theme === ['"](neo|trust)['"]/.test(src), 'no theme checks in blog');
});

test('breadcrumbs cover every page level in both themes', () => {
  const src = read('lib/breadcrumbs.ts');
  assert.ok(src.includes('export function getBreadcrumbs'));
  assert.ok(src.includes("page === 'notfound'"));
  assert.ok(src.includes('labsTabBySlug'));
  assert.ok(src.includes('divisionLabel'));
  for (const file of ['components/NeoSiteClient.tsx', 'components/TrustSiteClient.tsx', 'components/BlogShell.tsx']) {
    assert.ok(read(file).includes('<Breadcrumbs'), file);
  }
  assert.ok(read('components/shared/Breadcrumbs.tsx').includes('aria-label="Breadcrumb"'));
  assert.ok(read('components/BlogPages.tsx').includes('currentLabel={post.title}'));
  // Voiced labels for each level: Home → section → detail.
  assert.equal(site.navLabel('labs', 'neo'), 'Labs');
  assert.equal(site.navLabel('customers', 'trust'), 'Delivery Proof');
  assert.ok(site.labsTabBySlug('voice')?.title);
  assert.equal(site.divisionLabel('marketing', 'trust'), 'Digital Solutions');
});

test('contact is one shared Field page mounted by both site clients', () => {
  const src = read('components/shared/ContactPage.tsx');
  assert.ok(src.includes('className="nx-ct"') && src.includes('useBriefForm') && src.includes('nx-ct-preview'));
  assert.ok(!/theme === ['"](neo|trust)['"]/.test(src), 'no theme checks in contact');
  assert.ok(!/concierge/i.test(src), 'contact page does not render concierge');
  for (const file of ['components/NeoSiteClient.tsx', 'components/TrustSiteClient.tsx']) {
    assert.ok(read(file).includes('<ContactPage'), file);
  }
  assert.ok(!read('components/TrustSiteClient.tsx').includes('<TrustContact'));
  assert.ok(!read('components/NeoSiteClient.tsx').includes('<Contact '));
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
  assert.deepEqual(site.LABS_FLOW.slice(0, 2), ['proof', 'products'], 'catalogue leads the Labs overview');
  assert.ok(!site.LABS_FLOW.includes('specialisms') && !site.LABS_FLOW.includes('problems'), 'no re-listing blocks on the overview');
  assert.ok(!labs.proofMap.some(p => p.client === 'Nexara Voice'));
  assert.ok(labs.products.some(p => p.id === 'workflows' && p.status === 'building'));
  for (const sp of labs.subpages) {
    assert.ok(Array.isArray(sp.seenIn) && sp.seenIn.length > 0, sp.slug + ' seenIn');
    for (const link of sp.seenIn) {
      if (link.kind === 'product') assert.ok(labs.products.some(p => p.id === link.id), sp.slug + ' ' + link.id);
      else assert.ok(labs.proofMap.some(p => p.client === link.id), sp.slug + ' ' + link.id);
    }
  }
  assert.ok(labs.subpages.find(p => p.slug === 'ecommerce').cards.some(c => /inventory/i.test(c.title)));
  const productIds = labs.products.map(p => p.id);
  assert.ok(Array.isArray(labs.websites) && labs.websites.length >= 5, 'websites stack includes full client set');
  assert.ok(labs.websites.some(w => w.name === 'Sai Nirmaan Architects'));
  assert.ok(labs.websites.some(w => w.name === 'Rise Medical Hub'));
  assert.ok(!labs.proofMap.some(p => p.client === 'Happy Farms'), 'Happy Farms is websites, not Labs proofMap');
  assert.ok(labs.proofMap.some(p => p.client === 'IARSA Skating Academy'), 'IARSA registration in proofMap');
  assert.ok(labs.proofMap.some(p => p.client === 'Rise Medical Hub'), 'Rise Medical software in proofMap');
  assert.equal(labs.products.find(p => p.id === 'forms').status, 'live');
  assert.ok(/^https?:\/\/registrations\.nexaragroups\.in/.test(labs.products.find(p => p.id === 'forms').url));
  assert.equal(labs.products.find(p => p.id === 'forms').name, 'Academy & Sports apps');
  assert.ok(labs.products.find(p => p.id === 'forms').shot?.endsWith('/brand/labs/forms.jpg'));
  assert.ok(labs.products.find(p => p.id === 'hr').shot?.endsWith('/brand/labs/hr.jpg'));
  assert.ok(!labs.products.some(p => p.id === 'academy-sports'), 'academy-sports merged into forms');
  assert.ok(!labs.products.find(p => p.id === 'billing').shot, 'billing uses placeholder, no mock shot');
  for (const id of ['lms', 'workflows']) {
    assert.ok(labs.products.find(p => p.id === id).shot?.startsWith('/brand/labs/'), id + ' shot');
  }
  assert.equal(site.labsProductTabs().find(t => t.slug === 'forms')?.title, 'Registration');
  assert.deepEqual([...site.LABS_FINDER_SEGS], ['proof', 'products', 'capabilities', 'engage']);
  for (const seg of site.LABS_FINDER_SEGS) assert.ok(copy.COPY.labs.nav[seg]?.neo && copy.COPY.labs.nav[seg]?.trust, 'finder label ' + seg);
  assert.ok(labs.websites.every(w => DATA.work.live.some(c => c.name === w.name && c.logo)), 'website logos resolve');
  assert.ok(labs.specialisms.length >= 7, 'care specialism included');
  for (const s of labs.specialisms) for (const link of s.links) {
    if (link.kind === 'proof') assert.ok(labs.proofMap.some(p => p.client === link.id), s.id + ' proof ' + link.id);
    else if (link.kind === 'websites') assert.ok(labs.websites.length > 0, s.id + ' websites');
    else assert.ok(productIds.includes(link.id), s.id + ' product ' + link.id);
  }
  const tabs = site.labsTabs();
  assert.ok(tabs.length >= 11, 'capabilities + products');
  assert.deepEqual(tabs.filter(t => t.kind === 'capability').map(t => t.slug), labs.subpages.map(p => p.slug));
  assert.deepEqual(tabs.filter(t => t.kind === 'product').map(t => t.slug), labs.products.map(p => p.id));
  for (const p of labs.products) {
    assert.ok(p.status === 'live' || p.status === 'demo' || p.status === 'building', p.id);
    if (p.status === 'building') assert.equal(p.url, '', p.id + ' building has no url');
    else assert.ok(/^https?:\/\//.test(p.url), p.id);
    assert.ok(labs.modules.some(m => m.id === p.module), p.id + ' module');
    assert.ok(Array.isArray(p.covers) && p.covers.length >= 3, p.id + ' covers');
    assert.ok(p.pitch?.neo && p.pitch?.trust, p.id + ' pitch');
    assert.ok(p.whoFor?.neo && p.whoFor?.trust, p.id + ' whoFor');
    assert.ok(p.proofNote?.neo && p.proofNote?.trust, p.id + ' proofNote');
    if (p.status === 'live' || p.status === 'demo') assert.ok(p.shot && String(p.shot).startsWith('/brand/labs/'), p.id + ' shot');
    for (const l of p.layers) assert.ok(layerIds.includes(l), p.id + ' layer ' + l);
  }
  assert.equal(labs.products.find(p => p.id === 'grow').status, 'demo');
  assert.ok(!labs.products.some(p => /red.?bean/i.test(p.name)));
  const banned = /—|₹|crore|\bCr\b/;
  for (const s of labs.specialisms) for (const theme of ['neo', 'trust']) assert.ok(!banned.test(s.title[theme] + s.line[theme]), s.id);
  for (const p of labs.products) for (const theme of ['neo', 'trust']) {
    assert.ok(!banned.test(p.line[theme]), p.id);
    assert.ok(!banned.test(p.pitch[theme] + p.whoFor[theme] + p.proofNote[theme]), p.id + ' pitch fields');
  }
  for (const block of site.LABS_FLOW) if (copy.COPY.labs[block]) for (const theme of ['neo', 'trust']) for (const v of Object.values(copy.COPY.labs[block])) assert.ok(!String(v[theme]).includes('—'), block + ' em dash');
  const labsPage = read('components/shared/LabsPage.tsx');
  for (const block of site.LABS_FLOW) assert.ok(new RegExp('\\b' + block + ':').test(labsPage), 'labs block ' + block);
  for (const file of ['components/NeoSiteClient.tsx', 'components/TrustSiteClient.tsx']) assert.ok(read(file).includes('<LabsPage'), file);
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

test('academy page: Proof Portfolio flow, distinct from marketing, both voices, no placement guarantees without disclaimer', () => {
  const page = DATA.sections.academy.page, a = DATA.sections.academy;
  const src = read('components/shared/AcademyPage.tsx');
  for (const block of site.ACADEMY_FLOW) assert.ok(new RegExp('\\b' + block + ':').test(src), 'block ' + block);
  assert.ok(!/theme === ['"](neo|trust)['"]/.test(src), 'no theme checks in the renderer');
  assert.ok(!/nx-mk-/.test(src), 'no Marketing layout class reuse');
  assert.deepEqual([...site.ACADEMY_FLOW], ['hero', 'thesis', 'runway', 'lanes', 'fit', 'proof', 'faqs', 'ask']);
  for (const file of ['components/NeoSiteClient.tsx', 'components/TrustSiteClient.tsx']) assert.ok(read(file).includes('<AcademyPage'), file);
  assert.deepEqual(a.subpages.map(p => p.slug), [...site.ACADEMY_TRACKS]);
  assert.deepEqual(a.subpages.map(p => p.role), [...site.ACADEMY_TRACK_ROLES]);
  assert.equal(page.runway.length, 4);
  assert.equal(page.stamps.length, 6);
  assert.equal(page.fit.length, site.ACADEMY_TRACKS.length);
  for (const stamp of page.stamps) assert.ok(site.ACADEMY_TRACK_ROLES.includes(stamp.track), stamp.track);
  for (const node of page.runway) assert.ok(site.ACADEMY_TRACK_ROLES.includes(node.track), node.path);
  assert.equal(page.faqsNeo.length, a.faqs.length);
  const seen = [];
  (function walk(o, path) {
    if (!o || typeof o !== 'object') return;
    if (typeof o.neo === 'string' && typeof o.trust === 'string') { seen.push([path, o.neo, o.trust]); return; }
    if (Array.isArray(o.neo) && Array.isArray(o.trust)) { seen.push([path, o.neo.join(' '), o.trust.join(' ')]); return; }
    for (const [k, v] of Object.entries(o)) walk(v, path + '.' + k);
  })({ page, subpages: a.subpages, copy: copy.COPY.academy }, 'academy');
  assert.ok(seen.length > 30);
  const all = [...seen.flatMap(([, n, t]) => [n, t]), ...page.faqsNeo.flat(), ...a.faqs.flat()];
  for (const [path, neo, trust] of seen) assert.ok(neo.trim() && trust.trim(), path);
  for (const text of all) {
    assert.ok(!/—/.test(text), 'em dash: ' + text);
    if (/guarantee placement|placement guarantee/i.test(text) && !text.trim().endsWith('?')) {
      assert.ok(/not|n't|never|no |do not|don't/i.test(text), 'placement guarantee needs disclaimer: ' + text);
    }
  }
});

test('about page: Field register, every ABOUT_FLOW block, no theme checks, no dark page head', () => {
  const src = read('components/shared/About.tsx');
  for (const block of site.ABOUT_FLOW) assert.ok(new RegExp('\\b' + block + ':').test(src), 'block ' + block);
  assert.ok(!/theme === ['"](neo|trust)['"]/.test(src), 'no theme checks in the renderer');
  assert.ok(!/nx-page-head/.test(src), 'no dark PageHeader band');
  assert.ok(/className="nx-ab"/.test(src) && /nx-ab-dossier/.test(src));
  assert.ok(/DATA\.contact\.legal/.test(src) || /legal\.cin/.test(src));
  for (const file of ['components/NeoSiteClient.tsx', 'components/TrustSiteClient.tsx']) assert.ok(read(file).includes('<About'), file);
  for (const theme of ['neo', 'trust']) {
    for (const key of ['kicker', 'leave', 'record', 'pending', 'done']) assert.ok(copy.COPY.about.hero[key][theme], 'about.hero.' + key + ' ' + theme);
  }
});

test('proof page: Field live index, hero in COPY, Link filters, no theme checks', () => {
  const src = read('components/shared/Proof.tsx');
  for (const block of site.PROOF_FLOW) assert.ok(new RegExp('\\b' + block + ':').test(src), 'block ' + block);
  assert.ok(!/theme === ['"](neo|trust)['"]/.test(src), 'no theme checks in the renderer');
  assert.ok(!/nx-page-head/.test(src), 'no dark PageHeader band');
  assert.ok(/className="nx-pf"/.test(src) && /nx-pf-index/.test(src));
  assert.ok(/DATA\.work\.live/.test(src));
  assert.ok(/routePath\(theme, 'customers'/.test(src), 'division filters are real routes');
  assert.ok(src.includes("routePath(theme, 'customers', id)") || src.includes('routePath(theme, \'customers\', id)'));
  for (const file of ['components/NeoSiteClient.tsx', 'components/TrustSiteClient.tsx']) assert.ok(read(file).includes('<Proof'), file);
  for (const theme of ['neo', 'trust']) {
    for (const key of ['kicker', 'title', 'accent', 'body', 'leave', 'record']) assert.ok(copy.COPY.proof.hero[key][theme], 'proof.hero.' + key + ' ' + theme);
  }
  assert.ok(DATA.work.live.filter((c) => c.url).length >= 5);
});
