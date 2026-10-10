import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const moduleOf = source => import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const { DATA } = await moduleOf(fs.readFileSync(new URL('../src/lib/data.ts', import.meta.url), 'utf8'));
const source = fs.readFileSync(new URL('../src/lib/seo.ts', import.meta.url), 'utf8').replace("import { DATA } from './data';", 'const DATA = ' + JSON.stringify(DATA) + ';').replace(/import \{ BLOG_POSTS[^\n]*\n/, "const BLOG_POSTS = [], BLOG_DESCRIPTION = '';\n");
const { getSeo, getRoutes, getStructuredData } = await moduleOf(source);
test('all existing detail pages and intake links have valid metadata', () => {
 const routes = getRoutes(); assert.equal(routes.length, 52); // +8 labs products × 2 themes; academy-sports merged into forms
 for (const route of routes) { const seo=getSeo(route); assert.equal(seo.valid,true,route.path); assert.ok(seo.title.includes('Nexara')); assert.ok(seo.description.length>80); }
 for(const theme of ['trust','neo']) assert.equal(routes.some(r=>r.path===theme+'/academy/internships'), false);
 for(const theme of ['trust','neo']) for (const slug of ['voice','agency','grow','forms','lms','hr','billing','workflows']) {
   assert.ok(routes.some(r=>r.path===`${theme}/labs/${slug}`), `${theme}/labs/${slug}`);
 }
});
test('Trust duplicates consolidate to Neo and contact intents consolidate to contact', () => {
 assert.equal(getSeo({theme:'trust',page:'academy',detail:null}).canonical,'https://nexaragroups.com/neo/academy');
 assert.equal(getSeo({theme:'trust',page:'contact',detail:'academy'}).canonical,'https://nexaragroups.com/neo/contact');
 assert.equal(getSeo({theme:'neo',page:'home',detail:null}).canonical,'https://nexaragroups.com/');
 assert.equal(new Set(getRoutes().map(r=>getSeo(r).canonical)).size,22);
});
test('invalid service and detail routes cannot be indexed', () => {
 for(const route of [{theme:'trust',page:'made-up',detail:null},{theme:'neo',page:'academy',detail:'made-up'}]) assert.equal(getSeo(route).valid,false);
});
test('local business schema has the exact supplied phone and address', () => {
 const graph=getStructuredData({theme:'trust',page:'contact',detail:null})['@graph'];
 const org=graph.find(x=>x['@type']?.includes('LocalBusiness'));
 assert.equal(org.telephone,'+919257535757'); assert.equal(org.address.postalCode,'530017');
 assert.equal(org.address.streetAddress,DATA.contact.address.street);
});

test('pages with FAQs emit FAQPage JSON-LD instead of a visible SEO dump', () => {
 const home=getStructuredData({theme:'neo',page:'home',detail:null})['@graph'];
 const faq=home.find(x=>x['@type']==='FAQPage');
 assert.ok(faq); assert.ok(faq.mainEntity.length>=3);
 assert.equal(faq.mainEntity[0]['@type'],'Question');
 const academy=getStructuredData({theme:'neo',page:'academy',detail:null})['@graph'];
 assert.ok(academy.find(x=>x['@type']==='FAQPage'), 'division FAQs are in schema');
});

test('site chrome does not mount the old LocalContext SEO band', () => {
 const neo=fs.readFileSync(new URL('../src/components/NeoSiteClient.tsx', import.meta.url),'utf8');
 const trust=fs.readFileSync(new URL('../src/components/TrustSiteClient.tsx', import.meta.url),'utf8');
 assert.equal(neo.includes('LocalContext'), false);
 assert.equal(trust.includes('LocalContext'), false);
 assert.equal(fs.existsSync(new URL('../src/components/LocalContext.tsx', import.meta.url)), false);
});

test('marketing is one page: service lines are anchors, old detail URLs are not routed, FAQ schema follows the visible voice', () => {
 const routes=getRoutes();
 for(const theme of ['neo','trust']) for(const line of ['presence','visibility','performance']) {
  assert.equal(routes.some(r=>r.theme===theme&&r.page==='marketing'&&r.detail===line),false,theme+'/'+line);
  assert.equal(getSeo({theme,page:'marketing',detail:line}).valid,false);
 }
 const config=fs.readFileSync(new URL('../next.config.mjs', import.meta.url),'utf8');
 for(const line of ['presence','visibility','performance']) assert.ok(config.includes(`['${line}', '${line}']`), 'redirect '+line);
 assert.ok(config.includes('/neo/marketing#${to}') && config.includes('/trust/marketing#${to}'));
 for(const theme of ['neo','trust']) {
  const faq=getStructuredData({theme,page:'marketing',detail:null})['@graph'].find(x=>x['@type']==='FAQPage');
  const visible=theme==='neo'?DATA.sections.marketing.page.faqsNeo:DATA.sections.marketing.faqs;
  assert.deepEqual(faq.mainEntity.map(q=>q.name),visible.map(([q])=>q));
 }
});

test('academy is one page: tracks are anchors, old detail URLs are not routed, FAQ schema follows the visible voice', () => {
 const routes=getRoutes();
 for(const theme of ['neo','trust']) for(const line of ['tracks','internships','placements']) {
  assert.equal(routes.some(r=>r.theme===theme&&r.page==='academy'&&r.detail===line),false,theme+'/'+line);
  assert.equal(getSeo({theme,page:'academy',detail:line}).valid,false);
 }
 const config=fs.readFileSync(new URL('../next.config.mjs', import.meta.url),'utf8');
 for(const line of ['tracks','internships','placements']) assert.ok(config.includes(`['${line}', '${line}']`), 'redirect '+line);
 assert.ok(config.includes('/neo/academy#${to}') && config.includes('/trust/academy#${to}'));
 for(const theme of ['neo','trust']) {
  const faq=getStructuredData({theme,page:'academy',detail:null})['@graph'].find(x=>x['@type']==='FAQPage');
  const visible=theme==='neo'?DATA.sections.academy.page.faqsNeo:DATA.sections.academy.faqs;
  assert.deepEqual(faq.mainEntity.map(q=>q.name),visible.map(([q])=>q));
 }
});

test('entity disambiguation covers Nexera variants and local geo signals', () => {
  const graph = getStructuredData({ theme: 'neo', page: 'home', detail: null })['@graph'];
  const org = graph.find(x => x['@type']?.includes('Organization'));
  assert.ok(org, 'organization node exists');
  assert.equal(org.alternateName.includes('Nexera'), false, 'a misspelling is not claimed as an alternate name');
  assert.ok(org.alternateName.includes('Nexara Groups'), 'alternateName includes Nexara Groups');
  assert.ok(org.disambiguatingDescription.includes('misspelled Nexera'), 'disambiguatingDescription explains the misspelling');
  assert.equal(org.priceRange, undefined);
  assert.equal(org.openingHoursSpecification, undefined);
  assert.equal(org.paymentAccepted, undefined);
  const website = graph.find(x => x['@type'] === 'WebSite');
  assert.equal(website.potentialAction, undefined, 'no sitelinks search box without a search page');
  assert.equal(org.geo.latitude, 17.738047);
  assert.equal(org.geo.longitude, 83.341405);
  assert.ok(org.knowsAbout.includes('Next.js'));
  assert.ok(org.knowsAbout.includes('AI Voice Agents'));
});

test('home page FAQ covers Nexera disambiguation, software company in Vizag, contacts, stack, products, and clients', () => {
  const graph = getStructuredData({ theme: 'neo', page: 'home', detail: null })['@graph'];
  const faq = graph.find(x => x['@type'] === 'FAQPage');
  assert.ok(faq, 'FAQPage exists on home');
  const questions = faq.mainEntity.map(q => q.name);
  assert.ok(questions.some(q => /Nexera/i.test(q)), 'Nexera question present');
  assert.ok(questions.some(q => /software company in Vizag/i.test(q)), 'software company in Vizag question present');
  assert.ok(questions.some(q => /websites contacts in Vizag/i.test(q)), 'websites contacts question present');
  assert.ok(questions.some(q => /tech stack/i.test(q)), 'tech stack question present');
  assert.ok(questions.some(q => /products/i.test(q)), 'products question present');
  assert.ok(questions.some(q => /clients/i.test(q)), 'clients question present');
});

test('labs product detail pages emit SoftwareApplication schema', () => {
  for (const slug of ['voice', 'agency', 'grow']) {
    const graph = getStructuredData({ theme: 'neo', page: 'labs', detail: slug })['@graph'];
    const software = graph.find(x => x['@type'] === 'SoftwareApplication');
    assert.ok(software, `SoftwareApplication schema on labs/${slug}`);
    assert.ok(software.name, `software has name on ${slug}`);
    assert.equal(software.offers, undefined, `no free-product offer on ${slug}`);
  }
});

test('customers page emits ItemList portfolio schema with client projects', () => {
  const graph = getStructuredData({ theme: 'neo', page: 'customers', detail: null })['@graph'];
  const portfolio = graph.find(x => x['@type'] === 'ItemList');
  assert.ok(portfolio, 'portfolio ItemList exists on customers page');
  assert.equal(portfolio.itemListElement.length, DATA.work.live.length);
  const clientNames = portfolio.itemListElement.map(el => el.item.name);
  assert.ok(clientNames.includes('Sai Nirmaan Architects'));
  assert.ok(clientNames.includes('Sri Engineering Works'));
  assert.ok(clientNames.includes('Happy Farms'));
  assert.ok(clientNames.includes('Rise Medical Hub'));
  assert.ok(clientNames.includes('Qualigene Lifesciences'));
});

test('titles and descriptions fit a search result', () => {
  for (const route of getRoutes()) {
    const seo = getSeo(route);
    assert.ok(seo.title.length <= 60, `${seo.title} (${seo.title.length})`);
    assert.ok(seo.description.length >= 80 && seo.description.length <= 160, `${route.path} description ${seo.description.length}: ${seo.description}`);
  }
});

test('brand domains redirect on the worker, including Slovenia', () => {
  const hosts = ['nexaraprivatelimited.com', 'nexaraprivatelimited.in', 'nexaraprivatelimited.si'];
  const middleware = fs.readFileSync(new URL('../src/middleware.ts', import.meta.url), 'utf8');
  const wrangler = fs.readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
  for (const host of hosts) {
    assert.ok(middleware.includes(`'${host}'`), host);
    assert.ok(wrangler.includes(`pattern = "${host}/*"`), `apex route ${host}`);
    assert.ok(wrangler.includes(`pattern = "www.${host}/*"`), `www route ${host}`);
  }
  assert.ok(middleware.includes('301'));
  assert.ok(middleware.includes('https://${CANONICAL_HOST}'));
});

test('all routes have targeted keywords populated', () => {
  const routes = getRoutes();
  for (const route of routes) {
    const seo = getSeo(route);
    assert.ok(seo.keywords, `keywords for ${route.path}`);
    assert.ok(seo.keywords.length > 20, `keywords length for ${route.path}`);
  }
});
