import React from 'react';
import { DATA, neoSectionName } from '@/lib/data';
import Link from 'next/link';
import type { Route } from '@/lib/routes';
const sections: Record<string, (typeof DATA.sections)[keyof typeof DATA.sections]> = DATA.sections;
import { getSeo, routePath } from '@/lib/seo';


export default function LocalContext({ theme = null, page = 'gateway', detail = null }: Partial<Pick<Route, 'theme'|'page'|'detail'>>) {
  if (page === 'gateway' || (page === 'home' && theme !== 'neo')) return null;
  const seo = getSeo({ theme, page, detail });
  if (!seo.valid) return null;
  const activeTheme = theme || 'neo';
  const nm = (s: { name: string; neoName?: string }) => activeTheme === 'neo' ? neoSectionName(s) : s.name;
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
        {page !== 'home' && <nav className="local-context__breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Nexara</a>
          {theme && <><span aria-hidden="true">/</span>{link(page, null, (sections[page] ? nm(sections[page]) : '') || page[0]!.toUpperCase() + page.slice(1))}</>}
          {detail && page !== 'contact' && <><span aria-hidden="true">/</span><span aria-current="page">{sections[page]?.subpages.find(item => item.slug === detail)?.title || (sections[detail] ? nm(sections[detail]) : undefined)}</span></>}
        </nav>}
        <h2>{seo.heading}</h2>
        <p>{seo.body}</p>
        {page === 'home' && <div className="local-context__home">
          <h3>What Nexara does in Visakhapatnam</h3>
          <div className="local-context__teams">
            <div>
              <h4>{link('labs', null, activeTheme === 'neo' ? 'Labs' : 'Product Studio')}</h4>
              <p>Custom software for businesses in Visakhapatnam. We build SaaS platforms, B2B portals, dashboards, internal tools and integrations, and add AI automation where it fits the problem. Work starts with the users and the business problem, then moves through architecture, development, QA and launch.</p>
            </div>
            <div>
              <h4>{link('marketing', null, activeTheme === 'neo' ? 'Digital Marketing' : 'Digital Solutions')}</h4>
              <p>Websites and digital marketing for local businesses. We handle brand identity, business websites and landing pages, content, SEO basics and campaigns, and report results in plain language. The offer, the website and the measurement plan are planned together.</p>
            </div>
            <div>
              <h4>{link('academy', null, 'Academy')}</h4>
              <p>Software training and internships. Full-stack, AI, design and cloud tracks with real projects and mentor reviews, managed internships for students and colleges, and placement preparation for specific roles.</p>
            </div>
          </div>
          <p>Recent work includes a SaaS platform, an e-commerce and product site, a medical library, sales calculators, websites and digital marketing for Happy Farms, Sri Engineering Works, Rise Medical Hub, Qualigene and Sai Nirmaan Architects. {link('customers', null, 'See the work')}.</p>
          <p>{DATA.contact.legal.name} is based in MVP Colony, Visakhapatnam. Visit us at {DATA.contact.address.street}, {DATA.contact.address.city}, call <a href={DATA.contact.phone.href}>{DATA.contact.phone.display}</a> or {link('contact', null, 'send us a project brief')}.</p>
        </div>}
        {!!subpages.length && <nav className="local-context__links" aria-label={`${nm(sections[page]!)} services`}>
          {subpages.map(item => <React.Fragment key={item.slug}>{link(page, item.slug, item.title)}</React.Fragment>)}
        </nav>}
        {page === 'customers' && <nav className="local-context__links" aria-label="Delivery models by division">
          {Object.values(DATA.sections).map(item => <React.Fragment key={item.id}>{link('customers', item.id, `${nm(item)} delivery models`)}</React.Fragment>)}
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
