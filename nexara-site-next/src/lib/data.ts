export const DATA = {
  gateway: {
    neo: {
      kicker: "For teams that move before the market catches up.",
      title: "Loud, fast and a little unhinged. The Nexara you'd screenshot.",
      body: "Live cohorts, campaigns that land and software that ships. One team, and every brief gets launch-week energy.",
      chips: ["no cap", "shipping daily", "vibes reserved"],
      cta: "Enter the Chaos",
    },
    trust: {
      kicker: "Three specialist teams. One way of working.",
      title: "Work you can put your name to.",
      body: "Academy trains talent, Digital builds your market presence, Product Studio builds software. Every project has a named owner, a written scope, regular reports and clear rules on data.",
      chips: ["Named owner", "Written scope", "Reported cadence"],
      cta: "Enter the Firm",
    },
  },
  home: {
    neo: {
      eyebrow: "🚀 NEXARA",
      title: "We build tomorrow's",
      accent: "internet_",
      body: "Cohorts, campaigns and software, all from one studio. Three obsessions, one door each. Pick yours.",
      calloutTitle: "Three engines. Zero filler.",
      calloutBody: "Start with whichever one fixes your problem today. Need people, presence and software at the same time? Stack all three.",
    },
    trust: {
      eyebrow: "NEXARA ENTERPRISE",
      title: "Three teams. One way of working.",
      accent: "Academy · Digital · Product Studio.",
      body: "We train talent, build digital presence and ship software. Each is its own specialist team, and all three work to the same rules: a named owner, a written scope, regular reporting, and careful handling of evidence and data.",
      calloutTitle: "Each team goes deep. One way of being accountable.",
      calloutBody: "Each team knows its own craft. What they share is how they work: scoped delivery, honest reporting, claims we can back up, and clear limits on how data is used.",
    },
  },
  unbox: {
    neo: {
      eyebrow: "// UNBOX NEXARA",
      title: "Three engines, one core.",
      body: "Scroll and watch Academy, Digital Marketing and Labs click into one setup built for growth-city teams.",
      sequence: "NEXARA CORE",
    },
    trust: {
      eyebrow: "Operating model",
      title: "Specialist teams, one way of working.",
      body: "Each team owns its craft from start to finish. What connects them is the same scoping, reporting and checks, whether the work is talent, digital or software.",
      sequence: "One standard",
    },
    faces: [
      { label: "Talent Programmes", sub: "Academy capability", section: "academy", color: "var(--unbox-academy)" },
      { label: "Digital Solutions", sub: "Market systems", section: "marketing", color: "var(--unbox-marketing)" },
      { label: "AI & Automation", sub: "Applied AI systems", section: "labs", color: "var(--unbox-labs)" },
      { label: "Scope", sub: "Scoped intake", section: "contact", color: "var(--unbox-briefs)" },
      { label: "Cities", sub: "Growth context", section: "home", color: "var(--unbox-cities)" },
      { label: "Standards", sub: "Delivery control", section: "company", color: "var(--unbox-standards)" },
    ],
    signals: [
      ["Talent", "cohorts, portfolios, placement readiness"],
      ["Digital", "positioning, websites, content, demand"],
      ["AI", "workflow discovery, AI systems, guardrails"],
      ["Core", "scoping, reporting, operating readiness"],
    ],
  },
  market: {
    title: {
      neo: "Built for the cities everyone's sleeping on.",
      trust: "Built for India's growth markets.",
    },
    body: {
      neo: "We're tuned for places where talent is hungry, local brands are going digital fast and AI is only now getting real.",
      trust: "We work where we can show results: Indian growth cities where demand for skills, regional brand-building and digitisation are all picking up at the same time.",
    },
    cities: ["Visakhapatnam", "Vijayawada", "Coimbatore", "Indore", "Nagpur", "Surat", "Mysuru", "Bhubaneswar"],
    assumptions: [
      "Students and freshers need employable portfolios, English communication support and interview readiness.",
      "SMBs and regional brands need affordable brand, web, social and lead-generation systems.",
      "Hospitals, institutes, real estate, logistics and service businesses need practical automation before advanced AI.",
      "Buyers prefer clear packages, visible deliverables, local proof and WhatsApp-friendly enquiry flows.",
    ],
  },
  superSkills: [
    {
      title: "City Launch Stack",
      sections: ["Academy", "Digital Marketing", "Labs"],
      neo: "Train the local crew, launch the brand, set up the follow-up. Done before your competitors finish their morning meeting.",
      trust: "Opening in a new city? One scoped engagement covers trained local hires, a launched brand and automated follow-up, all under one owner.",
      stack: ["Hiring pipeline", "Launch website", "Lead capture", "AI follow-up"],
    },
    {
      title: "Placement Growth Loop",
      sections: ["Academy", "Digital Marketing", "Labs"],
      neo: "Learner wins become proof, proof brings demand, demand feeds the next hiring round. It's a loop and it works.",
      trust: "Cohort scores shape what employers are asked for, outcomes become documented proof, and that proof helps the next hiring round. One loop, reported from training to placement.",
      stack: ["Cohort scoring", "Employer requirements", "Outcome stories", "Placement dashboard"],
    },
    {
      title: "AI-Ready Business Kit",
      sections: ["Digital Marketing", "Labs"],
      neo: "Get a regional brand its website, clean data and first automations before the AI wave hits. Be ready, not scrambling.",
      trust: "Put the website, a structured knowledge base and first automations in place. An AI rollout needs that foundation before it can handle real traffic.",
      stack: ["Service pages", "Knowledge base", "Document AI", "Workflow audit"],
    },
    {
      title: "Founder Visibility Engine",
      sections: ["Digital Marketing", "Labs"],
      neo: "Get the founder seen, sharpen the offer and make every inbound easy to follow up. Stop hiding the best product in the room.",
      trust: "Sharpen the founder's positioning, keep a steady content calendar and route every enquiry into your CRM, so interest turns into a pipeline you can track.",
      stack: ["Positioning", "Content system", "Landing pages", "Lead routing"],
    },
    {
      title: "Institution Outcome OS",
      sections: ["Academy", "Digital Marketing", "Labs"],
      neo: "Help colleges lead with outcomes: training, reports and placement proof people can check.",
      trust: "Give the institution training tracks, progress reports, demo days and placement analytics the placement cell can stand behind.",
      stack: ["Training tracks", "Progress reports", "Demo days", "Placement analytics"],
    },
  ],
  sections: {
    academy: {
      id: "academy",
      index: "01",
      name: "Academy",
      short: { neo: "Learn fast. Build proof. Get placed. Receipts included.", trust: "Talent built cohort by cohort, with reported placement readiness." },
      statement: "One path for talent: Map → Cohort → Proof → Place. Students take it first; colleges and employers join the same spine.",
      hero: {
        neo: {
          eyebrow: "🎓 NEXARA ACADEMY",
          title: "Skills that hit different.",
          accent: "Train. Build. Show.",
          body: "Built for students who want proof, not certificates. Colleges and employers plug into the same Map → Cohort → Proof → Place path.",
          primary: "See the tracks",
          secondary: "Placement proof",
        },
        trust: {
          eyebrow: "Talent Programmes",
          title: "Talent built until the portfolio speaks first.",
          accent: "Map → Cohort → Proof → Place.",
          body: "Students first: mapped tracks, cohort delivery, portfolio proof and placement prep. Colleges and employers enter through the same four-stage path.",
          primary: "Plan an Academy programme",
          secondary: "See the placement workflow",
        },
      },
      stats: [["1", "primary path"], ["4", "delivery stages"], ["3", "audience lanes"], ["3", "programme packages"]],
      modules: [
        { title: "Career Tracks", neo: "Full-stack, AI, design and growth. Sprint-based builds that get you to \"yeah, I'd hire them.\"", trust: "Tracks for engineering, data, design, cloud and growth roles. Each is built around what employers look for, rather than a syllabus." },
        { title: "Internship Engine", neo: "Real projects, mentors on your case and something to show every week. You work like a junior from week one.", trust: "Managed internships with an assigned mentor, a delivery checkpoint every week and portfolio pieces you can point to." },
        { title: "Placement Desk", neo: "Profile polish, mock interviews and matching with hiring partners. No placement-office theatre.", trust: "We take the employer's requirements, screen candidates, prep them for interviews and track each one to offer stage. Someone owns the pipeline." },
        { title: "Campus Programmes", neo: "Turn classrooms into launch rooms, with dashboards students actually open.", trust: "Programmes for institutions, with cohort reports, outcome tracking and a clear owner on the placement cell's side." },
      ],
      stack: ["Full-Stack Engineering", "Data & AI", "Product Design", "Cloud & DevOps", "Growth Marketing", "Portfolio Reviews"],
      audiences: [
        { title: "Students", neo: "Primary lane. Portfolio that stands up in interviews — track, ship, get placement-ready.", trust: "Primary lane. Mapped track, cohort delivery, portfolio proof and placement prep on one plan." },
        { title: "Colleges", neo: "Secondary lane. Internship rhythm you can report: weekly demos, scores, completion proof.", trust: "Secondary lane. Managed internship batches with weekly reporting the placement cell can show leadership." },
        { title: "Employers", neo: "Secondary lane. Juniors who already shipped, screened against your written role brief.", trust: "Secondary lane. Role-fit screening and interview prep against a written hiring brief." },
      ],
      stackDetails: [
        { title: "Full-Stack Engineering", outcome: "Deployable apps", deliverables: ["React interfaces", "API foundations", "Database basics", "Deployment workflow"] },
        { title: "Data & AI", outcome: "Analytical projects", deliverables: ["Data cleaning", "Dashboards", "Model basics", "AI use cases"] },
        { title: "Product Design", outcome: "Portfolio-ready UX", deliverables: ["User flows", "Wireframes", "UI systems", "Case studies"] },
        { title: "Cloud & DevOps", outcome: "Operational fluency", deliverables: ["Git workflow", "Hosting", "CI basics", "Monitoring"] },
        { title: "Growth Marketing", outcome: "Campaign literacy", deliverables: ["Funnels", "Landing pages", "Content tests", "Reporting"] },
        { title: "Portfolio Reviews", outcome: "Hiring proof", deliverables: ["Project audits", "Resume review", "Mock interviews", "Profile polish"] },
      ],
      process: [
        { step: "01", title: "Map", body: "Skill level, target role, portfolio gaps. Opens into a track." },
        { step: "02", title: "Cohort", body: "Live sessions, project sprints, mentor reviews, weekly demos." },
        { step: "03", title: "Proof", body: "Projects become case studies and interview-ready narratives." },
        { step: "04", title: "Place", body: "Interview prep, partner matching, or a written outcome report." },
      ],
      packages: [
        { name: "Career Cohort", fit: "Students → Tracks", price: "Priced per cohort and city", duration: "Set by track length", includes: ["Facilitated cohort sessions", "Project portfolio", "Mentor reviews", "Placement prep"] },
        { name: "Internship Batch", fit: "Colleges → Internships", price: "Priced per batch size", duration: "Aligned to the academic calendar", includes: ["Managed internship", "Weekly reports", "Completion scoring", "Demo day"] },
        { name: "Hiring Pipeline", fit: "Employers → Placements", price: "Custom, role-based", duration: "Runs until roles close", includes: ["Role requirements", "Candidate screening", "Interview shortlist", "Offer tracking"] },
      ],
      faqs: [
        ["Is Academy only for students?", "Students are the primary lane. Colleges and employers join the same Map → Cohort → Proof → Place path through Internship Batch and Hiring Pipeline packages."],
        ["Do you guarantee placement?", "We prepare people for placement, support portfolios and coordinate with hiring partners where that's in scope. We don't offer a general placement guarantee. Any hiring commitment has to be scoped and written down separately."],
        ["How is this different from a standard skilling course?", "One mapped path with real projects, mentor reviews and a portfolio, not a syllabus finish line."],
      ],
      intake: { primary: "Start with a student cohort", secondary: "Tell us city, learner count, target roles and timeline. Colleges and employers: say which lane you need. We return a scoped programme with a named owner." },
      subpages: [
        {
          slug: "tracks",
          title: "Tracks",
          callout: { neo: "Pick a lane, build proof, stop sounding entry-level. The glow-up starts here.", trust: "Each track maps to a hiring signal and ends in a measurable skill outcome." },
          cards: [
            { title: "Full-stack sprint", neo: "Ship interfaces, APIs and deployable flows. Real output, not slides.", trust: "Frontend, backend and deployment basics. You finish with a deployed app, not a certificate." },
            { title: "AI/data sprint", neo: "Go from notebooks to useful models and dashboards fast.", trust: "Data workflows, AI foundations and a delivered analytical project." },
            { title: "Design studio", neo: "Build product taste, UX logic and portfolio screens worth showing.", trust: "UX, interface design and product presentation, reviewed against hiring standards." },
            { title: "Cloud operations", neo: "Learn the infra basics teams expect on day one.", trust: "Cloud, DevOps and operational basics for the junior technical roles teams actually open." },
          ],
        },
        {
          slug: "internships",
          title: "Internships",
          callout: { neo: "Internships that feel like a real tech squad, not a certificate farm.", trust: "A managed bridge from learning to workplace delivery, with a checkpoint every week." },
          cards: [
            { title: "Mentor pods", neo: "Small groups, direct feedback, nowhere to hide.", trust: "Each pod has an assigned mentor owning weekly progress and quality review." },
            { title: "Weekly reviews", neo: "Every week ends with a live demo, a score and next moves.", trust: "Every week closes with a demo, a score and named next steps, so progress is on the record." },
            { title: "Client-style projects", neo: "Work on briefs that feel like actual business problems, because they are.", trust: "Project scopes match professional delivery expectations, not classroom exercises." },
            { title: "Completion reports", neo: "Leave with proof that says what you can actually build.", trust: "Final reports cover capability, participation and project quality, in a form an employer can read." },
          ],
        },
        {
          slug: "placements",
          title: "Placements",
          callout: { neo: "Get good, get seen, get hired. That's the whole playbook.", trust: "Hiring-partner workflows run inside the programme, not after it. Preparation, not a guarantee." },
          cards: [
            { title: "Interview prep", neo: "Practice until your answers stop sounding rehearsed.", trust: "Structured preparation for technical and behavioural interviews, scored before the real one." },
            { title: "Partner matching", neo: "Match skills to teams that actually need them. No spray and pray.", trust: "Candidate profiles matched against the employer's written role requirements." },
            { title: "Offer tracking", neo: "Know where every application stands. No black holes.", trust: "You can see every candidate from shortlist to interview to offer." },
            { title: "Alumni proof", neo: "Show the next cohort what the path looks like. Real receipts.", trust: "Documented outcomes that build institution and employer confidence. Each one is approved before it's published." },
          ],
        },
      ],
      proof: [
        { name: "Learner cohort", result: { neo: "Portfolio proof built for interviews, not a folder nobody opens", trust: "Applied projects converted into review-ready portfolios, scored against hiring criteria" }, org: "Academy programme" },
        { name: "College batch", result: { neo: "Internship rhythm made visible: weekly, scored, no guesswork", trust: "Weekly reporting and completion scoring put on the record for the placement cell" }, org: "Institution programme" },
        { name: "Employer shortlist", result: { neo: "Screened profiles, less hiring theater", trust: "Role-fit screening and interview prep delivered against a written hiring brief" }, org: "Hiring support" },
      ],
    },
    marketing: {
      id: "marketing",
      index: "02",
      name: "Digital Marketing",
      short: { neo: "Found first. Trusted next. Then we spend.", trust: "Discoverable, credible, then measurable growth." },
      statement: "We do not start by advertising the business. We first make sure it can be discovered, trusted, and contacted. A customer sees an advertisement, searches, and finds no website, no social presence, no reviews and no way to enquire. That customer is lost before they ever make contact. The work follows six phases so that does not happen.",
      hero: {
        neo: {
          eyebrow: "📣 NEXARA DIGITAL MARKETING",
          title: "We don't start with ads.",
          accent: "found, then trusted.",
          body: "First we make the business findable and worth contacting. Then we bring the right people. Then we turn that attention into enquiries you can measure.",
          primary: "See the approach",
          secondary: "See the work",
        },
        trust: {
          eyebrow: "Digital Solutions",
          title: "Presence first. Trust next. Growth after.",
          accent: "Discoverable, then credible.",
          body: "Digital marketing starts before the first advertisement. We establish a credible online identity, then search and content visibility, then paid acquisition, measured and refined in stages.",
          primary: "Scope a digital project",
          secondary: "Digital presence",
        },
      },
      stats: [["6", "phases"], ["3", "service lines"], ["4", "approach steps"], ["3", "ways to start"]],
      modules: [
        { title: "Digital Presence & Branding", neo: "The site, the look, the Google listing and a way to enquire. This has to exist before an ad is worth buying.", trust: "Website, brand identity, Google Business Profile, listings and lead-capture channels, scoped as one foundation." },
        { title: "Content & Search Visibility", neo: "SEO, articles, and pages that answer real questions. A mention in ChatGPT or Gemini is a chance, not a promise.", trust: "Search optimisation, content and answer-style structure, including generative-engine readiness. Citation in any AI product is not guaranteed." },
        { title: "Performance Marketing & Growth", neo: "Ads, retargeting and creators, spent in stages. Every rupee reports back to enquiries.", trust: "Paid media, retargeting and influencer collaborations, run in stages and reported against enquiries and conversions." },
      ],
      stack: ["Presence", "Search", "Content", "Paid ads", "Influencers", "Reporting"],
      audiences: [
        { title: "Founders", neo: "You have an offer. People still can't find a site, a listing, or a way to ask. Fix that before you scale spend.", trust: "Founder-led companies that need a findable identity and an enquiry path before media spend increases." },
        { title: "Growing Brands", neo: "The brand is known locally, but a search still lands on an empty profile or a quiet page. Close that gap.", trust: "Regional businesses whose search and social presence does not yet match the reputation they have offline." },
        { title: "Multi-branch teams", neo: "More than one location, and every branch posting on its own. One presence, one monthly read on what worked.", trust: "Multi-branch teams that need one presence, one content rhythm and reporting leadership can read." },
      ],
      stackDetails: [
        { title: "Digital footprint", outcome: "Findable and contactable", deliverables: ["Website design and development", "Brand identity and positioning", "Google Business Profile", "Business listings", "Enquiry and lead capture"] },
        { title: "Social presence", outcome: "The platforms that matter", deliverables: ["Instagram and Facebook", "LinkedIn", "YouTube", "Quora", "Industry-specific platforms"] },
        { title: "Search and AI visibility", outcome: "Easier to discover", deliverables: ["SEO", "Blogs and service content", "Answer engine optimisation", "Generative engine optimisation", "Local SEO"] },
        { title: "Paid ads and retargeting", outcome: "Spend in stages", deliverables: ["Google Ads", "Instagram and Facebook Ads", "LinkedIn Ads", "Lead generation", "Retargeting", "Conversion tracking"] },
        { title: "Content and influencers", outcome: "A feed that keeps going", deliverables: ["Posters and creative", "Reels and short video", "Brand storytelling", "Product and service promotions", "Influencer collaborations"] },
        { title: "Measure and grow", outcome: "Next month from last month", deliverables: ["Traffic", "Engagement", "Enquiries", "Conversions", "Spend refinement"] },
      ],
      // The marketing page (shared renderer: components/shared/MarketingPage.tsx). Order lives in
      // MARKETING_FLOW (site.ts); headings and CTAs in COPY.marketing. Facts are shared, wording is per voice.
      page: {
        hero: {
          lines: { neo: ["Someone searches", "your name."], trust: ["A customer searches", "the business."] },
          leave: { neo: "Then they leave before they ever reach out.", trust: "They leave before they ever make contact." },
          query: { neo: "your business name", trust: "the business name" },
          results: [
            { neo: "Website", trust: "Website" },
            { neo: "Social presence", trust: "Social presence" },
            { neo: "Reviews", trust: "Reviews" },
            { neo: "A way to reach you", trust: "A way to enquire" },
          ],
          miss: { neo: "Nothing", trust: "Not there" },
        },
        story: {
          neo: "We don't start with ads. First we make sure people can find you, trust you, and reach you.",
          trust: "We do not start by advertising the business. We first make sure it can be discovered, trusted, and contacted.",
        },
        // One record row per phase, in phase order. `miss` shows until the phase is reached, then `found`.
        record: [
          { label: "Website", miss: { neo: "Missing", trust: "Not there" }, found: { neo: "Site, brand, listing, a way in", trust: "Site, brand, listing, enquiry" } },
          { label: "Social", miss: { neo: "Missing", trust: "Not there" }, found: { neo: "Only the apps that matter", trust: "The platforms that matter" } },
          { label: "Search", miss: { neo: "Missing", trust: "Not there" }, found: { neo: "Easier to find", trust: "Easier to discover" } },
          { label: "Ads", miss: { neo: "Not yet", trust: "Not yet" }, found: { neo: "Spend in stages", trust: "Spend in stages" } },
          { label: "Content", miss: { neo: "Not yet", trust: "Not yet" }, found: { neo: "A feed that keeps going", trust: "A rhythm that continues" } },
          { label: "Reporting", miss: { neo: "Not yet", trust: "Not yet" }, found: { neo: "Next month runs on last month", trust: "Next month from last month" } },
        ],
        // `track` colours the phase: presence (1-2), visibility (3), performance (4-6).
        phases: [
          {
            track: "presence",
            title: { neo: "Get a real footprint", trust: "Establish your digital footprint" },
            body: { neo: "Before a rupee goes to ads, there has to be somewhere to land. Website, brand, Google Business Profile, listings, and a way to enquire.", trust: "Before any media spend, we establish a credible online identity: website, brand positioning, Google Business Profile, business listings and enquiry channels." },
            includes: { neo: "Website design and build, brand identity, Google Business Profile, business listings, enquiry and lead capture.", trust: "Website design and development, brand identity and positioning, Google Business Profile, business listings, enquiry and lead capture." },
            goal: { neo: "A customer can find you, get the offer, and get in touch.", trust: "Customers can find the business, understand the offer and make contact with confidence." },
          },
          {
            track: "presence",
            title: { neo: "Show up on social", trust: "Build your social presence" },
            body: { neo: "Not every brand needs every app. We find where your customers actually are, then set up the profiles and keep them posting. Instagram, Facebook, LinkedIn, YouTube, Quora, or a channel built for your industry.", trust: "We identify the platforms customers use, then create, optimise and publish a consistent presence there. Instagram, Facebook, LinkedIn, YouTube, Quora, or a channel specific to the industry. Not every platform." },
            includes: { neo: "Instagram and Facebook, LinkedIn, YouTube, Quora, industry-specific platforms.", trust: "Instagram and Facebook, LinkedIn, YouTube, Quora, industry-specific platforms." },
            goal: { neo: "A steady presence on the apps that fit your audience, city and budget. Nowhere you don't need.", trust: "A consistent presence on the platforms that match the audience, location and budget." },
          },
          {
            track: "visibility",
            title: { neo: "Get found in search and AI", trust: "Search and AI discoverability" },
            body: { neo: "SEO, useful content, and pages built so search engines and AI tools can read them. That raises your odds of being found. Nobody can promise a spot in ChatGPT, Gemini or any other AI app. Paid spots inside those apps, where they exist, are a separate service.", trust: "Search engine optimisation, content, answer-engine structure and generative-engine readiness. These improve the likelihood of discovery. Placement in ChatGPT, Gemini or any other AI product cannot be guaranteed. Paid placement inside those products, where it exists, is a separate service." },
            includes: { neo: "SEO, blogs and service content, answer engine optimisation, generative engine optimisation, local SEO.", trust: "SEO, blogs and service content, answer engine optimisation, generative engine optimisation, local SEO." },
            goal: { neo: "People can find you in search, and in AI answers when a tool decides to cite you.", trust: "The business is easier to discover through search engines and, where a model chooses to cite it, through AI answers." },
          },
          {
            track: "performance",
            title: { neo: "Run ads and retargeting", trust: "Paid advertising and retargeting" },
            body: { neo: "Once the foundation holds, we spend in stages. Search and social ads, audience groups, lead gen and retargeting, with conversions tracked the whole way. The budget does not go out on day one.", trust: "With the presence in place, campaigns run in stages: search and social ads, audience segments, lead generation and retargeting, with conversion tracking throughout. The budget does not go out on day one." },
            includes: { neo: "Google Ads, Instagram and Facebook Ads, LinkedIn Ads, lead generation, retargeting, conversion tracking.", trust: "Google Ads, Instagram and Facebook Ads, LinkedIn Ads, lead generation, retargeting, conversion tracking." },
            goal: { neo: "The right people, real enquiries, and a path from click to contact you can check.", trust: "The right audience, qualified enquiries and a conversion path that can be reviewed." },
          },
          {
            track: "performance",
            title: { neo: "Make content, bring in creators", trust: "Content and influencer marketing" },
            body: { neo: "Posters, reels, campaign content, and creators picked for your industry, audience, city and budget. Not a random influencer list.", trust: "Creative, short-form video, campaign content and influencer collaborations selected for the industry, audience, location and budget." },
            includes: { neo: "Posters and creative, reels and short video, brand storytelling, product and service promos, influencer collabs.", trust: "Posters and creative, reels and short video, brand storytelling, product and service promotions, influencer collaborations." },
            goal: { neo: "People keep seeing you, and the feed doesn't go quiet after month one.", trust: "Sustained awareness and a content rhythm the business can keep." },
          },
          {
            track: "performance",
            title: { neo: "Measure. Tweak. Grow.", trust: "Measure, optimise, and grow" },
            body: { neo: "Campaign results, site traffic, engagement, enquiries and conversions get checked. Then we change the content, the audience and the spend to match.", trust: "Campaign performance, site traffic, engagement, enquiries and conversions are reviewed, then used to optimise content, audiences and spend." },
            includes: { neo: "Traffic, engagement, enquiries, conversions, smarter spend.", trust: "Traffic, engagement, enquiries, conversions, spend refinement." },
            goal: { neo: "Next month's plan comes from last month's numbers.", trust: "The following month’s plan is set by the previous month’s results." },
          },
        ],
        // "Where you are now": one entry per service line (subpages), same order.
        starts: [
          { neo: "People can't find you or reach you yet. Website, brand identity, Google Business, a way to enquire.", trust: "Businesses people cannot find or contact yet. Website, brand identity, Google Business, enquiry path." },
          { neo: "You have a site, and search still skips it. SEO, articles, answer pages, local listings. A ChatGPT or Gemini mention is never guaranteed.", trust: "A site exists, and search still misses it. SEO, articles, answer-style pages, local listings. A mention in ChatGPT or Gemini is not guaranteed." },
          { neo: "Ready to spend on the right people. Paid ads, retargeting, creators, reports. Checked every month.", trust: "Ready to spend on the right audience. Paid ads, retargeting, influencers, reporting. Reviewed each month." },
        ],
        who: [
          { neo: "Founders who need to be findable, with a way to reach them, before ad spend goes up.", trust: "Founders who need a findable identity and an enquiry path before media spend increases." },
          { neo: "Growing brands known offline whose search and social don't match that name yet.", trust: "Growing brands whose search and social presence does not yet match the reputation they have offline." },
          { neo: "Teams with more than one branch that need one presence, one content rhythm, and reports the boss can actually read.", trust: "Multi-branch teams that need one presence, one content rhythm and reporting leadership can read." },
        ],
        // Visible FAQ per voice. Trust is the shared `faqs` list below; JSON-LD uses the same per-theme list (seo.ts marketingFaqs).
        faqsNeo: [
          ["Do you start with ads?", "Nope. Website, listings and a way to reach you come first. Ads start once that can hold a visitor."],
          ["Can you get us into ChatGPT or Gemini?", "Not as a promise. We structure your content so the odds of being cited go up. Nobody can guarantee a spot in an AI product. Paid ads inside those apps, where they exist, are a separate service."],
          ["Can Nexara run this every month?", "Yes. Launch projects, monthly content and ad campaigns, sized to your budget and the phase you're in."],
          ["What do you need from us to start?", "Your offer, who you sell to, your city, the site and profiles you already have, a budget range, and the goal."],
        ] as [string, string][],
      },
      process: [
        { step: "01", title: "Discoverable", body: "Make the business findable: a website, listings and a way to enquire, before any ad spend." },
        { step: "02", title: "Credible", body: "Make that same business look consistent and worth contacting: identity, reviews and answers to real questions." },
        { step: "03", title: "Right audience", body: "Bring the people who fit the offer, through paid media, retargeting and creators chosen for the industry." },
        { step: "04", title: "Growth", body: "Turn that attention into enquiries, report on it, and refine the spend." },
      ],
      packages: [
        { name: "Presence", fit: "Businesses people cannot find or contact yet", price: "Priced per identity and site scope", duration: "Confirmed at kickoff", includes: ["Website", "Brand identity", "Google Business", "Enquiry path"] },
        { name: "Visibility", fit: "A site exists, and search still misses it", price: "Monthly, scoped to content volume", duration: "Rolling, cadence agreed in scope", includes: ["SEO", "Articles", "Answer-style pages", "Local listings"] },
        { name: "Performance", fit: "Ready to spend on the right audience", price: "Monthly retainer, scoped to ad budget", duration: "Rolling, reviewed each month", includes: ["Paid ads", "Retargeting", "Influencers", "Reporting"] },
      ],
      faqs: [
        ["Do you start with ads?", "No. We put the website, listings and an enquiry path in place first. Paid media starts once that foundation can hold a visitor."],
        ["Can you get us mentioned in ChatGPT or Gemini?", "No. We can structure content so the chance of being cited improves. Placement in any AI product cannot be guaranteed. Paid advertising inside those products, where it exists, is a separate service."],
        ["Can Nexara run this every month?", "Yes. Launch projects, monthly content and performance campaigns, scoped to the budget and the phase you are in."],
        ["What do you need before starting?", "Your offer, who you sell to, the city, the site and profiles you already have, a budget range, and the business goal."],
      ],
      intake: { primary: "Scope a digital project", secondary: "Tell us the city, the offer, the current website and profiles, and whether you need to be found, trusted, or already ready to spend. We return a phase plan, deliverables and a reporting cadence." },
      subpages: [
        {
          slug: "presence",
          title: "Presence",
          heading: { neo: "What people see when they look you up.", trust: "The digital identity a customer meets on search." },
          callout: { neo: "Site, brand, listings and a way to reach you, all before a single ad. Priced by identity and site scope, locked in at kickoff.", trust: "Site, brand, listings and a way to enquire. Built before any campaign spend. Priced per identity and site scope, confirmed at kickoff." },
          cards: [
            { title: "Website", neo: "A site that says what you do and gives one clear way to get in touch.", trust: "A site that explains the offer and routes the visitor to a single enquiry action." },
            { title: "Brand identity", neo: "Name, look and words that match on the site, the listing and the feed.", trust: "Positioning, visual system and messaging documented so every channel reads as the same business." },
            { title: "Google Business", neo: "The profile, the category, the hours, the photos. The thing maps and search show first.", trust: "Google Business Profile setup and optimisation, plus the listings a local search expects." },
            { title: "Enquiry path", neo: "A form, a number, a WhatsApp. Someone interested can actually reach you.", trust: "Contact, enquiry and lead-capture channels agreed and wired before campaigns launch." },
          ],
        },
        {
          slug: "visibility",
          title: "Visibility",
          heading: { neo: "Show up in search and answer boxes.", trust: "Search and answer-style visibility." },
          callout: { neo: "Monthly, sized to how much content you need. Nobody can promise a ChatGPT or Gemini mention, so we don't.", trust: "Monthly, scoped to content volume. Citation by ChatGPT, Gemini or any other AI product cannot be guaranteed." },
          cards: [
            { title: "SEO", neo: "Pages, headings and internal links so Google can tell what you offer and where.", trust: "Metadata, page structure, internal links and local SEO, including the Google Business Profile." },
            { title: "Content", neo: "Articles and service pages that answer the questions customers already type.", trust: "Blogs, articles and service content planned around real customer questions." },
            { title: "Answer pages", neo: "Short, direct answers. Built so a search result or an AI summary can lift them cleanly.", trust: "Clear questions, direct answers, and pages a citation can point to." },
            { title: "AI citations", neo: "We raise the odds of being referenced. We don't sell a guaranteed ChatGPT or Gemini spot. Ads inside AI apps get scoped on their own.", trust: "Generative-engine work improves the likelihood of a citation. It is not a placement guarantee. Paid ads inside AI products are scoped separately." },
          ],
        },
        {
          slug: "performance",
          title: "Performance",
          heading: { neo: "Ads, once there's something worth landing on.", trust: "Paid acquisition, after the presence can hold it." },
          callout: { neo: "Monthly retainer, sized to your ad budget. Reports on a set rhythm, and a written plan for what changes next.", trust: "Monthly retainer, scoped to the ad budget, with a reporting cadence and a documented optimisation loop." },
          cards: [
            { title: "Paid ads", neo: "Search and social ads aimed at named audiences, with a clear offer and budgets released in stages.", trust: "Search and social campaigns built around named audiences, a clear offer and staged budgets." },
            { title: "Retargeting", neo: "Bring back people who already looked, once the site can handle the second visit.", trust: "Retargeting sequenced by behaviour and intent, after the presence can hold the return visit." },
            { title: "Influencers", neo: "Creators picked for the industry, the city and the budget. Not a borrowed fame list.", trust: "Collaborations selected for industry, audience, location and budget." },
            { title: "Reporting", neo: "Enquiries, spend and what changed. A monthly read, not a vanity dashboard.", trust: "Monthly reporting on traffic, engagement, enquiries and conversions, used to refine the next cycle." },
          ],
        },
      ],
      proof: [
        { name: "Founder-led service brand", result: { neo: "Site, listing and enquiry path in place before any campaign spend", trust: "Website, listing and enquiry flow defined before media was introduced" }, org: "Presence" },
        { name: "Regional healthcare business", result: { neo: "Pages and a content rhythm that answer the questions patients already ask", trust: "Content pillars and service pages structured around patient questions" }, org: "Visibility" },
        { name: "Multi-location business", result: { neo: "One channel plan and a monthly review, instead of each branch posting alone", trust: "A shared channel plan and a monthly performance review across locations" }, org: "Performance" },
      ],
    },
    labs: {
      id: "labs",
      index: "03",
      name: "Product Studio",
      neoName: "Labs",
      short: { neo: "We build the system that solves the problem. SaaS, products, integrations, AI where it fits.", trust: "Software that solves the problem: SaaS, B2B products and integrations, with AI where it earns its place." },
      statement: "Technology is never the point. The problem is. We build the system that solves it: SaaS, B2B products, integrations, and AI only where it earns its place.",
      hero: {
        neo: {
          eyebrow: "🛠️ NEXARA LABS",
          title: "We build the system that solves the problem.",
          accent: "SaaS, products, integrations. AI where it fits.",
          body: "Labs turns business problems into working software: SaaS platforms, B2B products, internal tools and the integrations that tie them together. AI and automation only go in where they earn it.",
          primary: "See what we build",
          secondary: "Product proof",
        },
        trust: {
          eyebrow: "Product Studio",
          title: "We build the system that solves the problem.",
          accent: "SaaS, B2B products, integrations. AI where it fits.",
          body: "Product Studio designs and ships custom software, SaaS platforms, B2B products and the integrations that tie them together. Each build starts from a real business problem, and AI and automation come in only where they help.",
          primary: "Scope a build",
          secondary: "See how we build",
        },
      },
      stats: [["5", "delivery pillars"], ["3", "build packages"], ["4", "stage delivery"], ["100%", "problem-scoped"]],
      layers: [
        { id: "data", label: "DATA", line: { neo: "Your data, modelled and synced", trust: "Data model, sources and sync" } },
        { id: "services", label: "SERVICES", line: { neo: "Logic, APIs and AI that run it", trust: "Business logic, APIs and AI" } },
        { id: "interface", label: "INTERFACE", line: { neo: "The screens people actually use", trust: "Portals, applications and product UI" } },
        { id: "live", label: "LIVE", line: { neo: "Shipped, monitored, on call", trust: "Deployed, monitored and supported" } },
      ],
      modules: [
        { id: "saas", layers: ["data", "services", "interface"], stack: "SaaS & Web Apps", subpage: "products", problem: { neo: "Idea to live product, no template traps.", trust: "From concept to a production SaaS product." }, title: "Custom Software & SaaS", neo: "Web apps and SaaS built from scratch, architecture to ship. No template traps.", trust: "Web apps and SaaS platforms built from scratch: architecture, product UI and a clear path to ship and scale." },
        { id: "b2b", layers: ["services", "interface"], stack: "B2B Platforms", subpage: "products", problem: { neo: "Ops running on spreadsheets and tab chaos.", trust: "Operations run on spreadsheets and disconnected tools." }, title: "B2B Products & Platforms", neo: "Portals, dashboards and internal platforms that run the actual operation.", trust: "Portals, dashboards and internal platforms that run real business operations, not demos." },
        { id: "integrations", layers: ["data", "services"], stack: "Integrations", subpage: "delivery", problem: { neo: "Tools that never talk to each other.", trust: "Systems that do not share data." }, title: "Integrations & Systems", neo: "APIs, pipelines and internal tools so your stack finally talks to itself.", trust: "APIs, data pipelines and systems integration so tools, teams and data actually talk to each other." },
        { id: "ai", layers: ["services"], stack: "AI & Automation", subpage: "ai-automation", problem: { neo: "Repeat work a model can handle.", trust: "Repetitive work suited to applied AI." }, title: "AI & Automation", neo: "RAG, agents and document AI, added where they earn it and with brakes on.", trust: "RAG, agents and document AI applied where they earn their place, with evaluation, guardrails and human review." },
        { id: "ecommerce", layers: ["interface", "services"], stack: "SaaS & Web Apps", subpage: "ecommerce", problem: { neo: "Buyers cannot find or compare your products.", trust: "Buyers cannot easily find or compare products." }, title: "E-commerce & Product Sites", neo: "Catalogues, model directories and quote flows for businesses that sell considered purchases. Prototyped before it's built.", trust: "Product catalogues, model directories, calculators and enquiry flows for businesses with considered purchases, built after the business is understood and prototypes are agreed." },
      ],
      stack: ["Product Architecture", "SaaS Builds", "B2B Platforms", "Integrations", "AI & Automation", "Cloud & DevOps"],
      audiences: [
        { id: "founders", pain: { neo: "Need a real product, not a prototype", trust: "Need a product built correctly the first time" }, package: "Product Build", title: "Founders & Startups", neo: "For founders who need a real product built right, MVP to scale. Not a throwaway prototype.", trust: "Founders who need a product built right the first time, from MVP to scale." },
        { id: "ops", pain: { neo: "Manual work, tools that don't connect", trust: "Manual work and disconnected tools" }, package: "Discovery Sprint", title: "Operations Teams", neo: "For teams buried in manual work and disconnected tools that should be one system.", trust: "Teams stuck with manual work and disconnected tools who need software that actually runs the operation." },
        { id: "leadership", pain: { neo: "Want a scoped build tied to an outcome", trust: "Require a scoped build tied to an outcome" }, package: "Discovery Sprint", title: "Leadership Teams", neo: "For owners who want a scoped build tied to a real outcome. Not another deck.", trust: "Decision-makers who want a scoped build with a clear path from business problem to working software." },
      ],
      stackDetails: [
        { title: "Product Architecture", layer: "data", outcome: "Built to scale", deliverables: ["System design", "Data model", "Tech stack", "Scale plan"] },
        { title: "SaaS & Web Apps", layer: "interface", outcome: "Shippable product", deliverables: ["Product UI", "Auth & billing", "Core features", "Deploy pipeline"] },
        { title: "B2B Platforms", layer: "interface", outcome: "Operational software", deliverables: ["Admin portals", "Dashboards", "Roles & access", "Workflows"] },
        { title: "Integrations", layer: "services", outcome: "Connected systems", deliverables: ["API integrations", "Data sync", "Webhooks", "Internal tools"] },
        { title: "AI & Automation", layer: "services", outcome: "Applied where it fits", deliverables: ["Retrieval / RAG", "Agent workflows", "Document AI", "Guardrails & review"] },
        { title: "Cloud & DevOps", layer: "live", outcome: "Reliable delivery", deliverables: ["Hosting", "CI/CD", "Monitoring", "Security review"] },
      ],
      process: [
        { step: "01", label: "Frame", gate: { neo: "Problem and outcome agreed", trust: "Problem and outcome agreed" }, outputs: [], title: "Frame the problem", body: "Start with the business problem and the outcome you need, not the technology." },
        { step: "02", label: "Design", gate: { neo: "Architecture signed off", trust: "Architecture approved" }, outputs: ["Product Architecture"], title: "Design the system", body: "Architecture, product scope, data, integrations, and where AI actually helps." },
        { step: "03", label: "Build", gate: { neo: "Tested on real use", trust: "Tested against real use" }, outputs: ["SaaS & Web Apps", "B2B Platforms", "Integrations", "AI & Automation"], title: "Build and prove", body: "Ship in increments, test against real use, and harden what holds." },
        { step: "04", label: "Launch", gate: { neo: "Live, monitored, handed over", trust: "Live with monitoring in place" }, outputs: ["Cloud & DevOps"], title: "Launch and support", body: "Deploy with monitoring, then iterate, clean handover or ongoing support." },
      ],
      packages: [
        { name: "Discovery Sprint", fit: "Teams scoping a build", price: "Fixed-scope sprint pricing", duration: "Short sprint, dates agreed in scope", includes: ["Problem mapping", "Solution architecture", "Scope & estimate", "Build roadmap"] },
        { name: "Product Build", fit: "Teams ready to ship", price: "Priced per product scope", duration: "Set by build phases", includes: ["Architecture", "Product build", "QA & evaluation", "Production launch"] },
        { name: "Build & Run", fit: "Teams needing ongoing delivery", price: "Retainer scoped to roadmap", duration: "Ongoing, cadence agreed", includes: ["Feature delivery", "Integrations", "AI & automation", "Monitoring & support"] },
      ],
      specialisms: [
        { id: "agri", title: { neo: "Agri platforms", trust: "Agricultural platforms" }, line: { neo: "Software for training programmes and FPO records.", trust: "Software for training programmes and FPO records." }, links: [{ kind: "proof", id: "Happy Farms" }, { kind: "product", id: "grow" }] },
        { id: "voice", title: { neo: "Voice and AI", trust: "Applied AI" }, line: { neo: "Voice agents and automation where the work repeats.", trust: "Voice agents and automation where the work repeats." }, links: [{ kind: "product", id: "voice" }] },
        { id: "ops", title: { neo: "Operating systems", trust: "Business operating systems" }, line: { neo: "Pipeline, tasks, quotes and approvals in one workspace.", trust: "Pipeline, tasks, quotes and approvals in one workspace." }, links: [{ kind: "product", id: "agency" }] },
        { id: "buyer", title: { neo: "Buyer tools", trust: "Buyer tools" }, line: { neo: "Catalogues, estimators and calculators on the product site.", trust: "Catalogues, estimators and calculators on the product site." }, links: [{ kind: "proof", id: "Sri Engineering Works" }, { kind: "proof", id: "Qualigene Lifesciences" }] },
      ],
      products: [
        { id: "voice", name: "Nexara Voice", url: "https://voice.nexaragroups.com/", status: "live", layers: ["services"], module: "ai", line: { neo: "Voice agents that answer from your own knowledge.", trust: "Voice agents grounded in your knowledge, run from a console." } },
        { id: "agency", name: "Agency OS", url: "https://portal.nexaragroups.com/", status: "live", layers: ["data", "services", "interface"], module: "b2b", line: { neo: "Lead to quote, project, task and the client portal.", trust: "From lead to quote, project, task and client portal." } },
        { id: "grow", name: "HappyGrow", url: "http://fpo.nexaragroups.in/", status: "demo", layers: ["data", "services", "interface"], module: "saas", line: { neo: "Farmer, crop and wealth records, household to district.", trust: "Farmer, crop and wealth records, from household to district." } },
      ],
      proofMap: [
        { client: "Happy Farms", layers: ["data", "services", "interface"], module: "saas" },
        { client: "Sri Engineering Works", layers: ["interface", "services"], module: "ecommerce" },
        { client: "Qualigene Lifesciences", layers: ["interface"], module: "ecommerce" },
      ],
      faqs: [
        ["Do you only build AI products?", "No. We build SaaS, B2B products, internal platforms and integrations. AI and automation go in where they genuinely help, never just to look modern."],
        ["Can you build a full product from scratch?", "Yes. We take it from problem framing and architecture through build, launch and support, MVP to scale, on whichever stack fits the job."],
        ["Do you build e-commerce and product sites?", "Yes. Catalogues, model directories, calculators and quote flows, built after we understand the business and agree prototypes. Sri Engineering Works was our first such build."],
        ["What is the first step?", "Every engagement starts by framing the problem and the outcome. We map the solution, scope the build, and agree a roadmap before any development begins."],
      ],
      intake: { primary: "Scope a build", secondary: "Tell us the problem, your current tools, the users and the outcome you need. We return a solution approach, scope and roadmap before any build." },
      subpages: [
        {
          slug: "products",
          title: "Products & SaaS",
          callout: { neo: "SaaS and B2B products built around the real problem, scoped before they ship.", trust: "SaaS platforms and B2B products built around a real business problem, scoped to your case before they ship." },
          cards: [
            { title: "SaaS Platforms", neo: "Multi-tenant products with auth, billing and a path to scale.", trust: "Multi-tenant SaaS with authentication, billing and a clear path to scale." },
            { title: "B2B Products", neo: "Portals and platforms that run real operations, not demos.", trust: "Customer portals and B2B platforms built around live business operations." },
            { title: "Internal Tools", neo: "Dashboards and admin tools that replace the spreadsheet sprawl.", trust: "Dashboards and internal tools that replace manual spreadsheets and ad-hoc processes." },
            { title: "MVP to Scale", neo: "Start lean, prove it, then harden for real traffic.", trust: "Start with a focused MVP, prove it against real use, then harden for scale." },
          ],
        },
        {
          slug: "ai-automation",
          title: "AI & Automation",
          callout: { neo: "AI added where it earns it: grounded, evaluated, with brakes on.", trust: "AI and automation applied where they earn their place: grounded, evaluated and controlled." },
          cards: [
            { title: "Retrieval / RAG", neo: "Grounded answers over your own knowledge, every source traced.", trust: "Grounded retrieval over internal knowledge. Every answer cites its source." },
            { title: "Agents", neo: "Agent workflows with scoped tools, logs and brakes built in.", trust: "Agent workflows with scoped tool access, trace logs and evaluation from the start." },
            { title: "Document AI", neo: "Messy docs become structured, reviewable data.", trust: "Extraction and classification for operational documents, with validation before export." },
            { title: "Guardrails", neo: "Evaluations and human review where judgment actually matters.", trust: "Evaluation, guardrails and a human review step on risk-sensitive outputs, by design." },
          ],
        },
        {
          slug: "ecommerce",
          title: "E-commerce & product sites",
          callout: { neo: "Catalogues, estimators and quote flows that help buyers choose. Built after we understand your business, not before.", trust: "Product catalogues, specification directories and enquiry flows for businesses that sell considered purchases, built after we understand the business and agree prototypes with you." },
          cards: [
            { title: "Catalogues & model directories", neo: "Every product or model in one searchable directory, so buyers find the right one without calling first.", trust: "Product catalogues and model or specification directories with search, structured so buyers can compare and shortlist." },
            { title: "Quote & site-survey flows", neo: "Enquiry, quote and free site-survey requests that reach your team with the details they need.", trust: "Enquiry, quote-request and site-survey flows that capture the details your team needs to respond." },
            { title: "Calculators & estimators", neo: "Tools like a cooling estimator that help a buyer work out what they need before they ask.", trust: "Calculators and estimators that help a buyer size or choose a product before making an enquiry." },
            { title: "Blog & search content", neo: "A blog and product pages written so search can find them.", trust: "A blog and product content structured for search and kept consistent with the catalogue." },
          ],
        },
        {
          slug: "delivery",
          title: "Build & Delivery",
          callout: { neo: "Scope to launch, with the boring parts (hosting, access, monitoring) handled.", trust: "From architecture to launch, with hosting, access control and monitoring settled before go-live." },
          cards: [
            { title: "Architecture", neo: "Pick the stack, data path and integrations before code.", trust: "Solution architecture across stack, data, integrations and security, decided before build." },
            { title: "Build & QA", neo: "Ship in increments, test against real use, harden what holds.", trust: "Iterative development with QA, evaluation and stakeholder demos through the build." },
            { title: "Launch", neo: "Go live with monitoring and a rollback path, not crossed fingers.", trust: "Production launch with monitoring, access controls and a clear rollback path." },
            { title: "Support", neo: "Logs, monitoring and a support loop running after launch.", trust: "Monitoring and a support cadence after launch: handover or ongoing, your call." },
          ],
        },
      ],
      proof: [
        { name: "Happy Farms", result: { neo: "SaaS platform with login and management modules, plus the public site", trust: "SaaS platform with login and management modules, and the public site" }, org: "SaaS platform" },
        { name: "Sri Engineering Works", result: { neo: "E-commerce and product site: model directory, Cooling Estimator, site survey flow", trust: "E-commerce and product site with a model directory, a Cooling Estimator and a site survey request flow" }, org: "E-commerce" },
        { name: "Qualigene Lifesciences", result: { neo: "Website plus the calculators that help sell their products", trust: "Website and the calculators that support sales of their products" }, org: "Sales calculators" },
      ],
    },
  },
  customers: [
    { id: "academy", section: "Academy", company: "Learner and college programmes", neo: "Training gets a visible rhythm: projects, reviews, portfolios and interview prep. No more mystery about what the cohort is actually producing.", trust: "Applied projects, mentor checkpoints, weekly reporting and placement readiness. The cohort's output is on the record, not assumed." },
    { id: "marketing", section: "Digital Marketing", company: "Founder and regional business launches", neo: "The offer gets sharper before the market judges it. One system for brand, web and demand.", trust: "Positioning, site architecture, content and reporting delivered as one documented market-readiness workflow." },
    { id: "labs", section: "Product Studio", company: "SaaS, B2B products and internal platforms", neo: "We build the system that solves the problem: SaaS, products and integrations, with AI where it fits.", trust: "Custom software, SaaS, B2B platforms and integrations, with AI and automation applied where it earns its place." },
  ],
  work: {
    live: [
      {
        name: "Sai Nirmaan Architects", teams: ["marketing"], scope: ["Website", "Digital marketing"], logo: "/brand/clients/sai-nirmaan.png", url: "https://www.sainirmaanarchitects.com/", badge: "First client",
        sector: "Architecture", place: "Visakhapatnam",
        line: "We built their portfolio website and run their digital marketing.",
        story: {
          neo: "A practice site that leads with 300+ projects across four states, the principal architect story, selected works, and a clear consult path. Architecture, interiors and landscape read as one service.",
          trust: "A portfolio site presenting 300+ projects across four states, the principal architect profile, selected works and a consultation path. Architecture, interiors and landscape are presented as one integrated service.",
        },
        problem: {
          neo: "A multi-state architecture practice needed a site that proves the work and makes consultation the next step, not a PDF dump of projects.",
          trust: "A multi-state architecture practice needed a portfolio site that presents the body of work clearly and leads visitors into a consultation path.",
        },
        does: "An architecture, interior and landscape practice with 300+ projects across 4+ states, led by Suresh Bandaru.",
        built: [
          "Portfolio website with project counts, sectors and multi-city presence",
          "Selected works gallery and featured cultural case study",
          "Practice and principal architect narrative",
          "Humanitarian / DRIS programme chapter",
          "Enquiry and consultation CTAs",
          "Ongoing digital marketing",
        ],
      },
      {
        name: "Happy Farms", featured: true, teams: ["labs", "marketing"], scope: ["SaaS platform", "Website"], logo: "/brand/clients/happy-farms.svg", url: "https://ourhappyfarms.com/",
        sector: "Agri-training", place: "Andhra Pradesh",
        line: "We built their SaaS platform, with login and management modules, and the public site, including its trust signals.",
        story: {
          neo: "Public site for natural farming training: Discover, Guidance and Journeys, founder proof, programme registration and trust signals. Behind it, a SaaS console for login and day-to-day management.",
          trust: "A public education site for natural farming programmes with Discover, Guidance and Journeys pathways, founder credentials, registration and trust signals, plus a SaaS platform for authenticated management.",
        },
        problem: {
          neo: "Natural farming training needed a public front that brings farmers and FPOs in, and a private console to run the programmes behind it.",
          trust: "The organisation needed a public site to attract farmers and FPOs into programmes, plus an authenticated SaaS console to manage day-to-day delivery.",
        },
        does: "Natural farming training led by Prasad Juvvireddy: workshops, e-Safari farm visits, mentorship and export training across Andhra Pradesh.",
        built: [
          "Public website that brings farmers and FPOs in",
          "Programme pathways: Discover, Guidance, Journeys",
          "Founder and community proof (FPOs, farmer reach)",
          "Registration and waitlist flows",
          "SaaS platform with login and management modules",
          "Trust signals on the public site",
        ],
      },
      {
        name: "Sri Engineering Works", featured: true, teams: ["labs", "marketing"], scope: ["E-commerce", "Product catalogue", "Website"], logo: "/brand/clients/sri-engineering-works.png", url: "https://sriengineeringworks.com/", badge: "Just launched",
        sector: "HVAC", place: "Hyderabad & Visakhapatnam",
        line: "We built their e-commerce and product site, with an AC model directory, a Cooling Estimator and a free site survey request flow.",
        story: {
          neo: "Full HVAC marketing and product site: VRF to chillers, in-house crews story, Cooling Estimator, free site survey, dual-city offices and enquiry. Our first e-commerce build, live after multiple prototypes.",
          trust: "An HVAC product and services site covering VRF through chillers, in-house execution, a Cooling Estimator, free site survey requests, dual-city offices and enquiry. First e-commerce category build for Nexara, launched after multiple prototypes.",
        },
        problem: {
          neo: "An HVAC seller with Hyderabad and Visakhapatnam ops needed a product site that helps buyers choose systems and request a survey, not a static brochure.",
          trust: "An HVAC business with Hyderabad and Visakhapatnam operations needed a product site that supports model selection and site-survey requests, rather than a static brochure.",
        },
        does: "An HVAC company founded in 2018 and based in Hyderabad, with a branch and warehouse in Visakhapatnam. Proprietor K. Nagaraju. It sells, installs and maintains Split, Cassette, Tower, Ductable and VRV/VRF systems and chillers, works with Voltas, Daikin, Dunham-Bush and O General, and offers AMC contracts.",
        built: [
          "E-commerce and product site (first build in that category)",
          "AC model directory / product catalogue",
          "Cooling Estimator calculator",
          "Free site survey and quote request flow",
          "Service lines: install, ducting, fabrication, electricals, AMC",
          "Hyderabad and Visakhapatnam office blocks",
          "FAQ and enquiry closing sections",
        ],
      },
      {
        name: "Rise Medical Hub", teams: ["marketing"], scope: ["Website", "Medical library", "Digital marketing"], logo: "/brand/clients/rise-medical-hub.png", url: "https://risemedicalhub.com/",
        sector: "Healthcare", place: "Visakhapatnam",
        line: "We built their website and a medical library, and run their digital marketing.",
        story: {
          neo: "Patient-first clinic site for Madhurawada: EECP pathway, diagnostics, pharmacy and OPD under one roof, specialist roster, heart guide chapters and a calm visit rhythm.",
          trust: "A patient-facing clinic site for Madhurawada covering EECP therapy, diagnostics, pharmacy and OPD, specialist profiles, an educational heart guide and a clear visit pathway.",
        },
        problem: {
          neo: "A Madhurawada clinic needed a calm patient site that explains EECP, diagnostics, pharmacy and OPD as one visit, not four disconnected pages.",
          trust: "The clinic needed a patient-facing site that presents EECP, diagnostics, pharmacy and OPD as one coherent visit pathway, with clear educational support.",
        },
        does: "A patient-first clinic in Madhurawada, Visakhapatnam offering EECP therapy, diagnostics, pharmacy and OPD services.",
        built: [
          "Patient-first clinic website",
          "Four care doors: EECP, diagnostics, pharmacy, OPD",
          "Specialist roster and department framing",
          "Medical library / heart guide chapters",
          "Visit rhythm and appointment CTAs",
          "Ongoing digital marketing",
        ],
      },
      {
        name: "Qualigene Lifesciences", teams: ["marketing", "labs"], scope: ["Website", "Sales calculators"], logo: "/brand/clients/qualigene.png", url: "https://qualigene.in/",
        sector: "Life sciences", place: "Andhra Pradesh",
        line: "We built their website and the calculators that help sell their products.",
        story: {
          neo: "Science-led site for shrimp and poultry: antibiotic-free protocols, sector paths, mechanism explainers, verifiable credentials and a clear trial / distributor route. Calculators help buyers choose.",
          trust: "A science-led product site for shrimp aquaculture and poultry with antibiotic-free protocols, sector pathways, mechanism explainers, verifiable quality credentials and trial or distributor enquiry paths, plus sales calculators.",
        },
        problem: {
          neo: "Buyers in shrimp and poultry needed science they could trust and tools that help them choose, not a brochure of product names.",
          trust: "Buyers in shrimp aquaculture and poultry needed verifiable science and selection tools, not a static product brochure.",
        },
        does: "Science-led, antibiotic-free feed solutions for shrimp aquaculture and poultry.",
        built: [
          "Science-led product marketing website",
          "Shrimp and poultry sector pathways",
          "Protocol and mechanism explainers",
          "Credential verification (cGMP, HACCP, ISO)",
          "Sales calculators for product selection",
          "Trial and distributor enquiry paths",
        ],
      },
      {
        name: "Nexara Voice", teams: ["labs"], scope: ["In-house product"], logo: "/brand/nexara-mark.svg", url: "https://voice.nexaragroups.com/",
        sector: "AI product", place: "In-house",
        line: "Our own agent console for AI voice agents, built and run by Nexara Labs.",
        story: {
          neo: "Full agent console for AI voice outreach: customers, campaigns, live calls, transcripts, insights, prompts, knowledge base, reminder rules and multi-tenant workspaces. Telugu and English code-mix, TRAI-aware.",
          trust: "An in-house AI voice-agent console covering customer import, campaigns, live calling, transcripts, insights, agent prompts, knowledge base, reminder rules and multi-tenant workspaces, with Telugu and English support and TRAI-oriented compliance controls.",
        },
        problem: {
          neo: "Voice outreach in Telugu and English needed a real operator console: campaigns, live calls, transcripts and compliance, not a demo chatbot.",
          trust: "AI voice outreach in Telugu and English required an operator console covering campaigns, live calls, transcripts and compliance controls, rather than a demonstration chatbot.",
        },
        does: "Nexara's in-house AI voice-agent product.",
        built: [
          "Agent console for AI voice agents",
          "Customer import and campaign orchestration",
          "Live call placement with transcripts and sentiment",
          "Insights, follow-up queue and compliance scoring",
          "Prompt editor, knowledge base and reminder rules",
          "Multi-tenant workspace administration",
        ],
      },
    ],
    building: [
      { name: "Stories of Kadai", kind: "Website + app" },
      { name: "Gym app", kind: "Mobile app" },
      { name: "HR portal", kind: "Internal platform" },
      { name: "SaaS products", kind: "Product studio" },
    ],
  },
  company: {
    // Rendered on the About page only when non-empty. photo/bio/linkedin are optional (initials avatar when no photo).
    founders: [
      { name: "Seshu Kumar Puvvala", role: "Director" },
      { name: "Pala Raju Garigipati", role: "Director" },
    ] as { name: string; role: string; photo?: string; bio?: string; linkedin?: string }[],
    // Shared About content. Facts are identical in both themes; only the wording is voiced.
    // `@page` links resolve to the active theme's route.
    about: {
      hero: {
        neo: {
          title: "Built in Vizag.",
          accent: "Shipped for real clients.",
          body: "Nexara Private Limited is a software, marketing and training studio in Visakhapatnam. Three teams (Academy, Digital Marketing and Labs), one standard: a written scope, a named owner and regular updates.",
        },
        trust: {
          title: "Built in Visakhapatnam.",
          accent: "Delivered for real clients.",
          body: "Nexara Private Limited is an incorporated firm in Visakhapatnam with three specialist teams: Academy, Digital Solutions and Product Studio. All three work to one standard: a written scope, a named owner and regular reporting.",
        },
      },
      story: {
        neo: {
          title: "Started in May 2026. Already shipping.",
          paragraphs: [
            "Nexara Private Limited was incorporated on 31 May 2026 in Visakhapatnam. Three teams: Academy trains people, Digital Marketing builds websites and demand, Labs builds software.",
            "Our first client was [Sai Nirmaan Architects](@customers), an architecture practice in Vizag. We built their portfolio site and run their digital marketing. Happy Farms, Rise Medical Hub, Qualigene and Sri Engineering Works came next, and every one of them is a live site you can open.",
          ],
        },
        trust: {
          title: "Incorporated in May 2026. Already delivering.",
          paragraphs: [
            "Nexara Private Limited was incorporated on 31 May 2026 in Visakhapatnam. It runs three specialist teams: Academy for training, Digital Solutions for websites and market presence, and Product Studio for software.",
            "The first client was [Sai Nirmaan Architects](@customers), an architecture practice in Visakhapatnam. Nexara built their portfolio website and manages their digital marketing. Happy Farms, Rise Medical Hub, Qualigene and Sri Engineering Works have since become clients, and each has a live site that can be inspected.",
          ],
        },
      },
      steps: {
        neo: [
          { title: "Get the business first", body: "We learn how you make money, who buys and what slows you down. Nothing gets designed until we have that." },
          { title: "Prototype, show, redo", body: "Rough versions go on screen early. If the first one misses, we build another. Sri Engineering Works went through several before we locked it in." },
          { title: "Ship what's needed, skip the rest", body: "You get what the business actually needs. We don't push a solution just because it's the one we already had." },
        ],
        trust: [
          { title: "Understand the business", body: "We begin with how the business earns revenue, who buys and where it is held back. No design work starts until these are documented." },
          { title: "Prototype before committing", body: "We build early versions and review them with the client. If the first misses, we iterate. Sri Engineering Works went through several prototypes before the build was agreed." },
          { title: "Deliver what is required", body: "We deliver what the business needs and leave out what it does not. A solution is never recommended simply because it already exists in our portfolio." },
        ],
      },
      example: {
        neo: {
          label: "Worked example",
          title: "Sri Engineering Works",
          body: "An HVAC company based in Hyderabad, with a branch and warehouse in Visakhapatnam. We learned how they sell, install and maintain cooling systems, built a few prototypes and kept the design consistent page to page. It was our first e-commerce and product site. It has an AC model directory, a Cooling Estimator and a free site survey request flow, and nothing they didn't ask for.",
        },
        trust: {
          label: "Case in point",
          title: "Sri Engineering Works",
          body: "An HVAC company based in Hyderabad, with a branch and warehouse in Visakhapatnam. Nexara studied how the company sells, installs and maintains cooling systems, built several prototypes and kept the design consistent across pages. It was the firm's first e-commerce and product site. It includes an AC model directory, a Cooling Estimator and a free site survey request flow, with no features beyond the agreed scope.",
        },
        links: [{ label: { neo: "Read how we built it", trust: "Read the build notes" }, href: "/blog/prototype-before-you-build" }, { label: { neo: "See the client work", trust: "View delivery proof" }, href: "@customers" }],
      },
      milestones: [
        { when: "31 May 2026", before: "Incorporated in Visakhapatnam", body: "Nexara Private Limited is formed." },
        { before: "First client: ", name: "Sai Nirmaan Architects", body: "A portfolio website and ongoing digital marketing for an architecture practice." },
        { when: "July 2026", name: "Happy Farms", after: " SaaS platform live", body: "Login and management modules, plus the public site." },
        { when: "October 2026", name: "Sri Engineering Works", after: " live: our first e-commerce build", body: "A product site with an AC model directory, a Cooling Estimator and a site survey flow." },
      ] as { when?: string; before?: string; name?: string; after?: string; body: string }[],
    },
    neo: {
      facts: [
        ["Status", "Incorporated company"],
        ["Teams", "Academy, Digital Marketing, Labs"],
        ["Standard", "Named owner, written scope, reported cadence"],
        ["Operating region", "India-first growth markets"],
      ],
      standards: [
        { title: "Verified claims", body: "Public numbers, client names and guarantees appear only after evidence and approval. If we can't show it, we don't claim it." },
        { title: "Scoped delivery", body: "Every engagement opens with audience, goals, deliverables, timeline, a named owner and success criteria, in writing." },
        { title: "Data boundaries", body: "Before any Labs build, we settle hosting, access, auditability, human review and risk level." },
        { title: "Outcome reporting", body: "Academy, Digital Marketing and Labs each report progress, completion and next steps on an agreed cadence." },
      ],
      manifesto: "Nexara is the IT company that doesn't act like one. Academy turns learning into portfolio proof, Digital Marketing turns offers into market signal, and Labs turns ideas into working software. We ship daily across all three.",
      principles: [
        { title: "Keep the three engines loud", body: "Academy, Digital Marketing and Labs each keep their own edge while sharing one Nexara operating standard." },
        { title: "Build proof people can feel", body: "Show work, flows, scopes, outputs and review loops before making big outcome claims." },
        { title: "Move fast without going vague", body: "Momentum only counts when the offer, owner, timeline and next action are locked." },
        { title: "Ship production-grade or don't ship", body: "Every site, cohort, campaign and AI system should be built for real use, not for show." },
        { title: "Never ship the generic version", body: "If it could carry anyone else's logo, it's not done. Every page, pitch and project should be unmistakably Nexara." },
      ],
    },
    trust: {
      facts: [
        ["Status", "Incorporated capability firm"],
        ["Forces", "Academy, Digital, Labs"],
        ["Standard", "Named owner, written scope, reported cadence"],
        ["Operating region", "India-first growth markets"],
      ],
      standards: [
        { title: "Verified claims", body: "Public numbers, client names and guarantees appear only after evidence and approval. If we can't show it, we don't claim it." },
        { title: "Scoped delivery", body: "Every engagement opens with audience, goals, deliverables, timeline, a named owner and success criteria, in writing." },
        { title: "Data boundaries", body: "Before any Labs build, we settle hosting, access, auditability, human review and risk level." },
        { title: "Outcome reporting", body: "Academy, Digital and Labs each report progress, completion and next steps on an agreed cadence." },
      ],
      manifesto: "Nexara is an incorporated firm with three specialist teams: Academy for talent, Digital for market presence, and Product Studio for software. Each goes deep in its own craft. All three work to the same standard on every engagement: a named owner, a written scope, a reporting cadence, and clear limits on evidence and data.",
      principles: [
        { title: "Each force owns its discipline", body: "Academy, Digital and Labs are separate specialist lines with their own depth, scopes and decision paths." },
        { title: "One governance standard across all three", body: "Every engagement names an owner, defines deliverables and cadence, and records evidence, handoff and next steps." },
        { title: "Every claim ties to something we can show", body: "Each claim traces back to a metric, a review process or a documented goal. We don't invent numbers." },
        { title: "Ship what holds in production", body: "Cohorts, websites, campaigns and AI workflows are built to survive past the first launch, not to demo well." },
        { title: "No team outranks another", body: "Academy, Digital Solutions and Product Studio carry equal weight in how the firm is run, staffed and reported." },
      ],
    },
  },
  contact: {
    // Exactly as on the MCA master data and GST certificate. Programs and directories cross-check these.
    legal: { name: 'Nexara Private Limited', domain: 'nexaragroups.com', cin: 'U62012AP2026PTC126146', gstin: '37AALCN7053N1ZR', incorporated: '2026-05-31' },
    phone: { display: '9257535757', href: 'tel:+919257535757' },
    address: {
      street: 'No. 1-83-14, MIG-IV, Sector 3, 1st Floor, M.V.P. Colony',
      city: 'Visakhapatnam, Andhra Pradesh 530017',
      mapsHref: 'https://www.google.com/maps/search/?api=1&query=Nexara+Private+Limited+1-83-14+MVP+Colony+Visakhapatnam+530017',
    },
    // Official profiles. Also emitted as Organization.sameAs so search engines tie them to this site.
    social: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nexara-private-limited/' },
      { label: 'Instagram', href: 'https://www.instagram.com/nexaraprivatelimited/' },
      { label: 'Google', href: 'https://www.google.com/search?kgmid=/g/11zf6hqkp8' },
    ],
    neo: {
      eyebrow: "LET'S BUILD",
      title: "We work with builders. Start here.",
      accent: "info@nexaragroups.com",
      body: "Pick a section. Tell us what you're building. We'll take it from there.",
      primary: "Get started",
    },
    trust: {
      eyebrow: "Project Enquiries",
      title: "Every project starts with one conversation.",
      accent: "info@nexaragroups.com",
      body: "Tell us which team you need, your city, your audience and how you'll measure success. We'll come back with a scoped next step and a named owner.",
      primary: "Scope your project",
    },
    channels: [
      { title: "Talent Programmes", section: "academy", body: "Learner count, target roles, city, duration, placement-readiness needs and reporting expectations." },
      { title: "Digital Solutions", section: "marketing", body: "Business category, offer, current website or channels, launch timeline and growth goal." },
      { title: "Product Studio", section: "labs", body: "Business problem, current tools, product users, integrations, risk level and success metric." },
      { title: "Combined engagement", section: "home", body: "When the project needs talent, market presence and systems working together under one owner." },
    ],
    enquiry: {
      title: "Scope your project",
      body: "Work through the planner. When you're done, your mail client opens a ready-formatted request to our intake team, using the same checklist we scope every project against.",
      label: "Send to info@nexaragroups.com",
      href: "mailto:info@nexaragroups.com",
    },
    checklist: ["Force and city", "Audience or user group", "Timeline and schedule", "Current assets or tools", "Success metric", "Decision-maker contact"],
  },
};

// Neo-facing division names. DATA.sections / customers / channels are shared with Trust,
// whose copy ("Product Studio", "Digital Solutions") must not change, so Neo maps on render.
export const neoSectionName = <T extends { name?: string; neoName?: string }>(section: T): T['name'] => (section.neoName ?? section.name) as T['name'];
const NEO_LABELS: Record<string, string> = {
  "Product Studio": "Labs", "Product studio": "Labs", "AI & Automation": "Labs",
  "Digital Solutions": "Digital Marketing", "Digital": "Digital Marketing", "Talent Programmes": "Academy",
};
export const neoLabel = <T extends string | undefined>(label: T): T => (label !== undefined && NEO_LABELS[label] ? NEO_LABELS[label] : label) as T;
