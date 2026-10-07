import test from 'node:test';
import assert from 'node:assert/strict';
import { DATA } from '../src/data.js';
import { getRoutes, getSeo, getStructuredData, routePath, SITE_URL } from '../src/seo.js';

const routes = getRoutes();
test('every configured service and deep link has a valid route and local metadata', () => {
  assert.equal(new Set(routes.map(route => route.path)).size, routes.length);
  for (const theme of ['trust', 'neo']) {
    for (const [page, section] of Object.entries(DATA.sections)) {
      for (const detail of [null, ...section.subpages.map(item => item.slug)]) {
        const route = routes.find(route => route.theme === theme && route.page === page && route.detail === detail);
        assert.ok(route, `missing ${theme}/${page}/${detail}`);
        const seo = getSeo(route);
        assert.ok(seo.valid);
        assert.match(seo.title, /Visakhapatnam|Vizag/);
        assert.ok(seo.body.length > 120);
      }
    }
  }
});
test('duplicate presentations and contact selections share a stable canonical', () => {
  for (const route of routes.filter(route => route.theme)) {
    const seo = getSeo(route);
    assert.equal(seo.canonical, SITE_URL + routePath('trust', route.page, route.page === 'contact' ? null : route.detail));
  }
  assert.equal(routePath('trust', 'home'), '/trust');
  const canonicalPages = routes.filter(route => getSeo(route).canonical === SITE_URL + '/' + route.path);
  assert.equal(new Set(canonicalPages.map(route => getSeo(route).title)).size, canonicalPages.length);
  assert.equal(new Set(canonicalPages.map(route => getSeo(route).description)).size, canonicalPages.length);
});
test('invalid pages, themes and details are not indexable', () => {
  for (const route of [
    {theme:'trust',page:'unknown'}, {theme:'unknown',page:'home'},
    {theme:'neo',page:'academy',detail:'missing'}, {theme:'trust',page:'company',detail:'unknown'},
    {theme:'trust',page:'contact',detail:'unknown'}, {theme:'neo',page:'customers',detail:'unknown'},
  ]) {
    const seo = getSeo(route);
    assert.equal(seo.valid, false);
    assert.match(seo.robots, /noindex/);
    assert.equal(seo.canonical, null);
    assert.deepEqual(getStructuredData(route)['@graph'], []);
  }
});
test('structured data keeps the visible NAP and canonical breadcrumb destinations', () => {
  for (const route of routes) {
    const graph = getStructuredData(route)['@graph'];
    const business = graph[0];
    assert.equal(business.telephone, DATA.contact.phone.href.slice(4));
    assert.equal(business.address.streetAddress, DATA.contact.address.street);
    assert.equal(business.address.postalCode, '530017');
    assert.equal(graph[2].url, getSeo(route).canonical);
    assert.equal(business.aggregateRating, undefined);
    const breadcrumbs = graph.find(item => item['@type'] === 'BreadcrumbList');
    if (route.theme) {
      assert.equal(breadcrumbs.itemListElement.at(-1).item, getSeo(route).canonical);
      assert.deepEqual(breadcrumbs.itemListElement.map(item => item.position), breadcrumbs.itemListElement.map((_, index) => index + 1));
    }
  }
});

test('internship search pages describe a local programme and consolidate both themes', () => {
  const internship = DATA.sections.academy.subpages.find(page => page.slug === 'internships');
  assert.match(internship.heading, /Vizag.*Visakhapatnam/);
  for (const theme of ['trust', 'neo']) {
    const route = { theme, page: 'academy', detail: 'internships' };
    const seo = getSeo(route);
    assert.match(seo.title, /Software Internships.*Vizag.*Visakhapatnam/);
    assert.match(seo.description, /mentor pods.*weekly demos.*completion reports/);
    assert.equal(seo.canonical, SITE_URL + '/trust/academy/internships');
    assert.ok(seo.faqs.some(([question]) => question.includes('duration')));
    const schema = getStructuredData(route)['@graph'];
    assert.ok(schema.some(item => item['@type'] === 'Service'));
    assert.ok(!schema.some(item => item['@type'] === 'JobPosting'));
  }
});
