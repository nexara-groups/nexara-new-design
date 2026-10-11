// Neo's quick brief: a short guided Q&A that ends in a message the visitor sends
// themselves, by WhatsApp or email. Nothing is stored or transmitted by the site:
// the answers only live in this object until the visitor opens one of the two
// links, and sending is a deliberate tap in their own app.

export type BriefStep = 'need' | 'who' | 'timing' | 'name' | 'phone' | 'window' | 'review';

export interface BriefState {
  step: BriefStep;
  data: Partial<Record<Exclude<BriefStep, 'review'>, string>>;
}

export interface BriefConfig {
  /** Digits only, with country code, e.g. 919257535757 */
  whatsappNumber: string;
  email: string;
}

export interface BriefTurn {
  /** null once cancelled. */
  state: BriefState | null;
  line: string;
  chips: string[];
  placeholder: string;
  /** Present on the review step. */
  done?: { text: string; whatsapp: string; mailto: string };
  cancelled?: boolean;
  /** The last answer was rejected; same step is asked again. */
  invalid?: boolean;
  /** The chips are toggles: the visitor can pick several, then continue. */
  multi?: boolean;
  /** A chip that clears the other picks (e.g. "Not sure yet"). */
  exclusive?: string;
}

const ORDER: Exclude<BriefStep, 'review'>[] = ['need', 'who', 'timing', 'name', 'phone', 'window'];

const PROMPTS: Record<Exclude<BriefStep, 'review'>, { line: string; chips: string[]; placeholder: string }> = {
  need: {
    line: "quick brief, six short questions. nothing is sent until you tap send at the end. what do you need? pick everything that applies.",
    chips: ['A website', 'Software or SaaS', 'Marketing', 'Training or internships', 'Not sure yet'],
    placeholder: 'or type it in your own words',
  },
  who: {
    line: "who is it for? your business or organisation name, or say 'myself' if it's personal.",
    chips: [],
    placeholder: 'e.g. Sri Engineering Works',
  },
  timing: {
    line: 'when do you want to start?',
    chips: ['This month', 'In 1 to 3 months', 'Just exploring'],
    placeholder: 'or type a date',
  },
  name: { line: "what's your name?", chips: [], placeholder: 'your name' },
  phone: {
    line: 'best phone number to reach you? WhatsApp is fine.',
    chips: [],
    placeholder: '10-digit number, or with +91',
  },
  window: {
    line: 'when should we call you back? times are IST.',
    chips: ['Morning', 'Afternoon', 'Evening', 'Any time'],
    placeholder: 'or type a time',
  },
};

const LABELS: Record<Exclude<BriefStep, 'review'>, string> = {
  need: 'Need',
  who: 'For',
  timing: 'Start',
  name: 'Name',
  phone: 'Phone',
  window: 'Best time to call (IST)',
};

const clean = (value: string): string => value.replace(/\s+/g, ' ').trim().slice(0, 160);
const digits = (value: string): string => value.replace(/\D/g, '');

export function briefText(data: BriefState['data']): string {
  const lines = ORDER.map((step) => `${LABELS[step]}: ${data[step] ?? '-'}`);
  return ['Hi Nexara, quick brief from the website:', ...lines].join('\n');
}

export function briefLinks(text: string, cfg: BriefConfig): { whatsapp: string; mailto: string } {
  return {
    whatsapp: `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(text)}`,
    mailto: `mailto:${cfg.email}?subject=${encodeURIComponent('Project enquiry from nexaragroups.com')}&body=${encodeURIComponent(text)}`,
  };
}

const ask = (step: Exclude<BriefStep, 'review'>, state: BriefState, prefix = ''): BriefTurn => ({
  state: { ...state, step },
  line: prefix + PROMPTS[step].line,
  chips: PROMPTS[step].chips,
  placeholder: PROMPTS[step].placeholder,
  ...(step === 'need' ? { multi: true, exclusive: 'Not sure yet' } : {}),
});

export function startBrief(): BriefTurn {
  return ask('need', { step: 'need', data: {} });
}

export function nextBrief(state: BriefState, input: string, cfg: BriefConfig): BriefTurn {
  const text = clean(input);
  const lower = text.toLowerCase();

  if (/^(cancel|stop|quit|exit|never ?mind|forget it)$/.test(lower)) {
    return { state: null, line: "no problem, nothing was sent. ask me anything else, or start again whenever.", chips: [], placeholder: 'ask me anything', cancelled: true };
  }

  if (state.step === 'review') {
    if (/^(edit|start over|restart|again|redo)$/.test(lower)) return startBrief();
    return reviewTurn(state, cfg);
  }

  if (lower === 'back') {
    const index = ORDER.indexOf(state.step);
    return index > 0 ? ask(ORDER[index - 1]!, state) : ask('need', state);
  }

  const step = state.step;
  let value = text;

  if (!value) return { ...ask(step, state), invalid: true, line: PROMPTS[step].line };

  if (step === 'name' && value.length < 2) {
    return { ...ask(step, state), invalid: true, line: "that looks too short. what's your name?" };
  }
  if (step === 'phone') {
    const d = digits(value);
    const local = d.length === 12 && d.startsWith('91') ? d.slice(2) : d;
    if (local.length < 10 || local.length > 11) {
      return { ...ask(step, state), invalid: true, line: "that doesn't look like a phone number. try 10 digits, like 98xxxxxxxx." };
    }
    value = `+91 ${local}`;
  }

  const data = { ...state.data, [step]: value };
  const index = ORDER.indexOf(step);
  const following = ORDER[index + 1];
  if (following) return ask(following, { step: following, data });
  return reviewTurn({ step: 'review', data }, cfg);
}

function reviewTurn(state: BriefState, cfg: BriefConfig): BriefTurn {
  const text = briefText(state.data);
  const links = briefLinks(text, cfg);
  return {
    state: { step: 'review', data: state.data },
    line: "here's your brief. it's only a draft until you send it. pick WhatsApp or email and your app opens with this message ready.",
    chips: ['Start over'],
    placeholder: 'ask me anything',
    done: { text, ...links },
  };
}
