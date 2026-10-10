// Page-chrome copy shared by both themes: headings, kickers and CTAs for the shared page flows.
// Voice rule: Neo is Gen Z (short, casual, a little loud). Trust is corporate (formal, precise, no slang).
// Facts never change between voices. Page *content* lives in DATA; page *structure* lives in site.ts.
import type { Voiced } from './site';

const v = (neo: string, trust: string): Voiced => ({ neo, trust });

export const COPY = {
  labs: {
    nav: {
      label: v('Labs progress', 'Product Studio progress'),
      overview: v('Overview', 'Overview'),
      proof: v('Proof', 'Proof'),
      products: v('Products', 'Products'),
      capabilities: v('How we build', 'Capabilities'),
      engage: v('Ways in', 'Engagement'),
      cta: v('Scope a build', 'Scope a build'),
    },
    map: {
      kicker: v('The build', 'Architecture'),
      title: v('Four layers. One system.', 'Four layers, one system.'),
      ships: v('You get', 'Deliverables'),
    },
    modules: {
      kicker: v('What we build', 'Capabilities'),
      title: v('Five builds, mapped to layers.', 'Five capabilities, mapped to layers.'),
      open: v('Open', 'Open'),
    },
    stages: {
      kicker: v('How it runs', 'Delivery'),
      title: v('Four stages. A gate at each.', 'Four stages, each with a gate.'),
      out: v('Ships', 'Outputs'),
    },
    proof: {
      kicker: v('Shipped', 'Client delivery'),
      title: v('Shipped for clients.', 'Shipped for clients.'),
      built: v('What we built', 'What we delivered'),
      capability: v('See capability', 'View capability'),
      product: v('See product', 'View product'),
      site: v('Open site', 'Visit site'),
      websitesTitle: v('Websites', 'Websites'),
      websitesBuilt: v(
        'Public sites for Sai Nirmaan, Happy Farms, Sri Engineering Works, Rise Medical Hub and Qualigene. Marketing owns presence; Labs owns the software behind it.',
        'Public websites for Sai Nirmaan Architects, Happy Farms, Sri Engineering Works, Rise Medical Hub and Qualigene Lifesciences. Digital Solutions owns presence; Labs owns the software systems behind those businesses.',
      ),
      websitesCta: v('See Marketing', 'See Digital Solutions'),
    },
    products: {
      kicker: v('Studio record', 'Studio record'),
      title: v('What Labs runs and builds.', 'What Product Studio runs and builds.'),
      live: v('Live', 'Live'),
      demo: v('Demo', 'Demo'),
      building: v('Building', 'In build'),
      open: v('Open it up', 'View details'),
      liveSite: v('Open the live app', 'Open live product'),
      openDemo: v('Try the demo', 'Open the demonstration'),
      covers: v('What you get', 'What is delivered'),
      whoFor: v("Who it's for", 'Intended users'),
      proofNote: v('Status', 'Status'),
      detailCta: v('Build me one like this', 'Request a scoped proposal'),
      detailCtaLive: v('Want this for your team?', 'Enquire about this product'),
      buildingNote: v(
        "In build, no public link yet. Ask and we'll show you where it's at.",
        'In build. No public link is available yet; a walkthrough can be arranged on request.',
      ),
      placeholderShot: v('Preview coming once the build is shareable.', 'Product preview will appear here when the build is ready to share.'),
      marketingNote: v('Need a website or digital presence? That sits with Marketing.', 'Need a website or digital presence? That work sits with Digital Solutions.'),
      marketingLink: v('See Marketing', 'See Digital Solutions'),
      seenIn: v('Seen in', 'Seen in'),
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
    hero: {
      kicker: v('About Nexara', 'About Nexara'),
      leave: v('Every fact on this page can be checked.', 'Every fact on this page can be verified.'),
      record: v('Company register', 'Company register'),
      pending: v('Unchecked', 'Unverified'),
      done: v('Checked', 'Verified'),
    },
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
    hero: {
      kicker: v('Proof', 'Delivery proof'),
      title: v('Real clients. Live work.', 'Clients and delivered work.'),
      lines: { neo: ['Real clients.', 'Live work.'], trust: ['Clients and', 'delivered work.'] },
      accent: v('Open any of it.', 'Live and inspectable.'),
      body: v(
        'A SaaS platform, an e-commerce site, a medical library, sales calculators and websites that sell, shipped for businesses in Visakhapatnam and across Andhra Pradesh.',
        'Live client platforms you can inspect today: a SaaS product, an e-commerce site, a medical library, sales calculators and websites, for businesses in Visakhapatnam and across Andhra Pradesh.',
      ),
      leave: v('Every link opens a live site.', 'Each address opens a production site.'),
      record: v('Live now', 'Live addresses'),
      pending: v('Unopened', 'Not viewed'),
      done: v('Opened', 'Viewed'),
      divisionTitle: v('%s, by the receipts.', '%s: delivery proof.'),
      divisionLine: v('By the receipts.', 'Delivery proof.'),
      divisionAccent: v('What this division produces.', 'What this team produces.'),
      divisionBody: v(
        'The operating proof this division is built to deliver, engagement after engagement.',
        'The delivery model this team works to, engagement after engagement.',
      ),
    },
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
  // Academy page chrome (structure: ACADEMY_FLOW in site.ts, content: DATA.sections.academy.page).
  academy: {
    nav: {
      label: v('Academy sections', 'Sections'),
      overview: v('Overview', 'Overview'),
      cta: v('Plan a cohort', 'Plan a programme'),
    },
    portfolio: v('Portfolio', 'Portfolio'),
    stamps: v('Proof on record', 'Proof on record'),
    runway: v('The path', 'The path'),
    lanes: v('Three lanes. One spine.', 'Three lanes, one spine.'),
    fit: v('Where are you right now?', 'Where you are now'),
    proof: v('Work already on this path', 'Work already done this way'),
    faqs: v('Fair questions', 'Questions'),
    ask: {
      title: v('Plan your Academy programme', 'Plan an Academy programme'),
      body: v(
        'Tell us the city, learner count, target roles and timeline. Students, colleges and employers: say which lane you need. You get back a scoped programme with a named owner.',
        'Tell us the city, learner count, target roles and timeline. Students, colleges and employers: say which lane you need. We return a scoped programme with a named owner.',
      ),
      cta: v('Plan my cohort', 'Plan an Academy programme'),
    },
  },
  // Bottom section bar labels (structure: PAGE_FINDER in site.ts). One entry per section id.
  finder: {
    overview: v('Overview', 'Overview'),
    home: {
      label: v('Home sections', 'Home sections'), cta: v('Let’s talk', 'Start a project'),
      divisions: v('Divisions', 'Teams'), work: v('Proof', 'Delivery record'), insights: v('Blog', 'Insights'), faqs: v('FAQ', 'Questions'),
    },
    company: {
      label: v('About sections', 'About sections'), cta: v('Let’s talk', 'Contact us'),
      story: v('Story', 'Our story'), how: v('How we work', 'How we work'), people: v('People', 'Leadership'), faqs: v('FAQ', 'Questions'),
    },
    customers: {
      label: v('Proof sections', 'Proof sections'), cta: v('Let’s talk', 'Start a project'),
      builds: v('Live builds', 'Delivered work'),
    },
    contact: {
      label: v('Contact sections', 'Contact sections'),
      details: v('Reach us', 'Contact details'), channels: v('Pick a lane', 'Teams'), brief: v('Brief', 'Project brief'), faqs: v('FAQ', 'Questions'),
    },
    blog: {
      label: v('Blog sections', 'Blog sections'), cta: v('Start a project', 'Contact us'),
      posts: v('All posts', 'All articles'),
    },
    post: {
      label: v('Article sections', 'Article sections'), cta: v('Start a project', 'Contact us'),
      article: v('Article', 'Article'), more: v('Keep reading', 'Further reading'),
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
    lines: { neo: ['Notes from', 'the build.'], trust: ['Notes from', 'our delivery work.'] } as Voiced<string[]>,
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
    ask: {
      title: v('Got a brief?', 'Start a project'),
      body: v(
        'Tell us the team you need. We send a scoped next step.',
        'Tell us which team you need. We return a scoped next step and a named owner.',
      ),
      cta: v('Start a project', 'Contact us'),
    },
  },
  contact: {
    lines: { neo: ['Tell us what', "you're building."], trust: ['Every project starts', 'with one conversation.'] } as Voiced<string[]>,
    leave: v('We send a scoped next step.', 'We return a scoped next step and a named owner.'),
    preview: v('Your brief', 'Brief preview'),
    channels: v('Pick a lane', 'Select a section'),
    channelsBody: v(
      'Each card fills the form for that team.',
      'Pick the line closest to what you need. We route the request to the right team.',
    ),
    combined: v('Combined', 'Combined engagement'),
    formTitle: v('Tell us what you are building.', 'Define the engagement scope.'),
    formBody: v(
      'Six fields. One email. We read every one.',
      'Complete each field. Your responses generate a formatted message to our intake team.',
    ),
    fields: {
      section: v('Which team', 'Engagement area'),
      city: v('City', 'City'),
      timeline: v('Timeline', 'Timeline'),
      audience: v('Who it is for', 'Audience or user group'),
      context: v('What you have now', 'Current assets and tools'),
      success: v('What winning looks like', 'Success metric'),
      name: v('Your name', 'Your name'),
      email: v('Email', 'Email'),
    },
    hints: {
      section: v('Which team owns this', 'The Nexara team that best fits'),
      city: v('Where this runs', 'Primary city of delivery'),
      timeline: v('How fast', 'Expected window'),
      audience: v('Who you are building for', 'End users or customer segment'),
      context: v('What you are starting with', 'Existing website, tools or repositories'),
      success: v('The outcome that matters', 'The measurable outcome this engagement should move'),
      name: v('Decision-maker name', 'Decision-maker name'),
      email: v('Where we reply', 'Intake routing path'),
    },
    placeholders: {
      audience: v('e.g. engineering students, local shoppers', 'e.g. engineering students, local shoppers'),
      context: v('e.g. React website, legacy CRM, none', 'Existing website, tools, platforms or current workflow'),
      success: v('e.g. more qualified enquiries, a live cohort dashboard', 'e.g. improve enquiry conversion, launch a cohort dashboard'),
      name: v('Decision-maker name', 'Decision-maker name'),
      email: v('name@company.com', 'name@company.com'),
    },
    timelines: [
      v('1-3 months', '1–3 months'),
      v('3-6 months', '3–6 months'),
      v('6-12 months', '6–12 months'),
      v('Ongoing', 'Ongoing'),
    ],
    timelineValues: ['1-3 months', '3-6 months', '6-12 months', 'Ongoing'],
    submit: v('Send it', 'Send to info@nexaragroups.com'),
    success: v('Enquiry ready. Your mail client will open.', 'Enquiry prepared. Your mail client will open shortly.'),
    successHint: v('If it does not, email us and paste the brief.', 'If it does not open, use the email link and include the project details.'),
    checklistTitle: v('What makes a good request', 'What makes a good request'),
    checklistBody: v('Cover these and we can scope same day.', 'Cover these points and we scope the engagement the same day.'),
    faqs: v('Fair questions', 'Questions'),
    phone: v('Call us', 'Telephone'),
    note: v('Let us talk about the next project.', 'We can discuss the next project.'),
    office: v('Visit the office', 'Visit the office'),
    directions: v('Get directions', 'Get directions'),
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
