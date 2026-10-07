import React from 'react';
import { DATA } from './data.js';
import { getSeo, routePath } from './seo.js';
import { routeTo } from './shared.js';

export default function LocalContext({ theme = null, page = 'gateway', detail = null }) {
  if (page === 'gateway' || page === 'home') return null;
  const seo = getSeo({ theme, page, detail });
  if (!seo.valid) return null;
  const activeTheme = theme || 'trust';
  const links = [
    ['labs', null, 'Software development in Visakhapatnam'],
    ['marketing', 'web', 'Website design in Vizag'],
    ['marketing', null, 'Digital marketing services'],
    ['academy', null, 'Nexara Academy'],
    ['academy', 'internships', 'Software internships in Vizag'],
    ['customers', null, 'Delivery models'],
    ['company', null, 'About our IT company'],
    ['contact', null, 'Contact Nexara'],
  ];
  const subpages = DATA.sections[page]?.subpages || [];
  const link = (target, subpage, label) => <a href={routePath(activeTheme, target, subpage)} onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); routeTo(activeTheme, target, subpage); } }}>{label}</a>;
  return (
    <section className="local-context" aria-label="Nexara services in Visakhapatnam">
      <div className="local-context__inner">
        <nav className="local-context__breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Nexara</a>
          {theme && <><span aria-hidden="true">/</span>{link('home', null, 'IT services')}</>}
          {theme && page !== 'home' && <><span aria-hidden="true">/</span>{link(page, null, DATA.sections[page]?.name || page[0].toUpperCase() + page.slice(1))}</>}
          {detail && page !== 'contact' && <><span aria-hidden="true">/</span><span aria-current="page">{DATA.sections[page]?.subpages.find(item => item.slug === detail)?.title || DATA.sections[detail]?.name}</span></>}
        </nav>
        <h2>{seo.heading}</h2>
        <p>{seo.body}</p>
        {!!subpages.length && <nav className="local-context__links" aria-label={`${DATA.sections[page].name} services`}>
          {subpages.map(item => <React.Fragment key={item.slug}>{link(page, item.slug, item.title)}</React.Fragment>)}
        </nav>}
        {page === 'customers' && <nav className="local-context__links" aria-label="Delivery models by division">
          {Object.values(DATA.sections).map(item => <React.Fragment key={item.id}>{link('customers', item.id, `${item.name} delivery models`)}</React.Fragment>)}
        </nav>}
        <nav className="local-context__links" aria-label="Related services in Visakhapatnam">
          {links.map(([target, subpage, label]) => <React.Fragment key={target + (subpage || '')}>{link(target, subpage, label)}</React.Fragment>)}
        </nav>
        {!!seo.faqs.length && <div className="local-context__faqs">
          <h3>Questions about working with Nexara</h3>
          {seo.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </div>}
        {!theme && <address className="local-context__address">Nexara Private Limited · <a href={DATA.contact.phone.href}>{DATA.contact.phone.display}</a><br />{DATA.contact.address.street}, {DATA.contact.address.city}</address>}
      </div>
    </section>
  );
}
