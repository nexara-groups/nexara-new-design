import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const moduleOf = source => import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const { DATA } = await moduleOf(fs.readFileSync(new URL('../src/lib/data.ts', import.meta.url), 'utf8'));
const source = fs.readFileSync(new URL('../src/lib/seo.ts', import.meta.url), 'utf8').replace("import { DATA } from './data';", 'const DATA = ' + JSON.stringify(DATA) + ';');
const { getSeo, getRoutes, getStructuredData } = await moduleOf(source);
test('all existing detail pages and intake links have valid metadata', () => {
 const routes = getRoutes(); assert.equal(routes.length, 47);
 for (const route of routes) { const seo=getSeo(route); assert.equal(seo.valid,true,route.path); assert.ok(seo.title.includes('Nexara')); assert.ok(seo.description.length>80); }
 for(const theme of ['trust','neo']) assert.ok(routes.find(r=>r.path===theme+'/academy/internships'));
});
test('Neo duplicates consolidate to Trust and contact intents consolidate to contact', () => {
 assert.equal(getSeo({theme:'neo',page:'academy',detail:'internships'}).canonical,'https://nexaragroups.com/trust/academy/internships');
 assert.equal(getSeo({theme:'trust',page:'contact',detail:'academy'}).canonical,'https://nexaragroups.com/trust/contact');
 assert.equal(new Set(getRoutes().map(r=>getSeo(r).canonical)).size,20);
});
test('invalid service and detail routes cannot be indexed', () => {
 for(const route of [{theme:'trust',page:'made-up',detail:null},{theme:'neo',page:'academy',detail:'made-up'}]) assert.equal(getSeo(route).valid,false);
});
test('local business schema has the exact supplied phone and address', () => {
 const graph=getStructuredData({theme:'trust',page:'contact',detail:null})['@graph'];
 const org=graph.find(x=>x['@type']?.includes('LocalBusiness'));
 assert.equal(org.telephone,'+919257535757'); assert.equal(org.address.postalCode,'530017');
 assert.equal(org.address.streetAddress,'First Floor, 1-83-14, MVP Sector 3, Sector 4, Sector 3, MVP Colony');
});
