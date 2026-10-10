// One structural registry for the whole site. Neo and Trust are two skins on the same pages:
// WHAT exists (nav items, home sections, page sections, footer links) is declared here once.
// HOW it looks, and the voice of the copy, is what each theme supplies.
//
// To change the site for both themes, edit this file or DATA. To make something differ per theme,
// give it a `{ neo, trust }` value (see `Voiced`). Never add a page or section to one theme only:
// the `Record<Block, ...>` renderer maps in each theme fail to compile until both implement it.
import { DATA } from './data';

export type Theme = 'neo' | 'trust';
export type Voiced<T = string> = { neo: T; trust: T };
export const voiced = <T,>(value: Voiced<T>, theme: Theme): T => value[theme];

/* ─── Navigation ─────────────────────────────────────────────────── */

export interface NavEntry {
  page: string;
  label: Voiced;
  blurb: Voiced;
}

// Same entries, same order, in both themes. Only the wording differs.
export const NAV: NavEntry[] = [
  { page: 'academy', label: { neo: 'Academy', trust: 'Talent Programmes' }, blurb: { neo: 'Learn fast. Build proof. Get placed.', trust: 'Talent built cohort by cohort, with reported placement readiness.' } },
  { page: 'marketing', label: { neo: 'Marketing', trust: 'Digital Solutions' }, blurb: { neo: 'Brand, web and demand that moves.', trust: 'Market infrastructure: positioning, build, launch, optimise.' } },
  { page: 'labs', label: { neo: 'Labs', trust: 'Product Studio' }, blurb: { neo: 'Software and AI that ships.', trust: 'Software that solves the problem: SaaS, products and applied AI.' } },
  { page: 'customers', label: { neo: 'Proof', trust: 'Delivery Proof' }, blurb: { neo: 'Live client work. Click any of it.', trust: 'Verified client outcomes, indexed by engagement type.' } },
  { page: 'blog', label: { neo: 'Blog', trust: 'Blog' }, blurb: { neo: 'Notes from the build.', trust: 'Practical notes from the team that builds.' } },
  { page: 'company', label: { neo: 'About', trust: 'About' }, blurb: { neo: 'Who we are, and what we have shipped.', trust: 'The company, its directors and how it operates.' } },
];

// Contact is always visible as the primary action, in the bar and in the mobile menu.
export const CONTACT_ENTRY: NavEntry = {
  page: 'contact',
  label: { neo: 'Contact us', trust: 'Contact us' },
  blurb: { neo: 'Tell us what you are building.', trust: 'Start a scoped engagement with a named owner.' },
};

export const navLabel = (page: string, theme: Theme): string | undefined =>
  [...NAV, CONTACT_ENTRY].find((entry) => entry.page === page)?.label[theme];

/* ─── Page flows ─────────────────────────────────────────────────── */
// Each flow is the ordered list of sections a page shows. Themes render each block their own way
// (typed as Record<Block, ...>), but cannot add, drop or reorder blocks.

export const HOME_FLOW = ['hero', 'divisions', 'manifesto', 'work', 'capabilities', 'standards', 'insights', 'faqs', 'cta'] as const;
export type HomeBlock = (typeof HOME_FLOW)[number];

export const ABOUT_FLOW = ['hero', 'story', 'how', 'milestones', 'people', 'facts', 'principles', 'standards', 'faqs', 'cta'] as const;
export type AboutBlock = (typeof ABOUT_FLOW)[number];

export const PROOF_FLOW = ['hero', 'builds', 'cta'] as const;
export type ProofBlock = (typeof PROOF_FLOW)[number];

// Labs overview: one narrative, mapped. Problems point to packages, the layer map points to modules,
// modules point to deliverables, stages point to outputs, proof points back to layers and modules.
export const LABS_FLOW = ['problems', 'map', 'modules', 'specialisms', 'stages', 'proof', 'products', 'engage', 'faqs', 'cta'] as const;
export type LabsBlock = (typeof LABS_FLOW)[number];

// Marketing is one scrolling page. Its three service lines are in-page anchors (#presence, #visibility,
// #performance), not separate routes: old /marketing/<line> URLs redirect to the anchor (next.config.mjs).
export const MARKETING_FLOW = ['hero', 'story', 'phases', 'tracks', 'starts', 'who', 'proof', 'faqs', 'ask'] as const;
export type MarketingBlock = (typeof MARKETING_FLOW)[number];
export const MARKETING_TRACKS = ['presence', 'visibility', 'performance'] as const;
export type MarketingTrack = (typeof MARKETING_TRACKS)[number];

/* ─── Footer ─────────────────────────────────────────────────────── */

export interface FooterLink { label: Voiced; page: string; detail?: string; anchor?: string }
export interface FooterColumn { label: Voiced; links: FooterLink[] }

export const FOOTER_BLURB: Voiced = {
  neo: 'Academy, Digital Marketing and Labs. Three teams, one studio in Visakhapatnam.',
  trust: 'Academy, Digital Solutions and Product Studio. Three specialist teams, one firm in Visakhapatnam.',
};

// Footer grid is brand + these columns + Legal. Keep FOOTER_COLUMNS.length === 2 so the CSS
 // `minmax(0, 2fr) repeat(3, minmax(0, 1fr))` layout stays a clean 4-slot row.
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    label: { neo: 'Divisions', trust: 'Teams' },
    links: NAV.slice(0, 3).map((entry) => ({ label: entry.label, page: entry.page })),
  },
  {
    label: { neo: 'Company', trust: 'Company' },
    links: [
      { label: NAV[3]!.label, page: 'customers' },
      { label: NAV[4]!.label, page: 'blog' },
      { label: NAV[5]!.label, page: 'company' },
      { label: { neo: 'Internships', trust: 'Internships' }, page: 'academy', detail: 'internships' },
      { label: { neo: 'Website design', trust: 'Website design' }, page: 'marketing', anchor: 'presence' },
      { label: CONTACT_ENTRY.label, page: 'contact' },
    ],
  },
];

export const LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy-policy.html' },
  { label: 'Terms', href: '/terms-of-service.html' },
  { label: 'Cookies', href: '/cookie-policy.html' },
  { label: 'Data deletion', href: '/data-deletion.html' },
] as const;

/* ─── Shared helpers ─────────────────────────────────────────────── */

export const divisionLabel = (id: string, theme: Theme) => navLabel(id, theme) ?? id;
export const DIVISIONS = Object.values(DATA.sections);
