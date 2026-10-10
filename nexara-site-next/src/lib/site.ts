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
  { page: 'home', label: { neo: 'Home', trust: 'Home' }, blurb: { neo: 'One firm. Three teams.', trust: 'One firm, three teams, one operating standard.' } },
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

// Labs overview: catalogue first (proof → products), then how we build (layers → capabilities → stages),
// then how to engage. Each client or product is listed once; later blocks link back instead of re-listing.
export const LABS_FLOW = ['proof', 'products', 'map', 'modules', 'stages', 'engage', 'faqs', 'cta'] as const;
export type LabsBlock = (typeof LABS_FLOW)[number];

// Bottom finder on Labs overview. Each segment spans a run of blocks: capabilities covers map → stages,
// engage covers packages → FAQ, so the active label is always the band in view.
export const LABS_FINDER_SEGS = ['proof', 'products', 'capabilities', 'engage'] as const;
export type LabsFinderSeg = (typeof LABS_FINDER_SEGS)[number];

// Labs detail tabs: capability subpages + product slugs. Shared by SubNav, routes and LabsPage.
export type LabsTabKind = 'capability' | 'product';
export interface LabsTab { slug: string; title: string; kind: LabsTabKind }

export const labsCapabilityTabs = (): LabsTab[] =>
  DATA.sections.labs.subpages.map((p) => ({ slug: p.slug, title: p.title, kind: 'capability' as const }));

export const labsProductTabs = (): LabsTab[] =>
  DATA.sections.labs.products.map((p) => ({
    slug: p.id,
    // Short chrome label for the live Academy & Sports (Happy Forms) product.
    title: p.id === 'forms' ? 'Registration' : p.name,
    kind: 'product' as const,
  }));

export const labsTabs = (): LabsTab[] => [...labsCapabilityTabs(), ...labsProductTabs()];

export const labsTabBySlug = (slug: string | null | undefined): LabsTab | null =>
  slug ? labsTabs().find((t) => t.slug === slug) ?? null : null;

// Marketing is one scrolling page. Its three service lines are in-page anchors (#presence, #visibility,
// #performance), not separate routes: old /marketing/<line> URLs redirect to the anchor (next.config.mjs).
export const MARKETING_FLOW = ['hero', 'story', 'phases', 'tracks', 'starts', 'who', 'proof', 'faqs', 'ask'] as const;
export type MarketingBlock = (typeof MARKETING_FLOW)[number];
export const MARKETING_TRACKS = ['presence', 'visibility', 'performance'] as const;
export type MarketingTrack = (typeof MARKETING_TRACKS)[number];

// Academy is one scrolling page (Proof Portfolio). Tracks / internships / placements are
// in-page anchors; old detail URLs redirect (next.config.mjs). Distinct from MARKETING_FLOW.
export const ACADEMY_FLOW = ['hero', 'thesis', 'runway', 'lanes', 'fit', 'proof', 'faqs', 'ask'] as const;
export type AcademyBlock = (typeof ACADEMY_FLOW)[number];
export const ACADEMY_TRACKS = ['tracks', 'internships', 'placements'] as const;
export type AcademyTrack = (typeof ACADEMY_TRACKS)[number];
// Semantic track roles for colour (learn / build / place) map onto the three anchors above.
export const ACADEMY_TRACK_ROLES = ['learn', 'build', 'place'] as const;
export type AcademyTrackRole = (typeof ACADEMY_TRACK_ROLES)[number];

/* ─── Page finder ────────────────────────────────────────────────── */
// The floating bottom section bar (shared/PageFinder.tsx). Every page mounts one: it slides in once the
// hero (#overview) scrolls away and hides at the closing ask card or the footer. These are the in-page
// section ids each page lists; labels live in COPY.finder. Marketing, Academy and Labs list their own
// tracks (MARKETING_TRACKS, ACADEMY_TRACKS, LABS_FINDER_SEGS).
export const PAGE_FINDER = {
  home: ['divisions', 'work', 'insights', 'faqs'],
  company: ['story', 'how', 'people', 'faqs'],
  customers: ['builds'],
  contact: ['details', 'channels', 'brief', 'faqs'],
  blog: ['posts'],
  post: ['article', 'more'],
} as const;
export type FinderPage = keyof typeof PAGE_FINDER;

/* ─── Footer ─────────────────────────────────────────────────────── */

export interface FooterLink { label: Voiced; page: string; detail?: string; anchor?: string; sub?: boolean }
export interface FooterColumn { label: Voiced; links: FooterLink[] }

export const FOOTER_BLURB: Voiced = {
  neo: 'Academy, Digital Marketing and Labs. Three teams, one studio in Visakhapatnam.',
  trust: 'Academy, Digital Solutions and Product Studio. Three specialist teams, one firm in Visakhapatnam.',
};

const navLink = (page: string): FooterLink => {
  const entry = [...NAV, CONTACT_ENTRY].find((e) => e.page === page);
  if (!entry) throw new Error(`Footer link to unknown nav page: ${page}`);
  return { label: entry.label, page };
};
const same = (label: string): Voiced => ({ neo: label, trust: label });

// Footer grid is brand + these columns + Legal. Keep FOOTER_COLUMNS.length === 2 so the CSS
// `minmax(0, 2.2fr) repeat(3, minmax(0, 1fr))` layout stays a clean 4-slot row.
// Nav-backed links are looked up by page, never by NAV index, so labels always match their href.
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    label: { neo: 'Divisions', trust: 'Teams' },
    links: [
      navLink('academy'),
      { label: same('Internships'), page: 'academy', anchor: 'internships', sub: true },
      navLink('marketing'),
      { label: same('Website design'), page: 'marketing', anchor: 'presence', sub: true },
      navLink('labs'),
      { label: same('Products & SaaS'), page: 'labs', detail: 'products', sub: true },
      { label: same('Nexara Voice'), page: 'labs', detail: 'voice', sub: true },
      { label: same('AI & Automation'), page: 'labs', detail: 'ai-automation', sub: true },
    ],
  },
  {
    label: { neo: 'Company', trust: 'Company' },
    links: [navLink('home'), navLink('customers'), navLink('blog'), navLink('company'), navLink('contact')],
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
