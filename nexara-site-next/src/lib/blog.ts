// Blog content. Plain typed data: no MDX, no extra dependencies.
// Inline links inside p / ul text use [label](/path) and are rendered by the blog page.
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO (YYYY-MM-DD)
  readMins: number;
  tags: string[];
  author: 'Nexara Team';
  body: Block[];
}

export const BLOG_DESCRIPTION = 'Practical notes from a Visakhapatnam team that builds websites, software and marketing for local businesses.';

const countWords = (body: Block[]) => body.reduce((n, b) => n + (b.type === 'ul' ? b.items.join(' ') : b.text).split(/\s+/).filter(Boolean).length, 0);
const post = (p: Omit<BlogPost, 'readMins' | 'author'>): BlogPost => ({ ...p, author: 'Nexara Team', readMins: Math.max(1, Math.round(countWords(p.body) / 220)) });

export const BLOG_POSTS: BlogPost[] = [
  post({
    slug: 'prototype-before-you-build',
    title: 'Why we prototype before we build',
    description: 'How we built an e-commerce and product site for an HVAC company, and why we made multiple prototypes before settling on the real thing.',
    date: '2026-10-10',
    tags: ['Process', 'Case study', 'E-commerce'],
    body: [
      { type: 'p', text: 'Sri Engineering Works went live this month. It is an e-commerce and product site for an HVAC company, and it is the first build of that kind at Nexara. We had no template for it, so we did what we do when we have no template: learn the business first, then build small things to argue with.' },
      { type: 'h2', text: 'The business came before the brief' },
      { type: 'p', text: 'The company was founded in 2018 and is run by its proprietor, K. Nagaraju. It is based in Hyderabad, with a branch and warehouse in Visakhapatnam. It sells, installs and maintains Split, Cassette, Tower, Ductable and VRV/VRF systems and chillers. It works with Voltas, Daikin, Dunham-Bush and O General, and it offers AMC contracts (annual maintenance contracts) for ongoing upkeep.' },
      { type: 'p', text: 'That list matters more than it looks. A company that handles Split units and chillers does not have one kind of buyer. Before we drew a single screen, we spent time understanding how the business sells, installs and services, and what a customer needs to see before picking up the phone.' },
      { type: 'h2', text: 'A new category made us slower on purpose' },
      { type: 'p', text: 'Our earlier work includes a SaaS platform for Happy Farms, a medical library for Rise Medical Hub and sales calculators for Qualigene. An e-commerce and product site is a different shape of problem, and we had not built one. When you have not built something before, the pull is to reach for whatever you already have and bend it to fit. We try hard not to do that.' },
      { type: 'h2', text: 'What a prototype is for' },
      { type: 'quote', text: 'A prototype is a cheap way to be wrong.' },
      { type: 'p', text: 'It does not need to be pretty or finished. It needs to be real enough that the client can click through it and tell us where it does not match how their customers think. A written spec cannot do that, because everyone reads a spec and imagines something slightly different.' },
      { type: 'p', text: 'For Sri Engineering Works we built multiple prototypes. Each one gave us something concrete to put in front of the client, and each round taught us a little more about what the site had to do. We did not treat any version as precious. The point was to find the right build, and we were willing to throw work away to get there.' },
      { type: 'h2', text: 'What the site does' },
      { type: 'p', text: 'The finished site has a few parts, and each one earns its place:' },
      { type: 'ul', items: [
        'A product catalogue, built as an AC model directory with search, so a buyer can find a unit without wading through a brochure.',
        'A Cooling Estimator, a calculator that helps a visitor estimate what cooling they need.',
        'A free site survey and quote request flow, so a visitor who is ready has a clear next step.',
        'A blog, where the company can publish what it knows.',
      ] },
      { type: 'p', text: 'We kept everything consistent. The model directory, the estimator and the quote flow share the same patterns, the same wording and the same layout logic. That is easy to skip when you are building several tools on one site, and it is the reason a visitor who learns one page can use the next without thinking about it.' },
      { type: 'h2', text: 'Leaving things out' },
      { type: 'p', text: 'The other half of the job was leaving things out. It is tempting to push a solution because we have built it before, or because it looks good in a portfolio. We would rather deliver what the business needs and nothing it will have to work around later. Every part of the site above is there because the business has a use for it.' },
      { type: 'h2', text: 'What to take from this if you are hiring a developer' },
      { type: 'ul', items: [
        'Ask them to explain your business back to you before they quote. If they cannot, they have not understood it yet.',
        'Ask to see a rough version early, even if it looks plain.',
        'Expect more than one version. If you only ever see one, you are being asked to approve a guess.',
        'Ask what is being left out, and why.',
      ] },
      { type: 'p', text: 'The site is live at sriengineeringworks.com, and the footer carries a credit: Designed & Developed by Nexara Private Limited. You can see it alongside our other [live work](/neo/customers), read what we offer for [e-commerce and product sites](/neo/labs/ecommerce), or [tell us what you are building](/neo/contact) and we will start by asking questions.' },
    ],
  }),
  post({
    slug: 'website-development-company-visakhapatnam-checklist',
    title: 'A checklist for hiring a website company in Vizag',
    description: 'Eight checks before you hire a website developer in Visakhapatnam, from past work and written scope to who owns your domain and code.',
    date: '2026-10-08',
    tags: ['Checklist', 'Web development', 'Visakhapatnam'],
    body: [
      { type: 'p', text: 'Website projects tend to go wrong in a handful of familiar places. The site is late, nobody can say who is responsible, it looks fine on a laptop and bad on a phone, or the owner finds out months later that the domain is registered in the developer\'s name. Each of these is cheap to check for before you sign. This is the list we would use if we were the client.' },
      { type: 'h2', text: '1. Ask for work that looks like yours' },
      { type: 'p', text: 'A developer who has built a clinic site is not automatically right for a manufacturer, but relevant work shows they understand the kind of visitor you get. Ask for live links, not screenshots. Open them on your phone. Submit the contact form and see what happens. If a client\'s name is on their site, you can find that site and judge it yourself.' },
      { type: 'h2', text: '2. Get the scope in writing' },
      { type: 'p', text: 'A written scope lists the pages, the features, who writes the content, how many rounds of changes are included and what happens when you ask for something new. It is also the document you both point to when you disagree. If a company will start without one, you are the one carrying the risk. We agree deliverables before work starts, and you should expect the same from anyone you hire.' },
      { type: 'h2', text: '3. Find out who owns your project' },
      { type: 'p', text: 'Ask for one name. Not a team, a person: someone you can call, and who answers when the designer is on leave. Projects with a named owner get decisions made. Projects without one drift while everybody assumes somebody else is handling it.' },
      { type: 'h2', text: '4. Ask how they test and what support looks like' },
      { type: 'p', text: 'Which browsers and phones do they check before launch? Who tests the forms, and does the enquiry email actually arrive in your inbox? Ask to see the site on a staging address before it goes live. Then ask what happens after launch: who you contact, how fast they reply, and whether small fixes are included for a period or billed separately. Get the answer in writing.' },
      { type: 'h2', text: '5. Judge it on a phone first' },
      { type: 'p', text: 'A large share of visitors to a local business site will arrive on a phone, often on mobile data. Open the developer\'s own site on a mid-range phone. Can you read the text without zooming? Are the buttons easy to tap? Does the menu work? A site that was designed on a big screen and shrunk later usually shows it.' },
      { type: 'h2', text: '6. Check speed' },
      { type: 'p', text: 'Run their site and two or three client sites through Google\'s PageSpeed Insights. Do not chase a perfect score. Look for pages that load slowly because of oversized images or scripts nobody needed, and ask how they handle that. A good developer will have an answer ready.' },
      { type: 'h2', text: '7. Make sure the SEO basics are included' },
      { type: 'p', text: 'Basic SEO is not a ranking promise. It is a unique title and description for each page, a sensible heading structure, readable URLs, a sitemap, internal links between related pages, and your address and phone number as real text, not inside an image. Be wary of anyone who guarantees a first-page position. Nobody controls Google.' },
      { type: 'h2', text: '8. Settle who owns the domain, hosting and code' },
      { type: 'p', text: 'This is the one people skip and regret. Before you pay anything, confirm the following:' },
      { type: 'ul', items: [
        'The domain is registered in your name, with your email as the contact.',
        'The hosting account is yours, or can be moved to you without a fee.',
        'You receive the source code at handover, and you know in what form.',
        'Handover includes logins, notes on how the site is built and a short walkthrough.',
      ] },
      { type: 'h2', text: 'Using the list' },
      { type: 'p', text: 'Take it to the first call with two or three companies. Notice who answers directly and who changes the subject. A developer who is comfortable with these questions has probably had them before, and answered them well.' },
      { type: 'p', text: 'If you want to see how we answer them, [talk to us](/neo/contact) or look at [the work we have shipped](/neo/customers) for businesses in Visakhapatnam and across Andhra Pradesh.' },
    ],
  }),
  post({
    slug: 'trust-signals-small-business-website',
    title: 'The trust signals a small business website needs',
    description: 'A real address, legal identity, real work, clear contact details, honest reviews and basic privacy pages: what makes a small business site believable.',
    date: '2026-10-06',
    tags: ['Trust', 'Websites', 'Small business'],
    body: [
      { type: 'p', text: 'A first-time visitor to your website knows nothing about you. Before they call or fill in a form, they are looking for reasons to believe you are a real business that will still be around next month. We call those reasons trust signals. Most of them are not clever. They are plain facts, placed where a visitor can find them.' },
      { type: 'h2', text: 'Say where you are' },
      { type: 'p', text: 'Put your full street address on the site as text, with a link to the map. A pin on Google Maps and a matching address on the page tell a visitor there is a physical place behind it. Keep the address identical everywhere it appears: your site, your Google Business Profile, your invoices and your registration records. We match our own registered address to our MCA and GST records for exactly this reason.' },
      { type: 'h2', text: 'Show your legal identity' },
      { type: 'p', text: 'A registered business has a legal name, and in India that comes with numbers: a CIN for a company, a GSTIN if you are registered for GST. Put them in the footer. Visitors who care will check them, and visitors who do not will still notice you were willing. Nexara shows its CIN and GSTIN site-wide. A proprietorship can show the proprietor\'s name and its GSTIN.' },
      { type: 'h2', text: 'Show real work' },
      { type: 'p', text: 'Name your clients and link to their live sites, with their permission. A logo someone can click through is more convincing than a line about being trusted by leading brands. If you have nothing to show yet, show a project you built for yourself and say that is what it is. Never borrow someone else\'s logos.' },
      { type: 'p', text: 'Happy Farms runs natural farming training in Andhra Pradesh. We built their SaaS platform and public site, and we also helped enable their digital journey and build their trust signals. A business that asks people to sign up for workshops and farm visits has to be believable before it can be useful.' },
      { type: 'h2', text: 'Make contact easy and honest' },
      { type: 'p', text: 'One phone number that someone answers. One email address on your own domain, if you can manage it, rather than a free webmail one. A form that tells people what happens after they press send. If you list opening hours, keep them. A contact page with a form and no name or number attached is a warning sign for visitors.' },
      { type: 'h2', text: 'Use reviews only if they are real' },
      { type: 'p', text: 'Link to your actual Google reviews, or quote a customer by name with their permission. Do not write reviews yourself, buy them or invent a testimonial. It breaks Google\'s policies, and readers often sense it anyway. A page with no reviews is better than one with fake ones, and a handful of real ones does more than you would expect.' },
      { type: 'h2', text: 'Cover privacy and cookies' },
      { type: 'p', text: 'If you run analytics or collect enquiries, you handle personal data. Publish a privacy policy and terms, say what you collect and why, and give people a way to ask for their data to be deleted. If you use analytics cookies, ask before switching them on. On our site analytics stay off until a visitor agrees. Have a lawyer read your final wording, because we are not one.' },
      { type: 'h2', text: 'Small things that add up' },
      { type: 'ul', items: [
        'HTTPS on every page, with no browser warnings.',
        'An About page with real names. Ours lists our directors.',
        'Dates on blog posts and a copyright year that is current.',
        'Links that work and pages that load.',
      ] },
      { type: 'h2', text: 'A ten-minute audit' },
      { type: 'p', text: 'Open your site on your phone and pretend you have never heard of the business. Find the address, a phone number, the legal name and one piece of proof that real work exists, and count the taps each one takes. Anything that takes more than a couple of taps, or cannot be found at all, is your first fix. Then check the footer: does it carry your legal identity, links to your privacy policy and terms, and a current year?' },
      { type: 'p', text: 'None of this needs a big budget. It needs someone to sit down with the list and be honest about what is true of the business, then put it on the page. If you want a second pair of eyes on your site, [talk to us](/neo/contact), or read how we [introduce ourselves](/neo/company).' },
    ],
  }),
  post({
    slug: 'digital-marketing-for-architects',
    title: 'Digital marketing that brings architect enquiries',
    description: 'How an architecture practice can get more enquiries online: portfolio structure, project pages, local search and posting you can keep up.',
    date: '2026-10-03',
    tags: ['Digital marketing', 'Architecture', 'Local search'],
    body: [
      { type: 'p', text: 'Architecture is an odd thing to market. The work is visual, the sale is slow, and a client may spend months deciding before sending a first message. Many enquiries start with a search, a recommendation or a photo seen somewhere. A practice\'s job online is to be easy to find, easy to judge and easy to contact, in that order.' },
      { type: 'p', text: 'Sai Nirmaan Architects was our first client. They are an architecture, interior and landscape practice in Visakhapatnam, led by Suresh Bandaru, with 300+ projects across 4+ states. We built their portfolio website and run their digital marketing. That volume makes a useful test case: with hundreds of projects, the problem is not having enough to show. It is showing it in an order a stranger can follow.' },
      { type: 'h2', text: 'Structure the portfolio the way visitors think' },
      { type: 'p', text: 'Visitors do not think in your project order. They think about what they are building: a house, an apartment block, an office, an interior. Group projects by type first, then by city or scale. Give each group a short introduction saying what you do in that type of work. Put your best five up front and let the rest sit behind them.' },
      { type: 'h2', text: 'Give every project its own page' },
      { type: 'p', text: 'A grid of photos is pleasant to look at and nearly invisible to search. A page per project can be found, linked to and shared. On each one, include what you can stand behind:' },
      { type: 'ul', items: [
        'Project name, type and location.',
        'The brief, in two or three sentences.',
        'Your role and scope: architecture, interior, landscape.',
        'Year and status, if the client is happy to share them.',
        'Good photographs, plus a plan or section where the client allows.',
        'The main details as plain text, not only inside images.',
      ] },
      { type: 'p', text: 'Get client permission before publishing names and addresses. Do not add figures you cannot back up.' },
      { type: 'h2', text: 'Let local search do the heavy lifting' },
      { type: 'p', text: 'Many people hire an architect in or near their own city. Set up a Google Business Profile and keep it current: category, address, phone number, hours and project photos. Use the same name, address and phone number everywhere. Write pages that match how people search, such as residential architecture in Visakhapatnam, written for a person and built around real projects from the city. Ask happy clients for a Google review. Ask for them, and do not write them yourself.' },
      { type: 'h2', text: 'Post at a pace you can keep' },
      { type: 'p', text: 'Consistency matters more than volume. A practice that shares one good thing a week for a year tends to build more than one that posts daily for a month and then goes quiet. The material is already in your office: a completed project, a site visit, a drawing in progress, a material choice and the reason behind it. Plan a month at a time, photograph in batches, and reuse each project across the website, your Google profile and your social channels.' },
      { type: 'h2', text: 'Count enquiries, not likes' },
      { type: 'p', text: 'Keep a simple tally of how many people phone or send the form each month, and ask each one how they found you. A notebook is enough. After a few months you will see whether search, referrals or social posts bring the conversations that turn into projects, and you can put your effort there.' },
      { type: 'h2', text: 'Make the enquiry easy to send' },
      { type: 'p', text: 'Put a phone number and a short form on every project page. Ask only what you need to reply: name, phone, city, what they are building and roughly when. Then reply the same day. A slow reply can undo weeks of marketing work.' },
      { type: 'h2', text: 'What to leave out' },
      { type: 'p', text: 'No stock photos of buildings you did not design. No rankings you cannot show. No promises about how many enquiries to expect, because anyone who guarantees a number is guessing. Marketing helps the right people find you and judge you fairly. The work still has to hold up when they look.' },
      { type: 'p', text: 'If you run a practice and want help structuring your portfolio or your local presence, [talk to us](/neo/contact). You can also see [our live work](/neo/customers), including the Sai Nirmaan site.' },
    ],
  }),
  post({
    slug: 'software-development-and-websites-in-vizag-stack-products-clients',
    title: 'Our software stack, products and clients in Vizag',
    description: 'How Nexara approaches software development and websites in Visakhapatnam: our Next.js and AI stack, in-house products like Nexara Voice, and work shipped for real clients.',
    date: '2026-10-11',
    tags: ['Software development', 'Websites', 'Visakhapatnam', 'Tech stack', 'Products'],
    body: [
      { type: 'p', text: 'If you are looking for a software company or website development team in Visakhapatnam (Vizag) - whether you searched for Nexara, Nexera or Nexara Groups - this note explains who we are, what stack we build on, the products we ship, and the clients we deliver for.' },
      { type: 'h2', text: 'Why Visakhapatnam needs production-grade engineering' },
      { type: 'p', text: 'For years, regional businesses in Andhra Pradesh were offered either slow WordPress templates or bloated agency contracts with zero accountability. When a customer visits your website or a user logs into your business portal, slow load times and broken mobile layouts cost real revenue. Nexara Private Limited was founded to give growth-city businesses the same caliber of software engineering and digital systems expected in global tech hubs.' },
      { type: 'h2', text: 'Our tech stack: Fast, modern and maintainable' },
      { type: 'p', text: 'We build websites and applications that load instantly and hold up under heavy operational loads. Our core stack reflects that discipline:' },
      { type: 'ul', items: [
        'Frontend & Web: Next.js 15, React 19, TypeScript, and Tailwind CSS for server-rendered speed and rock-solid type safety.',
        'Interactive & 3D: Three.js and custom canvas animations when a brand needs interactive product depth.',
        'Backend & APIs: Node.js and Python for microservices, robust REST APIs, WebSockets, and database pipelines.',
        'Data & Infrastructure: PostgreSQL, Cloudflare edge hosting, and secure multi-tenant architectures.',
        'Applied AI & Automation: Retrieval-augmented generation (RAG), document AI, and custom voice models with evaluation guardrails.',
      ] },
      { type: 'h2', text: 'In-house products engineered by Nexara Labs' },
      { type: 'p', text: 'We do not just build for clients; we build and operate our own software products from Visakhapatnam:' },
      { type: 'ul', items: [
        'Nexara Voice: An AI voice agent console for outbound and inbound customer outreach, supporting bilingual Telugu and English conversations with call transcripts and sentiment analytics.',
        'Agency OS: Our internal operating portal managing project pipelines, quotes, tasks, approvals, and live client updates in one place.',
        'HappyGrow: A specialised FPO (Farmer Producer Organisation) SaaS platform for managing farmer, crop, sales, and wealth records.',
        'Live line: Academy & Sports apps (Happy Forms registration). Also building LMS platforms and internal HR and billing portals.',
      ] },
      { type: 'h2', text: 'Real client work shipped across Andhra Pradesh' },
      { type: 'p', text: 'Every claim we make connects to live work you can inspect on the web:' },
      { type: 'ul', items: [
        'Sai Nirmaan Architects (Visakhapatnam): Portfolio website showcasing 300+ projects across 4 states, alongside complete digital marketing management.',
        'Sri Engineering Works (Hyderabad & Visakhapatnam): E-commerce and HVAC product site featuring a searchable AC model directory, live inventory tracking, a Cooling Estimator, and site-survey booking.',
        'Happy Farms (Andhra Pradesh): Public natural farming education portal and authenticated SaaS platform for farmer workshops and training records.',
        'Rise Medical Hub (Madhurawada, Visakhapatnam): Patient-first clinic site covering EECP therapy, pharmacy, diagnostics, and an educational medical guide.',
        'Qualigene Lifesciences (Andhra Pradesh): Science-backed aquaculture and poultry feed website with custom sales calculators for product selection.',
      ] },
      { type: 'h2', text: 'How to contact our team in Vizag' },
      { type: 'p', text: 'If you need the best website contacts or software development in Vizag, you can reach us directly:' },
      { type: 'ul', items: [
        'Phone: +91 9257535757',
        'Email: info@nexaragroups.com',
        'Office Address: No. 1-83-14, MIG-IV, Sector 3, 1st Floor, M.V.P. Colony, Visakhapatnam, Andhra Pradesh 530017',
        'Web: nexaragroups.com',
      ] },
      { type: 'p', text: 'You can explore our [live client work](/neo/customers), view our [software products](/neo/labs), or [reach out to scope your project](/neo/contact). We start with a clear written brief and a named project owner before any work begins.' },
    ],
  }),
];

export const getPost = (slug: string) => BLOG_POSTS.find(p => p.slug === slug);
export const formatPostDate = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
