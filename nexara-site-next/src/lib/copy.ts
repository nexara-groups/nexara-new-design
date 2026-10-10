// Page-chrome copy shared by both themes: headings, kickers and CTAs for the shared page flows.
// Voice rule: Neo is Gen Z (short, casual, a little loud). Trust is corporate (formal, precise, no slang).
// Facts never change between voices. Page *content* lives in DATA; page *structure* lives in site.ts.
import type { Voiced } from './site';

const v = (neo: string, trust: string): Voiced => ({ neo, trust });

export const COPY = {
  labs: {
    problems: {
      kicker: v('Start here', 'Audience'),
      title: v('Your problem, your first move.', 'Your situation and where to start.'),
      who: v('Who', 'Who'), pain: v('The mess', 'Challenge'), start: v('Start with', 'Entry point'),
    },
    map: {
      kicker: v('The build', 'Architecture'),
      title: v('Four layers. One system.', 'Four layers, one system.'),
      modules: v('Modules', 'Modules'), ships: v('You get', 'Deliverables'), clients: v('Seen in', 'Delivered for'),
    },
    modules: {
      kicker: v('What we build', 'Capabilities'),
      title: v('Five builds, mapped to layers.', 'Five capabilities, mapped to layers.'),
      layers: v('Layers', 'Layers'), ships: v('You get', 'Deliverables'), seen: v('Seen in', 'Delivered for'), open: v('Open', 'Open'),
    },
    stages: {
      kicker: v('How it runs', 'Delivery'),
      title: v('Four stages. A gate at each.', 'Four stages, each with a gate.'),
      gate: v('Gate', 'Gate'), out: v('Ships', 'Outputs'),
    },
    specialisms: {
      kicker: v('The work', 'Specialisms'),
      title: v('Four kinds of build.', 'Four areas of work.'),
    },
    proof: {
      kicker: v('Receipts', 'Delivered'),
      title: v('Where it shipped.', 'Where it was delivered.'),
    },
    products: {
      kicker: v('We run these', 'Products'),
      title: v('Three products we operate.', 'Three products operated by Nexara.'),
      live: v('Live', 'Live'),
      demo: v('Demo', 'Demo'),
      open: v('Open', 'Open'),
    },
    engage: {
      kicker: v('Pick one', 'Engagement'),
      title: v('Three ways in.', 'Three ways to engage.'),
      cta: v('Start this one', 'Request a proposal'),
    },
    faqs: { kicker: v('FAQ', 'FAQ'), title: v('Quick answers.', 'Common questions.') },
    cta: { kicker: v('Next move', 'Next step'), cta: v('Let’s build', 'Request a consultation') },
  },
  about: {
    story: { kicker: v('Our story', 'Company background') },
    how: { kicker: v('How we work', 'Method'), title: v('Three steps. In this order.', 'Three steps, in a fixed order.') },
    milestones: { kicker: v('Milestones', 'Milestones'), title: v('So far.', 'Progress to date.') },
    people: { kicker: v('Directors', 'Directors'), title: v('The people behind Nexara.', 'Directors of the company.') },
    facts: { kicker: v('Company facts', 'Registration'), title: v('The paperwork, in the open.', 'Company registration details.') },
    principles: { kicker: v('Principles', 'Principles'), title: v('What we won’t budge on.', 'Operating principles.') },
    standards: { kicker: v('Operating standards', 'Governance'), title: v('The standards that keep us honest.', 'Delivery governance.') },
    faqs: { kicker: v('Questions', 'Questions'), title: v('Straight answers.', 'Common questions about Nexara.') },
    legal: {
      name: v('Legal name', 'Legal name'), website: v('Website', 'Website'), incorporated: v('Incorporated', 'Date of incorporation'),
      cin: v('CIN', 'CIN'), gstin: v('GSTIN', 'GSTIN'), address: v('Registered address', 'Registered address'),
    },
    cta: {
      kicker: v('Next move', 'Next step'),
      title: v('Got something to build?', 'Discuss your project.'),
      body: v('Tell us about the business first. The rest follows.', 'Share the business context and we will propose a scoped next step.'),
      primary: v('Start a project', 'Contact us'),
      secondary: v('Read the blog', 'Read the blog'),
    },
  },
  proof: {
    builds: {
      kicker: v('Receipts', 'Client record'),
      title: v('What actually shipped.', 'What we delivered, case by case.'),
      lede: v('Filter by team, then open a case. Problem, build and what shipped, from the live site.', 'Filter by team, then open a case. Each record covers the problem, the build and what shipped on the live platform.'),
      open: v('See it live', 'View live site'),
      empty: v('No live cases for this team yet.', 'No live cases are tagged to this team yet.'),
      filterLabel: v('Filter by team', 'Filter by team'),
      filterAll: v('All', 'All'),
      casesLabel: v('Open a case', 'Select a case'),
      selected: v('Selected case', 'Selected case'),
      problem: v('Problem', 'Problem'),
      build: v('Build', 'Build'),
      shipped: v('What shipped', 'What shipped'),
    },
    cta: { kicker: v('Next move', 'Next step'), title: v('Want your name on this list?', 'Add your organisation to this record.'), body: v('Tell us what you need and we’ll map the next step.', 'Describe what you need and we will recommend a scoped next step.'), primary: v('Start a project', 'Contact us') },
  },
  clients: {
    stripLabel: v('Live for', 'Delivered for'),
    stripAll: v('See the work', 'View delivery record'),
    live: v('Live', 'Live'),
    opens: v('opens in a new tab', 'opens in a new tab'),
    divisions: v('Done by', 'Delivered by'),
    built: v('What we built', 'What Nexara delivered'),
    result: v('Result:', 'Outcome:'),
    bench: v('On the bench', 'In delivery'),
    more: v('+ more in the pipeline', '+ further engagements in the pipeline'),
  },
  home: {
    manifesto: {
      kicker: v('Why Nexara', 'Why Nexara'),
      text: v(
        'Three engines, one standard. No shortcuts, no gap years, no vibes without receipts. We build people, software and brands, all from one house.',
        'We are one engineering company that grows talent, builds software and builds market presence. One standard across three disciplines, and no shortcuts.',
      ),
    },
    divisions: {
      kicker: v('The divisions', 'Service lines'),
      title: v('Choose your force.', 'Three practice areas. One operating standard.'),
      enter: v('Enter', 'Enter'),
      tagline: {
        academy: v('We grow engineers.', 'The talent engine.'),
        marketing: v('We make brands move.', 'The growth signal.'),
        labs: v('We build intelligence.', 'The build studio.'),
      } as Record<string, Voiced>,
      // What each team does in Visakhapatnam. Shown on the home rail panels.
      local: {
        academy: v(
          'Software training and internships. Full-stack, AI, design and cloud tracks with real projects and mentor reviews, managed internships for students and colleges, and placement prep for specific roles.',
          'Software training and internships. Full-stack, AI, design and cloud tracks with real projects and mentor reviews, managed internships for students and colleges, and placement preparation for specific roles.',
        ),
        marketing: v(
          'Websites and digital marketing for local businesses. Brand identity, business websites and landing pages, content, SEO basics and campaigns, with results reported in plain language. The offer, the site and the measurement plan get planned together.',
          'Websites and digital marketing for local businesses. We deliver brand identity, business websites and landing pages, content, SEO foundations and campaigns, and report results in plain language. The offer, the website and the measurement plan are planned together.',
        ),
        labs: v(
          'Custom software for businesses in Visakhapatnam. SaaS platforms, B2B portals, dashboards, internal tools and integrations, with AI automation where it fits the problem. We start with the users and the business problem, then go architecture, build, QA and launch.',
          'Custom software for businesses in Visakhapatnam. We build SaaS platforms, B2B portals, dashboards, internal tools and integrations, and apply AI automation where it fits the problem. Work starts with the users and the business problem, then moves through architecture, development, QA and launch.',
        ),
      } as Record<string, Voiced>,
    },
    work: {
      kicker: v('Receipts', 'Delivery record'),
      title: v('Six live systems. One house.', 'Six live platforms. One firm.'),
      lede: v('Pick a case or let it play. Every slide opens the real domain.', 'Browse live client platforms you can inspect today. Each case opens the production site.'),
      open: v('Open', 'Open'),
    },
    capabilities: {
      label: v('We build', 'We deliver'),
      items: [
        v('SaaS platforms', 'SaaS platforms'),
        v('E-commerce', 'E-commerce'),
        v('Business websites', 'Business websites'),
        v('Medical libraries', 'Medical libraries'),
        v('Sales calculators', 'Sales calculators'),
        v('AI voice agents', 'AI voice agents'),
        v('Brand systems', 'Brand systems'),
        v('Digital marketing', 'Digital marketing'),
        v('Full-stack training', 'Full-stack training'),
        v('Internships', 'Internships'),
      ],
    },
    cta: {
      kicker: v('Ready when you are', 'Ready when you are'),
      title: v('Begin.', 'Start the request.'),
      body: v('Tell us which team you need, or let the brief decide.', 'Tell us which team you need, or let the brief decide. Scoped response within two working days.'),
      primary: v('Start a project', 'Start a project'),
    },
  },
  // Marketing page chrome (structure: MARKETING_FLOW in site.ts, content: DATA.sections.marketing.page).
  marketing: {
    nav: {
      label: v('Marketing sections', 'Sections'),
      overview: v('Overview', 'Overview'),
      cta: v('Scope it', 'Scope a project'),
    },
    search: v('Search', 'Search'),
    record: v('What a search shows', 'What a search returns'),
    starts: v('Where are you right now?', 'Where you are now'),
    who: v('Built for', 'Who this is for'),
    proof: v('Work we already ran this way', 'Work already done this way'),
    faqs: v('Fair questions', 'Questions'),
    ask: {
      title: v('Scope your digital project', 'Scope a digital project'),
      body: v(
        'Tell us your city, your offer, your current site and profiles, and whether you need to get found, get trusted, or you are ready to spend. You get back a phase plan, the deliverables and a reporting rhythm.',
        'Tell us the city, the offer, the current website and profiles, and whether you need to be found, trusted, or already ready to spend. We return a phase plan, deliverables and a reporting cadence.',
      ),
      cta: v('Scope my project', 'Scope a digital project'),
    },
  },
  insights: {
    kicker: v('Fresh drops', 'Insights'),
    title: v('Notes from the build.', 'Notes from our delivery work.'),
    all: v('All posts', 'All articles'),
    read: v('Read it', 'Read article'),
  },
  faqs: {
    kicker: v('Questions', 'Questions'),
    title: v('Straight answers.', 'Common questions about Nexara.'),
  },
  blog: {
    kicker: v('Blog', 'Blog'),
    title: v('Notes from the build.', 'Notes from our delivery work.'),
    lede: v(
      'What we learn building websites, software and marketing for businesses in Vizag. No fluff.',
      'Practical notes from a Visakhapatnam team that builds websites, software and marketing for local businesses.',
    ),
    read: v('Read it', 'Read article'),
    more: v('Keep reading', 'Further reading'),
    all: v('All posts', 'All articles'),
    cta: v('Start a project', 'Contact us'),
    by: v('By', 'By'),
    min: v('min read', 'min read'),
  },
} as const;

// "Every division runs on the same spine." Same four standards in both themes, worded per voice.
export const OPERATING_STANDARD: { title: string; body: Voiced }[] = [
  { title: 'Written before built', body: v('Every project starts with a written brief and scope. If it’s not written down, it’s not agreed.', 'Every engagement begins with a written brief and scope. Anything not documented is not agreed.') },
  { title: 'Demo every week', body: v('Working software, live cohorts, running campaigns. We show it weekly instead of pitching it in decks.', 'Working software, live cohorts and running campaigns are demonstrated weekly rather than described in presentations.') },
  { title: 'One accountable lead', body: v('Every cohort, system and campaign has one named owner, kickoff to handover.', 'Every cohort, system and campaign has a single named owner from kickoff to handover.') },
  { title: 'Handover by design', body: v('Docs, access and training ship with the work. Never an afterthought.', 'Documentation, access and training are part of the deliverable and are handed over with it.') },
];

export const HOME_STANDARDS = {
  kicker: v('The operating standard', 'Operating standard'),
  title: v('Every division runs on the same spine.', 'Every team runs on the same standard.'),
};
