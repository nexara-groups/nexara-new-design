import { DATA } from './data';
import type { Route, Theme } from './routes';
import { BLOG_POSTS, BLOG_DESCRIPTION, type BlogPost } from './blog';
const sections: Record<string, (typeof DATA.sections)[keyof typeof DATA.sections]> = DATA.sections;

export const SITE_URL = 'https://nexaragroups.com';
export const INDEX_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

// One content registry drives build metadata, client navigation and the sitemap.
const pages: Record<string, [string, string, string, string]> = {
  gateway: ['Nexara | Software Company in Visakhapatnam (Vizag)', 'Nexara is a software company in Visakhapatnam. We build custom software and websites, run digital marketing, and train the next batch of tech talent.', 'Software and website development in Visakhapatnam', 'Nexara Private Limited builds software and websites, runs digital marketing and trains tech talent, all in Visakhapatnam (Vizag). Software, digital marketing and training are three teams under one roof. Pick the one that fits your project.'],
  home: ['Nexara | Software, Digital Marketing & Tech Training', 'Nexara Private Limited: custom software, websites, digital marketing and tech training from Visakhapatnam, India.', 'An IT company in Vizag for people, products and growth', 'From our office in MVP Colony, Visakhapatnam, we help businesses build software, launch websites and connect their tools. We prepare technical talent through training programmes, build market presence through digital marketing, and deliver software and automation.'],
  academy: ['Software Training in Visakhapatnam | Nexara', 'Software training in Visakhapatnam: full-stack, AI, design and cloud tracks, with real projects, mentor reviews, internships and placement prep.', 'Technology training in Visakhapatnam', 'Nexara works with learners, colleges and employers in Visakhapatnam through structured training, real projects and mentor reviews. Pick a technical track, talk to us about a managed internship, or plan placement prep for a specific role.'],
  'academy/tracks': ['Full Stack & AI Courses in Visakhapatnam | Nexara', 'Compare Nexara training tracks in full-stack development, AI and data, design and cloud operations. Project-led tech training in Visakhapatnam.', 'Choose a software training track in Vizag', 'Our tracks cover full-stack development, AI and data, product design and cloud operations. Tell Nexara your current skills, the role you’re aiming for and what you want to build, and we’ll work out the right learning scope.'],
  'academy/internships': ['Software Internships in Vizag & Visakhapatnam | Nexara', 'Software internships in Vizag with Nexara: mentor pods, real projects, weekly demos and a completion report. Call 9257535757.', 'Managed software internships in Visakhapatnam', 'Nexara runs managed internships built around real projects, for learners and institutions. Mentor pods, weekly reviews and completion reports let learners and college placement teams in Vizag see progress.'],
  'academy/placements': ['IT Placement Preparation in Vizag | Nexara', 'Get ready for IT roles in Vizag with portfolio reviews, interview practice and matching with employers. Talk to Nexara about what you need.', 'Prepare for IT opportunities in Vizag', 'Get interview-ready with portfolio support, technical and behavioural interview practice, and role-fit screening. We coordinate with hiring partners when that’s in your programme scope. We don’t offer a general placement guarantee.'],
  marketing: ['Digital Marketing Agency in Visakhapatnam | Nexara', 'Digital marketing in Visakhapatnam: brand identity, websites, content, SEO basics and campaigns, with reporting you can actually read.', 'Digital marketing and website services in Vizag', 'Nexara puts brand positioning, websites, content and campaigns together for businesses in Visakhapatnam. Every engagement ties the offer, the website and the measurement plan together, so each piece of work has a reason.'],
  'marketing/brand': ['Brand Identity & Design in Visakhapatnam | Nexara', 'Brand identity in Visakhapatnam: positioning, visual identity, messaging and launch assets, with written guidelines so the brand stays consistent.', 'Brand identity for businesses in Visakhapatnam', 'We turn your offer into clear positioning, a visual identity and messaging. The brand assets and guidelines we build carry straight into your website, content and campaigns.'],
  'marketing/web': ['Website Design & Development in Visakhapatnam | Nexara', 'Business websites, landing pages and product pages in Visakhapatnam, built to work on mobile, with clear enquiry flows and SEO basics.', 'Website design and development in Visakhapatnam', 'For businesses in Vizag, we design corporate sites, landing pages and product pages around what the visitor came to do. Scope can include responsive design, development, enquiry flows, metadata, heading structure and internal links. We agree the deliverables before work starts.'],
  'marketing/growth': ['SEO & Growth Campaigns in Vizag | Nexara', 'SEO, paid ads, retargeting and creative testing in Vizag. Every campaign has a defined audience, budget and reporting.', 'Growth campaigns for businesses in Vizag', 'We tie paid ads, content, retargeting and creative testing to a clear audience and offer. Nexara agrees what gets measured and reported before a campaign launches, so decisions come from evidence.'],
  labs: ['Software Development Company in Visakhapatnam | Nexara', 'Custom software, SaaS, B2B portals and integrations in Visakhapatnam, with AI automation where it fits the business problem.', 'Custom software development in Visakhapatnam', 'Nexara builds software that runs business operations: SaaS platforms, B2B portals, dashboards, internal tools and integrations. We start with the users and the business problem, then move through architecture, development, QA and launch.'],
  'labs/products': ['Custom SaaS & B2B Software Development in Vizag | Nexara', 'Custom SaaS, B2B portals and software platforms built in Vizag. We define the users, workflows, integrations and delivery scope with you.', 'SaaS and B2B software development in Vizag', 'We build the product around the workflows your users actually need: login, operational dashboards, business portals and connected systems. Nexara in Visakhapatnam scopes the product, its integrations and the road from build to handover.'],
  'labs/ai-automation': ['AI Automation & Integration in Visakhapatnam | Nexara', 'AI automation in Visakhapatnam: retrieval, agents, document AI and integrations, with evaluation, guardrails and human review where they matter.', 'AI automation for businesses in Visakhapatnam', 'We use retrieval, agent workflows and document AI when they solve a specific operational problem. The data sources, integrations, evaluation and review controls get scoped together with the software.'],
  'labs/ecommerce': ['E-commerce Website Development in Visakhapatnam | Nexara', 'E-commerce and product site development in Visakhapatnam: catalogues, model directories, calculators and quote flows, built after we understand your business.', 'E-commerce and product sites in Visakhapatnam', 'Nexara builds product catalogues, model directories, calculators and enquiry flows for businesses in Visakhapatnam that sell considered purchases. We learn the business first, prototype with you, and build only what it needs.'],
  'labs/delivery': ['Software Build, QA & Delivery in Vizag | Nexara', 'How we deliver software in Vizag: architecture, iterative development, QA, launch, monitoring and a clear support handover.', 'Software development from scope to launch in Vizag', 'A software project needs more than code. Before launch we define the architecture, development stages, QA, hosting, access controls and monitoring, and agree who handles support or handover.'],
  customers: ['Our Work & Clients in Vizag — SaaS, Websites, Marketing | Nexara', 'Live work we’ve built for Happy Farms, Sri Engineering Works, Rise Medical Hub, Qualigene and Sai Nirmaan Architects: a SaaS platform, an e-commerce site, a medical library, sales calculators, websites and digital marketing.', 'Review delivery models before choosing an IT partner', 'See how we run software, digital marketing and training engagements: the written scope, the work produced and what we hand over. Talk through the delivery model, acceptance criteria and evidence you need before agreeing to anything.'],
  company: ['About Nexara | Software & IT Company in Visakhapatnam', 'About Nexara Private Limited, a software and IT company in Visakhapatnam with three teams: tech training, digital marketing and custom software.', 'A software and IT company based in Visakhapatnam', 'Nexara Private Limited works from MVP Colony in Visakhapatnam, Andhra Pradesh. Our three divisions share one way of delivering: a written scope, a named owner, a reporting cadence and clear handover responsibilities.'],
  contact: ['Contact Nexara in Visakhapatnam | Call 9257535757', 'Talk to Nexara in MVP Colony, Visakhapatnam about software, websites, marketing or training. Call 9257535757 or send your project brief.', 'Talk to our team in MVP Colony, Visakhapatnam', 'Call us on 9257535757, email info@nexaragroups.com or drop by our office in MVP Colony, Visakhapatnam. Tell us whether you need software, a website, digital marketing or a training programme, and your request goes to the right team.'],
};

export const LOCAL_FAQS: Record<string, [string, string][]> = {
  'labs/ecommerce': [
    ['Do you build e-commerce websites in Visakhapatnam?', 'Yes. Nexara builds e-commerce and product sites: catalogues, model directories, calculators, quote and site-survey flows, and a blog. We agree the scope in writing before work starts.'],
    ['How do you approach an e-commerce or product site?', 'We start by understanding how your business sells, then build more than one prototype so you can react to something real. We deliver what the business needs and leave out what it does not.'],
  ],
  'academy/internships': [
    ['Where can I enquire about a software internship in Vizag?', 'Contact Nexara in MVP Colony, Visakhapatnam on 9257535757 or send a training brief. Share your course, current skills, preferred project area and available dates so the team can discuss a suitable scope.'],
    ['Who are Nexara’s managed internships for?', 'Students, freshers and college teams can discuss a managed internship programme. The team will review the learners’ starting skills, project goals and academic reporting requirements before defining the programme.'],
    ['What project areas can I discuss?', 'Our training covers full-stack development, data and AI, product design, and cloud operations. The project focus and deliverables are agreed for each internship programme.'],
    ['What will my internship completion report cover?', 'Completion reports document participation, capability and project quality. Mentor pods and weekly demos support progress reviews during the programme.'],
    ['How do I confirm duration, fees and the schedule?', 'Send your preferred dates and college requirements to Nexara. Request written confirmation of the programme’s duration, schedule, fees, project deliverables and completion-report requirements before enrolling.'],
  ],
  home: [['Is Nexara the same as Nexera, Nexora or Nexar?', 'No. We are Nexara, spelled N-E-X-A-R-A: Nexara Private Limited, based in Visakhapatnam, India, at nexaragroups.com. We are not affiliated with other companies that have similar names.'], ['What should I look for in a top IT company in Vizag?', 'Look at their relevant work, technical skills, a written scope, who owns what, and who handles QA and support. Ask how they’ll report progress and hand over the finished system.'], ['Does Nexara develop both software and websites?', 'Yes. Our software team handles custom software, SaaS and integrations. Our digital marketing team handles business websites, landing pages and campaigns. We agree the scope for each project.']],
  'marketing/web': [['How do I choose the best website development company in Vizag?', 'Compare how they handle mobile, page speed, relevant work, content and SEO basics, plus what support looks like after launch. Ask for a written scope that covers design, development, hosting and handover.'], ['Can Nexara build a website with SEO foundations?', 'Website engagements can include metadata, heading structure, internal linking, responsive layouts and an enquiry flow. Confirm the content, SEO and maintenance deliverables in your project scope.']],
  company: [['Where is Nexara based?', `${DATA.contact.address.street}, ${DATA.contact.address.city}.`], ['What should I look for in a top IT company in Vizag?', 'Check the team’s relevant skills, delivery process, who owns the code and accounts, how they do QA and what support covers. At Nexara we start with a written brief and a named owner, so all of this is settled before a build.']],
};

// Neo is the primary presentation: its home page is '/', the Neo/Trust chooser lives at /gateway,
// and every other page's canonical URL is its /neo/... path (Trust pages are alternates).
export function routePath(theme: Theme | null, page = 'home', detail: string | null = null) {
  if (page === 'gateway') return '/gateway';
  if (!theme) theme = 'neo';
  if (theme === 'neo' && page === 'home') return '/';
  return '/' + [theme, page === 'home' ? null : page, detail].filter(Boolean).join('/');
}

export function getSeo(route: Pick<Route, 'theme' | 'page' | 'detail'>) {
  const { page, detail } = route;
  const key = page + (detail && sections[page] ? `/${detail}` : '');
  const validDetail = !detail || (sections[page]?.subpages.some(item => item.slug === detail)) || (page === 'customers' && !!sections[detail]) || (page === 'contact' && ['home', ...Object.keys(sections)].includes(detail));
  const entry = pages[key];
  if (!entry || !validDetail || (route.theme && !['trust', 'neo'].includes(route.theme))) return { valid: false, title: 'Page not found | Nexara', description: 'Software, website, marketing and training services from Nexara in Visakhapatnam.', robots: 'noindex, follow', canonical: null, schema: [] };
  let [title, description, heading, body] = entry;
  if (page === 'customers' && detail) {
    // Theme-neutral service names: Neo and Trust call the teams different things, Google shows one text.
    const svc = ({ academy: 'Tech training', marketing: 'Digital marketing', labs: 'Software development' } as Record<string, string>)[detail] || sections[detail]!.name;
    title = `${svc.replace(/\b\w/g, c => c.toUpperCase())} Delivery Models in Vizag | Nexara`;
    description = `How Nexara's ${svc.toLowerCase()} work runs in Visakhapatnam: scope, deliverables and handover.`;
    heading = `${svc} delivery models in Visakhapatnam`;
    body = `${svc} engagements are framed around written requirements, the work delivered and operational readiness. Discuss the applicable delivery model and evidence requirements with Nexara before agreeing your project scope.`;
  }
  // Trust is an alternate presentation of the same pages; every theme canonicalises to Neo.
  // The /gateway chooser is a utility page and stays out of the index.
  const isGateway = page === 'gateway';
  const canonicalDetail = page === 'contact' ? null : detail;
  const canonical = SITE_URL + routePath('neo', page, canonicalDetail);
  return { valid: true, key, title, description, heading, body, canonical, robots: isGateway ? 'noindex, follow' : INDEX_ROBOTS, faqs: LOCAL_FAQS[key] || [] };
}

export function getRoutes() {
  const routes: Route[] = [{ theme: null, page: 'gateway', detail: null, path: 'gateway' }];
  for (const theme of ['trust', 'neo'] as const) {
    for (const page of ['home', ...Object.keys(sections), 'customers', 'company', 'contact']) {
      routes.push({ theme, page, detail: null, path: routePath(theme, page).slice(1) });
      const details = sections[page]?.subpages.map(item => item.slug) || (page === 'customers' ? Object.keys(sections) : page === 'contact' ? ['home', ...Object.keys(sections)] : []);
      for (const detail of details) routes.push({ theme, page, detail, path: routePath(theme, page, detail).slice(1) });
    }
  }
  return routes;
}

const organizationId = `${SITE_URL}/#organization`;
function organizationNode() {
  return {
    '@type': ['Organization', 'LocalBusiness'], '@id': organizationId,
    name: 'Nexara', legalName: DATA.contact.legal.name, foundingDate: DATA.contact.legal.incorporated, taxID: DATA.contact.legal.gstin,
    identifier: { '@type': 'PropertyValue', propertyID: 'CIN', value: DATA.contact.legal.cin }, alternateName: ['Nexara Private Limited'],
    url: `${SITE_URL}/`, logo: `${SITE_URL}/brand/nexara-logo-512.png`, sameAs: DATA.contact.social.map(link => link.href), image: `${SITE_URL}/brand/og-image.png`,
    description: 'Software, websites, digital marketing and tech training in Visakhapatnam (Vizag).',
    telephone: '+919257535757', email: 'info@nexaragroups.com', hasMap: DATA.contact.address.mapsHref,
    address: { '@type': 'PostalAddress', streetAddress: DATA.contact.address.street, addressLocality: 'Visakhapatnam', addressRegion: 'Andhra Pradesh', postalCode: '530017', addressCountry: 'IN' },
    areaServed: { '@type': 'City', name: 'Visakhapatnam', alternateName: 'Vizag' },
    contactPoint: { '@type': 'ContactPoint', telephone: '+919257535757', email: 'info@nexaragroups.com', contactType: 'project enquiries' },
  };
}

export function getStructuredData(route: Pick<Route, 'theme' | 'page' | 'detail'>) {
  const seo = getSeo(route);
  if (!seo.valid) return { '@context': 'https://schema.org', '@graph': [] };
  const organization: ReturnType<typeof organizationNode> & { founder?: { '@id': string }[] } = organizationNode();
  const webPageId = `${seo.canonical}#webpage`;
  const graph: Record<string, unknown>[] = [organization, { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Nexara', alternateName: ['Nexara Private Limited', 'nexaragroups.com'], publisher: { '@id': organizationId }, inLanguage: 'en-IN' }, { '@type': route.page === 'contact' ? 'ContactPage' : route.page === 'company' ? 'AboutPage' : 'WebPage', '@id': webPageId, url: seo.canonical, name: seo.title, description: seo.description, isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': organizationId }, inLanguage: 'en-IN' }];
  if (route.theme) {
    const items: { '@type': string; position: number; name: string; item: string }[] = [{ '@type': 'ListItem', position: 1, name: 'Nexara', item: `${SITE_URL}/` }];
    if (route.page !== 'home') items.push({ '@type': 'ListItem', position: 2, name: sections[route.page]?.name || route.page[0]!.toUpperCase() + route.page.slice(1), item: SITE_URL + routePath('neo', route.page) });
    if (route.detail && route.page !== 'contact') items.push({ '@type': 'ListItem', position: items.length + 1, name: sections[route.page]?.subpages.find(item => item.slug === route.detail)?.title || sections[route.detail]?.name || route.detail, item: seo.canonical! });
    graph.push({ '@type': 'BreadcrumbList', '@id': `${seo.canonical}#breadcrumb`, itemListElement: items });
    graph[2]!.breadcrumb = { '@id': `${seo.canonical}#breadcrumb` };
  }
  if (route.page === 'company' && DATA.company.founders.length) {
    const people = DATA.company.founders.map((f, i) => ({ '@type': 'Person', '@id': `${SITE_URL}/#founder-${i + 1}`, name: f.name, jobTitle: f.role, worksFor: { '@id': organizationId }, ...(f.photo ? { image: SITE_URL + f.photo } : {}), ...(f.bio ? { description: f.bio } : {}), ...(f.linkedin ? { sameAs: [f.linkedin] } : {}) }));
    organization.founder = people.map(person => ({ '@id': person['@id'] }));
    graph.push(...people);
  }
  if (sections[route.page]) graph.push({ '@type': 'Service', '@id': `${seo.canonical}#service`, name: seo.heading, description: seo.body, url: seo.canonical, provider: { '@id': organizationId }, areaServed: organization.areaServed, mainEntityOfPage: { '@id': webPageId } });
  return { '@context': 'https://schema.org', '@graph': graph };
}

// Blog JSON-LD. Publisher is the same Organization node (@id) the rest of the site uses.
const websiteNode = () => ({ '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Nexara', alternateName: ['Nexara Private Limited', 'nexaragroups.com'], publisher: { '@id': organizationId }, inLanguage: 'en-IN' });
const crumbs = (items: [string, string][]) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) });
export const blogUrl = (slug?: string) => `${SITE_URL}/blog${slug ? '/' + slug : ''}`;

export function getBlogIndexStructuredData() {
  const url = blogUrl();
  return { '@context': 'https://schema.org', '@graph': [
    organizationNode(), websiteNode(),
    { '@type': 'Blog', '@id': `${url}#blog`, url, name: 'Nexara Blog', description: BLOG_DESCRIPTION, publisher: { '@id': organizationId }, isPartOf: { '@id': `${SITE_URL}/#website` }, inLanguage: 'en-IN',
      blogPost: BLOG_POSTS.map(post => ({ '@type': 'BlogPosting', '@id': `${blogUrl(post.slug)}#post`, headline: post.title, url: blogUrl(post.slug), datePublished: post.date })) },
    { ...crumbs([['Nexara', `${SITE_URL}/`], ['Blog', url]]), '@id': `${url}#breadcrumb` },
  ] };
}

export function getBlogPostStructuredData(post: BlogPost) {
  const url = blogUrl(post.slug);
  const words = post.body.reduce((n, b) => n + (b.type === 'ul' ? b.items.join(' ') : b.text).split(/\s+/).length, 0);
  return { '@context': 'https://schema.org', '@graph': [
    organizationNode(), websiteNode(),
    { '@type': 'BlogPosting', '@id': `${url}#post`, headline: post.title, description: post.description, url, mainEntityOfPage: { '@type': 'WebPage', '@id': url }, datePublished: post.date, dateModified: post.date,
      author: { '@type': 'Organization', name: post.author, url: `${SITE_URL}/` }, publisher: { '@id': organizationId }, isPartOf: { '@id': `${blogUrl()}#blog` },
      image: `${SITE_URL}/brand/og-image.png`, keywords: post.tags.join(', '), wordCount: words, inLanguage: 'en-IN', breadcrumb: { '@id': `${url}#breadcrumb` } },
    { ...crumbs([['Nexara', `${SITE_URL}/`], ['Blog', blogUrl()], [post.title, url]]), '@id': `${url}#breadcrumb` },
  ] };
}
