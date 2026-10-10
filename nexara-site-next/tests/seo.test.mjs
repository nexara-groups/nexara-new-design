import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const moduleOf = source => import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const { DATA } = await moduleOf(fs.readFileSync(new URL('../src/lib/data.ts', import.meta.url), 'utf8'));
const source = fs.readFileSync(new URL('../src/lib/seo.ts', import.meta.url), 'utf8').replace("import { DATA } from './data';", 'const DATA = ' + JSON.stringify(DATA) + ';').replace(/import \{ BLOG_POSTS[^\n]*\n/, "const BLOG_POSTS = [], BLOG_DESCRIPTION = '';\n");
const { getSeo, getRoutes, getStructuredData } = await moduleOf(source);
test('all existing detail pages and intake links have valid metadata', () => {
 const routes = getRoutes(); assert.equal(routes.length, 43); // marketing service lines are in-page anchors, not routes
 for (const route of routes) { const seo=getSeo(route); assert.equal(seo.valid,true,route.path); assert.ok(seo.title.includes('Nexara')); assert.ok(seo.description.length>80); }
 for(const theme of ['trust','neo']) assert.ok(routes.find(r=>r.path===theme+'/academy/internships'));
});
test('Trust duplicates consolidate to Neo and contact intents consolidate to contact', () => {
 assert.equal(getSeo({theme:'trust',page:'academy',detail:'internships'}).canonical,'https://nexaragroups.com/neo/academy/internships');
 assert.equal(getSeo({theme:'trust',page:'contact',detail:'academy'}).canonical,'https://nexaragroups.com/neo/contact');
 assert.equal(getSeo({theme:'neo',page:'home',detail:null}).canonical,'https://nexaragroups.com/');
 assert.equal(new Set(getRoutes().map(r=>getSeo(r).canonical)).size,18);
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
