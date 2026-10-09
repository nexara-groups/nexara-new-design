import { DATA } from './data';
import type { Route, Theme } from './routes';
const sections: Record<string, (typeof DATA.sections)[keyof typeof DATA.sections]> = DATA.sections;

export const SITE_URL = 'https://nexaragroups.com';
export const INDEX_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

// One content registry drives build metadata, client navigation and the sitemap.
const pages: Record<string, [string, string, string, string]> = {
  gateway: ['Nexara | Software Company in Visakhapatnam (Vizag)', 'Nexara is a software company in Visakhapatnam. We build custom software and websites, run digital marketing, and train the next batch of tech talent.', 'Software and website development in Visakhapatnam', 'Nexara Private Limited builds software and websites, runs digital marketing and trains tech talent, all in Visakhapatnam (Vizag). Product Studio, Digital Solutions and Academy are three teams under one roof. Pick the one that fits your project.'],
  home: ['IT Company in Vizag | Software & Web Development | Nexara', 'Nexara is an IT company in Vizag. Custom software, SaaS, websites, digital marketing and talent programmes, from our office in MVP Colony.', 'An IT company in Vizag for people, products and growth', 'From our office in MVP Colony, Visakhapatnam, we help businesses build software, launch websites and connect their tools. Academy trains technical talent, Digital Solutions builds market presence, and Product Studio delivers software and automation.'],
  academy: ['Software Training in Visakhapatnam | Nexara Academy', 'Software training in Visakhapatnam: full-stack, AI, design and cloud tracks, with real projects, mentor reviews, internships and placement prep.', 'Technology training in Visakhapatnam', 'Nexara Academy works with learners, colleges and employers in Visakhapatnam through structured training, real projects and mentor reviews. Pick a technical track, talk to us about a managed internship, or plan placement prep for a specific role.'],
  'academy/tracks': ['Full Stack & AI Courses in Visakhapatnam | Nexara', 'Compare Nexara Academy tracks in full-stack development, AI and data, design and cloud operations. Project-led tech training in Visakhapatnam.', 'Choose a software training track in Vizag', 'Our tracks cover full-stack development, AI and data, product design and cloud operations. Tell Nexara Academy your current skills, the role you’re aiming for and what you want to build, and we’ll work out the right learning scope.'],
  'academy/internships': ['Software Internships in Vizag & Visakhapatnam | Nexara', 'Software internships in Vizag with Nexara Academy: mentor pods, real projects, weekly demos and a completion report. Call 9257535757.', 'Managed software internships in Visakhapatnam', 'Nexara Academy runs managed internships built around real projects, for learners and institutions. Mentor pods, weekly reviews and completion reports let learners and college placement teams in Vizag see progress.'],
  'academy/placements': ['IT Placement Preparation in Vizag | Nexara Academy', 'Get ready for IT roles in Vizag with portfolio reviews, interview practice and matching with employers. Talk to Nexara Academy about what you need.', 'Prepare for IT opportunities in Vizag', 'Get interview-ready with portfolio support, technical and behavioural interview practice, and role-fit screening. We coordinate with hiring partners when that’s in your programme scope. We don’t offer a general placement guarantee.'],
  marketing: ['Digital Marketing Agency in Visakhapatnam | Nexara', 'Digital marketing in Visakhapatnam: brand identity, websites, content, SEO basics and campaigns, with reporting you can actually read.', 'Digital marketing and website services in Vizag', 'Nexara Digital Solutions puts brand positioning, websites, content and campaigns together for businesses in Visakhapatnam. Every engagement ties the offer, the website and the measurement plan together, so each piece of work has a reason.'],
  'marketing/brand': ['Brand Identity & Design in Visakhapatnam | Nexara', 'Brand identity in Visakhapatnam: positioning, visual identity, messaging and launch assets, with written guidelines so the brand stays consistent.', 'Brand identity for businesses in Visakhapatnam', 'We turn your offer into clear positioning, a visual identity and messaging. The brand assets and guidelines we build carry straight into your website, content and campaigns.'],
  'marketing/web': ['Website Design & Development in Visakhapatnam | Nexara', 'Business websites, landing pages and product pages in Visakhapatnam, built to work on mobile, with clear enquiry flows and SEO basics.', 'Website design and development in Visakhapatnam', 'For businesses in Vizag, we design corporate sites, landing pages and product pages around what the visitor came to do. Scope can include responsive design, development, enquiry flows, metadata, heading structure and internal links. We agree the deliverables before work starts.'],
  'marketing/growth': ['SEO & Growth Campaigns in Vizag | Nexara Digital', 'SEO, paid ads, retargeting and creative testing in Vizag. Every campaign has a defined audience, budget and reporting.', 'Growth campaigns for businesses in Vizag', 'We tie paid ads, content, retargeting and creative testing to a clear audience and offer. Nexara Digital Solutions agrees what gets measured and reported before a campaign launches, so decisions come from evidence.'],
  labs: ['Software Development Company in Visakhapatnam | Nexara', 'Custom software, SaaS, B2B portals and integrations in Visakhapatnam, with AI automation where it fits the business problem.', 'Custom software development in Visakhapatnam', 'Nexara Product Studio builds software that runs business operations: SaaS platforms, B2B portals, dashboards, internal tools and integrations. We start with the users and the business problem, then move through architecture, development, QA and launch.'],
  'labs/products': ['Custom SaaS & B2B Software Development in Vizag | Nexara', 'Custom SaaS, B2B portals and software platforms built in Vizag. We define the users, workflows, integrations and delivery scope with you.', 'SaaS and B2B software development in Vizag', 'We build the product around the workflows your users actually need: login, operational dashboards, business portals and connected systems. Nexara Product Studio in Visakhapatnam scopes the product, its integrations and the road from build to handover.'],
  'labs/ai-automation': ['AI Automation & Integration in Visakhapatnam | Nexara', 'AI automation in Visakhapatnam: retrieval, agents, document AI and integrations, with evaluation, guardrails and human review where they matter.', 'AI automation for businesses in Visakhapatnam', 'We use retrieval, agent workflows and document AI when they solve a specific operational problem. The data sources, integrations, evaluation and review controls get scoped together with the software.'],
  'labs/delivery': ['Software Build, QA & Delivery in Vizag | Nexara', 'How we deliver software in Vizag: architecture, iterative development, QA, launch, monitoring and a clear support handover.', 'Software development from scope to launch in Vizag', 'A software project needs more than code. Before launch we define the architecture, development stages, QA, hosting, access controls and monitoring, and agree who handles support or handover.'],
  customers: ['Our Work & Clients in Vizag — SaaS, Websites, Marketing | Nexara', 'Live work we’ve built for Happy Farms, Rise Medical Hub, Qualigene and Sai Nirmaan Architects: a SaaS platform, a medical library, sales calculators, websites and digital marketing.', 'Review delivery models before choosing an IT partner', 'See how we run software, digital and Academy engagements: the written scope, the work produced and what we hand over. Talk through the delivery model, acceptance criteria and evidence you need before agreeing to anything.'],
  company: ['About Nexara | Software & IT Company in Visakhapatnam', 'About Nexara Private Limited, a software and IT company in Visakhapatnam with three teams: Academy, Digital Solutions and Product Studio.', 'A software and IT company based in Visakhapatnam', 'Nexara Private Limited works from MVP Colony in Visakhapatnam, Andhra Pradesh. Our three divisions share one way of delivering: a written scope, a named owner, a reporting cadence and clear handover responsibilities.'],
  contact: ['Contact Nexara in Visakhapatnam | Call 9257535757', 'Talk to Nexara in MVP Colony, Visakhapatnam about software, websites, marketing or training. Call 9257535757 or send your project brief.', 'Talk to our team in MVP Colony, Visakhapatnam', 'Call us on 9257535757, email info@nexaragroups.com or drop by our office in MVP Colony, Visakhapatnam. Tell us whether you need software, a website, digital marketing or an Academy programme, and your request goes to the right team.'],
};

export const LOCAL_FAQS: Record<string, [string, string][]> = {
  'academy/internships': [
    ['Where can I enquire about a software internship in Vizag?', 'Contact Nexara Academy in MVP Colony, Visakhapatnam on 9257535757 or submit an Academy brief. Share your course, current skills, preferred project area and available dates so the team can discuss a suitable scope.'],
    ['Who are Nexara’s managed internships for?', 'Students, freshers and college teams can discuss a managed internship programme. The team will review the learners’ starting skills, project goals and academic reporting requirements before defining the programme.'],
    ['What project areas can I discuss?', 'Academy capabilities include full-stack development, data and AI, product design, and cloud operations. The project focus and deliverables are agreed for each internship programme.'],
    ['What will my internship completion report cover?', 'Completion reports document participation, capability and project quality. Mentor pods and weekly demos support progress reviews during the programme.'],
    ['How do I confirm duration, fees and the schedule?', 'Send your preferred dates and college requirements to Nexara Academy. Request written confirmation of the programme’s duration, schedule, fees, project deliverables and completion-report requirements before enrolling.'],
  ],
  home: [['What should I look for in a top IT company in Vizag?', 'Look at their relevant work, technical skills, a written scope, who owns what, and who handles QA and support. Ask how they’ll report progress and hand over the finished system.'], ['Does Nexara develop both software and websites?', 'Yes. Product Studio handles custom software, SaaS and integrations. Digital Solutions handles business websites, landing pages and digital marketing. We agree the scope for each project.']],
  'marketing/web': [['How do I choose the best website development company in Vizag?', 'Compare how they handle mobile, page speed, relevant work, content and SEO basics, plus what support looks like after launch. Ask for a written scope that covers design, development, hosting and handover.'], ['Can Nexara build a website with SEO foundations?', 'Website engagements can include metadata, heading structure, internal linking, responsive layouts and an enquiry flow. Confirm the content, SEO and maintenance deliverables in your project scope.']],
  company: [['Where is Nexara based?', `${DATA.contact.address.street}, ${DATA.contact.address.city}.`], ['What should I look for in a top IT company in Vizag?', 'Check the team’s relevant skills, delivery process, who owns the code and accounts, how they do QA and what support covers. At Nexara we start with a written brief and a named owner, so all of this is settled before a build.']],
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
  if (!entry || !validDetail || (route.theme && !['trust', 'neo'].includes(route.theme))) return { valid: false, title: 'Page not found | Nexara', description: 'Software, website, marketing and Academy services from Nexara in Visakhapatnam.', robots: 'noindex, follow', canonical: null, schema: [] };
  let [title, description, heading, body] = entry;
  if (page === 'customers' && detail) {
    title = `${sections[detail]!.name} Delivery Models in Vizag | Nexara`;
    description = `How Nexara's ${sections[detail]!.name.toLowerCase()} work runs in Visakhapatnam: scope, deliverables and handover.`;
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
    url: `${SITE_URL}/`, logo: `${SITE_URL}/brand/nexara-logo-512.png`, sameAs: DATA.contact.social.map(link => link.href), image: `${SITE_URL}/brand/og-image.png`,
    description: 'Software, websites, digital marketing and tech training in Visakhapatnam (Vizag).',
    telephone: '+919257535757', email: 'info@nexaragroups.com', hasMap: DATA.contact.address.mapsHref,
    address: { '@type': 'PostalAddress', streetAddress: DATA.contact.address.street, addressLocality: 'Visakhapatnam', addressRegion: 'Andhra Pradesh', postalCode: '530017', addressCountry: 'IN' },
    areaServed: { '@type': 'City', name: 'Visakhapatnam', alternateName: 'Vizag' },
    contactPoint: { '@type': 'ContactPoint', telephone: '+919257535757', email: 'info@nexaragroups.com', contactType: 'project enquiries' },
  };
  const webPageId = `${seo.canonical}#webpage`;
  const graph: Record<string, unknown>[] = [organization, { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Nexara', alternateName: ['Nexara Groups', 'Nexara Private Limited', 'nexaragroups.com'], publisher: { '@id': organizationId }, inLanguage: 'en-IN' }, { '@type': route.page === 'contact' ? 'ContactPage' : route.page === 'company' ? 'AboutPage' : 'WebPage', '@id': webPageId, url: seo.canonical, name: seo.title, description: seo.description, isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': organizationId }, inLanguage: 'en-IN' }];
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
