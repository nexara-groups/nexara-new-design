import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const base=process.argv[2]||'http://127.0.0.1:4274';
const moduleOf=source=>import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const {DATA}=await moduleOf(fs.readFileSync(new URL('../src/lib/data.ts',import.meta.url),'utf8'));
const {getRoutes,getSeo}=await moduleOf(fs.readFileSync(new URL('../src/lib/seo.ts',import.meta.url),'utf8').replace("import { DATA } from './data';",'const DATA='+JSON.stringify(DATA)+';'));
const decode=s=>s.replace(/&amp;/g,'&').replace(/&#x27;/g,"'").replace(/&quot;/g,'"');
const attr=(html,tag,key,value,attrName)=>{const tags=html.match(new RegExp(`<${tag}\\b[^>]*>`,'g'))||[];return tags.find(t=>t.includes(`${key}="${value}"`))?.match(new RegExp(`${attrName}="([^"]*)"`))?.[1];};
const linkPaths=new Set();
for(const route of getRoutes()){
 const res=await fetch(base+'/'+route.path); assert.equal(res.status,200,route.path);
 const html=await res.text(),seo=getSeo(route);
 assert.equal(decode(html.match(/<title>(.*?)<\/title>/)?.[1]||''),seo.title,route.path+' title');
 assert.equal(decode(attr(html,'meta','name','description','content')||''),seo.description,route.path+' description');
 assert.equal(attr(html,'link','rel','canonical','href'),seo.canonical,route.path+' canonical');
 assert.ok(!attr(html,'meta','name','robots','content')?.includes('noindex'),route.path);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,route.path+' one H1');
 assert.ok(html.includes('application/ld+json')&&html.includes('+919257535757')&&html.includes('530017'),route.path+' schema');
 assert.ok(html.includes('/_next/'),'Next.js assets');
 if(route.page==='gateway'||route.page==='home')assert.ok(!html.includes('class="local-context"'),route.path+' no homepage SEO block');
 else assert.ok(html.includes('class="local-context"'),route.path+' server-rendered service content');
 if(route.theme){assert.ok(html.includes('href="tel:+919257535757"'));assert.ok(html.includes('MVP Colony'));}
if(route.page==='academy'&&!route.detail)assert.ok(html.includes('Learner record')||html.includes('nx-ac'),route.path+' academy page');
for(const [,href]of html.matchAll(/href="(\/(?:trust|neo)(?:\/[^"?#]*)?)"/g))linkPaths.add(href);
}
for(const path of linkPaths){const res=await fetch(base+path,{redirect:'manual'});assert.equal(res.status,200,'internal link '+path);}
for(const path of ['/trust/made-up','/neo/academy/made-up','/not-a-page']){const res=await fetch(base+path);assert.equal(res.status,404,path);const h=await res.text();assert.ok(h.includes('noindex'),path);assert.ok(!h.includes('rel="canonical"'),path+' no canonical');}
for(const [path,target]of [['/trust/home','/trust'],['/neo/home','/'],['/academy/internships','/neo/academy#internships']]){const res=await fetch(base+path,{redirect:'manual'});assert.equal(res.status,308,path);assert.ok(res.headers.get('location')?.endsWith(target)||res.headers.get('location')===target,path+' -> '+res.headers.get('location'));}
const sitemap=await(await fetch(base+'/sitemap.xml')).text();const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);assert.ok(urls.length>=30);assert.equal(new Set(urls).size,urls.length);assert.ok(urls.includes('https://nexaragroups.com/neo/academy')||urls.includes('https://nexaragroups.com/trust/academy'));assert.ok(!urls.includes('https://nexaragroups.com/trust/academy/internships'));assert.ok(urls.some(x=>x.includes('/labs/voice')));assert.ok(urls.some(x=>x.includes('/labs/workflows')));
assert.ok((await(await fetch(base+'/robots.txt')).text()).includes('Sitemap: https://nexaragroups.com/sitemap.xml'));
for(const path of ['privacy-policy.html','terms-of-service.html','cookie-policy.html','data-deletion.html']){const res=await fetch(base+'/'+path);assert.equal(res.status,200);const h=await res.text();assert.ok(h.includes('https://nexaragroups.com/'+path));}
console.log(JSON.stringify({checkedRoutes:getRoutes().length,internalLinks:linkPaths.size,canonicalSitemapUrls:urls.length,unknownRoutes:'404/noindex',legacyRoutes:'308',base}));
