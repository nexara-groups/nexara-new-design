import { DATA } from './data';
import type { Route, Theme } from './routes';
const sections: Record<string, (typeof DATA.sections)[keyof typeof DATA.sections]> = DATA.sections;

export const SITE_URL = 'https://nexaragroups.com';
export const INDEX_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

// One content registry drives build metadata, client navigation and the sitemap.
const pages: Record<string, [string, string, string, string]> = {
  gateway: ['Software Company in Visakhapatnam (Vizag) | Nexara', 'Nexara is a software company in Visakhapatnam offering custom software, website design, AI automation, digital marketing and technology training.', 'Software and website development in Visakhapatnam', 'Nexara Private Limited brings software development, website design, digital marketing and technology training together in Visakhapatnam, also known as Vizag. Explore our Product Studio, Digital Solutions and Academy to find the team for your project.'],
  home: ['IT Company in Vizag | Software & Web Development | Nexara', 'Meet Nexara, an IT company in Vizag for custom software, SaaS, website development, digital marketing and talent programmes. Based in MVP Colony.', 'An IT company in Vizag for people, products and growth', 'From our office in MVP Colony, Visakhapatnam, Nexara helps businesses build custom software, launch websites and connect their digital systems. Our Academy develops technical talent, Digital Solutions builds market presence, and Product Studio delivers software and automation.'],
  academy: ['Software Training in Visakhapatnam | Nexara Academy', 'Explore software training in Visakhapatnam: full-stack, AI, design and cloud tracks with projects, mentor reviews, internships and placement preparation.', 'Technology training in Visakhapatnam', 'Nexara Academy supports learners, colleges and employers in Visakhapatnam with structured training, applied projects and mentor reviews. Choose a technical track, discuss a managed internship programme or plan role-specific placement preparation.'],
  'academy/tracks': ['Full Stack & AI Courses in Visakhapatnam | Nexara', 'Compare Nexara Academy tracks in full-stack development, AI and data, design, and cloud operations. Project-led technology training in Visakhapatnam.', 'Choose a software training track in Vizag', 'Our tracks cover full-stack development, AI and data, product design, and cloud operations. Discuss your current skills, target role and project goals with Nexara Academy in Visakhapatnam to define a suitable learning scope.'],
  'academy/internships': ['Software Internships in Vizag & Visakhapatnam | Nexara', 'Explore software internships in Vizag and Visakhapatnam with Nexara Academy: mentor pods, practical projects, weekly demos and completion reports. Call 9257535757.', 'Managed software internships in Visakhapatnam', 'Nexara Academy works with learners and institutions on managed internships built around practical projects. Mentor pods, weekly reviews and completion reports make progress visible to learners and college placement teams in Vizag.'],
  'academy/placements': ['IT Placement Preparation in Vizag | Nexara Academy', 'Prepare for IT roles in Vizag with portfolio reviews, interview practice and employer matching. Discuss portfolio, interview and employer-matching support with Nexara Academy.', 'Prepare for IT opportunities in Vizag', 'Build interview readiness through portfolio support, technical and behavioural interview practice, and role-fit screening. Hiring coordination is provided when included in the programme scope; Nexara does not offer a general placement guarantee.'],
  marketing: ['Digital Marketing Agency in Visakhapatnam | Nexara', 'Nexara offers digital marketing in Visakhapatnam: brand identity, website development, content, SEO foundations and campaigns with defined reporting.', 'Digital marketing and website services in Vizag', 'Nexara Digital Solutions combines brand positioning, website development, content operations and campaigns for businesses in Visakhapatnam. Each engagement connects the offer, the website and the measurement plan so the work has a defined purpose.'],
  'marketing/brand': ['Brand Identity & Design in Visakhapatnam | Nexara', 'Build your brand in Visakhapatnam with Nexara: positioning, visual identity, messaging and launch assets with documented guidelines for consistent use.', 'Brand identity for businesses in Visakhapatnam', 'Turn your business offer into a clear positioning, visual identity and messaging system. Nexara builds brand assets and guidelines that can be carried consistently into your website, content and campaigns.'],
  'marketing/web': ['Website Design & Development in Visakhapatnam | Nexara', 'Nexara builds business websites, landing pages and product pages in Visakhapatnam with responsive layouts, clear enquiry flows and SEO foundations.', 'Website design and development in Visakhapatnam', 'For businesses in Vizag, Nexara designs corporate websites, landing pages and product pages around the visitor’s task. Scope can cover responsive design, development, enquiry flows, metadata, heading structure and internal links, with deliverables agreed before work begins.'],
  'marketing/growth': ['SEO & Growth Campaigns in Vizag | Nexara Digital', 'Plan SEO foundations, paid acquisition, retargeting and creative testing in Vizag with Nexara. Campaigns use defined audiences, budgets and reporting.', 'Growth campaigns for businesses in Vizag', 'Connect paid acquisition, content, retargeting and creative testing to a clear audience and offer. Nexara Digital Solutions defines the measurement and reporting scope before campaigns launch, so decisions can be made from evidence.'],
  labs: ['Software Development Company in Visakhapatnam | Nexara', 'Nexara develops custom software, SaaS, B2B portals and integrations in Visakhapatnam, with AI automation where it fits the business problem.', 'Custom software development in Visakhapatnam', 'Nexara Product Studio builds software for business operations: SaaS platforms, B2B portals, dashboards, internal tools and integrations. Work starts with the users and the business problem, then moves through architecture, development, QA and launch.'],
  'labs/products': ['Custom SaaS & B2B Software Development in Vizag | Nexara', 'Explore custom SaaS, B2B portals and software platforms built by Nexara in Vizag. Define users, workflows, integrations and the delivery scope.', 'SaaS and B2B software development in Vizag', 'Build a product around the workflows your users need: authentication, operational dashboards, business portals and connected systems. Nexara Product Studio in Visakhapatnam scopes the product, its integrations and the path from build to handover.'],
  'labs/ai-automation': ['AI Automation & Integration in Visakhapatnam | Nexara', 'Nexara scopes AI automation in Visakhapatnam: retrieval, agents, document AI and integrations with evaluation, guardrails and human review where needed.', 'AI automation for businesses in Visakhapatnam', 'Nexara applies retrieval, agent workflows and document AI where they can solve a defined operational problem. We scope the data sources, integrations, evaluation and review controls alongside the software.'],
  'labs/delivery': ['Software Build, QA & Delivery in Vizag | Nexara', 'See Nexara’s software delivery process in Vizag: architecture, iterative development, QA, production launch, monitoring and a defined support handover.', 'Software development from scope to launch in Vizag', 'A software project needs more than code. Nexara defines architecture, development stages, QA, hosting, access controls and monitoring before launch, with support or handover responsibilities agreed as part of the delivery scope.'],
  customers: ['Software & Digital Delivery Models in Vizag | Nexara', 'Explore Nexara’s delivery models for software, websites, marketing and Academy programmes in Vizag, with scoped work and documented handover expectations.', 'Review delivery models before choosing an IT partner', 'Explore how Nexara frames software, digital and Academy engagements: the written scope, the work produced and the readiness handed over. Discuss the applicable model, acceptance criteria and evidence requirements before agreeing an engagement.'],
  company: ['About Nexara | Software & IT Company in Visakhapatnam', 'Learn about Nexara Private Limited, a software and IT company in Visakhapatnam with Academy, Digital Solutions and Product Studio divisions.', 'A software and IT company based in Visakhapatnam', 'Nexara Private Limited operates from MVP Colony in Visakhapatnam, Andhra Pradesh. Our three divisions share a delivery standard: written scope, a named owner, a reporting cadence and clear handover responsibilities.'],
  contact: ['Contact Nexara in Visakhapatnam | Call 9257535757', 'Contact Nexara in MVP Colony, Visakhapatnam for software development, website design, marketing or training. Call 9257535757 or send your project brief.', 'Talk to our team in MVP Colony, Visakhapatnam', 'Call Nexara on 9257535757, email info@nexaragroups.com or visit our office in MVP Colony, Visakhapatnam. Tell us whether you need custom software, a website, digital marketing or an Academy programme so your request reaches the right team.'],
};

export const LOCAL_FAQS: Record<string, [string, string][]> = {
  'academy/internships': [
    ['Where can I enquire about a software internship in Vizag?', 'Contact Nexara Academy in MVP Colony, Visakhapatnam on 9257535757 or submit an Academy brief. Share your course, current skills, preferred project area and available dates so the team can discuss a suitable scope.'],
    ['Who are Nexara’s managed internships for?', 'Students, freshers and college teams can discuss a managed internship programme. The team will review the learners’ starting skills, project goals and academic reporting requirements before defining the programme.'],
    ['What project areas can I discuss?', 'Academy capabilities include full-stack development, data and AI, product design, and cloud operations. The project focus and deliverables are agreed for each internship programme.'],
    ['What will my internship completion report cover?', 'Completion reports document participation, capability and project quality. Mentor pods and weekly demos support progress reviews during the programme.'],
    ['How do I confirm duration, fees and the schedule?', 'Send your preferred dates and college requirements to Nexara Academy. Request written confirmation of the programme’s duration, schedule, fees, project deliverables and completion-report requirements before enrolling.'],
  ],
  home: [['What should I look for in a top IT company in Vizag?', 'Compare relevant work, technical capability, a written project scope, clear ownership, QA and support responsibilities. Ask how the team will report progress and hand over the finished system.'], ['Does Nexara develop both software and websites?', 'Yes. Product Studio handles custom software, SaaS and integrations; Digital Solutions handles business websites, landing pages and digital marketing. The scope is agreed for each engagement.']],
  'marketing/web': [['How do I choose the best website development company in Vizag?', 'Compare mobile usability, page performance, relevant work, clear content, SEO foundations and post-launch support. Request a written scope covering design, development, hosting and handover.'], ['Can Nexara build a website with SEO foundations?', 'Website engagements can include metadata, heading structure, internal linking, responsive layouts and an enquiry flow. Confirm the content, SEO and maintenance deliverables in your project scope.']],
  company: [['Where is Nexara based?', `${DATA.contact.address.street}, ${DATA.contact.address.city}.`], ['What should I look for in a top IT company in Vizag?', 'Review the team’s relevant capabilities, delivery process, ownership of code and accounts, QA approach and support scope. Nexara starts with a written brief and a named owner so these responsibilities can be discussed before a build.']],
};

export function routePath(theme: Theme | null, page = 'home', detail: string | null = null) {
  if (!theme || page === 'gateway') return '/';
  return '/' + [theme, page === 'home' ? null : page, detail].filter(Boolean).join('/');
}

export function getSeo(route: Pick<Route, 'theme' | 'page' | 'detail'>) {
  const { page, detail } = route;
  const key = page + (detail && sections[page] ? `/${detail}` : '');
  const validDetail = !detail || (sections[page]?.subpages.some(item => item.slug === detail)) || (page === 'customers' && !!sections[detail]) || (page === 'contact' && ['home', ...Object.keys(sections)].includes(detail));
  const entry = pages[key];
  if (!entry || !validDetail || (route.theme && !['trust', 'neo'].includes(route.theme))) return { valid: false, title: 'Page not found | Nexara', description: 'Find Nexara’s software, website, marketing and Academy services in Visakhapatnam.', robots: 'noindex, follow', canonical: null, schema: [] };
  let [title, description, heading, body] = entry;
  if (page === 'customers' && detail) {
    title = `${sections[detail]!.name} Delivery Models in Vizag | Nexara`;
    description = `Review Nexara’s ${sections[detail]!.name.toLowerCase()} delivery model in Visakhapatnam, including scope, deliverables and operational handover.`;
    heading = `${sections[detail]!.name} delivery models in Visakhapatnam`;
    body = `${sections[detail]!.name} engagements are framed around written requirements, the work delivered and operational readiness. Discuss the applicable delivery model and evidence requirements with Nexara before agreeing your project scope.`;
  }
  // Neo is an alternate presentation of the same business/service pages.
  const canonicalDetail = page === 'contact' ? null : detail;
  const canonical = SITE_URL + routePath(route.theme ? 'trust' : null, page, canonicalDetail);
  return { valid: true, key, title, description, heading, body, canonical, robots: INDEX_ROBOTS, faqs: LOCAL_FAQS[key] || [] };
}

export function getRoutes() {
  const routes: Route[] = [{ theme: null, page: 'gateway', detail: null, path: '' }];
  for (const theme of ['trust', 'neo'] as const) {
    for (const page of ['home', ...Object.keys(sections), 'customers', 'company', 'contact']) {
      routes.push({ theme, page, detail: null, path: routePath(theme, page).slice(1) });
      const details = sections[page]?.subpages.map(item => item.slug) || (page === 'customers' ? Object.keys(sections) : page === 'contact' ? ['home', ...Object.keys(sections)] : []);
      for (const detail of details) routes.push({ theme, page, detail, path: routePath(theme, page, detail).slice(1) });
    }
  }
  return routes;
}

export function getStructuredData(route: Pick<Route, 'theme' | 'page' | 'detail'>) {
  const seo = getSeo(route);
  if (!seo.valid) return { '@context': 'https://schema.org', '@graph': [] };
  const organizationId = `${SITE_URL}/#organization`;
  const organization = {
    '@type': ['Organization', 'LocalBusiness'], '@id': organizationId,
    name: 'Nexara', legalName: 'Nexara Private Limited', alternateName: ['Nexara Groups', 'Nexara Group'],
    url: `${SITE_URL}/`, logo: `${SITE_URL}/brand/nexara-logo.svg`, image: `${SITE_URL}/brand/og-image.png`,
    description: 'Software development, website design, digital marketing and technology training in Visakhapatnam (Vizag).',
    telephone: '+919257535757', email: 'info@nexaragroups.com', hasMap: DATA.contact.address.mapsHref,
    address: { '@type': 'PostalAddress', streetAddress: DATA.contact.address.street, addressLocality: 'Visakhapatnam', addressRegion: 'Andhra Pradesh', postalCode: '530017', addressCountry: 'IN' },
    areaServed: { '@type': 'City', name: 'Visakhapatnam', alternateName: 'Vizag' },
    contactPoint: { '@type': 'ContactPoint', telephone: '+919257535757', email: 'info@nexaragroups.com', contactType: 'project enquiries' },
  };
  const webPageId = `${seo.canonical}#webpage`;
  const graph: Record<string, unknown>[] = [organization, { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Nexara Groups', publisher: { '@id': organizationId }, inLanguage: 'en-IN' }, { '@type': route.page === 'contact' ? 'ContactPage' : route.page === 'company' ? 'AboutPage' : 'WebPage', '@id': webPageId, url: seo.canonical, name: seo.title, description: seo.description, isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': organizationId }, inLanguage: 'en-IN' }];
  if (route.theme) {
    const items: { '@type': string; position: number; name: string; item: string }[] = [{ '@type': 'ListItem', position: 1, name: 'Nexara', item: `${SITE_URL}/` }, { '@type': 'ListItem', position: 2, name: 'IT services', item: `${SITE_URL}/trust` }];
    if (route.page !== 'home') items.push({ '@type': 'ListItem', position: 3, name: sections[route.page]?.name || route.page[0]!.toUpperCase() + route.page.slice(1), item: SITE_URL + routePath('trust', route.page) });
    if (route.detail && route.page !== 'contact') items.push({ '@type': 'ListItem', position: items.length + 1, name: sections[route.page]?.subpages.find(item => item.slug === route.detail)?.title || sections[route.detail]?.name || route.detail, item: seo.canonical! });
    graph.push({ '@type': 'BreadcrumbList', '@id': `${seo.canonical}#breadcrumb`, itemListElement: items });
    graph[2]!.breadcrumb = { '@id': `${seo.canonical}#breadcrumb` };
  }
  if (sections[route.page]) graph.push({ '@type': 'Service', '@id': `${seo.canonical}#service`, name: seo.heading, description: seo.body, url: seo.canonical, provider: { '@id': organizationId }, areaServed: organization.areaServed, mainEntityOfPage: { '@id': webPageId } });
  return { '@context': 'https://schema.org', '@graph': graph };
}
