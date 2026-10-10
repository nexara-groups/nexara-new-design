import { DATA } from './data';
import type { Route, Theme } from './routes';
import { BLOG_POSTS, BLOG_DESCRIPTION, type BlogPost } from './blog';
const sections: Record<string, (typeof DATA.sections)[keyof typeof DATA.sections]> = DATA.sections;

export const SITE_URL = 'https://nexaragroups.com';
export const INDEX_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

// One content registry drives build metadata, client navigation and the sitemap.
const pages: Record<string, [string, string, string, string]> = {
  gateway: ['Nexara | Software Company in Visakhapatnam (Vizag)', 'Nexara is a software company in Visakhapatnam. We build custom software and websites, run digital marketing, and train the next batch of tech talent.', 'Software and website development in Visakhapatnam', 'Nexara Private Limited builds software and websites, runs digital marketing and trains tech talent, all in Visakhapatnam (Vizag). Software, digital marketing and training are three teams under one roof. Pick the one that fits your project.'],
  home: ['Nexara | Software Company in Vizag & Website Development', 'Nexara Private Limited builds software, websites, SaaS and digital marketing from MVP Colony, Visakhapatnam (Vizag). Call 9257535757.', 'Software company in Vizag for websites, products and growth', 'From our office in MVP Colony, Visakhapatnam, we help businesses build software, launch websites and connect their tools. We prepare technical talent through training programmes, build market presence through digital marketing, and deliver software and automation.'],
  academy: ['Software Training in Visakhapatnam | Nexara', 'Software training in Visakhapatnam: full-stack, AI, design and cloud tracks, with real projects, mentor reviews, internships and placement prep.', 'Technology training in Visakhapatnam', 'Nexara works with learners, colleges and employers in Visakhapatnam through structured training, real projects and mentor reviews. Pick a technical track, talk to us about a managed internship, or plan placement prep for a specific role.'],
  'academy/tracks': ['Full Stack & AI Courses in Visakhapatnam | Nexara', 'Compare Nexara training tracks in full-stack development, AI and data, design and cloud operations. Project-led tech training in Visakhapatnam.', 'Choose a software training track in Vizag', 'Our tracks cover full-stack development, AI and data, product design and cloud operations. Tell Nexara your current skills, the role you’re aiming for and what you want to build, and we’ll work out the right learning scope.'],
  'academy/internships': ['Software Internships in Vizag & Visakhapatnam | Nexara', 'Software internships in Vizag with Nexara: mentor pods, real projects, weekly demos and a completion report. Call 9257535757.', 'Managed software internships in Visakhapatnam', 'Nexara runs managed internships built around real projects, for learners and institutions. Mentor pods, weekly reviews and completion reports let learners and college placement teams in Vizag see progress.'],
  'academy/placements': ['IT Placement Preparation in Vizag | Nexara', 'Get ready for IT roles in Vizag with portfolio reviews, interview practice and matching with employers. Talk to Nexara about what you need.', 'Prepare for IT opportunities in Vizag', 'Get interview-ready with portfolio support, technical and behavioural interview practice, and role-fit screening. We coordinate with hiring partners when that’s in your programme scope. We don’t offer a general placement guarantee.'],
  marketing: ['Websites & Digital Marketing in Visakhapatnam | Nexara', 'Websites and digital marketing in Visakhapatnam (Vizag): web design, SEO, Google Business listings and content, from our office in MVP Colony.', 'Found, trusted, then grown', 'Nexara builds the digital presence a customer meets when they search, then search and content visibility, then paid ads, retargeting and creators. Spend starts after the business can be found and contacted. AI citations are not guaranteed.'],
  labs: ['Software Development Company in Visakhapatnam | Nexara', 'Nexara Labs builds software in Vizag: Nexara Voice, Agency OS, Academy & Sports apps, HappyGrow, custom SaaS and AI workflows.', 'Custom software, portals and SaaS in Visakhapatnam', 'Nexara Labs ships software that runs operations: Nexara Voice, Agency OS, Academy & Sports apps (Happy Forms registration), HappyGrow, inventory and catalogue tools, plus learning, HR, billing and workflow builds. Architecture, development, QA and launch sit under one Product Studio.'],
  'labs/products': ['Custom SaaS & B2B Software Development in Vizag | Nexara', 'Custom SaaS and B2B portals built in Vizag with Next.js, React, Node.js and Python. We agree users, workflows, integrations and delivery scope with you.', 'SaaS and B2B software development in Vizag', 'We build the product around the workflows your users actually need: login, operational dashboards, business portals and connected systems. Nexara in Visakhapatnam scopes the product, its integrations and the road from build to handover.'],
  'labs/ai-automation': ['AI Automation & Integration in Visakhapatnam | Nexara', 'AI automation in Visakhapatnam: retrieval, agents, document AI and integrations, with evaluation, guardrails and human review where they matter.', 'AI automation for businesses in Visakhapatnam', 'We use retrieval, agent workflows and document AI when they solve a specific operational problem. The data sources, integrations, evaluation and review controls get scoped together with the software.'],
  'labs/ecommerce': ['E-commerce & Website Development in Visakhapatnam | Nexara', 'E-commerce and product websites in Visakhapatnam: catalogues, model directories, calculators and quote flows. Live example: Sri Engineering Works.', 'E-commerce and product sites in Visakhapatnam', 'Nexara builds product catalogues, model directories, calculators and enquiry flows for businesses in Visakhapatnam that sell considered purchases. We learn the business first, prototype with you, and build only what it needs.'],
  'labs/delivery': ['Software Build, QA & Delivery in Vizag | Nexara', 'How we deliver software in Vizag: architecture, iterative development, QA, launch, monitoring and a clear support handover.', 'Software development from scope to launch in Vizag', 'A software project needs more than code. Before launch we define the architecture, development stages, QA, hosting, access controls and monitoring, and agree who handles support or handover.'],
  'labs/voice': ['Nexara Voice | AI Voice Agent Console in Vizag', 'Nexara Voice is an AI voice-agent console built in Visakhapatnam: campaigns, live calls, transcripts and a knowledge base, in Telugu and English.', 'AI voice agents operated from one console', 'Nexara Voice is the agent console Nexara Labs builds and runs for AI voice outreach. It covers campaigns, live calls, transcripts, prompts, knowledge base and workspace administration.'],
  'labs/agency': ['Agency OS | Project Support Portal by Nexara', 'Agency OS is Nexara’s support and project portal: pipeline, proposals, quotes, projects, tasks, approvals and a client portal for updates.', 'One workspace for pipeline to client updates', 'Agency OS is the sign-in workspace Nexara Labs operates for pipeline, proposals, quotes, projects, tasks, approvals and a client portal so project updates stay in one place.'],
  'labs/grow': ['HappyGrow | FPO Agri SaaS Demo by Nexara', 'HappyGrow is an FPO workspace demo from Nexara Labs for farmer, crop, sales and wealth records. The public site uses sample figures only.', 'FPO records software in demo', 'HappyGrow is a demo FPO workspace from Nexara in Visakhapatnam. It shows farmer, crop and wealth record modules. On-page figures are sample data, not live client metrics.'],
  'labs/forms': ['Academy & Sports Software in Vizag | Nexara', 'Academy and sports software in Visakhapatnam: Happy Forms registration, attendee lists and organiser admin, plus schedules when a programme needs them.', 'Academy and sports programme software in Vizag', 'Academy & Sports apps ship live registration as Happy Forms at registrations.nexaragroups.in for IARSA Skating Academy, with schedules, attendance and coach tools available when the programme is scoped for them.'],
  'labs/lms': ['Learning Platform LMS Development in Vizag | Nexara', 'Nexara Labs builds client learning platforms and course LMS software in Visakhapatnam: catalogues, progress, content modules and admin reporting.', 'Custom LMS and course platforms', 'We build learning platforms around course catalogues, learner progress, content modules and admin reporting. Nexara in Visakhapatnam scopes the LMS before development starts.'],
  'labs/hr': ['HR Portal Development in Visakhapatnam | Nexara', 'Custom HR portal development in Visakhapatnam: employee records, leave, attendance, role-based access and admin dashboards, scoped to your organisation.', 'Internal HR portals for operations teams', 'Nexara Labs builds internal HR portals that match how the organisation works: records, leave and attendance, access control and admin dashboards, with a written scope before build.'],
  'labs/billing': ['Billing Software Development in Vizag | Nexara', 'Custom billing software in Visakhapatnam: invoices, payment status, customer accounts and reports, scoped to how your business invoices.', 'Billing software matched to your invoices', 'Nexara builds billing software around invoice generation, payment status, customer accounts and reporting. The Product Studio team scopes the workflows before development.'],
  'labs/workflows': ['Company Workflow Software in Visakhapatnam | Nexara', 'Company process workflows built in Visakhapatnam: approvals, handoffs, role-based access and ops dashboards, scoped to how your organisation works.', 'Internal workflow software for company processes', 'Nexara Labs builds company workflow software that turns process maps into screens with approvals, handoffs, access control and operational dashboards. Scope is agreed before development starts.'],
  customers: ['Our Work & Clients in Vizag | Nexara', 'Live work for Happy Farms, Sri Engineering Works, Rise Medical Hub, Qualigene and Sai Nirmaan Architects: SaaS, e-commerce, websites and digital marketing.', 'Review delivery models before choosing an IT partner', 'See how we run software, digital marketing and training engagements: the written scope, the work produced and what we hand over. Talk through the delivery model, acceptance criteria and evidence you need before agreeing to anything.'],
  company: ['About Nexara | Software & IT Company in Visakhapatnam', 'About Nexara Private Limited, a registered software and IT company in Visakhapatnam with three teams: tech training, digital marketing and custom software.', 'A software and IT company based in Visakhapatnam', 'Nexara Private Limited works from MVP Colony in Visakhapatnam, Andhra Pradesh. Our three divisions share one way of delivering: a written scope, a named owner, a reporting cadence and clear handover responsibilities.'],
  contact: ['Contact Nexara | Software & Websites in Vizag', 'Call 9257535757 or email info@nexaragroups.com. Nexara, Sector 3, MVP Colony, Visakhapatnam. Software, websites, marketing and training.', 'Talk to our team in MVP Colony, Visakhapatnam', 'Call us on 9257535757, email info@nexaragroups.com or drop by our office in MVP Colony, Visakhapatnam. Tell us whether you need software, a website, digital marketing or a training programme, and your request goes to the right team.'],
};

const DEFAULT_KEYWORDS = 'Nexara, Nexera, Nexera Vizag, Nexara Vizag, Nexara Groups, Nexara Private Limited, software company in Vizag, websites in vizag, best websites contacts in Vizag, web development Visakhapatnam, IT company in Vizag, MVP Colony Visakhapatnam';

const PAGE_KEYWORDS: Record<string, string> = {
  home: 'Nexara, Nexera, Nexera Vizag, Nexara Vizag, Nexara Groups, Nexara Private Limited, software company in Vizag, websites in vizag, best websites contacts in Vizag, web development Visakhapatnam, IT company in Vizag, Next.js React developers Vizag, top software company Vizag, MVP Colony software',
  contact: 'best websites contacts in Vizag, website contacts Vizag, software company contact Vizag, Nexara phone 9257535757, Nexara address MVP Colony Visakhapatnam, hire web developers Vizag, info@nexaragroups.com',
  marketing: 'websites in vizag, website development in Visakhapatnam, web design Vizag, digital marketing agency Visakhapatnam, SEO company Vizag, Google listing Vizag, best website designers Visakhapatnam, local SEO Vizag',
  labs: 'software company in Vizag, software development Visakhapatnam, Nexara Labs, Nexara Voice, Agency OS, Academy & Sports apps, Happy Forms, HappyGrow, custom SaaS Vizag, registration software, AI voice agents, web application developers Vizag',
  'labs/products': 'custom SaaS Vizag, B2B software development Visakhapatnam, web applications Vizag, Next.js software developers, React TypeScript portal development, business software Vizag',
  'labs/ecommerce': 'e-commerce website development Visakhapatnam, product catalog website Vizag, Sri Engineering Works, inventory tracking web app, custom calculator developers Vizag, online store development Vizag',
  'labs/ai-automation': 'AI automation Visakhapatnam, AI voice agents Vizag, RAG document AI developers, Python LLM integration Vizag, business automation software',
  'labs/voice': 'Nexara Voice, AI voice agent console, Telugu voice agent, English voice outreach, automated calling software, AI voice bot Vizag, customer outreach console',
  'labs/agency': 'Agency OS, project support portal, client portal software, proposal pipeline software, business operating system Vizag',
  'labs/grow': 'HappyGrow, FPO SaaS, agriculture software Andhra Pradesh, farmer record management software, agri tech Visakhapatnam',
  'labs/forms': 'Academy & Sports apps, Happy Forms, registration software Vizag, sports academy software Visakhapatnam, programme sign-up software',
  'labs/lms': 'LMS development Vizag, learning management system Visakhapatnam, course platform development, online training portal',
  'labs/hr': 'HR portal development Visakhapatnam, attendance leave software Vizag, employee management portal',
  'labs/billing': 'custom billing software Vizag, invoice generation software Visakhapatnam, GST billing software',
  'labs/workflows': 'company workflow software Vizag, business process automation, internal operations dashboard Vizag',
  customers: 'Nexara clients, Sai Nirmaan Architects, Sri Engineering Works, Happy Farms, Rise Medical Hub, Qualigene Lifesciences, software case studies Vizag, website portfolio Visakhapatnam',
  company: 'About Nexara, Nexara Private Limited, Nexera, Seshu Kumar Puvvala, Pala Raju Garigipati, IT company MVP Colony Visakhapatnam, software firm Vizag',
  academy: 'software training in Visakhapatnam, IT courses Vizag, full stack development Vizag, software internships Visakhapatnam, AI training Vizag, placement prep Visakhapatnam',
  'academy/tracks': 'full stack courses Vizag, AI data courses Visakhapatnam, cloud DevOps training Vizag, software engineering career tracks',
  'academy/internships': 'software internships Vizag, IT internships Visakhapatnam, college internship programs Vizag, mentor led internship, 9257535757',
  'academy/placements': 'IT placement prep Vizag, software job preparation Visakhapatnam, tech interview coaching Vizag',
};

// Sections whose subpages are in-page anchors on one scrolling page, not routes of their own.
// Their old detail URLs 301 to the anchor (next.config.mjs), so they are neither routed nor indexed.
const IN_PAGE_SECTIONS = new Set(['marketing', 'academy']);
const detailSlugs = (page: string) => {
  if (IN_PAGE_SECTIONS.has(page)) return [];
  if (page === 'labs') {
    return [
      ...DATA.sections.labs.subpages.map((item) => item.slug),
      ...DATA.sections.labs.products.map((item) => item.id),
    ];
  }
  return sections[page]?.subpages.map((item) => item.slug);
};

// Marketing's visible FAQ is worded per voice; JSON-LD must match what each URL shows.
export const marketingFaqs = (theme: Theme | null): [string, string][] =>
  theme === 'neo' ? DATA.sections.marketing.page.faqsNeo : (DATA.sections.marketing.faqs as [string, string][]);

// Academy's visible FAQ is worded per voice (overview + internship questions merged into DATA).
export const academyFaqs = (theme: Theme | null): [string, string][] =>
  theme === 'neo' ? DATA.sections.academy.page.faqsNeo : (DATA.sections.academy.faqs as [string, string][]);

export const LOCAL_FAQS: Record<string, [string, string][]> = {
  'labs/ecommerce': [
    ['Do you build e-commerce websites in Visakhapatnam?', 'Yes. Nexara builds e-commerce and product sites: catalogues, model directories, calculators, quote and site-survey flows, and a blog. We agree the scope in writing before work starts.'],
    ['How do you approach an e-commerce or product site?', 'We start by understanding how your business sells, then build more than one prototype so you can react to something real. We deliver what the business needs and leave out what it does not.'],
  ],
  'labs/voice': [
    ['What is Nexara Voice?', 'Nexara Voice is an in-house AI voice-agent console built by Nexara Labs in Visakhapatnam. It handles customer campaigns, live calling with transcripts and sentiment analysis, prompt engineering, knowledge base grounding, and multi-tenant workspaces in Telugu and English.'],
    ['Can Nexara Voice integrate with my CRM or business software?', 'Yes. Nexara Voice integrates with business CRMs, custom databases, and workflow pipelines through secure APIs.'],
  ],
  'labs/products': [
    ['What custom software and SaaS platforms does Nexara build in Vizag?', 'We build multi-tenant SaaS platforms, internal business portals, inventory and booking tools, and automated workflows. Our stack includes Next.js, React, TypeScript, Node.js, Python, and PostgreSQL.'],
    ['Who owns the source code and IP after launch?', 'You do. Handover includes the complete source code, deployment configurations, database access, and documentation. You own your IP.'],
  ],
  customers: [
    ['Which businesses in Vizag trust Nexara for websites and software?', 'Our clients include Sai Nirmaan Architects, Sri Engineering Works, Happy Farms, Rise Medical Hub, and Qualigene Lifesciences. We have shipped custom SaaS, e-commerce platforms, patient portals, and marketing systems.'],
    ['Can I inspect live websites built by Nexara?', 'Yes. All client case studies featured on our Proof page include verified links to live, operating client websites and platforms.'],
  ],
  contact: [
    ['What are the best website and software development contacts in Vizag?', 'You can reach Nexara Private Limited at +91 9257535757 or info@nexaragroups.com. Our team operates from No. 1-83-14, Sector 3, MVP Colony, Visakhapatnam, Andhra Pradesh 530017.'],
    ['What details should I share in my project enquiry?', 'Share your business domain, whether you need custom software, an e-commerce platform, a website, or digital marketing, your target timeline, and key features. We will return a structured scope and timeline.'],
  ],
  'academy/internships': [
    ['Where can I enquire about a software internship in Vizag?', 'Contact Nexara in MVP Colony, Visakhapatnam on 9257535757 or send a training brief. Share your course, current skills, preferred project area and available dates so the team can discuss a suitable scope.'],
    ['Who are Nexara’s managed internships for?', 'Students, freshers and college teams can discuss a managed internship programme. The team will review the learners’ starting skills, project goals and academic reporting requirements before defining the programme.'],
    ['What project areas can I discuss?', 'Our training covers full-stack development, data and AI, product design, and cloud operations. The project focus and deliverables are agreed for each internship programme.'],
    ['What will my internship completion report cover?', 'Completion reports document participation, capability and project quality. Mentor pods and weekly demos support progress reviews during the programme.'],
    ['How do I confirm duration, fees and the schedule?', 'Send your preferred dates and college requirements to Nexara. Request written confirmation of the programme’s duration, schedule, fees, project deliverables and completion-report requirements before enrolling.'],
  ],
  home: [
    ['Is Nexara the same as Nexera, Nexora or Nexar?', 'No. We are Nexara (spelled N-E-X-A-R-A, frequently misspelled as Nexera or Nexora): Nexara Private Limited, based in MVP Colony, Visakhapatnam (Vizag), India, at nexaragroups.com. We build custom software, web applications, and digital marketing systems. We are not affiliated with unrelated companies that have similar names.'],
    ['What makes Nexara a leading software company in Vizag?', 'Nexara Private Limited is a registered software and IT company in Visakhapatnam (CIN U62012AP2026PTC126146). We engineer custom SaaS, web apps, AI voice agents, and company workflows with a written scope, a named owner, rigorous QA, and complete code ownership handover.'],
    ['How do I find the best websites contacts in Vizag?', 'You can contact Nexara directly by phone at +91 9257535757 or email info@nexaragroups.com. Our office is located at No. 1-83-14, Sector 3, MVP Colony, Visakhapatnam, Andhra Pradesh 530017. You can also scope your website project through our intake planner.'],
    ['What is Nexara’s engineering tech stack for software and websites?', 'Our development stack includes Next.js, React, TypeScript, Node.js, Python, Tailwind CSS, PostgreSQL, and Cloudflare edge architecture, alongside applied AI models and our proprietary Nexara Voice agent console.'],
    ['What products has Nexara Labs developed?', 'Nexara Labs has engineered products including Nexara Voice (an AI voice agent console for Telugu and English outreach), Agency OS (project and client support portal), and HappyGrow (an FPO agri-records SaaS platform), alongside custom LMS and HR systems.'],
    ['Which clients has Nexara delivered websites and software for?', 'We have delivered live production systems for clients across Visakhapatnam and Andhra Pradesh, including Sai Nirmaan Architects (portfolio website and digital marketing in Visakhapatnam), Sri Engineering Works (HVAC e-commerce, model directory, and inventory tracking), Happy Farms (agri-training SaaS and public portal), Rise Medical Hub (Madhurawada clinic website and medical library), and Qualigene Lifesciences (product website and calculators).'],
  ],
  company: [
    ['Where is Nexara based?', `${DATA.contact.address.street}, ${DATA.contact.address.city}.`],
    ['What should I look for in a top IT company in Vizag?', 'Check the team’s relevant skills, delivery process, who owns the code and accounts, how they do QA and what support covers. At Nexara we start with a written brief and a named owner, so all of this is settled before a build.'],
    ['How can I contact Nexara for website or software projects in Vizag?', 'Call us on 9257535757 or email info@nexaragroups.com. Our office is in Sector 3, MVP Colony, Visakhapatnam 530017.'],
  ],
};

// Neo is the primary presentation: its home page is '/', the Neo/Trust chooser lives at /gateway,
// and every other page's canonical URL is its /neo/... path (Trust pages are alternates).
export function routePath(theme: Theme | null, page = 'home', detail: string | null = null) {
  if (page === 'gateway') return '/gateway';
  if (!theme) theme = 'neo';
  // Blog is shared content: Neo's URL is the canonical /blog, Trust renders the same posts under /trust/blog.
  if (page === 'blog') return (theme === 'trust' ? '/trust' : '') + '/blog' + (detail ? '/' + detail : '');
  if (theme === 'neo' && page === 'home') return '/';
  return '/' + [theme, page === 'home' ? null : page, detail].filter(Boolean).join('/');
}

export function getSeo(route: Pick<Route, 'theme' | 'page' | 'detail'>) {
  const { page, detail } = route;
  const key = page + (detail && sections[page] ? `/${detail}` : '');
  const validDetail = !detail || !!detailSlugs(page)?.includes(detail) || (page === 'customers' && !!sections[detail]) || (page === 'contact' && ['home', ...Object.keys(sections)].includes(detail));
  const entry = pages[key];
  if (!entry || !validDetail || (route.theme && !['trust', 'neo'].includes(route.theme))) return { valid: false, title: 'Page not found | Nexara', description: 'Software, website, marketing and training services from Nexara in Visakhapatnam.', robots: 'noindex, follow', canonical: null, schema: [], keywords: DEFAULT_KEYWORDS };
  let [title, description, heading, body] = entry;
  if (page === 'customers' && detail) {
    // Theme-neutral service names: Neo and Trust call the teams different things, Google shows one text.
    const svc = ({ academy: 'Tech training', marketing: 'Digital marketing', labs: 'Software development' } as Record<string, string>)[detail] || sections[detail]!.name;
    title = `${svc.replace(/\b\w/g, c => c.toUpperCase())} Delivery Models in Vizag | Nexara`;
    description = `How Nexara runs ${svc.toLowerCase()} work in Visakhapatnam: the written scope, what gets delivered, and how handover works.`;
    heading = `${svc} delivery models in Visakhapatnam`;
    body = `${svc} engagements are framed around written requirements, the work delivered and operational readiness. Discuss the applicable delivery model and evidence requirements with Nexara before agreeing your project scope.`;
  }
  // Trust is an alternate presentation of the same pages; every theme canonicalises to Neo.
  // The /gateway chooser is a utility page and stays out of the index.
  const isGateway = page === 'gateway';
  const canonicalDetail = page === 'contact' ? null : detail;
  const canonical = SITE_URL + routePath('neo', page, canonicalDetail);
  const keywords = PAGE_KEYWORDS[key] || PAGE_KEYWORDS[page] || DEFAULT_KEYWORDS;
  return { valid: true, key, title, description, heading, body, canonical, robots: isGateway ? 'noindex, follow' : INDEX_ROBOTS, faqs: LOCAL_FAQS[key] || [], keywords };
}

export function getRoutes() {
  const routes: Route[] = [{ theme: null, page: 'gateway', detail: null, path: 'gateway' }];
  for (const theme of ['trust', 'neo'] as const) {
    for (const page of ['home', ...Object.keys(sections), 'customers', 'company', 'contact']) {
      routes.push({ theme, page, detail: null, path: routePath(theme, page).slice(1) });
      const details = detailSlugs(page) || (page === 'customers' ? Object.keys(sections) : page === 'contact' ? ['home', ...Object.keys(sections)] : []);
      for (const detail of details) routes.push({ theme, page, detail, path: routePath(theme, page, detail).slice(1) });
    }
  }
  return routes;
}

const organizationId = `${SITE_URL}/#organization`;
function organizationNode() {
  return {
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    '@id': organizationId,
    name: 'Nexara',
    legalName: DATA.contact.legal.name,
    foundingDate: DATA.contact.legal.incorporated,
    taxID: DATA.contact.legal.gstin,
    identifier: { '@type': 'PropertyValue', propertyID: 'CIN', value: DATA.contact.legal.cin },
    alternateName: [
      'Nexara Private Limited',
      'Nexara Groups',
      'Nexara Vizag',
      'Nexara Visakhapatnam',
      'Nexara Software',
    ],
    disambiguatingDescription: 'Nexara Private Limited, also called Nexara Groups, is a software, web development and digital marketing firm in MVP Colony, Visakhapatnam (Vizag), India. The name is often misspelled Nexera; that spelling is not a separate brand.',
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/brand/nexara-logo-512.png`,
    sameAs: DATA.contact.social.map(link => link.href),
    image: `${SITE_URL}/brand/og-image.png`,
    description: 'Software company in Vizag building custom software, websites, AI voice agents and digital marketing from MVP Colony, Visakhapatnam.',
    telephone: '+919257535757',
    email: 'info@nexaragroups.com',
    hasMap: DATA.contact.address.mapsHref,
    currenciesAccepted: 'INR',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.738047,
      longitude: 83.341405,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: DATA.contact.address.street,
      addressLocality: 'Visakhapatnam',
      addressRegion: 'Andhra Pradesh',
      postalCode: '530017',
      addressCountry: 'IN',
    },
    areaServed: { '@type': 'City', name: 'Visakhapatnam', alternateName: 'Vizag' },
    knowsAbout: [
      'Software Development',
      'Website Development',
      'Full-Stack Engineering',
      'Next.js',
      'React',
      'TypeScript',
      'Node.js',
      'Python',
      'AI Voice Agents',
      'E-commerce Platforms',
      'Digital Marketing',
      'Search Engine Optimization',
      'Tech Training in Visakhapatnam',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+919257535757',
      email: 'info@nexaragroups.com',
      contactType: 'project enquiries',
      areaServed: 'IN',
      availableLanguage: ['English', 'Telugu', 'Hindi'],
    },
  };
}

export function getStructuredData(route: Pick<Route, 'theme' | 'page' | 'detail'>) {
  const seo = getSeo(route);
  if (!seo.valid) return { '@context': 'https://schema.org', '@graph': [] };
  const organization: ReturnType<typeof organizationNode> & { founder?: { '@id': string }[] } = organizationNode();
  const webPageId = `${seo.canonical}#webpage`;
  const graph: Record<string, unknown>[] = [
    organization,
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'Nexara',
      alternateName: ['Nexara Private Limited', 'Nexara Groups', 'nexaragroups.com'],
      publisher: { '@id': organizationId },
      inLanguage: 'en-IN',
    },
    {
      '@type': route.page === 'contact' ? 'ContactPage' : route.page === 'company' ? 'AboutPage' : 'WebPage',
      '@id': webPageId,
      url: seo.canonical,
      name: seo.title,
      description: seo.description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': organizationId },
      inLanguage: 'en-IN',
      ...(route.page === 'contact' ? { mainEntity: { '@id': organizationId } } : {}),
    },
  ];
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

  // Software product schema for Nexara Labs products (Nexara Voice, Agency OS, HappyGrow, etc.)
  if (route.page === 'labs' && route.detail) {
    const product = DATA.sections.labs.products.find(p => p.id === route.detail);
    if (product) {
      graph.push({
        '@type': 'SoftwareApplication',
        '@id': `${seo.canonical}#software`,
        name: product.name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web-based',
        description: seo.description,
        url: product.url || seo.canonical,
        author: { '@id': organizationId },
        publisher: { '@id': organizationId },
      });
    }
  }

  // Portfolio / client showcase schema for the Customers / Proof page
  if (route.page === 'customers' && !route.detail) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${seo.canonical}#portfolio`,
      name: 'Client Projects & Shipped Work by Nexara in Visakhapatnam',
      description: 'Live software, SaaS platforms, e-commerce websites and digital marketing delivered for clients including Sai Nirmaan Architects, Sri Engineering Works, Happy Farms, Rise Medical Hub and Qualigene Lifesciences.',
      itemListElement: DATA.work.live.map((client, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: client.name,
          url: client.url,
          headline: client.line,
          description: client.story.trust,
          creator: { '@id': organizationId },
          about: client.sector,
          locationCreated: { '@type': 'Place', name: client.place },
        },
      })),
    });
  }

  // FAQPage lives in JSON-LD. Visible FAQs belong in real page sections (home, About, division pages), not a forced SEO band.
  const faqs = pageFaqs(route, seo.faqs || []);
  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${seo.canonical}#faq`,
      mainEntity: faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function pageFaqs(route: Pick<Route, 'theme' | 'page' | 'detail'>, fromSeo: [string, string][]): [string, string][] {
  if (route.detail) return fromSeo;
  const fromSection = route.page === 'marketing' ? marketingFaqs(route.theme)
    : route.page === 'academy' ? academyFaqs(route.theme)
    : (sections[route.page]?.faqs || []) as [string, string][];
  const seen = new Set(fromSeo.map(([q]) => q));
  return [...fromSeo, ...fromSection.filter(([q]) => !seen.has(q))];
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
