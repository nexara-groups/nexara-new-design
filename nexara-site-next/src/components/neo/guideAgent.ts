// Neo's scripted agent. No model and no network: it matches what you type or say against
// facts that already live on the site (clients, packages, FAQs, contact details) and
// returns a short reply plus the actions he can take. Everything he states comes from
// the knowledge object, so he cannot invent a price, a client or a promise.

export type AgentAction =
  | { type: 'goto'; path: string; label: string }
  | { type: 'scroll'; selector: string; label: string }
  | { type: 'open'; url: string; label: string }
  | { type: 'tel'; href: string; label: string }
  | { type: 'mailto'; href: string; label: string }
  | { type: 'theme'; to: 'trust' | 'neo'; label: string }
  | { type: 'brief'; label: string };

export interface AgentReply {
  /** Short tag shown above the bubble. */
  label: string;
  /** Full answer for the panel. */
  line: string;
  /** Shortened version for the speech bubble and for speaking aloud. */
  short: string;
  actions: AgentAction[];
  /** True when nothing matched, so the UI can offer suggestions. */
  fallback?: boolean;
}

export interface TeamFacts {
  id: 'academy' | 'marketing' | 'labs';
  name: string;
  pitch: string;
  packages: { name: string; fit: string; price: string; duration: string }[];
}

export interface AgentKnowledge {
  base: string; // '/neo'
  phone: { display: string; href: string };
  email: string;
  address: string;
  clients: { name: string; url: string; line: string; place: string; scope: string[] }[];
  teams: TeamFacts[];
  faqs: [string, string][];
}

const STOP = new Set(('a an the and or of to in on for with is are do does you your we our me my it its this that what how who when where why can could would should please tell about i im ' +
  'have has be been at as by from into than then so if but not no yes').split(' '));

const tokens = (text: string): string[] =>
  text.toLowerCase().replace(/[^a-z0-9+#.\s]/g, ' ').split(/\s+/).map((t) => t.replace(/^\.+|\.+$/g, '')).filter((t) => t && !STOP.has(t));

const has = (q: string, re: RegExp) => re.test(q);

const shorten = (text: string, max = 150): string => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '));
  return (stop > 60 ? cut.slice(0, stop + 1) : cut.replace(/\s+\S*$/, '') + '…').trim();
};

const PAGES: { re: RegExp; path: string; label: string }[] = [
  { re: /\b(contact|reach|get in touch|talk to (a )?(human|person|someone)|enquir|inquir)/, path: '/contact', label: 'Open contact' },
  { re: /\b(academy|training|course|learn|intern|placement|cohort)/, path: '/academy', label: 'Open Academy' },
  { re: /\b(marketing|seo\b|brand|ads?\b|website|web design|google business)/, path: '/marketing', label: 'Open Marketing' },
  { re: /\b(labs?\b|software|saas|portal|dashboard|ai\b|automation|product studio|app)\b/, path: '/labs', label: 'Open Labs' },
  { re: /\b(work|proof|customers?|clients?|case stud|portfolio)/, path: '/customers', label: 'Open the proof page' },
  { re: /\b(company|about|who are|team|founder|director|people|story)/, path: '/company', label: 'Open the company page' },
  { re: /\b(blog|articles?|posts?|notes|read)/, path: '/blog', label: 'Open the blog' },
];

function teamFor(q: string, kb: AgentKnowledge): TeamFacts | undefined {
  if (has(q, /\b(academy|training|course|learn|intern|placement|cohort|student|college|campus|hire|hiring|recruit)/)) return kb.teams.find((t) => t.id === 'academy');
  if (has(q, /\b(marketing|seo\b|brand|ads?\b|advertis|website|web design|google business|social|content|campaign)/)) return kb.teams.find((t) => t.id === 'marketing');
  if (has(q, /\b(labs?\b|software|saas|portal|dashboard|ai\b|automation|voice|app\b|ecommerce|e-commerce|integration|custom|build)/)) return kb.teams.find((t) => t.id === 'labs');
  return undefined;
}

const JOKES = [
  'why did the developer go broke? he used up all his cache.',
  'i would tell you a UDP joke, but you might not get it.',
  "there are 10 kinds of people: those who read binary and those who don't.",
  'a SQL query walks into a bar, sees two tables and asks: can i join you?',
];

export function suggestions(): string[] {
  return ['Show me your work', 'What do you charge?', 'Do you run internships?', 'How do I contact you?'];
}

export function answer(input: string, kb: AgentKnowledge, seed = 0): AgentReply {
  const q = input.toLowerCase().replace(/\s+/g, ' ').trim();
  const reply = (label: string, line: string, actions: AgentAction[] = [], short?: string): AgentReply =>
    ({ label, line, short: short ?? shorten(line), actions });
  const goto = (path: string, label: string): AgentAction => ({ type: 'goto', path: kb.base + path, label });

  if (!q) return reply('ask me', 'type a question, or tap one of the suggestions.');

  // Greetings and meta
  if (has(q, /^(hi|hey|hello|yo|hola|namaste|sup)\b/)) {
    return reply('hi', "hi. i can find things on this site, answer what we do and what it costs, and take you where you want to go. try 'show me your work'.");
  }
  if (has(q, /\b(thanks|thank you|thx|cheers)\b/)) return reply('anytime', 'anytime. if you want a person next, the contact page gets you one.', [goto('/contact', 'Contact us')]);
  if (has(q, /\b(joke|funny|make me laugh)\b/)) return reply('joke', JOKES[seed % JOKES.length]!);
  if (has(q, /\b(who are you|what are you|your name|what can you do|help|what do you do)\b/) && !has(q, /\b(nexara|company|you build)\b/)) {
    return reply('about me', "i'm neo, the site's guide. i run on a script, not a model: i answer from what's written on this site, so i won't make things up. ask about work, services, pricing, internships or contact.");
  }

  // Wants a person: start the quick brief. Booking a slot isn't possible without a
  // calendar service, so say what actually happens instead of pretending.
  if (has(q, /\b(quick brief|callback|call me back|call back|schedule|book (a |an )?(call|meeting|demo|slot)|appointment|meeting|demo|start a project|hire (you|nexara)|work with (you|nexara)|talk to (a |an )?(human|person|someone|team)|speak (to|with) (a |an )?(human|person|someone))/)) {
    return reply('quick brief', "i can't book calendar slots, but i can take a six-question brief, including the time you'd like a call, and hand it to you ready to send by WhatsApp or email. we call you back.", [{ type: 'brief', label: 'Start a quick brief' }, { type: 'tel', href: kb.phone.href, label: `Call ${kb.phone.display}` }]);
  }

  // Contact details
  if (has(q, /\b(phone|call|number|whatsapp|ring)\b/)) {
    return reply('phone', `you can call ${kb.phone.display}.`, [{ type: 'tel', href: kb.phone.href, label: `Call ${kb.phone.display}` }]);
  }
  if (has(q, /\b(e-?mail|mail)\b/)) {
    return reply('email', `write to ${kb.email}. we reply within two working days.`, [{ type: 'mailto', href: `mailto:${kb.email}`, label: 'Email us' }]);
  }
  if (has(q, /\b(address|office|located|location|where are you|visit|vizag|visakhapatnam|map)\b/)) {
    return reply('office', `we're at ${kb.address}.`, [goto('/contact', 'Open contact')]);
  }

  // Theme switch
  if (has(q, /\b(corporate|trust|professional|serious|formal)\b/) && has(q, /\b(switch|go|show|change|use|mode|version|theme|site)\b/)) {
    return reply('switching', "switching you to the corporate version. same company, calmer voice.", [{ type: 'theme', to: 'trust', label: 'Switch to Trust' }]);
  }

  // A named client
  const GENERIC_NAME_WORDS = new Set(['nexara', 'academy', 'works', 'private', 'limited', 'group', 'groups']);
  const client = kb.clients.find((c) => {
    if (q.includes(c.name.toLowerCase())) return true;
    return c.name.toLowerCase().split(/\s+/).some((w) => w.length >= 4 && !GENERIC_NAME_WORDS.has(w) && new RegExp(`\\b${w}\\b`).test(q));
  });
  if (client) {
    const domain = client.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    return reply(client.name.toLowerCase(), `${client.name} (${client.place}): ${client.line} it's live at ${domain}.`, [
      { type: 'open', url: client.url, label: `Open ${domain}` },
      goto('/customers', 'See all work'),
    ]);
  }

  // Work / proof
  if (has(q, /\b(work|proof|portfolio|case stud|clients?|customers?|examples?|built before|references?)\b/)) {
    const names = kb.clients.map((c) => c.name).slice(0, 6).join(', ');
    return reply('the work', `live client work includes ${names}. every one links to a real domain.`, [
      { type: 'scroll', selector: '#work', label: 'Jump to the work' },
      goto('/customers', 'Open proof page'),
    ]);
  }

  const team = teamFor(q, kb);

  // Price / timeline
  if (has(q, /\b(price|prices|pricing|cost|costs|charge|fee|fees|rate|rates|quote|budget|how much|afford|cheap|expensive)\b/)) {
    if (team) {
      const lines = team.packages.map((p) => `${p.name}: ${p.price.toLowerCase()}`).join('; ');
      return reply('pricing', `${team.name} is scoped, not list-priced. ${lines}.`, [{ type: 'brief', label: 'Start a quick brief' }, goto('/contact', 'Ask for a quote')], `${team.name} is priced per scope, not from a list. share the brief and you get a written scope with the quote.`);
    }
    return reply('pricing', "there's no public price list. each team scopes the work first, then quotes it: academy per cohort or batch, marketing per site or monthly retainer, labs per product scope.", [{ type: 'brief', label: 'Start a quick brief' }, goto('/contact', 'Ask for a quote')]);
  }
  if (has(q, /\b(how long|timeline|turnaround|deadline|duration|weeks?|months?|when can)\b/)) {
    if (team) {
      const lines = team.packages.map((p) => `${p.name}: ${p.duration.toLowerCase()}`).join('; ');
      return reply('timing', `${team.name}: ${lines}.`, [goto('/contact', 'Plan a timeline')], `timing is agreed in the written scope. ${shorten(lines, 90)}`);
    }
    return reply('timing', 'timing is agreed in the written scope before work starts, and it depends on the project. tell us what you need and the scoped reply includes dates.', [goto('/contact', 'Plan a timeline')]);
  }

  // Team overview
  if (team) {
    const list = team.packages.map((p) => (p.fit ? `${p.name} (${p.fit.toLowerCase()})` : p.name));
    const joined = list.length > 1 ? `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}` : list.join('');
    return reply(team.id, `${team.name} works in ${list.length} kinds of engagement: ${joined}. each is scoped before it starts.`, [goto(`/${team.id}`, `Open ${team.name}`), goto('/contact', 'Talk to us')]);
  }

  // Page navigation
  if (has(q, /\b(go|open|take me|show|navigate|jump|bring me)\b/) || q.split(' ').length <= 3) {
    if (has(q, /\b(faq|questions)\b/)) return reply('faq', 'jumping to the questions.', [{ type: 'scroll', selector: '#faqs', label: 'Jump to FAQs' }]);
    if (has(q, /\b(top|start|beginning)\b/)) return reply('top', 'back to the top.', [{ type: 'scroll', selector: 'body', label: 'Back to top' }]);
    const page = PAGES.find((p) => p.re.test(q));
    if (page) return reply('navigating', `taking you there.`, [goto(page.path, page.label)]);
  }

  // FAQ match: best keyword overlap with a real question
  const qt = tokens(q);
  if (qt.length) {
    let best: { score: number; item: [string, string] } | undefined;
    for (const item of kb.faqs) {
      const bag = new Set(tokens(item[0] + ' ' + item[1]));
      const questionBag = new Set(tokens(item[0]));
      let score = 0;
      for (const t of qt) { if (questionBag.has(t)) score += 2; else if (bag.has(t)) score += 1; }
      if (!best || score > best.score) best = { score, item };
    }
    if (best && best.score >= 3) {
      return reply('from the faq', best.item[1], [goto('/contact', 'Ask us directly')], shorten(best.item[1], 140));
    }
  }

  return { ...reply('not sure', "i don't have a good answer for that, and i'd rather say so than guess. try 'show me your work', 'what do you charge', or ask a person.", [{ type: 'brief', label: 'Start a quick brief' }, goto('/contact', 'Ask a person')]), fallback: true };
}
