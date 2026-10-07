import React from 'react';
import { DATA } from '@/lib/data';
import Link from 'next/link';
import type { Route } from '@/lib/routes';
const sections: Record<string, (typeof DATA.sections)[keyof typeof DATA.sections]> = DATA.sections;
import { getSeo, routePath } from '@/lib/seo';


export default function LocalContext({ theme = null, page = 'gateway', detail = null }: Partial<Pick<Route, 'theme'|'page'|'detail'>>) {
  if (page === 'gateway' || page === 'home') return null;
  const seo = getSeo({ theme, page, detail });
  if (!seo.valid) return null;
  const activeTheme = theme || 'trust';
  const links: [string, string | null, string][] = [
    ['labs', null, 'Software development in Visakhapatnam'],
    ['marketing', 'web', 'Website design in Vizag'],
    ['marketing', null, 'Digital marketing services'],
    ['academy', null, 'Nexara Academy'],
    ['academy', 'internships', 'Software internships in Vizag'],
    ['customers', null, 'Delivery models'],
    ['company', null, 'About our IT company'],
    ['contact', null, 'Contact Nexara'],
  ];
  const subpages = sections[page]?.subpages || [];
  const link = (target: string, subpage: string | null, label: string) => <Link prefetch={false} href={routePath(activeTheme, target, subpage)}>{label}</Link>;
  return (
    <section className="local-context" aria-label="Nexara services in Visakhapatnam">
      <div className="local-context__inner">
        <nav className="local-context__breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Nexara</a>
          {theme && <><span aria-hidden="true">/</span>{link('home', null, 'IT services')}</>}
          {theme && page !== 'home' && <><span aria-hidden="true">/</span>{link(page, null, sections[page]?.name || page[0]!.toUpperCase() + page.slice(1))}</>}
          {detail && page !== 'contact' && <><span aria-hidden="true">/</span><span aria-current="page">{sections[page]?.subpages.find(item => item.slug === detail)?.title || sections[detail]?.name}</span></>}
        </nav>
        <h2>{seo.heading}</h2>
        <p>{seo.body}</p>
        {!!subpages.length && <nav className="local-context__links" aria-label={`${sections[page]!.name} services`}>
          {subpages.map(item => <React.Fragment key={item.slug}>{link(page, item.slug, item.title)}</React.Fragment>)}
        </nav>}
        {page === 'customers' && <nav className="local-context__links" aria-label="Delivery models by division">
          {Object.values(DATA.sections).map(item => <React.Fragment key={item.id}>{link('customers', item.id, `${item.name} delivery models`)}</React.Fragment>)}
        </nav>}
        <nav className="local-context__links" aria-label="Related services in Visakhapatnam">
          {links.map(([target, subpage, label]) => <React.Fragment key={target + (subpage || '')}>{link(target, subpage, label)}</React.Fragment>)}
        </nav>
        {!!seo.faqs?.length && <div className="local-context__faqs">
          <h3>Questions about working with Nexara</h3>
          {seo.faqs?.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </div>}
        {!theme && <address className="local-context__address">Nexara Private Limited · <a href={DATA.contact.phone.href}>{DATA.contact.phone.display}</a><br />{DATA.contact.address.street}, {DATA.contact.address.city}</address>}
      </div>
    </section>
  );
}
